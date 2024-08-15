import JSConfetti from "js-confetti";
import { calculateTheCurrentPoints } from "../calculateTheCurrentPoints";

/**
 * Handles the click event when the "Won" button is clicked.
 *
 * @param {number | null} timerInterval - The interval ID of the timer.
 * @param {string} pointsRoundName - The name of the key in localStorage that stores the points earned in Round.
 * @param {string} allCorrectRoundName - The name of the key in localStorage that stores whether all questions in Round were answered correctly.
 * @param {string} triviaRoundWonName - The name of the key in localStorage that stores whether Round was won.
 * @param {string} category - The category of the trivia round.
 */
export function handleWonClick(timerInterval: number | null, pointsRoundName: string, allCorrectRoundName: string, triviaRoundWonName: string,  category: string) {
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
  const triviaRound1Won = localStorage.getItem(`${category}-TriviaWon-round-one`) === "true";
  const triviaRound2Won = localStorage.getItem(`${category}-TriviaWon-round-two`) === "true";
  const triviaRound3Won = localStorage.getItem(`${category}-TriviaWon-round-three`) === "true";
  const allCorrectRound1 = localStorage.getItem(`${category}-AllCorrect-round-one`) === "true";
  const allCorrectRound2 = localStorage.getItem(`${category}-AllCorrect-round-two`) === "true";
  const allCorrectRound3 = localStorage.getItem(`${category}-AllCorrect-round-three`) === "true";

  // Check if the user has earned 0 points in the round
  const hasZeroPoints = pointsRound === 0;

  // If the user has earned 0 points, add 50 points to the total points
  // Otherwise, keep the points as is
  const points = hasZeroPoints ? pointsRound + 50 : pointsRound;

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
  pointsDiv.textContent = `+ ${points} Pt`;

  // Set the value of another key in localStorage to indicate whether all rounds and trivia were won
  localStorage.setItem("WonPopRockBrain", String(allRoundAndTriviaWon ? "true" : "false"));
  localStorage.setItem("WonBrainFrame", String(allRoundAndTriviaWon ? "true" : "false"));

  // Call the `calculateTheCurrentPoints` function
  calculateTheCurrentPoints(category);
}
