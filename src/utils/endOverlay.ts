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
 * @param score - The player's final score
 * @returns Promise<void>
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
 * @param score - Current score
 * @param maxScore - Maximum possible score
 * @returns Promise<void>
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
 * @param score - The final score to display
 * @returns Promise<void>
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
 * @returns Promise<void>
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
 * @returns Promise<void>
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
 * @returns void
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
 * @returns void
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
 * @param config - Configuration object with score and optional parameters
 * @returns Promise<void>
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

  // Set up global showEndOverlay function for game engines to use
  window.showEndOverlay = (configOrScore: EndOverlayConfig | number, maxScore?: number) => {
    // Debug: report invocation arguments in dev
    try {
      if (import.meta.env?.DEV && typeof window !== "undefined") {
        // eslint-disable-next-line no-console
        console.debug("[endOverlay] window.showEndOverlay invoked", { configOrScore, maxScore });
      }
    } catch (e) {
      void e;
    }

    // Normalize incoming args into a single config object so we can
    // consistently reveal the DOM popup and then run the richer setup.
    const resolvedConfig: EndOverlayConfig = ((): EndOverlayConfig => {
      if (typeof configOrScore === "number") {
        return {
          score: configOrScore,
          maxScore: typeof maxScore === "number" ? maxScore : 1000,
          translations: undefined,
        } as EndOverlayConfig;
      }
      return {
        score: (configOrScore as EndOverlayConfig).score,
        maxScore: (configOrScore as EndOverlayConfig).maxScore ?? maxScore ?? 1000,
        translations: (configOrScore as EndOverlayConfig).translations,
      } as EndOverlayConfig;
    })();

    // Reveal the DOM-based overlay immediately so users see feedback even if
    // the richer setup runs asynchronously or fails.
    try {
      const popup = getElementById<HTMLElement>("endgame-popup");
      if (popup) {
        // Ensure the data attribute is set so other modules/readers can inspect it
        try {
          popup.setAttribute("data-score", String(resolvedConfig.score));
        } catch (e) {
          void e;
        }

        // Robust reveal strategy: remove common hiding utility classes and apply inline styles.
        try {
          const hideClasses = [
            "hidden",
            "invisible",
            "opacity-0",
            "pointer-events-none",
            "sr-only",
          ];
          hideClasses.forEach((c) => {
            try {
              popup.classList.remove(c);
            } catch (_unused) {
              void _unused; // ignore individual class removal failures (best-effort)
            }
          });
        } catch (e) {
          void e;
        }

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
            void _unused; // best-effort focus; ignore failures
          }
        } catch (_unused) {
          void _unused; // ignore style application failures (best-effort)
        }
      }
    } catch (domErr) {
      try {
        handleGameError(domErr, "revealing end overlay DOM");
      } catch (_unused) {
        void _unused; // ignore secondary errors from reporting to avoid cascading failures
      }
    }

    // Now attempt to run the richer animation/setup. Keep this resilient:
    // - If the call returns a Promise, await it so callers that expect completion behave.
    // - If it throws, report centrally but do not prevent the DOM popup being visible.
    try {
      // Prefer global function if available (shouldn't be needed because this is the registration),
      // but keep compatibility with other code paths that may register different implementations.
      const maybeGlobal = (window as unknown as Window & { showEndOverlay?: unknown })
        .showEndOverlay;
      if (
        maybeGlobal &&
        maybeGlobal !== window.showEndOverlay &&
        typeof maybeGlobal === "function"
      ) {
        // Another richer implementation exists elsewhere; prefer that.
        try {
          return (maybeGlobal as (cfg: EndOverlayConfig) => Promise<void> | void)(resolvedConfig);
        } catch (err) {
          try {
            handleGameError(err, "invoking alternative global showEndOverlay");
          } catch (e) {
            void e;
          }
        }
      }

      // Otherwise, run the internal completion steps which animate/update contents.
      try {
        return completeEndOverlaySetup(resolvedConfig);
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
      } catch (err) {
        void err;
      }
    }
  };

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
