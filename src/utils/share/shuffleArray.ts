/**
 * Shuffles the elements of an array in a non-mutating, cryptographically secure way
 * using the Fisher-Yates algorithm.
 *
 * This version uses `crypto.getRandomValues()` to generate cryptographically secure random numbers.
 * It ensures that every possible permutation of the array has an equal chance of appearing, making it unbiased.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to be shuffled.
 * @return A new shuffled array without mutating the original one.
 */
export function shuffleArray<T>(array: T[]): T[] {
  // Create a copy of the array
  const copy = [...array];

  // Iterate through the array in reverse order
  for (let i = copy.length - 1; i > 0; i--) {
    let j;
    // Generate a secure random number between 0 and i (inclusive)
    if (typeof window !== 'undefined' && window.crypto) {
      // Client-side: Use crypto.getRandomValues for secure random number
      const randomValues = new Uint32Array(1);
      window.crypto.getRandomValues(randomValues);
      j = randomValues[0] % (i + 1);
    } else {
      // Server-side (Node.js): Use Node.js crypto module for random number
      const { randomInt } = require('crypto');
      j = randomInt(0, i + 1);
    }

    // Swap elements at index i and j
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  // Return the shuffled copy
  return copy;
}
