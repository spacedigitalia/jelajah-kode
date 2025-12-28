import { z } from "zod";

const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .regex(
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
    "Email must be a Gmail address (@gmail.com)"
  );

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  );

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters long")
  .max(50, "Name must be at most 50 characters long")
  .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters and spaces");

const signupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

const forgetPasswordSchema = z.object({
  email: emailSchema,
});

const passwordResetSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const otpSchema = z.string().length(6, "OTP must be 6 characters long");

export const useValidation = () => {
  return {
    emailSchema,
    passwordSchema,
    nameSchema,
    signupSchema,
    loginSchema,
    forgetPasswordSchema,
    passwordResetSchema,
    otpSchema,
  };
};

export {
  emailSchema,
  passwordSchema,
  nameSchema,
  signupSchema,
  loginSchema,
  forgetPasswordSchema,
  passwordResetSchema,
  otpSchema,
};
