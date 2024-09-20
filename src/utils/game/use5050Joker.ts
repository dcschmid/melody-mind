/**
 * Function to use the 50/50 Joker in the game.
 * Removes 2 random incorrect options from the DOM.
 * @param {object} question - The current question object
 * @param {HTMLButtonElement} jokerButton - The 5050 Joker button
 * @param {number} maxJokers - The total amount of 5050 Jokers available
 * @param {number} jokerUsedCount - The amount of 5050 Jokers already used
 * @return {number} The updated amount of 5050 Jokers used
 */
export function use5050Joker(
  question: any,
  jokerButton: HTMLButtonElement,
  maxJokers: number,
  jokerUsedCount: number,
): number {
  // Check if the Joker has already been used
  let jokerUsed = false;

  // Return the current joker count if it has already been used
  if (jokerUsed) return jokerUsedCount;

  // Disable the Joker button if the max amount of Jokers has been reached
  if (jokerUsedCount >= maxJokers) {
    jokerButton.disabled = true;
    return jokerUsedCount;
  }

  // Get the correct answer and all the options
  const correctAnswer = question.correctAnswer;
  const options = document.querySelectorAll(
    "#options button",
  ) as NodeListOf<HTMLElement>;

  // Find all the incorrect options
  const incorrectOptions: HTMLElement[] = [];
  options.forEach((option) => {
    // Check if the option is not the correct answer
    if (option.textContent !== correctAnswer) {
      incorrectOptions.push(option);
    }
  });

  // Remove 2 random incorrect answers from the DOM
  const toRemove = incorrectOptions
    .sort(() => Math.random() - 0.5) // Randomize the array
    .slice(0, 2); // Get the first 2 elements

  // Add a transitionend event listener to each element to remove it after the transition has finished
  toRemove.forEach((option) => {
    // Add the hidden class to trigger the transition
    option.classList.add("hidden");
    option.addEventListener("transitionend", () => option.remove());
  });

  // Update the Joker used count
  jokerUsed = true;

  // Return the updated Joker count
  return jokerUsedCount + 1;
}
