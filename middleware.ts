import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key-do-not-use-in-production"
);

const adminWallet = process.env.ADMIN_WALLET || "";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/* routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth_token")?.value;

    // Check localStorage token from header (set by client)
    const authHeader = request.headers.get("authorization");
    const headerToken = authHeader?.replace("Bearer ", "");

    const finalToken = token || headerToken;

    if (!finalToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const verified = await jwtVerify(finalToken, secret);
      const payload = verified.payload as any;

      // Check if user is admin (by wallet or role)
      const isAdmin =
        payload.wallet?.toLowerCase() === adminWallet.toLowerCase() ||
        payload.role === "admin";

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // User is authenticated and admin - allow access
      return NextResponse.next();
    } catch (error) {
      // Token verification failed
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: ["/admin/:path*"],
};
