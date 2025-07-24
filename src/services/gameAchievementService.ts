/**
 * Game Achievement Service
 *
 * This service integrates the achievement system into the game system.
 * It provides functions to check and update achievements after games.
 */

import type { LocalizedAchievement, AchievementConditionType } from "../types/achievement.js";
import type { GameState } from "../types/game.js";
import { triggerAchievementUnlocked } from "../utils/achievements/achievementEvents.js";

import { checkExtendedAchievements } from "./achievementExtensionService.js";
import { checkAchievementsAfterGame } from "./achievementService.js";

/**
 * Checks achievements after a game and triggers events for unlocked achievements
 *
 * @param userId - User ID
 * @param gameState - Game state after the game
 * @param language - Language code for translations
 * @returns Promise that resolves with unlocked achievements
 */
export async function processAchievementsAfterGame(
  userId: string,
  gameState: GameState,
  language: string
): Promise<{ unlockedAchievements: any[] }> {
  const unlockedAchievements: any[] = [];

  // Skip achievement processing for guest users
  if (userId === "guest" || userId.startsWith("guest_")) {
    console.log("🎮 Achievement Service: Skipping achievements for guest user");
    return { unlockedAchievements: [] };
  }

  try {
    // Check if it was a perfect game
    const isPerfectGame = isPerfectGameScore(gameState);

    // Check standard achievements
    const result = await checkAchievementsAfterGame(userId, gameState, isPerfectGame);

    // Check extended achievements
    // We use the extended properties of the GameState interface

    // Debug output for troubleshooting
    console.log("GameState for achievement check:", JSON.stringify(gameState, null, 2));

    // If debug flag is set, we add a test achievement
    if (gameState.debugAchievements) {
      console.log("Debug achievement mode activated, adding test achievement");
    }

    // For genre_explorer: Genre ID from GameState
    const genreId = gameState.category?.id;

    // For quick_answer: Answer time and correctness from GameState
    // Ensure that the values have the correct type
    const answerTimeMs =
      typeof gameState.lastAnswerTime === "number" ? gameState.lastAnswerTime : undefined;
    const isCorrectAnswer =
      typeof gameState.lastAnswerCorrect === "boolean" ? gameState.lastAnswerCorrect : undefined;

    // For seasonal_event: Event ID from GameState
    const eventId = gameState.eventId || undefined;

    // For game_series: End of game session from GameState
    const resetGameSeries = gameState.endOfSession === true;

    // Debug output for troubleshooting
    console.log("Parameters for extended achievement check:", {
      genreId,
      answerTimeMs,
      isCorrectAnswer,
      eventId,
      resetGameSeries,
    });

    // Check extended achievements
    const extendedResult = await checkExtendedAchievements(userId, {
      genreId,
      answerTimeMs,
      isCorrectAnswer,
      eventId,
      resetGameSeries,
    });

    // Combine the results
    const allUnlockedAchievements = [
      ...result.unlockedAchievements,
      ...extendedResult.unlockedAchievements,
    ];

    // Trigger events for unlocked achievements
    if (allUnlockedAchievements.length > 0) {
      // Fetch complete achievement data with translations
      const fetchedAchievements = await fetchLocalizedAchievements(
        userId,
        allUnlockedAchievements.map((a) => a.id),
        language
      );

      // Add to unlocked achievements array
      unlockedAchievements.push(...fetchedAchievements);

      // Trigger events
      for (const achievement of fetchedAchievements) {
        console.log("Triggering achievement event for:", achievement.name);
        triggerAchievementUnlocked(achievement);
      }

      // If debug flag is set, we add a test achievement
      if (gameState.debugAchievements) {
        const testAchievement = {
          id: `test-achievement-${Date.now()}`,
          name: "Test Achievement",
          description: "This is a test achievement that was automatically triggered",
          type: "genre_explorer",
          category: {
            code: "bronze",
            name: "Bronze",
            id: "bronze-category",
          },
          status: "unlocked",
          unlockedAt: new Date().toISOString(),
        };

        console.log("Triggering debug achievement event:", testAchievement.name);
        triggerAchievementUnlocked(testAchievement as any);
        unlockedAchievements.push(testAchievement);
      }
    }
  } catch (error) {
    console.error("Error processing achievements after game:", error);
  }

  return { unlockedAchievements };
}

/**
 * Checks if a game is a perfect game (maximum score)
 *
 * @param gameState - Game state after the game
 * @returns true if it's a perfect game, otherwise false
 */
function isPerfectGameScore(gameState: GameState): boolean {
  // For Quiz and Chronology: 10 points = perfect game
  return gameState.score === 10;
}

/**
 * Fetches localized achievement data for a list of achievement IDs
 *
 * @param userId - User ID
 * @param achievementIds - List of achievement IDs
 * @param language - Language code for translations
 * @returns Promise with a list of localized achievements
 */
async function fetchLocalizedAchievements(
  userId: string,
  achievementIds: string[],
  language: string
): Promise<LocalizedAchievement[]> {
  try {
    // Instead of using the API, we fetch the achievements directly from the database
    // This avoids problems with authentication and URL parsing
    const achievementsSql = `
      SELECT
        a.id,
        a.code,
        a.category_id AS categoryId,
        a.condition_type AS conditionType,
        a.condition_value AS conditionValue,
        a.rarity_percentage AS rarityPercentage,
        a.icon_path AS iconPath,
        at.name,
        at.description,
        ua.current_progress AS currentProgress,
        ua.unlocked_at AS unlockedAt
      FROM achievements a
      LEFT JOIN achievement_translations at ON a.id = at.achievement_id AND at.language = ?
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
      WHERE a.id IN (${achievementIds.map(() => "?").join(",")})
    `;

    // Prepare the parameters
    const params = [language, userId, ...achievementIds];

    // Execute the query
    const { turso } = await import("../turso.js");
    const result = await turso.execute({
      sql: achievementsSql,
      args: params,
    });

    if (!result.rows || result.rows.length === 0) {
      return [];
    }

    // Convert the results to LocalizedAchievement objects
    return result.rows.map((row: any) => {
      const currentProgress = Number(row.currentProgress || 0);
      const conditionValue = Number(row.conditionValue || 0);
      const isUnlocked = row.unlockedAt !== null;

      // Calculate progress percentage
      const progressPercentage =
        conditionValue > 0
          ? Math.min(Math.round((currentProgress / conditionValue) * 100), 100)
          : 0;

      // Determine status
      let status: "locked" | "in-progress" | "unlocked" = "locked";
      if (isUnlocked) {
        status = "unlocked";
      } else if (currentProgress > 0) {
        status = "in-progress";
      }

      return {
        id: row.id as string,
        code: row.code as string,
        categoryId: row.categoryId as string,
        conditionType: row.conditionType as AchievementConditionType,
        conditionValue: Number(row.conditionValue || 0),
        rarityPercentage: Number(row.rarityPercentage || 0),
        iconPath: row.iconPath as string | undefined,
        name: row.name as string,
        description: row.description as string,
        currentProgress,
        unlockedAt: row.unlockedAt as string | null,
        progressPercentage,
        status,
      };
    });
  } catch (error) {
    console.error("Error fetching localized achievements:", error);
    return [];
  }
}

/**
 * Updates game statistics in the database and checks achievements
 *
 * This function should be called after each game.
 *
 * @param userId - User ID
 * @param gameState - Game state after the game
 * @param gameMode - Game mode (quiz or chronology)
 * @param category - Game category
 * @param language - Language code for translations
 */
export async function updateStatsAndCheckAchievements(
  userId: string,
  gameState: GameState,
  gameMode: "quiz" | "chronology",
  category: string,
  language: string
): Promise<void> {
  try {
    // API request to update game statistics
    // This request should already be implemented in the game system

    // Check achievements and trigger events
    await processAchievementsAfterGame(userId, gameState, language);
  } catch (error) {
    console.error("Error updating statistics and checking achievements:", error);
  }
}

/**
 * Initializes the achievement system for the game system
 *
 * This function should be called when starting the application.
 */
export function initGameAchievementSystem(): void {
  // Additional initialization steps could be performed here
  console.log("Game achievement system initialized");
}
