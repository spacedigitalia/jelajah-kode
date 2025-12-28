import { IAccount } from "@/models/Account";

type UserRole = "admins" | "user";

interface Accounts {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  picture?: string;
  status: "active" | "inactive";
  isVerified: "true" | "false" | boolean;
  password?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: Accounts | null;
  loading: boolean;
  userRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<Accounts | undefined>;
  signOut: () => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<Accounts | undefined>;

  resetPassword: (email: string) => Promise<void>;
  forgetPassword: (email: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<boolean>;
  resetToken: string | null;
  setResetToken: (token: string | null) => void;
  verifyOtp: (token: string) => Promise<void>;
  finalizeResetPassword: (newPassword: string) => Promise<void>;
  // Password reset flow state
  passwordResetStep: "otp" | "password";
  passwordResetOtp: string;
  passwordResetNewPassword: string;
  passwordResetConfirmPassword: string;
  passwordResetIsLoading: boolean;
  // Password reset flow functions
  setPasswordResetStep: (step: "otp" | "password") => void;
  setPasswordResetOtp: (otp: string) => void;
  setPasswordResetNewPassword: (password: string) => void;
  setPasswordResetConfirmPassword: (password: string) => void;
  setPasswordResetIsLoading: (loading: boolean) => void;
  handleVerifyOtpForPasswordReset: (otp: string) => Promise<void>;
  handleResetPasswordWithOtp: () => Promise<void>;
  resetPasswordFlowState: () => void;
  // Login form state
  loginStep: "email" | "password";
  loginEmail: string;
  loginPassword: string;
  loginIsLoading: boolean;

  // Login form functions
  setLoginStep: (step: "email" | "password") => void;
  setLoginEmail: (email: string) => void;
  setLoginPassword: (password: string) => void;
  setLoginIsLoading: (loading: boolean) => void;
  handleEmailSubmit: () => Promise<void>;
  handlePasswordSubmit: () => Promise<void>;
  handleBackToEmail: () => void;
  resetLoginState: () => void;
  // Forget password form state
  forgetPasswordEmail: string;
  forgetPasswordIsLoading: boolean;
  // Forget password form functions
  setForgetPasswordEmail: (email: string) => void;
  setForgetPasswordIsLoading: (loading: boolean) => void;
  handleForgetPasswordSubmit: () => Promise<void>;
  resetForgetPasswordState: () => void;
  // Signup form state
  signupName: string;
  signupEmail: string;
  signupPassword: string;
  signupConfirmPassword: string;
  signupIsLoading: boolean;
  // Signup form functions
  setSignupName: (name: string) => void;
  setSignupEmail: (email: string) => void;
  setSignupPassword: (password: string) => void;
  setSignupConfirmPassword: (confirmPassword: string) => void;
  setSignupIsLoading: (loading: boolean) => void;
  handleSignupSubmit: (
    name: string,
    email: string,
    password: string,
    confirmPassword?: string
  ) => Promise<void>;
  resetSignupState: () => void;
}

export interface IAccount extends mongoose.Document {
  email: string;
  password?: string; // Optional for OAuth users
  name: string;
  role: UserRole;
  picture?: string;
  status: "active" | "inactive";
  isVerified: "true" | "false" | boolean;
  resetToken?: string;
  resetTokenExpiry?: Date;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isModified(path: string): boolean;
  save(): Promise<this>;
  populate(path: string): Promise<this>;
}
