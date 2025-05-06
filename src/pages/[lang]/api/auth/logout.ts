/**
 * @file Logout API Route
 * @description Handles user logout functionality by clearing authentication cookies
 * @module auth/logout
 */

import type { APIRoute } from "astro";
import { useTranslations } from "../../../../utils/i18n.js";

/**
 * POST handler for user logout
 *
 * @param {Object} options - The Astro API route options
 * @param {Request} options.request - The incoming request object
 * @param {Object} options.params - URL parameters including language code
 * @param {Object} options.cookies - Cookie management utilities
 * @returns {Response} JSON response indicating logout success or failure
 */
export const POST: APIRoute = async ({ params }) => {
  // Extract language from URL parameters
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Clear authentication cookies by setting expiration date in the past
    const accessTokenExpiry = new Date(0);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully logged out",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `access_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${accessTokenExpiry.toUTCString()}`,
        },
      },
    );
  } catch (error) {
    console.error("Error during logout:", error);

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
