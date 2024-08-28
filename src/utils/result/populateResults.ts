import { createResultItem } from "./createResultItem";

/**
 * Populates the results container with the result items from the given round.
 * @param resultRoundName - The name of the round to get the results from.
 */
export function populateResults(resultRoundName: string) {
  // Get the results container element
  const resultsContainer = document.getElementById("results-container");

  // If the results container element does not exist, exit the function
  if (!resultsContainer) {
    return;
  }

  // Get the results from the given round from localStorage
  const resultsRound = JSON.parse(
    localStorage.getItem(resultRoundName) || "[]",
  );

  // Create a document fragment to improve performance when adding multiple elements to the DOM
  const fragment = document.createDocumentFragment();

  // Iterate over the results and create a result item for each one
  resultsRound.forEach((result: any, index: any) => {
    // Create a result item for the current result
    const resultItem = createResultItem(result, index);

    // Append the result item to the document fragment
    fragment.appendChild(resultItem);
  });

  // Append the result items to the results container
  resultsContainer.appendChild(fragment);
}
