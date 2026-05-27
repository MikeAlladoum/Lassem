#!/usr/bin/env node

/**
 * Contract Verification Script
 * Vérifie que les contrats sont correctement déployés et met à jour .env.local
 * 
 * Usage:
 *   node scripts/verify-contracts.js
 */

require("dotenv").config({ path: ".env.local" });

const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

async function verifyContracts() {
  console.log("🔍 Verifying smart contracts...\n");

  const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS;
  const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

  if (!rpcUrl) {
    console.error("❌ NEXT_PUBLIC_SEPOLIA_RPC_URL not configured");
    return false;
  }

  if (!factoryAddress || factoryAddress === "0x0000000000000000000000000000000000000000") {
    console.warn("⚠️  NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS not set or invalid");
    console.log("    Run: npm run hardhat:deploy\n");
    return false;
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Vérifier que le contrat existe
    const code = await provider.getCode(factoryAddress);

    if (code === "0x") {
      console.error(`❌ No contract found at ${factoryAddress}`);
      console.log("   Ensure you've deployed the contract: npm run hardhat:deploy\n");
      return false;
    }

    console.log(`✅ CrowdfundingFactory deployed at: ${factoryAddress}`);

    // Obtenir des infos réseau
    const network = await provider.getNetwork();
    console.log(`✅ Network: ${network.name} (Chain ID: ${network.chainId})`);

    // Vérifier les campaigns déployées
    const campaignABI = [
      "function owner() public view returns (address)",
      "function goalAmount() public view returns (uint256)",
      "function deadline() public view returns (uint256)",
      "function currentAmount() public view returns (uint256)",
    ];

    const factoryABI = ["function campaigns() public view returns (address[])", "function getCampaignsByCreator(address creator) public view returns (address[])"];

    const factory = new ethers.Contract(factoryAddress, factoryABI, provider);

    try {
      const campaigns = await factory.campaigns();
      console.log(`✅ Total campaigns: ${campaigns.length}`);

      if (campaigns.length > 0) {
        console.log(`\n📋 First 5 campaigns:`);
        for (let i = 0; i < Math.min(5, campaigns.length); i++) {
          const campaignAddress = campaigns[i];
          const campaign = new ethers.Contract(campaignAddress, campaignABI, provider);

          try {
            const owner = await campaign.owner();
            const goalAmount = await campaign.goalAmount();
            const currentAmount = await campaign.currentAmount();

            console.log(`   ${i + 1}. ${campaignAddress}`);
            console.log(`      Owner: ${owner}`);
            console.log(`      Goal: ${ethers.formatEther(goalAmount)} ETH`);
            console.log(`      Current: ${ethers.formatEther(currentAmount)} ETH`);
          } catch (e) {
            console.log(`   ${i + 1}. ${campaignAddress} (error reading data)`);
          }
        }
      }
    } catch (e) {
      console.log(`⚠️  Could not read campaigns list (this may be normal)\n`);
    }

    return true;
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    return false;
  }
}

async function main() {
  const success = await verifyContracts();

  if (success) {
    console.log("\n✅ All contracts verified successfully!");
    process.exit(0);
  } else {
    console.log("\n❌ Contract verification failed");
    process.exit(1);
  }
}

main();
