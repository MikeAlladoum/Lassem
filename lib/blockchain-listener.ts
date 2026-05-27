/**
 * Blockchain Event Listener Service
 * Écoute en permanence les événements émis par les smart contracts
 * et met à jour PostgreSQL en conséquence
 */

import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import { Contract } from "ethers";

const prisma = new PrismaClient();

// ABI simplifié pour les événements
const CAMPAIGN_ABI = [
  "event ContributionReceived(address indexed contributor, uint256 amount, uint256 indexed newTotal)",
  "event FundsWithdrawn(address indexed creator, uint256 amount)",
  "event RefundIssued(address indexed contributor, uint256 amount)",
  "event CampaignCancelled()",
];

// Configuration du provider Sepolia
const getProvider = () => {
  const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
  if (!rpcUrl) {
    throw new Error("NEXT_PUBLIC_SEPOLIA_RPC_URL not configured");
  }
  return new ethers.JsonRpcProvider(rpcUrl);
};

/**
 * Démarre le listener pour une campagne spécifique
 */
async function startCampaignListener(
  contractAddress: string,
  campaignId: number
) {
  try {
    const provider = getProvider();
    const contract = new Contract(contractAddress, CAMPAIGN_ABI, provider);

    console.log(`[Listener] Starting listener for campaign ${campaignId} at ${contractAddress}`);

    // ========== EVENT 1: ContributionReceived ==========
    contract.on("ContributionReceived", async (contributor, amount, newTotal, event) => {
      try {
        console.log(
          `[Event] ContributionReceived: ${contributor} contributed, newTotal: ${ethers.formatEther(newTotal)} ETH`
        );

        const txHash = event.transactionHash;

        // 1. Mettre à jour le statut de la contribution à "confirmed"
        const contribution = await prisma.contribution.findUnique({
          where: { tx_hash: txHash },
          include: { campaign: true, contributor: true },
        });

        if (contribution) {
          // Mettre à jour la contribution
          await prisma.contribution.update({
            where: { id: contribution.id },
            data: {
              status: "confirmed",
              block_number: event.blockNumber,
            },
          });

          // 2. Mettre à jour le montant collecté de la campagne
          const campaign = await prisma.campaign.update({
            where: { id: campaignId },
            data: {
              current_amount: parseFloat(ethers.formatEther(newTotal)),
            },
          });

          // 3. Vérifier si l'objectif est atteint
          if (campaign.current_amount >= campaign.goal_amount && campaign.status === "active") {
            await prisma.campaign.update({
              where: { id: campaignId },
              data: { status: "succeeded" },
            });

            // Créer une notification pour le créateur
            await prisma.notification.create({
              data: {
                user_id: campaign.created_by,
                type: "goal_reached",
                title: "Objectif atteint! 🎉",
                message: `Votre campagne "${campaign.title}" a atteint son objectif de ${campaign.goal_amount} ETH!`,
                link: `/campaigns/${campaign.id}`,
              },
            });

            console.log(`[Success] Campaign ${campaignId} goal reached!`);
          }

          // 4. Créer une notification pour le créateur (contribution reçue)
          await prisma.notification.create({
            data: {
              user_id: campaign.created_by,
              type: "contribution",
              title: "Nouvelle contribution! 💰",
              message: `${contribution.contributor.username || contribution.contributor.wallet_address} a contribué ${ethers.formatEther(amount)} ETH`,
              link: `/campaigns/${campaign.id}`,
            },
          });
        }

        // 5. Créer une blockchain_transaction
        await prisma.blockchainTransaction.create({
          data: {
            tx_hash: txHash,
            type: "contribution",
            from_address: contributor,
            to_address: contractAddress,
            amount: parseFloat(ethers.formatEther(amount)),
            status: "success",
            block_number: event.blockNumber,
          },
        });
      } catch (error) {
        console.error("[Error] ContributionReceived handler:", error);
      }
    });

    // ========== EVENT 2: FundsWithdrawn ==========
    contract.on("FundsWithdrawn", async (creator, amount, event) => {
      try {
        console.log(
          `[Event] FundsWithdrawn: ${creator} withdrew ${ethers.formatEther(amount)} ETH`
        );

        // 1. Marquer la campagne comme fermée
        const campaign = await prisma.campaign.update({
          where: { id: campaignId },
          data: {
            status: "closed",
            is_active: false,
          },
        });

        // 2. Créer une blockchain_transaction
        await prisma.blockchainTransaction.create({
          data: {
            tx_hash: event.transactionHash,
            type: "withdrawal",
            from_address: contractAddress,
            to_address: creator,
            amount: parseFloat(ethers.formatEther(amount)),
            status: "success",
            block_number: event.blockNumber,
          },
        });

        // 3. Créer une notification pour le créateur
        await prisma.notification.create({
          data: {
            user_id: campaign.created_by,
            type: "campaign_end",
            title: "Fonds retirés ✅",
            message: `Les fonds de votre campagne (${ethers.formatEther(amount)} ETH) ont été transférés à votre portefeuille.`,
            link: `/campaigns/${campaign.id}`,
          },
        });

        console.log(`[Success] Campaign ${campaignId} funds withdrawn`);
      } catch (error) {
        console.error("[Error] FundsWithdrawn handler:", error);
      }
    });

    // ========== EVENT 3: RefundIssued ==========
    contract.on("RefundIssued", async (contributor, amount, event) => {
      try {
        console.log(
          `[Event] RefundIssued: ${contributor} refunded ${ethers.formatEther(amount)} ETH`
        );

        // 1. Trouver la contribution du contributeur
        const contribution = await prisma.contribution.findFirst({
          where: {
            campaign_id: campaignId,
            contributor: {
              wallet_address: {
                equals: contributor,
                mode: "insensitive",
              },
            },
          },
          include: { contributor: true, campaign: true },
        });

        if (contribution) {
          // 2. Mettre à jour le statut de la contribution à "refunded"
          await prisma.contribution.update({
            where: { id: contribution.id },
            data: {
              status: "refunded",
            },
          });

          // 3. Créer une notification pour le contributeur
          await prisma.notification.create({
            data: {
              user_id: contribution.contributor_id,
              type: "refund",
              title: "Remboursement traité 💸",
              message: `Vous avez reçu ${ethers.formatEther(amount)} ETH de remboursement pour "${contribution.campaign.title}"`,
              link: `/campaigns/${campaignId}`,
            },
          });
        }

        // 4. Créer une blockchain_transaction
        await prisma.blockchainTransaction.create({
          data: {
            tx_hash: event.transactionHash,
            type: "refund",
            from_address: contractAddress,
            to_address: contributor,
            amount: parseFloat(ethers.formatEther(amount)),
            status: "success",
            block_number: event.blockNumber,
          },
        });

        console.log(`[Success] Refund processed for ${contributor}`);
      } catch (error) {
        console.error("[Error] RefundIssued handler:", error);
      }
    });

    // ========== EVENT 4: CampaignCancelled ==========
    contract.on("CampaignCancelled", async (event) => {
      try {
        console.log(`[Event] CampaignCancelled for campaign ${campaignId}`);

        // 1. Mettre à jour la campagne comme annulée
        const campaign = await prisma.campaign.update({
          where: { id: campaignId },
          data: {
            status: "cancelled",
            is_active: false,
          },
        });

        // 2. Créer une notification pour le créateur
        await prisma.notification.create({
          data: {
            user_id: campaign.created_by,
            type: "system",
            title: "Campagne annulée",
            message: `Votre campagne "${campaign.title}" a été annulée.`,
            link: `/campaigns/${campaign.id}`,
          },
        });

        // 3. Créer une blockchain_transaction
        await prisma.blockchainTransaction.create({
          data: {
            tx_hash: event.transactionHash,
            type: "deploy",
            from_address: contractAddress,
            to_address: "0x0000000000000000000000000000000000000000",
            amount: 0,
            status: "success",
            block_number: event.blockNumber,
          },
        });

        console.log(`[Success] Campaign ${campaignId} cancelled`);
      } catch (error) {
        console.error("[Error] CampaignCancelled handler:", error);
      }
    });

    console.log(`[Listener] Campaign ${campaignId} listener initialized`);
  } catch (error) {
    console.error(`[Error] Failed to start listener for campaign ${campaignId}:`, error);
  }
}

/**
 * Démarre tous les listeners pour toutes les campagnes actives
 */
export async function initializeBlockchainListeners() {
  try {
    console.log("[Listener] Initializing blockchain event listeners...");

    // Récupérer toutes les campagnes avec un contract_address
    const activeCampaigns = await prisma.campaign.findMany({
      where: {
        contract_address: {
          not: null,
        },
        is_active: true,
      },
    });

    console.log(`[Listener] Found ${activeCampaigns.length} active campaigns with contracts`);

    // Démarrer un listener pour chaque campagne
    for (const campaign of activeCampaigns) {
      if (campaign.contract_address) {
        await startCampaignListener(campaign.contract_address, campaign.id);
      }
    }

    console.log("[Listener] All blockchain listeners initialized");
  } catch (error) {
    console.error("[Error] Failed to initialize blockchain listeners:", error);
    process.exit(1);
  }
}

/**
 * Arrête tous les listeners
 */
export async function stopBlockchainListeners() {
  console.log("[Listener] Stopping blockchain event listeners...");
  await prisma.$disconnect();
}

// Gestion des signaux pour arrêt gracieux
process.on("SIGTERM", async () => {
  console.log("[Process] SIGTERM received, stopping listeners...");
  await stopBlockchainListeners();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("[Process] SIGINT received, stopping listeners...");
  await stopBlockchainListeners();
  process.exit(0);
});

// Exporter pour utilisation
export default {
  initializeBlockchainListeners,
  stopBlockchainListeners,
};
