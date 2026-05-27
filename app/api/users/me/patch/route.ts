import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, jsonResponse, errorResponse } from "@/lib/middleware";

/**
 * PATCH /api/users/me
 * Update current user profile
 * 
 * Body:
 * {
 *   username?: string (3-100 chars)
 *   email?: string (valid email)
 *   avatar_url?: string (URL)
 *   bio?: string (max 500 chars)
 * }
 */
export async function PATCH(request: NextRequest) {
  try {
    const auth = await withAuth(request);
    if (!auth.isValid) {
      return errorResponse(auth.error || "Unauthorized", 401);
    }

    const user = auth.user!;
    const body = await request.json();
    const { username, email, avatar_url, bio } = body;

    // Validation
    if (username) {
      if (username.length < 3 || username.length > 100) {
        return errorResponse("Username must be between 3 and 100 characters", 400);
      }
      // Check if username already taken
      const existingUser = await prisma.user.findFirst({
        where: {
          username: { equals: username, mode: "insensitive" },
          id: { not: user.userId },
        },
      });
      if (existingUser) {
        return errorResponse("Username already taken", 409);
      }
    }

    if (email) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return errorResponse("Invalid email format", 400);
      }
      // Check if email already taken
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: { equals: email, mode: "insensitive" },
          id: { not: user.userId },
        },
      });
      if (existingEmail) {
        return errorResponse("Email already in use", 409);
      }
    }

    if (bio && bio.length > 500) {
      return errorResponse("Bio must be 500 characters or less", 400);
    }

    // Update profile
    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (bio !== undefined) updateData.bio = bio;

    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: updateData,
      select: {
        id: true,
        wallet_address: true,
        username: true,
        email: true,
        avatar_url: true,
        bio: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return jsonResponse(true, {
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("PATCH me error:", error);
    return errorResponse("Failed to update profile", 500);
  }
}
