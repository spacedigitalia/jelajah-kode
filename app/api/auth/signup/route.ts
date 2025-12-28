import { NextResponse } from "next/server";

import { Account } from "@/models/Account";

import { generateJWT } from "@/hooks/jwt";

import { connectMongoDB } from "@/lib/mongodb";

import { getEmailService } from "@/lib/email-service";

import { generateOTP } from "@/hooks/genrate-otp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();

    await connectMongoDB();

    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const otp = generateOTP();

    const account = new Account({
      email,
      password,
      name,
      role: role || "user",
      verificationToken: otp,
      verificationTokenExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    const savedAccount = await account.save();

    if ((!savedAccount || !savedAccount._id) && (!account || !account._id)) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    const emailService = getEmailService();

    await emailService.sendVerificationEmail(account.email, otp);

    return NextResponse.json(
      {
        message:
          "Account created successfully. Verification OTP sent to your email.",
        userId: account._id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { token } = await request.json();

    await connectMongoDB();

    const account = await Account.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    account.isVerified = "true" as const;
    account.verificationToken = undefined;
    account.verificationTokenExpiry = undefined;
    await account.save();

    const jwtToken = await generateJWT({
      _id: account._id,
      email: account.email,
      role: account.role,
    });

    const response = NextResponse.json({
      message: "Email verification successful",
      user: {
        _id: account._id,
        email: account.email,
        name: account.name,
        status: account.status,
        isVerified: account.isVerified,
        role: account.role,
        picture: account.picture,
      },
    });

    response.cookies.set({
      name: "token",
      value: jwtToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: unknown) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
