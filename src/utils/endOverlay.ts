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

import { debug } from "./debug";
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
 * updateMotivationText
 * Derives an encouraging motivational string based on the final score and
 * injects it into the overlay, announcing it to assistive tech where possible.
 *
 * Score → Tier Mapping (resilient local heuristic):
 *  1500+ : excellent
 *  1000+ : good
 *   500+ : average
 *   else : beginner
 *
 * NOTE: These numeric bands are intentionally local (not imported) to keep
 * overlay resilience if a centralized scoring module fails to load; they are
 * easy to adjust later if unified constants become desirable.
 *
 * @param {number} score Player's final numeric score
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
 * animateProgressBar
 * Visually represents the player's performance as a percentage of maxScore.
 * Automatically respects the user's reduced motion preference by skipping
 * animated tweening when `(prefers-reduced-motion: reduce)` is active.
 *
 * @param {number} score Current score to display
 * @param {number} [maxScore=1000] Maximum achievable score (defaults to 1000 if omitted)
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

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    // No animated tween – set immediately
    progressBar.style.transition = "none";
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${roundedPercentage}%`;
    return;
  }

  // Animate progress bar (standard path)
  progressBar.style.width = "0%";
  progressBar.style.transition = "width 1s ease-in-out";
  void progressBar.offsetHeight; // reflow
  progressBar.style.width = `${percentage}%`;
  setTimeout(() => {
    progressText.textContent = `${roundedPercentage}%`;
  }, 1000);
};

/**
 * updateEndOverlayScore
 * Simple, synchronous display update of the numeric final score.
 * Isolated for clarity & future testability.
 *
 * @param {number} score Final score value to show
 */
export const updateEndOverlayScore = async (score: number): Promise<void> => {
  const scoreElement = getElementById<HTMLElement>("popup-score");
  if (!scoreElement) {
    return;
  }

  scoreElement.textContent = score.toString();
};

/**
 * updateDifficultyDisplay
 * Reads difficulty from overlay dataset and injects into the display node.
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
 * updateCategoryDisplay
 * Resolves category name from multiple potential dataset attributes to offer
 * backwards compatibility with earlier markup variants.
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
 * setupRestartButton
 * Binds a click handler performing a hard reload to restart gameplay.
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
 * setupSharingButton
 * Placeholder for potential future share overlay activation (kept minimal
 * to avoid premature abstraction while still separating concerns).
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
 * completeEndOverlaySetup
 * Orchestrates all user-visible updates after the overlay becomes active.
 * Splitting concerns allows for partial reuse & easier testing of individual
 * pieces (score, progress, motivation, metadata).
 *
 * @param {EndOverlayConfig} config Config containing score, optional maxScore & translations
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
 * normalizeEndOverlayConfig
 * Accepts either a numeric shorthand or full configuration object and produces
 * a consistent EndOverlayConfig. Keeps the public API ergonomic while keeping
 * downstream logic strict.
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

let previousFocusedElement: HTMLElement | null = null;

function focusFirstElement(popup: HTMLElement): void {
  const heading = popup.querySelector<HTMLElement>(
    "#end-overlay-title h2, #end-overlay-title [role='heading']"
  );
  if (heading) {
    try {
      heading.focus();
      return;
    } catch {
      /* ignore */
    }
  }
  const focusable = popup.querySelector<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable) {
    try {
      focusable.focus();
    } catch {
      /* ignore */
    }
  } else {
    try {
      popup.focus();
    } catch {
      /* ignore */
    }
  }
}

function restorePreviousFocus(): void {
  if (previousFocusedElement && typeof previousFocusedElement.focus === "function") {
    try {
      previousFocusedElement.focus();
    } catch {
      /* ignore */
    }
  }
  previousFocusedElement = null;
}

function attachCloseHandlers(popup: HTMLElement): void {
  // Close on backdrop click
  const backdrop = document.getElementById("overlay-backdrop");
  if (backdrop) {
    backdrop.addEventListener(
      "click",
      () => {
        popup.classList.add("hidden");
        popup.setAttribute("aria-hidden", "true");
        restorePreviousFocus();
      },
      { once: false }
    );
  }
}

function trapFocusKeydown(e: KeyboardEvent, popup: HTMLElement): void {
  if (e.key !== "Tab") {
    return;
  }
  const focusables = popup.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) {
    return;
  }
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/**
 * revealPopupElement
 * Ensures the overlay popup becomes visible & focusable, stripping common
 * hide classes, applying minimal inline style overrides, and handling focus.
 * Includes defensive try/catch blocks to maximize resilience if partial DOM
 * APIs fail.
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

    // capture previously focused element once (only first open)
    if (!previousFocusedElement && document.activeElement instanceof HTMLElement) {
      previousFocusedElement = document.activeElement;
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
        focusFirstElement(popup);
      } catch (_unused) {
        void _unused;
      }
    } catch (e) {
      void e;
    }

    attachCloseHandlers(popup);
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        popup.classList.add("hidden");
        popup.setAttribute("aria-hidden", "true");
        restorePreviousFocus();
        return;
      }
      trapFocusKeydown(ev, popup);
    });
  } catch (e) {
    void e;
  }
}

/**
 * handleShowEndOverlay
 * Delegates to an alternate global implementation if present (injection point
 * for future customization) otherwise falls back to the local complete setup.
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
  debug("endOverlay", "initializeEndOverlay called");

  // Register global API
  /**
   * Global handler exposed as window.showEndOverlay.
   * Normalizes arguments, reveals popup quickly for user feedback, then
   * performs async setup steps.
   */
  async function showEndOverlayHandler(
    configOrScore: EndOverlayConfig | number,
    maxScore?: number
  ): Promise<void> {
    // Lightweight debug (non-fatal)
    debug("endOverlay", "window.showEndOverlay invoked", { configOrScore, maxScore });

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
  debug("endOverlay", "window.showEndOverlay registered");
};

// Auto-initialize when module is loaded
if (typeof window !== "undefined") {
  initializeEndOverlay();
}
