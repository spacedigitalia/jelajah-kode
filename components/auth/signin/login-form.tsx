"use client";

import { Code } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import Link from "next/link";

import { useAuth } from "@/utils/context/AuthContext";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    signInWithGitHub,
    signInWithGoogle,
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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        onSubmit={
          loginStep === "email" ? handleEmailSubmit : handlePasswordSubmit
        }
      >
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
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  autoFocus
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loginIsLoading}>
                  {loginIsLoading ? "Signing in..." : "Sign in"}
                </Button>
              </Field>
            </>
          )}
          {loginStep === "email" && (
            <>
              <FieldSeparator>Or</FieldSeparator>
              <Field className="grid gap-4 sm:grid-cols-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={signInWithGitHub}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with GitHub
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={signInWithGoogle}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
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
