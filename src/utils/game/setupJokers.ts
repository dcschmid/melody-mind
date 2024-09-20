/**
 * Set up the number of available jokers and the joker used count
 * for the game based on the difficulty level.
 *
 * @param {string} difficulty - The difficulty level of the game.
 * @returns {object} An object containing the number of available jokers
 * and the joker used count.
 */
export function setupJokers(difficulty: string | null): {
  maxJokers: number;
  jokerUsedCount: number;
} {
  let maxJokers = 0;

  // Set the number of available jokers based on the difficulty level
  switch (difficulty) {
    case "easy":
      maxJokers = 3;
      break;
    case "medium":
      maxJokers = 5;
      break;
    case "hard":
      maxJokers = 10;
      break;
  }

  return { maxJokers, jokerUsedCount: 0 };
}
