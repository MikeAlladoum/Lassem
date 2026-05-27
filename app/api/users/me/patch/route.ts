import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, jsonResponse, errorResponse } from "@/lib/middleware";

// PATCH /api/users/me
export async function PATCH(request: NextRequest) {
  try {
    const auth = await withAuth(request);
    if (!auth.isValid) {
      return errorResponse(auth.error || "Unauthorized", 401);
    }

    const user = auth.user!;
    const body = await request.json();
    const { username, email, avatar_url, bio } = body;

    // Mettre à jour le profil
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(avatar_url !== undefined && { avatar_url }),
        ...(bio !== undefined && { bio }),
      },
    });

    return jsonResponse(true, {
      id: updatedUser.id,
      wallet_address: updatedUser.wallet_address,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar_url: updatedUser.avatar_url,
      bio: updatedUser.bio,
      role: updatedUser.role,
    });
  } catch (error: any) {
    console.error("PATCH me error:", error);
    return errorResponse("Erreur lors de la mise à jour du profil", 500);
  }
}
