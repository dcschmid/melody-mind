import { getSortedResults } from "./getSortedResults";

/**
 * Handles the click event of the end round button.
 * Gets the sorted results and navigates to the results page for round one.
 *
 * @param solutionArray - The array containing the final solutions, where each element is an object with a 'band' property of type string.
 * @param redirectURL - The URL to redirect to after the sorted results are retrieved.
 * @param allCorrectRoundName - The name of the localStorage key that stores whether all results are correct.
 * @param PointsRoundName - The name of the localStorage key that stores the points earned in the current round.
 * @param ResultsRoundName - The name of the localStorage key that stores the results of the current round.
 */
export function handleEndRoundClick(solutionArray: [], redirectURL: string, allCorrectRoundName: string, PointsRoundName: string, ResultsRoundName: string) {
  // Get the end round button and finish round button elements
  const endRoundButton = document.getElementById("endRound") as HTMLButtonElement;
  const finishRoundButton = document.getElementById("finishRoundButton") as HTMLButtonElement;

  // Define the click event handler function
  const handleClick = () => {
    // Get the sorted results and store them in localStorage
    getSortedResults(solutionArray, allCorrectRoundName, PointsRoundName, ResultsRoundName);

    // Redirect to the results page for round one
    window.location.href = redirectURL;
  };

  // Add the click event listener to the end round button
  endRoundButton.addEventListener("click", handleClick);

  // Add the click event listener to the finish round button
  finishRoundButton.addEventListener("click", handleClick);
}
