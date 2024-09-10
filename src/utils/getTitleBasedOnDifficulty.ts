/**
 * Gets a title based on the difficulty of the game.
 *
 * @param difficulty The difficulty of the game, can be either "easy", "medium" or "hard".
 * @returns A title based on the difficulty of the game.
 *
 * The following titles are used:
 * - easy: Musik-Novize
 * - medium: Musik-Meister
 * - hard: Musik-Legende
 */
export function getTitleBasedOnDifficulty(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "Musik-Novize";
    case "medium":
      return "Musik-Meister";
    case "hard":
      return "Musik-Legende";
    default:
      return "Musik-Kenner";
  }
}
