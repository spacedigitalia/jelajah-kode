import { NextRequest, NextResponse } from "next/server";

import { Account } from "@/models/Account";

import { generateJWT } from "@/hooks/jwt";

import { connectMongoDB } from "@/lib/mongodb";

import { addCorsHeaders, handleCorsOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req);
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    await connectMongoDB();

    const account = await Account.findOne({ email });
    if (!account) {
      const errorResponse = NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
      return addCorsHeaders(errorResponse, request.headers.get("origin"));
    }

    const isPasswordValid = await account.comparePassword(password);
    if (!isPasswordValid) {
      const errorResponse = NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
      return addCorsHeaders(errorResponse, request.headers.get("origin"));
    }

    const token = await generateJWT({
      _id: account._id,
      email: account.email,
      role: account.role,
    });

    const response = NextResponse.json(
      {
        message: "Sign in successful",
        user: {
          _id: account._id,
          email: account.email,
          name: account.name,
          role: account.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return addCorsHeaders(response, request.headers.get("origin"));
  } catch (error: unknown) {
    console.error("Sign in error:", error);
    const errorResponse = NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, request.headers.get("origin"));
  }
}
