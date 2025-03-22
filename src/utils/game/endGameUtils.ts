/**
 * End Game Utilities
 *
 * This module handles all end-of-game functionality for the music quiz game,
 * including score display, game summary, and navigation to new games.
 *
 * @module endGameUtils
 */

import { getCurrentLanguage } from "@utils/languageUtils";
import { stopAudio } from "../audio/audioControls";
import { getLangFromUrl, useTranslations } from "@utils/i18n";

/**
 * Configuration parameters for ending a game session
 *
 * @interface EndGameConfig
 */
export interface EndGameConfig {
  /** The unique identifier of the current user */
  userId: string;

  /** The display name of the game category/genre */
  categoryName: string;

  /** The difficulty level of the completed game (easy, medium, hard) */
  difficulty: string;

  /** Total number of rounds played in the game */
  totalRounds: number;

  /** Number of questions answered correctly */
  correctAnswers: number;

  /** Final score achieved in the game */
  score: number;

  /** Current language code (e.g., "en", "de") */
  language: string;
}

/**
 * Callback functions for the end game process
 *
 * @interface EndGameCallbacks
 */
export interface EndGameCallbacks {
  /**
   * Called when save operations complete successfully
   */
  onSaveComplete?: () => void;

  /**
   * Called when an error occurs during save operations
   * @param {Error} error - The error that occurred
   */
  onError?: (error: Error) => void;
}

/**
 * UI interface for handling game end states
 *
 * @interface EndGameUI
 */
export interface EndGameUI {
  /**
   * Displays the end game popup with final score and summary
   * @param {number} score - The final score to display
   */
  showEndgamePopup: (score: number) => void;
}

/**
 * Handles all end-of-game logic including UI updates and statistics
 *
 * This function manages the game completion process, including calculating
 * achievement rates, displaying appropriate UI elements, and handling any
 * necessary cleanup.
 *
 * @async
 * @param {EndGameConfig} config - Configuration object containing game end state
 * @param {EndGameUI} ui - UI interface for displaying end game states
 * @param {EndGameCallbacks} [callbacks] - Optional callback functions
 * @returns {Promise<void>}
 */
export async function handleEndGame(
  config: EndGameConfig,
  ui: EndGameUI,
  callbacks?: EndGameCallbacks,
): Promise<void> {
  try {
    // Calculate achievement rate as a percentage
    const achievementRate = Math.round(
      (config.correctAnswers / config.totalRounds) * 100,
    );

    // Log game results for analytics/debugging
    console.info("Game completed:", {
      category: config.categoryName,
      difficulty: config.difficulty,
      score: config.score,
      correctAnswers: config.correctAnswers,
      totalRounds: config.totalRounds,
      achievementRate: `${achievementRate}%`,
    });

    // Display the end game popup with score
    ui.showEndgamePopup(config.score);

    // Call success callback if provided
    callbacks?.onSaveComplete?.();
  } catch (error) {
    console.error("Error ending the game:", error);

    // Call error callback if provided
    callbacks?.onError?.(
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

/**
 * Displays the end game popup with final score and summary
 *
 * This function stops any playing audio, retrieves the current language
 * for localization, and updates the DOM to display the end game popup.
 *
 * @param {number} score - The final score to display
 * @returns {void}
 */
export function showEndgamePopup(score: number): void {
  // Stop any playing audio to ensure a clean game end
  stopAudio();

  // Get current language for localized messages
  const url = new URL(window.location.pathname, window.location.origin);
  const lang = getLangFromUrl(url);
  const t = useTranslations(lang);

  // Find and update the score display elements
  const scoreElement = document.getElementById("popup-score");
  const popup = document.getElementById("endgame-popup");

  if (scoreElement && popup) {
    // Update score display
    scoreElement.textContent = score.toString();

    // Store score as a data attribute for potential use by other components
    popup.setAttribute("data-score", score.toString());

    // Show the popup
    popup.classList.remove("hidden");

    // Set focus to the popup for accessibility
    popup.setAttribute("tabindex", "-1");
    popup.focus();
  } else {
    console.error("End game popup elements not found");
  }
}

/**
 * Redirects to the game home page to start a new game
 *
 * This function retrieves the current language and redirects the user
 * to the game home page, preserving language preferences.
 *
 * @returns {void}
 */
export function restartGame(): void {
  // Get the current language to maintain language settings during navigation
  const currentLanguage = getCurrentLanguage();

  // Redirect to game home page
  window.location.href = `/${currentLanguage}/gamehome`;
}

/**
 * Formats score data for sharing on social media or messaging apps
 *
 * @param {number} score - The final score achieved
 * @param {string} category - The game category/genre name
 * @param {string} difficulty - The difficulty level played
 * @returns {string} Formatted text for sharing
 */
export function formatScoreForSharing(
  score: number,
  category: string,
  difficulty: string,
): string {
  const url = new URL(window.location.pathname, window.location.origin);
  const lang = getLangFromUrl(url);
  const t = useTranslations(lang);

  // Create a user-friendly sharing message
  return `${t("game.share.message", { score: score.toString(), category, difficulty })} - Melody Mind`;
}
