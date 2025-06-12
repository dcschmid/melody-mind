/**
 * API endpoint for saving game results
 *
 * This file handles saving game results to the database after a player completes a game.
 * It processes the submitted game data, validates it, and stores it in multiple tables:
 * - game_results: stores the main game result
 * - user_mode_stats: keeps track of cumulative user statistics by game mode
 * - highscores: tracks high scores for leaderboard purposes
 *
 * @since 3.0.0
 * @category API
 */
import type { APIRoute } from "astro";
import { nanoid } from "nanoid";

import { processAchievementsAfterGame } from "../../../../services/gameAchievementService.ts";
import { updateDailyActivity } from "../../../../services/userStreakService.ts";
import { turso } from "../../../../turso.ts";
import type { GameState } from "../../../../types/game.ts";
import { useTranslations } from "../../../../utils/i18n.ts";

/**
 * Branded type for user ID to improve type safety
 */
type UserId = string & { readonly __brand: unique symbol };

/**
 * Literal types for game-specific enums
 */
type DifficultyLevel = "easy" | "medium" | "hard";
type GameMode = "quiz" | "chronology";

/**
 * Interface representing the game result data submitted to the API
 *
 * @since 3.0.0
 * @category Data Models
 *
 * @property {UserId} userId - Unique identifier of the user
 * @property {string} categoryName - Name of the music category played
 * @property {DifficultyLevel} difficulty - Difficulty level chosen
 * @property {number} score - Total points earned in the game
 * @property {number} correctAnswers - Number of questions answered correctly
 * @property {number} totalRounds - Total number of questions/rounds in the game
 * @property {string} [genreId] - Optional ID of the music genre
 * @property {number} [lastAnswerTime] - Optional timestamp of the last answer
 * @property {boolean} [lastAnswerCorrect] - Optional flag indicating if the last answer was correct
 * @property {string} [eventId] - Optional ID of the event (for special game events)
 * @property {boolean} [endOfSession] - Optional flag indicating if this is the end of a gaming session
 * @property {boolean} [debugAchievements] - Optional flag to enable achievement debugging
 */
export interface GameResultData {
  userId: UserId;
  categoryName: string;
  difficulty: DifficultyLevel;
  score: number;
  correctAnswers: number;
  totalRounds: number;

  // Extended properties for achievement tracking
  genreId?: string;
  lastAnswerTime?: number;
  lastAnswerCorrect?: boolean;
  eventId?: string;
  endOfSession?: boolean;
  debugAchievements?: boolean;
}

/**
 * Base error class for all API-related errors
 *
 * @since 3.1.0
 * @category Errors
 */
class ApiError extends Error {
  /** HTTP status code to return */
  readonly statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

/**
 * Custom error class for API request validation errors
 *
 * @since 3.0.0
 * @category Errors
 */
class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

/**
 * Custom error class for database-related errors
 *
 * @since 3.1.0
 * @category Errors
 */
class DatabaseError extends ApiError {
  /** The original error that caused this database error */
  readonly originalError?: unknown;

  constructor(message: string, originalError?: unknown) {
    super(message, 500);
    this.name = "DatabaseError";
    this.originalError = originalError;
  }
}

/**
 * Type guard to check if an error is an ApiError
 *
 * @since 3.1.0
 * @category Type Guards
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is an ApiError
 */
function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type guard to check if an error is a ValidationError
 *
 * @since 3.0.0
 * @category Type Guards
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is a ValidationError
 */
function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

// Diese Typ-Guards werden in der aktuellen Implementierung verwendet
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Type guard to check if an error is a DatabaseError
 *
 * @since 3.1.0
 * @category Type Guards
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is a DatabaseError
 */
function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError;
}
/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * Response interface for the save result API
 *
 * @since 3.0.0
 * @category API
 */
interface SaveResultResponse {
  /** Whether the operation was successful */
  success: boolean;
  /** Game mode that was played (quiz or chronology) */
  gameMode?: GameMode;
  /** ID of the saved game result */
  id?: string;
  /** Error message in case of failure */
  message?: string;
}

/**
 * Creates a response object with error information
 *
 * @since 3.1.0
 * @category API Helpers
 *
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @returns {Response} HTTP response object
 */
function createErrorResponse(message: string, status: number = 500): Response {
  return new Response(
    JSON.stringify({
      success: false,
      message,
    } satisfies SaveResultResponse),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

/**
 * Creates a success response object
 *
 * @since 3.1.0
 * @category API Helpers
 *
 * @param {Object} data - Response data
 * @param {GameMode} data.gameMode - Game mode that was played
 * @param {string} data.id - ID of the saved game
 * @returns {Response} HTTP response object
 */
function createSuccessResponse(data: { gameMode: GameMode; id: string }): Response {
  return new Response(
    JSON.stringify({
      success: true,
      gameMode: data.gameMode,
      id: data.id,
    } satisfies SaveResultResponse),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

/**
 * Validates the input data from a game result request
 *
 * @since 3.0.0
 * @category Validation
 *
 * @param {unknown} data - The data to validate
 * @param {function} t - Translation function
 * @throws {ValidationError} If the data is invalid
 * @returns {GameResultData} The validated data
 */
function validateGameResultData(
  data: unknown,
  t: (key: string) => string
): asserts data is GameResultData {
  if (!data || typeof data !== "object") {
    throw new ValidationError(t("errors.gameResult.validation.invalidData"));
  }

  const gameData = data as Partial<GameResultData>;

  if (!gameData.userId) {
    throw new ValidationError(t("errors.gameResult.validation.missingUserId"));
  }

  if (!gameData.categoryName) {
    throw new ValidationError(t("errors.gameResult.validation.missingCategory"));
  }

  if (!gameData.difficulty) {
    throw new ValidationError(t("errors.gameResult.validation.missingDifficulty"));
  }

  if (
    gameData.difficulty !== "easy" &&
    gameData.difficulty !== "medium" &&
    gameData.difficulty !== "hard"
  ) {
    throw new ValidationError(t("errors.gameResult.validation.invalidDifficulty"));
  }

  if (typeof gameData.score !== "number") {
    throw new ValidationError(t("errors.gameResult.validation.invalidScore"));
  }

  if (typeof gameData.correctAnswers !== "number") {
    throw new ValidationError(t("errors.gameResult.validation.invalidCorrectAnswers"));
  }

  if (typeof gameData.totalRounds !== "number") {
    throw new ValidationError(t("errors.gameResult.validation.invalidTotalRounds"));
  }
}

/**
 * POST handler for saving game results
 *
 * This API route receives game results from the client, validates the data,
 * determines the game mode, and stores the results in the database.
 * It also triggers achievement processing and user streak updates.
 *
 * @since 3.0.0
 * @category API
 *
 * @param {Object} context - Astro API route context
 * @param {Request} context.request - The HTTP request object
 * @param {Object} context.params - URL parameters including language
 * @returns {Response} JSON response indicating success or failure
 *
 * @example
 * // Example client-side usage:
 * const response = await fetch('/api/game/save-result', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     userId: 'user_abc123',
 *     categoryName: 'Rock Classics',
 *     difficulty: 'medium',
 *     score: 750,
 *     correctAnswers: 12,
 *     totalRounds: 15
 *   })
 * });
 * const result = await response.json();
 * if (result.success) {
 *   console.log(`Game saved with ID: ${result.id}`);
 * }
 */
export const POST: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters or default to German
  const lang = (params.lang as string) || "de";
  const t = useTranslations(lang);
  try {
    const rawData = await request.json();

    // Validate the input data with our type assertion function
    try {
      validateGameResultData(rawData, t);
    } catch (validationError) {
      if (isValidationError(validationError)) {
        return createErrorResponse(validationError.message, 400);
      }
      throw validationError; // Re-throw unexpected errors
    }

    // Now data is validated and typed
    const data = rawData as GameResultData;

    // Determine the game mode based on the referer URL
    const referer = request.headers.get("referer") || "";
    const gameMode: GameMode = referer.includes("/game-") ? "quiz" : "chronology";

    // Skip saving for guest users (not authenticated)
    if (data.userId === "guest") {
      console.warn("Guest user detected, skipping database save");

      // Return a successful response without actually saving to database
      // This prevents FOREIGN KEY constraint errors while maintaining game flow
      return createSuccessResponse({ gameMode, id: "guest-session" });
    }

    // Generate a unique ID for the game result using nanoid
    const id = nanoid();

    try {
      // Save the game result to the database
      await turso.execute({
        sql: `
          INSERT INTO game_results (
            id,
            user_id,
            game_mode,
            score,
            category,
            difficulty
          ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [id, data.userId, gameMode, data.score, data.categoryName, data.difficulty],
      });

      // Execute these operations in parallel for better performance
      await Promise.all([
        // Update user statistics for the game mode
        updateUserModeStats(data.userId, gameMode, data.score),

        // Save the highscore entry
        saveHighscore(data.userId, gameMode, data.score, data.categoryName),
      ]);
    } catch (dbError) {
      // Handle database errors specifically
      console.error(t("errors.gameResult.log.database"), dbError);
      throw new DatabaseError(t("errors.gameResult.database.saveFailed"), dbError);
    }

    // Create a GameState object for achievement verification
    const gameState: GameState = {
      score: data.score,
      correctAnswers: data.correctAnswers,
      roundIndex: data.totalRounds,
      currentQuestion: null,

      // Extended properties for achievement tracking
      category: data.genreId
        ? {
            id: data.genreId,
            name: data.categoryName,
          }
        : undefined,
      lastAnswerTime: typeof data.lastAnswerTime === "number" ? data.lastAnswerTime : undefined,
      lastAnswerCorrect:
        typeof data.lastAnswerCorrect === "boolean" ? data.lastAnswerCorrect : undefined,
      eventId: data.eventId || undefined,
      endOfSession: data.endOfSession === true,
      debugAchievements: data.debugAchievements === true,
    };

    // Update the user's daily activity
    // This is done asynchronously to avoid delaying the response
    updateDailyActivity(data.userId).catch((error) =>
      console.error(t("errors.gameResult.log.dailyActivity"), error)
    );

    // Check and update achievements
    // This is done asynchronously to avoid delaying the response
    processAchievementsAfterGame(data.userId, gameState, lang).catch((error) =>
      console.error(t("errors.gameResult.log.achievements"), error)
    );

    return createSuccessResponse({ gameMode, id });
  } catch (error) {
    console.error(t("errors.gameResult.log.api"), error);

    if (isApiError(error)) {
      return createErrorResponse(error.message, error.statusCode);
    }

    return createErrorResponse(
      error instanceof Error ? error.message : t("errors.gameResult.log.unknown")
    );
  }
};

/**
 * Memoized function for checking if a user has existing stats
 * Caches results to prevent duplicate database queries in the same session
 *
 * @since 3.0.0
 * @category Performance
 */
const userStatsCache = new Map<string, boolean>();

/**
 * Helper to create a cache key for the user stats cache
 *
 * @since 3.1.0
 * @category Utilities
 *
 * @param {UserId} userId - The user ID
 * @param {GameMode} gameMode - The game mode
 * @returns {string} A unique cache key
 */
const createStatsCacheKey = (userId: UserId, gameMode: GameMode): string =>
  `${userId.toString()}_${gameMode}`;

/**
 * Updates user statistics for a specific game mode
 *
 * This function either updates an existing user stats record or creates a new one
 * if the user hasn't played this game mode before. It tracks total score, games played,
 * and highest score achieved.
 *
 * @since 3.0.0
 * @category Database Operations
 *
 * @param {UserId} userId - Unique identifier of the user
 * @param {GameMode} gameMode - Game mode played (quiz or chronology)
 * @param {number} score - Score achieved in this game
 * @returns {Promise<void>}
 *
 * @example
 * // Update stats for a user who just completed a quiz game
 * await updateUserModeStats('user123', 'quiz', 450);
 */
async function updateUserModeStats(
  userId: UserId,
  gameMode: GameMode,
  score: number
): Promise<void> {
  const cacheKey = createStatsCacheKey(userId, gameMode);

  // Check cache first to avoid unnecessary database queries
  let hasStats = userStatsCache.get(cacheKey);

  // If not in cache, check database
  if (hasStats === undefined) {
    // Check if a record already exists for this user and game mode
    const existingStats = await turso.execute({
      sql: `
        SELECT 1 FROM user_mode_stats
        WHERE user_id = ? AND game_mode = ?
        LIMIT 1
      `,
      args: [userId, gameMode],
    });

    hasStats = existingStats.rows.length > 0;
    userStatsCache.set(cacheKey, hasStats);
  }

  if (hasStats) {
    // Update existing record
    await turso.execute({
      sql: `
        UPDATE user_mode_stats
        SET
          total_score = total_score + ?,
          games_played = games_played + 1,
          highest_score = CASE WHEN ? > highest_score THEN ? ELSE highest_score END
        WHERE user_id = ? AND game_mode = ?
      `,
      args: [score, score, score, userId, gameMode],
    });
  } else {
    // Insert new record
    await turso.execute({
      sql: `
        INSERT INTO user_mode_stats (
          user_id,
          game_mode,
          total_score,
          games_played,
          highest_score
        ) VALUES (?, ?, ?, ?, ?)
      `,
      args: [userId, gameMode, score, 1, score],
    });
  }
}

/**
 * Saves a new highscore entry to the database
 *
 * This function creates a new entry in the highscores table for potential
 * inclusion in leaderboards.
 *
 * @since 3.0.0
 * @category Database Operations
 *
 * @param {UserId} userId - Unique identifier of the user
 * @param {GameMode} gameMode - Game mode played (quiz or chronology)
 * @param {number} score - Score achieved in this game
 * @param {string} category - Music category that was played
 * @returns {Promise<void>}
 */
async function saveHighscore(
  userId: UserId,
  gameMode: GameMode,
  score: number,
  category: string
): Promise<void> {
  // Generate a unique ID for the highscore
  const id = nanoid();

  // Insert the highscore into the database
  await turso.execute({
    sql: `
      INSERT INTO highscores (
        id,
        user_id,
        game_mode,
        score,
        category
      ) VALUES (?, ?, ?, ?, ?)
    `,
    args: [id, userId, gameMode, score, category],
  });
}
