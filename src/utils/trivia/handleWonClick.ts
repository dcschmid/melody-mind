import JSConfetti from "js-confetti";
import { calculateTheCurrentPoints } from "../calculateTheCurrentPoints";

/**
 * Handles the click event when the "Won" button is clicked.
 * This function performs the following actions:
 * - Clears the timer interval.
 * - Hides the timer overlay.
 * - Retrieves the points earned in Round from localStorage.
 * - Retrieves whether all questions in Round were answered correctly from localStorage.
 * - Determines the overlay element to be displayed based on the round and question status.
 * - Sets the visibility of the chosen overlay element to "visible".
 * - Displays the points earned in the chosen overlay element.
 * - Sets the value of a key in localStorage to indicate that Round was won.
 * - Sets the value of another key in localStorage to indicate whether all rounds and trivia were won.
 * - Calls the `calculateTheCurrentPoints` function.
 *
 * @param {number | null} timerInterval - The interval ID of the timer.
 * @param {string} pointsRoundName - The name of the key in localStorage that stores the points earned in Round.
 * @param {string} allCorrectRoundName - The name of the key in localStorage that stores whether all questions in Round were answered correctly.
 * @param {string} triviaRoundWonName - The name of the key in localStorage that stores whether Round was won.
 */
export function handleWonClick(timerInterval: number | null, pointsRoundName: string, allCorrectRoundName: string, triviaRoundWonName: string) {
  // Create a new instance of JSConfetti
  const jsConfetti = new JSConfetti();

  // Get the timer overlay element
  const overlayTimeUp = document.getElementById("timupsOverlay") as HTMLElement;

  // Get the overlay elements for displaying the "Won" message
  const overlayWon = document.getElementById("overlayWon") as HTMLElement;
  const overlayWonLP = document.getElementById("overlayWonLP") as HTMLElement;
  const overlayWonLPSpecial = document.getElementById("overlayWonLPSpecial") as HTMLElement;

  // Clear the timer interval
  clearInterval(timerInterval!);

  // Hide the timer overlay
  overlayTimeUp.style.visibility = "hidden";

  // Retrieve the points earned in Round from localStorage
  const pointsRound = parseInt(localStorage.getItem(pointsRoundName) || "0", 10);

  // Retrieve whether all questions in Round were answered correctly from localStorage
  const allCorrectRound = localStorage.getItem(allCorrectRoundName) === "true";

  // Set the value of a key in localStorage to indicate that Round was won
  localStorage.setItem(triviaRoundWonName, String("true"));

  // Retrieve the values of keys in localStorage that store whether each round was won and whether all questions in each round were answered correctly
  const triviaRound1Won = localStorage.getItem("triviaRound1Won") === "true";
  const triviaRound2Won = localStorage.getItem("triviaRound2Won") === "true";
  const triviaRound3Won = localStorage.getItem("triviaRound3Won") === "true";
  const allCorrectRound1 = localStorage.getItem("allCorrectRound1") === "true";
  const allCorrectRound2 = localStorage.getItem("allCorrectRound2") === "true";
  const allCorrectRound3 = localStorage.getItem("allCorrectRound3") === "true";

  // Determine whether all rounds and trivia were won
  const allRoundAndTriviaWon =
    triviaRound1Won && triviaRound2Won && triviaRound3Won && allCorrectRound1 && allCorrectRound2 && allCorrectRound3;

  // Determine the overlay element to be displayed based on the round and question status
  const overlayWonElement = allRoundAndTriviaWon ? overlayWonLPSpecial : allCorrectRound ? overlayWonLP : overlayWon;

  // Set the visibility of the chosen overlay element to "visible"
  overlayWonElement.style.visibility = "visible";

  // Call the jsConfetti function
  jsConfetti.addConfetti().then(() => jsConfetti.clearCanvas());

  // Display the points earned in the chosen overlay element
  const pointsDiv = overlayWonElement.querySelector(".point") as HTMLElement;
  pointsDiv.textContent = `+ ${pointsRound} Pt`;

  // Set the value of another key in localStorage to indicate whether all rounds and trivia were won
  localStorage.setItem("WonPopRockBrain", String(allRoundAndTriviaWon ? "true" : "false"));
  localStorage.setItem("WonBrainFrame", String(allRoundAndTriviaWon ? "true" : "false"));

  // Call the `calculateTheCurrentPoints` function
  calculateTheCurrentPoints();
}
