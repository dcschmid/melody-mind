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
    // Prefer global end overlay if provided by endOverlay module
    if (typeof window !== "undefined" && typeof window.showEndOverlay === "function") {
      // The global API supports either a number or a config object.
      if (typeof maxScore === "number") {
        await window.showEndOverlay(score, maxScore);
      } else {
        // Pass config object to allow more advanced overlays to animate correctly.
        await window.showEndOverlay({ score, maxScore: maxScore || undefined });
      }
      return;
    }

    // Fallback: manipulate the legacy DOM-based popup
    const popup = safeGetElementById<HTMLElement>("endgame-popup");
    const scoreElement = safeGetElementById<HTMLElement>("popup-score");

    if (popup) {
      if (scoreElement) {
        scoreElement.textContent = String(score);
      }

      // Store metadata attributes commonly read by other modules
      popup.setAttribute("data-score", String(score));
      if (typeof maxScore === "number") {
        popup.setAttribute("data-max-score", String(maxScore));
      }

      // Reveal and focus for accessibility
      popup.classList.remove("hidden");
      popup.setAttribute("tabindex", "-1");
      try {
        popup.focus();
      } catch {
        // best-effort focus; ignore failures on older browsers
      }
    }
  } catch (error) {
    // Avoid crashing callers - log to console and swallow errors.
    // Game-level error handlers should pick up persistent issues.
    // Keep this lightweight to avoid adding dependencies.
    // eslint-disable-next-line no-console
    console.error("showEndgamePopup failed:", error);
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
