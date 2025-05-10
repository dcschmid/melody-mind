/**
 * Achievement Service
 *
 * This service contains the logic for checking and updating achievements.
 */

import { turso } from "../turso.ts";
import type {
  Achievement,
  UserAchievement,
  LocalizedAchievement,
  AchievementCheckResult,
} from "../types/achievement.ts";
import type { GameState } from "../types/game.ts";
import {
  updateDailyActivity,
  getUserStreak,
  getDailyActivity,
} from "./userStreakService.ts";

/**
 * Retrieves all available achievements
 *
 * @param language - Language code for translations
 * @returns Array of achievements with translations
 */
export async function getAllAchievements(
  language: string,
): Promise<Achievement[]> {
  const sql = `
    SELECT 
      a.id, 
      a.code, 
      a.category_id AS categoryId, 
      a.condition_type AS conditionType, 
      a.condition_value AS conditionValue, 
      a.rarity_percentage AS rarityPercentage, 
      a.icon_path AS iconPath,
      c.id AS category_id,
      c.code AS category_code,
      c.points AS category_points,
      c.icon_path AS category_iconPath,
      c.sort_order AS category_sortOrder,
      t.name, 
      t.description
    FROM achievements a
    JOIN achievement_categories c ON a.category_id = c.id
    LEFT JOIN achievement_translations t ON a.id = t.achievement_id AND t.language = ?
    ORDER BY c.sort_order, a.condition_value
  `;

  const result = await turso.execute({
    sql,
    args: [language],
  });

  if (!result.rows) {
    return [];
  }

  return result.rows.map((row: any) => {
    const achievement: Achievement = {
      id: row.id as string,
      code: row.code as string,
      categoryId: row.categoryId as string,
      conditionType: row.conditionType as any,
      conditionValue: Number(row.conditionValue),
      rarityPercentage: Number(row.rarityPercentage),
      iconPath: row.iconPath as string | undefined,
      category: {
        id: row.category_id as string,
        code: row.category_code as any,
        points: Number(row.category_points),
        iconPath: row.category_iconPath as string,
        sortOrder: Number(row.category_sortOrder),
      },
      translations: [
        {
          achievementId: row.id as string,
          language,
          name: row.name as string,
          description: row.description as string,
        },
      ],
    };

    return achievement;
  });
}

/**
 * Retrieves the achievements of a user
 *
 * @param userId - ID of the user
 * @param language - Language code for translations
 * @returns Array of achievements with user progress and translations
 */
export async function getUserAchievements(
  userId: string,
  language: string,
): Promise<LocalizedAchievement[]> {
  // Fallback language (German as default, since it's the app's standard language)
  const fallbackLanguage = "de";

  // SQL query with fallback translations
  const sql = `
    SELECT
      a.id,
      a.code,
      a.category_id AS categoryId,
      a.condition_type AS conditionType,
      a.condition_value AS conditionValue,
      a.rarity_percentage AS rarityPercentage,
      a.icon_path AS iconPath,
      c.id AS category_id,
      c.code AS category_code,
      c.points AS category_points,
      c.icon_path AS category_iconPath,
      c.sort_order AS category_sortOrder,
      t_requested.name AS requested_name,
      t_requested.description AS requested_description,
      t_fallback.name AS fallback_name,
      t_fallback.description AS fallback_description,
      ua.current_progress AS currentProgress,
      ua.unlocked_at AS unlockedAt
    FROM achievements a
    JOIN achievement_categories c ON a.category_id = c.id
    LEFT JOIN achievement_translations t_requested ON a.id = t_requested.achievement_id AND t_requested.language = ?
    LEFT JOIN achievement_translations t_fallback ON a.id = t_fallback.achievement_id AND t_fallback.language = ?
    LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
    ORDER BY c.sort_order, a.condition_value
  `;

  const result = await turso.execute({
    sql,
    args: [language, fallbackLanguage, userId],
  });

  if (!result.rows) {
    return [];
  }

  return result.rows.map((row: any) => {
    const currentProgress = row.currentProgress
      ? Number(row.currentProgress)
      : 0;
    const conditionValue = Number(row.conditionValue);
    const progressPercentage = Math.min(
      Math.round((currentProgress / conditionValue) * 100),
      100,
    );

    let status: "locked" | "in-progress" | "unlocked" = "locked";
    if (row.unlockedAt) {
      status = "unlocked";
    } else if (currentProgress > 0) {
      status = "in-progress";
    }

    // Use the requested translation if available, otherwise the fallback translation
    const name =
      row.requested_name || row.fallback_name || `Achievement ${row.code}`;
    const description =
      row.requested_description ||
      row.fallback_description ||
      `Condition: ${row.conditionType} ${conditionValue}`;

    const achievement: LocalizedAchievement = {
      id: row.id as string,
      code: row.code as string,
      categoryId: row.categoryId as string,
      conditionType: row.conditionType as any,
      conditionValue,
      rarityPercentage: Number(row.rarityPercentage),
      iconPath: row.iconPath as string | undefined,
      category: {
        id: row.category_id as string,
        code: row.category_code as any,
        points: Number(row.category_points),
        iconPath: row.category_iconPath as string,
        sortOrder: Number(row.category_sortOrder),
      },
      name,
      description,
      userProgress: {
        userId,
        achievementId: row.id as string,
        currentProgress,
        unlockedAt: row.unlockedAt as string | null,
      },
      progressPercentage,
      status,
    };

    return achievement;
  });
}

/**
 * Updates the progress of an achievement for a user
 *
 * @param userId - ID of the user
 * @param achievementId - ID of the achievement
 * @param progress - New progress value
 * @returns Updated UserAchievement object
 */
export async function updateAchievementProgress(
  userId: string,
  achievementId: string,
  progress: number,
): Promise<UserAchievement> {
  // Check if the achievement already exists
  const checkSql = `
    SELECT * FROM user_achievements 
    WHERE user_id = ? AND achievement_id = ?
  `;

  const checkResult = await turso.execute({
    sql: checkSql,
    args: [userId, achievementId],
  });

  // Retrieve achievement details
  const achievementSql = `
    SELECT condition_value FROM achievements 
    WHERE id = ?
  `;

  const achievementResult = await turso.execute({
    sql: achievementSql,
    args: [achievementId],
  });

  if (!achievementResult.rows || achievementResult.rows.length === 0) {
    throw new Error(`Achievement with ID ${achievementId} not found`);
  }

  const conditionValue = Number(achievementResult.rows[0].condition_value);
  const isUnlocked = progress >= conditionValue;
  const unlockedAt = isUnlocked ? new Date().toISOString() : null;

  if (!checkResult.rows || checkResult.rows.length === 0) {
    // Create new entry
    const insertSql = `
      INSERT INTO user_achievements (user_id, achievement_id, current_progress, unlocked_at)
      VALUES (?, ?, ?, ?)
    `;

    await turso.execute({
      sql: insertSql,
      args: [userId, achievementId, progress, unlockedAt],
    });
  } else {
    // Update existing entry
    const updateSql = `
      UPDATE user_achievements 
      SET current_progress = ?, unlocked_at = ?
      WHERE user_id = ? AND achievement_id = ?
    `;

    await turso.execute({
      sql: updateSql,
      args: [progress, unlockedAt, userId, achievementId],
    });
  }

  return {
    userId,
    achievementId,
    currentProgress: progress,
    unlockedAt,
  };
}

/**
 * Unlocks an achievement for a user
 *
 * @param userId - ID of the user
 * @param achievementId - ID of the achievement
 * @returns Updated UserAchievement object
 */
export async function unlockAchievement(
  userId: string,
  achievementId: string,
): Promise<UserAchievement> {
  // Retrieve achievement details
  const achievementSql = `
    SELECT condition_value FROM achievements 
    WHERE id = ?
  `;

  const achievementResult = await turso.execute({
    sql: achievementSql,
    args: [achievementId],
  });

  if (!achievementResult.rows || achievementResult.rows.length === 0) {
    throw new Error(`Achievement with ID ${achievementId} not found`);
  }

  const conditionValue = Number(achievementResult.rows[0].condition_value);
  const unlockedAt = new Date().toISOString();

  // Check if the achievement already exists
  const checkSql = `
    SELECT * FROM user_achievements 
    WHERE user_id = ? AND achievement_id = ?
  `;

  const checkResult = await turso.execute({
    sql: checkSql,
    args: [userId, achievementId],
  });

  if (!checkResult.rows || checkResult.rows.length === 0) {
    // Create new entry
    const insertSql = `
      INSERT INTO user_achievements (user_id, achievement_id, current_progress, unlocked_at)
      VALUES (?, ?, ?, ?)
    `;

    await turso.execute({
      sql: insertSql,
      args: [userId, achievementId, conditionValue, unlockedAt],
    });
  } else {
    // Update existing entry
    const updateSql = `
      UPDATE user_achievements 
      SET current_progress = ?, unlocked_at = ?
      WHERE user_id = ? AND achievement_id = ?
    `;

    await turso.execute({
      sql: updateSql,
      args: [conditionValue, unlockedAt, userId, achievementId],
    });
  }

  return {
    userId,
    achievementId,
    currentProgress: conditionValue,
    unlockedAt,
  };
}

/**
 * Checks and updates achievements after a game
 *
 * @param userId - ID of the user
 * @param gameState - Game status after the game
 * @param isPerfectGame - Whether it was a perfect game
 * @returns Result of the achievement check
 */
export async function checkAchievementsAfterGame(
  userId: string,
  gameState: GameState,
  isPerfectGame: boolean,
): Promise<AchievementCheckResult> {
  const unlockedAchievements: Achievement[] = [];
  const updatedAchievements: Achievement[] = [];

  // Retrieve user statistics
  const statsSql = `
    SELECT
      SUM(games_played) AS total_games_played,
      SUM(total_score) AS total_score
    FROM user_mode_stats
    WHERE user_id = ?
  `;

  const statsResult = await turso.execute({
    sql: statsSql,
    args: [userId],
  });

  if (!statsResult.rows || statsResult.rows.length === 0) {
    return { unlockedAchievements, updatedAchievements };
  }

  const totalGamesPlayed = Number(statsResult.rows[0].total_games_played || 0);
  const totalScore = Number(statsResult.rows[0].total_score || 0);

  // Retrieve number of perfect games
  const perfectGamesSql = `
    SELECT COUNT(*) AS perfect_games_count
    FROM game_results
    WHERE user_id = ? AND score = (
      CASE
        WHEN game_mode = 'quiz' THEN 10
        WHEN game_mode = 'chronology' THEN 10
        ELSE 0
      END
    )
  `;

  const perfectGamesResult = await turso.execute({
    sql: perfectGamesSql,
    args: [userId],
  });

  const perfectGamesCount =
    Number(perfectGamesResult.rows?.[0]?.perfect_games_count || 0) +
    (isPerfectGame ? 1 : 0);

  // Update daily activity and check streak
  const dailyActivity = await updateDailyActivity(userId);
  const userStreak = await getUserStreak(userId);

  // Retrieve all achievements
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
  `;

  const achievementsResult = await turso.execute({
    sql: achievementsSql,
    args: [userId],
  });

  if (!achievementsResult.rows) {
    return { unlockedAchievements, updatedAchievements };
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

    // If already unlocked, skip
    if (unlockedAt) {
      continue;
    }

    let newProgress = currentProgress;

    // Update progress based on condition type
    switch (achievement.conditionType) {
      case "games_played":
        newProgress = totalGamesPlayed;
        break;
      case "perfect_games":
        newProgress = perfectGamesCount;
        break;
      case "total_score":
        newProgress = totalScore;
        break;
      case "daily_streak":
        newProgress = userStreak.currentStreak;
        break;
      case "daily_games":
        newProgress = dailyActivity.activityCount;
        break;
      case "genre_explorer":
        // Updated by a separate process when a game in a new genre is played
        break;
      case "game_series":
        // Updated by a separate process when games are played in a series
        break;
      case "quick_answer":
        // Updated by a separate process when quick answers are given
        break;
      case "seasonal_event":
        // Updated by a separate process when participating in seasonal events
        break;
    }

    // If progress has changed, update
    if (newProgress !== currentProgress) {
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
