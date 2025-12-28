import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectMongoDB } from "@/lib/mongodb";

import { Account } from "@/models/Account";

import { verifyJWT } from "@/hooks/jwt";

import mongoose from "mongoose";

export async function GET() {
  try {
    await connectMongoDB();

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await verifyJWT(token);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await Account.findById(decodedToken._id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userWithTimestamps = user as mongoose.Document & {
      createdAt?: Date;
      updatedAt?: Date;
    };

    const userData = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      picture: user.picture,
      status: user.status,
      isVerified: user.isVerified,

      created_at:
        userWithTimestamps.createdAt?.toISOString() || new Date().toISOString(),
      updated_at:
        userWithTimestamps.updatedAt?.toISOString() || new Date().toISOString(),
    };

    return NextResponse.json(userData, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to get user data. Please try again." },
      { status: 500 }
    );
  }
}
