/**
 * Shows the endgame popup with the user's final score and a restart button.
 * @param {number} score The user's final score.
 * @param {Function} restartGame A function to restart the game.
 */
export function showEndgamePopup(score: string, restartGame: Function) {
  // Set the score in the popup
  const scoreElement = document.getElementById("popup-score");
  scoreElement!.textContent = score;

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
