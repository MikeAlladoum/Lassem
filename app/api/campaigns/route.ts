import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, errorResponse, jsonResponse } from "@/lib/middleware";

// GET /api/campaigns
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");

    // Construire les filtres
    const where: any = {
      is_visible: true,
      is_active: true,
    };

    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) {
      where.category = { slug: category };
    }

    const total = await prisma.campaign.count({ where });
    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        creator: { select: { id: true, wallet_address: true, username: true, avatar_url: true } },
        category: true,
        contributions: { select: { amount: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    const totalPages = Math.ceil(total / limit);

    return jsonResponse(true, {
      campaigns,
      total,
      page,
      totalPages,
    });
  } catch (error: any) {
    console.error("GET campaigns error:", error);
    return errorResponse("Erreur lors de la récupération des campagnes", 500);
  }
}

// POST /api/campaigns
export async function POST(request: NextRequest) {
  try {
    const auth = await withAuth(request);
    if (!auth.isValid) {
      return errorResponse(auth.error || "Unauthorized", 401);
    }

    const user = auth.user!;

    // Vérifier le rôle (creator ou admin)
    if (user.role !== "creator" && user.role !== "admin") {
      return errorResponse("Seuls les créateurs et admins peuvent créer des campagnes", 403);
    }

    const body = await request.json();
    const { title, description, goal_amount, deadline, category_id, image_url } = body;

    // Validation
    if (!title || !description || !goal_amount || !deadline) {
      return errorResponse("Paramètres manquants", 400);
    }

    if (goal_amount <= 0) {
      return errorResponse("L'objectif doit être supérieur à 0", 400);
    }

    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      return errorResponse("La date limite doit être dans le futur", 400);
    }

    // Récupérer l'utilisateur depuis la DB
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId },
    });

    if (!userRecord) {
      return errorResponse("Utilisateur non trouvé", 404);
    }

    // Créer la campagne
    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        goal_amount: parseFloat(goal_amount),
        deadline: deadlineDate,
        status: "draft",
        image_url,
        creator_id: user.userId,
        category_id: category_id || null,
        created_by: user.userId,
      },
      include: {
        creator: true,
        category: true,
      },
    });

    return jsonResponse(true, campaign, 201);
  } catch (error: any) {
    console.error("POST campaigns error:", error);
    return errorResponse("Erreur lors de la création de la campagne", 500);
  }
}
