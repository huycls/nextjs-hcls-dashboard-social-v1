import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/auth-server";

const PROTECTED_API_PREFIXES = ["/api/automations", "/api/jobs"];

function isProtectedApi(pathname: string) {
  return PROTECTED_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname === "/login";
  const isProtectedApiRoute = isProtectedApi(pathname);

  if ((isDashboard || isProtectedApiRoute) && !token) {
    if (isProtectedApiRoute) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized. Please login first." },
        { status: 401 },
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLogin && token) {
    const redirectTo =
      request.nextUrl.searchParams.get("redirect") ?? "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/api/automations",
    "/api/automations/:path*",
    "/api/jobs",
    "/api/jobs/:path*",
  ],
};
