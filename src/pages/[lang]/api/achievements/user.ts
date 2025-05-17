/**
 * API Route: User Achievements Endpoint
 *
 * This endpoint retrieves the achievements of the current user.
 * It requires authentication and returns a list of user-specific achievements.
 *
 * @since 1.0.0
 * @category API
 *
 * Route: GET /[lang]/api/achievements/user
 *
 * @param {APIContext} context - The Astro API context
 * @param {Request} context.request - The incoming request object
 * @param {Record<string, string>} context.params - The route parameters
 * @param {SupportedLanguage} context.params.lang - The language code for i18n translations
 *
 * @returns {Promise<Response>} JSON response with user achievements or error message
 *
 * @throws {AchievementApiError} When an error occurs during achievements retrieval
 *
 * Response Codes:
 * - 200: User achievements successfully retrieved
 * - 401: Not authenticated
 * - 500: Server error while fetching data
 *
 * @example
 * // Example response for successful request
 * {
 *   "success": true,
 *   "achievements": [
 *     {
 *       "id": "perfect-score",
 *       "name": "Perfect Score",
 *       "description": "Answer all questions correctly",
 *       "unlockedAt": "2025-05-01T10:30:45Z"
 *     }
 *   ]
 * }
 */
import type { APIRoute } from "astro";

import { requireAuth } from "../../../../middleware/auth.ts";
import { getUserAchievements } from "../../../../services/achievementService.ts";
import type { LocalizedAchievement } from "../../../../types/achievement.ts";
import type { SupportedLanguage, UserId } from "../../../../types/api.ts";
import { useTranslations } from "../../../../utils/i18n.ts";

/**
 * Custom error class for achievement API operations
 * @since 3.0.0
 */
class AchievementApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly userId?: UserId
  ) {
    super(message);
    this.name = "AchievementApiError";

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AchievementApiError);
    }
  }
}

/**
 * Type guard to check if an error is an AchievementApiError
 * @since 3.0.0
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is an AchievementApiError
 */
function isAchievementApiError(error: unknown): error is AchievementApiError {
  return error instanceof AchievementApiError;
}

/**
 * Type-safe response interfaces with branded types
 * @since 3.0.0
 */
interface SuccessResponse {
  success: true;
  achievements: LocalizedAchievement[];
}

/**
 * Error response with consistent structure
 * @since 3.0.0
 */
interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

/**
 * API Response Type using discriminated union for type safety
 * @since 3.0.0
 */
type ApiResponse = SuccessResponse | ErrorResponse;

/**
 * GET handler for user achievements endpoint
 *
 * @param {Object} context - The API context from Astro
 * @param {Request} context.request - The incoming request object
 * @param {Record<string, string>} context.params - URL parameters including language code
 * @returns {Promise<Response>} A Response object with user achievements or error message
 */
export const GET: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters for localized messages
  const lang = params.lang as SupportedLanguage;
  // Memoize translations function for better performance if called multiple times
  const t = useTranslations(lang);

  /**
   * Helper function to create consistent API responses with improved type safety
   *
   * @since 3.0.0
   * @template T - The data type for success responses
   *
   * @param {Object} options - Options for creating the response
   * @param {boolean} options.success - Whether the operation was successful
   * @param {number} options.status - HTTP status code to return
   * @param {T | null} [options.data] - Achievement data for successful responses
   * @param {string | null} [options.errorMessage] - Error message for failed responses
   * @param {string | null} [options.errorCode] - Optional error code for failed responses
   * @returns {Response} A properly formatted HTTP response
   */
  const createApiResponse = <T extends LocalizedAchievement[]>({
    success,
    status,
    data = null,
    errorMessage = null,
    errorCode = null,
  }: {
    success: boolean;
    status: number;
    data?: T | null;
    errorMessage?: string | null;
    errorCode?: string | null;
  }): Response => {
    const responseBody: ApiResponse = success
      ? { success: true, achievements: data as T }
      : {
          success: false,
          error: errorMessage ?? "Unknown error",
          ...(errorCode && { code: errorCode }),
        };

    return new Response(JSON.stringify(responseBody), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  };

  try {
    // Retrieve user from the request
    const { authenticated, user, redirectToLogin } = await requireAuth(request);

    // If not authenticated, return redirect to login page
    if (!authenticated || !user) {
      if (redirectToLogin) {
        return redirectToLogin;
      }

      return createApiResponse({
        success: false,
        status: 401,
        errorMessage: t("errors.auth.unauthorized"),
        errorCode: "AUTH_REQUIRED",
      });
    }

    // Retrieve achievements of the user
    const achievements = await getUserAchievements(user.id, lang);

    // Return achievements with 200 status
    return createApiResponse({
      success: true,
      status: 200,
      data: achievements,
    });
  } catch (error: unknown) {
    // Use type guard for better error handling with translated error messages
    let statusCode = 500;
    let errorMessage: string;
    const errorCode = "ACHIEVEMENT_ERROR";

    if (isAchievementApiError(error)) {
      statusCode = error.statusCode;
      errorMessage = `${t("errors.achievements.log")} ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = `${t("errors.achievements.log")} ${error.message}`;
    } else {
      errorMessage = t("errors.achievements.unknownError");
    }

    // Log error for debugging
    console.error(errorMessage, error);

    // Return standardized error response
    return createApiResponse({
      success: false,
      status: statusCode,
      errorMessage: t("errors.achievements.fetch"),
      errorCode,
    });
  }
};
