/**
 * Shows the feedback for the user after answering a question.
 * @param {boolean} isCorrect Whether the user's answer was correct or not.
 * @param {HTMLElement} feedbackElement The HTML element to display the feedback.
 * @param {string|null} correctAnswer The correct answer to the question.
 */
export function showFeedback(
  isCorrect: boolean,
  feedbackElement: HTMLElement,
  correctAnswer: string | null = null,
  bonusPoints: number
): void {
  const text = isCorrect
    ? `Richtig! 50 Punkte + ${bonusPoints} Bonuspunkte`
    : `Falsch! Die richtige Antwort war: ${correctAnswer}`;
  const className = isCorrect ? "show correct" : "show incorrect";

  feedbackElement.classList.add(className);
  feedbackElement.textContent = text;

  // Show the feedback for 3 seconds
  window.setTimeout(() => {
    feedbackElement.classList.remove(className);
  }, 3000);
}
