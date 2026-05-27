#!/usr/bin/env node

/**
 * Blockchain Event Listener Startup Script
 * Lance le service d'écoute des événements blockchain
 * 
 * Usage:
 *   node scripts/start-listener.js
 *   npm run listener
 */

require("dotenv").config({ path: ".env.local" });

const { initializeBlockchainListeners } = require("../lib/blockchain-listener");

async function main() {
  console.log("====================================");
  console.log("🔗 BLOCKCHAIN EVENT LISTENER");
  console.log("====================================\n");

  console.log(`Network: ${process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "Not configured"}`);
  console.log(`Database: ${process.env.DATABASE_URL ? "Connected" : "Not configured"}\n`);

  try {
    await initializeBlockchainListeners();
    console.log("\n✅ Blockchain listeners are running");
    console.log("Press CTRL+C to stop\n");

    // Garder le processus actif
    setInterval(() => {
      // Keep-alive
    }, 30000);
  } catch (error) {
    console.error("❌ Failed to start blockchain listeners:", error);
    process.exit(1);
  }
}

main();
