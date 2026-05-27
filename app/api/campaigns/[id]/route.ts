import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, errorResponse, jsonResponse } from "@/lib/middleware";

// GET /api/campaigns/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id);

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        creator: { select: { id: true, wallet_address: true, username: true, avatar_url: true } },
        category: true,
        contributions: {
          include: { contributor: { select: { id: true, wallet_address: true, username: true } } },
          where: { is_active: true, is_visible: true },
        },
        transactions: {
          where: { is_active: true, is_visible: true },
        },
      },
    });

    if (!campaign || !campaign.is_visible || !campaign.is_active) {
      return errorResponse("Campagne non trouvée", 404);
    }

    return jsonResponse(true, campaign);
  } catch (error: any) {
    console.error("GET campaign error:", error);
    return errorResponse("Erreur lors de la récupération de la campagne", 500);
  }
}

// PUT /api/campaigns/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await withAuth(request);
    if (!auth.isValid) {
      return errorResponse(auth.error || "Unauthorized", 401);
    }

    const user = auth.user!;
    const campaignId = parseInt(params.id);

    // Récupérer la campagne
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { creator: true },
    });

    if (!campaign) {
      return errorResponse("Campagne non trouvée", 404);
    }

    // Vérifier les permissions (créateur ou admin)
    if (campaign.creator_id !== user.userId && user.role !== "admin") {
      return errorResponse("Non autorisé", 403);
    }

    // Vérifier l'état
    if (!campaign.is_active || campaign.status !== "draft") {
      return errorResponse("Impossible de modifier cette campagne", 400);
    }

    const body = await request.json();
    const { title, description, goal_amount, deadline, category_id, image_url } = body;

    // Validation
    if (goal_amount && goal_amount <= 0) {
      return errorResponse("L'objectif doit être supérieur à 0", 400);
    }

    if (deadline && new Date(deadline) <= new Date()) {
      return errorResponse("La date limite doit être dans le futur", 400);
    }

    // Mettre à jour
    const updatedCampaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(goal_amount && { goal_amount: parseFloat(goal_amount) }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(category_id !== undefined && { category_id }),
        ...(image_url !== undefined && { image_url }),
      },
      include: { creator: true, category: true },
    });

    return jsonResponse(true, updatedCampaign);
  } catch (error: any) {
    console.error("PUT campaign error:", error);
    return errorResponse("Erreur lors de la mise à jour de la campagne", 500);
  }
}

// DELETE /api/campaigns/[id] (suppression logique)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await withAuth(request);
    if (!auth.isValid) {
      return errorResponse(auth.error || "Unauthorized", 401);
    }

    const user = auth.user!;

    // Seuls les admins peuvent supprimer
    if (user.role !== "admin") {
      return errorResponse("Seuls les admins peuvent supprimer", 403);
    }

    const campaignId = parseInt(params.id);

    // Vérifier que la campagne existe
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return errorResponse("Campagne non trouvée", 404);
    }

    // Suppression logique
    const deletedCampaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: { is_visible: false },
    });

    return jsonResponse(true, { message: "Campagne supprimée", campaign: deletedCampaign });
  } catch (error: any) {
    console.error("DELETE campaign error:", error);
    return errorResponse("Erreur lors de la suppression de la campagne", 500);
  }
}
