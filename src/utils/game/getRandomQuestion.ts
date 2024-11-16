import { shuffleArray } from "@utils/share/shuffleArray";

/**
 * Set to keep track of questions that have already been used
 * to avoid duplicates during the game
 */
const usedQuestions = new Set<string>();

/**
 * Gets a random question from the available albums based on difficulty
 *
 * @param albums - Array of album objects containing questions
 * @param difficulty - Difficulty level of the questions to select from
 * @param totalRounds - Total number of rounds in the game
 *
 * @returns Object containing the random question and its corresponding album,
 *          or null if no questions are available
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
  albums: Array<{
    questions: {
      [key: string]: Array<{
        question: string;
        [key: string]: any;
      }>;
    };
  }>,
  difficulty: 'easy' | 'medium' | 'hard',
  totalRounds: number,
) {
  if (!albums?.length) {
    console.warn('No albums provided');
    return null;
  }

  /**
   * Shuffle the albums array to ensure random selection
   * across different albums
   */
  const shuffledAlbums = shuffleArray(albums);

  /**
   * Collect all available questions that haven't been used yet
   * and map them to include their corresponding album
   */
  const allAvailableQuestions = shuffledAlbums
    .flatMap(album =>
      album.questions[difficulty]
        .filter(question => !usedQuestions.has(question.question))
        .map(question => ({ randomQuestion: question, randomAlbum: album }))
    );

  /**
   * If there are available questions, select one randomly
   * and mark it as used
   */
  if (allAvailableQuestions.length > 0) {
    const randomIndex = Math.floor(Math.random() * allAvailableQuestions.length);
    const result = allAvailableQuestions[randomIndex];
    usedQuestions.add(result.randomQuestion.question);
    return result;
  }

  /**
   * If all questions have been used, clear the used questions set
   * and try again, unless we've reached the total number of rounds
   */
  if (usedQuestions.size >= totalRounds) {
    usedQuestions.clear();
    return getRandomQuestion(albums, difficulty, totalRounds);
  }

  return null;
}
