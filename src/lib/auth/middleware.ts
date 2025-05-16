import { csrfProtection } from "./csrf.js";
import { getUserByEmail, type UserId, type EmailAddress, createUserId } from "./db.js";
import { verifyAccessToken } from "./jwt.js";
import { rateLimitMiddleware } from "./rate-limit.js";

/**
 * Template literal type for standardized authentication error messages
 * @since 3.0.0
 */
export type AuthErrorCode =
  | "auth:no_token"
  | "auth:invalid_token"
  | "auth:expired_token"
  | "auth:user_not_found"
  | "auth:csrf_invalid"
  | "auth:rate_limited";

/**
 * Specialized error class for authentication errors
 * @since 3.0.0
 * @category Authentication
 */
export class AuthError extends Error {
  /** Specific error code for programmatic handling */
  public readonly code: AuthErrorCode;

  /**
   * Creates a new AuthError instance
   *
   * @param {string} message - Human-readable error message
   * @param {AuthErrorCode} code - Machine-readable error code
   */
  constructor(message: string, code: AuthErrorCode) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

/**
 * Type guard to check if an error is an AuthError
 *
 * @param {unknown} error - Error to check
 * @returns {boolean} True if the error is an AuthError
 *
 * @example
 * try {
 *   // Authentication code
 * } catch (error: unknown) {
 *   if (isAuthError(error)) {
 *     console.error(`Auth error (${error.code}): ${error.message}`);
 *   } else {
 *     console.error("Unknown error", error);
 *   }
 * }
 */
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

/**
 * Type for authentication context.
 * Contains information about authentication status and user details.
 *
 * @since 3.0.0
 * @category Authentication
 */
export type AuthContext = {
  /** Whether the user is authenticated */
  authenticated: boolean;
  /** User information when authenticated */
  user?: {
    /** The unique user identifier */
    id: UserId;
    /** The user's email address */
    email: EmailAddress;
  };
  /** Error message when authentication fails */
  error?: string;
  /** Specific error code for programmatic handling */
  errorCode?: AuthErrorCode;
};

/**
 * Result type for authentication operations
 * @since 3.0.0
 */
export type AuthResult = {
  /** Whether the authentication was successful */
  authorized: boolean;
  /** Authentication context containing user information */
  context?: AuthContext;
  /** Error message when authentication fails */
  error?: string;
  /** Whether the request was rate limited */
  rateLimited?: boolean;
  /** Time until rate limit reset (in milliseconds) */
  resetTime?: number;
};

/**
 * Authentication middleware for requests.
 * Extracts and verifies the JWT token from the Authorization header.
 *
 * @since 3.0.0
 * @category Middleware
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<AuthContext>} AuthContext containing authentication status and user information if successful
 *
 * @throws {AuthError} When token verification fails
 *
 * @example
 * // Authenticate a request with Bearer token
 * const authContext = await authenticateRequest(request);
 * if (authContext.authenticated) {
 *   console.log(`User authenticated: ${authContext.user.email}`);
 * } else {
 *   console.error(`Authentication failed: ${authContext.error}`);
 * }
 */
export async function authenticateRequest(request: Request): Promise<AuthContext> {
  // Extract token from Authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      authenticated: false,
      error: "No authentication token provided",
      errorCode: "auth:no_token",
    };
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix from header

  // Verify the token
  const payload = verifyAccessToken(token);
  if (!payload) {
    return {
      authenticated: false,
      error: "Invalid or expired token",
      errorCode: "auth:invalid_token",
    };
  }

  // Optional: Fetch additional user information from the database
  // In a real application, user roles could be loaded here
  const user = await getUserByEmail(payload.email);
  if (!user) {
    return {
      authenticated: false,
      error: "User not found",
      errorCode: "auth:user_not_found",
    };
  }

  return {
    authenticated: true,
    user: {
      // Use the createUserId helper to convert a regular string to a branded UserId
      id: createUserId(payload.userId),
      // Type assertion for email since we know it's valid (came from JWT and was verified in the database)
      email: payload.email as EmailAddress,
    },
  };
}

/**
 * Middleware to protect routes that require authentication.
 * Wraps authenticateRequest with a standardized response format.
 *
 * @since 3.0.0
 * @category Middleware
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<AuthResult>} Object containing authorization status and context information
 *
 * @example
 * // Check if a route requires authentication
 * const authResult = await requireAuth(request);
 * if (!authResult.authorized) {
 *   return new Response(JSON.stringify({ error: authResult.error }), {
 *     status: 401,
 *     headers: { "Content-Type": "application/json" }
 *   });
 * }
 */
export async function requireAuth(request: Request): Promise<AuthResult> {
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
 * @since 3.0.0
 * @category Middleware
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<AuthResult>} Object containing authorization status, context, and additional security information
 *
 * @example
 * // Protect a route with authentication, CSRF, and rate limiting
 * const result = await protectRoute(request);
 * if (!result.authorized) {
 *   let status = 401;
 *   if (result.rateLimited) status = 429;
 *   return new Response(JSON.stringify({ error: result.error }), {
 *     status,
 *     headers: { "Content-Type": "application/json" }
 *   });
 * }
 */
export async function protectRoute(request: Request): Promise<AuthResult> {
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
 * @since 3.0.0
 * @category Utilities
 *
 * @param {Request} request - The incoming request object
 * @returns {string} The client's IP address as a string
 *
 * @example
 * // Get IP address for rate limiting
 * const ipAddress = getClientIp(request);
 * console.log(`Request from IP: ${ipAddress}`);
 */
export function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown-ip";
}
