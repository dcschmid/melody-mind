import { startTimer } from "../share/startTimer";

/**
 * Initializes the overlay by setting its visibility and adding a click event listener to the game button.
 * When the game button is clicked, it hides the overlay and starts the timer.
 *
 * @param {number} timerInterval - The interval for the timer.
 * @param {number} timeRemaining - The initial time remaining.
 */
export function initializeOverlay(timerInterval: number, timeRemaining: number) {
  // Get the overlay and game button elements
  const timupsOverlay = document.getElementById("timupsOverlay") as HTMLElement;
  const startOverlay = document.getElementById("startOverlay");
  const gameButton = document.getElementById("gameButton");

  // Set the visibility of the overlay and timupsOverlay elements
  startOverlay!.style.visibility = "visible";
  timupsOverlay!.style.visibility = "hidden";

  // Add a click event listener to the game button
  gameButton!.addEventListener("click", () => {
    // Hide the overlay and start the timer
    startOverlay!.style.visibility = "hidden";
    startTimer(timerInterval, timeRemaining, timupsOverlay);
  });
}
