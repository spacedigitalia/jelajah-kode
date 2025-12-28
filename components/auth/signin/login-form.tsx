"use client";

import { Code, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import { PasswordInput } from "@/components/ui/password-input";

import Link from "next/link";

import { useAuth } from "@/utils/context/AuthContext";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    loginStep,
    loginEmail,
    loginPassword,
    loginIsLoading,
    setLoginEmail,
    setLoginPassword,
    handleEmailSubmit,
    handlePasswordSubmit,
    handleBackToEmail,
  } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loginStep === "email") {
      await handleEmailSubmit();
    } else {
      await handlePasswordSubmit();
    }
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
            <h1 className="text-xl font-bold">Welcome to Jelajah Kode 👾.</h1>
            <FieldDescription>
              Don&apos;t have an account?{" "}
              <Link href="/signup" rel="noopener noreferrer">
                Sign up
              </Link>
            </FieldDescription>
          </div>

          {loginStep === "email" && (
            <>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  autoFocus
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loginIsLoading}>
                  {loginIsLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {loginIsLoading ? "Checking..." : "Continue"}
                </Button>
              </Field>
            </>
          )}

          {loginStep === "password" && (
            <>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={loginEmail}
                  disabled
                  className="bg-muted"
                />
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="text-sm text-blue-600 hover:underline text-left"
                >
                  Change email
                </button>
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forget-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  autoFocus
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loginIsLoading}>
                  {loginIsLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {loginIsLoading ? "Signing in..." : "Sign in"}
                </Button>
              </Field>
            </>
          )}

        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
