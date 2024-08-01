/**
 * Retrieves the sorted results from the DOM and compares them with the final solutions array.
 * Calculates the points earned and saves them to localStorage.
 *
 * @param finalSolutionsArray - The array of final solutions to compare against.
 * @param allCorrectRound - The key to store whether all results are correct in localStorage.
 * @param pointsRound - The key to store the earned points in localStorage.
 * @param resultsRound - The key to store the results in localStorage.
 */
export const getSortedResults = (
    finalSolutionsArray: { band: string }[],
    allCorrectRound: string,
    pointsRound: string,
    resultsRound: string
) => {
    // Get all the cover elements from the DOM and reverse their order
    const sortedCovers = Array.from(document.querySelectorAll(".cover")).reverse();

    // Map over the cover elements and create an array of objects containing the data attributes
    const results = sortedCovers.map((cover) => ({
        band: cover.getAttribute("data-band")!,
        album: cover.getAttribute("data-album")!,
        date: cover.getAttribute("data-data")!,
        coverSrc: cover.getAttribute("data-cover-source")!,
        isWrong: false,
    }));

    // Calculate the points earned by comparing the results with the final solutions array
    const points = results.reduce((acc, result, index) => {
        if (result.band === finalSolutionsArray[index]?.band) {
            return acc + 25;
        }
        result.isWrong = true;
        return acc;
    }, 0);

    // Check if all results are correct
    const allCorrect = results.every((result) => result.isWrong === false);

    // Save the results, points, and whether all results are correct to localStorage
    localStorage.setItem(allCorrectRound, String(allCorrect));
    localStorage.setItem(pointsRound, String(points + (allCorrect ? 25 : 0)));
    localStorage.setItem(resultsRound, JSON.stringify(results));
};
