/**
 * @fileoverview Achievement categorization utilities for organizing and sorting achievements
 * @module utils/achievements/categorization
 * @version 2.1.0
 * @since 1.0.0
 *
 * @description
 * Provides high-performance functions for organizing and sorting achievements by category.
 * These utilities are essential for the achievements page display and filtering functionality
 * in the MelodyMind application.
 *
 * @performance
 * - Single-pass categorization using reduce() for O(n) complexity
 * - Memory-efficient object creation and reuse
 * - Minimal property access for faster execution
 * - Suitable for memoization due to pure function design
 *
 * @example
 * ```typescript
 * import { processAchievements, calculateAchievementStats } from './categorization';
 *
 * const achievements = await getUserAchievements(userId, language);
 * const sortedCategories = processAchievements(achievements);
 * const stats = calculateAchievementStats(achievements);
 * ```
 *
 * @see {@link /docs/utils/achievement-categorization.md} - Comprehensive documentation
 * @see {@link /docs/pages/AchievementsPage.md} - Main usage in achievements page
 *
 * @author MelodyMind Development Team
 * @copyright 2025 MelodyMind
 * @license MIT
 */

import type { LocalizedAchievement } from "../../types/achievement.ts";

/**
 * Groups achievements by category ID with performance optimization
 *
 * @description
 * Efficiently categorizes achievements using a single-pass reduce operation.
 * Uses minimal object creation and property access for optimal performance.
 *
 * @param {LocalizedAchievement[]} achievements - Array of localized achievements to categorize
 * @returns {Record<string, LocalizedAchievement[]>} Record mapping category IDs to arrays of achievements
 *
 * @example
 * ```typescript
 * const achievements = [
 *   { id: '1', categoryId: 'bronze', name: 'First Steps' },
 * ];
 * const categorized = categorizeAchievements(achievements);
 * // Result: { 'bronze': [achievement1], 'silver': [achievement2] }
 * ```
 *
 * @performance O(n) time complexity, O(k) space complexity where k is number of categories
 * @since 1.0.0
 */
export function categorizeAchievements(
  achievements: LocalizedAchievement[]
): Record<string, LocalizedAchievement[]> {
  return achievements.reduce<Record<string, LocalizedAchievement[]>>((acc, achievement) => {
    const categoryId = achievement.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(achievement);
    return acc;
  }, {});
}

/**
 * Sorts categorized achievements by category sort order
 *
 * @description
 * Takes a record of categorized achievements and sorts them by their category's sortOrder property.
 * Maintains stable sort for deterministic results across different environments.
 *
 * @param {Record<string, LocalizedAchievement[]>} achievementsByCategory - Record of categorized achievements
 * @returns {[string, LocalizedAchievement[]][]} Array of [categoryId, achievements] entries sorted by sort order
 *
 * @example
 * ```typescript
 * const categorized = {
 *   'gold': [achievements with sortOrder 3],
 *   'bronze': [achievements with sortOrder 1],
 *   'silver': [achievements with sortOrder 2]
 * };
 * const sorted = sortAchievementCategories(categorized);
 * // Result: [['bronze', [...]], ['silver', [...]], ['gold', [...]]]
 * ```
 *
 * @performance O(k log k) time complexity where k is number of categories
 * @since 1.0.0
 */
export function sortAchievementCategories(
  achievementsByCategory: Record<string, LocalizedAchievement[]>
): [string, LocalizedAchievement[]][] {
  return Object.entries(achievementsByCategory).sort(([, achievementsA], [, achievementsB]) => {
    const sortOrderA = (achievementsA[0]?.category?.sortOrder as number) || 0;
    const sortOrderB = (achievementsB[0]?.category?.sortOrder as number) || 0;
    return sortOrderA - sortOrderB;
  });
}

/**
 * Complete achievement processing pipeline - categorizes and sorts achievements
 *
 * @description
 * Combines categorization and sorting into a single pipeline function.
 * Provides a complete processing solution for achievement display.
 *
 * @param {LocalizedAchievement[]} achievements - Array of localized achievements
 * @returns {[string, LocalizedAchievement[]][]} Sorted array of [categoryId, achievements] entries
 *
 * @example
 * ```typescript
 * const achievements = await getUserAchievements(userId, language);
 * const processed = processAchievements(achievements);
 *
 * // Ready for rendering:
 * processed.forEach(([categoryId, categoryAchievements]) => {
 *   console.log(`Category: ${categoryId}, Count: ${categoryAchievements.length}`);
 * });
 * ```
 *
 * @performance O(n + k log k) overall complexity
 * @since 1.5.0
 */
export function processAchievements(
  achievements: LocalizedAchievement[]
): [string, LocalizedAchievement[]][] {
  const categorized = categorizeAchievements(achievements);
  return sortAchievementCategories(categorized);
}

/**
 * Calculate achievement statistics for summary display
 *
 * @description
 * Analyzes an array of achievements to calculate summary statistics including
 * total count, unlocked count, and progress percentage.
 *
 * @param {LocalizedAchievement[]} achievements - Array of achievements to analyze
 * @returns {{total: number, unlocked: number, progress: number}} Statistics object with total, unlocked count, and progress percentage
 *
 * @example
 * ```typescript
 * const achievements = [
 *   { status: 'unlocked' },
 *   { status: 'unlocked' },
 *   { status: 'locked' },
 *   { status: 'in-progress' }
 * ];
 * const stats = calculateAchievementStats(achievements);
 * // Result: { total: 4, unlocked: 2, progress: 50 }
 * ```
 *
 * @performance O(n) time complexity, O(1) space complexity
 * @since 2.1.0
 */
export function calculateAchievementStats(achievements: LocalizedAchievement[]): {
  total: number;
  unlocked: number;
  progress: number;
} {
  const total = achievements.length;
  const unlocked = achievements.filter((achievement) => achievement.status === "unlocked").length;
  const progress = total > 0 ? Math.round((unlocked / total) * 100) : 0;

  return {
    total,
    unlocked,
    progress,
  };
}
