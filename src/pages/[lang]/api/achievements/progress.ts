/**
 * API Route: Achievement Progress Update Endpoint
 *
 * This endpoint updates the progress of an achievement for the current user.
 *
 * Route: POST /[lang]/api/achievements/progress
 *
 * URL Parameters:
 * - lang: The language code for i18n translations
 *
 * Request Body:
 * - achievementId: ID of the achievement
 * - progress: New progress value
 *
 * Response:
 * - 200: Progress successfully updated
 * - 400: Invalid request
 * - 401: Not authenticated
 * - 500: Server error during update
 */
import type { APIRoute } from "astro";

import { requireAuth } from "../../../../middleware/auth.ts";
import { updateAchievementProgress } from "../../../../services/achievementService.ts";
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
    const { achievementId, progress } = body;

    if (!achievementId || typeof progress !== "number" || progress < 0) {
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

    // Update progress
    const userAchievement = await updateAchievementProgress(user.id, achievementId, progress);

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        userAchievement,
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
    console.error("Error updating achievement progress:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: t("errors.achievements.update"),
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
