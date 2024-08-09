/**
 * Shuffles the elements of an array in place.
 *
 * @param array - The array to be shuffled.
 * @return The shuffled array.
 */
export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
