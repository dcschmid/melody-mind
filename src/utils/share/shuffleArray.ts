/**
 * Shuffles the elements of an array in place using the Fisher-Yates algorithm.
 *
 * This algorithm ensures that every possible permutation of the array
 * has an equal chance of appearing, making it unbiased.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to be shuffled.
 * @return The shuffled array.
 */
export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at index i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
