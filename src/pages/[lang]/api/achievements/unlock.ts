/**
 * API Route: Achievement Unlock Endpoint
 *
 * This endpoint unlocks an achievement for the current user.
 * It verifies authentication, validates the request data, and unlocks
 * the achievement in the database.
 *
 * @sinc    // Validate parameters with strong type checking
    if (!isValidUnlockRequest(body)) {
      const errorResponse: UnlockResponse = {
        success: false,
        error: t("errors.invalidParameters"),
      };

      return createJsonResponse(errorResponse, HTTP_STATUS.BAD_REQUEST);
    }

    // Use the validation function to create a typed achievement ID
    const typedAchievementId = validateAchievementId(body.achievementId);category API
 *
 * Route: POST /[lang]/api/achievements/unlock
 *
 * URL Parameters:
 * - lang: The language code for i18n translations
 *
 * Request Body:
 * - achievementId: ID of the achievement to unlock
 *
 * Response:
 * - 200: Achievement successfully unlocked, returns updated user achievement data
 * - 400: Invalid request or parameters
 * - 401: Not authenticated
 * - 500: Server error during unlocking
 *
 * @example
 * // Request
 * fetch('/de/api/achievements/unlock', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ achievementId: "achievement-123" })
 * });
 */
import type { APIRoute } from "astro";

import { requireAuth } from "../../../../middleware/auth";
import { unlockAchievement } from "../../../../services/achievementService";
import type { UserAchievement } from "../../../../types/achievement";
import type { SupportedLanguage } from "../../../../types/api";
import { useTranslations } from "../../../../utils/i18n";

/**
 * HTTP status codes used in this API endpoint
 * @since 3.1.0
 */
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Achievement ID type with branded type pattern for better type safety
 * @since 3.1.0
 */
type AchievementId = string & { readonly __brand: unique symbol };

/**
 * Type definitions for translation keys used in this API endpoint
 * @since 3.1.0
 */
type AchievementUnlockErrorKey =
  | "errors.auth.unauthorized"
  | "errors.invalidRequest"
  | "errors.invalidParameters"
  | "errors.achievements.unlock"
  | "errors.achievements.invalidId"
  | "errors.achievements.unknownError";

/**
 * Type-safe translation function for achievement errors
 * Provides specialized signatures for different error types
 *
 * @since 3.1.0
 */
type TranslationFunction = {
  /**
   * Translates an invalid request error with additional error details
   *
   * @param {string} key - The translation key for invalid request errors
   * @param {{ error: string }} vars - Variables for the translation, including the specific error message
   * @returns {string} The translated error message
   */
  (key: "errors.invalidRequest", vars: { error: string }): string;

  /**
   * Translates other error types without additional variables
   *
   * @param {Exclude<AchievementUnlockErrorKey, "errors.invalidRequest">} key - The translation key
   * @returns {string} The translated error message
   */
  (key: Exclude<AchievementUnlockErrorKey, "errors.invalidRequest">): string;
};

/**
 * Request payload with proper type constraints
 * @since 3.1.0
 */
interface AchievementUnlockPayload {
  /** ID of the achievement to unlock */
  achievementId: string;
}

/**
 * Response structure for achievement unlock operation
 * @since 3.1.0
 */
interface UnlockResponse {
  /** Whether the operation was successful */
  success: boolean;
  /** Updated user achievement data if successful */
  userAchievement?: UserAchievement;
  /** Error message if unsuccessful */
  error?: string;
}

/**
 * Achievement unlock error class for specialized error handling
 * @since 3.1.0
 */
class AchievementUnlockError extends Error {
  /**
   * Creates a new achievement unlock error
   *
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   * @param {unknown} [cause] - The underlying error that caused this error
   */
  constructor(
    message: string,
    public readonly status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "AchievementUnlockError";
  }
}

/**
 * Type guard to check if an error is an AchievementUnlockError
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is an AchievementUnlockError
 */
function isAchievementUnlockError(error: unknown): error is AchievementUnlockError {
  return error instanceof AchievementUnlockError;
}

export const POST: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters for localized messages
  const lang = params.lang as SupportedLanguage;
  const t = useTranslations(lang) as TranslationFunction;

  // JSON response headers constant to avoid duplication
  const JSON_HEADERS = {
    "Content-Type": "application/json",
  };

  /**
   * Creates a JSON response with appropriate headers
   *
   * @param {UnlockResponse} data - Response data
   * @param {number} status - HTTP status code
   * @returns {Response} HTTP response
   */
  function createJsonResponse(data: UnlockResponse, status: number): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: JSON_HEADERS,
    });
  }

  /**
   * Validates if a request payload has the correct structure for achievement unlock
   *
   * @param {unknown} data - The data to validate
   * @returns {boolean} True if the data is a valid unlock request
   */
  function isValidUnlockRequest(data: unknown): data is AchievementUnlockPayload {
    if (!data || typeof data !== "object") {
      return false;
    }

    const candidate = data as Record<string, unknown>;

    // Check if achievementId exists and is a non-empty string
    if (typeof candidate.achievementId !== "string") {
      return false;
    }

    // Ensure achievementId is not empty
    return candidate.achievementId.trim().length > 0;
  }

  /**
   * Safely creates a typed AchievementId from a string
   * Performs validation before casting to ensure type safety
   *
   * @param {string} id - The achievement ID to validate and cast
   * @returns {AchievementId} The typed achievement ID
   * @throws {AchievementUnlockError} If the ID is invalid
   */ function validateAchievementId(id: string): AchievementId {
    if (!id || id.trim().length === 0) {
      throw new AchievementUnlockError(t("errors.achievements.invalidId"), HTTP_STATUS.BAD_REQUEST);
    }

    // Additional validation could be added here (format checks, etc.)

    return id as AchievementId;
  }

  try {
    // Get user from the request
    const { authenticated, user, redirectToLogin } = await requireAuth(request);

    // If not authenticated, return redirect to login page
    if (!authenticated || !user) {
      if (redirectToLogin) {
        return redirectToLogin;
      }

      const errorResponse: UnlockResponse = {
        success: false,
        error: t("errors.auth.unauthorized"),
      };

      return createJsonResponse(errorResponse, HTTP_STATUS.UNAUTHORIZED);
    }

    // Parse request body with proper error handling
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      const errorResponse: UnlockResponse = {
        success: false,
        error: t("errors.invalidRequest", { error: errorMessage }),
      };

      return createJsonResponse(errorResponse, HTTP_STATUS.BAD_REQUEST);
    }

    // Validate parameters with strong type checking
    if (!isValidUnlockRequest(body)) {
      const errorResponse: UnlockResponse = {
        success: false,
        error: t("errors.invalidParameters"),
      };

      return createJsonResponse(errorResponse, HTTP_STATUS.BAD_REQUEST);
    }

    // Cast to branded type (type safety validated at runtime)
    const typedAchievementId = validateAchievementId(body.achievementId);

    // Unlock achievement with improved error handling
    try {
      const userAchievement = await unlockAchievement(user.id, typedAchievementId);

      // Return successful response
      const successResponse: UnlockResponse = {
        success: true,
        userAchievement,
      };

      return createJsonResponse(successResponse, HTTP_STATUS.OK);
    } catch (unlockError) {
      // Enhanced structured error logging for achievement unlock errors
      console.error("Achievement unlock operation failed:", {
        userId: user.id,
        achievementId: typedAchievementId,
        error:
          unlockError instanceof Error
            ? {
                name: unlockError.name,
                message: unlockError.message,
                stack: unlockError.stack,
              }
            : String(unlockError),
      });

      // Handle specific achievement unlock errors
      throw new AchievementUnlockError(
        unlockError instanceof Error ? unlockError.message : t("errors.achievements.unknownError"),
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        unlockError
      );
    }
  } catch (error) {
    // Enhanced error logging with structured information
    console.error("Error unlocking achievement:", {
      name: error instanceof Error ? error.name : "Unknown Error",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Use specific error handling if it's our custom error type
    if (isAchievementUnlockError(error)) {
      return createJsonResponse(
        {
          success: false,
          error: error.message || t("errors.achievements.unlock"),
        },
        error.status
      );
    }

    // Generic error response for other types of errors
    return createJsonResponse(
      {
        success: false,
        error: t("errors.achievements.unlock"),
      },
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};
