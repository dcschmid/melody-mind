/**
 * @fileoverview EndOverlay utility functions
 * @description Client-side utilities for managing the end game modal functionality
 * including dynamic motivation text, focus management, and accessibility features.
 *
 * This module follows WCAG AAA accessibility standards and implements optimized
 * performance practices for smooth animations and minimal resource usage.
 *
 * @author MelodyMind Team
 * @version 1.0.0
 * @since 2025-06-03
 */

import { getAchievementLevel } from "./achievements/achievementUtils";
import { updateScoreDisplay } from "./game/scoreUtils";

/**
 * Update the motivation text using the global translation system
 * @param {number} score - The player's score
 * @returns {void}
 *
 * @example
 * ```typescript
 * updateMotivationText(750); // Updates text for "pro" level achievement
 * ```
 */
export function updateMotivationText(score: number): void {
  const motivationElement = document.getElementById("motivation-text");
  if (!motivationElement) {
    console.warn("Motivation text element not found");
    return;
  }

  // Get translations passed from server-side
  const translationsData = document
    .querySelector("[data-translations]")
    ?.getAttribute("data-translations");
  if (!translationsData) {
    console.warn("Translation data not found, using fallback text");
    motivationElement.textContent = "Danke fürs Spielen! Probiere eine weitere Runde.";
    return;
  }

  try {
    const translations = JSON.parse(translationsData);
    const achievementLevel = getAchievementLevel(score);
    const motivationKey = `game.end.motivation.${achievementLevel}`;

    // Get the motivation text from translations
    const motivationText = translations[motivationKey];

    if (motivationText) {
      motivationElement.textContent = motivationText;

      // Announce the motivation text to screen readers
      const announcement = document.getElementById("achievement-announcement");
      if (announcement) {
        announcement.textContent = motivationText;
      }
    } else {
      console.warn(`Missing translation for key: ${motivationKey}`);
      motivationElement.textContent =
        translations["game.end.defaultMotivation"] || "Danke fürs Spielen!";
    }
  } catch (error) {
    console.error("Error parsing translation data:", error);
    motivationElement.textContent = "Danke fürs Spielen! Probiere eine weitere Runde.";
  }
}

/**
 * Animate the progress bar to show the score percentage
 * @param {number} score - The player's score
 * @param {number} maxScore - The maximum possible score (default: 1000)
 * @returns {void}
 *
 * @example
 * ```typescript
 * animateProgressBar(750, 1000); // Animates to 75%
 * ```
 */
export function animateProgressBar(score: number, maxScore: number = 1000): void {
  const progressBar = document.getElementById("score-bar");
  const progressContainer = document.querySelector(".achievement-progress");

  if (!progressBar || !progressContainer) {
    console.warn("Progress bar elements not found");
    return;
  }

  // Calculate the percentage (0-100)
  const percentage = Math.min(Math.max((score / maxScore) * 100, 0), 100);

  // Update ARIA attributes
  if (progressContainer.hasAttribute("aria-valuenow")) {
    progressContainer.setAttribute("aria-valuenow", percentage.toString());
  }

  // Trigger the animation with a slight delay for visual effect
  requestAnimationFrame(() => {
    setTimeout(() => {
      progressBar.style.transform = `scaleX(${percentage / 100})`;
    }, 300); // Small delay to let the overlay fully appear first
  });
}

/**
 * Update the score display with animation
 * @param {number} score - The score value to display
 * @returns {void}
 *
 * @example
 * ```typescript
 * updateEndOverlayScore(750); // Updates and animates the score display
 * ```
 */
export function updateEndOverlayScore(score: number): void {
  const scoreElement = document.getElementById("popup-score");
  if (scoreElement) {
    updateScoreDisplay(score, scoreElement);
  } else {
    console.warn("Score element not found in EndOverlay");
  }
}

/**
 * Complete EndOverlay setup with score, animations, and motivation text
 * This function should be called when the overlay is shown to trigger all animations
 * @param {number} score - The player's final score
 * @param {number} maxScore - The maximum possible score (default: 1000)
 * @returns {void}
 *
 * @example
 * ```typescript
 * showEndOverlay(750); // Shows overlay with full animations
 * ```
 */
export function showEndOverlay(score: number, maxScore: number = 1000): void {
  // Update the score display with animation
  updateEndOverlayScore(score);

  // Update motivation text based on achievement level
  updateMotivationText(score);

  // Animate the progress bar
  animateProgressBar(score, maxScore);

  // Update the overlay data attribute for consistency
  const overlay = document.querySelector("[data-score]");
  if (overlay) {
    overlay.setAttribute("data-score", score.toString());
  }
}

/**
 * Initialize the EndOverlay component functionality
 * Sets up event listeners and initializes motivation text based on score
 * @returns {void}
 *
 * @example
 * ```typescript
 * initializeEndOverlay(); // Call after DOM is loaded
 * ```
 */
export function initializeEndOverlay(): void {
  // Get the initial score from the overlay data attribute
  const overlay = document.querySelector("[data-score]");
  if (overlay) {
    const score = parseInt(overlay.getAttribute("data-score") || "0", 10);
    updateMotivationText(score);
  }

  // Set up global showEndOverlay function for game engines to use
  (globalThis as { showEndOverlay?: typeof showEndOverlay }).showEndOverlay = showEndOverlay;
}

/**
 * Set up EndOverlay functionality when DOM is ready
 * This function handles the initialization timing to ensure proper setup
 * @returns {void}
 */
export function setupEndOverlay(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeEndOverlay);
  } else {
    // DOM is already loaded
    initializeEndOverlay();
  }
}
