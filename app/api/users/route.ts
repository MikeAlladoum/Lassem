/**
 * GET /api/users
 * List all users with pagination and filtering
 * 
 * Accessible to:
 * - Admin users (full list)
 * - Authenticated users (limited public info)
 * 
 * Query params:
 * - page: 1 (pagination)
 * - limit: 10 (items per page)
 * - role: filter by role (creator, contributor, admin)
 * - search: search by username
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, jsonResponse, errorResponse } from "@/lib/middleware";
import { isAdminRole } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request);
    if (!auth.isValid) {
      return errorResponse("Authentication required", 401);
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const role = url.searchParams.get("role");
    const search = url.searchParams.get("search");

    // Build where clause
    const where: any = {
      is_active: true,
      is_visible: true,
    };

    if (role) where.role = role;
    if (search) {
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch users with pagination
    const total = await prisma.user.count({ where });
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        avatar_url: true,
        bio: true,
        role: true,
        is_visible: true,
        created_at: true,
        // Only include wallet for admin users
        ...(isAdminRole(auth.user!.role) && { wallet_address: true }),
        // Only include email for admin users
        ...(isAdminRole(auth.user!.role) && { email: true }),
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    const totalPages = Math.ceil(total / limit);

    return jsonResponse(true, {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("GET users error:", error);
    return errorResponse("Failed to fetch users", 500);
  }
}
