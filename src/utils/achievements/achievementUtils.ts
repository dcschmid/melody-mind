/**
 * Achievement Utilities
 *
 * This module provides core utility functions for the achievement system,
 * including score-based achievement level calculation and validation functions.
 *
 * @module AchievementUtils
 * @since 3.2.0
 */

/**
 * Achievement thresholds for different score levels
 * These thresholds determine the achievement level based on player performance
 *
 * @constant {Object} ACHIEVEMENT_THRESHOLDS
 * @since 3.2.0
 */
export const ACHIEVEMENT_THRESHOLDS = {
  /** Genius level: 800+ points (highest achievement) */
  GENIUS: 800,
  /** Pro level: 600-799 points (expert level) */
  PRO: 600,
  /** Enthusiast level: 400-599 points (advanced level) */
  ENTHUSIAST: 400,
  /** Lover level: 200-399 points (intermediate level) */
  LOVER: 200,
  /** Explorer level: 0-199 points (beginner level) */
  EXPLORER: 0,
} as const;

/**
 * Type definition for achievement levels
 * @since 3.2.0
 */
export type AchievementLevel = "genius" | "pro" | "enthusiast" | "lover" | "explorer";

/**
 * Get the achievement level based on player score
 *
 * This function categorizes player performance into different achievement levels
 * based on predefined score thresholds. Higher scores result in higher achievement levels.
 *
 * @param {number} score - The player's score (must be non-negative)
 * @returns {AchievementLevel} The achievement level key corresponding to the score
 *
 * @throws {Error} If score is negative or not a valid number
 *
 * @example
 * ```typescript
 * const level = getAchievementLevel(850);  // Returns "genius"
 * const level = getAchievementLevel(650);  // Returns "pro"
 * const level = getAchievementLevel(450);  // Returns "enthusiast"
 * const level = getAchievementLevel(250);  // Returns "lover"
 * const level = getAchievementLevel(100);  // Returns "explorer"
 * ```
 *
 * @since 3.2.0
 * @accessibility This function supports the achievement announcement system for screen readers
 */
export function getAchievementLevel(score: number): AchievementLevel {
  // Input validation
  if (typeof score !== "number" || isNaN(score)) {
    throw new Error(`Invalid score: expected a number, got ${typeof score}`);
  }

  if (score < 0) {
    throw new Error(`Score must be non-negative, got ${score}`);
  }

  // Determine achievement level based on score thresholds
  if (score >= ACHIEVEMENT_THRESHOLDS.GENIUS) {
    return "genius";
  }
  if (score >= ACHIEVEMENT_THRESHOLDS.PRO) {
    return "pro";
  }
  if (score >= ACHIEVEMENT_THRESHOLDS.ENTHUSIAST) {
    return "enthusiast";
  }
  if (score >= ACHIEVEMENT_THRESHOLDS.LOVER) {
    return "lover";
  }
  return "explorer";
}

/**
 * Get the minimum score required for a specific achievement level
 *
 * @param {AchievementLevel} level - The achievement level
 * @returns {number} The minimum score required for this level
 *
 * @example
 * ```typescript
 * const minScore = getMinScoreForLevel("pro");  // Returns 600
 * ```
 *
 * @since 3.2.0
 */
export function getMinScoreForLevel(level: AchievementLevel): number {
  switch (level) {
    case "genius":
      return ACHIEVEMENT_THRESHOLDS.GENIUS;
    case "pro":
      return ACHIEVEMENT_THRESHOLDS.PRO;
    case "enthusiast":
      return ACHIEVEMENT_THRESHOLDS.ENTHUSIAST;
    case "lover":
      return ACHIEVEMENT_THRESHOLDS.LOVER;
    case "explorer":
      return ACHIEVEMENT_THRESHOLDS.EXPLORER;
    default:
      throw new Error(`Unknown achievement level: ${level}`);
  }
}

/**
 * Get the next achievement level above the current one
 *
 * @param {AchievementLevel} currentLevel - The current achievement level
 * @returns {AchievementLevel | null} The next level, or null if already at the highest level
 *
 * @example
 * ```typescript
 * const nextLevel = getNextAchievementLevel("pro");  // Returns "genius"
 * const nextLevel = getNextAchievementLevel("genius");  // Returns null
 * ```
 *
 * @since 3.2.0
 */
export function getNextAchievementLevel(currentLevel: AchievementLevel): AchievementLevel | null {
  switch (currentLevel) {
    case "explorer":
      return "lover";
    case "lover":
      return "enthusiast";
    case "enthusiast":
      return "pro";
    case "pro":
      return "genius";
    case "genius":
      return null; // Already at the highest level
    default:
      throw new Error(`Unknown achievement level: ${currentLevel}`);
  }
}

/**
 * Calculate the score needed to reach the next achievement level
 *
 * @param {number} currentScore - The player's current score
 * @returns {number | null} Points needed for next level, or null if already at max level
 *
 * @example
 * ```typescript
 * const pointsNeeded = getPointsToNextLevel(550);  // Returns 50 (600 - 550)
 * const pointsNeeded = getPointsToNextLevel(850);  // Returns null (already at genius)
 * ```
 *
 * @since 3.2.0
 */
export function getPointsToNextLevel(currentScore: number): number | null {
  const currentLevel = getAchievementLevel(currentScore);
  const nextLevel = getNextAchievementLevel(currentLevel);

  if (!nextLevel) {
    return null; // Already at the highest level
  }

  const nextLevelMinScore = getMinScoreForLevel(nextLevel);
  return Math.max(0, nextLevelMinScore - currentScore);
}

/**
 * Check if a score qualifies for a specific achievement level
 *
 * @param {number} score - The score to check
 * @param {AchievementLevel} level - The target achievement level
 * @returns {boolean} True if the score qualifies for the level
 *
 * @example
 * ```typescript
 * const qualifies = qualifiesForLevel(650, "pro");  // Returns true
 * const qualifies = qualifiesForLevel(550, "pro");  // Returns false
 * ```
 *
 * @since 3.2.0
 */
export function qualifiesForLevel(score: number, level: AchievementLevel): boolean {
  const minScore = getMinScoreForLevel(level);
  return score >= minScore;
}

/**
 * Get all achievement levels ordered from lowest to highest
 *
 * @returns {AchievementLevel[]} Array of achievement levels in ascending order
 *
 * @example
 * ```typescript
 * const levels = getAllAchievementLevels();
 * // Returns ["explorer", "lover", "enthusiast", "pro", "genius"]
 * ```
 *
 * @since 3.2.0
 */
export function getAllAchievementLevels(): AchievementLevel[] {
  return ["explorer", "lover", "enthusiast", "pro", "genius"];
}

/**
 * Get achievement level progress as a percentage
 *
 * @param {number} score - The current score
 * @param {AchievementLevel} targetLevel - The target achievement level (optional)
 * @returns {number} Progress percentage (0-100)
 *
 * @example
 * ```typescript
 * const progress = getAchievementProgress(650, "genius");  // Returns ~81.25 (650/800)
 * ```
 *
 * @since 3.2.0
 */
export function getAchievementProgress(
  score: number,
  targetLevel: AchievementLevel = "genius"
): number {
  const maxScore = getMinScoreForLevel(targetLevel);
  if (maxScore === 0) {
    return 100;
  }

  const progress = Math.min(100, (score / maxScore) * 100);
  return Math.round(progress * 100) / 100; // Round to 2 decimal places
}
