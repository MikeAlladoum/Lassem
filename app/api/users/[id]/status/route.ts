/**
 * PATCH /api/users/[id]/status
 * Update user status (admin only)
 * 
 * Accessible to:
 * - Admin users only
 * 
 * Body:
 * {
 *   is_active?: boolean,
 *   is_visible?: boolean
 * }
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, jsonResponse, errorResponse } from "@/lib/middleware";
import { isAdminRole, logAdminAction } from "@/lib/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await withAuth(request);
    if (!auth.isValid) {
      return errorResponse("Authentication required", 401);
    }

    // Only admin can change status
    if (!isAdminRole(auth.user!.role)) {
      return errorResponse("Admin access required", 403);
    }

    const userId = parseInt(params.id);
    const body = await request.json();
    const { is_active, is_visible } = body;

    // Get current user state
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        is_active: true,
        is_visible: true,
      },
    });

    if (!currentUser) {
      return errorResponse("User not found", 404);
    }

    // Prevent deactivating self
    if (is_active === false && userId === auth.user!.userId) {
      return errorResponse("Cannot deactivate your own account", 400);
    }

    // Update status
    const updateData: any = {};
    if (is_active !== undefined) updateData.is_active = is_active;
    if (is_visible !== undefined) updateData.is_visible = is_visible;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        wallet_address: true,
        is_active: true,
        is_visible: true,
        updated_at: true,
      },
    });

    // Log admin action
    logAdminAction("USER_STATUS_CHANGED", auth.user!.walletAddress, {
      target_user_id: userId,
      target_username: currentUser.username,
      changes: {
        is_active:
          is_active !== undefined ? `${currentUser.is_active} → ${is_active}` : "no change",
        is_visible:
          is_visible !== undefined
            ? `${currentUser.is_visible} → ${is_visible}`
            : "no change",
      },
    });

    return jsonResponse(true, {
      message: "User status updated",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("PATCH user status error:", error);
    return errorResponse("Failed to update user status", 500);
  }
}
