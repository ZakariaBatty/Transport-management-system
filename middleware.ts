import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import type { Session } from "next-auth";

import { UserRole } from "./lib/generated/prisma/enums";

/**
 * Middleware for authentication and authorization
 * Protects routes and enforces role-based access control
 */

interface AuthSession extends Session {
  user: Session["user"] & {
    id: string;
    role: UserRole;
    status: string;
  };
}

// Public routes that don't require authentication
const publicRoutes = [
  "/auth/login",
  "/auth/forgot-password",
  "/auth/verify-code",
  "/auth/reset-password",
];

// Role-based route access control
const roleRouteAccess: Record<UserRole, string[]> = {
  [UserRole.DRIVER]: ["/dashboard", "/trips", "/profile", "/calendar"],
  [UserRole.MANAGER]: [
    "/dashboard",
    "/trips",
    "/drivers",
    "/vehicles",
    "/maintenance",
    "/reports",
    "/profile",
  ],
  [UserRole.ADMIN]: [
    "/dashboard",
    "/trips",
    "/drivers",
    "/vehicles",
    "/maintenance",
    "/reports",
    "/profile",
    "/settings",
    "/users",
  ],
  [UserRole.SUPER_ADMIN]: [
    "/dashboard",
    "/trips",
    "/drivers",
    "/vehicles",
    "/maintenance",
    "/reports",
    "/profile",
    "/settings",
    "/users",
    "/audit-logs",
  ],
};

export default auth(
  async (req: NextRequest & { auth: AuthSession | null }) => {
    const session = req.auth as AuthSession | null;
    const pathname = req.nextUrl.pathname;

    // Skip middleware for public routes
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
      // Redirect authenticated users away from login pages
      if (session && pathname.startsWith("/auth/login")) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
      }
      return NextResponse.next();
    }

    // If user is not authenticated and trying to access protected route
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
    }

    // Check if user is active
    if (session.user.status !== "ACTIVE") {
      return NextResponse.redirect(
        new URL("/auth/login?error=account_inactive", req.nextUrl),
      );
    }

    // Check role-based access
    const userRole = session.user.role;
    const allowedRoutes = roleRouteAccess[userRole] || [];

    // Check if user can access this route
    const canAccess = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!canAccess) {
      console.warn(
        `[Auth Middleware] User ${session.user.email} (${userRole}) attempted to access unauthorized route: ${pathname}`,
      );
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    // For drivers, add additional data isolation check
    if (userRole === UserRole.DRIVER) {
      // Extract user ID from URL params if present (for data isolation)
      const searchParams = req.nextUrl.searchParams;
      const requestedUserId = searchParams.get("userId");

      if (requestedUserId && requestedUserId !== session.user.id) {
        console.warn(
          `[Auth Middleware] Driver ${session.user.email} attempted to access data for user: ${requestedUserId}`,
        );
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
      }
    }

    return NextResponse.next();
  },
);

// Configure which routes should use this middleware
export const config = {
  matcher: [
    // Protected app routes
    "/dashboard/:path*",
    "/trips/:path*",
    "/drivers/:path*",
    "/vehicles/:path*",
    "/maintenance/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/users/:path*",
    "/profile/:path*",
    "/calendar/:path*",
    "/audit-logs/:path*",
    // Auth routes
    "/auth/:path*",
  ],
};
