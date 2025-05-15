/**
 * @file Authentication API endpoint for user login
 * @description Handles user authentication by verifying credentials and issuing access tokens
 *
 * This endpoint:
 * 1. Validates incoming email and password
 * 2. Implements rate limiting based on IP address
 * 3. Issues access tokens and CSRF tokens on successful authentication
 * 4. Sets HTTP-only secure cookies for authentication
 * 5. Provides localized error messages based on user language
 *
 * @since 3.0.0
 * @category Authentication
 */

import type { APIRoute } from "astro";

import { authService, type LoginResult } from "../../../../lib/auth/auth-service.js";
import { getClientIp } from "../../../../lib/auth/middleware.js";
import { useTranslations } from "../../../../utils/i18n.js";

/**
 * Type guard to check if a login result is successful
 * Improves type safety when handling login results
 *
 * @since 3.0.0
 * @param {LoginResult} result - The result to check
 * @returns {boolean} True if the login was successful
 */
function isSuccessfulLogin(result: LoginResult): result is LoginResult & {
  success: true;
  user: NonNullable<LoginResult["user"]>;
  tokens: NonNullable<LoginResult["tokens"]>;
} {
  return result.success === true && !!result.user && !!result.tokens;
}

// Type-safe language codes using template literal types
type SupportedLanguage = "de" | "en" | "fr" | "es" | "it" | "pt" | "da" | "nl" | "sv" | "fi";

// Type-safe HTTP status codes for better error handling
const enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
}

// Type-safe HTTP headers
type HttpHeader = {
  "Content-Type": string;
  "Set-Cookie"?: string;
  "Retry-After"?: string;
};

/**
 * Type for login request body
 * @since 3.0.0
 */
type LoginRequestBody = {
  email?: string;
  password?: string;
};

/**
 * Type for login response body
 * @since 3.0.0
 */
type LoginResponseBody = {
  success: boolean;
  user?: Omit<LoginResult["user"], "passwordHash">;
  csrfToken?: string;
  error?: string;
  rateLimited?: boolean;
  resetTime?: number;
};

/**
 * Specialized error class for authentication failures
 * Provides better error handling and type safety
 *
 * @since 3.0.0
 * @category Authentication
 */
class AuthenticationError extends Error {
  constructor(
    message: string,
    public readonly status: HttpStatus = HttpStatus.UNAUTHORIZED,
    public readonly code?: string
  ) {
    super(message);
    this.name = "AuthenticationError";
  }
}

/**
 * Creates a response object with standardized structure
 * Uses type-safe parameters and consistent formatting
 *
 * @since 3.0.0
 * @category HTTP
 *
 * @param {object} options - Response creation options
 * @param {LoginResponseBody} options.body - Response body contents
 * @param {HttpStatus} options.status - HTTP status code
 * @param {Partial<HttpHeader>} options.headers - HTTP headers
 * @returns {Response} Structured HTTP response with proper content type
 *
 * @example
 * return createResponse({
 *   body: { success: true, user },
 *   status: HttpStatus.OK,
 *   headers: { "Set-Cookie": authCookie }
 * });
 */
function createResponse(options: {
  body: LoginResponseBody;
  status: HttpStatus;
  headers: Partial<HttpHeader>;
}): Response {
  const { body, status, headers } = options;

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    } satisfies HttpHeader,
  });
}

/**
 * POST handler for user login
 *
 * Processes login requests, validates credentials, and issues authentication tokens
 *
 * @async
 * @param {Object} context - The Astro API route context
 * @param {Request} context.request - The HTTP request object
 * @param {Object} context.params - The route parameters
 * @param {SupportedLanguage} context.params.lang - The language code from the URL
 * @returns {Promise<Response>} HTTP response with authentication results or error message
 *
 * @throws Will not throw exceptions but handles them internally and returns appropriate error responses
 *
 * @example
 * // Request body format:
 * {
 *   "email": "user@example.com",
 *   "password": "securepassword"
 * }
 */
export const POST: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters and validate it's a supported language
  const lang = params.lang as SupportedLanguage;
  const t = useTranslations(lang);

  try {
    // Extract login credentials from request body
    const body = (await request.json()) as LoginRequestBody;
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return createResponse({
        body: {
          success: false,
          error: t("auth.login.error"),
        },
        status: HttpStatus.BAD_REQUEST,
        headers: {},
      });
    }

    // Extract IP address for rate limiting
    const ip = getClientIp(request);

    /**
     * Attempt user login
     *
     * @returns {LoginResult} Authentication result containing:
     * - success: boolean indicating authentication success
     * - user: user data if authentication succeeded
     * - tokens: authentication tokens if successful
     * - csrfToken: CSRF protection token
     * - error: error message if authentication failed
     * - rateLimited: boolean indicating if request was rate limited
     * - resetTime: timestamp when rate limit will reset
     */
    const result = await authService.login(email, password, ip);

    if (!result.success) {
      // Return 429 status for rate limiting
      if (result.rateLimited) {
        const retryAfterSeconds = Math.ceil((result.resetTime || 0) / 1000);

        return createResponse({
          body: {
            success: false,
            error: result.error,
            rateLimited: true,
            resetTime: result.resetTime,
          },
          status: HttpStatus.TOO_MANY_REQUESTS,
          headers: {
            "Retry-After": retryAfterSeconds.toString(),
          },
        });
      }

      // Return 401 status for other authentication failures
      return createResponse({
        body: {
          success: false,
          error: result.error,
        },
        status: HttpStatus.UNAUTHORIZED,
        headers: {},
      });
    }

    // Use type guard to ensure type safety (result has user and tokens properties)
    if (!isSuccessfulLogin(result)) {
      // This should theoretically never happen as we already checked result.success above,
      // but it guarantees type safety for the compiler
      return createResponse({
        body: {
          success: false,
          error: t("auth.login.unexpected_error"),
        },
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        headers: {},
      });
    }

    // Set token expiration time for access token
    const accessTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Return successful authentication response with secure cookie
    return createResponse({
      body: {
        success: true,
        user: result.user, // TypeScript weiß jetzt, dass result.user nicht null ist
        csrfToken: result.csrfToken?.token,
      },
      status: HttpStatus.OK,
      headers: {
        "Set-Cookie": `access_token=${result.tokens.accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${accessTokenExpiry.toUTCString()}`,
      },
    });
  } catch (error) {
    // Improve error logging with type safety
    console.error(
      "Login error:",
      error instanceof Error ? `${error.name}: ${error.message}` : String(error)
    );

    // Handle AuthenticationError specially
    if (error instanceof AuthenticationError) {
      return createResponse({
        body: {
          success: false,
          error: error.code ? t(error.code) : t("auth.login.unauthorized"),
        },
        status: error.status,
        headers: {},
      });
    }

    // Return 500 status for unexpected errors
    return createResponse({
      body: {
        success: false,
        error: t("auth.form.error"),
      },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      headers: {},
    });
  }
};
