/**
 * User Streak Service
 *
 * This service manages users' daily activity streaks.
 * It provides functions to update and check streaks.
 */

import { turso } from "../turso.ts";

/**
 * User streak information
 */
export interface UserStreak {
  userId: string;
  currentStreak: number;
  maxStreak: number;
  lastActivityDate: string | null;
}

/**
 * Daily activity information
 */
export interface DailyActivity {
  userId: string;
  date: string;
  activityCount: number;
}

/**
 * Updates a user's daily activity
 *
 * @param userId - ID of the user
 * @returns Promise with the updated daily activity
 */
export async function updateDailyActivity(userId: string): Promise<DailyActivity> {
  // Skip daily activity tracking for guest users
  if (userId === "guest" || userId.startsWith("guest_")) {
    console.log("🎮 User Streak Service: Skipping daily activity for guest user");
    return {
      userId,
      date: new Date().toISOString().split("T")[0],
      activityCount: 1,
    };
  }

  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const now = new Date().toISOString();

  // Check if an entry for today already exists
  const checkSql = `
    SELECT * FROM user_daily_activity
    WHERE user_id = ? AND date = ?
  `;

  const checkResult = await turso.execute({
    sql: checkSql,
    args: [userId, today],
  });

  if (!checkResult.rows || checkResult.rows.length === 0) {
    // Create a new entry
    const insertSql = `
      INSERT INTO user_daily_activity (id, user_id, date, activity_count)
      VALUES (?, ?, ?, ?)
    `;

    const activityId = crypto.randomUUID();
    await turso.execute({
      sql: insertSql,
      args: [activityId, userId, today, 1],
    });

    // Update streak
    await updateUserStreak(userId, today);

    return {
      userId,
      date: today,
      activityCount: 1,
    };
  } else {
    // Update existing entry
    const updateSql = `
      UPDATE user_daily_activity
      SET activity_count = activity_count + 1
      WHERE user_id = ? AND date = ?
    `;

    await turso.execute({
      sql: updateSql,
      args: [userId, today],
    });

    const activityCount = Number(checkResult.rows[0].activity_count) + 1;

    return {
      userId,
      date: today,
      activityCount,
    };
  }
}

/**
 * Updates a user's streak
 *
 * @param userId - ID of the user
 * @param today - Today's date in YYYY-MM-DD format
 * @returns Promise with the updated streak
 */
async function updateUserStreak(userId: string, today: string): Promise<UserStreak> {
  // Retrieve user streak
  const streakSql = `
    SELECT * FROM user_streaks 
    WHERE user_id = ?
  `;

  const streakResult = await turso.execute({
    sql: streakSql,
    args: [userId],
  });

  let currentStreak = 0;
  let maxStreak = 0;
  let lastActivityDate: string | null = null;

  if (streakResult.rows && streakResult.rows.length > 0) {
    currentStreak = Number(streakResult.rows[0].current_streak);
    maxStreak = Number(streakResult.rows[0].max_streak);
    lastActivityDate = streakResult.rows[0].last_activity_date as string | null;
  }

  // Check if the streak should be continued or reset
  if (lastActivityDate) {
    const lastDate = new Date(lastActivityDate);
    const todayDate = new Date(today);

    // Calculate the difference in days
    const diffTime = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Continue streak
      currentStreak += 1;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    } else if (diffDays > 1) {
      // Reset streak
      currentStreak = 1;
    }
    // If diffDays === 0, the user has already played today, streak remains unchanged
  } else {
    // First streak
    currentStreak = 1;
    maxStreak = 1;
  }

  // Update or create streak
  if (streakResult.rows && streakResult.rows.length > 0) {
    const updateStreakSql = `
      UPDATE user_streaks 
      SET current_streak = ?, max_streak = ?, last_activity_date = ?
      WHERE user_id = ?
    `;

    await turso.execute({
      sql: updateStreakSql,
      args: [currentStreak, maxStreak, today, userId],
    });
  } else {
    const insertStreakSql = `
      INSERT INTO user_streaks (user_id, current_streak, max_streak, last_activity_date)
      VALUES (?, ?, ?, ?)
    `;

    await turso.execute({
      sql: insertStreakSql,
      args: [userId, currentStreak, maxStreak, today],
    });
  }

  return {
    userId,
    currentStreak,
    maxStreak,
    lastActivityDate: today,
  };
}

/**
 * Retrieves the current streak of a user
 *
 * @param userId - ID of the user
 * @returns Promise with the current streak
 */
export async function getUserStreak(userId: string): Promise<UserStreak> {
  const sql = `
    SELECT * FROM user_streaks 
    WHERE user_id = ?
  `;

  const result = await turso.execute({
    sql,
    args: [userId],
  });

  if (!result.rows || result.rows.length === 0) {
    return {
      userId,
      currentStreak: 0,
      maxStreak: 0,
      lastActivityDate: null,
    };
  }

  return {
    userId,
    currentStreak: Number(result.rows[0].current_streak),
    maxStreak: Number(result.rows[0].max_streak),
    lastActivityDate: result.rows[0].last_activity_date as string | null,
  };
}

/**
 * Retrieves the daily activity of a user for a specific date
 *
 * @param userId - ID of the user
 * @param date - Date in YYYY-MM-DD format (default: today)
 * @returns Promise with the daily activity
 */
export async function getDailyActivity(
  userId: string,
  date?: string
): Promise<DailyActivity | null> {
  const activityDate = date || new Date().toISOString().split("T")[0];

  const sql = `
    SELECT * FROM user_daily_activity
    WHERE user_id = ? AND date = ?
  `;

  const result = await turso.execute({
    sql,
    args: [userId, activityDate],
  });

  if (!result.rows || result.rows.length === 0) {
    return null;
  }

  return {
    userId,
    date: result.rows[0].date as string,
    activityCount: Number(result.rows[0].activity_count),
  };
}
