/**
 * API Route: User Achievements Endpoint
 *
 * This endpoint retrieves the user's achievements including:
 * - All available achievements with progress status
 * - Unlocked achievements with dates
 * - Progress tracking for ongoing achievements
 *
 * Route: GET /[lang]/api/achievements
 *
 * URL Parameters:
 * - lang: The language code for i18n translations
 *
 * Authentication:
 * - Requires valid JWT access token in cookies
 * - Only authenticated users can access their achievements
 *
 * Response:
 * - 200: Achievements data successfully retrieved
 * - 401: Unauthorized (missing or invalid authentication)
 * - 500: Server error during data retrieval
 */

import type { APIRoute } from "astro";
import { checkAuth } from "../../../middleware/auth.ts";
import { getUserAchievements, getAllAchievements } from "../../../services/achievementService.ts";
import { useTranslations } from "../../../utils/i18n.ts";

/**
 * Achievement API Response Interface
 */
interface AchievementsResponse {
  success: boolean;
  achievements?: any[];
  authenticated?: boolean;
  error?: string;
}

/**
 * GET request handler for the achievements endpoint
 *
 * Retrieves all achievements for the authenticated user with their progress
 */
export const GET: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters for localized messages
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Check authentication - but don't require it, allow both authenticated and non-authenticated access
    const authResult = await checkAuth(request);

    let achievements;

    if (authResult.authenticated && authResult.user) {
      // Get user-specific achievements with progress for authenticated users
      achievements = await getUserAchievements(authResult.user.id, lang);
    } else {
      // Get all achievements without user progress for non-authenticated users
      achievements = await getAllAchievements(lang);
      
      // Add default progress/unlock status for display
      achievements = achievements.map(achievement => ({
        ...achievement,
        isUnlocked: false,
        progress: 0,
        unlockedAt: null,
      }));
    }

    return new Response(
      JSON.stringify({
        success: true,
        achievements,
        authenticated: authResult.authenticated,
      } satisfies AchievementsResponse),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Error retrieving achievements:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: t("errors.achievements.retrievalError"),
      } satisfies AchievementsResponse),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};