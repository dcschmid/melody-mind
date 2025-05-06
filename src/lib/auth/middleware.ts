import { verifyAccessToken } from "./jwt.js";
import type { JwtPayload } from "./jwt.js";
import { getUserByEmail } from "./db.js";
import { csrfProtection } from "./csrf.js";
import { rateLimitMiddleware } from "./rate-limit.js";

/**
 * Type for authentication context.
 * Contains information about authentication status and user details.
 */
export type AuthContext = {
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
  };
  error?: string;
};

/**
 * Authentication middleware for requests.
 * Extracts and verifies the JWT token from the Authorization header.
 *
 * @param request - The incoming request object
 * @returns AuthContext containing authentication status and user information if successful
 */
export async function authenticateRequest(
  request: Request,
): Promise<AuthContext> {
  // Extract token from Authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      authenticated: false,
      error: "No authentication token provided",
    };
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix from header

  // Verify the token
  const payload = verifyAccessToken(token);
  if (!payload) {
    return {
      authenticated: false,
      error: "Invalid or expired token",
    };
  }

  // Optional: Fetch additional user information from the database
  // In a real application, user roles could be loaded here
  const user = await getUserByEmail(payload.email);
  if (!user) {
    return { authenticated: false, error: "User not found" };
  }

  return {
    authenticated: true,
    user: {
      id: payload.userId,
      email: payload.email,
    },
  };
}

/**
 * Middleware to protect routes that require authentication.
 * Wraps authenticateRequest with a standardized response format.
 *
 * @param request - The incoming request object
 * @returns Object containing authorization status and context information
 */
export async function requireAuth(
  request: Request,
): Promise<{ authorized: boolean; context?: AuthContext; error?: string }> {
  const authContext = await authenticateRequest(request);

  if (!authContext.authenticated) {
    return {
      authorized: false,
      error: authContext.error || "Not authenticated",
    };
  }

  return {
    authorized: true,
    context: authContext,
  };
}

/**
 * Combined middleware for authentication, CSRF protection and rate limiting.
 * This function should be used for all POST/PUT/DELETE requests.
 *
 * @param request - The incoming request object
 * @returns Object containing authorization status, context, and additional security information
 */
export async function protectRoute(request: Request): Promise<{
  authorized: boolean;
  context?: AuthContext;
  error?: string;
  rateLimited?: boolean;
  resetTime?: number;
}> {
  // Check rate limiting for login routes
  if (request.url.includes("/api/auth/login")) {
    const rateLimitResult = rateLimitMiddleware(request);
    if (rateLimitResult.limited) {
      return {
        authorized: false,
        error: "Too many login attempts. Please try again later.",
        rateLimited: true,
        resetTime: rateLimitResult.resetTime,
      };
    }
  }

  // Check CSRF protection for mutations (POST, PUT, DELETE)
  const method = request.method.toUpperCase();
  if (["POST", "PUT", "DELETE"].includes(method)) {
    const csrfValid = csrfProtection(request);
    if (!csrfValid) {
      return {
        authorized: false,
        error: "Invalid or missing CSRF token",
      };
    }
  }

  // Check authentication
  return requireAuth(request);
}

/**
 * Helper function to extract the client IP address from a request
 *
 * @param request - The incoming request object
 * @returns The client's IP address as a string
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown-ip"
  );
}
