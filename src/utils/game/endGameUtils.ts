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
  totalUserPoints: number;
  currentCategoryPointsValue: number;
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
 * @property {(score: number) => void} showGoldenLpPopup - Displays the golden LP achievement popup
 * @property {(score: number) => void} showEndgamePopup - Displays the regular end game popup
 */
interface EndGameUI {
  showGoldenLpPopup: (score: number) => void;
  showEndgamePopup: (score: number) => void;
}

/**
 * Handles the end game logic including score saving and UI updates
 * @async
 * @param {EndGameConfig} config - Configuration object containing game end state
 * @param {EndGameUI} ui - UI interface for displaying end game states
 * @param {EndGameCallbacks} [callbacks] - Optional callback functions
 * @throws {Error} When save operations fail
 */
export async function handleEndGame(
  config: EndGameConfig,
  ui: EndGameUI,
  callbacks?: EndGameCallbacks,
) {
  try {
    if (config.correctAnswers === config.totalRounds) {
      try {
        await Promise.all([saveGoldenLP(config), saveScoreToDB(config)]);
      } catch (error) {
        await QueueManager.addToQueue("score", {
          userId: config.userId,
          totalUserPoints: config.totalUserPoints + config.score,
          category: config.categoryName,
          categoryPoints: config.currentCategoryPointsValue + config.score,
        });

        await QueueManager.addToQueue("goldenLP", {
          userId: config.userId,
          category: config.categoryName,
          difficulty: config.difficulty,
        });

        callbacks?.onError?.(error as Error);
      }
      ui.showGoldenLpPopup(config.score);
    } else {
      try {
        await saveScoreToDB(config);
      } catch (error) {
        await QueueManager.addToQueue("score", {
          userId: config.userId,
          totalUserPoints: config.totalUserPoints + config.score,
          category: config.categoryName,
          categoryPoints: config.currentCategoryPointsValue + config.score,
        });

        callbacks?.onError?.(error as Error);
      }
      ui.showEndgamePopup(config.score);
    }
  } catch (error) {
    console.error("Fehler beim Beenden des Spiels:", error);
    callbacks?.onError?.(error as Error);
  }
}

/**
 * Saves the game score to the database
 * @async
 * @param {EndGameConfig} config - Configuration containing score data
 * @throws {Error} When the API call fails or returns an error
 * @returns {Promise<void>}
 */
async function saveScoreToDB({
  userId,
  totalUserPoints,
  categoryName,
  currentCategoryPointsValue,
  score,
}: EndGameConfig): Promise<void> {
  try {
    const response = await fetch(`/api/saveTotalUserPointsAndHighscore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        totalUserPoints: totalUserPoints + score,
        category: categoryName,
        categoryPoints: currentCategoryPointsValue + score,
      }),
    });

    if (!response.ok) {
      throw new Error("Fehler beim Speichern des Spielstands");
    }
  } catch (error) {
    console.error("Fehler beim Speichern des Scores:", error);
    throw error;
  }
}

/**
 * Saves a golden LP achievement to the database
 * @async
 * @param {EndGameConfig} config - Configuration containing achievement data
 * @throws {Error} When the API call fails or returns an error
 * @returns {Promise<void>}
 */
async function saveGoldenLP({
  userId,
  categoryName,
  difficulty,
}: EndGameConfig): Promise<void> {
  try {
    const response = await fetch(`/api/saveUserGoldenLP`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        genre: categoryName,
        difficulty,
      }),
    });

    if (!response.ok) {
      throw new Error("Fehler beim Speichern der goldenen Schallplatte");
    }
  } catch (error) {
    console.error("Fehler beim Speichern der goldenen LP:", error);
    throw error;
  }
}

/**
 * Zeigt das Endspiel-Popup an
 */
export function showEndgamePopup(score: number): void {
  stopAudio();
  const lang = getLangFromUrl(
    new URL(window.location.pathname, window.location.origin),
  );
  const t = useTranslations(lang);

  const scoreElement = document.getElementById("popup-score");
  const popup = document.getElementById("endgame-popup");

  if (scoreElement && popup) {
    scoreElement.textContent = t("popup.score", { score: score.toString() });
    popup.classList.remove("hidden");
  }
}

/**
 * Zeigt das Golden-LP-Popup an
 */
export function showGoldenLpPopup(score: number): void {
  stopAudio();
  const lang = getLangFromUrl(
    new URL(window.location.pathname, window.location.origin),
  );
  const t = useTranslations(lang);

  const scoreElement = document.getElementById("golden-lp-score");
  const popup = document.getElementById("golden-lp-popup");

  if (scoreElement && popup) {
    scoreElement.textContent = t("popup.golden.lp.score", {
      score: score.toString(),
    });
    popup.classList.remove("hidden");
  }
}

/**
 * Redirects to the game home page to start a new game
 * @returns {void}
 */
export function restartGame(): void {
  const currentLanguage = getCurrentLanguage();
  window.location.href = `/${currentLanguage}/gamehome`;
}
