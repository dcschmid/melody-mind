/**
 * Shows the feedback for the user after answering a question.
 *
 * @param {boolean} isCorrect - Whether the user answered correctly or not.
 * @param {HTMLElement} feedbackElement - The element to display the feedback in.
 * @param {string | null} correctAnswer - The correct answer, if the user answered incorrectly.
 */
export function showFeedback(
  isCorrect: boolean,
  feedbackElement: HTMLElement,
  correctAnswer: string | null = null,
) {
  if (isCorrect) {
    // Add the correct class to the element
    feedbackElement.classList.add("correct");
    // Set the text content to a success message
    feedbackElement.textContent = "Richtig! 50 Punkte + Bonus";
  } else {
    // Add the incorrect class to the element
    feedbackElement.classList.add("incorrect");
    // Set the text content to a failure message with the correct answer
    feedbackElement.textContent = `Falsch! Die richtige Antwort war: ${correctAnswer}`;
  }

  // Add the show class to the element to display it
  feedbackElement.classList.add("show");
  // Set a timeout to hide the element after 3 seconds
  setTimeout(() => {
    // Remove the show class and the correct/incorrect classes from the element
    feedbackElement.classList.remove("show", "correct", "incorrect");
  }, 3000);
}
