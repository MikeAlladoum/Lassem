const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const hre = require("hardhat");
const { ethers } = hre;

describe("Simple Test", function () {
  async function deployFixture() {
    const [owner, other] = await ethers.getSigners();
    return { owner, other };
  }

  it("should have signers", async function () {
    const { owner } = await loadFixture(deployFixture);
    expect(owner.address).to.exist;
  });
});
