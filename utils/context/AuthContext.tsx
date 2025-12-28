"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { Accounts, AuthContextType, UserRole } from "@/types/auth";

import { API_ENDPOINTS, apiCall } from "@/lib/config";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Accounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);
  const [resetToken, setResetToken] = useState<string | null>(null);
  // Password reset flow state
  const [passwordResetStep, setPasswordResetStep] = useState<
    "otp" | "password"
  >("otp");
  const [passwordResetOtp, setPasswordResetOtp] = useState("");
  const [passwordResetNewPassword, setPasswordResetNewPassword] = useState("");
  const [passwordResetConfirmPassword, setPasswordResetConfirmPassword] =
    useState("");
  const [passwordResetIsLoading, setPasswordResetIsLoading] = useState(false);
  // Login form state
  const [loginStep, setLoginStep] = useState<"email" | "password">("email");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginIsLoading, setLoginIsLoading] = useState(false);

  // Forget password form state
  const [forgetPasswordEmail, setForgetPasswordEmail] = useState("");
  const [forgetPasswordIsLoading, setForgetPasswordIsLoading] = useState(false);
  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupIsLoading, setSignupIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for existing JWT token and fetch user data
    const initializeAuth = async () => {
      const token = document.cookie
        .split(';')
        .find(cookie => cookie.trim().startsWith('token='))
        ?.split('=')[1];

      if (token) {
        try {
          // Fetch the complete user data from the API
          const userResponse = await apiCall<Accounts>(API_ENDPOINTS.auth.me, {
            method: "GET",
          });

          if (userResponse.error || !userResponse.data) {
            // Token exists but user data is invalid, clear the cookie
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setUser(null);
            setUserRole(null);
          } else {
            const account = userResponse.data;
            setUser(account);
            setUserRole(account.role);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          // Error occurred while fetching user data, clear the cookie
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          setUser(null);
          setUserRole(null);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);



  const signIn = async (email: string, password: string) => {
    try {
      // Call the sign-in API directly
      const result = await apiCall(API_ENDPOINTS.auth.signIn, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      // Fetch the complete user data from the API
      const userResponse = await apiCall<Accounts>(API_ENDPOINTS.auth.me, {
        method: "GET",
      });

      if (userResponse.error || !userResponse.data) {
        throw new Error(userResponse.error || "Failed to fetch user data");
      }

      const account = userResponse.data;
      setUser(account);
      setUserRole(account.role);

      // Show success message and navigate based on role
      if (account.role === "admins") {
        toast.success("Welcome back, Admin!", {
          duration: 2000,
        });
        router.push("/dashboard");
      } else {
        toast.success("Welcome back!", {
          duration: 2000,
        });
        router.push("/");
      }

      // Return the fetched user data
      return account;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return;
    }
  };

  const signOut = async () => {
    try {
      // Make a request to our custom signout endpoint to clear JWT cookie
      await fetch(API_ENDPOINTS.auth.signOut, {
        method: "POST",
        credentials: "include",
      });

      // Clear JWT token cookie
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Clear local state
      setUser(null);
      setUserRole(null);

      toast.success("Logged out successfully!", {
        duration: 2000,
      });

      // Redirect manually to signin page with logout parameter
      router.push("/signin?logout=true");
    } catch {
      // Clear local state even if API calls fail
      setUser(null);
      setUserRole(null);

      // Clear JWT token cookie
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Clear any potential JWT tokens from cookies by making API call
      try {
        await fetch(API_ENDPOINTS.auth.signOut, {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.error("Error during sign out API call:", err);
      }

      toast.success("Logged out successfully!", {
        duration: 2000,
      });

      // Redirect manually to signin page with logout parameter
      router.push("/signin?logout=true");
    }
  };

  const refreshUserData = async (): Promise<Accounts | null> => {
    try {
      const response = await apiCall<Accounts>(API_ENDPOINTS.auth.me, {
        method: "GET",
      });

      if (response.error || !response.data) {
        return null;
      }

      const account = response.data;
      setUser(account);
      setUserRole(account.role);

      return account;
    } catch {
      return null;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await apiCall(API_ENDPOINTS.auth.resetPassword, {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("OTP has been sent to your email!", {
        duration: 3000,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      // Rethrow so callers (e.g., ForgetPassword) can stop navigation and show inline error
      throw new Error(errorMessage);
    }
  };

  const forgetPassword = async (email: string) => {
    try {
      const result = await apiCall(API_ENDPOINTS.auth.forgetPassword, {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Password reset code sent to your email!", {
        duration: 3000,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      if (!user?._id) {
        toast.error("User not authenticated");
        return false;
      }

      const result = await apiCall(API_ENDPOINTS.auth.changePassword, {
        method: "PUT",
        body: JSON.stringify({
          userId: user._id,
          newPassword,
        }),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Password updated successfully!");
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return false;
    }
  };

  const verifyOtp = async (token: string) => {
    try {
      const result = await apiCall(API_ENDPOINTS.auth.verification, {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      if (result.error) {
        throw new Error(result.error);
      }
      setResetToken(token);
      toast.success("OTP verified. Redirecting...");
      router.push("/reset-password");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);
      throw new Error(message);
    }
  };

  const finalizeResetPassword = async (newPassword: string) => {
    try {
      if (!resetToken) {
        throw new Error("Missing token. Please verify OTP again.");
      }

      const result = await apiCall(API_ENDPOINTS.auth.verification, {
        method: "POST",
        body: JSON.stringify({ token: resetToken, newPassword }),
      });

      if (result.error) {
        throw new Error(result.error);
      }
      toast.success("Password reset successful. Redirecting...");
      setResetToken(null);
      router.push("/signin");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);
      throw new Error(message);
    }
  };

  const handleVerifyOtpForPasswordReset = async (otp: string) => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    toast.success("OTP verified!");
    setPasswordResetStep("password");
  };

  const handleResetPasswordWithOtp = async () => {
    if (!passwordResetNewPassword || !passwordResetConfirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (passwordResetNewPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (passwordResetNewPassword !== passwordResetConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setPasswordResetIsLoading(true);

    try {
      const result = await apiCall(API_ENDPOINTS.auth.resetPassword, {
        method: "PUT",
        body: JSON.stringify({
          token: passwordResetOtp,
          newPassword: passwordResetNewPassword,
        }),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Password reset successfully!");
      router.push("/signin");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setPasswordResetIsLoading(false);
    }
  };

  const resetPasswordFlowState = () => {
    setPasswordResetStep("otp");
    setPasswordResetOtp("");
    setPasswordResetNewPassword("");
    setPasswordResetConfirmPassword("");
    setPasswordResetIsLoading(false);
  };

  // Login form functions
  const handleEmailSubmit = async () => {
    if (!loginEmail) {
      return;
    }

    setLoginIsLoading(true);

    try {
      // Check if account exists
      const result = await apiCall<{
        exists: boolean;
      }>(`${API_ENDPOINTS.auth.signIn}/check`, {
        method: "POST",
        body: JSON.stringify({ email: loginEmail }),
      });

      if (result.error || !result.data) {
        throw new Error(result.error || "Failed to check email");
      }

      if (!result.data.exists) {
        throw new Error("No account found with this email");
      }


      // Email account found, show password field
      setLoginStep("password");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setLoginIsLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!loginEmail || !loginPassword) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoginIsLoading(true);

    try {
      const account = await signIn(loginEmail, loginPassword);
      if (account) {
        resetLoginState();
      }
    } catch {
    } finally {
      setLoginIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setLoginStep("email");
    setLoginPassword("");
  };

  const resetLoginState = () => {
    setLoginStep("email");
    setLoginEmail("");
    setLoginPassword("");
    setLoginIsLoading(false);
  };

  // Forget password form functions
  const handleForgetPasswordSubmit = async () => {
    if (!forgetPasswordEmail) {
      toast.error("Please enter your email");
      return;
    }

    setForgetPasswordIsLoading(true);

    try {
      const result = await apiCall(API_ENDPOINTS.auth.forgetPassword, {
        method: "POST",
        body: JSON.stringify({ email: forgetPasswordEmail }),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Password reset code sent to your email!", {
        duration: 3000,
      });

      // Redirect to change-password page with email parameter
      setTimeout(() => {
        router.push(
          `/change-password?email=${encodeURIComponent(forgetPasswordEmail)}`
        );
      }, 1500);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send reset code. Please try again.";
      toast.error(errorMessage);
    } finally {
      setForgetPasswordIsLoading(false);
    }
  };

  const resetForgetPasswordState = () => {
    setForgetPasswordEmail("");
    setForgetPasswordIsLoading(false);
  };

  // Signup form functions
  const handleSignupSubmit = async (
    name: string,
    email: string,
    password: string,
    confirmPassword?: string
  ) => {
    // Basic validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setSignupIsLoading(true);

    try {
      // Call the signUp function from AuthContext
      await signUp(name, email, password);
      // Reset the form after successful signup
      resetSignupState();
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setSignupIsLoading(false);
    }
  };

  const resetSignupState = () => {
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    setSignupIsLoading(false);
  };

  const signUp = async (name: string, email: string, password: string) => {
    // For email/password signup, we still use the existing API route
    try {
      const result = await apiCall<{ userId: string }>(
        API_ENDPOINTS.auth.signUp,
        {
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      if (result.error || !result.data) {
        throw new Error(result.error || "Failed to sign up");
      }

      const { userId } = result.data;

      // The API returns userId after successful signup, but we need to fetch user details
      // For now, we'll create a minimal account object and the user will be fully populated after verification
      const account: Accounts = {
        _id: userId,
        email: email,
        name: name,
        role: "user", // Default role
        status: "active", // Default status
        picture: undefined,
        isVerified: "false", // Will be verified later
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(account);
      setUserRole(account.role);

      // Show success message and redirect to verification page
      toast.success("Account created successfully! Please verify your email.", {
        duration: 2000,
      });
      router.push(`/verification?email=${encodeURIComponent(email)}`);

      return account;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return;
    }
  };



  const value = {
    user,
    loading,
    userRole,
    signIn,
    signOut,
    signUp,
    refreshUserData, // Added function to refresh user data from database

    resetPassword,
    forgetPassword,
    changePassword,
    resetToken,
    setResetToken,
    verifyOtp,
    finalizeResetPassword,
    // Password reset flow state
    passwordResetStep,
    passwordResetOtp,
    passwordResetNewPassword,
    passwordResetConfirmPassword,
    passwordResetIsLoading,
    // Password reset flow functions
    setPasswordResetStep,
    setPasswordResetOtp,
    setPasswordResetNewPassword,
    setPasswordResetConfirmPassword,
    setPasswordResetIsLoading,
    handleVerifyOtpForPasswordReset,
    handleResetPasswordWithOtp,
    resetPasswordFlowState,
    // Login form state
    loginStep,
    loginEmail,
    loginPassword,
    loginIsLoading,
    // Login form functions
    setLoginStep,
    setLoginEmail,
    setLoginPassword,
    setLoginIsLoading,
    handleEmailSubmit,
    handlePasswordSubmit,
    handleBackToEmail,
    resetLoginState,
    // Forget password form state
    forgetPasswordEmail,
    forgetPasswordIsLoading,
    // Forget password form functions
    setForgetPasswordEmail,
    setForgetPasswordIsLoading,
    handleForgetPasswordSubmit,
    resetForgetPasswordState,
    // Signup form state
    signupName,
    signupEmail,
    signupPassword,
    signupConfirmPassword,
    signupIsLoading,
    // Signup form functions
    setSignupName,
    setSignupEmail,
    setSignupPassword,
    setSignupConfirmPassword,
    setSignupIsLoading,
    handleSignupSubmit,
    resetSignupState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
