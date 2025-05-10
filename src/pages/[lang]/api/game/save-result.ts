/**
 * API endpoint for saving game results
 *
 * This file handles saving game results to the database after a player completes a game.
 * It processes the submitted game data, validates it, and stores it in multiple tables:
 * - game_results: stores the main game result
 * - user_mode_stats: keeps track of cumulative user statistics by game mode
 * - highscores: tracks high scores for leaderboard purposes
 */
import { turso } from "../../../../turso.ts";
import { nanoid } from "nanoid";
import type { APIRoute } from "astro";
import { processAchievementsAfterGame } from "../../../../services/gameAchievementService.ts";
import { updateDailyActivity } from "../../../../services/userStreakService.ts";
import type { GameState } from "../../../../types/game.ts";

/**
 * Interface representing the game result data submitted to the API
 *
 * @property {string} userId - Unique identifier of the user
 * @property {string} categoryName - Name of the music category played
 * @property {string} difficulty - Difficulty level chosen (easy, medium, hard)
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
  userId: string;
  categoryName: string;
  difficulty: string;
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
 * POST handler for saving game results
 *
 * This API route receives game results from the client, validates the data,
 * determines the game mode, and stores the results in the database.
 * It also triggers achievement processing and user streak updates.
 *
 * @param {Object} context - Astro API route context
 * @param {Request} context.request - The HTTP request object
 * @param {Object} context.params - URL parameters including language
 * @returns {Response} JSON response indicating success or failure
 */
export const POST: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters or default to German
  const lang = (params.lang as string) || "de";
  try {
    const data: GameResultData = await request.json();

    console.log("Received game result data:", JSON.stringify(data, null, 2));

    // Validate the input data
    if (
      !data.userId ||
      !data.categoryName ||
      !data.difficulty ||
      typeof data.score !== "number"
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid input data",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Determine the game mode based on the referer URL
    const referer = request.headers.get("referer") || "";
    const gameMode = referer.includes("/game-") ? "quiz" : "chronology";

    // Generate a unique ID for the game result
    const id = nanoid();

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
      args: [
        id,
        data.userId,
        gameMode,
        data.score,
        data.categoryName,
        data.difficulty,
      ],
    });

    // Update user statistics for the game mode
    await updateUserModeStats(data.userId, gameMode, data.score);

    // Save the highscore entry
    await saveHighscore(data.userId, gameMode, data.score, data.categoryName);

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
      lastAnswerTime:
        typeof data.lastAnswerTime === "number"
          ? data.lastAnswerTime
          : undefined,
      lastAnswerCorrect:
        typeof data.lastAnswerCorrect === "boolean"
          ? data.lastAnswerCorrect
          : undefined,
      eventId: data.eventId || undefined,
      endOfSession: data.endOfSession === true,
      debugAchievements: data.debugAchievements === true,
    };

    // Update the user's daily activity
    // This is done asynchronously to avoid delaying the response
    updateDailyActivity(data.userId).catch((error) =>
      console.error("Error updating daily activity:", error),
    );

    // Check and update achievements
    // This is done asynchronously to avoid delaying the response
    processAchievementsAfterGame(data.userId, gameState, lang).catch((error) =>
      console.error("Error processing achievements:", error),
    );

    return new Response(
      JSON.stringify({
        success: true,
        gameMode,
        id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

/**
 * Updates user statistics for a specific game mode
 *
 * This function either updates an existing user stats record or creates a new one
 * if the user hasn't played this game mode before. It tracks total score, games played,
 * and highest score achieved.
 *
 * @param {string} userId - Unique identifier of the user
 * @param {string} gameMode - Game mode played (quiz or chronology)
 * @param {number} score - Score achieved in this game
 * @returns {Promise<void>}
 */
async function updateUserModeStats(
  userId: string,
  gameMode: string,
  score: number,
): Promise<void> {
  // Check if a record already exists for this user and game mode
  const existingStats = await turso.execute({
    sql: `
      SELECT * FROM user_mode_stats
      WHERE user_id = ? AND game_mode = ?
    `,
    args: [userId, gameMode],
  });

  if (existingStats.rows.length > 0) {
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
 * @param {string} userId - Unique identifier of the user
 * @param {string} gameMode - Game mode played (quiz or chronology)
 * @param {number} score - Score achieved in this game
 * @param {string} category - Music category that was played
 * @returns {Promise<void>}
 */
async function saveHighscore(
  userId: string,
  gameMode: string,
  score: number,
  category: string,
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
