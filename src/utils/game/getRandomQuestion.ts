import { shuffleArray } from "@utils/share/shuffleArray";

/**
 * Function to get a random question from the given array of albums.
 *
 * @param {object[]} albums - An array of albums
 * @param {string} difficulty - The difficulty of the question, either 'easy', 'medium', or 'hard'
 * @returns {object} An object containing a random question and the album it belongs to
 */
export function getRandomQuestion(albums: any[], difficulty: string) {
  // Shuffle the albums array to randomize the questions order
  const shuffledAlbums = shuffleArray(albums);

  // Get the first element of the shuffled array (the random album)
  const randomAlbum = shuffledAlbums[0];

  // Get a random question from the questions array of the random album
  const randomQuestionIndex = Math.floor(
    Math.random() * randomAlbum.questions[difficulty].length,
  );
  const randomQuestion = randomAlbum.questions[difficulty][randomQuestionIndex];

  // Return the random question and the random album
  return {
    randomQuestion,
    randomAlbum,
  };
}
