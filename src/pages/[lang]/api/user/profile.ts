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
 * Authentication:
 * - Requires valid JWT access token in cookies
 * - Only authenticated users can access their own profile
 *
 * Response:
 * - 200: User profile data successfully retrieved
 * - 401: Unauthorized (missing or invalid authentication)
 * - 404: User profile not found
 * - 500: Server error during data retrieval
 *
 * @since 1.0.0
 */
import type { APIRoute } from "astro";

import { requireAuth } from "../../../../middleware/auth.ts";
import { turso } from "../../../../turso.ts";
import { useTranslations } from "../../../../utils/i18n.ts";
import { oauthService } from "../../../../services/oauthService.ts";

/**
 * Branded UserId type for better type safety and to prevent
 * accidentally using other string values where a UserId is required
 *
 * @category Types
 */
type UserId = string & { readonly __brand: unique symbol };

/**
 * Valid game modes supported by the application
 *
 * @category Types
 */
type GameMode = "quiz" | "chronology";

/**
 * Difficulty levels available in the game
 *
 * @category Types
 */
type DifficultyLevel = "easy" | "medium" | "hard";

/**
 * User Profile Response Interface
 *
 * Defines the structure of the data returned by the profile endpoint
 *
 * @category API Responses
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
    quiz: GameModeStats;
    /**
     * Chronology mode statistics
     */
    chronology: GameModeStats;
  };
  /**
   * Array of recent game results limited to 5 entries
   * Ordered by creation date (newest first)
   */
  recentGames: Array<GameResult>;

  /**
   * Array of linked OAuth provider names
   */
  linkedProviders: string[];
}

/**
 * Statistics for a specific game mode
 *
 * @category Game Data
 */
interface GameModeStats {
  /** Cumulative score across all games of this mode */
  totalScore: number;
  /** Total number of games played in this mode */
  gamesPlayed: number;
  /** Highest score achieved in a single game of this mode */
  highestScore: number;
}

/**
 * Individual game result information
 *
 * @category Game Data
 */
interface GameResult {
  /** Type of game played */
  gameMode: GameMode;
  /** Total points earned in this game */
  score: number;
  /** Music category or genre played */
  category: string;
  /** Difficulty level of the game */
  difficulty: DifficultyLevel;
  /** Language in which the game was played */
  language: string;
  /** ISO 8601 formatted date when the game was completed */
  createdAt: string;
}

/**
 * API response structure for successful profile retrieval
 *
 * @category API Responses
 */
interface SuccessResponse {
  success: true;
  profile: UserProfile;
}

/**
 * API response structure for error cases
 *
 * @category API Responses
 */
interface ErrorResponse {
  success: false;
  error: string;
}

/**
 * Custom error class for profile-related errors
 *
 * @category Errors
 */
class ProfileError extends Error {
  /**
   * Creates a new ProfileError instance
   *
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code to return
   */
  constructor(
    message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "ProfileError";
  }
}

/**
 * Type guard for checking ProfileError instances
 *
 * @param {unknown} error - Error to check
 * @returns {boolean} Whether the error is a ProfileError
 *
 * @category Type Guards
 */
function isProfileError(error: unknown): error is ProfileError {
  return error instanceof ProfileError;
}

/**
 * Fetches basic user information from the database
 *
 * @param {UserId} userId - User ID to fetch information for
 * @param {Function} t - Translation function
 * @returns {Promise<Record<string, unknown>>} User information row
 * @throws {ProfileError} If user not found
 */
async function fetchUserInfo(
  userId: UserId,
  t: (key: string) => string
): Promise<Record<string, unknown>> {
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
    throw new ProfileError(t("errors.profile.notFound"), 404);
  }

  return userResult.rows[0];
}

/**
 * Fetches and processes game statistics for a user across all languages
 *
 * @param {UserId} userId - User ID to fetch statistics for
 * @returns {Promise<Record<GameMode, GameModeStats>>} Processed game statistics
 */
async function fetchGameStats(userId: UserId): Promise<Record<GameMode, GameModeStats>> {
  // Initialize default statistics values
  const stats: Record<GameMode, GameModeStats> = {
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

  const statsResult = await turso.execute({
    sql: `
      SELECT 
        game_mode, 
        SUM(total_score) as total_score, 
        SUM(games_played) as games_played, 
        MAX(highest_score) as highest_score
      FROM user_mode_stats
      WHERE user_id = ?
      GROUP BY game_mode
    `,
    args: [userId],
  });

  // Populate statistics from database results
  if (statsResult.rows && statsResult.rows.length > 0) {
    for (const row of statsResult.rows) {
      const gameMode = row.game_mode as GameMode;
      if (gameMode === "quiz" || gameMode === "chronology") {
        stats[gameMode] = {
          totalScore: Number(row.total_score),
          gamesPlayed: Number(row.games_played),
          highestScore: Number(row.highest_score),
        };
      }
    }
  }

  return stats;
}

/**
 * Fetches recent game results for a user
 *
 * @param {UserId} userId - User ID to fetch recent games for
 * @returns {Promise<Array<GameResult>>} Recent game results
 */
async function fetchRecentGames(userId: UserId): Promise<Array<GameResult>> {
  const recentGamesResult = await turso.execute({
    sql: `
      SELECT 
        game_mode, 
        score, 
        category, 
        difficulty, 
        language,
        created_at
      FROM game_results
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `,
    args: [userId],
  });

  // Transform game results into the required format
  return recentGamesResult.rows
    ? recentGamesResult.rows.map((row) => ({
        gameMode: row.game_mode as GameMode,
        score: Number(row.score),
        category: row.category as string,
        difficulty: row.difficulty as DifficultyLevel,
        language: row.language as string,
        createdAt: row.created_at as string,
      }))
    : [];
}

/**
 * Fetches linked OAuth providers for a user
 *
 * @param {UserId} userId - User ID to fetch linked providers for
 * @returns {Promise<string[]>} Array of linked OAuth provider names
 */
async function fetchLinkedProviders(userId: UserId): Promise<string[]> {
  try {
    const linkedProviders = await oauthService.getUserOAuthProviders(userId);
    return linkedProviders.map((provider) => provider.provider);
  } catch (error) {
    console.error("Error fetching linked providers:", error);
    return [];
  }
}

/**
 * Creates a success response with user profile data
 *
 * @param {UserProfile} profile - User profile data
 * @returns {Response} HTTP response with JSON data
 */
function createSuccessResponse(profile: UserProfile): Response {
  return new Response(
    JSON.stringify({
      success: true,
      profile,
    } satisfies SuccessResponse),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

/**
 * Creates an error response
 *
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Response} HTTP response with error details
 */
function createErrorResponse(message: string, statusCode: number): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
    } satisfies ErrorResponse),
    {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
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
    // Check authentication using JWT from cookies
    const authResult = await requireAuth(request);

    if (!authResult.authenticated || !authResult.user) {
      return createErrorResponse(t("auth.service.unauthorized"), 401);
    }

    // Use the authenticated user's ID from the JWT token
    const userId = authResult.user.id as UserId;

    // Fetch all required user data in parallel
    const [userRow, stats, recentGames, linkedProviders] = await Promise.all([
      fetchUserInfo(userId, t),
      fetchGameStats(userId),
      fetchRecentGames(userId),
      fetchLinkedProviders(userId),
    ]);

    // Assemble the complete user profile response
    const userProfile: UserProfile = {
      user: {
        username: (userRow.username as string) || "",
        email: userRow.email as string,
        createdAt: userRow.created_at as string,
      },
      stats,
      recentGames,
      linkedProviders,
    };

    return createSuccessResponse(userProfile);
  } catch (error: unknown) {
    // Handle known error types
    if (isProfileError(error)) {
      return createErrorResponse(error.message, error.statusCode);
    }

    // Log error for debugging and return 500 response
    console.error("Error retrieving user profile:", error);
    return createErrorResponse(t("errors.profile.retrievalError"), 500);
  }
};
