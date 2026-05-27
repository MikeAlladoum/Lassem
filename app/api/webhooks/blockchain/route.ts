import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/middleware";

// POST /api/webhooks/blockchain
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, txHash, contractAddress, data } = body;

    // Validation basique
    if (!eventType || !txHash) {
      return errorResponse("Paramètres manquants", 400);
    }

    console.log(`Webhook blockchain reçu: ${eventType}`, data);

    switch (eventType) {
      case "ContributionReceived":
        // data: { contributor, amount, newTotal }
        await handleContributionReceived(txHash, data);
        break;

      case "FundsWithdrawn":
        // data: { owner, amount }
        await handleFundsWithdrawn(txHash, data);
        break;

      case "RefundIssued":
        // data: { contributor, amount }
        await handleRefundIssued(txHash, data);
        break;

      case "CampaignCancelled":
        // data: { campaignAddress }
        await handleCampaignCancelled(data);
        break;

      default:
        return errorResponse("Type d'événement inconnu", 400);
    }

    return jsonResponse(true, { message: "Événement traité avec succès" });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return errorResponse("Erreur lors du traitement du webhook", 500);
  }
}

async function handleContributionReceived(txHash: string, data: any) {
  // Trouver ou mettre à jour la transaction
  const contributor = data.contributor?.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { wallet_address: contributor },
  });

  if (user) {
    // Mettre à jour le statut de la transaction si elle existe
    await prisma.blockchainTransaction.updateMany({
      where: { tx_hash: txHash },
      data: {
        status: "success",
        amount: parseFloat(data.newTotal) || 0,
      },
    });
  }

  console.log(`✅ Contribution reçue: ${contributor} - ${data.newTotal}`);
}

async function handleFundsWithdrawn(txHash: string, data: any) {
  const owner = data.owner?.toLowerCase();

  const campaign = await prisma.campaign.findFirst({
    where: { contract_address: data.contractAddress },
  });

  if (campaign) {
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { status: "closed" },
    });

    // Créer notification
    const creatorUser = await prisma.user.findUnique({
      where: { id: campaign.creator_id },
    });

    if (creatorUser) {
      await prisma.notification.create({
        data: {
          user_id: creatorUser.id,
          type: "campaign_end",
          title: "Fonds retirés",
          message: `Les fonds de votre campagne ont été retirés avec succès`,
          created_by: creatorUser.id,
        },
      });
    }
  }

  console.log(`💰 Fonds retirés: ${owner} - ${data.amount}`);
}

async function handleRefundIssued(txHash: string, data: any) {
  const contributor = data.contributor?.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { wallet_address: contributor },
  });

  if (user) {
    // Mettre à jour les contributions en remboursé
    await prisma.contribution.updateMany({
      where: { contributor_id: user.id },
      data: { status: "refunded" },
    });

    // Créer notification
    await prisma.notification.create({
      data: {
        user_id: user.id,
        type: "refund",
        title: "Remboursement émis",
        message: `Un remboursement de ${data.amount} a été émis sur votre compte`,
        created_by: 1, // Système
      },
    });
  }

  console.log(`🔄 Remboursement émis: ${contributor} - ${data.amount}`);
}

async function handleCampaignCancelled(data: any) {
  const campaign = await prisma.campaign.findFirst({
    where: { contract_address: data.contractAddress },
  });

  if (campaign) {
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { status: "cancelled", is_active: false },
    });

    // Notifier le créateur
    const creator = await prisma.user.findUnique({
      where: { id: campaign.creator_id },
    });

    if (creator) {
      await prisma.notification.create({
        data: {
          user_id: creator.id,
          type: "system",
          title: "Campagne annulée",
          message: "Votre campagne a été annulée",
          created_by: 1,
        },
      });
    }
  }

  console.log(`❌ Campagne annulée: ${data.contractAddress}`);
}
