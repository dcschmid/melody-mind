
/**
 * Resets the local storage for a given category, setting all points, results, and trivia won flags to their default values.
 *
 * @param {string} category - The category for which to reset the local storage.
 * @return {void}
 */
export function resetLocalStorage(category: string): void {
  if (localStorage.getItem(`${category}-Points-round-one`) === null) {
    localStorage.setItem(`${category}-Points-round-one`, String(0)); // Set the value to 0 if it does not exist
  } else {
    localStorage.setItem(`${category}-Points-round-one`, String(0)); // Set the value to 0
  }

  if (localStorage.getItem(`${category}-Points-round-two`) === null) {
    localStorage.setItem(`${category}-Points-round-two`, String(0)); // Set the value to 0 if it does not exist
  } else {
    localStorage.setItem(`${category}-Points-round-two`, String(0)); // Set the value to 0
  }

  if (localStorage.getItem(`${category}-Points-round-three`) === null) {
    localStorage.setItem(`${category}-Points-round-three`, String(0)); // Set the value to 0 if it does not exist
  } else {
    localStorage.setItem(`${category}-Points-round-three`, String(0)); // Set the value to 0
  }

  if (localStorage.getItem(`${category}-Results-round-one`) === null) {
    localStorage.setItem(`${category}-Results-round-one`, String("")); // Set the value to an empty string if it does not exist
  } else {
    localStorage.setItem(`${category}-Results-round-one`, String("")); // Set the value to an empty string
  }

  if (localStorage.getItem(`${category}-Results-round-two`) === null) {
    localStorage.setItem(`${category}-Results-round-two`, String("")); // Set the value to an empty string if it does not exist
  } else {
    localStorage.setItem(`${category}-Results-round-two`, String("")); // Set the value to an empty string
  }

  if (localStorage.getItem(`${category}-Results-round-three`) === null) {
    localStorage.setItem(`${category}-Results-round-three`, String("")); // Set the value to an empty string if it does not exist
  } else {
    localStorage.setItem(`${category}-Results-round-three`, String("")); // Set the value to an empty string
  }

  if (localStorage.getItem(`${category}-AllCorrect-round-one`) === null) {
    localStorage.setItem(`${category}-AllCorrect-round-one`, String(false)); // Set the value to false if it does not exist
  } else {
    localStorage.setItem(`${category}-AllCorrect-round-one`, String(false)); // Set the value to false
  }

  if (localStorage.getItem(`${category}-AllCorrect-round-two`) === null) {
    localStorage.setItem(`${category}-AllCorrect-round-two`, String(false)); // Set the value to false if it does not exist
  } else {
    localStorage.setItem(`${category}-AllCorrect-round-two`, String(false)); // Set the value to false
  }

  if (localStorage.getItem(`${category}-AllCorrect-round-three`) === null) {
    localStorage.setItem(`${category}-AllCorrect-round-three`, String(false)); // Set the value to false if it does not exist
  } else {
    localStorage.setItem(`${category}-AllCorrect-round-three`, String(false)); // Set the value to false
  }

  if (localStorage.getItem(`${category}-TriviaWon-round-one`) === null) {
    localStorage.setItem(`${category}-TriviaWon-round-one`, String(false)); // Set the value to false if it does not exist
  } else {
    localStorage.setItem(`${category}-TriviaWon-round-one`, String(false)); // Set the value to false
  }

  if (localStorage.getItem(`${category}-TriviaWon-round-two`) === null) {
    localStorage.setItem(`${category}-TriviaWon-round-two`, String(false)); // Set the value to false if it does not exist
  } else {
    localStorage.setItem(`${category}-TriviaWon-round-two`, String(false)); // Set the value to false
  }

  if (localStorage.getItem(`${category}-TriviaWon-round-three`) === null) {
    localStorage.setItem(`${category}-TriviaWon-round-three`, String(false)); // Set the value to false if it does not exist
  } else {
    localStorage.setItem(`${category}-TriviaWon-round-three`, String(false)); // Set the value to false
  }

  // Reset 'currentPoints' item
  if (localStorage.getItem("currentPoints") === null) {
    localStorage.setItem("currentPoints", String(0)); // Set the value to 0 if it does not exist
  } else {
    localStorage.setItem("currentPoints", String(0)); // Set the value to 0
  }
}
