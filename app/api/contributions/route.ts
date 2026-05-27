import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, errorResponse, jsonResponse } from "@/lib/middleware";

// POST /api/contributions
export async function POST(request: NextRequest) {
  try {
    const auth = await withAuth(request);
    if (!auth.isValid) {
      return errorResponse(auth.error || "Unauthorized", 401);
    }

    const user = auth.user!;
    const body = await request.json();
    const { campaign_id, amount, tx_hash, block_number } = body;

    // Validation
    if (!campaign_id || !amount || !tx_hash) {
      return errorResponse("Paramètres manquants", 400);
    }

    if (amount <= 0) {
      return errorResponse("Le montant doit être supérieur à 0", 400);
    }

    // Vérifier que la campagne existe et est active
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaign_id },
      include: { creator: true },
    });

    if (!campaign || !campaign.is_active || !campaign.is_visible) {
      return errorResponse("Campagne non trouvée ou inactive", 404);
    }

    // Vérifier que c'est une campagne active
    if (campaign.status !== "active" || new Date() > campaign.deadline) {
      return errorResponse("Campagne non active ou deadline dépassée", 400);
    }

    // Vérifier que l'utilisateur n'est pas le créateur
    if (campaign.creator_id === user.userId) {
      return errorResponse("Le créateur ne peut pas contribuer à sa propre campagne", 400);
    }

    // Vérifier que la contribution n'existe pas déjà (doublon tx_hash)
    const existingContribution = await prisma.contribution.findUnique({
      where: { tx_hash },
    });

    if (existingContribution) {
      return errorResponse("Cette contribution existe déjà", 400);
    }

    // Créer la contribution
    const contribution = await prisma.contribution.create({
      data: {
        campaign_id,
        contributor_id: user.userId,
        amount: parseFloat(amount),
        tx_hash,
        status: "confirmed",
        block_number: block_number ? BigInt(block_number) : null,
        created_by: user.userId,
      },
      include: {
        campaign: true,
        contributor: true,
      },
    });

    // Mettre à jour le montant collecté dans la campagne
    const updatedCampaign = await prisma.campaign.update({
      where: { id: campaign_id },
      data: {
        current_amount: Number(campaign.current_amount) + parseFloat(amount),
      },
    });

    // Vérifier si l'objectif est atteint
    if (updatedCampaign.current_amount >= updatedCampaign.goal_amount) {
      await prisma.campaign.update({
        where: { id: campaign_id },
        data: { status: "succeeded" },
      });
    }

    // Créer une notification pour le créateur
    await prisma.notification.create({
      data: {
        user_id: campaign.creator_id,
        type: "contribution",
        title: "Nouvelle contribution",
        message: `${user.walletAddress.slice(0, 6)}... a contribué ${parseFloat(amount)} ETH à votre campagne`,
        created_by: user.userId,
      },
    });

    // Créer une transaction blockchain
    await prisma.blockchainTransaction.create({
      data: {
        tx_hash,
        type: "contribution",
        from_address: user.walletAddress,
        to_address: campaign.contract_address || "",
        amount: parseFloat(amount),
        block_number: block_number ? BigInt(block_number) : null,
        status: "success",
        campaign_id,
        user_id: user.userId,
        created_by: user.userId,
      },
    });

    return jsonResponse(true, contribution, 201);
  } catch (error: any) {
    console.error("POST contribution error:", error);
    return errorResponse("Erreur lors de la création de la contribution", 500);
  }
}
