/**
 * API Route: Email Verification Endpoint
 *
 * This endpoint handles the email verification process for user accounts.
 * It processes verification tokens sent to users via email and updates
 * their account status upon successful verification.
 *
 * Route: GET /[lang]/api/auth/verify-email
 *
 * URL Parameters:
 * - lang: The language code for i18n translations
 *
 * Query Parameters:
 * - token: The verification token sent to the user's email
 *
 * Response:
 * - 200: Email successfully verified
 * - 400: Invalid or missing token
 * - 500: Server error during verification process
 */
import type { APIRoute } from "astro";
import { authService } from "../../../../lib/auth/auth-service.js";
import { useTranslations } from "../../../../utils/i18n.js";

export const GET: APIRoute = async ({ request, url, params }) => {
  // Extract language from URL parameters
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Extract the verification token from the query parameters
    const token = url.searchParams.get("token");

    // Validate the input
    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: t("auth.form.required"),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Verify the email address using the auth service
    const success = await authService.verifyUserEmail(token);

    if (!success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: t("auth.email_verification.error"),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Email verification successful
    return new Response(
      JSON.stringify({
        success: true,
        message: t("auth.email_verification.message"),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error during email verification:", error);

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
