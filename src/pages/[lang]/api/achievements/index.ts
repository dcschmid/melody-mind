/**
 * API Route: Achievements Endpoint
 *
 * This endpoint retrieves all available achievements.
 *
 * Route: GET /[lang]/api/achievements
 *
 * URL Parameters:
 * - lang: The language code for i18n translations
 *
 * Response:
 * - 200: Successfully retrieved achievements
 * - 500: Server error while fetching data
 */
import type { APIRoute } from "astro";

import { getAllAchievements } from "../../../../services/achievementService.ts";
import { useTranslations } from "../../../../utils/i18n.ts";

export const GET: APIRoute = async ({ params }) => {
  // Extract language from URL parameters for localized messages
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Retrieve all achievements
    const achievements = await getAllAchievements(lang);

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
    console.error("Error retrieving achievements:", error);

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
