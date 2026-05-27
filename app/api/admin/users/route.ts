import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { adminEndpointLimiter, getClientIdentifier } from "@/lib/rate-limit";
import { cacheableQuery, userCache, cacheKeys, cacheInvalidation } from "@/lib/cache";
import { auditLogger, AuditAction } from "@/lib/audit-logger";
import { performanceMonitor, measureAsync } from "@/lib/performance-monitor";

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
  const startTime = Date.now();
  const clientId = getClientIdentifier(request, "admin:");

  try {
    // Rate limiting check
    if (adminEndpointLimiter.isLimited(clientId)) {
      const remaining = adminEndpointLimiter.getRemaining(clientId);
      const resetTime = adminEndpointLimiter.getResetTime(clientId);

      await auditLogger.log({
        action: AuditAction.SECURITY_ALERT,
        adminId: clientId,
        adminWallet: "unknown",
        status: "failure",
        details: { reason: "Rate limit exceeded" },
        errorMessage: `Rate limit exceeded. Reset at ${new Date(resetTime).toISOString()}`,
      });

      return NextResponse.json(
        {
          error: "Too many requests",
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Check admin authorization
    const auth = await verifyAdminAuth(request);
    if (!auth.success) {
      await auditLogger.log({
        action: AuditAction.AUTH_LOGIN_FAILED,
        adminId: clientId,
        adminWallet: "unknown",
        status: "failure",
        errorMessage: "Invalid or missing JWT token",
      });

      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Generate cache key
    const cacheKey = search
      ? cacheKeys.userSearch(search, page)
      : role
      ? cacheKeys.usersByRole(role, page)
      : cacheKeys.userList(page, limit);

    // Try to get from cache
    const cachedData = userCache.get(cacheKey);
    if (cachedData) {
      await auditLogger.log({
        action: AuditAction.USER_VIEWED,
        adminId: auth.payload.wallet || "unknown",
        adminWallet: auth.payload.wallet,
        status: "success",
        details: { source: "cache", search, role, page },
      });

      performanceMonitor.recordMetric({
        name: "GET /api/admin/users",
        duration: Date.now() - startTime,
        tags: { cached: "true", search, role },
      });

      return NextResponse.json(cachedData);
    }

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

    // Fetch with performance monitoring
    const response = await measureAsync(
      "Fetch users from database",
      async () => {
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

        return {
          users: users.map((user) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            wallet: user.wallet_address,
            role: user.role,
            status: user.is_active ? "active" : "inactive",
            joinedAt: user.created_at.toISOString(),
            campaignsCreated: user._count.campaigns_created,
            contributions: user._count.contributions_made,
          })),
          pagination: {
            page,
            limit,
            total: totalUsers,
            pages: Math.ceil(totalUsers / limit),
          },
        };
      },
      performanceMonitor,
      { search, role, cached: "false" }
    );

    // Cache the response
    userCache.set(cacheKey, response, { ttl: 5 * 60 * 1000 }); // 5 minutes

    // Log successful request
    await auditLogger.log({
      action: AuditAction.USER_VIEWED,
      adminId: auth.payload.wallet || "unknown",
      adminWallet: auth.payload.wallet,
      status: "success",
      details: { search, role, page, resultCount: response.users.length },
    });

    return NextResponse.json(response);
  } catch (error) {
    const duration = Date.now() - startTime;

    // Log error
    const errorMessage = error instanceof Error ? error.message : String(error);
    await auditLogger.log({
      action: AuditAction.SYSTEM_ERROR,
      adminId: clientId,
      adminWallet: "unknown",
      status: "failure",
      errorMessage,
    });

    performanceMonitor.recordMetric({
      name: "GET /api/admin/users (error)",
      duration,
      tags: { error: "true" },
    });

    return NextResponse.json(
      { error: "Internal server error", message: errorMessage },
      { status: 500 }
    );
  }
}
