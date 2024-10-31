import { stopAudio } from "../audio/audioControls";

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

interface EndGameCallbacks {
  onSaveComplete?: () => void;
  onError?: (error: Error) => void;
}

interface EndGameUI {
  showGoldenLpPopup: () => void;
  showEndgamePopup: () => void;
}

/**
 * Verwaltet das Spielende und die damit verbundenen Aktionen
 */
export async function handleEndGame(
  config: EndGameConfig,
  ui: EndGameUI,
  callbacks?: EndGameCallbacks,
) {
  try {
    if (config.correctAnswers === config.totalRounds) {
      await Promise.all([saveGoldenLP(config), saveScoreToDB(config)]);
      ui.showGoldenLpPopup();
    } else {
      await saveScoreToDB(config);
      ui.showEndgamePopup();
    }

    callbacks?.onSaveComplete?.();
  } catch (error) {
    console.error("Fehler beim Beenden des Spiels:", error);
    callbacks?.onError?.(error as Error);
  }
}

/**
 * Speichert den Spielstand in der Datenbank
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
 * Speichert die goldene Schallplatte
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

  const scoreElement = document.getElementById("popup-score");
  const popup = document.getElementById("endgame-popup");

  if (scoreElement && popup) {
    scoreElement.textContent = score.toString();
    popup.classList.remove("hidden");
  }
}

/**
 * Zeigt das Golden-LP-Popup an
 */
export function showGoldenLpPopup(score: number): void {
  stopAudio();

  const scoreElement = document.getElementById("golden-lp-score");
  const popup = document.getElementById("golden-lp-popup");

  if (scoreElement && popup) {
    scoreElement.textContent = score.toString();
    popup.classList.remove("hidden");
  }
}

/**
 * Startet ein neues Spiel
 */
export function restartGame(): void {
  window.location.href = "/gamehome";
}
