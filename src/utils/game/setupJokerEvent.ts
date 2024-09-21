/**
 * Set up the event listener for the 50/50 Joker button.
 *
 * This function sets up an event listener for the 50/50 Joker button.
 * When the button is clicked, it calls the `use5050Joker` function to use the 50/50 Joker.
 * It also updates the Joker counter element with the remaining Joker count.
 *
 * @param {HTMLButtonElement} jokerButton - The 50/50 Joker button element.
 * @param {number} maxJokers - The maximum number of 50/50 Jokers available.
 * @param {number} jokerUsed - The number of 50/50 Jokers already used.
 * @param {Function} use5050Joker - A function to use the 50/50 Joker.
 * @param {Function} getCurrentQuestion - A function to get the current question.
 */
export function setupJokerEvent(
  jokerButton: HTMLButtonElement,
  maxJokers: number,
  jokerUsed: number,
  use5050Joker: Function,
  getCurrentQuestion: Function
) {
  // Get the Joker counter element
  const jokerCounterElement = document.getElementById(
    "joker-count",
  ) as HTMLElement;

  // Set the initial Joker count
  jokerCounterElement.textContent = `Joker: ${maxJokers} verbleibend`;

  // Add an event listener to the Joker button
  // When the button is clicked, use the 50/50 Joker
  // and update the Joker counter element
  jokerButton.addEventListener("click", function () {
    // Get the current question
    const currentQuestion = getCurrentQuestion();

    // Use the 50/50 Joker and get the updated Joker count
    const jokerUsedCount = use5050Joker(
      currentQuestion,
      jokerButton,
      maxJokers,
      jokerUsed,
    );

    // Update the Joker counter element
    jokerCounterElement.textContent = `Joker: ${maxJokers - jokerUsedCount} verbleibend`;
  });
}
    