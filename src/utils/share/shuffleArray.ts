/**
 * Shuffles array elements using the Fisher-Yates algorithm with cryptographically
 * secure random number generation.
 *
 * This function creates a new array with the same elements in randomized order.
 * The original array remains unchanged to avoid side effects.
 *
 * Features:
 * - Uses cryptographically secure random generation (Web Crypto API or Node.js crypto)
 * - Creates a new array rather than modifying the original (immutable approach)
 * - Handles edge cases like empty or single-element arrays
 * - Falls back to Math.random() only if secure methods are unavailable
 *
 * Time complexity: O(n) where n is the array length
 * Space complexity: O(n) for the new array copy
 *
 * @template T - Type of elements in the array
 * @param {T[]} array - The source array to shuffle (remains unchanged)
 * @returns {T[]} A new array with the same elements in randomized order
 *
 * @example
 * // Basic usage
 * const numbers = [1, 2, 3, 4, 5];
 * const shuffled = shuffleArray(numbers);
 * // numbers is still [1, 2, 3, 4, 5]
 * // shuffled might be [3, 1, 5, 2, 4] (randomized)
 *
 * @example
 * // Works with any array type
 * const fruits = ['apple', 'banana', 'cherry'];
 * const shuffled = shuffleArray(fruits);
 */
export async function shuffleArray<T>(array: T[]): Promise<T[]> {
  // Early return for empty or single-element arrays
  if (array.length <= 1) {
    return [...array];
  }

  // Create a copy to avoid modifying the original array
  const copy = [...array];

  // Determine which random number generator to use based on environment
  const getRandomIndex = createRandomIndexGenerator();

  // Fisher-Yates (Knuth) shuffle algorithm
  for (let i = copy.length - 1; i > 0; i--) {
    // Get a random index from 0 to i (inclusive)
    const j = await Promise.resolve(getRandomIndex(i));

    // Swap elements using destructuring
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

/**
 * Creates an appropriate random index generator function based on the available
 * environment and APIs.
 *
 * Attempts to use cryptographically secure random number generation when available:
 * 1. Web Crypto API in browsers
 * 2. Node.js crypto module in Node environment
 * 3. Falls back to Math.random() if secure methods are unavailable
 *
 * @param {number} arrayLength - The length of the array being shuffled
 * @returns {(max: number) => number | Promise<number>} A function that generates random indices
 * @private
 */
function createRandomIndexGenerator(): (max: number) => number | Promise<number> {
  // Check for Web Crypto API (browser environment)
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    return (max: number): number => {
      // Create a typed array for the random bytes
      const randomBuffer = new Uint32Array(1);

      // Fill with cryptographically secure random values
      window.crypto.getRandomValues(randomBuffer);

      // Convert to an index within the desired range (0 to max, inclusive)
      return randomBuffer[0] % (max + 1);
    };
  }

  // Check for Node.js crypto module
  if (typeof process !== "undefined" && process.versions && process.versions.node) {
    try {
      // Dynamic import to avoid reference errors in browser environments
      return async (max: number): Promise<number> => {
        const crypto = await import("crypto");
        // Use Node's randomInt for a secure random integer in range
        return crypto.randomInt(0, max + 1);
      };
    } catch (error) {
      console.warn("Node crypto module not available, falling back to Math.random()", error);
    }
  }

  // Fallback to Math.random() with warning
  console.warn("Secure random number generation not available, using Math.random() instead");
  return (max: number): number => {
    // Convert to an index within the desired range (0 to max, inclusive)
    return Math.floor(Math.random() * (max + 1));
  };
}
