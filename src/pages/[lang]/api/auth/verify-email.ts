/**
 * API Route: Email Verification Endpoint
 *
 * This endpoint handles the email verification process for user accounts.
 * It processes verification tokens sent to users via email and updates
 * their account status upon successful verification.
 *
 * @file Email verification API endpoint
 * @module auth/verify-email
 * @since 3.0.0
 * @category Authentication
 *
 * @example
 * // Client-side usage
 * const response = await fetch('/en/api/auth/verify-email?token=abc123');
 * const result = await response.json();
 * if (result.success) {
 *   // Verification successful
 *   console.log(result.message);
 * }
 *
 * @route GET /[lang]/api/auth/verify-email
 *
 * @param URL Parameters
 * @param {SupportedLanguage} lang - The language code for i18n translations
 *
 * @param Query Parameters
 * @param {string} token - The verification token sent to the user's email
 *
 * @returns {Promise<Response>} API response with verification result
 * @throws {EmailVerificationError} When verification process fails
 */
import type { APIRoute } from "astro";

import { authService } from "@lib/auth/auth-service";
import { useTranslations } from "@utils/i18n";

/**
 * Type-safe language codes using template literal types
 * @since 3.0.0
 */
type SupportedLanguage = "de" | "en" | "fr" | "es" | "it" | "pt" | "da" | "nl" | "sv" | "fi";

/**
 * HTTP Status codes as constants to avoid magic numbers
 * @since 3.0.0
 */
const enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Constant for JSON content-type header
 * @since 3.0.0
 */
const CONTENT_TYPE_JSON = {
  "Content-Type": "application/json",
};

/**
 * Success response interface with discriminated union pattern
 * @since 3.0.0
 */
interface SuccessResponse {
  /** Indicates successful operation */
  success: true;
  /** Success message with details */
  message: string;
}

/**
 * Error response interface with discriminated union pattern
 * @since 3.0.0
 */
interface ErrorResponse {
  /** Indicates failed operation */
  success: false;
  /** Error message explaining the failure */
  error: string;
}

/**
 * API Response Type using discriminated union for type safety
 * @since 3.0.0
 */
type ApiResponse = SuccessResponse | ErrorResponse;

/**
 * Custom error class for email verification errors
 * @since 3.0.0
 */
class EmailVerificationError extends Error {
  /**
   * Creates a new EmailVerificationError
   *
   * @param {string} message - Error message
   * @param {string} [errorCode] - Optional error code for categorization
   * @param {unknown} [cause] - Optional cause of the error
   */
  constructor(
    message: string,
    public readonly errorCode?: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "EmailVerificationError";
  }
}

/**
 * Type guard to check if an error is an EmailVerificationError
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is an EmailVerificationError
 */
function isEmailVerificationError(error: unknown): error is EmailVerificationError {
  return error instanceof EmailVerificationError;
}

/**
 * Creates a standardized API response
 *
 * @param {ApiResponse} response - The response data
 * @param {HttpStatus} status - HTTP status code
 * @returns {Response} A properly formatted Response object
 */
function createApiResponse(response: ApiResponse, status: HttpStatus): Response {
  return new Response(JSON.stringify(response), {
    status,
    headers: CONTENT_TYPE_JSON,
  });
}

/**
 * GET handler for email verification endpoint
 *
 * @param {Object} options - The Astro API route options
 * @param {Request} options.request - The incoming request
 * @param {URL} options.url - The parsed URL of the request
 * @param {Object} options.params - URL parameters
 * @param {string} options.params.lang - Language code from the URL
 * @returns {Promise<Response>} A response object with verification result
 */
export const GET: APIRoute = async ({ url, params }) => {
  // Extract and validate language from URL parameters
  const lang = params.lang as SupportedLanguage;
  const t = useTranslations(lang);

  try {
    // Extract the verification token from the query parameters
    const token = url.searchParams.get("token");

    // Validate the input
    if (!token) {
      return createApiResponse(
        {
          success: false,
          error: t("auth.form.required"),
        },
        HttpStatus.BAD_REQUEST
      );
    }

    // Verify the email address using the auth service
    const success = await authService.verifyUserEmail(token);

    if (!success) {
      return createApiResponse(
        {
          success: false,
          error: t("auth.email_verification.error"),
        },
        HttpStatus.BAD_REQUEST
      );
    }

    // Email verification successful
    return createApiResponse(
      {
        success: true,
        message: t("auth.email_verification.message"),
      },
      HttpStatus.OK
    );
  } catch (error: unknown) {
    // Log detailed error information for debugging
    console.error("Error during email verification:", error);

    // Check for specific error type for better error handling
    const errorMessage = isEmailVerificationError(error)
      ? error.message
      : t("auth.form.error.general");

    return createApiResponse(
      {
        success: false,
        error: errorMessage,
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
