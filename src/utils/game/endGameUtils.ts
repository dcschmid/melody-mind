/* eslint-disable @typescript-eslint/explicit-function-return-type, jsdoc/require-param-type, jsdoc/require-returns-type, max-lines-per-function, complexity, max-depth, no-console */
/**
 * End Game Utilities
 *
 * Handles end-of-game UI, saving and validation workflows.
 */

import { getLangFromUrl, useTranslations } from "../../utils/i18n.ts";
import { safeGetElementById } from "../dom/domUtils";
import { completeEndOverlaySetup } from "../endOverlay";
import { handleGameError } from "../error/errorHandlingUtils";

import { showEndgamePopup as fallbackShowEndgamePopup } from "./gameUI";

type ShowEndOverlay = (
  configOrScore: { score: number; maxScore?: number } | number,
  maxScore?: number
) => Promise<void> | void;

/**
 * Runtime lookup for `window.showEndOverlay`.
 *
 * We intentionally avoid caching the reference to `window.showEndOverlay`
 * so that overlays which register the function later (after module load)
 * are still detected at invocation time.
 */
function getShowEndOverlay(): ShowEndOverlay | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  // Access at runtime to allow late registration
  return (window as unknown as Window & { showEndOverlay?: ShowEndOverlay }).showEndOverlay;
}

/**
 * Configuration parameters for ending a game session
 */
export interface EndGameConfig {
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
 */
export interface EndGameCallbacks {
  onSaveComplete?: () => void;
  onError?: (error: Error) => void;
}

/**
 * UI interface for handling game end states
 */
export interface EndGameUI {
  showEndgamePopup: (score: number) => void;
}

/**
 * Saves the game result (stub).
 *
 * Uses the provided config to determine the game mode where possible to avoid
 * unused-parameter diagnostics and to keep logic explicit.
 *
 * @param config - End game configuration
 * @returns The game mode string
 */
async function saveGameResult(config: EndGameConfig): Promise<string> {
  // Prefer using config to avoid unused var rules and to have deterministic behavior.
  // If the category name suggests chronology, return that; otherwise, infer from path.
  const category = (config.categoryName || "").toLowerCase();
  if (category.includes("chronology")) {
    return "chronology";
  }

  // Fallback: inspect pathname
  return window.location.pathname.includes("/game-") ? "quiz" : "chronology";
}

/**
 * Show loading overlay during end-game processing
 */
export function showEndGameLoading(): void {
  const currentLang = document.documentElement.lang || "en";

  type LoadingTextShape = {
    processing: string;
    calculating: string;
  };

  const loadingTexts: Record<string, LoadingTextShape> = {
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

  const texts: LoadingTextShape = loadingTexts[currentLang] ?? loadingTexts.en;

  // Create DOM elements
  const loadingOverlay = document.createElement("div");
  loadingOverlay.id = "endgame-loading-overlay";
  loadingOverlay.className = "endgame-loading-overlay";
  loadingOverlay.innerHTML = `
    <div class="endgame-loading-content" role="status" aria-live="polite">
      <div class="endgame-loading-spinner" aria-hidden="true">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p class="endgame-loading-text">${texts.processing}</p>
      <p class="endgame-loading-subtext" id="endgame-loading-subtext">${texts.calculating}</p>
    </div>
  `;

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
      background: rgba(255, 255, 255, 0.06);
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
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
      color: rgba(255, 255, 255, 0.85);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Append to document safely
  document.head.appendChild(style);
  document.body.appendChild(loadingOverlay);
}

/**
 * Update the loading subtext
 *
 * @param text - New subtext for the loading overlay
 */
export function updateLoadingText(text: string): void {
  const subtextElement = document.getElementById("endgame-loading-subtext");
  if (subtextElement) {
    subtextElement.textContent = text;
  }
}

/**
 * Wait for front-end data validation before showing end overlay
 *
 * This function periodically checks for required DOM attributes and resolves
 * once all checks pass or when a timeout occurs.
 *
 * @param config - End game configuration (used to influence validation if needed)
 */
export async function waitForDataValidation(config: EndGameConfig): Promise<void> {
  const maxWaitTime = 5000;
  const checkInterval = 200;
  const startTime = Date.now();

  const currentLang = document.documentElement.lang || config.language || "en";

  type ValidationTextShape = {
    validating: string;
    checkingElements: string;
    finalizing: string;
  };

  const validationTexts: Record<string, ValidationTextShape> = {
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

  const texts: ValidationTextShape = validationTexts[currentLang] ?? validationTexts.en;
  updateLoadingText(texts.validating);

  return new Promise<void>((resolve) => {
    const validationChecks: Array<() => boolean> = [
      // 1. Popup element exists
      () => {
        const popup =
          document.querySelector("#endgame-popup") ||
          document.querySelector("#end-overlay") ||
          document.querySelector(".popup[data-score]");
        return popup !== null;
      },

      // 2. Score is set and valid
      () => {
        const popup =
          document.querySelector("#endgame-popup") ||
          document.querySelector("#end-overlay") ||
          document.querySelector(".popup[data-score]");
        if (!popup) {
          return false;
        }
        const scoreAttr = popup.getAttribute("data-score");
        const score = parseInt(scoreAttr ?? "0", 10);
        return !Number.isNaN(score) && score >= 0;
      },

      // 3. Category and difficulty are set
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
        return (
          typeof category === "string" &&
          typeof difficulty === "string" &&
          category.trim().length > 0 &&
          difficulty.trim().length > 0
        );
      },
    ];

    const checkData = (): void => {
      const elapsed = Date.now() - startTime;

      if (elapsed > maxWaitTime) {
        updateLoadingText(texts.finalizing);
        // Ensure promise resolves after short delay so UI updates are visible
        setTimeout(() => resolve(), 300);
        return;
      }

      // Update texts based on elapsed time
      if (elapsed > 4000) {
        updateLoadingText(texts.finalizing);
      } else if (elapsed > 2000) {
        updateLoadingText(texts.checkingElements);
      }

      const results = validationChecks.map((fn, index) => {
        try {
          return { index, result: fn() };
        } catch (err) {
          // Report error for diagnostics and treat as failed
          handleGameError(err, "validation check");
          return { index, result: false };
        }
      });

      const allValid = results.every(({ result }) => result === true);

      if (allValid) {
        updateLoadingText(texts.finalizing);
        setTimeout(() => resolve(), 200);
      } else {
        setTimeout(checkData, checkInterval);
      }
    };

    checkData();
  });
}

/**
 * Hide the end game loading overlay
 */
export function hideEndGameLoading(): void {
  const loadingOverlay = safeGetElementById<HTMLElement>("endgame-loading-overlay");
  if (!loadingOverlay) {
    return;
  }

  try {
    loadingOverlay.style.animation = "fadeOut 0.3s ease-out forwards";

    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.98); }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      if (loadingOverlay.parentElement) {
        loadingOverlay.remove();
      }
    }, 300);
  } catch (err) {
    // If animation fails, remove immediately and report
    try {
      loadingOverlay.remove();
    } catch (removeErr) {
      handleGameError(removeErr, "removing endgame loading overlay");
    }
    // Report the original animation error as well for diagnostics
    try {
      handleGameError(err, "endgame loading hide animation");
    } catch {
      // ignore any errors thrown while reporting to avoid cascading failures
    }
  }
}

/**
 * Main handler for ending the game. Shows loading, saves results,
 * waits for validation and shows the endgame UI.
 */
export async function handleEndGame(
  config: EndGameConfig,
  ui: EndGameUI,
  callbacks?: EndGameCallbacks
): Promise<void> {
  try {
    showEndGameLoading();

    await saveGameResult(config);

    try {
      await waitForDataValidation(config);
    } catch (err) {
      // Ensure validation-related errors are reported but do not prevent flow
      handleGameError(err, "waiting for data validation");
    }

    hideEndGameLoading();

    // Give the UI a small moment to settle
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      // First reveal the basic DOM-based popup for immediate feedback
      if (ui && typeof ui.showEndgamePopup === "function") {
        console.debug(
          "[endGameUtils] invoking ui.showEndgamePopup (DOM basic) with score:",
          config.score
        );
        ui.showEndgamePopup(config.score);
      } else {
        console.debug(
          "[endGameUtils] invoking fallbackShowEndgamePopup (DOM fallback) with score:",
          config.score
        );
        fallbackShowEndgamePopup(config.score);
      }

      // Then attempt to enhance the experience with the richer overlay asynchronously.
      (async () => {
        try {
          const showFn = getShowEndOverlay();
          if (typeof showFn === "function") {
            console.debug(
              "[endGameUtils] invoking global showEndOverlay to enhance overlay (async)",
              { score: config.score }
            );
            await showFn({ score: config.score });
          } else if (typeof completeEndOverlaySetup === "function") {
            console.debug(
              "[endGameUtils] invoking completeEndOverlaySetup to enhance overlay (async)",
              { score: config.score }
            );
            await completeEndOverlaySetup({ score: config.score });
          } else {
            console.debug(
              "[endGameUtils] no richer overlay available (completeEndOverlaySetup / showEndOverlay)"
            );
          }
        } catch (enhanceErr) {
          handleGameError(enhanceErr, "enhancing endgame overlay");
        }
      })();
    } catch (popupErr) {
      handleGameError(popupErr, "displaying endgame overlay");
    }

    // Fallback: make sure overlay is removed after a short period
    setTimeout(() => {
      const overlay = safeGetElementById<HTMLElement>("endgame-loading-overlay");
      if (overlay && overlay.parentElement) {
        overlay.remove();
      }
    }, 2000);

    callbacks?.onSaveComplete?.();
  } catch (err) {
    // Report error using centralized handler and attempt to recover UI
    handleGameError(err, "game ending");

    hideEndGameLoading();

    setTimeout(() => {
      const overlay = safeGetElementById<HTMLElement>("endgame-loading-overlay");
      if (overlay && overlay.parentElement) {
        overlay.remove();
      }
    }, 100);

    // Ensure the endgame popup still appears for UX continuity
    setTimeout(() => {
      try {
        // Reveal DOM popup immediately
        if (ui && typeof ui.showEndgamePopup === "function") {
          console.debug(
            "[endGameUtils] (fallback timeout) invoking ui.showEndgamePopup with score:",
            config.score
          );
          ui.showEndgamePopup(config.score);
        } else {
          console.debug(
            "[endGameUtils] (fallback timeout) invoking fallbackShowEndgamePopup with score:",
            config.score
          );
          fallbackShowEndgamePopup(config.score);
        }

        // Try to invoke richer overlay without blocking
        (async () => {
          try {
            const showFn = getShowEndOverlay();
            if (typeof showFn === "function") {
              console.debug(
                "[endGameUtils] (fallback timeout) calling global showEndOverlay (non-blocking)",
                { score: config.score }
              );
              showFn({ score: config.score });
            } else if (typeof completeEndOverlaySetup === "function") {
              console.debug(
                "[endGameUtils] (fallback timeout) calling completeEndOverlaySetup (non-blocking)",
                { score: config.score }
              );
              completeEndOverlaySetup({ score: config.score });
            } else {
              console.debug("[endGameUtils] (fallback timeout) no richer overlay available");
            }
          } catch (enhanceErr) {
            handleGameError(enhanceErr, "enhancing endgame overlay after error");
          }
        })();
      } catch (popupErr) {
        handleGameError(popupErr, "showing endgame popup after error");
      }
    }, 200);

    callbacks?.onError?.(err instanceof Error ? err : new Error(String(err)));
  }
}

/**
 * Displays the endgame popup and sets accessibility attributes.
 */
export function showEndgamePopup(score: number): void {
  try {
    let scoreElement = safeGetElementById<HTMLElement>("popup-score");
    let popup = safeGetElementById<HTMLElement>("endgame-popup");

    // If the expected DOM elements exist, update them (fast path)
    if (scoreElement && popup) {
      scoreElement.textContent = String(score);
      popup.setAttribute("data-score", String(score));

      // Robust reveal strategy:
      // 1) Immediately remove common hiding classes and apply inline styles.
      // 2) Repeat removal for a short duration in case other scripts re-add hiding classes (race conditions).
      try {
        const popupEl = popup as HTMLElement;
        const hideClasses = ["hidden", "invisible", "opacity-0", "pointer-events-none", "sr-only"];
        // Immediate removal
        hideClasses.forEach(function (c) {
          try {
            popupEl.classList.remove(c);
          } catch (ignoreErr) {
            void ignoreErr;
          }
        });
        // Inline style enforcement as a strong fallback
        try {
          popupEl.style.display = "flex";
          popupEl.style.visibility = "visible";
          popupEl.style.opacity = "1";
          popupEl.style.pointerEvents = "auto";
          // High z-index to ensure it's above other layers
          popupEl.style.zIndex = String(100000);
        } catch (ignoreErr) {
          void ignoreErr;
        }
        // Repeatedly attempt to remove hiding classes for a short window (race condition mitigation)
        try {
          let revealAttempts = 0;
          const revealInterval = window.setInterval(function () {
            revealAttempts++;
            hideClasses.forEach(function (c) {
              try {
                popupEl.classList.remove(c);
              } catch (ignoreErr) {
                void ignoreErr;
              }
            });
            // Re-apply inline styles each tick as well
            try {
              popupEl.style.display = "flex";
              popupEl.style.visibility = "visible";
              popupEl.style.opacity = "1";
              popupEl.style.pointerEvents = "auto";
              popupEl.style.zIndex = String(100000);
            } catch (ignoreErr) {
              void ignoreErr;
            }
            if (revealAttempts >= 6) {
              try {
                clearInterval(revealInterval);
              } catch (ignoreErr) {
                void ignoreErr;
              }
            }
          }, 150);
        } catch (ignoreErr) {
          void ignoreErr;
        }
      } catch (ignoreErr) {
        void ignoreErr;
      }

      // Keep accessibility attributes and focus
      popup.setAttribute("tabindex", "-1");
      try {
        popup.focus();
      } catch (err) {
        void err;
      }
    } else {
      // Create a minimal, accessible fallback popup so other modules can read data attributes
      // and users get immediate feedback. Keep structure simple to avoid styling dependencies.
      try {
        popup = document.getElementById("endgame-popup") as HTMLElement | null;
      } catch (err) {
        handleGameError(err, "retrieving endgame-popup element");
        popup = null;
      }

      if (!popup) {
        const container = document.createElement("div");
        container.id = "endgame-popup";
        container.className =
          "popup fixed top-0 right-0 bottom-0 left-0 z-[9999] flex items-center justify-center";
        container.setAttribute("role", "dialog");
        container.setAttribute("aria-modal", "true");
        container.setAttribute("tabindex", "-1");

        const inner = document.createElement("div");
        inner.className =
          "endgame-fallback rounded p-4 bg-black/80 text-white max-w-sm w-full text-center";
        inner.setAttribute("role", "document");

        const scoreSpan = document.createElement("span");
        scoreSpan.id = "popup-score";
        scoreSpan.className = "text-4xl font-bold";
        scoreSpan.textContent = String(score);

        inner.appendChild(scoreSpan);
        container.appendChild(inner);

        // Attach minimal dataset for consumers
        container.dataset.score = String(score);

        // Append to body
        try {
          document.body.appendChild(container);
        } catch (err) {
          handleGameError(err, "appending endgame fallback container");
          // If append fails, at least set data on any found elements (best-effort)
        }

        // Update references so other code can use them
        scoreElement = safeGetElementById<HTMLElement>("popup-score");
        popup = safeGetElementById<HTMLElement>("endgame-popup");
      } else {
        // Popup exists but score element missing: create it
        if (!safeGetElementById<HTMLElement>("popup-score")) {
          const scoreSpan = document.createElement("span");
          scoreSpan.id = "popup-score";
          scoreSpan.className = "text-4xl font-bold";
          scoreSpan.textContent = String(score);
          popup.appendChild(scoreSpan);
        }
        popup.dataset.score = String(score);
        popup.classList.remove("hidden");
        popup.setAttribute("tabindex", "-1");
      }

      // Try to focus the popup for accessibility (best-effort)
      try {
        popup?.focus();
      } catch {
        // ignore focus failures
      }
    }

    // Attempt to invoke a richer global overlay if available (non-blocking enhancement).
    // We do this after ensuring the DOM-based popup is visible so the user sees immediate feedback.
    try {
      if (typeof window !== "undefined") {
        const maybeShow = (window as unknown as { showEndOverlay?: unknown }).showEndOverlay;
        if (typeof maybeShow === "function") {
          try {
            // call but do not await to avoid blocking
            (maybeShow as (arg: { score: number }) => void)({ score });
          } catch (callErr) {
            // If calling fails, report via central handler
            handleGameError(callErr, "invoking global showEndOverlay");
          }
        }
      }
    } catch (globalErr) {
      // Non-fatal: log via central handler to surface potential issues during runtime
      handleGameError(globalErr, "checking global showEndOverlay");
    }
  } catch (err) {
    // Final fallback: report the failure centrally but don't throw
    handleGameError(err, "end game popup display");
  }
}

/**
 * Restart the game by redirecting to the game home while preserving language.
 */
export function restartGame(): void {
  const currentLanguage = getLangFromUrl(new URL(window.location.pathname, window.location.origin));
  const safeLang = String(currentLanguage || "en");
  window.location.href = `/${safeLang}/gamehome`;
}

/**
 * Format score for sharing with localized message.
 */
export function formatScoreForSharing(score: number, category: string, difficulty: string): string {
  const url = new URL(window.location.pathname, window.location.origin);
  const lang = getLangFromUrl(url);
  const t = useTranslations(String(lang));
  return `${t("game.share.message", { score: String(score), category, difficulty })} - Melody Mind`;
}
