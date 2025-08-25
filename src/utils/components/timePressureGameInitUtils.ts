import { safeGetElementById, safeSetInnerHTML } from "../dom/domUtils";
import { TimePressureGameEngine } from "../game/timePressureGameEngine";
import { onDOMReady } from "../../utils/init/domInitUtils";
import { parseGameRoute } from "../../utils/routing/urlUtils";

// Extend Window interface to include our game engine
declare global {
  interface Window {
    timePressureGameEngine: TimePressureGameEngine;
  }
}

/**
 * Initialize Time Pressure Game Engine
 */
export const initTimePressureGame = async (): Promise<void> => {
  try {
    const gameContainer = safeGetElementById<HTMLElement>("game-container");
    const loadingContainer = safeGetElementById<HTMLElement>("loading-container");
    const gameUI = safeGetElementById<HTMLElement>("game-ui");

    if (!gameContainer || !loadingContainer || !gameUI) {
      if (loadingContainer) {
        safeSetInnerHTML(
          loadingContainer,
          '<div class="error-state">Failed to load game UI. Please refresh the page.</div>'
        );
      }
      throw new Error("Missing required DOM elements");
    }

    // Extract category and language from URL
    const { lang, category: categoryPart } = parseGameRoute() || {
      lang: "en",
      category: "unknown",
    };
    const category = categoryPart.startsWith("time-pressure-")
      ? categoryPart.replace("time-pressure-", "")
      : categoryPart;

    // Initialize Time Pressure Game with lang, category, and pathname
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
    const loadingContainer = safeGetElementById<HTMLElement>("loading-container");
    if (loadingContainer) {
      safeSetInnerHTML(
        loadingContainer,
        '<div class="error-state">Failed to load game. Please refresh the page.</div>'
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
    // Initialize when DOM is ready
    onDOMReady(initTimePressureGame);
  } catch (error) {}
};
