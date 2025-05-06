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
 */

import type { APIRoute } from "astro";
import { authService } from "../../../../lib/auth/auth-service.js";
import { getClientIp } from "../../../../lib/auth/middleware.js";
import { useTranslations } from "../../../../utils/i18n.js";

/**
 * POST handler for user login
 *
 * @async
 * @param {Object} context - The Astro API route context
 * @param {Request} context.request - The HTTP request object
 * @param {Object} context.params - The route parameters
 * @param {string} context.params.lang - The language code from the URL
 * @returns {Promise<Response>} HTTP response with authentication results or error message
 */
export const POST: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Extract login credentials from request body
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: t("auth.login.error"),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Extract IP address for rate limiting
    const ip = getClientIp(request);

    /**
     * Attempt user login
     *
     * @returns {Object} Authentication result containing:
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
        return new Response(
          JSON.stringify({
            success: false,
            error: result.error,
            rateLimited: true,
            resetTime: result.resetTime,
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": Math.ceil(
                (result.resetTime || 0) / 1000,
              ).toString(),
            },
          },
        );
      }

      // Return 401 status for other authentication failures
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error,
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Set token expiration times
    const accessTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Return successful authentication response with secure cookie
    return new Response(
      JSON.stringify({
        success: true,
        user: result.user,
        csrfToken: result.csrfToken?.token,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `access_token=${result.tokens?.accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${accessTokenExpiry.toUTCString()}`,
        },
      },
    );
  } catch (error) {
    console.error("Login error:", error);

    // Return 500 status for unexpected errors
    return new Response(
      JSON.stringify({
        success: false,
        error: t("auth.form.error"),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
