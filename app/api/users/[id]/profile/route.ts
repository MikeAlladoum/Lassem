/**
 * GET /api/users/[id]/profile
 * Get detailed user profile with stats and relations
 * 
 * Returns:
 * - User info
 * - Campaigns created (if creator)
 * - Contributions made
 * - Profile statistics
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, errorResponse } from "@/lib/middleware";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        avatar_url: true,
        bio: true,
        role: true,
        is_visible: true,
        created_at: true,
        campaigns_created: {
          where: { is_visible: true, is_active: true },
          select: {
            id: true,
            title: true,
            status: true,
            current_amount: true,
            goal_amount: true,
            created_at: true,
          },
        },
        contributions_made: {
          where: { is_visible: true, is_active: true },
          select: {
            id: true,
            amount: true,
            status: true,
            contributed_at: true,
            campaign: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { contributed_at: "desc" },
          take: 10,
        },
      },
    });

    if (!user || !user.is_visible) {
      return errorResponse("User not found", 404);
    }

    // Calculate statistics
    const totalContributed = user.contributions_made.reduce(
      (sum, contrib: any) => sum + parseFloat(contrib.amount),
      0
    );

    const activeCampaigns = user.campaigns_created.filter(
      (c: any) => c.status === "active"
    ).length;

    const successfulCampaigns = user.campaigns_created.filter(
      (c: any) => c.status === "succeeded"
    ).length;

    return jsonResponse(true, {
      user: {
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        bio: user.bio,
        role: user.role,
        created_at: user.created_at,
      },
      stats: {
        campaigns_created: user.campaigns_created.length,
        active_campaigns: activeCampaigns,
        successful_campaigns: successfulCampaigns,
        total_contributions: user.contributions_made.length,
        total_amount_contributed: totalContributed,
      },
      campaigns: user.campaigns_created,
      recent_contributions: user.contributions_made,
    });
  } catch (error: any) {
    console.error("GET user profile error:", error);
    return errorResponse("Failed to fetch user profile", 500);
  }
}
