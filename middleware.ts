import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

const publicRoutes = ["/auth/login", "/auth/forgot-password"];

export async function middleware(req: any) {
  const session = await auth();
  const pathname = req.nextUrl.pathname;

  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (session && isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
