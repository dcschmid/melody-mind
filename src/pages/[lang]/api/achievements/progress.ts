/**
 * API Route: Achievement Progress Update Endpoint
 *
 * This endpoint updates the progress of an achievement for the current user.
 * It verifies authentication, validates the request data, and updates the
 * achievement progress in the database.
 *
 * @since 3.0.0
 * @category API
 *
 * Route: POST /[lang]/api/achievements/progress
 *
 * URL Parameters:
 * - lang: The language code for i18n translations
 *
 * Request Body:
 * - achievementId: ID of the achievement
 * - progress: New progress value (must be a non-negative number)
 *
 * Response:
 * - 200: Progress successfully updated, returns updated user achievement
 * - 400: Invalid request or parameters
 * - 401: Not authenticated
 * - 500: Server error during update
 */
import type { APIRoute } from "astro";

import { requireAuth } from "../../../../middleware/auth.ts";
import { updateAchievementProgress } from "../../../../services/achievementService.ts";
import type { UserAchievement } from "../../../../types/achievement.ts";
import { useTranslations } from "../../../../utils/i18n.ts";

/**
 * Achievement ID type with branded type pattern for better type safety
 * @since 3.0.0
 */
type AchievementId = string & { readonly __brand: unique symbol };

/**
 * Type definitions for translation keys used in this API endpoint
 * @since 3.0.0
 */
type AchievementErrorKey =
  | "errors.auth.unauthorized"
  | "errors.invalidRequest"
  | "errors.invalidParameters"
  | "errors.achievements.update";

/**
 * Type-safe translation function for achievement errors
 */
type TranslationFunction = {
  (key: "errors.invalidRequest", vars: { error: string }): string;
  (key: Exclude<AchievementErrorKey, "errors.invalidRequest">): string;
};

/**
 * Request payload with proper type constraints
 * @since 3.0.0
 */
interface AchievementProgressPayload {
  /** ID of the achievement to update */
  achievementId: string;
  /** New progress value (must be a non-negative number) */
  progress: number;
}

/**
 * Response structure for achievement progress update
 * @since 3.0.0
 */
interface ProgressUpdateResponse {
  /** Whether the operation was successful */
  success: boolean;
  /** Updated user achievement data if successful */
  userAchievement?: UserAchievement;
  /** Error message if unsuccessful */
  error?: string;
}

/**
 * Achievement API error class for specialized error handling
 * @since 3.0.0
 */
class AchievementApiError extends Error {
  /**
   * Creates a new achievement API error
   *
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   */
  constructor(
    message: string,
    public readonly status: number = 500
  ) {
    super(message);
    this.name = "AchievementApiError";
  }
}

/**
 * Type guard to check if an error is an AchievementApiError
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is an AchievementApiError
 */
function isAchievementApiError(error: unknown): error is AchievementApiError {
  return error instanceof AchievementApiError;
}

/**
 * Creates a JSON response with appropriate headers
 *
 * @param {ProgressUpdateResponse} data - Response data
 * @param {number} status - HTTP status code
 * @returns {Response} HTTP response
 */
function createJsonResponse(data: ProgressUpdateResponse, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Memoized function for creating JSON responses
 * Improves performance by caching previous responses
 *
 * @since 3.0.0
 * @category Performance
 */
const memoizedJsonResponse = (() => {
  const cache = new Map<string, Response>();

  return (data: ProgressUpdateResponse, status: number): Response => {
    // Only cache successful responses that don't contain sensitive data
    if (status === 200 && data.success && !data.userAchievement?.userId) {
      const key = `${status}-${JSON.stringify(data)}`;

      if (cache.has(key)) {
        return cache.get(key)!;
      }

      const response = createJsonResponse(data, status);
      cache.set(key, response);
      return response;
    }

    // Don't cache error responses or responses with sensitive data
    return createJsonResponse(data, status);
  };
})();

/**
 * Handles errors and creates appropriate error responses
 *
 * @param {unknown} error - The caught error
 * @param {TranslationFunction} t - Translation function
 * @returns {Response} Error response
 */
function handleError(error: unknown, t: TranslationFunction): Response {
  // Log error for debugging
  console.error("Error updating achievement progress:", error);

  // Use specific error handling if it's our custom error type
  if (isAchievementApiError(error)) {
    return memoizedJsonResponse(
      {
        success: false,
        error: error.message || t("errors.achievements.update"),
      },
      error.status
    );
  }

  // Generic error handling
  return memoizedJsonResponse(
    {
      success: false,
      error: t("errors.achievements.update"),
    },
    500
  );
}

/**
 * Validates if a request payload has the correct structure for achievement progress
 *
 * @param {unknown} data - The data to validate
 * @returns {boolean} True if the data is a valid progress request
 */
function isValidProgressRequest(data: unknown): data is AchievementProgressPayload {
  if (!data || typeof data !== "object") {
    return false;
  }

  const candidate = data as Record<string, unknown>;
  return typeof candidate.achievementId === "string" && typeof candidate.progress === "number";
}

export const POST: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters for localized messages
  const lang = params.lang as string;
  const t = useTranslations(lang) as TranslationFunction;

  try {
    // Retrieve user from the request
    const { authenticated, user, redirectToLogin } = await requireAuth(request);

    // If not authenticated, return redirect to login page
    if (!authenticated || !user) {
      if (redirectToLogin) {
        return redirectToLogin;
      }

      const errorResponse: ProgressUpdateResponse = {
        success: false,
        error: t("errors.auth.unauthorized"),
      };

      return memoizedJsonResponse(errorResponse, 401);
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      const errorResponse: ProgressUpdateResponse = {
        success: false,
        error: t("errors.invalidRequest", { error: "Could not parse request body" }),
      };

      return memoizedJsonResponse(errorResponse, 400);
    }

    // Check if body has the correct structure
    if (!isValidProgressRequest(body) || body.progress < 0) {
      const errorResponse: ProgressUpdateResponse = {
        success: false,
        error: t("errors.invalidParameters"),
      };

      return memoizedJsonResponse(errorResponse, 400);
    }

    // Cast to branded type (type safety validated at runtime)
    const typedAchievementId = body.achievementId as AchievementId;

    // Update progress
    const userAchievement = await updateAchievementProgress(
      user.id,
      typedAchievementId,
      body.progress
    );

    // Return successful response
    const successResponse: ProgressUpdateResponse = {
      success: true,
      userAchievement,
    };

    return memoizedJsonResponse(successResponse, 200);
  } catch (error) {
    return handleError(error, t);
  }
};
