/**
 * Shuffles an array using a cryptographically secure random number generator.
 * Uses the Fisher-Yates (also known as Knuth) shuffle algorithm.
 *
 * @template T - The type of elements in the array
 * @param array - The input array to be shuffled
 * @returns A new array with the same elements in randomized order
 *
 * @example
 * const arr = [1, 2, 3, 4, 5];
 * const shuffled = shuffleArray(arr);
 * // arr remains unchanged, shuffled contains elements in random order
 */
export function shuffleArray<T>(array: T[]): T[] {
  // Early return for empty or single-element arrays
  if (array.length <= 1) return [...array];

  const copy = [...array];

  // Get crypto object once at the start
  const crypto =
    typeof window !== "undefined" ? window.crypto : require("crypto");

  for (let i = copy.length - 1; i > 0; i--) {
    let j: number;

    // Use appropriate random number generation method based on environment
    if ("getRandomValues" in crypto) {
      const randomValues = new Uint32Array(1);
      crypto.getRandomValues(randomValues);
      j = randomValues[0] % (i + 1);
    } else {
      j = (crypto as any).randomInt(0, i + 1);
    }

    // Swap elements using destructuring
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}
