/**
 * GET /api/admin/info
 * 
 * Returns admin information and verification status
 * 
 * Accessible to:
 * - Users with admin role
 * - Admin wallet holder
 * 
 * Returns:
 * - Admin status
 * - Platform stats (users, campaigns, contributions)
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, jsonResponse, errorResponse } from "@/lib/middleware";
import { isAdminWallet, isAdminRole } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request);
    if (!auth.isValid) {
      return errorResponse("Authentication required", 401);
    }

    const user = auth.user!;

    // Check if user is admin (by wallet OR by role)
    const isAdmin = isAdminWallet(user.walletAddress) || isAdminRole(user.role);

    if (!isAdmin) {
      return errorResponse("Admin access required", 403);
    }

    // Fetch admin statistics
    const [totalUsers, totalCampaigns, totalContributions, activeUsers] = await Promise.all([
      prisma.user.count(),
      prisma.campaign.count(),
      prisma.contribution.count(),
      prisma.user.count({
        where: { last_login_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
    ]);

    // Fetch current user details
    const adminUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        wallet_address: true,
        username: true,
        role: true,
        created_at: true,
        last_login_at: true,
      },
    });

    return jsonResponse(true, {
      admin: {
        is_authorized: true,
        wallet_address: user.walletAddress,
        role: user.role,
        user_id: user.userId,
        verified_by: isAdminWallet(user.walletAddress) ? "wallet" : "role",
      },
      stats: {
        total_users: totalUsers,
        total_campaigns: totalCampaigns,
        total_contributions: totalContributions,
        active_users_24h: activeUsers,
      },
      current_admin: adminUser,
    });
  } catch (error: any) {
    console.error("Admin info error:", error);
    return errorResponse("Failed to fetch admin info", 500);
  }
}
