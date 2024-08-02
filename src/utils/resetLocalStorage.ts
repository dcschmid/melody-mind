/**
 * Resets all the local storage items related to the game rounds and trivia rounds.
 * The items being reset include 'PointsRound1', 'PointsRound2', 'PointsRound3', 'currentPoints',
 * 'ResultsRound1', 'ResultsRound2', 'ResultsRound3', 'allCorrectRound1', 'allCorrectRound2',
 * 'allCorrectRound3', 'triviaRound1Won', 'triviaRound2Won', and 'triviaRound3Won'.
 *
 * This function checks if each item exists in local storage, and if it does, it sets its value to the default value.
 * If the item does not exist, it creates a new item with the default value.
 *
 * @return {void}
 */
export function resetLocalStorage() {
  // Reset 'PointsRound1' item
  if (localStorage.getItem("PointsRound1") === null) {
    localStorage.setItem("PointsRound1", String(0));
  } else {
    localStorage.setItem("PointsRound1", String(0));
  }

  // Reset 'PointsRound2' item
  if (localStorage.getItem("PointsRound2") === null) {
    localStorage.setItem("PointsRound2", String(0));
  } else {
    localStorage.setItem("PointsRound2", String(0));
  }

  // Reset 'PointsRound3' item
  if (localStorage.getItem("PointsRound3") === null) {
    localStorage.setItem("PointsRound3", String(0));
  } else {
    localStorage.setItem("PointsRound3", String(0));
  }

  // Reset 'currentPoints' item
  if (localStorage.getItem("currentPoints") === null) {
    localStorage.setItem("currentPoints", String(0));
  } else {
    localStorage.setItem("currentPoints", String(0));
  }

  // Reset 'ResultsRound1' item
  if (localStorage.getItem("ResultsRound1") === null) {
    localStorage.setItem("ResultsRound1", String(""));
  } else {
    localStorage.setItem("ResultsRound1", String(""));
  }

  // Reset 'ResultsRound2' item
  if (localStorage.getItem("ResultsRound2") === null) {
    localStorage.setItem("ResultsRound2", String(""));
  } else {
    localStorage.setItem("ResultsRound2", String(""));
  }

  // Reset 'ResultsRound3' item
  if (localStorage.getItem("ResultsRound3") === null) {
    localStorage.setItem("ResultsRound3", String(""));
  } else {
    localStorage.setItem("ResultsRound3", String(""));
  }

  // Reset 'allCorrectRound1' item
  if (localStorage.getItem("allCorrectRound1") === null) {
    localStorage.setItem("allCorrectRound1", String(false));
  } else {
    localStorage.setItem("allCorrectRound1", String(false));
  }

  // Reset 'allCorrectRound2' item
  if (localStorage.getItem("allCorrectRound2") === null) {
    localStorage.setItem("allCorrectRound2", String(false));
  } else {
    localStorage.setItem("allCorrectRound2", String(false));
  }

  // Reset 'allCorrectRound3' item
  if (localStorage.getItem("allCorrectRound3") === null) {
    localStorage.setItem("allCorrectRound3", String(false));
  } else {
    localStorage.setItem("allCorrectRound3", String(false));
  }

    // Reset 'triviaRound1Won' item
  if (localStorage.getItem("triviaRound1Won") === null) {
    localStorage.setItem("triviaRound1Won", String(false));
  } else {
    localStorage.setItem("triviaRound1Won", String(false));
  }

    // Reset 'triviaRound2Won' item
  if (localStorage.getItem("triviaRound2Won") === null) {
    localStorage.setItem("triviaRound2Won", String(false));
  } else {
    localStorage.setItem("triviaRound2Won", String(false));
  }

   // Reset 'triviaRound3Won' item
  if (localStorage.getItem("triviaRound3Won") === null) {
    localStorage.setItem("triviaRound3Won", String(false));
  } else {
    localStorage.setItem("triviaRound3Won", String(false));
  }
}
