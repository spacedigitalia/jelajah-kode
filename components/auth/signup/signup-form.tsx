"use client";

import { Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { signupSchema } from "@/hooks/validation";

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

import { useAuth } from "@/utils/context/AuthContext";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    handleSignupSubmit,
    signupIsLoading,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormSignupValues) => {
    await handleSignupSubmit(
      data.name,
      data.email,
      data.password,
      data.confirmPassword
    );
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            {...register("name")}
            type="text"
            placeholder="John Doe"
          />
          {errors.name && (
            <FieldDescription className="text-red-500">
              {errors.name.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            {...register("email")}
            type="email"
            placeholder="yourname@gmail.com"
          />
          {errors.email && (
            <FieldDescription className="text-red-500">
              {errors.email.message}
            </FieldDescription>
          )}
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput
            id="password"
            {...register("password")}
            placeholder="At least 8 characters"
          />
          {errors.password && (
            <FieldDescription className="text-red-500">
              {errors.password.message}
            </FieldDescription>
          )}
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <PasswordInput
            id="confirm-password"
            {...register("confirmPassword")}
            placeholder="Re-enter your password"
          />
          {errors.confirmPassword && (
            <FieldDescription className="text-red-500">
              {errors.confirmPassword.message}
            </FieldDescription>
          )}
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit" disabled={signupIsLoading}>
            {signupIsLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {signupIsLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </Field>

        <FieldDescription className="px-6 text-center">
          Already have an account? <a href="/signin">Sign in</a>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
