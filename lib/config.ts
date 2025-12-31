// Use relative paths for same-origin API calls
// Only use absolute URL if explicitly needed for cross-origin requests
// Remove trailing slash if present to avoid double slashes
const getBaseUrl = () => {
  // If explicitly set in environment variable, validate and use it
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL.trim();
    // Remove trailing slash
    const cleaned = baseUrl.replace(/\/$/, "");

    // If it doesn't start with http:// or https://, it's not a valid absolute URL
    // In that case, return empty string to use relative paths
    if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
      console.warn(
        "NEXT_PUBLIC_BASE_URL should start with http:// or https://. Using relative paths instead."
      );
      return "";
    }

    return cleaned;
  }

  // Always use relative paths by default for same-origin requests
  return "";
};

const API_BASE_URL = getBaseUrl();

const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;

// Helper to construct API endpoint URLs
const createEndpoint = (path: string) => {
  // Ensure path starts with /
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  // Remove any domain that might be in the path itself (clean it first)
  cleanPath = cleanPath.replace(/^\/[^\/]+\.(vercel\.app|localhost|local)/, "");

  // If base URL is set and is a valid absolute URL, use it
  if (
    API_BASE_URL &&
    (API_BASE_URL.startsWith("http://") || API_BASE_URL.startsWith("https://"))
  ) {
    const fullUrl = `${API_BASE_URL}${cleanPath}`;
    // Log in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.log(`[API_CONFIG] Using absolute URL: ${fullUrl}`);
    }
    return fullUrl;
  }

  // Otherwise, use relative path (same-origin) - this is the preferred method
  // Log in development for debugging
  if (process.env.NODE_ENV === "development") {
    console.log(`[API_CONFIG] Using relative path: ${cleanPath}`);
  }
  return cleanPath;
};

export const API_CONFIG = {
  ENDPOINTS: {
    signIn: createEndpoint("/api/auth/signin"),
    signUp: createEndpoint("/api/auth/signup"),
    signOut: createEndpoint("/api/auth/signout"),
    verification: createEndpoint("/api/auth/verification"),
    resetPassword: createEndpoint("/api/auth/reset-password"),
    forgetPassword: createEndpoint("/api/auth/forget-password"),
    changePassword: createEndpoint("/api/auth/change-password"),
    me: createEndpoint("/api/auth/me"),
  },
  SECRET: API_SECRET,
};
