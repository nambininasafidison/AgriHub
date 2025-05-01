import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "./lib/jwt";

const publicPaths = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify",
  "/products",
  "/intrants",
  "/search",
  "/api/health",
  "/maintenance",
  "/api-docs",
];

const adminPaths = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";

  const isStaticFile = /\.(jpg|jpeg|png|gif|svg|css|js|ico|woff|woff2)$/i.test(
    pathname
  );
  const isHealthCheck = pathname === "/api/health";
  const isMaintenancePage = pathname === "/maintenance";

  if (
    maintenanceMode &&
    !isStaticFile &&
    !isHealthCheck &&
    !isMaintenancePage
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.redirect(url);
  }

  const adminBypassToken = request.headers.get("x-admin-bypass-token");
  if (adminBypassToken === process.env.ADMIN_BYPASS_TOKEN) {
    return NextResponse.next();
  }

  const isPublicPath = publicPaths.some(
    (path) =>
      pathname === path ||
      pathname.startsWith(`${path}/`) ||
      pathname.startsWith("/api/products") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon")
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const decodedToken = await verifyJwtToken(token);

    const isAdminPath = adminPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    if (isAdminPath && decodedToken.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decodedToken.id);
    requestHeaders.set("x-user-role", decodedToken.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("callbackUrl", pathname);

    const response = NextResponse.redirect(url);
    response.cookies.delete("token");

    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
