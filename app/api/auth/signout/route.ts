import { NextRequest, NextResponse } from "next/server";

import { addCorsHeaders, handleCorsOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req);
}

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ message: "Logged out successfully" });

  response.cookies.set({
    name: "token",
    value: "",
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return addCorsHeaders(response, req.headers.get("origin"));
}
