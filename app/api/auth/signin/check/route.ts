import { NextRequest, NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import { Account } from "@/models/Account";

import { addCorsHeaders, handleCorsOptions } from "@/lib/cors";

// Handle preflight OPTIONS requests
export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req);
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
