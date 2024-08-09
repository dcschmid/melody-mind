import { handleFinishedButtonClick } from "./handleFinishedButtonClick";

/**
 * Sets up the event listener for the "Finished" button click event.
 * When the button is clicked, it calls the `handleFinishedButtonClick` function.
 *
 * @param finishedUrl - The URL to navigate to when the button is clicked.
 * @return {void} This function does not return anything.
 */
export function setupFinishButton(finishedUrl: string): void {
  // Get the element with the ID "finishedButton"
  // This button is used to navigate to the next round or the results page
  const finishedButton = document.getElementById("finishedButton");

  // Add a click event listener to the "Finished" button
  // When the button is clicked, call the `handleFinishedButtonClick` function
  // with the `finishedUrl` parameter as an argument
  finishedButton?.addEventListener("click", () => {
    // Call the `handleFinishedButtonClick` function with the `finishedUrl` parameter as an argument
    handleFinishedButtonClick(finishedUrl);
  });
}
