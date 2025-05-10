/**
 * Achievement Extension Service
 *
 * This service contains the logic for checking and updating new achievement types.
 */

import { turso } from "../turso.ts";
import type {
  Achievement,
  UserAchievement,
  AchievementCheckResult,
} from "../types/achievement.ts";
import { updateAchievementProgress } from "./achievementService.ts";

/**
 * Tracks the number of different genres played by a user
 *
 * @param userId - User's ID
 * @param genreId - ID of the genre that was just played
 * @returns Promise with the updated progress
 */
export async function trackGenreExplorer(
  userId: string,
  genreId: string,
): Promise<number> {
  // Check if genre has already been played
  const checkSql = `
    SELECT COUNT(*) as count FROM user_played_genres 
    WHERE user_id = ? AND genre_id = ?
  `;

  const checkResult = await turso.execute({
    sql: checkSql,
    args: [userId, genreId],
  });

  const alreadyPlayed =
    checkResult.rows && Number(checkResult.rows[0].count) > 0;

  // If not played yet, add to the list of played genres
  if (!alreadyPlayed) {
    const insertSql = `
      INSERT INTO user_played_genres (user_id, genre_id, played_at)
      VALUES (?, ?, ?)
    `;

    await turso.execute({
      sql: insertSql,
      args: [userId, genreId, new Date().toISOString()],
    });
  }

  // Retrieve the number of different genres played
  const countSql = `
    SELECT COUNT(DISTINCT genre_id) as genre_count 
    FROM user_played_genres 
    WHERE user_id = ?
  `;

  const countResult = await turso.execute({
    sql: countSql,
    args: [userId],
  });

  return countResult.rows ? Number(countResult.rows[0].genre_count) : 0;
}

/**
 * Tracks the number of consecutive games for a user
 *
 * @param userId - User's ID
 * @param resetSeries - Whether to reset the series (e.g., when returning to main menu)
 * @returns Promise with the updated progress
 */
export async function trackGameSeries(
  userId: string,
  resetSeries: boolean = false,
): Promise<number> {
  // Retrieve current series
  const getSql = `
    SELECT current_series FROM user_game_series 
    WHERE user_id = ?
  `;

  const getResult = await turso.execute({
    sql: getSql,
    args: [userId],
  });

  let currentSeries = 0;

  if (resetSeries) {
    // Reset series
    currentSeries = 0;
  } else if (!getResult.rows || getResult.rows.length === 0) {
    // Create new entry
    currentSeries = 1;

    const insertSql = `
      INSERT INTO user_game_series (user_id, current_series, max_series, last_updated)
      VALUES (?, ?, ?, ?)
    `;

    await turso.execute({
      sql: insertSql,
      args: [userId, currentSeries, currentSeries, new Date().toISOString()],
    });
  } else {
    // Increase series
    currentSeries = Number(getResult.rows[0].current_series) + 1;

    const updateSql = `
      UPDATE user_game_series 
      SET current_series = ?, 
          max_series = CASE WHEN ? > max_series THEN ? ELSE max_series END,
          last_updated = ?
      WHERE user_id = ?
    `;

    await turso.execute({
      sql: updateSql,
      args: [
        currentSeries,
        currentSeries,
        currentSeries,
        new Date().toISOString(),
        userId,
      ],
    });
  }

  return currentSeries;
}

/**
 * Tracks the number of quick answers for a user
 *
 * @param userId - User's ID
 * @param answerTimeMs - Answer time in milliseconds
 * @param isCorrect - Whether the answer was correct
 * @returns Promise with the updated progress
 */
export async function trackQuickAnswer(
  userId: string,
  answerTimeMs: number,
  isCorrect: boolean,
): Promise<number> {
  // Only count correct answers under 3 seconds
  if (!isCorrect || answerTimeMs >= 3000) {
    return 0;
  }

  // Retrieve current number of quick answers
  const getSql = `
    SELECT quick_answers FROM user_answer_stats 
    WHERE user_id = ?
  `;

  const getResult = await turso.execute({
    sql: getSql,
    args: [userId],
  });

  let quickAnswers = 0;

  if (!getResult.rows || getResult.rows.length === 0) {
    // Create new entry
    quickAnswers = 1;

    const insertSql = `
      INSERT INTO user_answer_stats (user_id, quick_answers, last_updated)
      VALUES (?, ?, ?)
    `;

    await turso.execute({
      sql: insertSql,
      args: [userId, quickAnswers, new Date().toISOString()],
    });
  } else {
    // Increase count
    quickAnswers = Number(getResult.rows[0].quick_answers) + 1;

    const updateSql = `
      UPDATE user_answer_stats 
      SET quick_answers = ?, 
          last_updated = ?
      WHERE user_id = ?
    `;

    await turso.execute({
      sql: updateSql,
      args: [quickAnswers, new Date().toISOString(), userId],
    });
  }

  return quickAnswers;
}

/**
 * Tracks participation in seasonal events for a user
 *
 * @param userId - User's ID
 * @param eventId - ID of the seasonal event
 * @returns Promise with the updated progress
 */
export async function trackSeasonalEvent(
  userId: string,
  eventId: string,
): Promise<number> {
  // Check if already participated in the event
  const checkSql = `
    SELECT COUNT(*) as count FROM user_seasonal_events 
    WHERE user_id = ? AND event_id = ?
  `;

  const checkResult = await turso.execute({
    sql: checkSql,
    args: [userId, eventId],
  });

  const alreadyParticipated =
    checkResult.rows && Number(checkResult.rows[0].count) > 0;

  // If not participated yet, add to the list of events
  if (!alreadyParticipated) {
    const insertSql = `
      INSERT INTO user_seasonal_events (user_id, event_id, participated_at)
      VALUES (?, ?, ?)
    `;

    await turso.execute({
      sql: insertSql,
      args: [userId, eventId, new Date().toISOString()],
    });
  }

  // Retrieve the number of different events
  const countSql = `
    SELECT COUNT(DISTINCT event_id) as event_count 
    FROM user_seasonal_events 
    WHERE user_id = ?
  `;

  const countResult = await turso.execute({
    sql: countSql,
    args: [userId],
  });

  return countResult.rows ? Number(countResult.rows[0].event_count) : 0;
}

/**
 * Checks and updates extended achievements for a user
 *
 * @param userId - User's ID
 * @param options - Optional parameters:
 *   - genreId: ID of the genre
 *   - answerTimeMs: Answer time in milliseconds
 *   - isCorrectAnswer: Whether the answer was correct
 *   - eventId: ID of the seasonal event
 *   - resetGameSeries: Whether to reset the game series
 * @returns Promise with the achievement check result
 */
export async function checkExtendedAchievements(
  userId: string,
  options: {
    genreId?: string;
    answerTimeMs?: number;
    isCorrectAnswer?: boolean;
    eventId?: string;
    resetGameSeries?: boolean;
  } = {},
): Promise<AchievementCheckResult> {
  const unlockedAchievements: Achievement[] = [];
  const updatedAchievements: Achievement[] = [];

  // Retrieve all extended achievements
  const achievementsSql = `
    SELECT
      a.id,
      a.code,
      a.category_id AS categoryId,
      a.condition_type AS conditionType,
      a.condition_value AS conditionValue,
      ua.current_progress AS currentProgress,
      ua.unlocked_at AS unlockedAt
    FROM achievements a
    LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
    WHERE a.condition_type IN ('genre_explorer', 'game_series', 'quick_answer', 'seasonal_event')
  `;

  const achievementsResult = await turso.execute({
    sql: achievementsSql,
    args: [userId],
  });

  if (!achievementsResult.rows) {
    return { unlockedAchievements, updatedAchievements };
  }

  // Retrieve progress for different types
  let genreExplorerProgress = 0;
  let gameSeriesProgress = 0;
  let quickAnswerProgress = 0;
  let seasonalEventProgress = 0;

  // Genre Explorer
  if (options.genreId) {
    genreExplorerProgress = await trackGenreExplorer(userId, options.genreId);
  }

  // Game Series
  gameSeriesProgress = await trackGameSeries(userId, options.resetGameSeries);

  // Quick Answer
  if (
    options.answerTimeMs !== undefined &&
    options.isCorrectAnswer !== undefined
  ) {
    quickAnswerProgress = await trackQuickAnswer(
      userId,
      options.answerTimeMs,
      options.isCorrectAnswer,
    );
  }

  // Seasonal Event
  if (options.eventId) {
    seasonalEventProgress = await trackSeasonalEvent(userId, options.eventId);
  }

  // Check and update achievements
  for (const row of achievementsResult.rows) {
    const achievement: Achievement = {
      id: row.id as string,
      code: row.code as string,
      categoryId: row.categoryId as string,
      conditionType: row.conditionType as any,
      conditionValue: Number(row.conditionValue),
      rarityPercentage: 0,
    };

    const currentProgress = row.currentProgress
      ? Number(row.currentProgress)
      : 0;
    const unlockedAt = row.unlockedAt as string | null;

    // Skip if already unlocked
    if (unlockedAt) {
      continue;
    }

    let newProgress = currentProgress;

    // Update progress based on condition type
    switch (achievement.conditionType) {
      case "genre_explorer":
        newProgress = genreExplorerProgress;
        break;
      case "game_series":
        newProgress = gameSeriesProgress;
        break;
      case "quick_answer":
        newProgress = quickAnswerProgress;
        break;
      case "seasonal_event":
        newProgress = seasonalEventProgress;
        break;
    }

    // If progress has changed, update
    if (newProgress !== currentProgress && newProgress > 0) {
      const userAchievement = await updateAchievementProgress(
        userId,
        achievement.id,
        newProgress,
      );

      achievement.userProgress = userAchievement;
      updatedAchievements.push(achievement);

      // If unlocked, add to the list of unlocked achievements
      if (userAchievement.unlockedAt) {
        unlockedAchievements.push(achievement);
      }
    }
  }

  return {
    unlockedAchievements,
    updatedAchievements,
  };
}
