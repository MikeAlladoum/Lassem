/**
 * CRON Job - Remboursement automatique
 * Exécuté toutes les heures pour rembourser les campagnes échouées
 * (deadline dépassée, montant collecté < objectif)
 */

import { ethers } from "ethers";
import { prisma } from "./prisma";

const CAMPAIGN_ABI = ["function refundAll() external"];

async function processAutomaticRefunds() {
  try {
    console.log("[CRON] Starting automatic refund process...");

    const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;

    if (!rpcUrl || !privateKey) {
      console.error("[CRON] Missing RPC URL or PRIVATE_KEY");
      return;
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);

    // Récupérer les campagnes qui doivent être remboursées
    const campaignsToRefund = await prisma.campaign.findMany({
      where: {
        status: "active",
        is_active: true,
        deadline: {
          lt: new Date(), // Deadline dépassée
        },
        // current_amount < goal_amount (check manuel après récupération)
        contract_address: {
          not: null,
        },
      },
      include: {
        contributions: {
          where: { is_active: true },
        },
      },
    });

    console.log(`[CRON] Found ${campaignsToRefund.length} campaigns to process`);

    for (const campaign of campaignsToRefund) {
      // Vérifier que le montant n'a pas atteint l'objectif
      if (campaign.current_amount >= campaign.goal_amount) {
        console.log(
          `[CRON] Campaign ${campaign.id} reached goal, skipping refund`
        );
        continue;
      }

      // Vérifier qu'il y a des contributions à rembourser
      if (campaign.contributions.length === 0) {
        console.log(
          `[CRON] Campaign ${campaign.id} has no contributions, skipping`
        );
        continue;
      }

      try {
        console.log(
          `[CRON] Processing refunds for campaign ${campaign.id}...`
        );

        const contract = new ethers.Contract(
          campaign.contract_address!,
          CAMPAIGN_ABI,
          signer
        );

        // Appeler refundAll() sur le smart contract
        const tx = await contract.refundAll();
        const receipt = await tx.wait();

        if (receipt) {
          // Mettre à jour la campagne
          await prisma.campaign.update({
            where: { id: campaign.id },
            data: {
              status: "failed",
              is_active: false,
            },
          });

          // Créer une notification pour le créateur
          await prisma.notification.create({
            data: {
              user_id: campaign.creator_id,
              type: "system",
              title: "Campagne échouée - Remboursements émis",
              message: `Votre campagne "${campaign.title}" n'a pas atteint l'objectif. Les remboursements ont été émis.`,
              created_by: 1,
            },
          });

          console.log(
            `[CRON] ✅ Refunds processed for campaign ${campaign.id} (tx: ${tx.hash})`
          );
        }
      } catch (error) {
        console.error(
          `[CRON] ❌ Error processing refunds for campaign ${campaign.id}:`,
          error
        );

        // Enregistrer l'erreur en base pour monitoring
        await prisma.blockchainTransaction.create({
          data: {
            tx_hash: `error_${Date.now()}_${campaign.id}`,
            type: "refund",
            from_address: campaign.contract_address!,
            to_address: "0x0000000000000000000000000000000000000000",
            amount: campaign.current_amount,
            status: "failed",
            campaign_id: campaign.id,
            created_by: 1,
          },
        });
      }
    }

    console.log("[CRON] Automatic refund process completed");
  } catch (error) {
    console.error("[CRON] Error in automatic refund process:", error);
  }
}

export { processAutomaticRefunds };
