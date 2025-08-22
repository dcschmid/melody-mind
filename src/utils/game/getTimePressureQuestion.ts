/**
 * Time Pressure Question Generator for Music Quiz
 *
 * This module provides functionality for selecting random questions from mixed
 * difficulty levels for the time pressure game mode. It ensures balanced
 * distribution of difficulties and tracks question usage.
 *
 * @module getTimePressureQuestion
 */

/**
 * Set to track questions that have already been used during the current game session
 * to prevent duplicates and ensure a varied experience
 */
const usedTimePressureQuestions = new Set<string>();

/**
 * Represents the difficulty levels available in the game
 */
type Difficulty = "easy" | "medium" | "hard";

/**
 * Interface for a question object with required properties
 */
export interface Question {
  /** The question text that will be displayed to the user */
  question: string;
  /** Array of possible answer options */
  options: string[];
  /** The correct answer from the options array */
  correctAnswer: string;
  /** Additional information shown after answering */
  trivia: string;
  /** Any additional properties */
  [key: string]: any;
}

/**
 * Interface for an album object with required properties
 */
export interface Album {
  /** Path to the album cover image */
  coverSrc: string;
  /** Name of the artist */
  artist: string;
  /** Title of the album */
  album: string;
  /** Release year of the album */
  year: string;
  /** Questions categorized by difficulty level */
  questions: {
    [key in Difficulty]: Question[];
  };
  /** Any additional properties */
  [key: string]: any;
}

/**
 * Return type for a time pressure question selection
 */
export interface TimePressureQuestionResult {
  /** The selected random question */
  randomQuestion: Question;
  /** The album associated with the question */
  randomAlbum: Album;
  /** The difficulty level of the selected question */
  difficulty: Difficulty;
  /** Time limit for this question in seconds */
  timeLimit: number;
  /** Base points for correct answer */
  basePoints: number;
}

/**
 * Configuration for time pressure mode
 */
export interface TimePressureConfig {
  /** Distribution weights for each difficulty level */
  difficultyWeights: {
    easy: number;
    medium: number;
    hard: number;
  };
  /** Time limits for each difficulty level in seconds */
  timeLimits: {
    easy: number;
    medium: number;
    hard: number;
  };
  /** Base points for each difficulty level */
  basePoints: {
    easy: number;
    medium: number;
    hard: number;
  };
  /** Total number of rounds in the game */
  totalRounds: number;
  /** Progressive difficulty - increase hard questions over time */
  progressiveDifficulty: boolean;
}

/**
 * Default configuration for time pressure mode
 */
const DEFAULT_CONFIG: TimePressureConfig = {
  difficultyWeights: {
    easy: 40, // 40% of questions
    medium: 40, // 40% of questions
    hard: 20, // 20% of questions
  },
  timeLimits: {
    easy: 20, // 20 seconds for easy questions - comfortable reading time
    medium: 25, // 25 seconds for medium questions - more complex content
    hard: 30, // 30 seconds for hard questions - most complex content
  },
  basePoints: {
    easy: 50, // 50 base points
    medium: 75, // 75 base points
    hard: 100, // 100 base points
  },
  totalRounds: 20,
  progressiveDifficulty: true,
};

/**
 * Tracks difficulty distribution to ensure balanced gameplay
 */
let difficultyTracker = {
  easy: 0,
  medium: 0,
  hard: 0,
  totalQuestions: 0,
};

/**
 * Selects a random question from mixed difficulty levels for time pressure mode
 *
 * This function balances question difficulty based on configured weights and
 * optionally increases difficulty as the game progresses. It prevents question
 * repetition and ensures balanced difficulty distribution.
 *
 * @param {Album[]} albums - Array of album objects containing questions
 * @param {number} currentRound - Current round number (1-based)
 * @param {Partial<TimePressureConfig>} customConfig - Optional custom configuration
 *
 * @returns {TimePressureQuestionResult | null} Object containing the selected question,
 *          album, difficulty, time limit, and base points, or null if no suitable questions
 *
 * @example
 * ```typescript
 * const result = getTimePressureQuestion(albums, 5, { totalRounds: 15 });
 * if (result) {
 *   const { randomQuestion, randomAlbum, difficulty, timeLimit, basePoints } = result;
 *   // Start countdown with timeLimit seconds
 *   // Award basePoints + time bonus on correct answer
 * }
 * ```
 */
export function getTimePressureQuestion(
  albums: Album[],
  currentRound: number,
  customConfig: Partial<TimePressureConfig> = {}
): TimePressureQuestionResult | null {
  // Merge custom config with defaults
  const config: TimePressureConfig = {
    ...DEFAULT_CONFIG,
    ...customConfig,
    difficultyWeights: { ...DEFAULT_CONFIG.difficultyWeights, ...customConfig.difficultyWeights },
    timeLimits: { ...DEFAULT_CONFIG.timeLimits, ...customConfig.timeLimits },
    basePoints: { ...DEFAULT_CONFIG.basePoints, ...customConfig.basePoints },
  };

  // Validate input parameters
  if (!albums || !Array.isArray(albums) || albums.length === 0) {
    console.warn("No albums provided or invalid albums array");
    return null;
  }

  if (currentRound < 1 || currentRound > config.totalRounds) {
    console.warn(
      `Invalid round number: ${currentRound}, should be between 1 and ${config.totalRounds}`
    );
    return null;
  }

  // Reset tracking if starting new game
  if (currentRound === 1) {
    resetTimePressureQuestions();
    difficultyTracker = { easy: 0, medium: 0, hard: 0, totalQuestions: 0 };
  }

  try {
    // Determine target difficulty based on weights and progression
    const targetDifficulty = selectTargetDifficulty(config, currentRound);

    // Create a copy of the albums array to avoid mutation
    const albumsCopy = [...albums];

    // Manual shuffle for randomness
    for (let i = albumsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [albumsCopy[i], albumsCopy[j]] = [albumsCopy[j], albumsCopy[i]];
    }

    // Create a flat list of available questions for target difficulty
    const availableQuestions = albumsCopy.flatMap((album: Album) => {
      const questionsForDifficulty = album.questions[targetDifficulty] || [];

      return questionsForDifficulty
        .filter((question: Question) => !usedTimePressureQuestions.has(question.question))
        .map((question: Question) => ({
          randomQuestion: question,
          randomAlbum: album,
          difficulty: targetDifficulty,
          timeLimit: config.timeLimits[targetDifficulty],
          basePoints: config.basePoints[targetDifficulty],
        }));
    });

    // If no questions available for target difficulty, try other difficulties
    if (availableQuestions.length === 0) {
      console.warn(`No questions available for ${targetDifficulty}, trying fallbacks`);

      const fallbackDifficulties: Difficulty[] = ["easy", "medium", "hard"].filter(
        (d) => d !== targetDifficulty
      ) as Difficulty[];

      for (const fallbackDifficulty of fallbackDifficulties) {
        const fallbackQuestions = albumsCopy.flatMap((album: Album) => {
          const questionsForDifficulty = album.questions[fallbackDifficulty] || [];

          return questionsForDifficulty
            .filter((question: Question) => !usedTimePressureQuestions.has(question.question))
            .map((question: Question) => ({
              randomQuestion: question,
              randomAlbum: album,
              difficulty: fallbackDifficulty,
              timeLimit: config.timeLimits[fallbackDifficulty],
              basePoints: config.basePoints[fallbackDifficulty],
            }));
        });

        if (fallbackQuestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * fallbackQuestions.length);
          const result = fallbackQuestions[randomIndex];

          // Mark question as used and update tracking
          usedTimePressureQuestions.add(result.randomQuestion.question);
          difficultyTracker[result.difficulty]++;
          difficultyTracker.totalQuestions++;

          return result;
        }
      }
    }

    // Select question from available options
    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const result = availableQuestions[randomIndex];

      // Mark question as used and update tracking
      usedTimePressureQuestions.add(result.randomQuestion.question);
      difficultyTracker[result.difficulty]++;
      difficultyTracker.totalQuestions++;

      return result;
    }

    // If all questions exhausted, reset and try again
    if (usedTimePressureQuestions.size > 0) {
      console.warn("All questions used, resetting for continued play");
      usedTimePressureQuestions.clear();
      return getTimePressureQuestion(albums, currentRound, customConfig);
    }

    console.warn("No questions available for time pressure mode");
    return null;
  } catch (error) {
    console.error("Error selecting time pressure question:", error);
    return null;
  }
}

/**
 * Selects target difficulty based on weights and progressive difficulty
 */
function selectTargetDifficulty(config: TimePressureConfig, currentRound: number): Difficulty {
  const weights = { ...config.difficultyWeights };

  // Apply progressive difficulty if enabled
  if (config.progressiveDifficulty) {
    const progressRatio = currentRound / config.totalRounds;

    // Increase hard questions and decrease easy questions as game progresses
    if (progressRatio > 0.66) {
      // Final third: more hard questions
      weights.hard += 20;
      weights.easy -= 15;
      weights.medium -= 5;
    } else if (progressRatio > 0.33) {
      // Middle third: balanced with slight increase in medium/hard
      weights.hard += 10;
      weights.medium += 5;
      weights.easy -= 15;
    }
    // First third: use default weights
  }

  // Ensure weights are non-negative
  weights.easy = Math.max(0, weights.easy);
  weights.medium = Math.max(0, weights.medium);
  weights.hard = Math.max(0, weights.hard);

  // Adjust for current distribution to maintain balance
  const totalTracked = difficultyTracker.totalQuestions;
  if (totalTracked > 0) {
    const easyRatio = difficultyTracker.easy / totalTracked;
    const mediumRatio = difficultyTracker.medium / totalTracked;
    const hardRatio = difficultyTracker.hard / totalTracked;

    const targetEasyRatio = weights.easy / 100;
    const targetMediumRatio = weights.medium / 100;
    const targetHardRatio = weights.hard / 100;

    // Boost under-represented difficulties
    if (easyRatio < targetEasyRatio - 0.1) {weights.easy += 30;}
    if (mediumRatio < targetMediumRatio - 0.1) {weights.medium += 30;}
    if (hardRatio < targetHardRatio - 0.1) {weights.hard += 30;}

    // Reduce over-represented difficulties
    if (easyRatio > targetEasyRatio + 0.1) {weights.easy = Math.max(5, weights.easy - 20);}
    if (mediumRatio > targetMediumRatio + 0.1) {weights.medium = Math.max(5, weights.medium - 20);}
    if (hardRatio > targetHardRatio + 0.1) {weights.hard = Math.max(5, weights.hard - 20);}
  }

  // Random selection based on weights
  const totalWeight = weights.easy + weights.medium + weights.hard;
  const random = Math.random() * totalWeight;

  if (random < weights.easy) {
    return "easy";
  } else if (random < weights.easy + weights.medium) {
    return "medium";
  } else {
    return "hard";
  }
}

/**
 * Resets the used questions tracking for time pressure mode
 * Useful for starting a new game
 *
 * @example
 * ```typescript
 * resetTimePressureQuestions();
 * const firstQuestion = getTimePressureQuestion(albums, 1);
 * ```
 */
export function resetTimePressureQuestions(): void {
  usedTimePressureQuestions.clear();
  difficultyTracker = { easy: 0, medium: 0, hard: 0, totalQuestions: 0 };
}

/**
 * Returns statistics about question usage and difficulty distribution
 * Useful for debugging and analytics
 *
 * @returns {object} Statistics about current session
 */
export function getTimePressureStats() {
  return {
    usedQuestionsCount: usedTimePressureQuestions.size,
    difficultyDistribution: { ...difficultyTracker },
    difficultyRatios: {
      easy:
        difficultyTracker.totalQuestions > 0
          ? `${((difficultyTracker.easy / difficultyTracker.totalQuestions) * 100).toFixed(1)  }%`
          : "0%",
      medium:
        difficultyTracker.totalQuestions > 0
          ? `${((difficultyTracker.medium / difficultyTracker.totalQuestions) * 100).toFixed(1)  }%`
          : "0%",
      hard:
        difficultyTracker.totalQuestions > 0
          ? `${((difficultyTracker.hard / difficultyTracker.totalQuestions) * 100).toFixed(1)  }%`
          : "0%",
    },
  };
}

/**
 * Updates time pressure configuration dynamically
 * Useful for adaptive difficulty adjustment
 *
 * @param {Partial<TimePressureConfig>} newConfig - Configuration updates
 * @returns {TimePressureConfig} Updated configuration
 */
export function updateTimePressureConfig(
  newConfig: Partial<TimePressureConfig>
): TimePressureConfig {
  return {
    ...DEFAULT_CONFIG,
    ...newConfig,
    difficultyWeights: { ...DEFAULT_CONFIG.difficultyWeights, ...newConfig.difficultyWeights },
    timeLimits: { ...DEFAULT_CONFIG.timeLimits, ...newConfig.timeLimits },
    basePoints: { ...DEFAULT_CONFIG.basePoints, ...newConfig.basePoints },
  };
}
