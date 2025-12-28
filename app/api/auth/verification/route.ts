import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import { Account } from "@/models/Account";

import { generateJWT } from "@/hooks/jwt";

import { getEmailService } from "@/lib/email-service";

import { generateOTP } from "@/hooks/genrate-otp";

export const runtime = "nodejs";

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

export async function POST(request: Request) {
  try {
    const { token, newPassword, email } = await request.json();

    await connectMongoDB();

    // Check if this is a password reset request
    if (token && typeof token === "string") {
      const account = await Account.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
      });

      if (!account) {
        return NextResponse.json(
          { error: "Invalid or expired OTP" },
          { status: 400 }
        );
      }

      // If only verifying OTP for password reset
      if (!newPassword) {
        return NextResponse.json({ message: "OTP is valid" });
      }

      // If resetting password as part of verification flow
      account.password = newPassword;
      account.resetToken = undefined;
      account.resetTokenExpiry = undefined;
      await account.save();

      const jwtToken = await generateJWT({
        _id: account._id,
        email: account.email,
        role: account.role,
      });

      const response = NextResponse.json({
        message: "Password reset successful",
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
    }

    // Check if this is a resend verification request
    if (email && typeof email === "string") {
      const account = await Account.findOne({ email: email.toLowerCase() });

      if (!account) {
        return NextResponse.json(
          { error: "Account not found" },
          { status: 404 }
        );
      }

      // Generate new verification token
      const otp = generateOTP();

      account.verificationToken = otp;
      account.verificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await account.save();

      const emailService = getEmailService();
      await emailService.sendVerificationEmail(account.email, otp);

      return NextResponse.json({
        message: "Verification code resent successfully",
      });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
