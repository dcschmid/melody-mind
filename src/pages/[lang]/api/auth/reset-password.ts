import type { APIRoute } from "astro";
import { authService } from "../../../../lib/auth/auth-service.js";
import { useTranslations } from "../../../../utils/i18n.js";

/**
 * Password Reset API Endpoints
 *
 * This file implements two API routes for password reset functionality:
 * 1. POST: Request a password reset (sends a reset link via email)
 * 2. PUT: Complete a password reset (sets the new password using a valid token)
 *
 * These endpoints follow security best practices:
 * - Same response for existing and non-existing email addresses
 * - Rate limiting (implemented in auth service)
 * - Token validation and expiration
 * - Password complexity validation
 */

/**
 * POST endpoint to request a password reset
 *
 * Accepts a JSON payload with an email address and sends a password
 * reset link if the account exists. Always returns success for security
 * reasons (to prevent email enumeration attacks).
 *
 * @param {Object} context - The Astro API context
 * @param {Request} context.request - The HTTP request object
 * @param {Object} context.params - URL parameters including language code
 * @returns {Response} JSON response with success/error message
 */
export const POST: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Extract email address from request body
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
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

    // Request password reset (sends email if account exists)
    const success = await authService.requestPasswordReset(email);

    // Always return success to prevent email enumeration attacks
    // (security measure: don't disclose whether an email exists in the system)
    return new Response(
      JSON.stringify({
        success: true,
        message: t("auth.password_reset.success"),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Password reset request error:", error);

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

/**
 * PUT endpoint to complete a password reset
 *
 * Accepts a JSON payload with a reset token and new password.
 * Validates the token and password requirements before updating.
 *
 * @param {Object} context - The Astro API context
 * @param {Request} context.request - The HTTP request object
 * @param {Object} context.params - URL parameters including language code
 * @returns {Response} JSON response indicating success or detailed error information
 */
export const PUT: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Extract token and new password from request body
    const body = await request.json();
    const { token, newPassword } = body;

    // Validate input
    if (!token || !newPassword) {
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

    // Reset the password using provided token
    const result = await authService.resetUserPassword(token, newPassword);

    if (!result.success) {
      // Return validation errors with 400 status
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error,
          validationErrors: result.validationErrors,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Successful password reset
    return new Response(
      JSON.stringify({
        success: true,
        message: t("auth.password_reset_confirm.success"),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Password reset execution error:", error);

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
