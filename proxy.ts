import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple JWT decoding function that works in edge runtime
function decodeJWT(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    // Decode the payload (the middle part)
    const payload = parts[1];
    // Add padding if needed
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decodedPayload = atob(paddedPayload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("JWT decoding error:", error);
    throw new Error("Invalid token");
  }
}

// Define public paths that don't require authentication
const publicPaths = [
  "/signin",
  "/signup",
  "/verification",
  "/change-password",
  "/forget-password",
  "/reset-password",
];

// Define admin-only paths
const adminPaths = ["/dashboard"];

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const method = request.method;

  // CRITICAL: Always allow all API routes to pass through without any checks
  // This prevents redirects on POST/PUT/DELETE requests to API endpoints
  // Check both /api/ and /api to handle all API routes
  if (pathname.startsWith("/api/") || pathname === "/api") {
    // Log in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.log(`[PROXY] Allowing API route: ${method} ${pathname}`);
    }
    return NextResponse.next();
  }

  // CRITICAL: Only handle GET requests for page routes
  // Never redirect POST/PUT/DELETE/PATCH requests - let them pass through
  // This prevents 405 errors when API calls are mistakenly routed to pages
  if (method !== "GET") {
    return NextResponse.next();
  }

  // Check if the path is public (exact match or starts with for auth pages)
  const isPublicPath =
    pathname === "/" || publicPaths.some((path) => pathname.startsWith(path));

  // Check if the path is admin-only
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

  // Determine user role from JWT token (decode only, no verification)
  let userRole: string | null = null;
  let isAuthenticated = false;

  // Check JWT token only if it exists
  if (token) {
    try {
      const decoded = decodeJWT(token);

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        throw new Error("Token expired");
      }

      userRole = decoded.role as string;
      isAuthenticated = true;
    } catch (error) {
      console.error("Token decoding error:", error);
      // If token is invalid or expired, remove it
      const response = NextResponse.next();
      response.cookies.delete("token");
      if (!isPublicPath) {
        return NextResponse.redirect(new URL("/signin", request.url));
      }
      return response;
    }
  }

  // If user is authenticated and on signin/signup page
  if (isAuthenticated && (pathname === "/signin" || pathname === "/signup")) {
    // Check if the user is coming from a logout action
    const fromLogout = request.nextUrl.searchParams.get("logout");

    if (fromLogout) {
      // Allow the user to stay on signin page if they just logged out
      return NextResponse.next();
    } else {
      if (userRole === "admins") {
        // Redirect admins to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        // Redirect regular users to home
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  // If user is not on a public path and not authenticated, redirect to signin
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // If user is on an admin path, verify their role
  if (isAdminPath) {
    if (!isAuthenticated) {
      // If not authenticated at all, redirect to signin
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (userRole !== "admins") {
      // If not admin, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If admin role is verified, allow access
    return NextResponse.next();
  }

  // Allow access to product detail pages only for authenticated admins
  if (pathname.startsWith("/dashboard/products/products/")) {
    if (!isAuthenticated) {
      // If not authenticated, redirect to signin
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (userRole !== "admins") {
      // If not admin, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If admin role is verified, allow access to product pages
    return NextResponse.next();
  }

  // For all other cases, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - /api (API routes) - CRITICAL: Must exclude to prevent 405 errors on POST/PUT/DELETE
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - files with extensions (images, fonts, etc.)
     *
     * This ensures API routes are NEVER processed by the proxy,
     * preventing redirects that cause 405 Method Not Allowed errors
     *
     * Pattern explanation:
     * - ^/ = must start with /
     * - (?!api) = negative lookahead - don't match if starts with "api"
     * - (?!_next) = negative lookahead - don't match if starts with "_next"
     * - .* = match everything else
     */
    "/((?!api|_next|favicon\\.ico).*)",
  ],
};
