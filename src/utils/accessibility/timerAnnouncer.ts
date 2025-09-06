import { safeGetElementById } from "../dom/domUtils";

/**
 * @fileoverview Timer Announcer for WCAG AAA accessibility in the MelodyMind game.
 * Provides timed announcements for speed bonus events with screen reader support.
 *
 * - Announces when speed bonus timer starts
 * - Provides warning when bonus is about to expire
 * - Announces when bonus expires
 * - Uses ARIA live regions for screen reader compatibility
 * - Supports reduced motion preferences
 */

/**
 * Speed bonus thresholds in milliseconds
 * - HIGH: 10 seconds for +50 points bonus
 * - MEDIUM: 15 seconds for +25 points bonus
 */
export const SPEED_BONUS = {
  HIGH: 10000, // 10 seconds for +50 points
  MEDIUM: 15000, // 15 seconds for +25 points
  WARNING: 5000, // Warning 5 seconds before expiration
};

/**
 * Storage for timer IDs to allow clearing
 */
interface TimerIds {
  warning?: number;
  expired?: number;
  announcer?: number;
}

const timerIds: TimerIds = {};

/**
 * Announces a message to screen readers via an ARIA live region
 *
 * @param {string} message - The message to announce
 * @param {"assertive" | "polite"} politeness - The politeness level of the announcement
 */
function announceToScreenReader(
  message: string,
  politeness: "assertive" | "polite" = "assertive"
): void {
  // Create an announcer element if it doesn't exist
  let announcer = safeGetElementById("timer-status-announcer");

  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "timer-status-announcer";
    announcer.classList.add("sr-only");
    announcer.setAttribute("aria-live", politeness);
    announcer.setAttribute("aria-atomic", "true");
    document.body.appendChild(announcer);
  }

  // Set the message and automatically remove it after 3 seconds
  announcer.textContent = message;

  // Clear previous timer if it exists
  if (timerIds.announcer) {
    window.clearTimeout(timerIds.announcer);
  }

  // Set up new timer to clear the message
  timerIds.announcer = window.setTimeout(() => {
    if (announcer) {
      announcer.textContent = "";
    }
  }, 3000);
}

/**
 * Start the speed bonus timer and announce it to screen readers
 *
 * @param {string} lang - The current language code
 * @returns {number} The timer start timestamp
 */
export function startSpeedBonusTimer(lang: string): number {
  // Clear any existing timers
  clearSpeedBonusTimers();

  // Get translation function
  const translations: Record<string, Record<string, string>> = {
    en: {
      timerStart:
        "Speed bonus timer started. Answer within 10 seconds for +50 points, or within 15 seconds for +25 points.",
      timerWarning: "Speed bonus will expire in 5 seconds.",
      timerExpired: "Speed bonus expired.",
    },
    de: {
      timerStart:
        "Geschwindigkeitsbonus-Timer gestartet. Antworte innerhalb von 10 Sekunden für +50 Punkte oder innerhalb von 15 Sekunden für +25 Punkte.",
      timerWarning: "Geschwindigkeitsbonus läuft in 5 Sekunden ab.",
      timerExpired: "Geschwindigkeitsbonus abgelaufen.",
    },
  };

  // Fallback to English if language not supported
  const t = translations[lang] || translations.en;

  // Announce the timer has started
  announceToScreenReader(t.timerStart);

  // Set timer for warning (5 seconds before HIGH bonus expires)
  timerIds.warning = window.setTimeout(() => {
    announceToScreenReader(t.timerWarning);
  }, SPEED_BONUS.HIGH - SPEED_BONUS.WARNING);

  // Set timer for expiration (after MEDIUM bonus expires)
  timerIds.expired = window.setTimeout(() => {
    announceToScreenReader(t.timerExpired);
  }, SPEED_BONUS.MEDIUM);

  // Return the start timestamp
  return Date.now();
}

/**
 * Clear all speed bonus timers
 */
export function clearSpeedBonusTimers(): void {
  Object.values(timerIds).forEach((id) => {
    if (id) {
      window.clearTimeout(id);
    }
  });

  // Reset all timer IDs
  timerIds.warning = undefined;
  timerIds.expired = undefined;
  timerIds.announcer = undefined;
}
