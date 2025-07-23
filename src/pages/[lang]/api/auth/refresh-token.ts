/**
 * Authentication Token Refresh API Endpoint
 *
 * This endpoint handles the refresh token mechanism in the MelodyMind application.
 * It validates the refresh token from cookies and issues a new access token.
 *
 * @module auth/refresh-token
 * @since 3.0.0
 */
import type { APIRoute } from "astro";

import { authService } from "../../../../lib/auth/auth-service.js";
import { useTranslations } from "../../../../utils/i18n.js";

/** HTTP status codes used in this endpoint */
const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
} as const;

/** Cookie names used in this endpoint */
const COOKIE_NAMES = {
  REFRESH_TOKEN: "refresh_token",
  ACCESS_TOKEN: "access_token",
} as const;

/** Response payload structure for authentication endpoints */
interface AuthResponsePayload {
  /** Whether the operation was successful */
  success: boolean;
  /** Optional success message */
  message?: string;
  /** Optional error message in case of failure */
  error?: string;
}

/**
 * Extracts a specific cookie value from the cookie header
 *
 * @param {string} cookieHeader - The raw cookie header string
 * @param {string} cookieName - Name of the cookie to extract
 * @returns {string | null} The cookie value or null if not found
 */
function extractCookie(cookieHeader: string, cookieName: string): string | null {
  const cookieMatch = cookieHeader.match(new RegExp(`${cookieName}=([^;]+)`));
  return cookieMatch && cookieMatch[1] ? cookieMatch[1] : null;
}

/**
 * Creates a cookie string for HTTP response headers
 *
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Date} expiry - Cookie expiration date
 * @returns {string} Formatted cookie string for Set-Cookie header
 */
function createSecureCookie(name: string, value: string, expiry: Date): string {
  return `${name}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${expiry.toUTCString()}`;
}

/**
 * POST handler for token refresh endpoint
 *
 * This endpoint validates a refresh token from the user's cookies and issues a new access token.
 * If the refresh token is valid, a new access token is generated and set as a cookie in the response.
 * If the refresh token is invalid or missing, an error response is returned.
 *
 * @function POST
 * @async
 * @param {Object} context - The Astro API route context
 * @param {Request} context.request - The HTTP request object
 * @param {Object} context.params - URL parameters, including language code
 * @returns {Promise<Response>} HTTP response with new access token or error
 *
 * @example
 * // Example response for a valid refresh token:
 * // Status: 200 OK
 * // Headers: Content-Type: application/json, Set-Cookie: access_token=...
 * // Body: { "success": true, "message": "Token successfully renewed" }
 */
export const POST: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Extract refresh token from cookie
    const cookies = request.headers.get("cookie") || "";
    const refreshToken = extractCookie(cookies, COOKIE_NAMES.REFRESH_TOKEN);

    if (!refreshToken) {
      // Return 401 Unauthorized if no refresh token is present
      return new Response(
        JSON.stringify({
          success: false,
          error: t("auth.errors.noRefreshToken"),
        } satisfies AuthResponsePayload),
        {
          status: HTTP_STATUS.UNAUTHORIZED,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Renew the access token
    const result = await authService.refreshToken(refreshToken);

    if (!result.success) {
      // Return 401 Unauthorized if token refresh fails
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error ? t(result.error) : t("auth.tokens.refreshFailed"),
        } satisfies AuthResponsePayload),
        {
          status: HTTP_STATUS.UNAUTHORIZED,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Set the new access token as a cookie (14 days validity)
    const accessTokenExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    // Non-null assertion is safe here because we've checked result.success
    const cookieString = createSecureCookie(
      COOKIE_NAMES.ACCESS_TOKEN,
      result.accessToken!,
      accessTokenExpiry
    );

    // Return successful response with new access token cookie
    return new Response(
      JSON.stringify({
        success: true,
        message: t("auth.tokens.refreshSuccess"),
      } satisfies AuthResponsePayload),
      {
        status: HTTP_STATUS.OK,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieString,
        },
      }
    );
  } catch (error: unknown) {
    // Log the error for debugging
    console.error("Error while renewing token:", error instanceof Error ? error.message : error);

    // Handle unexpected errors with 500 response
    return new Response(
      JSON.stringify({
        success: false,
        error: t("auth.form.error"),
      } satisfies AuthResponsePayload),
      {
        status: HTTP_STATUS.SERVER_ERROR,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
