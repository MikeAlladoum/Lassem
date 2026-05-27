import { NextRequest, NextResponse } from "next/server";
import { connectWallet } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/middleware";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, signature, message } = body;

    // Validation
    if (!walletAddress || !signature || !message) {
      return errorResponse("Paramètres manquants", 400);
    }

    // Connecter ou créer l'utilisateur
    const { user, token } = await connectWallet(walletAddress, signature, message);

    return jsonResponse(
      true,
      {
        user: {
          id: user.id,
          walletAddress: user.wallet_address,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url,
        },
        token,
      },
      200
    );
  } catch (error: any) {
    console.error("Auth error:", error);
    return errorResponse(error.message || "Erreur d'authentification", 401);
  }
}
