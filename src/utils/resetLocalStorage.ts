/**
 * Resets the localStorage by setting the 'PointsRound1', 'PointsRound2', 'PointsRound3',
 * 'currentPoints', 'ResultsRound1', 'ResultsRound2', and 'ResultsRound3' items to 0 or an empty string,
 * depending on their initial existence in localStorage.
 *
 * @return {void} This function does not return anything.
 */
export function resetLocalStorage() {
    // The 'PointsRound1' item stores the points earned in Round 1.
    // If the item does not exist in localStorage, it means that the user has not played Round 1 yet,
    // so we set it to 0.
    if (localStorage.getItem("PointsRound1") === null) {
      // Set the 'PointsRound1' item to 0 if it does not exist in localStorage
      localStorage.setItem("PointsRound1", String(0));
    } else {
      // Set the 'PointsRound1' item to 0 if it exists in localStorage
      localStorage.setItem("PointsRound1", String(0));
    }

    // The 'PointsRound2' item stores the points earned in Round 2.
    // If the item does not exist in localStorage, it means that the user has not played Round 2 yet,
    // so we set it to 0.
    if (localStorage.getItem("PointsRound2") === null) {
      // Set the 'PointsRound1' item to 0 if it does not exist in localStorage
      localStorage.setItem("PointsRound2", String(0));
    } else {
      // Set the 'PointsRound1' item to 0 if it exists in localStorage
      localStorage.setItem("PointsRound2", String(0));
    }

    // The 'PointsRound3' item stores the points earned in Round 3.
    // If the item does not exist in localStorage, it means that the user has not played Round 3 yet,
    // so we set it to 0.
    if (localStorage.getItem("PointsRound3") === null) {
      // Set the 'PointsRound1' item to 0 if it does not exist in localStorage
      localStorage.setItem("PointsRound3", String(0));
    } else {
      // Set the 'PointsRound1' item to 0 if it exists in localStorage
      localStorage.setItem("PointsRound3", String(0));
    }

    // The 'currentPoints' item stores the points earned in the current game round.
    // If the item does not exist in localStorage, it means that the user has not played any game yet,
    // so we set it to 0.
    if (localStorage.getItem("currentPoints") === null) {
      // Set the 'PointsRound1' item to 0 if it does not exist in localStorage
      localStorage.setItem("currentPoints", String(0));
    } else {
      // Set the 'PointsRound1' item to 0 if it exists in localStorage
      localStorage.setItem("currentPoints", String(0));
    }

    // The 'ResultsRound1' item stores the results of Round 1.
    // If the item does not exist in localStorage, it means that the user has not played Round 1 yet.
    if (localStorage.getItem("ResultsRound1") === null) {
      // Set the 'ResultsRound1' item to 0 if it does not exist in localStorage
      localStorage.setItem("ResultsRound1", String(""));
    } else {
      // Set the 'ResultsRound1' item to 0 if it exists in localStorage
      localStorage.setItem("ResultsRound1", String(""));
    }

    // The 'ResultsRound2' item stores the results of Round 2.
    // If the item does not exist in localStorage, it means that the user has not played Round 2 yet.
    if (localStorage.getItem("ResultsRound2") === null) {
      // Set the 'ResultsRound2' item to 0 if it does not exist in localStorage
      localStorage.setItem("ResultsRound2", String(""));
    } else {
      // Set the 'ResultsRound2' item to 0 if it exists in localStorage
      localStorage.setItem("ResultsRound2", String(""));
    }

    // The 'ResultsRound3' item stores the results of Round 3.
    // If the item does not exist in localStorage, it means that the user has not played Round 3 yet.
    if (localStorage.getItem("ResultsRound3") === null) {
      // Set the 'ResultsRound3' item to 0 if it does not exist in localStorage
      localStorage.setItem("ResultsRound3", String(""));
    } else {
      // Set the 'ResultsRound3' item to 0 if it exists in localStorage
      localStorage.setItem("ResultsRound3", String(""));
    }
  }
