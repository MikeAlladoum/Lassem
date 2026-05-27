import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, errorResponse, jsonResponse } from "@/lib/middleware";

// PATCH /api/admin/campaigns/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await withAuth(request);
    if (!auth.isValid) {
      return errorResponse(auth.error || "Unauthorized", 401);
    }

    const user = auth.user!;

    // Seuls les admins
    if (user.role !== "admin") {
      return errorResponse("Non autorisé", 403);
    }

    const campaignId = parseInt(params.id);
    const body = await request.json();
    const { is_active, is_visible, status } = body;

    // Vérifier que la campagne existe
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return errorResponse("Campagne non trouvée", 404);
    }

    // Mettre à jour
    const updatedCampaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        ...(is_active !== undefined && { is_active }),
        ...(is_visible !== undefined && { is_visible }),
        ...(status !== undefined && { status }),
      },
      include: {
        creator: true,
        category: true,
      },
    });

    return jsonResponse(true, {
      message: "Campagne mise à jour",
      campaign: updatedCampaign,
    });
  } catch (error: any) {
    console.error("Admin PATCH campaign error:", error);
    return errorResponse("Erreur lors de la mise à jour de la campagne", 500);
  }
}
