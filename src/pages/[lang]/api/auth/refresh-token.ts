/**
 * Authentication Token Refresh API Endpoint
 *
 * This endpoint handles the refresh token mechanism in the MelodyMind application.
 * It validates the refresh token from cookies and issues a new access token.
 *
 * @module auth/refresh-token
 */
import type { APIRoute } from "astro";
import { authService } from "../../../../lib/auth/auth-service.js";
import { useTranslations } from "../../../../utils/i18n.js";

/**
 * POST handler for token refresh endpoint
 *
 * @function POST
 * @async
 * @param {Object} context - The Astro API route context
 * @param {Request} context.request - The HTTP request object
 * @param {Object} context.params - URL parameters, including language code
 * @returns {Promise<Response>} HTTP response with new access token or error
 */
export const POST: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Extract refresh token from cookie
    const cookies = request.headers.get("cookie") || "";
    const refreshTokenMatch = cookies.match(/refresh_token=([^;]+)/);

    if (!refreshTokenMatch || !refreshTokenMatch[1]) {
      // Return 401 Unauthorized if no refresh token is present
      return new Response(
        JSON.stringify({
          success: false,
          error: "Kein Refresh-Token vorhanden",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const refreshToken = refreshTokenMatch[1];

    // Renew the access token
    const result = await authService.refreshToken(refreshToken);

    if (!result.success) {
      // Return 401 Unauthorized if token refresh fails
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

    // Set the new access token as a cookie
    const accessTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Return successful response with new access token cookie
    return new Response(
      JSON.stringify({
        success: true,
        message: "Token erfolgreich erneuert",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `access_token=${result.accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${accessTokenExpiry.toUTCString()}`,
        },
      },
    );
  } catch (error) {
    // Handle unexpected errors with 500 response
    console.error("Error while renewing token:", error);

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
