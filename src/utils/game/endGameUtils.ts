/**
 * End Game Utilities
 *
 * This module handles all end-of-game functionality for the music quiz game,
 * including score display, game summary, and navigation to new games.
 *
 * @module endGameUtils
 */

// Import types and utilities
import { getLangFromUrl, useTranslations } from "../../utils/i18n.ts";
import { safeGetElementById } from "../dom/domUtils";
import { handleGameError } from "../error/errorHandlingUtils";

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
/**
 * Saves the game result to the database
 *
 * @param {EndGameConfig} config - Configuration object containing game end state
 * @returns {Promise<void>}
 */
/**
 * Note: Game saving functionality removed - no longer needed
 *
 * @param {EndGameConfig} config - Konfigurationsobjekt mit dem Spielendstatus
 * @returns {Promise<string>} - Der Spielmodus (quiz oder chronology)
 */
async function saveGameResult(config: EndGameConfig): Promise<string> {
  // Bestimme den Spielmodus basierend auf dem URL-Pfad als Fallback
  return window.location.pathname.includes("/game-") ? "quiz" : "chronology";
}

/**
 * Show loading state during end game processing
 */
function showEndGameLoading(): void {
  // Get current language for localized text
  const currentLang = document.documentElement.lang || "en";

  // Define localized loading texts
  const loadingTexts = {
    en: {
      processing: "Processing your results...",
      calculating: "Calculating achievements and saving score",
    },
    de: {
      processing: "Verarbeite deine Ergebnisse...",
      calculating: "Berechne Erfolge und speichere Punktzahl",
    },
    es: {
      processing: "Procesando tus resultados...",
      calculating: "Calculando logros y guardando puntuación",
    },
    fr: {
      processing: "Traitement de vos résultats...",
      calculating: "Calcul des succès et sauvegarde du score",
    },
    it: {
      processing: "Elaborazione dei tuoi risultati...",
      calculating: "Calcolo dei successi e salvataggio del punteggio",
    },
    pt: {
      processing: "Processando seus resultados...",
      calculating: "Calculando conquistas e salvando pontuação",
    },
    da: {
      processing: "Behandler dine resultater...",
      calculating: "Beregner præstationer og gemmer score",
    },
    nl: {
      processing: "Verwerken van je resultaten...",
      calculating: "Berekenen van prestaties en opslaan van score",
    },
    sv: {
      processing: "Bearbetar dina resultat...",
      calculating: "Beräknar prestationer och sparar poäng",
    },
    fi: {
      processing: "Käsitellään tuloksiasi...",
      calculating: "Lasketaan saavutuksia ja tallennetaan pisteet",
    },
  };

  const texts = loadingTexts[currentLang] || loadingTexts.en;

  // Create and show a loading overlay
  const loadingOverlay = document.createElement("div");
  loadingOverlay.id = "endgame-loading-overlay";
  loadingOverlay.className = "endgame-loading-overlay";
  loadingOverlay.innerHTML = `
    <div class="endgame-loading-content">
      <div class="endgame-loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p class="endgame-loading-text">${texts.processing}</p>
      <p class="endgame-loading-subtext" id="endgame-loading-subtext">${texts.calculating}</p>
    </div>
  `;

  // Add styles
  const style = document.createElement("style");
  style.textContent = `
    .endgame-loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(5px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      animation: fadeIn 0.3s ease-out forwards;
    }

    .endgame-loading-content {
      text-align: center;
      color: white;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      max-width: 400px;
      width: 90%;
    }

    .endgame-loading-spinner {
      position: relative;
      display: inline-block;
      width: 80px;
      height: 80px;
      margin-bottom: 1rem;
    }

    .spinner-ring {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 64px;
      height: 64px;
      margin: 8px;
      border: 8px solid #fff;
      border-radius: 50%;
      animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: #fff transparent transparent transparent;
    }

    .spinner-ring:nth-child(1) { animation-delay: -0.45s; }
    .spinner-ring:nth-child(2) { animation-delay: -0.3s; }
    .spinner-ring:nth-child(3) { animation-delay: -0.15s; }

    .endgame-loading-text {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #fff;
    }

    .endgame-loading-subtext {
      font-size: 0.9rem;
      margin: 0;
      color: rgba(255, 255, 255, 0.8);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Insert the loading overlay
  document.head.appendChild(style);
  document.body.appendChild(loadingOverlay);
}

/**
 * Update the loading text to show validation progress
 */
function updateLoadingText(text: string): void {
  const subtextElement = document.getElementById("endgame-loading-subtext");
  if (subtextElement) {
    subtextElement.textContent = text;
  }
}

/**
 * Wait for all data to be properly validated before showing EndOverlay
 */
async function waitForDataValidation(_config: EndGameConfig): Promise<void> {
  const maxWaitTime = 5000; // Maximum wait time: 5 seconds
  const checkInterval = 200; // Check every 200ms
  const startTime = Date.now();

  // Get current language for localized validation texts
  const currentLang = document.documentElement.lang || "en";
  const validationTexts = {
    en: {
      validating: "Validating game data...",
      checkingElements: "Checking interface elements...",
      finalizing: "Finalizing results...",
    },
    de: {
      validating: "Validiere Spieldaten...",
      checkingElements: "Überprüfe Interface-Elemente...",
      finalizing: "Schließe Ergebnisse ab...",
    },
    es: {
      validating: "Validando datos del juego...",
      checkingElements: "Verificando elementos de interfaz...",
      finalizing: "Finalizando resultados...",
    },
    fr: {
      validating: "Validation des données de jeu...",
      checkingElements: "Vérification des éléments d'interface...",
      finalizing: "Finalisation des résultats...",
    },
    it: {
      validating: "Validazione dati di gioco...",
      checkingElements: "Controllo elementi interfaccia...",
      finalizing: "Finalizzazione risultati...",
    },
    pt: {
      validating: "Validando dados do jogo...",
      checkingElements: "Verificando elementos da interface...",
      finalizing: "Finalizando resultados...",
    },
    da: {
      validating: "Validerer spildata...",
      checkingElements: "Tjekker interface-elementer...",
      finalizing: "Færdiggør resultater...",
    },
    nl: {
      validating: "Valideren van spelgegevens...",
      checkingElements: "Controleren interface-elementen...",
      finalizing: "Afronden van resultaten...",
    },
    sv: {
      validating: "Validerar speldata...",
      checkingElements: "Kontrollerar gränssnittselement...",
      finalizing: "Slutför resultat...",
    },
    fi: {
      validating: "Vahvistetaan pelitietoja...",
      checkingElements: "Tarkistetaan käyttöliittymäelementtejä...",
      finalizing: "Viimeistellään tulokset...",
    },
  };

  const texts = validationTexts[currentLang] || validationTexts.en;
  updateLoadingText(texts.validating);

  return new Promise((resolve, _reject) => {
    const checkData = () => {
      const elapsed = Date.now() - startTime;

      // Timeout protection
      if (elapsed > maxWaitTime) {
        updateLoadingText(texts.finalizing);
        // Force resolve after timeout
        setTimeout(() => resolve(), 300);
        return;
      }

      // Update loading text based on elapsed time
      if (elapsed > 2000) {
        updateLoadingText(texts.checkingElements);
      } else if (elapsed > 4000) {
        updateLoadingText(texts.finalizing);
      }

      // Check if all required data is available and valid
      const validationChecks = [
        // 1. Check if popup element exists
        () => {
          const popup =
            document.querySelector("#endgame-popup") ||
            document.querySelector("#end-overlay") ||
            document.querySelector(".popup[data-score]");
          const exists = popup !== null;
          return exists;
        },

        // 2. Check if score is correctly set in data attributes
        () => {
          const popup =
            document.querySelector("#endgame-popup") ||
            document.querySelector("#end-overlay") ||
            document.querySelector(".popup[data-score]");
          if (!popup) {
            return false;
          }

          const scoreAttr = popup.getAttribute("data-score");
          const score = parseInt(scoreAttr || "0", 10);
          const isValid = !isNaN(score) && score >= 0; // Allow 0 score
          return isValid;
        },

        // 3. Check if category and difficulty are set (more lenient)
        () => {
          const popup =
            document.querySelector("#endgame-popup") ||
            document.querySelector("#end-overlay") ||
            document.querySelector(".popup[data-score]");
          if (!popup) {
            return false;
          }

          const category = popup.getAttribute("data-category");
          const difficulty = popup.getAttribute("data-difficulty");
          const isValid =
            category && difficulty && category.trim().length > 0 && difficulty.trim().length > 0;
          return isValid;
        },
      ];

      // Run all validation checks with detailed logging
      const checkResults = validationChecks.map((check, index) => {
        try {
          const result = check();
          return { index, result };
        } catch (error) {
          return { index, result: false };
        }
      });

      const allValid = checkResults.every(({ result }) => result);

      // Log failed checks for debugging
      if (!allValid) {
        // Log failed validation checks for debugging
      }

      if (allValid) {
        updateLoadingText(texts.finalizing);
        // Small delay to show finalizing message
        setTimeout(() => resolve(), 200);
      } else {
        // Continue checking
        setTimeout(checkData, checkInterval);
      }
    };

    // Start checking
    checkData();
  });
}

/**
 * Hide loading state after end game processing
 */
function hideEndGameLoading(): void {
  const loadingOverlay = safeGetElementById<HTMLElement>("endgame-loading-overlay");
  if (loadingOverlay) {
    // Try smooth animation first
    try {
      loadingOverlay.style.animation = "fadeOut 0.3s ease-out forwards";

      // Add fadeOut animation
      const style = document.createElement("style");
      style.textContent = `
        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.9); }
        }
      `;
      document.head.appendChild(style);

      setTimeout(() => {
        if (loadingOverlay.parentNode) {
          loadingOverlay.remove();
        }
      }, 300);
    } catch (error) {
      // Fallback: immediate removal
      loadingOverlay.remove();
    }
  } else {
    // Loading overlay not found
  }
}

/**
 * Handle end game with loading state
 */
export async function handleEndGame(
  config: EndGameConfig,
  ui: EndGameUI,
  callbacks?: EndGameCallbacks
): Promise<void> {
  try {
    // Show loading state before processing
    showEndGameLoading();

    // Calculate achievement rate as a percentage
    // const achievementRate = Math.round((config.correctAnswers / config.totalRounds) * 100);

    // Log game results for analytics/debugging
    // TODO: Add analytics logging here

    // Save game result to the database via API
    // Der API-Endpunkt kümmert sich jetzt um alle Datenbankoperationen
    // (Spielergebnis, Benutzerstatistiken und Highscore)
    await saveGameResult(config);

    // Wait for all data to be properly set and validated
    try {
      await waitForDataValidation(config);
    } catch (error) {
    }

    // Hide loading state
    hideEndGameLoading();

    // Small delay to ensure loading state is hidden
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Display the end game popup with score
    ui.showEndgamePopup(config.score);

    // Absolute fallback: ensure loading is hidden after 2 seconds
    setTimeout(() => {
      const loadingOverlay = safeGetElementById<HTMLElement>("endgame-loading-overlay");
      if (loadingOverlay) {
        loadingOverlay.remove();
      }
    }, 2000);

    // Call success callback if provided
    callbacks?.onSaveComplete?.();
  } catch (error) {
    handleGameError(error, "game ending");

    // Hide loading state in case of error
    hideEndGameLoading();

    // Force remove loading overlay in case of error
    setTimeout(() => {
      const loadingOverlay = safeGetElementById<HTMLElement>("endgame-loading-overlay");
      if (loadingOverlay) {
        loadingOverlay.remove();
      }
    }, 100);

    // Display the end game popup with score even on error
    // Wait a bit to let the UI settle
    setTimeout(() => {
      ui.showEndgamePopup(config.score);
    }, 200);

    // Call error callback if provided
    callbacks?.onError?.(error instanceof Error ? error : new Error(String(error)));
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
  // Get current language for localized messages
  // const url = new URL(window.location.pathname, window.location.origin);
  // const _lang = getLangFromUrl(url); // Removed unused variable
  // Explicitly cast lang to string to satisfy TypeScript
  // const t = useTranslations(String(lang));

  // Find and update the score display elements
  const scoreElement = safeGetElementById<HTMLElement>("popup-score");
  const popup = safeGetElementById<HTMLElement>("endgame-popup");

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
    handleGameError(new Error("End game popup elements not found"), "end game popup display");
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
  const currentLanguage = getLangFromUrl(new URL(window.location.pathname, window.location.origin));

  // Redirect to game home page
  window.location.href = `/${String(currentLanguage)}/gamehome`;
}

/**
 * Formats score data for sharing on social media or messaging apps
 *
 * @param {number} score - The final score achieved
 * @param {string} category - The game category/genre name
 * @param {string} difficulty - The difficulty level played
 * @returns {string} Formatted text for sharing
 */
export function formatScoreForSharing(score: number, category: string, difficulty: string): string {
  const url = new URL(window.location.pathname, window.location.origin);
  const lang = getLangFromUrl(url);
  // Explicitly cast lang to string to satisfy TypeScript
  const t = useTranslations(lang as string);

  // Create a user-friendly sharing message
  return `${t("game.share.message", { score: score.toString(), category, difficulty })} - Melody Mind`;
}
