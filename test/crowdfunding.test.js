/**
 * Smart Contract Tests for Crowdfunding DApp
 * Using Hardhat + Chai
 * 
 * Run with: npx hardhat test
 */

const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;

describe("CrowdfundingCampaign", function () {
  let campaign;
  let owner;
  let contributor1;
  let contributor2;
  let addrs;
  let GOAL_AMOUNT;
  let deadline;

  beforeEach(async function () {
    // Récupérer les signataires de test
    [owner, contributor1, contributor2, ...addrs] = await ethers.getSigners();

    // Définir les paramètres
    GOAL_AMOUNT = ethers.parseEther("10"); // 10 ETH
    
    // Définir la deadline à 1 semaine dans le futur
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    deadline = block.timestamp + 7 * 24 * 60 * 60; // 1 week

    // Déployer le contrat
    const CrowdfundingCampaign = await ethers.getContractFactory("CrowdfundingCampaign");
    campaign = await CrowdfundingCampaign.deploy(owner.address, GOAL_AMOUNT, deadline);
    await campaign.waitForDeployment();
  });

  describe("Campaign Creation", function () {
    it("should deploy with correct parameters", async function () {
      expect(await campaign.owner()).to.equal(owner.address);
      expect(await campaign.goalAmount()).to.equal(GOAL_AMOUNT);
      expect(await campaign.deadline()).to.equal(deadline);
      expect(await campaign.currentAmount()).to.equal(0);
    });

    it("should initialize with cancelled = false", async function () {
      expect(await campaign.cancelled()).to.equal(false);
    });

    it("should have owner set to deployer", async function () {
      expect(await campaign.owner()).to.equal(owner.address);
    });
  });

  describe("Contribution", function () {
    it("should accept valid contribution", async function () {
      const amount = hre.ethers.parseEther("1");

      // Émettre l'événement ContributionReceived
      await expect(campaign.connect(contributor1).contribute({ value: amount }))
        .to.emit(campaign, "ContributionReceived")
        .withArgs(contributor1.address, amount, amount);

      // Vérifier l'état
      expect(await campaign.currentAmount()).to.equal(amount);
      expect(await campaign.contributions(contributor1.address)).to.equal(amount);
    });

    it("should reject contribution with zero amount", async function () {
      await expect(campaign.connect(contributor1).contribute({ value: 0 })).to.be.revertedWith(
        "Amount must be > 0"
      );
    });

    it("should prevent owner from contributing", async function () {
      const amount = hre.ethers.parseEther("1");
      await expect(campaign.connect(owner).contribute({ value: amount })).to.be.revertedWith(
        "Owner cannot contribute"
      );
    });

    it("should allow multiple contributions from same contributor", async function () {
      const amount1 = hre.ethers.parseEther("1");
      const amount2 = hre.ethers.parseEther("2");

      await campaign.connect(contributor1).contribute({ value: amount1 });
      await campaign.connect(contributor1).contribute({ value: amount2 });

      expect(await campaign.currentAmount()).to.equal(amount1 + amount2);
      expect(await campaign.contributions(contributor1.address)).to.equal(amount1 + amount2);
    });

    it("should track multiple contributors", async function () {
      const amount = hre.ethers.parseEther("1");

      await campaign.connect(contributor1).contribute({ value: amount });
      await campaign.connect(contributor2).contribute({ value: amount });

      expect(await campaign.contributions(contributor1.address)).to.equal(amount);
      expect(await campaign.contributions(contributor2.address)).to.equal(amount);
      expect(await campaign.currentAmount()).to.equal(hre.ethers.parseEther("2"));
    });

    it("should reject contribution after deadline", async function () {
      // Avancer le temps après la deadline
      await hre.ethers.provider.send("hardhat_mine", ["0x" + (7 * 24 * 60 * 60 + 100).toString(16)]);

      const amount = hre.ethers.parseEther("1");
      await expect(campaign.connect(contributor1).contribute({ value: amount })).to.be.reverted;
    });
  });

  describe("Withdrawal", function () {
    beforeEach(async function () {
      // Faire des contributions pour atteindre l'objectif
      const amount = hre.ethers.parseEther("5");
      await campaign.connect(contributor1).contribute({ value: amount });
      await campaign.connect(contributor2).contribute({ value: amount });
    });

    it("should allow owner to withdraw after goal reached", async function () {
      const amount = hre.ethers.parseEther("10");

      // Avancer le temps après la deadline
      await hre.ethers.provider.send("hardhat_mine", ["0x" + (7 * 24 * 60 * 60 + 100).toString(16)]);

      const balanceBefore = await hre.ethers.provider.getBalance(owner.address);

      await expect(campaign.connect(owner).withdrawFunds())
        .to.emit(campaign, "FundsWithdrawn")
        .withArgs(owner.address, amount);

      expect(await campaign.withdrawn()).to.equal(true);
    });

    it("should reject withdrawal before deadline passed", async function () {
      await expect(campaign.connect(owner).withdrawFunds()).to.be.revertedWith(
        "Deadline not passed"
      );
    });

    it("should reject withdrawal if goal not reached", async function () {
      // Avancer le temps après la deadline
      await hre.ethers.provider.send("hardhat_mine", ["0x" + (7 * 24 * 60 * 60 + 100).toString(16)]);

      // Résetter pour un test avec montant insuffisant
      const CrowdfundingCampaign = await hre.ethers.getContractFactory("CrowdfundingCampaign");
      const smallGoalCampaign = await CrowdfundingCampaign.deploy(
        owner.address,
        hre.ethers.parseEther("100"),
        deadline
      );

      await smallGoalCampaign.connect(contributor1).contribute({ value: hre.ethers.parseEther("1") });

      // Avancer le temps
      await hre.ethers.provider.send("hardhat_mine", ["0x" + (7 * 24 * 60 * 60 + 100).toString(16)]);

      await expect(smallGoalCampaign.connect(owner).withdrawFunds()).to.be.revertedWith(
        "Goal not reached"
      );
    });

    it("should reject withdrawal from non-owner", async function () {
      await hre.ethers.provider.send("hardhat_mine", ["0x" + (7 * 24 * 60 * 60 + 100).toString(16)]);

      await expect(campaign.connect(contributor1).withdrawFunds()).to.be.revertedWith(
        "Not owner"
      );
    });

    it("should prevent double withdrawal", async function () {
      await hre.ethers.provider.send("hardhat_mine", ["0x" + (7 * 24 * 60 * 60 + 100).toString(16)]);

      await campaign.connect(owner).withdrawFunds();

      await expect(campaign.connect(owner).withdrawFunds()).to.be.revertedWith(
        "Already withdrawn"
      );
    });
  });

  describe("Refund (Individual)", function () {
    beforeEach(async function () {
      const amount = hre.ethers.parseEther("2");
      await campaign.connect(contributor1).contribute({ value: amount });
      await campaign.connect(contributor2).contribute({ value: amount });
    });

    it("should allow contributor to refund after deadline if goal not reached", async function () {
      // Avancer le temps après la deadline
      await hre.ethers.provider.send("hardhat_mine", ["0x" + (7 * 24 * 60 * 60 + 100).toString(16)]);

      const amount = hre.ethers.parseEther("2");

      await expect(campaign.connect(contributor1).refund())
        .to.emit(campaign, "RefundIssued")
        .withArgs(contributor1.address, amount);

      expect(await campaign.contributions(contributor1.address)).to.equal(0);
    });

    it("should reject refund before deadline", async function () {
      await expect(campaign.connect(contributor1).refund()).to.be.revertedWith(
        "Deadline must have passed"
      );
    });

    it("should reject refund if goal was reached", async function () {
      // Ajouter plus de contributions pour atteindre l'objectif
      const amount = hre.ethers.parseEther("6");
      await campaign.connect(addrs[0]).contribute({ value: amount });

      await hre.ethers.provider.send("hardhat_mine", ["0x" + (7 * 24 * 60 * 60 + 100).toString(16)]);

      await expect(campaign.connect(contributor1).refund()).to.be.revertedWith(
        "Goal was reached, no refund"
      );
    });

    it("should reject refund for non-contributor", async function () {
      await hre.ethers.provider.send("hardhat_mine", ["0x" + (7 * 24 * 60 * 60 + 100).toString(16)]);

      await expect(campaign.connect(addrs[0]).refund()).to.be.revertedWith("No contribution found");
    });

    it("should prevent double refund", async function () {
      await hre.ethers.provider.send("hardhat_mine", ["0x" + (7 * 24 * 60 * 60 + 100).toString(16)]);

      await campaign.connect(contributor1).refund();

      await expect(campaign.connect(contributor1).refund()).to.be.revertedWith(
        "No contribution found"
      );
    });
  });

  describe("RefundAll", function () {
    beforeEach(async function () {
      const amount = hre.ethers.parseEther("2");
      await campaign.connect(contributor1).contribute({ value: amount });
      await campaign.connect(contributor2).contribute({ value: amount });
    });

    it("should refund all contributors after deadline if goal not reached", async function () {
      await hre.ethers.provider.send("hardhat_mine", ["0x" + (7 * 24 * 60 * 60 + 100).toString(16)]);

      await campaign.connect(owner).refundAll();

      expect(await campaign.contributions(contributor1.address)).to.equal(0);
      expect(await campaign.contributions(contributor2.address)).to.equal(0);
      expect(await campaign.currentAmount()).to.equal(0);
    });

    it("should reject refundAll before deadline", async function () {
      await expect(campaign.connect(owner).refundAll()).to.be.revertedWith(
        "Deadline must have passed"
      );
    });

    it("should reject refundAll from non-owner", async function () {
      await hre.ethers.provider.send("hardhat_mine", ["0x" + (7 * 24 * 60 * 60 + 100).toString(16)]);

      await expect(campaign.connect(contributor1).refundAll()).to.be.revertedWith(
        "Only owner can refund all"
      );
    });

    it("should reject refundAll if goal was reached", async function () {
      const amount = hre.ethers.parseEther("6");
      await campaign.connect(addrs[0]).contribute({ value: amount });

      await hre.ethers.provider.send("hardhat_mine", ["0x" + (7 * 24 * 60 * 60 + 100).toString(16)]);

      await expect(campaign.connect(owner).refundAll()).to.be.revertedWith(
        "Goal was reached, no refund"
      );
    });
  });

  describe("Campaign Cancellation", function () {
    beforeEach(async function () {
      const amount = hre.ethers.parseEther("2");
      await campaign.connect(contributor1).contribute({ value: amount });
      await campaign.connect(contributor2).contribute({ value: amount });
    });

    it("should allow owner to cancel before deadline", async function () {
      await expect(campaign.connect(owner).cancel())
        .to.emit(campaign, "CampaignCancelled");

      expect(await campaign.cancelled()).to.equal(true);
    });

    it("should reject cancel from non-owner", async function () {
      await expect(campaign.connect(contributor1).cancel()).to.be.revertedWith(
        "Only owner can cancel"
      );
    });

    it("should reject cancel after deadline", async function () {
      await hre.ethers.provider.send("hardhat_mine", ["0x" + (7 * 24 * 60 * 60 + 100).toString(16)]);

      await expect(campaign.connect(owner).cancel()).to.be.revertedWith(
        "Cannot cancel after deadline"
      );
    });

    it("should allow refund after cancellation", async function () {
      await campaign.connect(owner).cancel();

      const amount = hre.ethers.parseEther("2");
      await expect(campaign.connect(contributor1).refund())
        .to.emit(campaign, "RefundIssued")
        .withArgs(contributor1.address, amount);
    });
  });

  describe("Edge Cases", function () {
    it("should handle large contributions", async function () {
      const largeAmount = hre.ethers.parseEther("1000");
      await campaign.connect(contributor1).contribute({ value: largeAmount });

      expect(await campaign.currentAmount()).to.equal(largeAmount);
    });

    it("should maintain accurate balance with mixed amounts", async function () {
      const amounts = [
        hre.ethers.parseEther("1"),
        hre.ethers.parseEther("2.5"),
        hre.ethers.parseEther("0.123"),
      ];

      for (let i = 0; i < amounts.length; i++) {
        await campaign.connect(addrs[i]).contribute({ value: amounts[i] });
      }

      let expected = hre.ethers.parseEther("0");
      for (const amount of amounts) {
        expected += amount;
      }

      expect(await campaign.currentAmount()).to.equal(expected);
    });

    it("should handle exact goal amount", async function () {
      const exactAmount = hre.ethers.parseEther("10");
      await campaign.connect(contributor1).contribute({ value: exactAmount });

      expect(await campaign.currentAmount()).to.equal(GOAL_AMOUNT);
    });
  });
});

describe("CrowdfundingFactory", function () {
  let factory;
  let owner;
  let creator;
  let addrs;

  beforeEach(async function () {
    [owner, creator, ...addrs] = await ethers.getSigners();

    const CrowdfundingFactory = await ethers.getContractFactory("CrowdfundingFactory");
    factory = await CrowdfundingFactory.deploy();
    await factory.waitForDeployment();
  });

  describe("Campaign Creation", function () {
    it("should create a new campaign", async function () {
      const goalAmount = hre.ethers.parseEther("5");
      const blockNum = await hre.ethers.provider.getBlockNumber();
      const block = await hre.ethers.provider.getBlock(blockNum);
      const deadline = block.timestamp + 7 * 24 * 60 * 60;

      const tx = await factory.connect(creator).createCampaign(goalAmount, deadline);

      await expect(tx).to.emit(factory, "CampaignCreated");

      const campaigns = await factory.getCampaignsByCreator(creator.address);
      expect(campaigns.length).to.equal(1);
    });

    it("should track multiple campaigns per creator", async function () {
      const goalAmount = hre.ethers.parseEther("5");
      const blockNum = await hre.ethers.provider.getBlockNumber();
      const block = await hre.ethers.provider.getBlock(blockNum);
      const deadline = block.timestamp + 7 * 24 * 60 * 60;

      for (let i = 0; i < 3; i++) {
        await factory.connect(creator).createCampaign(goalAmount, deadline);
      }

      const campaigns = await factory.getCampaignsByCreator(creator.address);
      expect(campaigns.length).to.equal(3);
    });

    it("should track campaigns across multiple creators", async function () {
      const goalAmount = hre.ethers.parseEther("5");
      const blockNum = await hre.ethers.provider.getBlockNumber();
      const block = await hre.ethers.provider.getBlock(blockNum);
      const deadline = block.timestamp + 7 * 24 * 60 * 60;

      await factory.connect(creator).createCampaign(goalAmount, deadline);
      await factory.connect(addrs[0]).createCampaign(goalAmount, deadline);

      const campaigns1 = await factory.getCampaignsByCreator(creator.address);
      const campaigns2 = await factory.getCampaignsByCreator(addrs[0].address);

      expect(campaigns1.length).to.equal(1);
      expect(campaigns2.length).to.equal(1);
    });

    it("should return valid campaign addresses", async function () {
      const goalAmount = hre.ethers.parseEther("5");
      const blockNum = await hre.ethers.provider.getBlockNumber();
      const block = await hre.ethers.provider.getBlock(blockNum);
      const deadline = block.timestamp + 7 * 24 * 60 * 60;

      await factory.connect(creator).createCampaign(goalAmount, deadline);
      const campaigns = await factory.getCampaignsByCreator(creator.address);

      expect(campaigns[0]).to.match(/^0x[a-fA-F0-9]{40}$/); // Valid address format
    });
  });
});
