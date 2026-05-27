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
    const role = searchParams.get("role") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build filter
    const where: any = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { wallet_address: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    // Fetch total count
    const totalUsers = await prisma.user.count({ where });

    // Fetch paginated users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        wallet_address: true,
        role: true,
        is_active: true,
        created_at: true,
        _count: {
          select: {
            campaigns_created: true,
            contributions_made: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      wallet: user.wallet_address,
      role: user.role,
      status: user.is_active ? "active" : "inactive",
      joinedAt: user.created_at.toISOString(),
      campaignsCreated: user._count.campaigns_created,
      contributions: user._count.contributions_made,
    }));

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
