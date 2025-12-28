import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (payload: Record<string, unknown>) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

/**
 * Generate a random token for password reset
 * @returns {string} A random token string
 */
export const generateRandomToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
};

/**
 * Generate a JWT token for authentication
 * @param {Object} payload - The data to encode in the token
 * @returns {Promise<string>} A JWT token
 */
export const generateJWT = (
  payload: Record<string, unknown>
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!process.env.JWT_SECRET) {
      reject(new Error("JWT_SECRET is not defined"));
      return;
    }

    const options: jwt.SignOptions = {
      expiresIn: "24h",
    };

    jwt.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
      if (err) {
        reject(err);
      } else if (token) {
        resolve(token);
      } else {
        reject(new Error("Failed to generate token"));
      }
    });
  });
};

/**
 * Verify a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Promise<Record<string, unknown>>} The decoded payload if token is valid
 */
export const verifyJWT = (token: string): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    if (!process.env.JWT_SECRET) {
      reject(new Error("JWT_SECRET is not defined"));
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          reject(new Error("Token has expired"));
        } else if (err.name === "JsonWebTokenError") {
          reject(new Error("Invalid token"));
        } else {
          reject(err);
        }
      } else if (decoded && typeof decoded === "object") {
        resolve(decoded);
      } else {
        reject(new Error("Invalid decoded token"));
      }
    });
  });
};
