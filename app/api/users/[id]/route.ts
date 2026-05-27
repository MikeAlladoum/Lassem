import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, errorResponse } from "@/lib/middleware";

// GET /api/users/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        wallet_address: true,
        username: true,
        avatar_url: true,
        bio: true,
        role: true,
        is_visible: true,
        created_at: true,
        campaigns_created: {
          where: { is_visible: true, is_active: true },
          select: { id: true, title: true, status: true, current_amount: true, goal_amount: true },
        },
      },
    });

    if (!user || !user.is_visible) {
      return errorResponse("Utilisateur non trouvé", 404);
    }

    return jsonResponse(true, user);
  } catch (error: any) {
    console.error("GET user error:", error);
    return errorResponse("Erreur lors de la récupération de l'utilisateur", 500);
  }
}
