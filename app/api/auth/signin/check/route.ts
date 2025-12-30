import { NextRequest, NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import { Account } from "@/models/Account";

// Helper function to add CORS headers
function addCorsHeaders(response: NextResponse, origin?: string | null) {
  const allowedOrigins = [process.env.NEXT_PUBLIC_BASE_URL].filter(
    (url): url is string => Boolean(url)
  );

  const originHeader = origin || "";
  const isAllowedOrigin = allowedOrigins.some(
    (allowed) => originHeader.startsWith(allowed) || !originHeader
  );

  if (isAllowedOrigin || !originHeader) {
    response.headers.set(
      "Access-Control-Allow-Origin",
      originHeader || allowedOrigins[0] || "*"
    );
  } else {
    response.headers.set(
      "Access-Control-Allow-Origin",
      allowedOrigins[0] || "*"
    );
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

// Handle preflight OPTIONS requests
export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response, req.headers.get("origin"));
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const { email } = await req.json();

    if (!email) {
      const response = NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
      return addCorsHeaders(response, req.headers.get("origin"));
    }

    const user = await Account.findOne({ email: email.toLowerCase() });

    if (!user) {
      const response = NextResponse.json({ exists: false }, { status: 200 });
      return addCorsHeaders(response, req.headers.get("origin"));
    }

    const response = NextResponse.json(
      {
        exists: true,
      },
      { status: 200 }
    );
    return addCorsHeaders(response, req.headers.get("origin"));
  } catch (error) {
    console.error("Check email error:", error);
    const response = NextResponse.json(
      { error: "Failed to check email. Please try again." },
      { status: 500 }
    );
    return addCorsHeaders(response, req.headers.get("origin"));
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
