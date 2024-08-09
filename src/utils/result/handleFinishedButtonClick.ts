/**
 * Handles the click event of the "Finished" button.
 *
 * This function is called when the user clicks the "Finished" button on the results page.
 * It redirects the user to the specified URL.
 *
 * @param finishedUrl - The URL to navigate to when the button is clicked.
 */
export function handleFinishedButtonClick(finishedUrl: string) {
  // Redirect the user to the specified URL when the "Finished" button is clicked
  window.location.href = finishedUrl;
}
