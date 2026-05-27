import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: number;
    walletAddress: string;
    role: string;
  };
}

export async function withAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      isValid: false,
      error: "Token manquant",
    };
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    return {
      isValid: true,
      user: payload,
    };
  } catch (error) {
    return {
      isValid: false,
      error: "Token invalide ou expiré",
    };
  }
}

export function jsonResponse(success: boolean, data: any, statusCode = 200) {
  return NextResponse.json({ success, data }, { status: statusCode });
}

export function errorResponse(error: string, statusCode = 400) {
  return NextResponse.json({ success: false, error }, { status: statusCode });
}
