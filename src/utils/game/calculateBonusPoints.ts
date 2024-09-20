/**
 * Calculates the bonus points for the current question based on the time taken.
 *
 * @param {number} startTime - The start time of the question in milliseconds.
 * @returns {number} The bonus points for the question.
 *
 * The bonus points are calculated as follows:
 * - 50 points if the question is answered within 10 seconds.
 * - 25 points if the question is answered between 10 and 15 seconds.
 * - 0 points if the question is answered in more than 15 seconds.
 */
export function calculateBonusPoints(startTime: number): number {
  const timeTaken = (Date.now() - startTime) / 1000;

  if (timeTaken <= 10) {
    return 50;
  } else if (timeTaken <= 15) {
    return 25;
  } else {
    return 0;
  }
}
