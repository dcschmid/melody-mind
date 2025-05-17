/**
 * API Route: Achievement Check Endpoint
 *
 * This endpoint checks and updates achievements after a game session.
 * It validates the incoming request, ensures the user is authenticated,
 * and processes the achievement check based on game state.
 *
 * @since 3.0.0
 * @category API
 *
 * Route: POST /[lang]/api/achievements/check
 *
 * @param {Object} context - Astro API route context
 * @param {Request} context.request - Incoming HTTP request
 * @param {Object} context.params - URL parameters
 * @param {SupportedLanguage} context.params.lang - Language code for i18n
 *
 * @returns {Promise<Response>} HTTP response with achievement check results or error
 *
 * @throws {AuthenticationError} When user is not authenticated
 * @throws {ValidationError} When request data is invalid
 * @throws {ServerError} When an unexpected server error occurs
 *
 * @example
 * // Example request:
 * fetch('/en/api/achievements/check', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     gameState: {
 *       score: 450,
 *       correctAnswers: 9,
 *       totalQuestions: 10,
 *       roundIndex: 9,
 *       currentQuestion: null
 *     },
 *     isPerfectGame: false
 *   })
 * });
 *
 * // Example success response:
 * {
 *   "success": true,
 *   "timestamp": "2025-05-17T14:32:45.123Z",
 *   "data": {
 *     "unlockedAchievements": [...],
 *     "updatedAchievements": [...]
 *   }
 * }
 */
import type { APIRoute } from "astro";

import { requireAuth } from "../../../../middleware/auth.ts";
import { checkAchievementsAfterGame } from "../../../../services/achievementService.ts";
import {
  type SupportedLanguage,
  type AchievementCheckRequest,
  type AchievementCheckSuccessResponse,
  type UserId,
  HttpStatus,
  AuthenticationError,
  ValidationError,
  ServerError,
  isApiError,
} from "../../../../types/api.ts";
import type { GameState } from "../../../../types/game.ts";
import { useTranslations } from "../../../../utils/i18n.ts";

/**
 * Creates a strongly typed user ID from a string
 * Helps ensure type safety by validating the input format
 *
 * @param {string} id - The raw user ID string
 * @returns {UserId} Properly typed user ID
 * @throws {ValidationError} If the ID format is invalid
 */
function createUserId(id: string): UserId {
  // Umfassendere ID-Validierung mit Musterprüfung
  if (!id || typeof id !== "string") {
    throw new ValidationError("User ID must be a non-empty string");
  }

  // Mindestlänge und Formatvalidierung (einfaches Beispiel - anpassbar an tatsächliche ID-Format)
  if (id.length < 5 || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw new ValidationError("Invalid user ID format");
  }

  // Cast to branded type with confidence after validation
  return id as UserId;
}

/**
 * Enhanced type guard for validating GameState objects
 *
 * @param {unknown} value - The value to check
 * @returns {value is GameState} True if value is a valid GameState
 */
function isValidGameState(value: unknown): value is GameState {
  if (!value || typeof value !== "object") {
    return false;
  }

  // Überprüfe, ob die erforderlichen Eigenschaften vorhanden sind
  if (
    !(
      "score" in value &&
      "correctAnswers" in value &&
      "roundIndex" in value &&
      "currentQuestion" in value
    )
  ) {
    return false;
  }

  const state = value as Partial<GameState>;

  return (
    typeof state.score === "number" &&
    typeof state.correctAnswers === "number" &&
    typeof state.roundIndex === "number" &&
    (state.currentQuestion === null ||
      (typeof state.currentQuestion === "object" && state.currentQuestion !== null))
  );
}

export const POST: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters for localized messages
  // Use template literal type for better type safety
  const lang = params.lang as SupportedLanguage;
  const t = useTranslations(lang);

  try {
    // Retrieve user from the request
    const { authenticated, user, redirectToLogin } = await requireAuth(request);

    // If not authenticated, handle with proper error type
    if (!authenticated || !user) {
      if (redirectToLogin) {
        return redirectToLogin;
      }

      throw new AuthenticationError(t("errors.auth.unauthorized"));
    }

    // Parse and validate request body with type safety
    let body: AchievementCheckRequest;
    try {
      body = (await request.json()) as AchievementCheckRequest;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new ValidationError(t("errors.invalidRequest", { error: errorMessage }));
    }

    // Validate parameters with strong type checking using custom type guard
    const { gameState, isPerfectGame } = body;

    if (!isValidGameState(gameState) || typeof isPerfectGame !== "boolean") {
      throw new ValidationError(t("errors.invalidParameters"));
    }

    // Create properly typed UserId instead of unsafe casting
    const userId = createUserId(user.id);

    // Check achievements with strong typing - no need for casting now
    const result = await checkAchievementsAfterGame(userId, gameState, isPerfectGame);

    // Return successful response with typed response format
    const successResponse: AchievementCheckSuccessResponse = {
      success: true,
      timestamp: new Date(),
      data: {
        unlockedAchievements: result.unlockedAchievements,
        updatedAchievements: result.updatedAchievements,
      },
    };

    // Return the response with proper status code
    return new Response(JSON.stringify(successResponse), {
      status: HttpStatus.OK,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Enhanced error handling with type guards
    if (isApiError(error)) {
      // For known API errors, use their built-in response formatter
      return error.toResponse();
    }

    // More detailed error handling with structured logging
    const errorDetails = {
      timestamp: new Date().toISOString(),
      type: error instanceof Error ? error.constructor.name : typeof error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    };

    // Log error for debugging with structured information
    console.error(t("errors.achievements.log"), errorDetails);

    // For unknown errors, create a generic server error
    const serverError = new ServerError(t("errors.achievements.check"));
    return serverError.toResponse();
  }
};
