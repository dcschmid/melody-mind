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
 * @param difficulty - The difficulty level of the game
 * @returns A corresponding title for the selected difficulty level
 * @throws Will never throw an error due to type safety
 *
 * @example
 * getTitleBasedOnDifficulty("easy") // returns "Musik-Novize"
 * getTitleBasedOnDifficulty("medium") // returns "Musik-Meister"
 * getTitleBasedOnDifficulty("hard") // returns "Musik-Legende"
 */
export function getTitleBasedOnDifficulty(difficulty: Difficulty): string {
  return DIFFICULTY_TITLES[difficulty] ?? "Musik-Kenner";
}
