/**
 * Centralized API Configuration
 * Contains all API endpoints and configuration used throughout the application
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * Authentication API Endpoints
 */
export const API_ENDPOINTS = {
  auth: {
    signIn: `${API_BASE_URL}/api/auth/signin`,
    signUp: `${API_BASE_URL}/api/auth/signup`,
    signOut: `${API_BASE_URL}/api/auth/signout`,
    verification: `${API_BASE_URL}/api/auth/verification`,
    resetPassword: `${API_BASE_URL}/api/auth/reset-password`,
    forgetPassword: `${API_BASE_URL}/api/auth/forget-password`,
    changePassword: `${API_BASE_URL}/api/auth/change-password`,
    me: `${API_BASE_URL}/api/auth/me`,
  },
} as const;

/**
 * API Configuration
 */
export const API_CONFIG = {
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
} as const;

/**
 * Helper function to make API calls with consistent configuration
 */
export async function apiCall<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ data: T; error?: never } | { data?: never; error: string }> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || `Request failed with status ${response.status}`,
      };
    }

    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
    };
  }
}
