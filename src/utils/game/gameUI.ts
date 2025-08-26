/**
 * UI helper utilities for the game engine
 *
 * Extracted from the large `gameEngine.ts` to keep UI manipulations isolated,
 * testable and easier to maintain. These helpers are intentionally small,
 * low-risk and keep behavior backward-compatible with the existing DOM
 * structure used by the app.
 *
 * NOTE: This file uses the project's DOM helpers where appropriate to avoid
 * repetitive null checks and to keep semantics consistent across the codebase.
 */

import { safeGetElementById } from "../dom/domUtils";

/**
 * Extend Window interface for the optional global overlay function.
 * `endOverlay.ts` exposes `window.showEndOverlay` when loaded.
 */
declare global {
  interface Window {
    showEndOverlay?: (
      configOrScore: { score: number; maxScore?: number } | number,
      maxScore?: number
    ) => Promise<void> | void;
  }
}

/**
 * Update the visible coin/score display with accessible announcements and a small
 * animation.
 *
 * - Uses requestAnimationFrame to schedule the DOM writes for smoother UI.
 * - Adds `.coins-updated` class to trigger CSS animation if present.
 * - Announces the updated score to screen readers using a sr-only live region.
 *
 * This function is intentionally defensive: it returns early if the DOM target
 * is missing so callers don't have to guard excessively.
 *
 * @param {number} newScore - The new score value to display.
 */
export function updateCoinsDisplay(newScore: number): void {
  requestAnimationFrame(() => {
    const coinsDisplay = safeGetElementById<HTMLElement>("coins-display");
    if (!coinsDisplay) {
      return;
    }

    // Update visible content and trigger animation
    coinsDisplay.classList.add("coins-updated");
    coinsDisplay.textContent = String(newScore);

    // Create a temporary announcement element for screen readers
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "assertive");
    announcement.classList.add("sr-only");
    announcement.textContent = `New score: ${newScore} points`;
    document.body.appendChild(announcement);

    // Cleanup after animation/announcement
    window.setTimeout(() => {
      coinsDisplay.classList.remove("coins-updated");
      announcement.remove();
    }, 1500);
  });
}

/**
 * Show the end-of-game popup / overlay.
 *
 * Behavior:
 * - If a global advanced overlay function (`window.showEndOverlay`) is available,
 *   prefer that (it may run animations and localized content).
 * - Otherwise fall back to a minimal DOM manipulation of the `#endgame-popup`
 *   element (set data, reveal and focus).
 *
 * This function is tolerant: it returns a resolved Promise when the operation
 * completes (or immediately if nothing to do). Callers can `await` it but do
 * not depend on thrown errors.
 *
 * @param {number} score - Final score to display in the overlay.
 * @param {number} [maxScore] - Optional maximum score (used if overlay supports it).
 * @returns {Promise<void>}
 */
export async function showEndgamePopup(score: number, maxScore?: number): Promise<void> {
  try {
    // Debug: entry
    try {
      // eslint-disable-next-line no-console
      console.debug("[gameUI] showEndgamePopup called", { score, maxScore });
    } catch (e) {
      void e;
    }

    // Prefer global end overlay if provided by endOverlay module
    if (typeof window !== "undefined" && typeof (window as Window).showEndOverlay === "function") {
      try {
        // eslint-disable-next-line no-console
        console.debug("[gameUI] Detected window.showEndOverlay, invoking global overlay");
      } catch (e) {
        void e;
      }
      // The global API supports either a number or a config object.
      try {
        if (typeof maxScore === "number") {
          await (window as Window).showEndOverlay(score, maxScore);
        } else {
          // Pass config object to allow more advanced overlays to animate correctly.
          await (window as Window).showEndOverlay({ score, maxScore: maxScore || undefined });
        }
      } catch (err) {
        try {
          console.warn("[gameUI] window.showEndOverlay threw an error", err);
        } catch (e) {
          void e;
        }
      } finally {
        // Ensure DOM popup is revealed even if global overlay didn't handle visibility.
        // This makes the function robust when utility CSS (e.g. Tailwind `hidden`) prevents display.
        try {
          const popup = safeGetElementById<HTMLElement>("endgame-popup");
          if (popup) {
            try {
              popup.classList.remove(
                "hidden",
                "invisible",
                "opacity-0",
                "pointer-events-none",
                "sr-only"
              );
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
            } catch (e) {
              void e;
            }
            try {
              popup.setAttribute("tabindex", "-1");
              popup.focus();
            } catch (e) {
              void e;
            }
          }
        } catch (e) {
          void e; // swallow to avoid breaking callers
        }
      }
      return;
    }

    // Fallback: manipulate the legacy DOM-based popup
    // and provide informative debug logs for tracing
    const popup = safeGetElementById<HTMLElement>("endgame-popup");
    const scoreElement = safeGetElementById<HTMLElement>("popup-score");

    if (popup) {
      try {
        // eslint-disable-next-line no-console
        console.debug("[gameUI] Using DOM-based endgame popup");
      } catch (e) {
        void e;
      }

      if (scoreElement) {
        scoreElement.textContent = String(score);
      } else {
        try {
          // eslint-disable-next-line no-console
          console.debug("[gameUI] popup exists but #popup-score not found");
        } catch (e) {
          void e;
        }
      }

      // Store metadata attributes commonly read by other modules
      popup.setAttribute("data-score", String(score));
      if (typeof maxScore === "number") {
        popup.setAttribute("data-max-score", String(maxScore));
      }

      // Reveal and focus for accessibility — forcefully ensure visible even if CSS utilities hide it
      try {
        // Remove common utility classes that hide/disable the element
        popup.classList.remove(
          "hidden",
          "invisible",
          "opacity-0",
          "pointer-events-none",
          "sr-only"
        );
      } catch (e) {
        void e;
      }
      // Ensure display/layout and pointer interactions are enabled (inline styles as robust fallback)
      try {
        popup.style.display = "flex";
        popup.style.visibility = "visible";
        popup.style.opacity = "1";
        popup.style.pointerEvents = "auto";
        // High z-index to ensure it's above other layers
        popup.style.zIndex = String(100000);
      } catch (e) {
        void e;
      }
      popup.setAttribute("tabindex", "-1");
      try {
        popup.focus();
      } catch (e) {
        void e; // best-effort focus; ignore failures
      }
    } else {
      try {
        // eslint-disable-next-line no-console
        console.debug("[gameUI] No #endgame-popup found - nothing to update");
      } catch (e) {
        void e;
      }
    }
  } catch (error) {
    // Avoid crashing callers - log to console and swallow errors.
    // Game-level error handlers should pick up persistent issues.
    // Keep this lightweight to avoid adding dependencies.
    try {
      console.error("showEndgamePopup failed:", error);
    } catch (e) {
      void e;
    }
  }
}

/**
 * Small helper that reveals a lightweight 'loading' indicator for endgame
 * processing. This mirrors the minimal behavior used throughout the codebase.
 *
 * It is intentionally idempotent and safe to call multiple times.
 */
export function showEndGameLoading(): void {
  const loading = safeGetElementById<HTMLElement>("endgame-loading-overlay");
  if (loading) {
    loading.classList.remove("hidden");
  }
}

/**
 * Hide the endgame loading overlay (if present).
 */
export function hideEndGameLoading(): void {
  const loading = safeGetElementById<HTMLElement>("endgame-loading-overlay");
  if (loading) {
    loading.classList.add("hidden");
  }
}

/**
 * Export a small convenience object for backwards compatibility with the
 * previous inline `ui` object used inside `gameEngine.ts`.
 *
 * Example usage in game engine:
 *   ui.showEndgamePopup(score);
 *   ui.updateCoinsDisplay(newScore);
 */
export const ui = {
  updateCoinsDisplay,
  showEndgamePopup,
  showEndGameLoading,
  hideEndGameLoading,
};

export default ui;
