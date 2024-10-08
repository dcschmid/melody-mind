/**
 * Shuffles the elements of an array in a non-mutating way using the Fisher-Yates algorithm.
 *
 * This algorithm ensures that every possible permutation of the array
 * has an equal chance of appearing, making it unbiased.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to be shuffled.
 * @return A new shuffled array without mutating the original one.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array]; // Create a copy of the array
  for (let i = copy.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at index i and j
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy; // Return the shuffled copy
}
