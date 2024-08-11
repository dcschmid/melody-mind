/**
 * Clears the local storage for a given category after the last round.
 *
 * @param {string} category - The category for which to clear the local storage.
 */
export function clearLocalStorageAfterLastRound(category: string) {
    // Remove round one points, trivia won, all correct, and results from local storage
    localStorage.removeItem(`${category}-Points-round-one`);
    localStorage.removeItem(`${category}-TriviaWon-round-one`);
    localStorage.removeItem(`${category}-AllCorrect-round-one`);
    localStorage.removeItem(`${category}-Results-round-one`);

    // Remove round two points, trivia won, all correct, and results from local storage
    localStorage.removeItem(`${category}-Points-round-two`);
    localStorage.removeItem(`${category}-TriviaWon-round-two`);
    localStorage.removeItem(`${category}-AllCorrect-round-two`);
    localStorage.removeItem(`${category}-Results-round-two`);

    // Remove round three points, trivia won, all correct, and results from local storage
    localStorage.removeItem(`${category}-Points-round-three`);
    localStorage.removeItem(`${category}-TriviaWon-round-three`);
    localStorage.removeItem(`${category}-AllCorrect-round-three`);
    localStorage.removeItem(`${category}-Results-round-three`);

    // Remove current points from local storage
    localStorage.removeItem("currentPoints");
}
