/**
 * Time Pressure Achievement Service
 * 
 * This service handles achievements specific to the time pressure game mode.
 * It extends the base achievement system with time pressure specific logic.
 */

import { turso } from "../turso.ts";
import type { Achievement, AchievementCheckResult } from "../types/achievement.ts";

/**
 * Interface for time pressure game statistics
 */
export interface TimePressureStats {
  score: number;
  accuracy: number;
  gameTime: number;
  correctAnswers: number;
  totalQuestions: number;
  averageAnswerTime: number;
  streak: number;
  category: string;
  difficultyStats: {
    easy: number;
    medium: number;
    hard: number;
  };
}

/**
 * Time pressure specific achievement types
 */
export const TIME_PRESSURE_ACHIEVEMENTS = {
  // Speed achievements
  SPEED_DEMON: 'time_pressure_speed_demon',
  LIGHTNING_FAST: 'time_pressure_lightning_fast',
  QUICK_DRAW: 'time_pressure_quick_draw',
  
  // Accuracy under pressure
  PRESSURE_COOKER: 'time_pressure_accuracy',
  STEADY_HANDS: 'time_pressure_steady_hands',
  COOL_UNDER_PRESSURE: 'time_pressure_cool',
  
  // Streaks
  STREAK_MASTER: 'time_pressure_streak',
  UNSTOPPABLE: 'time_pressure_unstoppable',
  
  // Score achievements
  HIGH_PRESSURE: 'time_pressure_high_score',
  PRESSURE_ELITE: 'time_pressure_elite',
  
  // Difficulty mastery
  MIXED_MASTER: 'time_pressure_mixed_difficulty',
  ADAPTABLE: 'time_pressure_adaptable',
  
  // Consistency
  CONSISTENT_PRESSURE: 'time_pressure_consistent',
  DAILY_PRESSURE: 'time_pressure_daily',
  
  // Special achievements
  FIRST_ATTEMPT: 'time_pressure_first_try',
  CATEGORY_DOMINATION: 'time_pressure_category_master',
} as const;

/**
 * Check and unlock time pressure specific achievements
 */
export async function checkTimePressureAchievements(
  userId: string,
  stats: TimePressureStats
): Promise<AchievementCheckResult> {
  const unlockedAchievements: Achievement[] = [];
  const updatedAchievements: Achievement[] = [];

  try {
    // Get user's time pressure game count
    const gameCountResult = await turso.execute({
      sql: `SELECT COUNT(*) as count FROM game_results 
            WHERE user_id = ? AND game_mode = 'time-pressure'`,
      args: [userId]
    });
    
    const gameCount = Number(gameCountResult.rows[0].count) || 0;
    const isFirstGame = gameCount === 1;

    // Check speed achievements
    await checkSpeedAchievements(userId, stats, unlockedAchievements, updatedAchievements);
    
    // Check accuracy achievements
    await checkAccuracyAchievements(userId, stats, unlockedAchievements, updatedAchievements);
    
    // Check streak achievements
    await checkStreakAchievements(userId, stats, unlockedAchievements, updatedAchievements);
    
    // Check score achievements
    await checkScoreAchievements(userId, stats, unlockedAchievements, updatedAchievements);
    
    // Check special achievements
    if (isFirstGame) {
      await checkFirstGameAchievements(userId, stats, unlockedAchievements, updatedAchievements);
    }
    
    // Check consistency achievements
    await checkConsistencyAchievements(userId, stats, unlockedAchievements, updatedAchievements);

    // Update time pressure statistics
    await updateTimePressureStats(userId, stats);

    return {
      unlockedAchievements,
      updatedAchievements,
      hasNewAchievements: unlockedAchievements.length > 0
    };

  } catch (error) {
    console.error('Error checking time pressure achievements:', error);
    return {
      unlockedAchievements: [],
      updatedAchievements: [],
      hasNewAchievements: false
    };
  }
}

/**
 * Check speed-based achievements
 */
async function checkSpeedAchievements(
  userId: string,
  stats: TimePressureStats,
  unlocked: Achievement[],
  updated: Achievement[]
): Promise<void> {
  // Speed Demon: Average answer time < 3 seconds with 80%+ accuracy
  if (stats.averageAnswerTime < 3.0 && stats.accuracy >= 80) {
    await tryUnlockAchievement(userId, TIME_PRESSURE_ACHIEVEMENTS.SPEED_DEMON, unlocked);
  }
  
  // Lightning Fast: Average answer time < 2 seconds with 70%+ accuracy
  if (stats.averageAnswerTime < 2.0 && stats.accuracy >= 70) {
    await tryUnlockAchievement(userId, TIME_PRESSURE_ACHIEVEMENTS.LIGHTNING_FAST, unlocked);
  }
  
  // Quick Draw: Answer first 5 questions in under 2 seconds each
  // This would require more detailed tracking - for now, check average time
  if (stats.averageAnswerTime < 2.5 && stats.totalQuestions >= 5) {
    await tryUnlockAchievement(userId, TIME_PRESSURE_ACHIEVEMENTS.QUICK_DRAW, unlocked);
  }
}

/**
 * Check accuracy-based achievements
 */
async function checkAccuracyAchievements(
  userId: string,
  stats: TimePressureStats,
  unlocked: Achievement[],
  updated: Achievement[]
): Promise<void> {
  // Pressure Cooker: 90%+ accuracy in time pressure mode
  if (stats.accuracy >= 90) {
    await tryUnlockAchievement(userId, TIME_PRESSURE_ACHIEVEMENTS.PRESSURE_COOKER, unlocked);
  }
  
  // Steady Hands: 95%+ accuracy in time pressure mode
  if (stats.accuracy >= 95) {
    await tryUnlockAchievement(userId, TIME_PRESSURE_ACHIEVEMENTS.STEADY_HANDS, unlocked);
  }
  
  // Cool Under Pressure: Perfect accuracy (100%) in time pressure mode
  if (stats.accuracy === 100 && stats.totalQuestions >= 10) {
    await tryUnlockAchievement(userId, TIME_PRESSURE_ACHIEVEMENTS.COOL_UNDER_PRESSURE, unlocked);
  }
}

/**
 * Check streak-based achievements
 */
async function checkStreakAchievements(
  userId: string,
  stats: TimePressureStats,
  unlocked: Achievement[],
  updated: Achievement[]
): Promise<void> {
  // Streak Master: 10+ correct answers in a row
  if (stats.streak >= 10) {
    await tryUnlockAchievement(userId, TIME_PRESSURE_ACHIEVEMENTS.STREAK_MASTER, unlocked);
  }
  
  // Unstoppable: 15+ correct answers in a row
  if (stats.streak >= 15) {
    await tryUnlockAchievement(userId, TIME_PRESSURE_ACHIEVEMENTS.UNSTOPPABLE, unlocked);
  }
}

/**
 * Check score-based achievements
 */
async function checkScoreAchievements(
  userId: string,
  stats: TimePressureStats,
  unlocked: Achievement[],
  updated: Achievement[]
): Promise<void> {
  // High Pressure: Score 1500+ points in time pressure mode
  if (stats.score >= 1500) {
    await tryUnlockAchievement(userId, TIME_PRESSURE_ACHIEVEMENTS.HIGH_PRESSURE, unlocked);
  }
  
  // Pressure Elite: Score 2000+ points in time pressure mode
  if (stats.score >= 2000) {
    await tryUnlockAchievement(userId, TIME_PRESSURE_ACHIEVEMENTS.PRESSURE_ELITE, unlocked);
  }
}

/**
 * Check first game achievements
 */
async function checkFirstGameAchievements(
  userId: string,
  stats: TimePressureStats,
  unlocked: Achievement[],
  updated: Achievement[]
): Promise<void> {
  // First Attempt: Complete first time pressure game with 70%+ accuracy
  if (stats.accuracy >= 70) {
    await tryUnlockAchievement(userId, TIME_PRESSURE_ACHIEVEMENTS.FIRST_ATTEMPT, unlocked);
  }
}

/**
 * Check consistency achievements
 */
async function checkConsistencyAchievements(
  userId: string,
  stats: TimePressureStats,
  unlocked: Achievement[],
  updated: Achievement[]
): Promise<void> {
  // Check if player has played time pressure mode multiple days
  const dailyPlayResult = await turso.execute({
    sql: `SELECT COUNT(DISTINCT DATE(created_at)) as days 
          FROM game_results 
          WHERE user_id = ? AND game_mode = 'time-pressure'
          AND created_at >= date('now', '-7 days')`,
    args: [userId]
  });
  
  const daysPlayed = Number(dailyPlayResult.rows[0].days) || 0;
  
  // Daily Pressure: Play time pressure mode for 3 consecutive days
  if (daysPlayed >= 3) {
    await tryUnlockAchievement(userId, TIME_PRESSURE_ACHIEVEMENTS.DAILY_PRESSURE, unlocked);
  }
}

/**
 * Try to unlock a specific achievement
 */
async function tryUnlockAchievement(
  userId: string,
  achievementCode: string,
  unlockedList: Achievement[]
): Promise<void> {
  try {
    // Check if achievement already unlocked
    const existingResult = await turso.execute({
      sql: `SELECT id FROM user_achievements 
            WHERE user_id = ? AND achievement_id = (
              SELECT id FROM achievements WHERE code = ?
            )`,
      args: [userId, achievementCode]
    });
    
    if (existingResult.rows.length > 0) {
      return; // Already unlocked
    }
    
    // Get achievement details
    const achievementResult = await turso.execute({
      sql: `SELECT a.*, t.name, t.description 
            FROM achievements a
            LEFT JOIN achievement_translations t ON a.id = t.achievement_id AND t.language = 'en'
            WHERE a.code = ?`,
      args: [achievementCode]
    });
    
    if (achievementResult.rows.length === 0) {
      console.warn(`Achievement not found: ${achievementCode}`);
      return;
    }
    
    const achievement = achievementResult.rows[0];
    
    // Unlock achievement
    await turso.execute({
      sql: `INSERT INTO user_achievements (user_id, achievement_id, unlocked_at, progress)
            VALUES (?, ?, datetime('now'), 100)`,
      args: [userId, achievement.id]
    });
    
    // Add to unlocked list
    unlockedList.push({
      id: Number(achievement.id),
      code: String(achievement.code),
      categoryId: Number(achievement.category_id),
      conditionType: String(achievement.condition_type),
      conditionValue: Number(achievement.condition_value),
      rarityPercentage: Number(achievement.rarity_percentage),
      iconPath: String(achievement.icon_path),
      name: String(achievement.name || achievementCode),
      description: String(achievement.description || 'Time pressure achievement')
    });
    
    console.log(`Time pressure achievement unlocked: ${achievementCode} for user ${userId}`);
    
  } catch (error) {
    console.error(`Error unlocking achievement ${achievementCode}:`, error);
  }
}

/**
 * Update time pressure statistics
 */
async function updateTimePressureStats(userId: string, stats: TimePressureStats): Promise<void> {
  try {
    // Update or insert time pressure specific statistics
    await turso.execute({
      sql: `INSERT OR REPLACE INTO user_mode_stats 
            (user_id, mode, games_played, total_score, best_score, total_correct, total_questions,
             best_accuracy, average_time, best_streak, created_at, updated_at)
            VALUES (
              ?, 'time-pressure',
              COALESCE((SELECT games_played FROM user_mode_stats WHERE user_id = ? AND mode = 'time-pressure'), 0) + 1,
              COALESCE((SELECT total_score FROM user_mode_stats WHERE user_id = ? AND mode = 'time-pressure'), 0) + ?,
              MAX(COALESCE((SELECT best_score FROM user_mode_stats WHERE user_id = ? AND mode = 'time-pressure'), 0), ?),
              COALESCE((SELECT total_correct FROM user_mode_stats WHERE user_id = ? AND mode = 'time-pressure'), 0) + ?,
              COALESCE((SELECT total_questions FROM user_mode_stats WHERE user_id = ? AND mode = 'time-pressure'), 0) + ?,
              MAX(COALESCE((SELECT best_accuracy FROM user_mode_stats WHERE user_id = ? AND mode = 'time-pressure'), 0), ?),
              ?, -- Average answer time (would need more complex calculation for true average)
              MAX(COALESCE((SELECT best_streak FROM user_mode_stats WHERE user_id = ? AND mode = 'time-pressure'), 0), ?),
              COALESCE((SELECT created_at FROM user_mode_stats WHERE user_id = ? AND mode = 'time-pressure'), datetime('now')),
              datetime('now')
            )`,
      args: [
        userId, userId, userId, stats.score, userId, stats.score,
        userId, stats.correctAnswers, userId, stats.totalQuestions,
        userId, stats.accuracy, stats.averageAnswerTime,
        userId, stats.streak, userId
      ]
    });
    
  } catch (error) {
    console.error('Error updating time pressure stats:', error);
  }
}

/**
 * Get user's time pressure statistics
 */
export async function getTimePressureUserStats(userId: string): Promise<any> {
  try {
    const result = await turso.execute({
      sql: `SELECT * FROM user_mode_stats WHERE user_id = ? AND mode = 'time-pressure'`,
      args: [userId]
    });
    
    return result.rows[0] || null;
    
  } catch (error) {
    console.error('Error getting time pressure stats:', error);
    return null;
  }
}

/**
 * Get leaderboard for time pressure mode
 */
export async function getTimePressureLeaderboard(limit: number = 10): Promise<any[]> {
  try {
    const result = await turso.execute({
      sql: `SELECT u.username, s.best_score, s.best_accuracy, s.games_played
            FROM user_mode_stats s
            JOIN users u ON s.user_id = u.id
            WHERE s.mode = 'time-pressure'
            ORDER BY s.best_score DESC
            LIMIT ?`,
      args: [limit]
    });
    
    return result.rows;
    
  } catch (error) {
    console.error('Error getting time pressure leaderboard:', error);
    return [];
  }
}