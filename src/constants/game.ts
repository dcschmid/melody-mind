/**
 * Central game-related constants (scoring, difficulty, joker allocations).
 * Keep this file dependency-free (pure constants + derived readonly objects)
 * so it can be imported universally (client, server, build scripts).
 */

/** Base points awarded for each correct answer */
export const BASE_POINTS_PER_QUESTION = 50 as const;

/** Speed bonus thresholds (in seconds) */
export const SPEED_BONUS_THRESHOLDS = Object.freeze({
  high: 10, // <= 10s => +50
  medium: 15, // <= 15s => +25
});

/** Speed bonus values mapped to threshold labels */
export const SPEED_BONUS_VALUES = Object.freeze({
  high: 50,
  medium: 25,
  none: 0,
});

/** Difficulty levels supported by the game */
export const DIFFICULTY_LEVELS = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTY_LEVELS)[number];

/** Number of questions per difficulty */
export const QUESTIONS_PER_DIFFICULTY: Record<Difficulty, number> = Object.freeze({
  easy: 10,
  medium: 15,
  hard: 20,
});

/** Maximum theoretical score per difficulty (base scoring only) */
export const MAX_BASE_SCORE: Record<Difficulty, number> = Object.freeze({
  easy: QUESTIONS_PER_DIFFICULTY.easy * BASE_POINTS_PER_QUESTION,
  medium: QUESTIONS_PER_DIFFICULTY.medium * BASE_POINTS_PER_QUESTION,
  hard: QUESTIONS_PER_DIFFICULTY.hard * BASE_POINTS_PER_QUESTION,
});

/** Joker allocations per difficulty */
export const JOKERS_PER_DIFFICULTY: Record<Difficulty, number> = Object.freeze({
  easy: 3,
  medium: 5,
  hard: 10,
});

/** Derived maximum possible score including highest speed bonus (theoretical upper bound) */
export const MAX_THEORETICAL_SCORE: Record<Difficulty, number> = Object.freeze({
  easy: MAX_BASE_SCORE.easy + QUESTIONS_PER_DIFFICULTY.easy * SPEED_BONUS_VALUES.high,
  medium:
    MAX_BASE_SCORE.medium + QUESTIONS_PER_DIFFICULTY.medium * SPEED_BONUS_VALUES.high,
  hard: MAX_BASE_SCORE.hard + QUESTIONS_PER_DIFFICULTY.hard * SPEED_BONUS_VALUES.high,
});

/** Achievement keys mapped to difficulty for perfect scores */
export const PERFECT_SCORE_ACHIEVEMENTS: Record<Difficulty, string> = Object.freeze({
  easy: "achievement.music-novice",
  medium: "achievement.music-master",
  hard: "achievement.music-legend",
});

/** Utility: compute speed bonus given elapsed seconds */
export function computeSpeedBonus(elapsedSeconds: number): number {
  if (elapsedSeconds <= SPEED_BONUS_THRESHOLDS.high) {
    return SPEED_BONUS_VALUES.high;
  }
  if (elapsedSeconds <= SPEED_BONUS_THRESHOLDS.medium) {
    return SPEED_BONUS_VALUES.medium;
  }
  return SPEED_BONUS_VALUES.none;
}

/** Utility: compute total score contribution for a single correct answer */
export function computeQuestionScore(elapsedSeconds: number): number {
  return BASE_POINTS_PER_QUESTION + computeSpeedBonus(elapsedSeconds);
}

/** Type guard for difficulty */
export function isDifficulty(value: string): value is Difficulty {
  return (DIFFICULTY_LEVELS as readonly string[]).includes(value);
}

/** Get joker allocation for difficulty (defensive) */
export function getJokerAllocation(difficulty: string): number | undefined {
  return isDifficulty(difficulty) ? JOKERS_PER_DIFFICULTY[difficulty] : undefined;
}

/** Get max base score for difficulty (defensive) */
export function getMaxBaseScore(difficulty: string): number | undefined {
  return isDifficulty(difficulty) ? MAX_BASE_SCORE[difficulty] : undefined;
}

/** Get max theoretical score for difficulty (defensive) */
export function getMaxTheoreticalScore(difficulty: string): number | undefined {
  return isDifficulty(difficulty) ? MAX_THEORETICAL_SCORE[difficulty] : undefined;
}
