/**
 * PATCH /api/users/[id]/role
 * Update user role (admin only)
 * 
 * Accessible to:
 * - Admin users only
 * 
 * Body:
 * {
 *   role: "contributor" | "creator" | "admin"
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

    // Only admin can change roles
    if (!isAdminRole(auth.user!.role)) {
      return errorResponse("Admin access required", 403);
    }

    const userId = parseInt(params.id);
    const body = await request.json();
    const { role } = body;

    // Validate role
    const validRoles = ["contributor", "creator", "admin"];
    if (!validRoles.includes(role)) {
      return errorResponse(`Invalid role. Must be one of: ${validRoles.join(", ")}`, 400);
    }

    // Fetch current user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, role: true, wallet_address: true },
    });

    if (!targetUser) {
      return errorResponse("User not found", 404);
    }

    // Update role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        username: true,
        wallet_address: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    // Log admin action
    logAdminAction("USER_ROLE_CHANGED", auth.user!.walletAddress, {
      target_user_id: userId,
      target_username: targetUser.username,
      previous_role: targetUser.role,
      new_role: role,
    });

    return jsonResponse(true, {
      message: `User role updated from ${targetUser.role} to ${role}`,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("PATCH user role error:", error);
    return errorResponse("Failed to update user role", 500);
  }
}
