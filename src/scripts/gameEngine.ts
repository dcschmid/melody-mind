/**
 * Music Quiz Game Engine
 *
 * This module provides the core functionality for the music trivia game, including:
 * - Loading questions from language-specific files with fallback mechanisms
 * - Managing user interactions and scoring logic
 * - Tracking game state and progress through multiple rounds
 * - Providing audio-visual feedback for user actions
 * - Ensuring WCAG AAA compliance with full screen reader support
 * - Supporting achievement tracking and seasonal events
 * - Keyboard shortcuts for faster gameplay
 * - Timer announcements for speed bonuses
 *
 * @module MelodyMindGameEngine
 */
import { initKeyboardShortcuts } from "../utils/accessibility/keyboardShortcuts";
import { startSpeedBonusTimer, clearSpeedBonusTimers } from "../utils/accessibility/timerAnnouncer";
import { stopAudio } from "../utils/audio/audioControls";
import { ErrorHandler } from "../utils/error/errorHandler";
import { handleEndGame, restartGame } from "../utils/game/endGameUtils";
import { getRandomQuestion } from "../utils/game/getRandomQuestion";
import type { Album } from "../utils/game/getRandomQuestion";
import { handleAnswer } from "../utils/game/handleAnswerUtils";
import { JokerManager } from "../utils/game/jokerManager";
import { Difficulty } from "../utils/game/jokerUtils";
import { loadQuestion } from "../utils/game/loadQuestionUtils";
import { initializeMediaElements } from "../utils/game/mediaUtils";
import { getLangFromUrl, useTranslations } from "../utils/i18n";
import { QueueManager } from "../utils/queue/queueManager";

// Dynamically imported to avoid issues with SSR
let achievementEventSystem: any;

// For achievement tracking
declare global {
  interface Window {
    questionStartTime?: number;
    lastAnswerTime?: number;
    lastAnswerCorrect?: boolean;
    currentEventId?: string;
    speedBonusTimer?: number;
    speedBonusThresholds?: {
      high: number; // Time in ms for high bonus (e.g., 10s)
      medium: number; // Time in ms for medium bonus (e.g., 15s)
    };
  }
}

// Speed bonus thresholds in milliseconds
const SPEED_BONUS_HIGH = 10000; // 10 seconds
const SPEED_BONUS_MEDIUM = 15000; // 15 seconds

// TimeoutID for the speed bonus timer
const speedBonusTimerId: number | null = null;

// TimeoutIDs for the speed bonus announcements
const speedBonusWarningTimerId: number | null = null;
const speedBonusExpiredTimerId: number | null = null;

/**
 * Configuration constants for number of rounds based on difficulty level
 * @constant {Object} ROUNDS_PER_DIFFICULTY - Maps difficulty levels to question counts
 */
const ROUNDS_PER_DIFFICULTY = {
  [Difficulty.EASY]: 10,
  [Difficulty.MEDIUM]: 15,
  [Difficulty.HARD]: 20,
} as const;

/**
 * Interface for DOM elements needed by the game engine
 * Provides type safety for DOM element references used throughout the game
 *
 * @interface GameElements
 */
interface GameElements {
  score: HTMLParagraphElement;
  round: HTMLParagraphElement;
  feedback: HTMLParagraphElement;
  question: HTMLParagraphElement;
  options: HTMLDivElement;
  container: HTMLDivElement;
  overlay: HTMLDivElement;
  jokerButton: HTMLButtonElement;
  jokerCounter: HTMLElement;
  nextRoundButton: HTMLButtonElement;
  restartButton: HTMLButtonElement;
  loadingSpinner: HTMLElement;
}

/**
 * Validates and normalizes the difficulty level from URL parameters
 * Ensures the game always has a valid difficulty setting even with invalid input
 *
 * @param {string|null} diff - The difficulty string from URL parameters
 * @returns {Difficulty} A validated difficulty level (defaulting to EASY if invalid)
 */
const validateDifficulty = (diff: string | null): Difficulty => {
  if (diff === "easy") {
    return Difficulty.EASY;
  }
  if (diff === "medium") {
    return Difficulty.MEDIUM;
  }
  if (diff === "hard") {
    return Difficulty.HARD;
  }
  return Difficulty.EASY;
};

/**
 * Caches DOM elements to avoid repeated queries and improve performance
 * This pattern reduces DOM lookups and improves rendering efficiency
 *
 * @returns {GameElements} Object containing references to all required game DOM elements
 */
function cacheElements(): GameElements {
  const elements = {
    score: document.querySelector(".coinsCount") as HTMLParagraphElement,
    round: document.querySelector(".round") as HTMLParagraphElement,
    feedback: document.getElementById("feedback") as HTMLParagraphElement,
    question: document.getElementById("question") as HTMLParagraphElement,
    options: document.getElementById("options") as HTMLDivElement,
    container: document.getElementById("question-container") as HTMLDivElement,
    overlay: document.getElementById("overlay") as HTMLDivElement,
    jokerButton: document.getElementById("joker-button") as HTMLButtonElement,
    jokerCounter: document.getElementById("joker-count") as HTMLElement,
    nextRoundButton: document.getElementById("next-round-button") as HTMLButtonElement,
    restartButton: document.getElementById("restart-button") as HTMLButtonElement,
    loadingSpinner: document.getElementById("loading-spinner") as HTMLElement,
  };

  return elements;
}

/**
 * Main game initialization function
 * Sets up the game state, loads questions, and handles game progression
 *
 * @async
 * @param {GameElements} elements - Cached DOM elements required for the game
 */
const initializeGame = async (elements: GameElements) => {
  // Dynamically import achievement event system
  try {
    // Use dynamic import to avoid SSR issues
    const { initAchievementEventSystem } = await import(
      "../utils/achievements/achievementEvents.js"
    );
    initAchievementEventSystem();
    console.log("Achievement Event System initialized for Game Mode");
  } catch (error) {
    console.error("Error initializing Achievement Event System:", error);
  }

  // Start processing any queued operations
  QueueManager.startProcessing();

  if (!elements.container) {
    console.error("Game container element not found");
    return;
  }

  /**
   * Extract game parameters from data attributes
   * These attributes control game configuration and player identification
   */
  const category = elements.container.getAttribute("data-genre");
  const userId = elements.container.getAttribute("data-userID");
  const categoryName = elements.container.getAttribute("data-categoryName");
  const difficulty = elements.container.getAttribute("data-difficulty");

  /**
   * Check for seasonal events based on current date
   * This enables special achievements and themed content
   */
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1; // 1-12

  // Examples of seasonal event detection
  if (month === 12) {
    window.currentEventId = "winter_2025";
  } else if (month >= 6 && month <= 8) {
    window.currentEventId = "summer_2025";
  }

  /**
   * Initialize game state variables
   * These track the player's progress and performance
   */
  let score = 0;
  let correctAnswers = 0;
  let roundIndex = 0;
  const totalRounds =
    ROUNDS_PER_DIFFICULTY[validateDifficulty(difficulty)] ?? ROUNDS_PER_DIFFICULTY.easy;

  // Update UI with initial round
  if (elements.round) {
    elements.round.textContent = `${roundIndex + 1}/${totalRounds}`;
  }

  /**
   * Load albums data for the selected category with language fallback
   * Attempts to load in the user's language first, then falls back to German
   *
   * @type {Album[] | null} albums - Collection of album data for questions
   */
  let albums: Album[] | null = null;

  // Get current language based on URL
  const lang = getLangFromUrl(new URL(window.location.pathname, window.location.origin));
  const t = useTranslations(lang);

  try {
    let albumsData;

    try {
      // Try to load albums for the current language first
      const response = await fetch(`/json/genres/${String(lang)}/${String(category)}.json`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      albumsData = await response.json();
    } catch (langError) {
      // Fallback to German if the specific language file doesn't exist
      console.log(`No albums found for ${lang}/${category}, falling back to German`);

      const fallbackResponse = await fetch(`/json/genres/de/${category}.json`);

      if (!fallbackResponse.ok) {
        throw new Error(`HTTP error for fallback! Status: ${fallbackResponse.status}`);
      }

      albumsData = await fallbackResponse.json();
    }

    // Ensure albumsData is an array
    if (!Array.isArray(albumsData)) {
      console.error("Loaded albums data is not an array:", albumsData);
      // If it's an object with an albums property that is an array, use that
      if (albumsData && typeof albumsData === "object" && Array.isArray(albumsData.albums)) {
        albumsData = albumsData.albums;
      } else {
        // Otherwise, initialize with an empty array
        albumsData = [];
      }
    }

    albums = albumsData;

    if (!albums?.length) {
      throw new Error(t("error.no.albums.found"));
    }
  } catch (error) {
    console.error("Error loading albums:", error);
    ErrorHandler.handleApiError(error instanceof Error ? error : new Error(String(error)));
    return;
  }

  let currentQuestion: any = null;

  /**
   * Initialize joker system based on the difficulty level
   * The joker allows players to eliminate incorrect answers
   */
  const jokerManager = new JokerManager({
    difficulty: validateDifficulty(difficulty) as Difficulty,
    elements: {
      jokerButton: elements.jokerButton,
      jokerCounter: elements.jokerCounter,
    },
  });

  /**
   * Initialize media players for audio feedback
   * Provides sound effects for correct/incorrect answers
   */
  const mediaElements = initializeMediaElements();
  if (!mediaElements) {
    console.error("Media elements could not be initialized");
    return;
  }

  /**
   * Updates the coin display with an animation for visual feedback
   * Provides both visual and auditory feedback for screen readers
   *
   * @param {number} newScore - The new score to display
   */
  function updateCoinsDisplay(newScore: number) {
    // Use requestAnimationFrame for smoother UI updates
    requestAnimationFrame(() => {
      const coinsDisplay = document.getElementById("coins-display");
      if (coinsDisplay) {
        // Apply animation class for visual feedback
        coinsDisplay.classList.add("coins-updated");
        coinsDisplay.textContent = newScore.toString();

        // Announce score change for screen readers
        const announcement = document.createElement("div");
        announcement.setAttribute("aria-live", "assertive");
        announcement.classList.add("sr-only");
        announcement.textContent = `New score: ${newScore} points`;
        document.body.appendChild(announcement);

        // Remove animation class and announcement after they complete
        setTimeout(() => {
          coinsDisplay.classList.remove("coins-updated");
          announcement.remove();
        }, 1500);
      }
    });
  }

  /**
   * Handles the player's answer, updates score, and manages game progression
   * Tracks performance for achievement system and provides feedback
   *
   * @param {any} option - The player's selected answer
   * @param {any} correctAnswer - The correct answer for the question
   * @param {object} currentQuestion - The current question object
   * @param {object} album - The album associated with the current question
   */
  function handleAnswerWrapper(
    option: any,
    correctAnswer: any,
    currentQuestion: { trivia: string },
    album: { coverSrc: string; artist: string; album: string; year: string }
  ) {
    // Save start time for achievement tracking and validate
    const answerTime = Date.now() - (window.questionStartTime || Date.now());
    // Ensure time is positive and realistic (max 60 seconds)
    window.lastAnswerTime = Math.min(Math.max(0, answerTime), 60000);
    window.lastAnswerCorrect = option === correctAnswer;

    // Clear speed bonus timer announcements once an answer is selected
    clearSpeedBonusTimers();

    // Process the answer and update the score
    score = handleAnswer({
      option,
      correctAnswer,
      currentQuestion,
      album,
      elements: {
        feedbackElement: elements.feedback,
        scoreElement: elements.score,
        overlay: elements.overlay,
        mediaElements: mediaElements || undefined,
      },
      state: {
        score,
        roundIndex,
        totalRounds,
        roundElement: elements.round,
      },
    });

    // Immediately update UI with visual feedback for correct answers
    if (option === correctAnswer) {
      correctAnswers++;
      updateCoinsDisplay(score);
    }

    /**
     * Setup handler for the next round button
     * Controls game flow between questions and at game end
     */
    elements.nextRoundButton.onclick = function () {
      stopAudio();
      elements.overlay.classList.add("hidden");

      if (roundIndex < totalRounds - 1) {
        // Load next question if rounds remain
        roundIndex++;

        if (elements.round) {
          elements.round.textContent = `${roundIndex + 1}/${totalRounds}`;
        }

        // Ensure albums is an array before calling getRandomQuestion
        const safeAlbums = Array.isArray(albums) ? albums : [];

        const newQuestion = getRandomQuestion(
          safeAlbums,
          validateDifficulty(difficulty),
          totalRounds
        );

        if (newQuestion) {
          loadNewQuestion(newQuestion.randomQuestion, newQuestion.randomAlbum);

          if (elements.feedback) {
            elements.feedback.textContent = "";
          }
        }
      } else {
        // End the game if all rounds are completed
        endGame();
      }
    };
  }

  /**
   * Handles the end of game, displays summary, and saves score
   * Triggers achievement checks and displays final results
   */
  function endGame() {
    const config = {
      userId: userId || "",
      categoryName: categoryName || "",
      difficulty: validateDifficulty(difficulty) || "easy",
      totalRounds,
      correctAnswers,
      score,
      language: lang,

      // Extended properties for achievement tracking
      genreId: category || "", // Category/genre ID for genre_explorer
      lastAnswerTime: typeof window.lastAnswerTime === "number" ? window.lastAnswerTime : undefined, // Last answer time for quick_answer
      lastAnswerCorrect:
        typeof window.lastAnswerCorrect === "boolean" ? window.lastAnswerCorrect : undefined, // Whether the last answer was correct
      eventId: window.currentEventId || undefined, // Event ID for seasonal_event

      // Debug flag for achievement tests
      debugAchievements: true,
      endOfSession: true, // End of game session for game_series
    };

    const ui = {
      showEndgamePopup: (score: number) => {
        const popup = document.getElementById("endgame-popup");

        if (popup) {
          // Use the enhanced showEndOverlay function for animations and setup
          if (
            (globalThis as { showEndOverlay?: (score: number, maxScore?: number) => void })
              .showEndOverlay
          ) {
            (globalThis as { showEndOverlay?: (score: number, maxScore?: number) => void })
              .showEndOverlay!(score);
          } else {
            // Fallback to basic display if enhanced function not available
            const scoreElement = popup.querySelector("#popup-score");
            if (scoreElement) {
              scoreElement.textContent = score.toString();
            }
          }
          popup.setAttribute("data-score", score.toString());
          popup.classList.remove("hidden");
        }
      },
    };

    handleEndGame(config, ui, {
      onError: (error) => {
        ErrorHandler.handleSaveError(error, "score", {
          userId: config.userId,
          category: config.categoryName,
        });
      },
    });
  }

  /**
   * Loads and displays a new question in the UI
   * Handles the transition between questions including animations
   *
   * @param {object} question - The question object to display
   * @param {object} album - The album associated with the question
   */
  function loadNewQuestion(question: any, album: any) {
    if (!question || !question.options) {
      console.error(t("error.invalid.question"));
      return;
    }

    // Save start time for achievement tracking
    window.questionStartTime = Date.now();

    // Start speed bonus timer with announcements
    startSpeedBonusTimer(lang);

    currentQuestion = question;
    jokerManager.setCurrentQuestion(question);

    loadQuestion({
      question,
      album,
      elements: {
        questionContainer: elements.container,
        spinner: elements.loadingSpinner,
        questionElement: elements.question,
        optionsContainer: elements.options,
      },
      handlers: {
        handleAnswer: handleAnswerWrapper,
      },
      jokerState: jokerManager.getCurrentJokerState(),
    });
  }

  // Add event listener for restart button
  elements.restartButton?.addEventListener("click", restartGame);

  /**
   * Load the first question to start the game
   * Initializes the game with the first random question
   */
  // Ensure albums is an array before calling getRandomQuestion
  const safeAlbums = Array.isArray(albums) ? albums : [];

  const initialQuestion = getRandomQuestion(
    safeAlbums,
    validateDifficulty(difficulty),
    totalRounds
  );

  if (initialQuestion?.randomQuestion && initialQuestion?.randomAlbum) {
    loadNewQuestion(initialQuestion.randomQuestion, initialQuestion.randomAlbum);
  } else {
    console.error(t("error.no.initial.question"));
  }

  /**
   * Warn before leaving if there's unsaved data
   * Prevents accidental data loss when navigating away
   */
  window.addEventListener("beforeunload", (e) => {
    if (QueueManager.hasUnsavedData()) {
      e.preventDefault();
    }
  });

  /**
   * Clean up resources when the page unloads
   * Ensures proper resource management and prevents memory leaks
   */
  // Clean up resources when the page unloads
  const cleanup = () => {
    stopAudio();
    QueueManager.stopProcessing();
    jokerManager.cleanup();
    clearSpeedBonusTimers();
    elements.restartButton?.removeEventListener("click", restartGame);
  };

  window.addEventListener("unload", cleanup);
};

/**
 * Enhances accessibility for dynamically created content
 * Adds proper ARIA labels and announcements for screen readers
 * Ensures the game is fully accessible to all users
 */
function enhanceAccessibility() {
  // Use event delegation for better performance
  document.addEventListener("focusin", (e) => {
    const target = e.target as HTMLElement;
    if (!target || !(target instanceof HTMLElement)) {
      return;
    }

    // Apply ARIA labels to option buttons
    if (target.matches("#options button") && !target.getAttribute("aria-label")) {
      const buttonText = target.textContent?.trim() || "";
      target.setAttribute("aria-label", `Option: ${buttonText}`);
    }

    // Enhance focus visibility for all interactive elements
    if (target.matches("button, a, input, select, textarea, [role='button']")) {
      target.classList.add("focus-visible-element");
    }
  });

  // Remove enhanced focus class on blur
  document.addEventListener("focusout", (e) => {
    const target = e.target as HTMLElement;
    if (target?.matches(".focus-visible-element")) {
      target.classList.remove("focus-visible-element");
    }
  });

  /**
   * Use IntersectionObserver for lazy loading and performance optimization
   * This improves initial load time by deferring non-critical content
   */
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      // Optimize for when elements come into view
      const element = entry.target;
      if (element.id === "options") {
        element.setAttribute("aria-busy", "false");
      }

      // Stop observing after handling
      intersectionObserver.unobserve(element);
    });
  }, observerOptions);

  // Start observing key elements
  const elementsToObserve = document.querySelectorAll("#options, #question");
  elementsToObserve.forEach((el) => intersectionObserver.observe(el));

  /**
   * Use MutationObserver to track changes to the DOM for accessibility
   * Updates ARIA attributes when content changes dynamically
   */
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const target = mutation.target as Element;
      if (mutation.type === "childList" && (target.id === "question" || target.id === "options")) {
        // Update ARIA attributes when content changes
        document.getElementById("question-container")?.setAttribute("aria-busy", "false");

        // Reinitialize any new elements that need intersection observation
        if (target.id === "options") {
          const newOptions = target.querySelectorAll("button");
          newOptions.forEach((button) => {
            if (!button.getAttribute("aria-label")) {
              const buttonText = button.textContent?.trim() || "";
              button.setAttribute("aria-label", `Option: ${buttonText}`);
            }
          });
        }
      }
    });
  });

  // Start observing the document for changes with optimized configuration
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false, // Only monitor added/removed nodes, not attribute changes
    characterData: false, // Don't monitor text content changes
  });

  // Clean up observers when page unloads to prevent memory leaks
  window.addEventListener("unload", () => {
    mutationObserver.disconnect();
    intersectionObserver.disconnect();
  });
}

/**
 * Validates that all required DOM elements are present
 * Ensures the game can run properly before initialization
 *
 * @param {GameElements} elements - The cached DOM elements
 * @returns {boolean} Whether all required elements are available
 */
function validateElements(elements: GameElements): boolean {
  const requiredElements = ["score", "question", "options", "container"];

  return requiredElements.every((key) => elements[key as keyof GameElements] !== null);
}

/**
 * Initialize the game engine and export public functions
 * Main entry point for game initialization
 */
export function initGameEngine(): void {
  document.addEventListener("DOMContentLoaded", () => {
    const elements = cacheElements();
    if (!validateElements(elements)) {
      console.error("Required DOM elements not found");
      return;
    }

    // Initial setup
    initializeGame(elements);
    enhanceAccessibility();

    // Initialize keyboard shortcuts
    initKeyboardShortcuts({
      onJoker: () => {
        const jokerButton = document.getElementById("joker-button");
        if (jokerButton) {
          jokerButton.click();
        }
      },
      onOption: (index) => {
        const optionButtons = document.querySelectorAll("#options button");
        if (optionButtons && optionButtons.length > index) {
          (optionButtons[index] as HTMLButtonElement).click();
        }
      },
      onNextRound: () => {
        const nextRoundButton = document.getElementById("next-round-button");
        if (nextRoundButton && !nextRoundButton.closest(".hidden")) {
          nextRoundButton.click();
        }
      },
      onRestart: () => {
        const restartButton = document.getElementById("restart-button");
        if (restartButton && !restartButton.closest(".hidden")) {
          restartButton.click();
        }
      },
      lang: getLangFromUrl(new URL(window.location.pathname, window.location.origin)),
    });
  });
}
