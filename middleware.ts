import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/auth/login",
  "/auth/forgot-password",
  "/auth/verify-code",
  "/auth/reset-password",
];

export async function middleware(req: any) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  // Get JWT token from request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuth = !!token;

  // Redirect logged-in users away from public auth pages
  if (isAuth && isPublic && pathname !== "/unauthorized") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Redirect non-authenticated users to login
  if (!isPublic && !isAuth) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/trips/:path*",
//     "/drivers/:path*",
//     "/vehicles/:path*",
//     "/maintenance/:path*",
//     "/reports/:path*",
//     "/settings/:path*",
//     "/users/:path*",
//     "/profile/:path*",
//     "/calendar/:path*",
//     "/audit-logs/:path*",
//     "/auth/:path*",
//     "/",
//   ],
// };
