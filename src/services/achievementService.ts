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

import { updateDailyActivity, getUserStreak, getDailyActivity } from "./userStreakService.ts";

/**
 * Retrieves all available achievements
 *
 * @param language - Language code for translations
 * @returns Array of achievements with translations
 */
export async function getAllAchievements(language: string): Promise<Achievement[]> {
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
  language: string
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
    const currentProgress = row.currentProgress ? Number(row.currentProgress) : 0;
    const conditionValue = Number(row.conditionValue);
    const progressPercentage = Math.min(Math.round((currentProgress / conditionValue) * 100), 100);

    let status: "locked" | "in-progress" | "unlocked" = "locked";
    if (row.unlockedAt) {
      status = "unlocked";
    } else if (currentProgress > 0) {
      status = "in-progress";
    }

    // Use the requested translation if available, otherwise the fallback translation
    const name = row.requested_name || row.fallback_name || `Achievement ${row.code}`;
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
  progress: number
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
  achievementId: string
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
 * Updates user statistics for enhanced achievements
 *
 * @param userId - ID of the user
 * @param gameState - Game status after the game
 * @param gameData - Additional game data for enhanced tracking
 */
export async function updateEnhancedAchievementStats(
  userId: string,
  gameState: GameState,
  gameData: {
    isPerfectGame: boolean;
    averageAnswerTime: number;
    accuracy: number;
    usedJokers: number;
    difficulty: string;
    category: string;
  }
): Promise<void> {
  // Update accuracy statistics
  await updateAccuracyStats(userId, gameData.accuracy, gameData.isPerfectGame);

  // Update speed statistics
  await updateSpeedStats(userId, gameData.averageAnswerTime);

  // Update perfect streak
  await updatePerfectStreak(userId, gameData.isPerfectGame);

  // Update genre statistics
  await updateGenreStats(userId, gameData.category, gameData.isPerfectGame, gameState.score);

  // Update time-based activities
  await updateTimeBasedActivities(userId);

  // Update difficulty statistics
  await updateDifficultyStats(
    userId,
    gameData.difficulty,
    gameData.isPerfectGame,
    gameData.usedJokers === 0
  );

  // Update joker statistics
  await updateJokerStats(userId, gameData.usedJokers, gameState.score > 0);
}

/**
 * Updates user accuracy statistics
 */
async function updateAccuracyStats(
  userId: string,
  accuracy: number,
  isPerfectGame: boolean
): Promise<void> {
  const sql = `
    INSERT INTO user_accuracy_stats (user_id, current_accuracy_streak, max_accuracy_streak, total_correct_answers, total_answers)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      current_accuracy_streak = CASE 
        WHEN ? >= 95 THEN current_accuracy_streak + 1 
        ELSE 0 
      END,
      max_accuracy_streak = MAX(max_accuracy_streak, CASE 
        WHEN ? >= 95 THEN current_accuracy_streak + 1 
        ELSE 0 
      END),
      total_correct_answers = total_correct_answers + ?,
      total_answers = total_answers + 10,
      last_updated = datetime('now')
  `;

  const correctAnswers = Math.round((accuracy / 100) * 10);
  const streakValue = accuracy >= 95 ? 1 : 0;

  await turso.execute({
    sql,
    args: [
      userId,
      streakValue,
      streakValue,
      correctAnswers,
      10,
      accuracy,
      accuracy,
      correctAnswers,
    ],
  });
}

/**
 * Updates user speed statistics
 */
async function updateSpeedStats(userId: string, averageAnswerTime: number): Promise<void> {
  const sql = `
    INSERT INTO user_speed_stats (user_id, fastest_answer_time, total_quick_answers, average_answer_time, speed_games_count)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      fastest_answer_time = CASE 
        WHEN fastest_answer_time IS NULL OR ? < fastest_answer_time THEN ? 
        ELSE fastest_answer_time 
      END,
      total_quick_answers = total_quick_answers + CASE WHEN ? <= 5 THEN 1 ELSE 0 END,
      average_answer_time = ((average_answer_time * speed_games_count) + ?) / (speed_games_count + 1),
      speed_games_count = speed_games_count + 1,
      last_updated = datetime('now')
  `;

  await turso.execute({
    sql,
    args: [
      userId,
      averageAnswerTime,
      0,
      averageAnswerTime,
      1,
      averageAnswerTime,
      averageAnswerTime,
      averageAnswerTime,
      averageAnswerTime,
    ],
  });
}

/**
 * Updates perfect game streak
 */
async function updatePerfectStreak(userId: string, isPerfectGame: boolean): Promise<void> {
  const sql = `
    INSERT INTO user_perfect_streaks (user_id, current_perfect_streak, max_perfect_streak, last_perfect_game)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      current_perfect_streak = CASE 
        WHEN ? THEN current_perfect_streak + 1 
        ELSE 0 
      END,
      max_perfect_streak = MAX(max_perfect_streak, CASE 
        WHEN ? THEN current_perfect_streak + 1 
        ELSE 0 
      END),
      last_perfect_game = CASE WHEN ? THEN datetime('now') ELSE last_perfect_game END,
      last_updated = datetime('now')
  `;

  const streakValue = isPerfectGame ? 1 : 0;
  const lastPerfectGame = isPerfectGame ? new Date().toISOString() : null;

  await turso.execute({
    sql,
    args: [
      userId,
      streakValue,
      streakValue,
      lastPerfectGame,
      isPerfectGame,
      isPerfectGame,
      isPerfectGame,
    ],
  });
}

/**
 * Updates genre-specific statistics
 */
async function updateGenreStats(
  userId: string,
  genreId: string,
  isPerfectGame: boolean,
  score: number
): Promise<void> {
  const sql = `
    INSERT INTO user_genre_stats (user_id, genre_id, perfect_games, total_games, best_score)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, genre_id) DO UPDATE SET
      perfect_games = perfect_games + CASE WHEN ? THEN 1 ELSE 0 END,
      total_games = total_games + 1,
      best_score = MAX(best_score, ?),
      last_played = datetime('now')
  `;

  await turso.execute({
    sql,
    args: [userId, genreId, isPerfectGame ? 1 : 0, 1, score, isPerfectGame, score],
  });
}

/**
 * Updates time-based activity tracking
 */
async function updateTimeBasedActivities(userId: string): Promise<void> {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  const today = now.toISOString().split("T")[0];

  // Check for time-based activities
  const activities: string[] = [];

  if (hour >= 23 || hour < 5) {
    activities.push("night_owl");
  }

  if (hour >= 5 && hour < 9) {
    activities.push("early_bird");
  }

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    // Weekend
    activities.push("weekend_warrior");
  }

  // Insert activities
  for (const activity of activities) {
    const sql = `
      INSERT OR IGNORE INTO user_time_activities (user_id, activity_type, activity_date)
      VALUES (?, ?, ?)
    `;

    await turso.execute({
      sql,
      args: [userId, activity, today],
    });
  }
}

/**
 * Updates difficulty-based statistics
 */
async function updateDifficultyStats(
  userId: string,
  difficulty: string,
  isPerfectGame: boolean,
  noJokersUsed: boolean
): Promise<void> {
  const sql = `
    INSERT INTO user_difficulty_stats (user_id, difficulty, perfect_games, total_games, no_joker_perfect_games)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, difficulty) DO UPDATE SET
      perfect_games = perfect_games + CASE WHEN ? THEN 1 ELSE 0 END,
      total_games = total_games + 1,
      no_joker_perfect_games = no_joker_perfect_games + CASE WHEN ? AND ? THEN 1 ELSE 0 END,
      last_updated = datetime('now')
  `;

  await turso.execute({
    sql,
    args: [
      userId,
      difficulty,
      isPerfectGame ? 1 : 0,
      1,
      isPerfectGame && noJokersUsed ? 1 : 0,
      isPerfectGame,
      isPerfectGame,
      noJokersUsed,
    ],
  });
}

/**
 * Updates joker usage statistics
 */
async function updateJokerStats(
  userId: string,
  jokersUsed: number,
  wonGame: boolean
): Promise<void> {
  const sql = `
    INSERT INTO user_joker_stats (user_id, games_won_with_all_jokers, games_won_without_jokers, total_jokers_used)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      games_won_with_all_jokers = games_won_with_all_jokers + CASE WHEN ? AND ? > 0 THEN 1 ELSE 0 END,
      games_won_without_jokers = games_won_without_jokers + CASE WHEN ? AND ? = 0 THEN 1 ELSE 0 END,
      total_jokers_used = total_jokers_used + ?,
      last_updated = datetime('now')
  `;

  await turso.execute({
    sql,
    args: [
      userId,
      wonGame && jokersUsed > 0 ? 1 : 0,
      wonGame && jokersUsed === 0 ? 1 : 0,
      jokersUsed,
      wonGame,
      jokersUsed,
      wonGame,
      jokersUsed,
      jokersUsed,
    ],
  });
}

/**
 * Checks and updates achievements after a game
 *
 * @param userId - ID of the user
 * @param gameState - Game status after the game
 * @param isPerfectGame - Whether it was a perfect game
 * @param gameData - Additional game data for enhanced tracking
 * @returns Result of the achievement check
 */
export async function checkAchievementsAfterGame(
  userId: string,
  gameState: GameState,
  isPerfectGame: boolean,
  gameData?: {
    averageAnswerTime: number;
    accuracy: number;
    usedJokers: number;
    difficulty: string;
    category: string;
  }
): Promise<AchievementCheckResult> {
  const unlockedAchievements: Achievement[] = [];
  const updatedAchievements: Achievement[] = [];

  // Update enhanced achievement statistics if data is provided
  if (gameData) {
    await updateEnhancedAchievementStats(userId, gameState, gameData);
  }

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
        WHEN game_mode = 'time-pressure' THEN 10
        ELSE 0
      END
    )
  `;

  const perfectGamesResult = await turso.execute({
    sql: perfectGamesSql,
    args: [userId],
  });

  const perfectGamesCount =
    Number(perfectGamesResult.rows?.[0]?.perfect_games_count || 0) + (isPerfectGame ? 1 : 0);

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

    const currentProgress = row.currentProgress ? Number(row.currentProgress) : 0;
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
      case "accuracy_streak":
        newProgress = await getAccuracyStreakProgress(userId, achievement.conditionValue);
        break;
      case "speed_master":
        newProgress = await getSpeedMasterProgress(userId, achievement.code);
        break;
      case "perfect_streak":
        newProgress = await getPerfectStreakProgress(userId);
        break;
      case "time_based":
        newProgress = await getTimeBasedProgress(userId, achievement.code);
        break;
      case "difficulty_master":
        newProgress = await getDifficultyMasterProgress(userId, achievement.code);
        break;
      case "joker_master":
        newProgress = await getJokerMasterProgress(userId, achievement.code);
        break;
      case "combo_achievement":
        newProgress = await getComboAchievementProgress(userId, achievement.code, gameData);
        break;
    }

    // If progress has changed, update
    if (newProgress !== currentProgress) {
      const userAchievement = await updateAchievementProgress(userId, achievement.id, newProgress);

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

/**
 * Gets accuracy streak progress for achievements like "Sharpshooter"
 */
async function getAccuracyStreakProgress(userId: string, targetAccuracy: number): Promise<number> {
  const sql = `SELECT current_accuracy_streak FROM user_accuracy_stats WHERE user_id = ?`;
  const result = await turso.execute({ sql, args: [userId] });
  return result.rows?.[0]?.current_accuracy_streak
    ? Number(result.rows[0].current_accuracy_streak)
    : 0;
}

/**
 * Gets speed master progress for achievements like "Lightning Fast" and "Speed Demon"
 */
async function getSpeedMasterProgress(userId: string, achievementCode: string): Promise<number> {
  if (achievementCode === "lightning_fast") {
    // Check if user answered all questions under 5 seconds in current game
    const sql = `SELECT total_quick_answers FROM user_speed_stats WHERE user_id = ?`;
    const result = await turso.execute({ sql, args: [userId] });
    return result.rows?.[0]?.total_quick_answers ? Number(result.rows[0].total_quick_answers) : 0;
  } else if (achievementCode === "speed_demon") {
    // Check average answer time over 20 games
    const sql = `SELECT average_answer_time, speed_games_count FROM user_speed_stats WHERE user_id = ?`;
    const result = await turso.execute({ sql, args: [userId] });
    const avgTime = result.rows?.[0]?.average_answer_time
      ? Number(result.rows[0].average_answer_time)
      : 0;
    const gamesCount = result.rows?.[0]?.speed_games_count
      ? Number(result.rows[0].speed_games_count)
      : 0;
    return avgTime <= 3 && gamesCount >= 20 ? 1 : 0;
  }
  return 0;
}

/**
 * Gets perfect streak progress
 */
async function getPerfectStreakProgress(userId: string): Promise<number> {
  const sql = `SELECT max_perfect_streak FROM user_perfect_streaks WHERE user_id = ?`;
  const result = await turso.execute({ sql, args: [userId] });
  return result.rows?.[0]?.max_perfect_streak ? Number(result.rows[0].max_perfect_streak) : 0;
}

/**
 * Gets time-based achievement progress
 */
async function getTimeBasedProgress(userId: string, achievementCode: string): Promise<number> {
  if (achievementCode === "weekend_warrior") {
    // Check if user played on both Saturday and Sunday this week
    const sql = `
      SELECT COUNT(DISTINCT strftime('%w', activity_date)) as weekend_days
      FROM user_time_activities 
      WHERE user_id = ? 
        AND activity_type = 'weekend_warrior'
        AND activity_date >= date('now', 'weekday 0', '-6 days')
        AND strftime('%w', activity_date) IN ('0', '6')
    `;
    const result = await turso.execute({ sql, args: [userId] });
    const weekendDays = result.rows?.[0]?.weekend_days ? Number(result.rows[0].weekend_days) : 0;
    return weekendDays >= 2 ? 1 : 0;
  } else {
    // For night_owl and early_bird, check if activity exists today
    const sql = `
      SELECT COUNT(*) as count 
      FROM user_time_activities 
      WHERE user_id = ? AND activity_type = ? AND activity_date = date('now')
    `;
    const result = await turso.execute({ sql, args: [userId, achievementCode] });
    return result.rows?.[0]?.count ? Number(result.rows[0].count) : 0;
  }
}

/**
 * Gets difficulty master progress
 */
async function getDifficultyMasterProgress(
  userId: string,
  achievementCode: string
): Promise<number> {
  if (achievementCode === "hard_difficulty_master") {
    const sql = `SELECT perfect_games FROM user_difficulty_stats WHERE user_id = ? AND difficulty = 'hard'`;
    const result = await turso.execute({ sql, args: [userId] });
    return result.rows?.[0]?.perfect_games ? Number(result.rows[0].perfect_games) : 0;
  } else if (achievementCode === "precision_player") {
    const sql = `SELECT no_joker_perfect_games FROM user_difficulty_stats WHERE user_id = ? AND difficulty = 'hard'`;
    const result = await turso.execute({ sql, args: [userId] });
    return result.rows?.[0]?.no_joker_perfect_games
      ? Number(result.rows[0].no_joker_perfect_games)
      : 0;
  }
  return 0;
}

/**
 * Gets joker master progress
 */
async function getJokerMasterProgress(userId: string, achievementCode: string): Promise<number> {
  if (achievementCode === "comeback_king") {
    const sql = `SELECT games_won_with_all_jokers FROM user_joker_stats WHERE user_id = ?`;
    const result = await turso.execute({ sql, args: [userId] });
    return result.rows?.[0]?.games_won_with_all_jokers
      ? Number(result.rows[0].games_won_with_all_jokers)
      : 0;
  } else if (achievementCode === "no_joker_master") {
    const sql = `SELECT games_won_without_jokers FROM user_joker_stats WHERE user_id = ?`;
    const result = await turso.execute({ sql, args: [userId] });
    return result.rows?.[0]?.games_won_without_jokers
      ? Number(result.rows[0].games_won_without_jokers)
      : 0;
  }
  return 0;
}

/**
 * Gets combo achievement progress
 */
async function getComboAchievementProgress(
  userId: string,
  achievementCode: string,
  gameData?: any
): Promise<number> {
  if (achievementCode === "perfect_storm" && gameData) {
    // Perfect game + all answers under 5 seconds + hard difficulty
    const isPerfectStorm =
      gameData.isPerfectGame && gameData.averageAnswerTime <= 5 && gameData.difficulty === "hard";
    return isPerfectStorm ? 1 : 0;
  } else if (achievementCode === "triple_threat") {
    // Perfect game in 3 different genres in one day
    const sql = `
      SELECT COUNT(DISTINCT genre_id) as genre_count
      FROM user_genre_stats 
      WHERE user_id = ? 
        AND last_played >= date('now')
        AND perfect_games > 0
    `;
    const result = await turso.execute({ sql, args: [userId] });
    const genreCount = result.rows?.[0]?.genre_count ? Number(result.rows[0].genre_count) : 0;
    return genreCount >= 3 ? 1 : 0;
  }
  return 0;
}
