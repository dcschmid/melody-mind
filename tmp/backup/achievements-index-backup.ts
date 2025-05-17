/**
 * API Route: Achievements Endpoint
 *
 * This endpoint retrieves all available achievements.
 *
 * @route GET /[la/**
 * API error response type
 *
 * @category API
 */
type ApiErrorResponse = {
  status: "error";
  message: string;
  code: ErrorCode;
  details?: Record<string, unknown>;
};hievements
 * @category API
 * @since 3.0.0
 *
 * @param {Object} params - URL parameters
 * @param {string} params.lang - The language code for i18n translations
 *
 * @returns {Promise<Response>} JSON response with achievements data
 * @throws {AchievementFetchError} When achievements cannot be retrieved
 *
 * @response 200 - Successfully retrieved achievements
 * @response 400 - Invalid language parameter
 * @response 500 - Server error while fetching data
 *
 * @example
 * // Client-side fetch example
 * const response = await fetch("/en/api/achievements");
 * const data = await response.json();
 *
 * if (data.status === "success") {
 *   const achievements = data.data.achievements;
 *   // Process achievements...
 * }
 */
import type { APIRoute } from "astro";

import { getAllAchievements } from "../../../../services/achievementService.ts";
import type { Achievement } from "../../../../types/achievement.ts";
import type { UiLanguages } from "../../../../utils/i18n.ts";
import { useTranslations, languages } from "../../../../utils/i18n.ts";

// HTTP status codes as named constants to improve readability
const HTTP_STATUS: Record<string, number> = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error code literal type for better type checking
type ErrorCode = `ACHIEVEMENT_${string}` | "INVALID_LANGUAGE";

/**
 * Custom error class for achievement fetching errors
 *
 * @category Errors
 * @since 3.0.0
 */
class AchievementFetchError extends Error {
  /**
   * Creates a new AchievementFetchError
   *
   * @param {string} message - Error message
   * @param {UiLanguages} languageCode - The language code that was active when the error occurred
   * @param {unknown} [cause] - The underlying error that caused this error
   * @param {ErrorCode} [errorCode] - A code identifying the error type
   */
  constructor(
    message: string,
    public readonly languageCode: UiLanguages,
    public readonly cause?: unknown,
    public readonly errorCode: ErrorCode = "ACHIEVEMENT_FETCH_ERROR"
  ) {
    super(message);
    this.name = "AchievementFetchError";

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AchievementFetchError.prototype);
  }
}

/**
 * Type guard to check if an error is an AchievementFetchError
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} Whether the error is an AchievementFetchError
 * @internal This is currently unused but kept for future error handling improvements
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isAchievementFetchError(error: unknown): error is AchievementFetchError {
  return error instanceof AchievementFetchError;
}

/**
 * API response status brand for type safety
 * 
 * @category API
 */
type StatusBrand = { readonly __statusBrand: unique symbol };

/**
 * Success status with branded type
 * 
 * @category API
 */
type SuccessStatus = "success" & StatusBrand;

/**
 * Error status with branded type
 * 
 * @category API
 */
type ErrorStatus = "error" & StatusBrand;

/**
 * API success response type
 *
 * @template T - The type of data returned
 * @category API
 */
type ApiSuccessResponse<T> = {
  status: SuccessStatus;
  data: T;
};

/**
 * API error response type
 *
 * @category API
 */
type ApiErrorResponse = {
  status: ErrorStatus;
  message: string;
  code: ErrorCode;
};

/**
 * Combined API response type
 *
 * @template T - The type of data returned on success
 * @category API
 */
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Response type for the achievements endpoint
 *
 * @category API
 */
type AchievementsResponse = ApiResponse<{
  achievements: Achievement[];
}>;

// Constants for headers to avoid duplication
const JSON_HEADERS = {
  "Content-Type": "application/json",
} as const;

/**
 * Checks if the provided language code is valid among supported languages
 *
 * @param {string | undefined} lang - Language code to validate
 * @returns {boolean} Whether the language is supported
 *
 * @category i18n
 * @since 3.0.0
 */
function isValidLang(lang: string | undefined): lang is UiLanguages {
  return Boolean(lang && Object.prototype.hasOwnProperty.call(languages, lang));
}

/**
 * Creates an API error response
 *
 * @param {string} message - The error message
 * @param {ErrorCode} code - The error code
 * @param {Record<string, unknown>} [details] - Optional additional error details
 * @returns {ApiErrorResponse} The formatted error response
 *
 * @category API
 * @since 3.0.0
 *
 * @example
 * // Basic error response
 * const error = createErrorResponse("Invalid input", "INVALID_LANGUAGE");
 *
 * @example
 * // Error with additional details
 * const errorWithDetails = createErrorResponse(
 *   "Achievement fetch failed",
 *   "ACHIEVEMENT_NOT_FOUND",
 *   { achievementId: "a123", timestamp: new Date().toISOString() }
 * );
 */
function createErrorResponse(
  message: string, 
  code: ErrorCode, 
  details?: Record<string, unknown>
): ApiErrorResponse {
  return {
    status: "error",
    message,
    code,
    ...(details && { details }),
  };
}

export const GET: APIRoute = async ({ params }) => {
  // Extract and validate language from URL parameters
  const langParam = params.lang;

  if (!langParam || !isValidLang(langParam)) {
    // Even without a valid language, we need to provide a translated error message
    // Use English as a fallback
    const fallbackLang: UiLanguages = "en";
    const t = useTranslations(fallbackLang);

    return new Response(
      JSON.stringify(createErrorResponse(t("errors.api.invalidLanguage"), "INVALID_LANGUAGE")),
      {
        status: HTTP_STATUS.BAD_REQUEST,
        headers: JSON_HEADERS,
      }
    );
  }

  // At this point TypeScript knows langParam is a valid language
  const lang = langParam;
  const t = useTranslations(lang);

  try {
    // Retrieve all achievements
    const achievements = await getAllAchievements(lang);

    // Return achievements with 200 status
    const response: AchievementsResponse = {
      status: "success",
      data: { achievements },
    };

    return new Response(JSON.stringify(response), {
      status: HTTP_STATUS.OK,
      headers: JSON_HEADERS,
    });
  } catch (error: unknown) {
    // Create typed error for better handling
    const typedError =
      error instanceof Error
        ? new AchievementFetchError(`Error retrieving achievements: ${error.message}`, lang, error)
        : new AchievementFetchError("Unknown error retrieving achievements", lang, error);

    // Log error for debugging with proper error information including structured data
    console.error({
      name: typedError.name,
      message: typedError.message,
      language: typedError.languageCode,
      code: typedError.errorCode,
      cause:
        typedError.cause instanceof Error
          ? { message: typedError.cause.message, name: typedError.cause.name }
          : typedError.cause,
      timestamp: new Date().toISOString(),
    });

    // Return error response with 500 status
    const errorResponse = createErrorResponse(t("errors.achievements.fetch"), typedError.errorCode);

    return new Response(JSON.stringify(errorResponse), {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      headers: JSON_HEADERS,
    });
  }
};
