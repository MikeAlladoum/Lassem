import { NextRequest } from "next/server";
import { AUTH_MESSAGE } from "@/lib/auth";
import { jsonResponse } from "@/lib/middleware";
import crypto from "crypto";

// GET /api/auth/nonce
export async function GET(request: NextRequest) {
  // Générer un nonce aléatoire
  const nonce = crypto.randomBytes(16).toString("hex");

  // Créer le message à signer
  const message = AUTH_MESSAGE(nonce);

  return jsonResponse(true, {
    nonce,
    message,
  });
}
