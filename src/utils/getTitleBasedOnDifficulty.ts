type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_TITLES = {
  easy: "Musik-Novize",
  medium: "Musik-Meister",
  hard: "Musik-Legende",
} as const;

/**
 * Returns a title based on the selected game difficulty.
 * The title represents the player's skill level in music.
 *
 * @param {Difficulty} difficulty - The difficulty level of the game
 * @returns {string} A corresponding title for the selected difficulty level
 * @example
 * getTitleBasedOnDifficulty("easy") // returns "Musik-Novize"
 */
export function getTitleBasedOnDifficulty(difficulty: Difficulty): string {
  return DIFFICULTY_TITLES[difficulty] ?? "Musik-Kenner";
}
