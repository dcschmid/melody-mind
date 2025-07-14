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

import { getAchievementLevel } from "./achievements/achievementUtils";
import { updateScoreDisplay } from "./game/scoreUtils";

// Type definitions for better type safety
interface TranslationData {
  [key: string]: string;
}

interface EndOverlayConfig {
  score: number;
  maxScore?: number;
  translations?: TranslationData;
}

// Utility functions with modern ES6+ features
const getElement = <T extends HTMLElement>(selector: string): T | null =>
  document.querySelector<T>(selector);

const getElementById = <T extends HTMLElement>(id: string): T | null =>
  document.getElementById(id) as T | null;

const parseTranslations = (data: string | null): TranslationData | null => {
  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as TranslationData;
  } catch (error) {
    console.error("Error parsing translation data:", error);
    return null;
  }
};

const getMotivationKey = (achievementLevel: string): string =>
  `game.end.motivation.${achievementLevel}`;

const announceToScreenReader = (text: string): void => {
  const announcement = getElementById<HTMLElement>("achievement-announcement");
  if (announcement) {
    announcement.textContent = text;
  }
};

/**
 * Update the motivation text using the global translation system
 * @param score - The player's score
 * @returns Promise<void>
 */
export const updateMotivationText = async (score: number): Promise<void> => {
  const motivationElement = getElementById<HTMLElement>("motivation-text");
  if (!motivationElement) {
    console.warn("Motivation text element not found");
    return;
  }

  // Get translations passed from server-side using modern destructuring
  const overlay = getElement<HTMLElement>("[data-translations]");
  const translationsData = overlay?.getAttribute("data-translations");

  if (!translationsData) {
    console.warn("Translation data not found, using empty fallback");
    motivationElement.textContent = "";
    return;
  }

  const translations = parseTranslations(translationsData);
  if (!translations) {
    motivationElement.textContent = "";
    return;
  }

  const achievementLevel = getAchievementLevel(score);
  const motivationKey = getMotivationKey(achievementLevel);
  const motivationText = translations[motivationKey];

  if (motivationText) {
    motivationElement.textContent = motivationText;
    announceToScreenReader(motivationText);
  } else {
    console.warn(`Missing translation for key: ${motivationKey}`);
    const fallbackText = translations["game.end.defaultMotivation"] || "";
    motivationElement.textContent = fallbackText;
  }
};

/**
 * Animate the progress bar to show the score percentage
 * @param score - The player's score
 * @param maxScore - The maximum possible score (default: 1000)
 * @returns Promise<void>
 */
export const animateProgressBar = async (score: number, maxScore: number = 1000): Promise<void> => {
  const progressBar = getElementById<HTMLElement>("score-bar");
  const progressContainer = getElement<HTMLElement>(".achievement-progress");

  if (!progressBar || !progressContainer) {
    console.warn("Progress bar elements not found");
    return;
  }

  // Calculate the percentage (0-100) using modern Math methods
  const percentage = Math.min(Math.max((score / maxScore) * 100, 0), 100);

  // Update ARIA attributes using modern optional chaining
  progressContainer.setAttribute?.("aria-valuenow", percentage.toString());

  // Use modern async/await with requestAnimationFrame
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        progressBar.style.transform = `scaleX(${percentage / 100})`;
        resolve();
      }, 300);
    });
  });
};

/**
 * Update the score display with animation
 * @param score - The score value to display
 * @returns Promise<void>
 */
export const updateEndOverlayScore = async (score: number): Promise<void> => {
  const scoreElement = getElementById<HTMLElement>("popup-score");
  if (scoreElement) {
    await updateScoreDisplay(score, scoreElement);
  } else {
    console.warn("Score element not found in EndOverlay");
  }
};

/**
 * Complete EndOverlay setup with score, animations, and motivation text
 * This function should be called when the overlay is shown to trigger all animations
 * @param config - Configuration object with score and optional parameters
 * @returns Promise<void>
 */
export const showEndOverlay = async (config: EndOverlayConfig): Promise<void> => {
  const { score, maxScore = 1000 } = config;

  // Use Promise.all for concurrent operations
  await Promise.all([
    updateEndOverlayScore(score),
    updateMotivationText(score),
    animateProgressBar(score, maxScore),
  ]);

  // Update the overlay data attribute for consistency
  const overlay = getElement<HTMLElement>("[data-score]");
  overlay?.setAttribute("data-score", score.toString());
};

/**
 * Initialize the EndOverlay component functionality
 * Sets up event listeners and initializes motivation text based on score
 * @returns Promise<void>
 */
export const initializeEndOverlay = async (): Promise<void> => {
  // Get the initial score from the overlay data attribute using modern destructuring
  const overlay = getElement<HTMLElement>("[data-score]");
  const score = parseInt(overlay?.getAttribute("data-score") || "0", 10);

  await updateMotivationText(score);

  // Set up global showEndOverlay function for game engines to use
  (globalThis as { showEndOverlay?: typeof showEndOverlay }).showEndOverlay = showEndOverlay;
};

/**
 * Set up EndOverlay functionality when DOM is ready
 * This function handles the initialization timing to ensure proper setup
 * @returns Promise<void>
 */
export const setupEndOverlay = async (): Promise<void> => {
  const initializeWhenReady = async (): Promise<void> => {
    if (document.readyState === "loading") {
      return new Promise<void>((resolve) => {
        document.addEventListener("DOMContentLoaded", async () => {
          await initializeEndOverlay();
          resolve();
        });
      });
    } else {
      // DOM is already loaded
      await initializeEndOverlay();
    }
  };

  await initializeWhenReady();
};

// Export a default function for easier imports
export default setupEndOverlay;
