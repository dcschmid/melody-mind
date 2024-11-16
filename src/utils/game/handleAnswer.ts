/**
 * @fileoverview Handles the game answer logic and scoring system
 */

import { stopAudio } from "@utils/audio/audioControls";
import { updateScoreDisplay } from "./scoreUtils";
import { getRandomQuestion } from "./getRandomQuestion";
import { loadQuestion, type Question } from "./loadQuestion";
import type { MediaElements } from "./mediaUtils";
import { updateMedia } from "./mediaUtils";

/**
 * Configuration interface for the answer handler
 * @interface HandleAnswerConfig
 */
interface HandleAnswerConfig {
  /** Element to display feedback messages */
  feedbackElement: HTMLParagraphElement;
  /** Element to display the current score */
  scoreElement: HTMLParagraphElement;
  /** Image element for the album cover overlay */
  overlayCover: HTMLImageElement;
  /** Optional media elements for audio playback */
  mediaElements: MediaElements | null;
  /** Element to display the current round */
  roundElement: HTMLParagraphElement;
  /** Current question object */
  currentQuestion: Question | null;
  /** Current round index */
  roundIndex: number;
  /** Total number of rounds in the game */
  totalRounds: number;
  /** Current game score */
  score: number;
  /** Game difficulty setting */
  difficulty: "easy" | "medium" | "hard" | null;
  /** Array of available albums */
  albums: any[];
  /** Question configuration settings */
  questionConfig: any;
  /** Callback function to end the game */
  endGame: () => void;
}

/**
 * Constants for bonus points based on answer speed
 */
const BONUS_POINTS = {
  /** Bonus points for answering within 10 seconds */
  FAST: 50,
  /** Bonus points for answering within 15 seconds */
  MEDIUM: 25,
  /** No bonus points */
  NONE: 0,
} as const;

/** Base points awarded for correct answers */
const BASE_POINTS = 50;
/** Timeout duration for feedback messages in milliseconds */
const FEEDBACK_TIMEOUT = 5000;

/**
 * Creates an answer handler function with the given configuration
 * @param config - Configuration object for the answer handler
 * @returns A function that handles answer submission and scoring
 */
export function createHandleAnswer(config: HandleAnswerConfig) {
  /**
   * Handles the user's answer submission and updates game state
   * @param option - The selected answer option
   * @param correctAnswer - The correct answer
   * @param currentQuestion - The current question object
   * @param album - The current album object
   */
  return function handleAnswer(
    option: string,
    correctAnswer: string,
    currentQuestion: { trivia: string },
    album: { coverSrc: string; artist: string; album: string; year: string },
  ) {
    // Calculate time taken to answer
    const timeTaken = (Date.now() - Date.now()) / 1000;

    /**
     * Calculates bonus points based on answer time
     * @param time - Time taken to answer in seconds
     * @returns Number of bonus points awarded
     */
    const calculateBonus = (time: number): number => {
      if (time <= 10) return BONUS_POINTS.FAST;
      if (time <= 15) return BONUS_POINTS.MEDIUM;
      return BONUS_POINTS.NONE;
    };

    // Calculate points
    const bonusPoints =
      option === correctAnswer ? calculateBonus(timeTaken) : 0;
    const totalPoints =
      option === correctAnswer ? BASE_POINTS + bonusPoints : 0;

    // Update feedback display
    const feedbackClass = option === correctAnswer ? "correct" : "incorrect";
    const feedbackText =
      option === correctAnswer
        ? `Richtig! ${BASE_POINTS} Punkte + ${bonusPoints} Bonuspunkte`
        : `Falsch! Die richtige Antwort war: ${correctAnswer}`;

    config.feedbackElement.classList.add(feedbackClass, "show");
    config.feedbackElement.textContent = feedbackText;

    // Hide feedback after timeout
    setTimeout(() => {
      config.feedbackElement.classList.remove("show", "correct", "incorrect");
    }, FEEDBACK_TIMEOUT);

    // Update score
    config.score += totalPoints;
    updateScoreDisplay(config.score, config.scoreElement);

    // Update overlay information
    config.overlayCover.src = album.coverSrc || "";
    document.getElementById("overlay-artist")!.textContent = album.artist || "";
    document.getElementById("overlay-album")!.textContent = album.album || "";
    document.getElementById("overlay-funfact")!.textContent =
      currentQuestion.trivia || "";
    document.getElementById("overlay-year")!.textContent = album.year || "";

    // Update media if available
    if (config.mediaElements) {
      updateMedia(album, config.mediaElements);
    }

    // Show overlay
    const overlay = document.getElementById("overlay") as HTMLDivElement;
    overlay.classList.remove("hidden");

    // Setup next round button
    const nextRoundButton = document.getElementById(
      "next-round-button",
    ) as HTMLButtonElement;

    nextRoundButton.onclick = function () {
      stopAudio();
      overlay.classList.add("hidden");
      if (config.roundIndex < config.totalRounds - 1) {
        // Proceed to next round
        config.roundIndex++;
        config.roundElement.textContent = `${config.roundIndex + 1}/${config.totalRounds}`;

        const newQuestion = getRandomQuestion(
          config.albums,
          config.difficulty || "easy",
          config.totalRounds,
        );
        if (newQuestion) {
          config.currentQuestion = loadQuestion(
            newQuestion.randomQuestion,
            newQuestion.randomAlbum,
            config.questionConfig,
          );
        }
      } else {
        // End game if all rounds are completed
        config.endGame();
      }
    };
  };
}
