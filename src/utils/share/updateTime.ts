/**
 * Updates the time display with the given time remaining in seconds.
 *
 * @param {number} timeRemaining - The time remaining in seconds.
 */
export function updateTime(timeRemaining: number) {
  // Get the HTML elements for displaying the minutes and seconds
  const minutesElement = document.getElementById("minutes") as HTMLElement;
  const secondsElement = document.getElementById("seconds") as HTMLElement;

  // Convert the time remaining to a string, padded with leading zeros to 4 digits
  // Example: 1234 seconds becomes "0123"
  const timeStr = `${timeRemaining}`.padStart(4, "0");

  // Extract the minutes and seconds from the time string
  // Example: "0123" becomes "01" and "23"
  const minutes = timeStr.slice(0, 2);
  const seconds = timeStr.slice(2);

  // Update the display with the formatted minutes and seconds
  // Example: minutesElement.textContent = "01" and secondsElement.textContent = "23"
  minutesElement.textContent = minutes;
  secondsElement.textContent = seconds;
}
