import { onDOMReady } from "../../utils/init/domInitUtils";
import { parseGameRoute } from "../../utils/routing/urlUtils";
import { safeGetElementById, safeSetInnerHTML } from "../dom/domUtils";
// Dynamic import of TimePressureGameEngine now performed on user interaction (start button)

// Extend Window interface to include our game engine
declare global {
  // Use unknown to avoid static type dependency before dynamic import loads the class.
  interface Window {
    timePressureGameEngine: unknown;
  }
}

/**
 * Initialize Time Pressure Game Engine
 */
export const initTimePressureGame = async (): Promise<void> => {
  try {
    const gameContainer = safeGetElementById<HTMLElement>("game-container");
    const loadingContainer =
      safeGetElementById<HTMLElement>("loading-container");
    const gameUI = safeGetElementById<HTMLElement>("game-ui");

    if (!gameContainer || !loadingContainer || !gameUI) {
      if (loadingContainer) {
        safeSetInnerHTML(
          loadingContainer,
          '<div class="error-state">Failed to load game UI. Please refresh the page.</div>',
        );
      }
      throw new Error("Missing required DOM elements");
    }

    // Extract category and language from URL
    const { lang, category: categoryPart } = parseGameRoute() || {
      lang: "en",
      category: "unknown",
    };
    const category =
      categoryPart && categoryPart.startsWith("time-pressure-")
        ? categoryPart.replace("time-pressure-", "")
        : categoryPart || "unknown";

    // Initialize Time Pressure Game with lang, category, and pathname
    const { TimePressureGameEngine } = await import(
      "../game/timePressureGameEngine"
    );
    const gameEngine = new TimePressureGameEngine({
      category,
      lang,
      gameContainer,
      loadingContainer,
      gameUI,
    });

    await gameEngine.initialize();

    // Store reference globally for cleanup if needed
    window.timePressureGameEngine = gameEngine;
  } catch (err: unknown) {
    const loadingContainer =
      safeGetElementById<HTMLElement>("loading-container");
    if (loadingContainer) {
      safeSetInnerHTML(
        loadingContainer,
        '<div class="error-state">Failed to load game. Please refresh the page.</div>',
      );
    }
    throw err;
  }
};

/**
 * Auto-initialize Time Pressure Game
 */
export const initTimePressureGameAuto = (): void => {
  try {
    onDOMReady(() => {
      const startBtn = document.getElementById("start-time-pressure-btn");
      if (!startBtn) {
        // Fallback: keep previous auto-init if button not present
        void initTimePressureGame();
        return;
      }
      let initialized = false;
      startBtn.addEventListener("click", () => {
        if (initialized) {
          return;
        }
        initialized = true;
        startBtn.setAttribute("disabled", "true");
        startBtn.classList.add("opacity-50", "cursor-not-allowed");
        void initTimePressureGame();
      });
    });
  } catch (error) {
    void error;
  }
};
