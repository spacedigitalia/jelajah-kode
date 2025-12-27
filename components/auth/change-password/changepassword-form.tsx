"use client";

import { Code } from "lucide-react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";

import { useAuth } from "@/utils/context/AuthContext";

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    passwordResetStep,
    passwordResetOtp,
    passwordResetNewPassword,
    passwordResetConfirmPassword,
    passwordResetIsLoading,
    setPasswordResetOtp,
    setPasswordResetNewPassword,
    setPasswordResetConfirmPassword,
    handleVerifyOtpForPasswordReset,
    handleResetPasswordWithOtp,
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    // Check if email parameter exists
    if (!email) {
      toast.error("Please request password reset from forget password page");
      router.push("/forget-password");
    }
  }, [email, router]);

  const handleVerifyOTP = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleVerifyOtpForPasswordReset(passwordResetOtp);
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleResetPasswordWithOtp();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {!email ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      ) : (
        <>
          {passwordResetStep === "otp" && (
            <form onSubmit={handleVerifyOTP}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <a
                    href="#"
                    className="flex flex-col items-center gap-2 font-medium"
                  >
                    <div className="flex size-8 items-center justify-center rounded-md">
                      <Code className="size-6" />
                    </div>
                    <span className="sr-only">Jelajah Kode 👾.</span>
                  </a>
                  <h1 className="text-xl font-bold">Enter verification code</h1>
                  <FieldDescription>
                    We sent a 6-digit code to your email
                  </FieldDescription>
                </div>
                <Field>
                  <FieldLabel htmlFor="otp" className="sr-only">
                    Verification code
                  </FieldLabel>
                  <InputOTP
                    maxLength={6}
                    id="otp"
                    required
                    value={passwordResetOtp}
                    onChange={(value) => setPasswordResetOtp(value)}
                    containerClassName="gap-4"
                  >
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <FieldDescription className="text-center">
                    Didn&apos;t receive the code?{" "}
                    <Link
                      href="/forget-password"
                      className="text-blue-600 hover:underline"
                    >
                      Resend
                    </Link>
                  </FieldDescription>
                </Field>
                <Field>
                  <Button
                    type="submit"
                    disabled={
                      passwordResetIsLoading || passwordResetOtp.length !== 6
                    }
                  >
                    {passwordResetIsLoading ? "Verifying..." : "Verify"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}

          {passwordResetStep === "password" && (
            <form onSubmit={handleResetPassword}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <a
                    href="#"
                    className="flex flex-col items-center gap-2 font-medium"
                  >
                    <div className="flex size-8 items-center justify-center rounded-md">
                      <Code className="size-6" />
                    </div>
                    <span className="sr-only">Jelajah Kode 👾.</span>
                  </a>
                  <h1 className="text-xl font-bold">Create new password</h1>
                  <FieldDescription>Enter your new password</FieldDescription>
                </div>
                <Field>
                  <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={passwordResetNewPassword}
                    onChange={(e) =>
                      setPasswordResetNewPassword(e.target.value)
                    }
                    required
                    minLength={8}
                  />
                  <FieldDescription>
                    Must be at least 8 characters
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordResetConfirmPassword}
                    onChange={(e) =>
                      setPasswordResetConfirmPassword(e.target.value)
                    }
                    required
                    minLength={8}
                  />
                </Field>
                <Field>
                  <Button type="submit" disabled={passwordResetIsLoading}>
                    {passwordResetIsLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}
        </>
      )}

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
