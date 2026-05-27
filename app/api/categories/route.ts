import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, errorResponse } from "@/lib/middleware";

// GET /api/categories
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        is_visible: true,
        is_active: true,
      },
      orderBy: { name: "asc" },
    });

    return jsonResponse(true, categories);
  } catch (error: any) {
    console.error("GET categories error:", error);
    return errorResponse("Erreur lors de la récupération des catégories", 500);
  }
}
