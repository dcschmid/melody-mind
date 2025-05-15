/**
 * API Route: User Achievements Endpoint
 *
 * This endpoint retrieves the achievements of the current user.
 *
 * Route: GET /[lang]/api/achievements/user
 *
 * URL Parameters:
 * - lang: The language code for i18n translations
 *
 * Response:
 * - 200: User achievements successfully retrieved
 * - 401: Not authenticated
 * - 500: Server error while fetching data
 */
import type { APIRoute } from "astro";

import { requireAuth } from "../../../../middleware/auth.ts";
import { getUserAchievements } from "../../../../services/achievementService.ts";
import { useTranslations } from "../../../../utils/i18n.ts";

export const GET: APIRoute = async ({ request, params }) => {
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

    // Retrieve achievements of the user
    const achievements = await getUserAchievements(user.id, lang);

    // Return achievements with 200 status
    return new Response(
      JSON.stringify({
        success: true,
        achievements,
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
    console.error("Error retrieving user achievements:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: t("errors.achievements.fetch"),
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
