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

/* window.showEndOverlay is intentionally declared by the dedicated overlay module
   at /src/utils/endOverlay.ts. We avoid declaring it here to prevent conflicting
   subsequent declarations that differ between modules. */

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
/**
 * Show the end-of-game popup / overlay.
 *
 * This function delegates to a richer global overlay when available and otherwise
 * reveals a fallback DOM popup. The implementation is split into small helpers
 * to keep complexity and nesting low.
 *
 * @param {number} score - Final score to display in the overlay.
 * @param {number} [maxScore] - Optional maximum score (used if overlay supports it).
 */

/**
 *
 */
export async function showEndgamePopup(score: number, maxScore?: number): Promise<void> {
  // Lightweight debug log (non-fatal)
  try {
    if (import.meta.env?.DEV) {
       
      console.warn("[gameUI] showEndgamePopup called (debug)", { score, maxScore });
    }
  } catch (e) {
    void e;
  }

  // 1) Try to invoke global richer overlay if available
  const invokedGlobal = await invokeGlobalOverlayIfAvailable(score, maxScore);
  if (invokedGlobal) {
    // Ensure DOM fallback is visible as robust safety net
    try {
      const popup = safeGetElementById<HTMLElement>("endgame-popup");
      revealEndOverlayDom(popup);
    } catch (e) {
      void e;
    }
    return;
  }

  // 2) Otherwise reveal the legacy DOM popup (fallback)
  try {
    revealFallbackPopup(score, maxScore);
  } catch (e) {
    try {
      // If everything failed, log centrally but do not throw
      if (typeof console !== "undefined" && typeof console.error === "function") {
         
        console.error("showEndgamePopup failed to reveal fallback popup:", e);
      }
    } catch (err) {
      void err;
    }
  }
}

/* Helper: attempt to call a richer global overlay if present.
 * Returns true if an external overlay was invoked, false otherwise.
 */
async function invokeGlobalOverlayIfAvailable(score: number, maxScore?: number): Promise<boolean> {
  try {
    if (typeof window === "undefined") {
      return false;
    }

    const maybe = (
      window as unknown as Window & {
        showEndOverlay?: (
          configOrScore: { score: number; maxScore?: number } | number,
          maxScore?: number
        ) => Promise<void> | void;
      }
    ).showEndOverlay;

    if (typeof maybe !== "function") {
      return false;
    }

    // Try to call it using the numeric or config API
    try {
      if (typeof maxScore === "number") {
        await maybe(score, maxScore);
      } else {
        await maybe({ score, maxScore: maxScore || undefined });
      }
      return true;
    } catch (err) {
      try {
        console.warn("[gameUI] global showEndOverlay threw:", err);
      } catch {
        /* ignore */
      }
      return false;
    }
  } catch (e) {
    void e;
    return false;
  }
}

/* Helper: reveal the fallback DOM popup with minimal responsibilities */
function revealFallbackPopup(score: number, maxScore?: number): void {
  const popup = safeGetElementById<HTMLElement>("endgame-popup");
  const scoreElement = safeGetElementById<HTMLElement>("popup-score");

  if (popup && scoreElement) {
    // Update score text and attributes
    try {
      scoreElement.textContent = String(score);
    } catch (e) {
      void e;
    }

    try {
      popup.setAttribute("data-score", String(score));
      if (typeof maxScore === "number") {
        popup.setAttribute("data-max-score", String(maxScore));
      }
    } catch (e) {
      void e;
    }

    // Reveal safely
    try {
      revealEndOverlayDom(popup);
    } catch (e) {
      void e;
    }
    return;
  }

  // If the expected elements are missing, attempt to log and no-op
  try {
    if (import.meta.env?.DEV) {
      console.warn("[gameUI] revealFallbackPopup: missing popup or scoreElement (debug)");
    }
  } catch (e) {
    void e;
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
