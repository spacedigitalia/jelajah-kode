import { NextRequest, NextResponse } from "next/server";

/**
 * Helper function to add CORS headers to API responses
 * Supports same-origin requests and configured allowed origins
 */
export function addCorsHeaders(
  response: NextResponse,
  origin?: string | null
): NextResponse {
  const allowedOrigins = [process.env.NEXT_PUBLIC_BASE_URL].filter(
    (url): url is string => Boolean(url)
  );

  const originHeader = origin || "";

  // Normalize origin (remove trailing slash, handle protocol typos)
  let normalizedOrigin = originHeader.replace(/\/$/, "");

  // Fix common protocol typos (https: -> https://)
  if (normalizedOrigin.match(/^https?:[^/]/)) {
    normalizedOrigin = normalizedOrigin.replace(/^(https?):/, "$1://");
  }

  // Helper to extract domain from URL (handles both https://domain and https:domain)
  const extractDomain = (url: string): string => {
    return url.replace(/^https?:\/\/?/, "").split("/")[0];
  };

  // Check if origin is allowed
  const isAllowedOrigin =
    !originHeader ||
    allowedOrigins.some((allowed) => {
      const normalizedAllowed = allowed.replace(/\/$/, "");

      // Exact match
      if (
        normalizedOrigin === normalizedAllowed ||
        originHeader === normalizedAllowed
      ) {
        return true;
      }

      // Domain match (handles protocol variations)
      const originDomain = extractDomain(normalizedOrigin);
      const allowedDomain = extractDomain(normalizedAllowed);
      if (originDomain && allowedDomain && originDomain === allowedDomain) {
        return true;
      }

      // Prefix match
      if (
        normalizedOrigin.startsWith(normalizedAllowed) ||
        originHeader.startsWith(normalizedAllowed)
      ) {
        return true;
      }

      return false;
    });

  // Set CORS headers - always use the original origin header if it's allowed
  // This is important for CORS to work correctly
  if (isAllowedOrigin && originHeader) {
    response.headers.set("Access-Control-Allow-Origin", originHeader);
  } else if (allowedOrigins.length > 0) {
    // Fallback to first allowed origin
    response.headers.set("Access-Control-Allow-Origin", allowedOrigins[0]);
  } else {
    // Last resort: allow all (not recommended for production)
    response.headers.set("Access-Control-Allow-Origin", "*");
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours

  return response;
}

/**
 * Handle preflight OPTIONS requests for CORS
 */
export async function handleCorsOptions(
  req: NextRequest
): Promise<NextResponse> {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response, req.headers.get("origin"));
}
