/**
 * Updates the score display and temporarily adds a bonus animation
 * @param score - The score value to display
 * @param scoreElement - The DOM element that shows the score
 * @description
 * This function performs the following:
 * 1. Updates the score text if different from current display
 * 2. Triggers a bonus animation by removing and re-adding the 'bonus' class
 * 3. Automatically cleans up the animation class after transition ends
 *
 * @example
 * ```typescript
 * const scoreElement = document.getElementById('score');
 * updateScoreDisplay(100, scoreElement);
 * ```
 */
export function updateScoreDisplay(score: number, scoreElement: HTMLElement): void {
  if (scoreElement.textContent !== score.toString()) {
    scoreElement.textContent = score.toString();
  }

  scoreElement.classList.remove("bonus");
  void scoreElement.offsetHeight;
  scoreElement.classList.add("bonus");

  const cleanup = () => {
    scoreElement.classList.remove("bonus");
    scoreElement.removeEventListener("transitionend", cleanup);
  };
  scoreElement.addEventListener("transitionend", cleanup);
}
