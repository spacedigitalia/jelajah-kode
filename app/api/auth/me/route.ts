import { NextResponse } from "next/server";

import { cookies } from "next/headers";

import { connectMongoDB } from "@/lib/mongodb";

import { Account } from "@/models/Account";

import { verifyJWT } from "@/hooks/jwt";

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

    // Convert to plain object to access timestamps safely
    const userObj = user.toObject() as {
      _id: { toString(): string };
      email: string;
      name: string;
      role: string;
      picture?: string;
      status: string;
      isVerified: string;
      createdAt?: Date;
      updatedAt?: Date;
    };

    const userData = {
      _id: userObj._id.toString(),
      email: userObj.email,
      name: userObj.name,
      role: userObj.role,
      picture: userObj.picture,
      status: userObj.status,
      isVerified: userObj.isVerified,

      created_at: userObj.createdAt?.toISOString() || new Date().toISOString(),
      updated_at: userObj.updatedAt?.toISOString() || new Date().toISOString(),
    };

    return NextResponse.json(userData, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to get user data. Please try again." },
      { status: 500 }
    );
  }
}
