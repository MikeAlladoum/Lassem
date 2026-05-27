import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, jsonResponse, errorResponse } from "@/lib/middleware";

// GET /api/users/me
export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request);
    if (!auth.isValid) {
      return errorResponse(auth.error || "Unauthorized", 401);
    }

    const user = auth.user!;

    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        campaigns_created: {
          where: { is_visible: true, is_active: true },
          select: { id: true, title: true, status: true, current_amount: true, goal_amount: true },
        },
        contributions_made: {
          where: { is_visible: true, is_active: true },
          select: { id: true, campaign_id: true, amount: true, created_at: true },
        },
        notifications: {
          where: { is_visible: true, is_active: true },
          orderBy: { created_at: "desc" },
          take: 5,
        },
      },
    });

    if (!userRecord) {
      return errorResponse("Utilisateur non trouvé", 404);
    }

    return jsonResponse(true, {
      id: userRecord.id,
      wallet_address: userRecord.wallet_address,
      username: userRecord.username,
      email: userRecord.email,
      avatar_url: userRecord.avatar_url,
      bio: userRecord.bio,
      role: userRecord.role,
      is_active: userRecord.is_active,
      is_visible: userRecord.is_visible,
      last_login_at: userRecord.last_login_at,
      created_at: userRecord.created_at,
      campaigns_created: userRecord.campaigns_created,
      contributions_made: userRecord.contributions_made,
      notifications: userRecord.notifications,
    });
  } catch (error: any) {
    console.error("GET me error:", error);
    return errorResponse("Erreur lors de la récupération du profil", 500);
  }
}
