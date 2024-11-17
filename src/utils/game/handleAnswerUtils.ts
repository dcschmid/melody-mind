import { updateScoreDisplay } from "./scoreUtils";
import { updateMedia } from "./mediaUtils";

/**
 * Interface representing media-related elements of an album
 * @interface MediaElements
 * @property {string} coverSrc - URL of the album cover image
 * @property {string} artist - Name of the artist
 * @property {string} album - Name of the album
 * @property {string} year - Release year of the album
 */
interface MediaElements {
  coverSrc: string;
  artist: string;
  album: string;
  year: string;
}

/**
 * Configuration interface for handling answer submissions
 * @interface HandleAnswerConfig
 * @property {string} option - The selected answer option
 * @property {string} correctAnswer - The correct answer
 * @property {{ trivia: string }} currentQuestion - Current question data with trivia
 * @property {MediaElements} album - Album media information
 * @property {Object} elements - DOM elements used in the game
 * @property {HTMLParagraphElement} elements.feedbackElement - Element for displaying feedback
 * @property {HTMLParagraphElement} elements.scoreElement - Element for displaying score
 * @property {HTMLImageElement} elements.overlayCover - Element for album cover in overlay
 * @property {HTMLDivElement} elements.overlay - Overlay container element
 * @property {any} [elements.mediaElements] - Optional media elements
 * @property {Object} state - Current game state
 * @property {number} state.score - Current score
 * @property {number} state.roundIndex - Current round index
 * @property {number} state.totalRounds - Total number of rounds
 * @property {HTMLParagraphElement} state.roundElement - Element for displaying round information
 */
interface HandleAnswerConfig {
  option: string;
  correctAnswer: string;
  currentQuestion: { trivia: string };
  album: MediaElements;
  elements: {
    feedbackElement: HTMLParagraphElement;
    scoreElement: HTMLParagraphElement;
    overlayCover: HTMLImageElement;
    overlay: HTMLDivElement;
    mediaElements?: any;
  };
  state: {
    score: number;
    roundIndex: number;
    totalRounds: number;
    roundElement: HTMLParagraphElement;
  };
}

/**
 * Handles the user's answer submission in the game
 * @param {HandleAnswerConfig} config - Configuration object containing all necessary data
 * @returns {number} Updated score after handling the answer
 *
 * @description
 * This function:
 * - Calculates time-based bonus points
 * - Updates the score based on correct/incorrect answers
 * - Displays feedback to the user
 * - Updates the overlay with album information
 * - Updates media elements if provided
 */
export function handleAnswer(config: HandleAnswerConfig) {
  const startTime = Date.now();
  const endTime = Date.now();
  const timeTaken = (endTime - startTime) / 1000;
  let totalPoints = 0;
  let bonusPoints = 0;

  const { option, correctAnswer, currentQuestion, album, elements, state } =
    config;
  const {
    feedbackElement,
    scoreElement,
    overlayCover,
    overlay,
    mediaElements,
  } = elements;

  if (option === correctAnswer) {
    bonusPoints = timeTaken <= 10 ? 50 : timeTaken <= 15 ? 25 : 0;
    totalPoints = 50 + bonusPoints;
    feedbackElement.classList.add("correct");
    feedbackElement.textContent = `Richtig! 50 Punkte + ${bonusPoints} Bonuspunkte`;
  } else {
    feedbackElement.classList.add("incorrect");
    feedbackElement.textContent = `Falsch! Die richtige Antwort war: ${correctAnswer}`;
  }

  feedbackElement.classList.add("show");

  setTimeout(() => {
    feedbackElement.classList.remove("show", "correct", "incorrect");
  }, 5000);

  state.score += totalPoints;
  updateScoreDisplay(state.score, scoreElement);

  // Update overlay elements
  overlayCover.src = album.coverSrc || "";
  document.getElementById("overlay-artist")!.textContent = album.artist || "";
  document.getElementById("overlay-album")!.textContent = album.album || "";
  document.getElementById("overlay-funfact")!.textContent =
    currentQuestion.trivia || "";
  document.getElementById("overlay-year")!.textContent = album.year || "";

  if (mediaElements) {
    updateMedia(album, mediaElements);
  }

  overlay.classList.remove("hidden");

  return state.score;
}
