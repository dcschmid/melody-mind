/**
 * API Route: Achievement Check Endpoint
 *
 * This endpoint checks and updates achievements after a game session.
 *
 * Route: POST /[lang]/api/achievements/check
 *
 * URL Parameters:
 * - lang: The language code for i18n translations
 *
 * Request Body:
 * - gameState: Game status after completion
 * - isPerfectGame: Whether it was a perfect game
 *
 * Response:
 * - 200: Achievements successfully checked
 * - 400: Invalid request
 * - 401: Not authenticated
 * - 500: Server error during achievement check
 */
import type { APIRoute } from "astro";

import { requireAuth } from "../../../../middleware/auth.ts";
import { checkAchievementsAfterGame } from "../../../../services/achievementService.ts";
import type { GameState } from "../../../../types/game.ts";
import { useTranslations } from "../../../../utils/i18n.ts";

export const POST: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters for localized messages
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Retrieve user from the request
    const { authenticated, user, redirectToLogin } = await requireAuth(request);

    // If not authenticated, return redirect to login page
    if (!authenticated || !user) {
      if (redirectToLogin) {
        return redirectToLogin;
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: t("errors.auth.unauthorized"),
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: t("errors.invalidRequest"),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Validate parameters
    const { gameState, isPerfectGame } = body;

    if (!gameState || typeof gameState !== "object" || typeof isPerfectGame !== "boolean") {
      return new Response(
        JSON.stringify({
          success: false,
          error: t("errors.invalidParameters"),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check achievements
    const result = await checkAchievementsAfterGame(user.id, gameState as GameState, isPerfectGame);

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        unlockedAchievements: result.unlockedAchievements,
        updatedAchievements: result.updatedAchievements,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // Log error for debugging and return 500 response
    console.error("Error checking achievements:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: t("errors.achievements.check"),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
