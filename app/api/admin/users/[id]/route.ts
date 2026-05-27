import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, errorResponse, jsonResponse } from "@/lib/middleware";

// PATCH /api/admin/users/[id]
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

    const userId = parseInt(params.id);
    const body = await request.json();
    const { is_active, is_visible, role } = body;

    // Vérifier que l'utilisateur existe
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return errorResponse("Utilisateur non trouvé", 404);
    }

    // Mettre à jour
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(is_active !== undefined && { is_active }),
        ...(is_visible !== undefined && { is_visible }),
        ...(role !== undefined && { role }),
      },
    });

    return jsonResponse(true, {
      message: "Utilisateur mis à jour",
      user: {
        id: updatedUser.id,
        wallet_address: updatedUser.wallet_address,
        username: updatedUser.username,
        role: updatedUser.role,
        is_active: updatedUser.is_active,
        is_visible: updatedUser.is_visible,
      },
    });
  } catch (error: any) {
    console.error("Admin PATCH user error:", error);
    return errorResponse("Erreur lors de la mise à jour de l'utilisateur", 500);
  }
}
