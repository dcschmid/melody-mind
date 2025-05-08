/**
 * API Route: User Profile Endpoint
 *
 * This endpoint retrieves the complete user profile including:
 * - Basic user information (username, email, creation date)
 * - Game statistics for both quiz and chronology modes
 * - Recent game results (last 5 games)
 *
 * Route: GET /[lang]/api/user/profile
 *
 * URL Parameters:
 * - lang: The language code for i18n translations
 *
 * Query Parameters:
 * - userId: The unique identifier of the user (required)
 *
 * Authentication:
 * - Requires a valid userId (non-guest) in the query parameters
 *
 * Response:
 * - 200: User profile data successfully retrieved
 * - 401: Unauthorized (missing or invalid user ID)
 * - 404: User profile not found
 * - 500: Server error during data retrieval
 */
import type { APIRoute } from "astro";
import { turso } from "../../../../turso.ts";
import { useTranslations } from "../../../../utils/i18n.ts";

/**
 * User Profile Response Interface
 *
 * Defines the structure of the data returned by the profile endpoint
 */
interface UserProfile {
  /**
   * Basic user information
   */
  user: {
    /** Username displayed in the application */
    username: string;
    /** User's email address */
    email: string;
    /** ISO 8601 formatted date when the user account was created */
    createdAt: string;
  };

  /**
   * Game performance statistics by game mode
   */
  stats: {
    /**
     * Quiz mode statistics
     */
    quiz: {
      /** Cumulative score across all quiz games */
      totalScore: number;
      /** Total number of quiz games played */
      gamesPlayed: number;
      /** Highest score achieved in a single quiz game */
      highestScore: number;
    };
    /**
     * Chronology mode statistics
     */
    chronology: {
      /** Cumulative score across all chronology games */
      totalScore: number;
      /** Total number of chronology games played */
      gamesPlayed: number;
      /** Highest score achieved in a single chronology game */
      highestScore: number;
    };
  };
  /**
   * Array of recent game results limited to 5 entries
   * Ordered by creation date (newest first)
   */
  recentGames: Array<{
    /** Type of game played (quiz or chronology) */
    gameMode: "quiz" | "chronology";
    /** Total points earned in this game */
    score: number;
    /** Music category or genre played */
    category: string;
    /** Difficulty level of the game */
    difficulty: "easy" | "medium" | "hard";
    /** ISO 8601 formatted date when the game was completed */
    createdAt: string;
  }>;
}

/**
 * GET request handler for the user profile endpoint
 *
 * Retrieves comprehensive user profile data from the database,
 * including user details, statistics, and recent game history.
 *
 * @param {Object} context - The Astro API route context
 * @param {Request} context.request - The incoming HTTP request
 * @param {Object} context.params - URL parameters including language code
 * @returns {Response} JSON response with user profile data or error message
 */
export const GET: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters for localized messages
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Extract user ID from the URL query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId") || "guest";

    // Return unauthorized error if the user is a guest
    if (userId === "guest") {
      return new Response(
        JSON.stringify({
          success: false,
          error: t("auth.service.unauthorized"),
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Retrieve basic user information from the database
    const userResult = await turso.execute({
      sql: `
        SELECT username, email, created_at
        FROM users
        WHERE id = ?
      `,
      args: [userId],
    });

    // Return 404 if user not found
    if (!userResult.rows || userResult.rows.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "User profile not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const userRow = userResult.rows[0];

    // Retrieve game performance statistics for both game modes
    const statsResult = await turso.execute({
      sql: `
        SELECT 
          game_mode, 
          total_score, 
          games_played, 
          highest_score
        FROM user_mode_stats
        WHERE user_id = ?
      `,
      args: [userId],
    });

    // Initialize default statistics values
    const stats = {
      quiz: {
        totalScore: 0,
        gamesPlayed: 0,
        highestScore: 0,
      },
      chronology: {
        totalScore: 0,
        gamesPlayed: 0,
        highestScore: 0,
      },
    };

    // Populate statistics from database results
    if (statsResult.rows && statsResult.rows.length > 0) {
      for (const row of statsResult.rows) {
        const gameMode = row.game_mode as string;
        if (gameMode === "quiz" || gameMode === "chronology") {
          stats[gameMode] = {
            totalScore: Number(row.total_score),
            gamesPlayed: Number(row.games_played),
            highestScore: Number(row.highest_score),
          };
        }
      }
    }

    // Retrieve the 5 most recent game results
    const recentGamesResult = await turso.execute({
      sql: `
        SELECT 
          game_mode, 
          score, 
          category, 
          difficulty, 
          created_at
        FROM game_results
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 5
      `,
      args: [userId],
    });

    // Transform game results into the required format
    const recentGames = recentGamesResult.rows
      ? recentGamesResult.rows.map((row) => ({
          gameMode: row.game_mode as "quiz" | "chronology",
          score: Number(row.score),
          category: row.category as string,
          difficulty: row.difficulty as "easy" | "medium" | "hard",
          createdAt: row.created_at as string,
        }))
      : [];

    // Assemble the complete user profile response
    const userProfile: UserProfile = {
      user: {
        username: (userRow.username as string) || "",
        email: userRow.email as string,
        createdAt: userRow.created_at as string,
      },
      stats,
      recentGames,
    };

    // Return the complete profile with 200 status
    return new Response(
      JSON.stringify({
        success: true,
        profile: userProfile,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    // Log error for debugging and return 500 response
    console.error("Error retrieving user profile:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Error retrieving user profile",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
