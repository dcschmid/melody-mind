/**
 * Updates the score display element with the given score.
 * @param {number} score - The score to display.
 */
export function updateScoreDisplay(score: number) {
  // Get the score element from the DOM
  const scoreElement = document.querySelector(
    ".coinsCount",
  ) as HTMLParagraphElement;

  // Set the text content of the score element to the score
  scoreElement.textContent = score.toString();

  // Add a bonus animation to the score element
  // This animation will be removed after 500ms
  scoreElement.classList.add("bonus");

  // Remove the bonus animation after 500ms
  setTimeout(() => {
    scoreElement.classList.remove("bonus");
  }, 500);
}
