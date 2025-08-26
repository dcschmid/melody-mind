/**
 * @fileoverview EndOverlay utility functions
 * @description Client-side utilities for managing the end game modal functionality
 * including dynamic motivation text, focus management, and accessibility features.
 *
 * This module follows WCAG AAA accessibility standards and implements optimized
 * performance practices for smooth animations and minimal resource usage.
 *
 * @author MelodyMind Team
 * @version 2.0.0
 * @since 2025-06-03
 */

import { safeGetElementById, safeQuerySelector } from "./dom/domUtils";
import { handleGameError } from "./error/errorHandlingUtils";

// Type definitions for better type safety
interface TranslationData {
  [key: string]: string;
}

interface EndOverlayConfig {
  score: number;
  maxScore?: number;
  translations?: TranslationData;
}

// Import centralized DOM utilities

// Utility functions with modern ES6+ features
const getElement = <T extends HTMLElement>(selector: string): T | null =>
  safeQuerySelector<T>(selector);

const getElementById = <T extends HTMLElement>(id: string): T | null => safeGetElementById<T>(id);

const getMotivationKey = (scoreLevel: string): string => `game.end.motivation.${scoreLevel}`;

const announceToScreenReader = (text: string): void => {
  const announcement = getElementById<HTMLElement>("score-announcement");
  if (announcement) {
    announcement.textContent = text;
  }
};

// Extend Window interface for global functions
declare global {
  interface Window {
    showEndOverlay?: (
      configOrScore: EndOverlayConfig | number,
      maxScore?: number
    ) => Promise<void> | void;
  }
}

/**
 * Update motivation text based on score
 * @param {number} score - The player's final score
 * @returns {Promise<void>}
 */
export const updateMotivationText = async (score: number): Promise<void> => {
  const motivationElement = getElementById<HTMLElement>("motivation-text");
  if (!motivationElement) {
    return;
  }

  // Get translations from data attribute
  const overlay = getElementById<HTMLElement>("endgame-popup");
  if (!overlay) {
    return;
  }

  const translationsData = overlay.getAttribute("data-translations");
  if (!translationsData) {
    return;
  }

  let translations: Record<string, string>;
  try {
    translations = JSON.parse(translationsData);
  } catch {
    return;
  }

  // Score level based on realistic game scoring (50-100 points per question)
  // For 10-20 rounds: max score is 500-2000 points
  const scoreLevel =
    score >= 1500 ? "excellent" : score >= 1000 ? "good" : score >= 500 ? "average" : "beginner";

  const motivationKey = getMotivationKey(scoreLevel);

  const motivationText = translations[motivationKey];
  const fallbackText = translations["game.end.defaultMotivation"] || "Great job!";

  if (motivationText) {
    motivationElement.textContent = motivationText;
    announceToScreenReader(motivationText);
  } else {
    motivationElement.textContent = fallbackText;
  }
};

/**
 * Animate progress bar based on score
 * @param {number} score - Current score
 * @param {number} [maxScore=1000] - Maximum possible score
 * @returns {Promise<void>}
 */
export const animateProgressBar = async (score: number, maxScore: number = 1000): Promise<void> => {
  const progressContainer = getElement<HTMLElement>(".score-progress");
  if (!progressContainer) {
    return;
  }

  const progressBar = progressContainer.querySelector(".progress-bar") as HTMLElement;
  const progressText = progressContainer.querySelector(".progress-text") as HTMLElement;

  if (!progressBar || !progressText) {
    return;
  }

  const percentage = Math.min((score / maxScore) * 100, 100);
  const roundedPercentage = Math.round(percentage);

  // Animate progress bar
  progressBar.style.width = "0%";
  progressBar.style.transition = "width 1s ease-in-out";

  // Trigger reflow
  void progressBar.offsetHeight;

  progressBar.style.width = `${percentage}%`;

  // Update text after animation
  setTimeout(() => {
    progressText.textContent = `${roundedPercentage}%`;
  }, 1000);
};

/**
 * Update score display in the end overlay
 * @param {number} score - The final score to display
 * @returns {Promise<void>}
 */
export const updateEndOverlayScore = async (score: number): Promise<void> => {
  const scoreElement = getElementById<HTMLElement>("popup-score");
  if (!scoreElement) {
    return;
  }

  scoreElement.textContent = score.toString();
};

/**
 * Update difficulty display in the end overlay
 * @returns {Promise<void>}
 */
export const updateDifficultyDisplay = async (): Promise<void> => {
  const difficultyElement = getElementById<HTMLElement>("difficulty-display");
  const overlay = getElementById<HTMLElement>("endgame-popup");

  if (!difficultyElement || !overlay) {
    return;
  }

  const difficulty = overlay.getAttribute("data-difficulty");
  if (difficulty) {
    difficultyElement.textContent = difficulty;
  }
};

/**
 * Update category display in the end overlay
 * @returns {Promise<void>}
 */
export const updateCategoryDisplay = async (): Promise<void> => {
  const categoryElement = getElementById<HTMLElement>("category-display");
  const overlay = getElementById<HTMLElement>("endgame-popup");

  if (!categoryElement || !overlay) {
    return;
  }

  const categoryName =
    overlay.getAttribute("data-categoryName") || overlay.getAttribute("data-category");
  if (categoryName) {
    categoryElement.textContent = categoryName;
  }
};

/**
 * Set up restart button functionality
 * @returns {void}
 */
export const setupRestartButton = (): void => {
  const restartButton = getElementById<HTMLElement>("restart-button");
  if (!restartButton) {
    return;
  }

  restartButton.addEventListener("click", () => {
    window.location.reload();
  });
};

/**
 * Set up share button functionality
 * @returns {void}
 */
export const setupSharingButton = (): void => {
  const shareButton = getElementById<HTMLElement>("share-button");
  if (!shareButton) {
    return;
  }

  shareButton.addEventListener("click", () => {
    // Share functionality would be implemented here
  });
};

/**
 * Complete EndOverlay setup with score, animations, and motivation text
 * This function should be called when the overlay is shown to trigger all animations
 * @param {EndOverlayConfig} config - Configuration object with score and optional parameters
 * @returns {Promise<void>}
 */
export const completeEndOverlaySetup = async (config: EndOverlayConfig): Promise<void> => {
  try {
    // Update score display
    await updateEndOverlayScore(config.score);

    // Update progress display
    await animateProgressBar(config.score, config.maxScore || 1000);

    // Update motivation text
    await updateMotivationText(config.score);

    // Update difficulty display
    await updateDifficultyDisplay();

    // Update category display
    await updateCategoryDisplay();

    // Set up restart functionality
    setupRestartButton();

    // Set up share functionality
    setupSharingButton();
  } catch (error) {
    handleGameError(error, "EndOverlay setup");
  }
};

/**
 * Initialize EndOverlay functionality
 * Sets up all necessary event listeners and prepares the overlay for use
 * @returns void
 */

/**
 * Normalize the API inputs (number or config) into a consistent config object.
 *
 * @param {EndOverlayConfig|number} configOrScore - Config object or numeric score
 * @param {number} [maxScore] - Optional maxScore used when numeric API supplied
 * @returns {EndOverlayConfig}
 */
function normalizeEndOverlayConfig(
  configOrScore: EndOverlayConfig | number,
  maxScore?: number
): EndOverlayConfig {
  if (typeof configOrScore === "number") {
    return {
      score: configOrScore,
      maxScore: typeof maxScore === "number" ? maxScore : 1000,
      translations: undefined,
    };
  }

  const cfg = configOrScore as EndOverlayConfig;
  return {
    score: cfg.score,
    maxScore: cfg.maxScore ?? maxScore ?? 1000,
    translations: cfg.translations,
  };
}

/**
 * Robustly reveal the popup element: set attributes, remove hiding classes,
 * apply inline styles and focus the element. This is separated out to reduce
 * the complexity of the initializer and to make the steps testable.
 *
 * @param {HTMLElement|null} popup - Popup DOM element to reveal
 * @param {number} [score] - Optional score to set on the popup dataset
 * @returns {void}
 */
function revealPopupElement(popup: HTMLElement | null, score?: number): void {
  if (!popup) {
    return;
  }

  try {
    if (typeof score === "number") {
      try {
        popup.setAttribute("data-score", String(score));
      } catch (e) {
        void e;
      }
    }

    // Remove utility classes that commonly hide the element
    try {
      const hideClasses = ["hidden", "invisible", "opacity-0", "pointer-events-none", "sr-only"];
      hideClasses.forEach((c) => {
        try {
          popup.classList.remove(c);
        } catch (_unused) {
          void _unused;
        }
      });
    } catch (e) {
      void e;
    }

    // Apply inline styles to guarantee visibility regardless of CSS utility state
    try {
      popup.style.display = "flex";
      popup.style.visibility = "visible";
      popup.style.opacity = "1";
      popup.style.pointerEvents = "auto";
      popup.style.zIndex = String(100000);
      popup.setAttribute("aria-hidden", "false");
      popup.setAttribute("tabindex", "-1");
      try {
        popup.focus();
      } catch (_unused) {
        void _unused;
      }
    } catch (e) {
      void e;
    }
  } catch (e) {
    void e;
  }
}

/**
 * Handle the overlay flow in a small helper to reduce handler complexity.
 * Tries an alternative global implementation first; falls back to internal setup.
 *
 * @param {EndOverlayConfig} cfg - Normalized overlay configuration
 * @returns {Promise<void>}
 */
async function handleShowEndOverlay(cfg: EndOverlayConfig): Promise<void> {
  try {
    const maybeGlobal = (
      window as unknown as Window & {
        showEndOverlay?: (cfg: EndOverlayConfig) => Promise<void> | void;
      }
    ).showEndOverlay;

    if (maybeGlobal && maybeGlobal !== window.showEndOverlay && typeof maybeGlobal === "function") {
      try {
        await maybeGlobal(cfg);
        return;
      } catch (err) {
        try {
          handleGameError(err, "invoking alternative global showEndOverlay");
        } catch {
          /* ignore */
        }
      }
    }

    // Fallback to internal setup
    try {
      await completeEndOverlaySetup(cfg);
      return;
    } catch (e) {
      try {
        handleGameError(e, "completeEndOverlaySetup (config)");
      } catch {
        /* ignore */
      }
    }
  } catch (e) {
    try {
      handleGameError(e, "showEndOverlay invocation");
    } catch {
      /* ignore */
    }
  }
}

export const initializeEndOverlay = (): void => {
  // Debug: report initialization in dev
  try {
    if (import.meta.env?.DEV && typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.debug("[endOverlay] initializeEndOverlay called");
    }
  } catch (e) {
    try {
      handleGameError(e, "initializeEndOverlay debug");
    } catch {
      /* ignore errors from error handler to avoid cascading failures */
    }
  }

  // Register global API
  async function showEndOverlayHandler(
    configOrScore: EndOverlayConfig | number,
    maxScore?: number
  ): Promise<void> {
    // Lightweight debug (non-fatal)
    try {
      if (import.meta.env?.DEV && typeof window !== "undefined") {
        // eslint-disable-next-line no-console
        console.debug("[endOverlay] window.showEndOverlay invoked", { configOrScore, maxScore });
      }
    } catch {
      /* ignore logging errors */
    }

    // Normalize input
    const cfg = normalizeEndOverlayConfig(configOrScore, maxScore);

    // Reveal DOM quickly for immediate UX feedback
    try {
      const popup =
        getElementById<HTMLElement>("endgame-popup") ||
        getElement<HTMLElement>(".popup[data-score]");
      revealPopupElement(popup, cfg.score);
    } catch (domErr) {
      try {
        handleGameError(domErr, "revealing end overlay DOM");
      } catch {
        /* ignore reporting failures */
      }
    }

    // Delegate actual work to a smaller helper to keep complexity down
    await handleShowEndOverlay(cfg);
  }

  // assign named handler to global
  window.showEndOverlay = showEndOverlayHandler;

  // Debug: confirm registration
  try {
    if (import.meta.env?.DEV && typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.debug("[endOverlay] window.showEndOverlay registered");
    }
  } catch {
    /* ignore logging errors */
  }
};

// Auto-initialize when module is loaded
if (typeof window !== "undefined") {
  initializeEndOverlay();
}
