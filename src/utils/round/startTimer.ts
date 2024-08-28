import { updateTime } from "../share/updateTime";

/**
 * Starts the timer by setting an interval to call the updateTime function every second.
 * The updateTime function updates the timer display and checks if the timer has reached zero.
 * If the timer has reached zero, it hides the timer overlay.
 *
 * @param timerInterval - The interval ID of the setInterval function.
 * @param timeRemaining - The remaining time in seconds.
 * @param timupsOverlay - The HTML element representing the timups overlay.
 */
export function startTimer(
  timerInterval: number,
  timeRemaining: number,
  timupsOverlay: HTMLElement,
) {
  // Set an interval to call the updateTime function every second
  timerInterval = window.setInterval(() => {
    // Call the updateTime function with the current timeRemaining value
    updateTime(timeRemaining);

    // Decrement the timeRemaining value and check if it has reached zero
    if (--timeRemaining < 0) {
      // If the timer has reached zero, hide the timer overlay
      // Clear the timer interval to stop the timer
      clearInterval(timerInterval!);
      timupsOverlay.style.visibility = "visible";
    }
  }, 1000);
}
