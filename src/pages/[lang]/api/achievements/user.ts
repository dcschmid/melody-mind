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
 * @param {Object} request - The incoming request object
 * @param {Object} params - The route parameters
 * @param {SupportedLanguage} params.lang - The language code for i18n translations
 *
 * @returns {Promise<Response>} JSON response with user achievements or error message
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
import type { SupportedLanguage } from "../../../../types/api.ts";
import { useTranslations } from "../../../../utils/i18n.ts";

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
}

/**
 * API Response Type using discriminated union for type safety
 * @since 3.0.0
 */
type ApiResponse = SuccessResponse | ErrorResponse;

/**
 * GET handler for user achievements endpoint
 *
 * @param {Object} request - The incoming request object
 * @param {Object} params - URL parameters including language code
 * @returns {Promise<Response>} A Response object with user achievements or error message
 */
export const GET: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters for localized messages
  const lang = params.lang as SupportedLanguage;
  const t = useTranslations(lang);

  /**
   * Helper function to create consistent API responses
   *
   * @param {boolean} success - Whether the operation was successful
   * @param {number} status - HTTP status code to return
   * @param {LocalizedAchievement[] | null} data - Achievement data for successful responses
   * @param {string | null} errorMessage - Error message for failed responses
   * @returns {Response} A properly formatted HTTP response
   */
  const createApiResponse = (
    success: boolean,
    status: number,
    data: LocalizedAchievement[] | null = null,
    errorMessage: string | null = null
  ): Response => {
    const responseBody: ApiResponse = success
      ? { success: true, achievements: data as LocalizedAchievement[] }
      : { success: false, error: errorMessage as string };

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
      return createApiResponse(false, 401, null, t("errors.auth.unauthorized"));
    }

    // Retrieve achievements of the user
    const achievements = await getUserAchievements(user.id, lang);

    // Return achievements with 200 status
    return createApiResponse(true, 200, achievements);
  } catch (error) {
    // Use type guard for better error handling with translated error messages
    const errorMessage =
      error instanceof Error
        ? `${t("errors.achievements.log")} ${error.message}`
        : t("errors.achievements.unknownError");

    // Log error for debugging
    console.error(errorMessage, error);

    // Return standardized error response
    return createApiResponse(false, 500, null, t("errors.achievements.fetch"));
  }
};
