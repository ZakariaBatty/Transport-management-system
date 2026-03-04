import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes - no authentication required
const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/forgot-password",
  "/auth/verify-code",
  "/auth/reset-password",
];

// Route access rules: path pattern => required roles
const PROTECTED_PREFIXES: Record<string, string[]> = {
  // Driver routes
  "/driver": ["DRIVER"],

  // Admin routes
  "/trips": ["MANAGER", "ADMIN", "SUPER_ADMIN"],
  "/drivers": ["MANAGER", "ADMIN", "SUPER_ADMIN"],
  "/vehicles": ["MANAGER", "ADMIN", "SUPER_ADMIN"],
  "/reports": ["MANAGER", "ADMIN", "SUPER_ADMIN"],

  // Admin-only routes
  "/users": ["ADMIN", "SUPER_ADMIN"],
  "/settings": ["ADMIN", "SUPER_ADMIN"],

  // Accessible by all authenticated users
  "/dashboard": ["DRIVER", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  "/profile": ["DRIVER", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  "/calendar": ["DRIVER", "MANAGER", "ADMIN", "SUPER_ADMIN"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get JWT token from request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Get user role from token
  const userRole = (token as any)?.role as string | undefined;

  if (!userRole) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Check route-specific access control
  for (const [prefix, allowedRoles] of Object.entries(PROTECTED_PREFIXES)) {
    if (pathname.startsWith(prefix)) {
      if (!allowedRoles.includes(userRole)) {
        // Access denied, redirect based on role
        if (userRole === "DRIVER") {
          return NextResponse.redirect(new URL("/driver/dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
