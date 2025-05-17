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
 * Return type for a random question selection
 */
interface RandomQuestionResult {
  /** The selected random question */
  randomQuestion: Question;
  /** The album associated with the question */
  randomAlbum: Album;
}

/**
 * Selects a random question from the provided albums based on difficulty
 *
 * This function maintains a session-wide record of previously used questions to
 * prevent repetition until all questions have been used or the number of rounds
 * has been completed. It also shuffles the selection to ensure randomness.
 *
 * @param {Album[]} albums - Array of album objects containing questions
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
  albums: Album[],
  difficulty: Difficulty,
  totalRounds: number
): RandomQuestionResult | null {
  // Validate input parameters
  if (!albums || !Array.isArray(albums) || albums.length === 0) {
    console.warn("No albums provided or invalid albums array");
    return null;
  }

  if (!difficulty || !["easy", "medium", "hard"].includes(difficulty)) {
    console.warn(`Invalid difficulty level: ${difficulty}, defaulting to 'easy'`);
    difficulty = "easy";
  }

  // First check if we need to reset the used questions set
  if (usedQuestions.size >= totalRounds) {
    console.warn("All rounds completed, resetting used questions tracking");
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
    const availableQuestions = albumsCopy.flatMap((album: Album) => {
      // Safely access questions for the current difficulty
      const questionsForDifficulty = album.questions[difficulty] || [];

      // Filter out questions that have already been used
      return questionsForDifficulty
        .filter((question: Question) => !usedQuestions.has(question.question))
        .map((question: Question) => ({
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

    console.warn(`No questions available for difficulty: ${difficulty}`);
    return null;
  } catch (error) {
    console.error("Error selecting random question:", error);
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
