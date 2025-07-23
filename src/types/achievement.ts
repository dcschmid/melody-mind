/**
 * Achievement System Type Definitions
 *
 * This file contains all type definitions for the achievement system.
 */

/**
 * Achievement Category
 */
export interface AchievementCategory {
  /** Unique ID of the category */
  id: string;
  /** Category code (bronze, silver, gold, platinum, diamond) */
  code: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  /** Point value of the category */
  points: number;
  /** Path to the category icon */
  iconPath: string;
  /** Sort order of the category */
  sortOrder: number;
}

/**
 * Achievement Condition Type
 */
export type AchievementConditionType =
  | "games_played"
  | "perfect_games"
  | "total_score"
  | "daily_streak"
  | "daily_games"
  | "genre_explorer"
  | "game_series"
  | "quick_answer"
  | "seasonal_event"
  | "accuracy_streak"
  | "speed_master"
  | "perfect_streak"
  | "time_based"
  | "difficulty_master"
  | "joker_master"
  | "combo_achievement";

/**
 * Achievement
 */
export interface Achievement {
  /** Unique ID of the achievement */
  id: string;
  /** Code of the achievement */
  code: string;
  /** ID of the achievement category */
  categoryId: string;
  /** Type of condition for the achievement */
  conditionType: AchievementConditionType;
  /** Value of the condition for the achievement */
  conditionValue: number;
  /** Percentage of players who have unlocked the achievement */
  rarityPercentage: number;
  /** Path to the achievement icon */
  iconPath?: string;
  /** Category of the achievement (added when retrieved from the database) */
  category?: AchievementCategory;
  /** Translations of the achievement (added when retrieved from the database) */
  translations?: AchievementTranslation[];
  /** Current progress of the user (added when retrieved from the database) */
  userProgress?: UserAchievement;
}

/**
 * Achievement Translation
 */
export interface AchievementTranslation {
  /** ID of the achievement */
  achievementId: string;
  /** Language code */
  language: string;
  /** Name of the achievement in the specified language */
  name: string;
  /** Description of the achievement in the specified language */
  description: string;
}

/**
 * User Achievement
 */
export interface UserAchievement {
  /** ID of the user */
  userId: string;
  /** ID of the achievement */
  achievementId: string;
  /** Current progress of the user */
  currentProgress: number;
  /** Time of unlocking (null if not unlocked) */
  unlockedAt: string | null;
}

/**
 * Achievement with localized information
 */
export interface LocalizedAchievement extends Achievement {
  /** Name of the achievement in the requested language */
  name: string;
  /** Description of the achievement in the requested language */
  description: string;
  /** Progress percentage (0-100) */
  progressPercentage: number;
  /** Status of the achievement (locked, in-progress, unlocked) */
  status: "locked" | "in-progress" | "unlocked";
}

/**
 * Achievement Event
 */
export interface AchievementEvent {
  /** Type of the event */
  type: "achievement_unlocked";
  /** Affected achievement */
  achievement: LocalizedAchievement;
  /** Timestamp of the event */
  timestamp: string;
}

/**
 * Achievement Check Result
 */
export interface AchievementCheckResult {
  /** Newly unlocked achievements */
  unlockedAchievements: Achievement[];
  /** Updated achievements (progress) */
  updatedAchievements: Achievement[];
}
