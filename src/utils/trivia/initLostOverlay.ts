import { calculateTheCurrentPoints } from "../calculateTheCurrentPoints";

/**
 * Initializes the lost overlay by caching the overlayLost element and lost items,
 * and adding a click event listener to each lost item to show the overlayLost overlay,
 * clear the timer interval, and update the points displayed in the overlayLost.
 *
 * @param {number | null} timerInterval - The timer interval to clear when a lost item is clicked.
 * @param {string} triviaRoundWonName - The name of the trivia round won item to set to false in localStorage.
 * @param {string} category - The category to use when calculating the current points.
 * @return {void}
 */
export function initLostOverlay(
  timerInterval: number | null,
  triviaRoundWonName: string,
  category: string,
) {
  // Cache the overlayLost element
  const overlayLost = document.getElementById("overlayLost") as HTMLElement;

  // Cache the lost items
  const lostItems = document.querySelectorAll(".lost");

  /**
   * Event listener for when a lost item is clicked.
   * Shows the overlayLost overlay, clears the timer interval,
   * and updates the points displayed in the overlayLost.
   *
   * @param {Event} event - The click event
   */
  const lostItemClickHandler = (_event: Event) => {
    // Show the overlayLost overlay
    overlayLost.style.visibility = "visible";

    // Clear the timer interval
    clearInterval(timerInterval!);

    // Set the triviaRoundWonName item to false in localStorage
    localStorage.setItem(triviaRoundWonName, "false");

    // Calculate the current points
    calculateTheCurrentPoints(category);

    // Get the pointDiv element in the overlayLost
    const pointDiv = overlayLost.querySelector(".point");

    // Get the current points from localStorage, defaulting to 0 if not set
    const currentPoints = parseInt(
      localStorage.getItem("currentPoints") || "0",
      10,
    );

    // Set the text content of the pointDiv to the current points
    pointDiv!.textContent = `${currentPoints} Pt`;
  };

  // Add the click event listener to each lost item
  for (const lostItem of lostItems) {
    // Add the click event listener to the lost item
    lostItem.addEventListener("click", lostItemClickHandler);
  }
}
