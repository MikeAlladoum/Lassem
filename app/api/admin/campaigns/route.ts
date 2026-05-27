import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key-do-not-use-in-production"
);

async function verifyAdminAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return { success: false, payload: null };
    }

    const verified = await jwtVerify(token, secret);
    const payload = verified.payload as any;

    const adminWallet = process.env.ADMIN_WALLET || "";
    const isAdmin =
      payload.wallet?.toLowerCase() === adminWallet.toLowerCase() ||
      payload.role === "admin";

    if (!isAdmin) {
      return { success: false, payload: null };
    }

    return { success: true, payload };
  } catch (error) {
    return { success: false, payload: null };
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const auth = await verifyAdminAuth(request);
    if (!auth.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build filter
    const where: any = {};

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    if (status) {
      where.status = status;
    }

    // Fetch total count
    const totalCampaigns = await prisma.campaign.count({ where });

    // Fetch paginated campaigns
    const campaigns = await prisma.campaign.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        is_visible: true,
        goal_amount: true,
        deadline: true,
        created_at: true,
        creator: {
          select: {
            id: true,
            username: true,
            wallet_address: true,
          },
        },
        contributions: {
          select: {
            id: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        current_amount: true,
      },
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    });

    const formattedCampaigns = campaigns.map((campaign) => {
      const totalFunded = parseFloat(campaign.current_amount.toString());
      const goalAmount = parseFloat(campaign.goal_amount.toString());
      const progressPercent = Math.round((totalFunded / goalAmount) * 100);

      return {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        status: campaign.status,
        visibility: campaign.is_visible ? "visible" : "hidden",
        target: goalAmount,
        funded: totalFunded,
        progress: progressPercent,
        daysLeft: Math.ceil(
          (new Date(campaign.deadline).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        creator: {
          name: campaign.creator.username,
          wallet: campaign.creator.wallet_address,
        },
        category: campaign.category?.name || "Uncategorized",
        contributorsCount: campaign.contributions.length,
        createdAt: campaign.created_at.toISOString(),
      };
    });

    return NextResponse.json({
      campaigns: formattedCampaigns,
      pagination: {
        page,
        limit,
        total: totalCampaigns,
        pages: Math.ceil(totalCampaigns / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
