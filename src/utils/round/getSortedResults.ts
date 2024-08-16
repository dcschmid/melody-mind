
  /**
 * Represents the result of a cover.
 */
interface CoverResult {
  band: string; // The band name
  album: string; // The album name
  data: string; // The release date
  coverSrc: string; // The cover image source
  isWrong: boolean;
}

/**
 * Retrieves the sorted results from the DOM and compares them with the final solutions.
 * Calculates the number of points earned and saves them to localStorage.
 *
 * @param solutionArray - The array containing the final solutions, where each element is an object with a 'band' property of type string.
 * @param allCorrectRoundName - The name of the localStorage key that stores whether all results are correct.
 * @param PointsRoundName - The name of the localStorage key that stores the points earned.
 * @param ResultsRoundName - The name of the localStorage key that stores the results.
 */
export const getSortedResults = (
  solutionArray:[],
  allCorrectRoundName: string,
  PointsRoundName: string,
  ResultsRoundName: string
): void => {
  // Get all the cover elements from the DOM and convert them to an array
  const sortedCovers: HTMLElement[] = Array.from(document.querySelectorAll<HTMLElement>(".cover")).reverse();

  // Map over the cover elements and create an array of objects containing the data attributes
  const results: CoverResult[] = sortedCovers.map((cover) => ({
    band: cover.getAttribute("data-band")!, // Get the band name
    album: cover.getAttribute("data-album")!, // Get the album name
    data: cover.getAttribute("data-data")!, // Get the release date
    coverSrc: cover.getAttribute("data-cover-source")!, // Get the cover image source
    isWrong: false,
  }));

  let points = 0;
  let allCorrect = true;

  // Compare the results with the final solutions array
  results.forEach((result, index) => {
    // Check if the band name matches the band name in the final solutions array
    if (result.band === solutionArray[index]) {
      points += 25; // Add 25 points for each correct match
      result.isWrong = false;
    } else {
      allCorrect = false; // Set allCorrect to false if there's any incorrect match
      result.isWrong = true;
    }
  });

  // Add 25 extra points if all results are correct
  if (allCorrect) {
    points += 25;
    localStorage.setItem(allCorrectRoundName, String(true));
  } else {
    localStorage.setItem(allCorrectRoundName, String(false));
  }

  const currentPoints = parseInt(localStorage.getItem("currentPoints") || "0", 10);

  // Save the current points to localStorage
  // This is used to display the current points on the results page
  localStorage.setItem("currentPoints", String(currentPoints + points));

  // Save points to localStorage
  localStorage.setItem(PointsRoundName, String(points));

  // Save results to localStorage
  localStorage.setItem(ResultsRoundName, JSON.stringify(results));
};
