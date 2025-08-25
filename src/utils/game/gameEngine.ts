/**
 * Music Quiz Game Engine
 *
 * - Loading questions from language-specific files with fallback mechanisms
 * - Managing user interactions and scoring logic
 * - Tracking game state and progress through multiple rounds
 * - Providing audio-visual feedback for user actions
 * - Ensuring WCAG AAA compliance with full screen reader support
 * - Supporting keyboard shortcuts for faster gameplay
 * - Timer announcements for speed bonuses
 *
 * @module MelodyMindGameEngine
 */
import type { Album, Question } from "../../types/game";
import { initKeyboardShortcuts } from "../accessibility/keyboardShortcuts";
import { startSpeedBonusTimer, clearSpeedBonusTimers } from "../accessibility/timerAnnouncer";
import { stopAudio } from "../audio/audioControls";
import { safeGetElementById, safeQuerySelector, safeQuerySelectorAll } from "../dom/domUtils";
import { ErrorHandler } from "../error/errorHandler";
import { handleGameError, handleLoadingError } from "../error/errorHandlingUtils";
import { getLangFromUrl, useTranslations } from "../i18n";

import { loadAlbumsWithFallback } from "./albumLoader";
import { handleEndGame, restartGame } from "./endGameUtils";
import { updateCoinsDisplay, showEndgamePopup } from "./gameUI";
import { getRandomQuestion } from "./getRandomQuestion";
import type { RQAlbum, RQQuestion } from "./getRandomQuestion";
import { handleAnswer } from "./handleAnswerUtils";
import { JokerManager } from "./jokerManager";
import { Difficulty } from "./jokerUtils";
import { loadQuestion } from "./loadQuestionUtils";
import { initializeMediaElements } from "./mediaUtils";

// Global window augmentations are provided by the endOverlay module.
// Avoid duplicating global interface declarations here to keep this file focused.

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
  score: HTMLParagraphElement | null;
  round: HTMLParagraphElement | null;
  feedback: HTMLParagraphElement | null;
  question: HTMLParagraphElement | null;
  options: HTMLDivElement | null;
  container: HTMLDivElement | null;
  overlay: HTMLDivElement | null;
  jokerButton: HTMLButtonElement | null;
  jokerCounter: HTMLElement | null;
  nextRoundButton: HTMLButtonElement | null;
  restartButton: HTMLButtonElement | null;
  loadingSpinner: HTMLElement | null;
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
    score: safeQuerySelector<HTMLParagraphElement>(".coinsCount"),
    round: safeGetElementById<HTMLParagraphElement>("quiz-round-display"),
    feedback: safeGetElementById<HTMLParagraphElement>("feedback"),
    question: safeGetElementById<HTMLParagraphElement>("question"),
    options: safeGetElementById<HTMLDivElement>("options"),
    container: safeGetElementById<HTMLDivElement>("question-container"),
    overlay: safeGetElementById<HTMLDivElement>("overlay"),
    jokerButton: safeGetElementById<HTMLButtonElement>("joker-button"),
    jokerCounter: safeGetElementById<HTMLElement>("joker-count"),
    nextRoundButton: safeGetElementById<HTMLButtonElement>("quiz-next-round-button"),
    restartButton: safeGetElementById<HTMLButtonElement>("restart-button"),
    loadingSpinner: safeGetElementById<HTMLElement>("loading-spinner"),
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
const initializeGame = async (elements: GameElements): Promise<void> => {
  // QueueManager functionality removed - no longer needed

  if (!elements.container) {
    handleGameError(new Error("Game container element not found"), "game initialization");
    return;
  }

  /**
   * Extract game parameters from data attributes
   * These attributes control game configuration and player identification
   */
  const category = elements.container.getAttribute("data-genre");
  const categoryName = elements.container.getAttribute("data-categoryName");
  const difficulty = elements.container.getAttribute("data-difficulty");

  /**
   * Initialize game state variables
   * These track the player's progress and performance
   */
  let currentRound = 1;
  let totalScore = 0;
  let correctAnswers = 0;
  let jokerManager: JokerManager | null = null;
  const totalRounds =
    ROUNDS_PER_DIFFICULTY[validateDifficulty(difficulty)] ?? ROUNDS_PER_DIFFICULTY.easy;

  // Update UI with initial round
  if (elements.round) {
    elements.round.textContent = `${currentRound}/${totalRounds}`;
  }

  // Debug logging for round tracking (development-only)
  if (import.meta.env?.DEV) {
    // development debug info omitted to keep lint clean
  }

  /**
   * Load albums data for the selected category with language fallback
   * Attempts to load in the user's language first, then falls back to German
   *
   * @type {Album[] | null} albums - Collection of album data for questions
   */
  let albums: Album[] | null = null;

  // Get current language based on URL (ensure a string is passed to translations)
  const lang = String(getLangFromUrl(new URL(window.location.pathname, window.location.origin)));
  const t = useTranslations(String(lang));

  try {
    // Use the centralized album loader utility
    albums = await loadAlbumsWithFallback(String(category), String(lang));

    if (!albums?.length) {
      throw new Error(t("error.no.albums.found"));
    }
  } catch (error) {
    handleLoadingError(error, "albums data");
    ErrorHandler.handleApiError(error instanceof Error ? error : new Error(String(error)));
    return;
  }

  /**
   * Initialize joker system based on the difficulty level
   * The joker allows players to eliminate incorrect answers
   */
  jokerManager = new JokerManager({
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
    handleGameError(
      new Error("Media elements could not be initialized"),
      "media elements initialization"
    );
    return;
  }

  /**
   * Updates the coin display with an animation for visual feedback
   * Provides both visual and auditory feedback for screen readers
   *
   * @param {number} newScore - The new score to display
   */
  // The `updateCoinsDisplay` implementation has been moved to `src/utils/game/gameUI.ts`.
  // The function is imported at module level and used directly; no local implementation needed here.

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
    option: string,
    correctAnswer: string,
    currentQuestion: Question,
    album: Album
  ): void {
    // Save start time for achievement tracking and validate
    const _w = window as unknown as {
      questionStartTime?: number;
      lastAnswerTime?: number;
      lastAnswerCorrect?: boolean;
    };
    const answerTime = Date.now() - (_w.questionStartTime ?? Date.now());
    // Ensure time is positive and realistic (max 60 seconds)
    _w.lastAnswerTime = Math.min(Math.max(0, answerTime), 60000);
    _w.lastAnswerCorrect = option === correctAnswer;

    // Clear speed bonus timer announcements once an answer is selected
    clearSpeedBonusTimers();

    // Process the answer and update the score
    totalScore = handleAnswer({
      option,
      correctAnswer,
      currentQuestion,
      album,
      elements: {
        feedbackElement: elements.feedback!,
        scoreElement: elements.score!,
        overlay: elements.overlay!,
        mediaElements: mediaElements || undefined,
      },
      state: {
        score: totalScore,
        roundIndex: currentRound, // Pass current round (not 0-based)
        totalRounds: totalRounds,
        roundElement: elements.round!,
      },
    });

    // Immediately update UI with visual feedback for correct answers
    if (option === correctAnswer) {
      correctAnswers++;
      updateCoinsDisplay(totalScore);
    }

    /**
     * Setup handler for the next round button
     * Controls game flow between questions and at game end
     */
    if (elements.nextRoundButton) {
      elements.nextRoundButton.onclick = function () {
        stopAudio();
        // Use optional chaining in case overlay is null
        elements.overlay?.classList.add("hidden");

        // Increment round only when moving to next question
        if (currentRound < totalRounds) {
          currentRound++;

          // Update round display directly from currentRound
          if (elements.round) {
            elements.round.textContent = `${currentRound}/${totalRounds}`;
          }

          // Ensure albums is an array and normalize shape for getRandomQuestion
          const safeAlbumsForRandom: RQAlbum[] = (Array.isArray(albums) ? albums : []).map((a) => {
            // Treat incoming album as a loose record and normalize question arrays safely.
            const albumRec = a as unknown as Record<string, unknown>;
            const qRec = (albumRec["questions"] as Record<string, unknown> | undefined) ?? {};
            const safeQ = {
              easy: Array.isArray(qRec["easy"])
                ? (qRec["easy"] as unknown[]).map((it) => it as RQQuestion)
                : [],
              medium: Array.isArray(qRec["medium"])
                ? (qRec["medium"] as unknown[]).map((it) => it as RQQuestion)
                : [],
              hard: Array.isArray(qRec["hard"])
                ? (qRec["hard"] as unknown[]).map((it) => it as RQQuestion)
                : [],
            };
            return {
              ...a,
              questions: safeQ,
            } as RQAlbum;
          });

          const newQuestion = getRandomQuestion(
            safeAlbumsForRandom,
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
  }

  /**
   * Handles the end of game, displays summary, and saves score
   * Triggers achievement checks and displays final results
   */
  function endGame(): void {
    const config = {
      userId: "", // Removed userId
      categoryName: categoryName || "",
      difficulty: validateDifficulty(difficulty) || "easy",
      totalRounds,
      correctAnswers,
      score: totalScore,
      language: lang,

      // Removed extended properties for achievement tracking
      // genreId: category || "", // Category/genre ID for genre_explorer
      // lastAnswerTime: typeof window.lastAnswerTime === "number" ? window.lastAnswerTime : undefined, // Last answer time for quick_answer
      //   typeof window.lastAnswerCorrect === "boolean" ? window.lastAnswerCorrect : undefined, // Whether the last answer was correct
      // eventId: window.currentEventId || undefined, // Event ID for seasonal_event

      // Debug flag for achievement tests
      debugAchievements: true,
      endOfSession: true, // End of game session for game_series
    };

    const endUi = {
      showEndgamePopup: (score: number) => {
        // Delegate to the extracted helper which handles the advanced global overlay
        // or the fallback DOM-based popup.
        showEndgamePopup(score);
      },
    };

    handleEndGame(config, endUi, {
      onError: (error) => {
        ErrorHandler.handleSaveError(error, "score", {
          userId: config.userId,
          score: config.score,
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
  function loadNewQuestion(question: Question, album: Album): void {
    if (!question || !question.options) {
      handleGameError(new Error(t("error.invalid.question")), "question validation");
      return;
    }

    // Save start time for achievement tracking (use a narrow, safe cast)
    (window as unknown as { questionStartTime?: number }).questionStartTime = Date.now();

    // Start speed bonus timer with announcements
    startSpeedBonusTimer(lang);

    jokerManager?.setCurrentQuestion(question);

    // Normalize question shape to match `loadQuestionUtils.Question` (ensures `trivia` is present).
    // Use the RQQuestion type for a clear contract and perform safe casts.
    const qr = question as Partial<RQQuestion> & Record<string, unknown>;
    const safeQuestion: RQQuestion = {
      question: String(qr.question ?? ""),
      options: Array.isArray(qr.options) ? (qr.options as string[]) : [],
      correctAnswer: String(qr.correctAnswer ?? ""),
      trivia: String(qr.trivia ?? ""),
    };

    loadQuestion({
      question: safeQuestion,
      album,
      elements: {
        questionContainer: elements.container!,
        spinner: elements.loadingSpinner!,
        questionElement: elements.question!,
        optionsContainer: elements.options!,
      },
      handlers: {
        handleAnswer: handleAnswerWrapper,
      },
      jokerState: jokerManager?.getCurrentJokerState() ?? { jokerUsed: false },
    });
  }

  // Add event listener for restart button
  elements.restartButton?.addEventListener("click", restartGame);

  /**
   * Load the first question to start the game
   * Initializes the game with the first random question
   */
  // Ensure albums is an array and normalize shape for the random selector
  const safeAlbums: RQAlbum[] = (Array.isArray(albums) ? albums : []).map((a) => {
    // Treat incoming album as a loose record and normalize question arrays safely without `any`
    const albumRec = a as unknown as Record<string, unknown>;
    const qRec = (albumRec["questions"] as Record<string, unknown> | undefined) ?? {};
    const safeQ = {
      easy: Array.isArray(qRec["easy"])
        ? (qRec["easy"] as unknown[]).map((it) => it as RQQuestion)
        : [],
      medium: Array.isArray(qRec["medium"])
        ? (qRec["medium"] as unknown[]).map((it) => it as RQQuestion)
        : [],
      hard: Array.isArray(qRec["hard"])
        ? (qRec["hard"] as unknown[]).map((it) => it as RQQuestion)
        : [],
    };
    return {
      ...a,
      questions: safeQ,
    } as RQAlbum;
  });

  const initialQuestion = getRandomQuestion(
    safeAlbums,
    validateDifficulty(difficulty),
    totalRounds
  );

  if (initialQuestion?.randomQuestion && initialQuestion?.randomAlbum) {
    loadNewQuestion(initialQuestion.randomQuestion, initialQuestion.randomAlbum);
  } else {
    handleGameError(new Error(t("error.no.initial.question")), "initial question loading");
  }

  /**
   * Warn before leaving if there's unsaved data
   * Prevents accidental data loss when navigating away
   */
  // QueueManager functionality removed - no longer needed
  // window.addEventListener("beforeunload", (e) => {
  //   if (QueueManager.hasUnsavedData()) {
  //     e.preventDefault();
  //   }
  // });

  /**
   * Clean up resources when the page unloads
   * Ensures proper resource management and prevents memory leaks
   */
  // Clean up resources when the page unloads
  const cleanup = () => {
    stopAudio();
    // QueueManager.stopProcessing(); // Removed - no longer needed
    jokerManager?.cleanup();
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
  // Function to initialize game elements
  const initGame = () => {
    const elements = cacheElements();
    if (!validateElements(elements)) {
      handleGameError(new Error("Required DOM elements not found"), "DOM element validation");
      return;
    }

    // Initial setup
    initializeGame(elements);
    enhanceAccessibility();

    // Initialize keyboard shortcuts
    initKeyboardShortcuts({
      onJoker: () => {
        const jokerButton = safeGetElementById<HTMLButtonElement>("joker-button");
        if (jokerButton) {
          jokerButton.click();
        }
      },
      onOption: (index) => {
        const optionButtons = safeQuerySelectorAll<HTMLButtonElement>("#options button");
        if (optionButtons && optionButtons.length > index) {
          optionButtons[index].click();
        }
      },
      onNextRound: () => {
        const nextRoundButton = safeGetElementById<HTMLButtonElement>("quiz-next-round-button");
        if (nextRoundButton && !nextRoundButton.closest(".hidden")) {
          nextRoundButton.click();
        }
      },
      onRestart: () => {
        const restartButton = safeGetElementById<HTMLButtonElement>("restart-button");
        if (restartButton && !restartButton.closest(".hidden")) {
          restartButton.click();
        }
      },
      lang: getLangFromUrl(new URL(window.location.pathname, window.location.origin)),
    });
  };

  // Initialize on DOM ready
  document.addEventListener("DOMContentLoaded", initGame);
}
