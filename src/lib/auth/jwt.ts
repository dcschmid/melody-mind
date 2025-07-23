import jwt from "jsonwebtoken";

import type { User } from "./db.js";

// Constants for JWT settings
const JWT_SECRET = process.env.JWT_SECRET || "melody-mind-jwt-secret"; // In production, this should be a secure environment variable
const JWT_EXPIRES_IN = "14d"; // Token expires after 14 days
const JWT_REFRESH_EXPIRES_IN = "14d"; // Refresh token expires after 14 days

/**
 * Branded type for token strings to prevent mixing with regular strings
 * @category Authentication
 */
export type JwtToken = string & { readonly __brand: unique symbol };

/**
 * Token types used in the authentication system
 * @category Authentication
 */
export type TokenType = "access" | "refresh";

/**
 * JWT payload structure with improved type safety
 * @category Authentication
 */
export interface JwtPayload {
  /** Unique identifier for the user */
  userId: string;
  /** User's email address */
  email: string;
  /** Token type (access or refresh) */
  type: TokenType;
  /** Issued at timestamp (added by JWT library) */
  iat?: number;
  /** Expiration timestamp (added by JWT library) */
  exp?: number;
}

/**
 * Token pair containing both access and refresh tokens
 * @category Authentication
 */
export interface TokenPair {
  /** Token used for API access (short-lived) */
  accessToken: JwtToken;
  /** Token used to obtain new access tokens (long-lived) */
  refreshToken: JwtToken;
}

/**
 * Custom error class for JWT-related errors
 * @category Authentication
 */
export class JwtError extends Error {
  /**
   * Creates a new JWT error
   * @param {string} message - Error message
   * @param {("invalid_token"|"expired_token"|"malformed_token"|"revoked_token")} code - Error code for more specific error handling
   */
  constructor(
    message: string,
    public readonly code:
      | "invalid_token"
      | "expired_token"
      | "malformed_token"
      | "revoked_token" = "invalid_token"
  ) {
    super(message);
    this.name = "JwtError";
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, JwtError.prototype);
  }
}

/**
 * Type guard to check if an error is a JwtError
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is a JwtError
 */
export function isJwtError(error: unknown): error is JwtError {
  return error instanceof JwtError;
}

/**
 * Generates a JWT access token for a user
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {User} user - The user object containing id and email
 * @returns {JwtToken} A signed JWT access token
 *
 * @example
 * // Generate an access token for a user
 * const token = generateAccessToken({
 *   id: "user123",
 *   email: "user@example.com",
 *   username: "johndoe"
 * });
 */
export function generateAccessToken(user: User): JwtToken {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    type: "access",
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  }) as JwtToken;
}

/**
 * Generates a refresh token for a user
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {User} user - The user object containing id and email
 * @returns {JwtToken} A signed JWT refresh token
 *
 * @example
 * // Generate a refresh token for a user
 * const refreshToken = generateRefreshToken({
 *   id: "user123",
 *   email: "user@example.com",
 *   username: "johndoe"
 * });
 */
export function generateRefreshToken(user: User): JwtToken {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    type: "refresh",
  };

  return jwt.sign(payload, `${JWT_SECRET}-refresh`, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  }) as JwtToken;
}

/**
 * Generates a token pair (access token and refresh token)
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {User} user - The user object containing id and email
 * @returns {TokenPair} An object containing both access and refresh tokens
 *
 * @example
 * // Generate token pair for authentication
 * const { accessToken, refreshToken } = generateTokenPair({
 *   id: "user123",
 *   email: "user@example.com",
 *   username: "johndoe"
 * });
 */
export function generateTokenPair(user: User): TokenPair {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}

/**
 * Verifies a JWT token and returns the payload
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} token - The JWT access token to verify
 * @returns {JwtPayload} The decoded payload
 * @throws {JwtError} When token is invalid, expired, or malformed
 *
 * @example
 * // Verify an access token
 * try {
 *   const payload = verifyAccessToken(accessToken);
 *   console.log(`User ID: ${payload.userId}`);
 * } catch (error) {
 *   if (isJwtError(error)) {
 *     console.error(`JWT Error: ${error.message}, Code: ${error.code}`);
 *   }
 * }
 */
export function verifyAccessToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Validate that it's an access token
    if (decoded.type !== "access") {
      throw new JwtError("Token type is not valid for this operation", "invalid_token");
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new JwtError("Token has expired", "expired_token");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new JwtError("Invalid token", "malformed_token");
    } else if (error instanceof JwtError) {
      throw error;
    } else {
      throw new JwtError("Failed to verify token");
    }
  }
}

/**
 * Safe version of verifyAccessToken that doesn't throw exceptions
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} token - The JWT access token to verify
 * @returns {JwtPayload | null} The decoded payload if valid, null otherwise
 *
 * @example
 * // Safely verify an access token without exceptions
 * const payload = safeVerifyAccessToken(accessToken);
 * if (payload) {
 *   console.log(`User authenticated: ${payload.email}`);
 * } else {
 *   console.log("Authentication failed");
 * }
 */
export function safeVerifyAccessToken(token: string): JwtPayload | null {
  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

/**
 * Verifies a refresh token and returns the payload
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} token - The JWT refresh token to verify
 * @returns {JwtPayload} The decoded payload
 * @throws {JwtError} When token is invalid, expired, or malformed
 *
 * @example
 * // Verify a refresh token
 * try {
 *   const payload = verifyRefreshToken(refreshToken);
 *   console.log(`Token valid for user: ${payload.email}`);
 * } catch (error) {
 *   if (isJwtError(error)) {
 *     console.error(`Error: ${error.message}`);
 *   }
 * }
 */
export function verifyRefreshToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, `${JWT_SECRET}-refresh`) as JwtPayload;

    // Validate that it's a refresh token
    if (decoded.type !== "refresh") {
      throw new JwtError("Token type is not valid for this operation", "invalid_token");
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new JwtError("Refresh token has expired", "expired_token");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new JwtError("Invalid refresh token", "malformed_token");
    } else if (error instanceof JwtError) {
      throw error;
    } else {
      throw new JwtError("Failed to verify refresh token");
    }
  }
}

/**
 * Safe version of verifyRefreshToken that doesn't throw exceptions
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} token - The JWT refresh token to verify
 * @returns {JwtPayload | null} The decoded payload if valid, null otherwise
 */
export function safeVerifyRefreshToken(token: string): JwtPayload | null {
  try {
    return verifyRefreshToken(token);
  } catch {
    return null;
  }
}

/**
 * Renews an access token using a valid refresh token
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} refreshToken - The refresh token to use for renewal
 * @returns {Promise<JwtToken>} A new access token if successful
 * @throws {JwtError} When refresh token is invalid or expired
 *
 * @example
 * // Refresh an access token
 * try {
 *   const newToken = await refreshAccessToken(refreshToken);
 *   console.log("Token refreshed successfully");
 * } catch (error) {
 *   if (isJwtError(error)) {
 *     if (error.code === "expired_token") {
 *       console.error("Refresh token has expired, please login again");
 *     } else {
 *       console.error(`Error refreshing token: ${error.message}`);
 *     }
 *   }
 * }
 */
export async function refreshAccessToken(refreshToken: string): Promise<JwtToken> {
  // Verify will throw if the token is invalid
  const payload = verifyRefreshToken(refreshToken);

  if (!payload.userId) {
    throw new JwtError("Invalid refresh token payload", "malformed_token");
  }

  // Here, a database query could be performed to check if the refresh token
  // is still valid and hasn't been revoked. For this example, this step is skipped.

  const newPayload: JwtPayload = {
    userId: payload.userId,
    email: payload.email,
    type: "access",
  };

  return jwt.sign(newPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  }) as JwtToken;
}

/**
 * Safe version of refreshAccessToken that doesn't throw exceptions
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} refreshToken - The refresh token to use for renewal
 * @returns {Promise<JwtToken | null>} A new access token if successful, null otherwise
 */
export async function safeRefreshAccessToken(refreshToken: string): Promise<JwtToken | null> {
  try {
    return await refreshAccessToken(refreshToken);
  } catch {
    return null;
  }
}

/**
 * Checks if a token is valid and returns a boolean
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} token - The JWT token to check
 * @returns {Promise<boolean>} True if the token is valid, false otherwise
 *
 * @example
 * // Check if a user is authenticated
 * const authenticated = await isAuthenticated(token);
 * if (authenticated) {
 *   console.log("User is authenticated");
 * } else {
 *   console.log("Authentication failed");
 * }
 */
export async function isAuthenticated(token: string): Promise<boolean> {
  try {
    verifyAccessToken(token);
    return true;
  } catch {
    return false;
  }
}
