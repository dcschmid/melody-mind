import { shuffleArray } from "@utils/share/shuffleArray";

// Set to keep track of used questions
let usedQuestions = new Set();

/**
 * Function to get a random question from the given array of albums.
 *
 * @param {object[]} albums - An array of albums
 * @param {string} difficulty - The difficulty of the question, either 'easy', 'medium', or 'hard'
 * @param {number} totalRounds - The total number of rounds in the game
 * @returns {object|null} An object containing a random question and the album it belongs to, or null if no new questions are available
 */
export function getRandomQuestion(albums: any[], difficulty: string, totalRounds: number) {
  // Shuffle the albums array to randomize the questions order
  const shuffledAlbums = shuffleArray(albums);

  // Loop through the shuffled albums to find a new question
  for (const album of shuffledAlbums) {
    const availableQuestions = album.questions[difficulty].filter(
      (question: any) => !usedQuestions.has(question.question),
    );

    // If there are available questions that haven't been used
    if (availableQuestions.length > 0) {
      // Get a random question from the filtered available questions
      const randomQuestionIndex = Math.floor(
        Math.random() * availableQuestions.length,
      );
      const randomQuestion = availableQuestions[randomQuestionIndex];

      // Add the question to the usedQuestions set to track it
      usedQuestions.add(randomQuestion.question);

      // Return the random question and the album it belongs to
      return {
        randomQuestion,
        randomAlbum: album,
      };
    }
  }

  // If all questions have been used or after total rounds, reset the used questions
  if (usedQuestions.size >= totalRounds) {
    console.warn("All questions have been used. Resetting the question set.");
    usedQuestions.clear(); // Reset the used questions for a new round
  }

  // Return null if no new questions available or after all rounds
  console.warn("No new questions available for this difficulty.");
  return null;
}
