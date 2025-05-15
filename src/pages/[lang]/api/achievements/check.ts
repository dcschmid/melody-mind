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
 * URL Parameters:
 * - lang: The language code for i18n translations (e.g., 'en', 'de')
 *
 * Request Body:
 * - gameState: Game status after completion
 * - isPerfectGame: Whether it was a perfect game (all answers correct)
 *
 * Response:
 * - 200: Achievements successfully checked (returns unlocked/updated achievements)
 * - 400: Invalid request (missing or malformed parameters)
 * - 401: Not authenticated (user not logged in)
 * - 500: Server error during achievement check
 *
 * @example
 * // Example request:
 * fetch('/en/api/achievements/check', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     gameState: { score: 450, correctAnswers: 9, totalRounds: 10 },
 *     isPerfectGame: false
 *   })
 * });
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

    // Validate parameters with strong type checking
    const { gameState, isPerfectGame } = body;

    if (!gameState || typeof gameState !== "object" || typeof isPerfectGame !== "boolean") {
      throw new ValidationError(t("errors.invalidParameters"));
    }

    // Cast the user ID to our branded type for type safety
    const userId = user.id as unknown as UserId;

    // Check achievements with strong typing
    const result = await checkAchievementsAfterGame(userId, gameState as GameState, isPerfectGame);

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

    // Log error for debugging
    console.error(t("errors.achievements.log"), error);

    // For unknown errors, create a generic server error
    const serverError = new ServerError(t("errors.achievements.check"));
    return serverError.toResponse();
  }
};
