"use client";

import { Code } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { useAuth } from "@/utils/context/AuthContext";

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    forgetPasswordEmail,
    forgetPasswordIsLoading,
    setForgetPasswordEmail,
    handleForgetPasswordSubmit,
  } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleForgetPasswordSubmit();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
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
            <h1 className="text-xl font-bold">Forget your password?</h1>
            <FieldDescription>
              Enter your email and we&apos;ll send you a code to reset your
              password
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={forgetPasswordEmail}
              onChange={(e) => setForgetPasswordEmail(e.target.value)}
              required
            />
          </Field>
          <Field>
            <Button type="submit" disabled={forgetPasswordIsLoading}>
              {forgetPasswordIsLoading ? "Sending..." : "Send Reset Code"}
            </Button>
          </Field>
          <FieldDescription className="text-center">
            Remember your password?{" "}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
