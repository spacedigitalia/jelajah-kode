import mongoose from "mongoose";

import bcrypt from "bcryptjs";

import { IAccount } from "@/types/auth";

const accountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    picture: {
      type: String,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admins"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
    },
    provider: {
      type: String,
      enum: ["email", "github", "google"],
      default: "email",
      required: false,
    },
  },
  {
    timestamps: true,
    collection: process.env.NEXT_PUBLIC_ACCOUNTS,
  }
);

accountSchema.pre<IAccount>("save", async function (this: IAccount) {
  if (!this.isModified("password") || !this.password) {
    return;
  }

  try {
    // Ensure password is defined before hashing
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  } catch (error) {
    throw error;
  }
});

accountSchema.methods.comparePassword = async function (
  this: IAccount,
  candidatePassword: string
): Promise<boolean> {
  // OAuth users don't have passwords
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

const AccountModel: mongoose.Model<IAccount> =
  (mongoose.models.Account as mongoose.Model<IAccount>) ||
  mongoose.model<IAccount>("Account", accountSchema);
export const Account = AccountModel;
