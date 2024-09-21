/**
 * Shows the golden LP popup with the user's final score and a restart button.
 * @param {number} score The user's final score.
 * @param {Function} restartGame A function to restart the game.
 */
export function showGoldenLpPopup(score: number, restartGame: Function) {
  // Set the score in the popup
  document.getElementById("golden-lp-score")!.textContent = score.toString();

  // Get the golden LP popup element
  const goldenLpPopup = document.getElementById("golden-lp-popup");

  // Remove the hidden class to show the popup
  goldenLpPopup!.classList.remove("hidden");

  // Add an event listener to the restart button
  document.getElementById("restart-button-lp")!.onclick = function () {
    // Call the restartGame function when the restart button is clicked
    restartGame();
  };
}
