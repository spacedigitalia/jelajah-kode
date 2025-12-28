import { NextRequest, NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import { Account } from "@/models/Account";

import { getEmailService } from "@/lib/email-service";

import { generateOTP } from "@/hooks/genrate-otp";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await Account.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    const otp = generateOTP();

    user.resetToken = otp;
    user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    const emailService = getEmailService();

    await emailService.sendPasswordResetEmail(email, otp);

    return NextResponse.json(
      { message: "Password reset code sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forget password error:", error);
    return NextResponse.json(
      { error: "Failed to send reset code. Please try again." },
      { status: 500 }
    );
  }
}

export const GET = POST;
