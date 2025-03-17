import { getCurrentLanguage } from "@utils/languageUtils";
import { stopAudio } from "../audio/audioControls";
import { QueueManager } from "../queue/queueManager";
import { getLangFromUrl, useTranslations } from "@utils/i18n";

/**
 * Configuration for ending a game session
 * @interface EndGameConfig
 * @property {string} userId - The unique identifier of the user
 * @property {string} categoryName - The name of the game category/genre
 * @property {string} difficulty - The difficulty level of the game
 * @property {number} totalRounds - Total number of rounds in the game
 * @property {number} correctAnswers - Number of correctly answered questions
 * @property {number} score - Current game score
 * @property {number} totalUserPoints - Total points of the user across all games
 * @property {number} currentCategoryPointsValue - Current points in this category
 */
interface EndGameConfig {
  userId: string;
  categoryName: string;
  difficulty: string;
  totalRounds: number;
  correctAnswers: number;
  score: number;
  language: string;
}

/**
 * Callback functions for the end game process
 * @interface EndGameCallbacks
 * @property {() => void} [onSaveComplete] - Called when save operations complete successfully
 * @property {(error: Error) => void} [onError] - Called when an error occurs during save operations
 */
interface EndGameCallbacks {
  onSaveComplete?: () => void;
  onError?: (error: Error) => void;
}

/**
 * UI interface for handling game end states
 * @interface EndGameUI
 * @property {(score: number) => void} showEndgamePopup - Displays the regular end game popup
 */
interface EndGameUI {
  showEndgamePopup: (score: number) => void;
}

/**
 * Handles the end game logic including UI updates
 * Database saving functionality has been removed
 * @async
 * @param {EndGameConfig} config - Configuration object containing game end state
 * @param {EndGameUI} ui - UI interface for displaying end game states
 * @param {EndGameCallbacks} [callbacks] - Optional callback functions
 */
export async function handleEndGame(
  config: EndGameConfig,
  ui: EndGameUI,
  callbacks?: EndGameCallbacks,
) {
  try {
    // Always show regular end game popup
    ui.showEndgamePopup(config.score);
  } catch (error) {
    console.error("Fehler beim Beenden des Spiels:", error);
    callbacks?.onError?.(error as Error);
  }
}

/**
 * Zeigt das Endspiel-Popup an
 */
export function showEndgamePopup(score: number): void {
  stopAudio();
  const url = new URL(window.location.pathname, window.location.origin);
  const lang = getLangFromUrl(url);
  const t = useTranslations(lang);

  const scoreElement = document.getElementById("popup-score");
  const popup = document.getElementById("endgame-popup");

  if (scoreElement && popup) {
    scoreElement.textContent = score.toString();
    popup.classList.remove("hidden");
  }
}

// Golden LP popup function removed

/**
 * Redirects to the game home page to start a new game
 * @returns {void}
 */
export function restartGame(): void {
  const currentLanguage = getCurrentLanguage();
  window.location.href = `/${currentLanguage}/gamehome`;
}
