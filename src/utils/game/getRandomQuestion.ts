import { handleGameError } from "../error/errorHandlingUtils";

/**
 * Random Question Generator for Music Quiz
 *
 * This module provides functionality for selecting random questions from a pool
 * of music-related questions while preventing duplicates within a game session.
 *
 * @module getRandomQuestion
 */

/**
 * Set to track questions that have already been used during the current game session
 * to prevent duplicates and ensure a varied experience
 */
const usedQuestions = new Set<string>();

/**
 * Represents the difficulty levels available in the game
 */
type Difficulty = "easy" | "medium" | "hard";

/**
 * Use centralized types from `src/types/game` to ensure consistent shapes across the codebase.
 * These aliases keep the file compact while reusing the canonical type definitions.
 */
/**
 * Local question type used by the random-question generator.
 * Exported as `RQQuestion` so other modules can import the canonical
 * shape specifically used by this utility without coupling to the
 * broader `src/types/game` shape.
 */
export interface RQQuestion {
  /** The question text that will be displayed to the user */
  question: string;
  /** Array of possible answer options */
  options: string[];
  /** The correct answer from the options array */
  correctAnswer: string;
  /** Additional information shown after answering */
  trivia: string;
  /** Any additional properties */
  [key: string]: unknown;
}

/**
 * Local album type used by this module. Exported as `RQAlbum`.
 */
export interface RQAlbum {
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
    [key in Difficulty]: RQQuestion[];
  };
  /** Any additional properties */
  [key: string]: unknown;
}

/**
 * Return type for a random question selection
 */
interface RandomQuestionResult {
  /** The selected random question */
  randomQuestion: RQQuestion;
  /** The album associated with the question */
  randomAlbum: RQAlbum;
}

/**
 * Selects a random question from the provided albums based on difficulty
 *
 * This function maintains a session-wide record of previously used questions to
 * prevent repetition until all questions have been used or the number of rounds
 * has been completed. It also shuffles the selection to ensure randomness.
 *
 * @param {RQAlbum[]} albums - Array of album objects containing questions
 * @param {Difficulty} difficulty - Difficulty level of the questions to select from
 * @param {number} totalRounds - Total number of rounds in the game (for reset logic)
 *
 * @returns {RandomQuestionResult | null} Object containing the selected question and album,
 *          or null if no suitable questions are available
 *
 * @example
 * ```typescript
 * const result = getRandomQuestion(albums, 'medium', 10);
 * if (result) {
 *   const { randomQuestion, randomAlbum } = result;
 *   // Use the question...
 * }
 * ```
 */
export function getRandomQuestion(
  albums: RQAlbum[],
  difficulty: Difficulty,
  totalRounds: number
): RandomQuestionResult | null {
  // Validate input parameters
  if (!albums || !Array.isArray(albums) || albums.length === 0) {
    return null;
  }

  if (!difficulty || !["easy", "medium", "hard"].includes(difficulty)) {
    difficulty = "easy";
  }

  // First check if we need to reset the used questions set
  if (usedQuestions.size >= totalRounds) {
    usedQuestions.clear();
  }

  try {
    // Create a copy of the albums array to avoid mutation
    const albumsCopy = [...albums];

    // Manual shuffle since we can't use the async shuffleArray function directly
    // Simple Fisher-Yates shuffle algorithm implementation
    for (let i = albumsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [albumsCopy[i], albumsCopy[j]] = [albumsCopy[j], albumsCopy[i]];
    }

    // Create a flat list of all valid questions with their corresponding albums
    // that haven't been used yet in this game session
    const availableQuestions = albumsCopy.flatMap((album: RQAlbum) => {
      // Safely access questions for the current difficulty
      const questionsForDifficulty: RQQuestion[] = album.questions[difficulty] || [];

      // Filter out questions that have already been used
      return questionsForDifficulty
        .filter((question: RQQuestion) => !usedQuestions.has(String(question.question)))
        .map((question: RQQuestion) => ({
          randomQuestion: question,
          randomAlbum: album,
        }));
    });

    // If we have available questions, pick one randomly
    if (availableQuestions.length > 0) {
      // Select a random question from the available options
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const result = availableQuestions[randomIndex];

      // Mark this question as used to avoid repetition
      usedQuestions.add(result.randomQuestion.question);

      return result;
    } else if (usedQuestions.size > 0) {
      // If all questions have been used but we still have rounds to go,
      // clear the used questions and try again
      usedQuestions.clear();
      return getRandomQuestion(albums, difficulty, totalRounds);
    }

    return null;
  } catch (error) {
    handleGameError(error, "random question selection");
    return null;
  }
}

/**
 * Resets the used questions tracking
 * Useful for starting a new game or testing
 *
 * @example
 * ```typescript
 * // Start a new game with fresh questions
 * resetUsedQuestions();
 * const firstQuestion = getRandomQuestion(albums, 'easy', 10);
 * ```
 */
export function resetUsedQuestions(): void {
  usedQuestions.clear();
}

/**
 * Returns the number of questions that have been used in the current session
 * Useful for debugging or progress tracking
 *
 * @returns {number} Count of used questions
 */
export function getUsedQuestionsCount(): number {
  return usedQuestions.size;
}
