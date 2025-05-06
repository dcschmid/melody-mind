import jwt from "jsonwebtoken";
import type { User } from "./db.js";

// Constants for JWT settings
const JWT_SECRET = process.env.JWT_SECRET || "melody-mind-jwt-secret"; // In production, this should be a secure environment variable
const JWT_EXPIRES_IN = "24h"; // Token expires after 24 hours
const JWT_REFRESH_EXPIRES_IN = "7d"; // Refresh token expires after 7 days

// Types for JWT tokens
export type JwtPayload = {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

/**
 * Generates a JWT token for a user
 *
 * @param user - The user object containing id and email
 * @returns A signed JWT access token
 */
export function generateAccessToken(user: User): string {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Generates a refresh token for a user
 *
 * @param user - The user object containing id and email
 * @returns A signed JWT refresh token
 */
export function generateRefreshToken(user: User): string {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET + "-refresh", {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}

/**
 * Generates a token pair (access token and refresh token)
 *
 * @param user - The user object containing id and email
 * @returns An object containing both access and refresh tokens
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
 * @param token - The JWT access token to verify
 * @returns The decoded payload if valid, null otherwise
 */
export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Verifies a refresh token and returns the payload
 *
 * @param token - The JWT refresh token to verify
 * @returns The decoded payload if valid, null otherwise
 */
export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET + "-refresh") as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Renews an access token using a valid refresh token
 *
 * @param refreshToken - The refresh token to use for renewal
 * @returns A new access token if successful, null otherwise
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload || !payload.userId) {
    return null;
  }

  // Here, a database query could be performed to check if the refresh token
  // is still valid and hasn't been revoked. For this example, this step is skipped.

  const newPayload: JwtPayload = {
    userId: payload.userId,
    email: payload.email,
  };

  return jwt.sign(newPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Checks if a token is valid and returns a boolean
 *
 * @param token - The JWT token to check
 * @returns True if the token is valid, false otherwise
 */
export async function isAuthenticated(token: string): Promise<boolean> {
  try {
    const payload = verifyAccessToken(token);
    return payload !== null;
  } catch {
    return false;
  }
}
