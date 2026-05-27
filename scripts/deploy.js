const { ethers } = require("hardhat");
const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  const [deployer] = await ethers.getSigners();
  
  console.log("Déploiement avec le compte:", deployer.address);
  
  // Déployer la Factory
  const Factory = await ethers.getContractFactory("CrowdfundingFactory");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  
  const factoryAddress = await factory.getAddress();
  console.log("CrowdfundingFactory déployée à:", factoryAddress);
  
  // Mettre à jour le fichier .env.local automatiquement
  const fs = require("fs");
  let envContent = fs.readFileSync(".env.local", "utf8");
  envContent = envContent.replace(
    /NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS=.*/,
    `NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS="${factoryAddress}"`
  );
  fs.writeFileSync(".env.local", envContent);
  console.log("✅ Adresse du contrat mise à jour dans .env.local");
  
  await prisma.$disconnect();
}

main().catch((e) => { 
  console.error(e); 
  process.exit(1); 
});
