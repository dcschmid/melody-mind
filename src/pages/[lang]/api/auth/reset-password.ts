import type { APIRoute } from "astro";

import { authService } from "../../../../lib/auth/auth-service.js";
import { useTranslations } from "../../../../utils/i18n.js";

/**
 * Language code supported by the application
 */
type SupportedLanguage = string & { readonly __brand: unique symbol };

/**
 * Structure for password reset request payload
 */
interface PasswordResetRequestPayload {
  /** User's email address */
  email: string;
}

/**
 * Structure for password reset completion payload
 */
interface PasswordResetCompletionPayload {
  /** Password reset token */
  token: string;
  /** New password to set */
  newPassword: string;
}

/**
 * API success response structure
 */
interface ApiSuccessResponse {
  /** Indicates whether the operation was successful */
  success: true;
  /** Success message to display to the user */
  message: string;
}

/**
 * API error response structure
 */
interface ApiErrorResponse {
  /** Indicates whether the operation was successful */
  success: false;
  /** Error message to display to the user */
  error: string;
  /** Optional validation errors for specific fields */
  validationErrors?: string[];
}

/**
 * Type union for all possible API responses
 */
type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

/**
 * Creates a standardized API response
 *
 * @param {ApiResponse} response - The response data
 * @param {number} status - HTTP status code
 * @returns {Response} A properly formatted Response object
 */
function createApiResponse(response: ApiResponse, status: number): Response {
  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

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
 *
 * @example
 * // Example client-side usage:
 * const response = await fetch('/api/auth/reset-password', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email: 'user@example.com' })
 * });
 * const result = await response.json();
 */
export const POST: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters
  const lang = params.lang as SupportedLanguage;
  const t = useTranslations(lang);

  try {
    // Extract email address from request body
    const body = (await request.json()) as Partial<PasswordResetRequestPayload>;
    const { email } = body;

    // Validate input
    if (!email) {
      return createApiResponse(
        {
          success: false,
          error: t("auth.form.required"),
        },
        400
      );
    }

    // Request password reset (sends email if account exists)
    await authService.requestPasswordReset(email);

    // Always return success to prevent email enumeration attacks
    // (security measure: don't disclose whether an email exists in the system)
    return createApiResponse(
      {
        success: true,
        message: t("auth.password_reset.success"),
      },
      200
    );
  } catch (error) {
    console.error(t("auth.log.reset_request_error"), error);

    return createApiResponse(
      {
        success: false,
        error: t("auth.form.error"),
      },
      500
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
 *
 * @example
 * // Example client-side usage:
 * const response = await fetch('/api/auth/reset-password', {
 *   method: 'PUT',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     token: 'valid-reset-token',
 *     newPassword: 'Secure-P@ssw0rd'
 *   })
 * });
 * const result = await response.json();
 */
export const PUT: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters
  const lang = params.lang as SupportedLanguage;
  const t = useTranslations(lang);

  try {
    // Extract token and new password from request body
    const body = (await request.json()) as Partial<PasswordResetCompletionPayload>;
    const { token, newPassword } = body;

    // Validate input
    if (!token || !newPassword) {
      return createApiResponse(
        {
          success: false,
          error: t("auth.form.required"),
        },
        400
      );
    }

    // Reset the password using provided token
    const result = await authService.resetUserPassword(token, newPassword);

    if (!result.success) {
      // Return validation errors with 400 status
      return createApiResponse(
        {
          success: false,
          error: result.error || t("auth.form.error"),
          validationErrors: result.validationErrors,
        },
        400
      );
    }

    // Successful password reset
    return createApiResponse(
      {
        success: true,
        message: t("auth.password_reset_confirm.success"),
      },
      200
    );
  } catch (error) {
    console.error(t("auth.log.reset_execution_error"), error);

    return createApiResponse(
      {
        success: false,
        error: t("auth.form.error"),
      },
      500
    );
  }
};
