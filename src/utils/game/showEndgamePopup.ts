/**
 * Shows the endgame popup with the user's final score and a restart button.
 * @param {number} score The user's final score.
 * @param {Function} restartGame A function to restart the game.
 */
export function showEndgamePopup(score: number, restartGame: Function) {
  // Set the score in the popup
  document.getElementById("popup-score")!.textContent = score.toString();

  // Get the endgame popup element
  const endgamePopup = document.getElementById("endgame-popup");

  // Remove the hidden class to show the popup
  endgamePopup!.classList.remove("hidden");

  // Get the restart button element
  const restartButton = document.getElementById("restart-button");

  // Add an event listener to the restart button
  restartButton!.onclick = function () {
    // Call the restartGame function when the restart button is clicked
    restartGame();
  };
}
