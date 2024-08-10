/**
 * Updates the time display with the given time remaining in seconds.
 *
 * @param {number} timeRemaining - The time remaining in seconds.
 */
export function updateTime(timeRemaining: number) {
  // Get the HTML elements for displaying the minutes and seconds
  // The minutes element is the element with the id "minutes"
  const minutesElement = document.getElementById("minutes") as HTMLElement;
  // The seconds element is the element with the id "seconds"
  const secondsElement = document.getElementById("seconds") as HTMLElement;

  // Calculate minutes and seconds from the remaining time
  // The minutes are calculated by dividing the time remaining by 60
  const minutes = Math.floor(timeRemaining / 60);
  // The seconds are calculated by taking the remainder of the division of the time remaining by 60
  const seconds = timeRemaining % 60;

  // Update the display with the formatted minutes and seconds
  // The minutes are converted to a string and padded with leading zeros if necessary
  // The seconds are converted to a string and padded with leading zeros if necessary
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
}
