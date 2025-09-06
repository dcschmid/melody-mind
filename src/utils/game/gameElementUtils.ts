/**
 * Game Element Utilities
 *
 * Centralized utilities for common game element queries.
 * Eliminates code duplication across different game engines.
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type, jsdoc/require-param-type, jsdoc/require-returns-type */

import { safeGetElementById } from "../dom/domUtils";

/**
 * Common game element IDs used across multiple game engines
 */
export const GAME_ELEMENT_IDS = {
  // Core game elements
  GAME_CONTAINER: "game-container",
  GAME_UI: "game-ui",
  LOADING_CONTAINER: "loading-container",
  SCORE: "score",
  ROUND: "round",
  FEEDBACK: "feedback",
  OPTIONS: "options",
  QUESTION: "question",
  COVER: "cover",
  AUDIO: "audio",
  JOKER_BUTTON: "joker-button",
  JOKER_COUNT: "joker-count",
  RESTART_BUTTON: "restart-button",
  OVERLAY: "overlay",
  LOADING_SPINNER: "loading-spinner",
  SCORE_PROGRESS: "score-progress",
  // Additional elements referenced elsewhere in the codebase
  SCORE_DISPLAY: "score-display",
  ROUND_DISPLAY: "round-display",
  CURRENT_ROUND: "current-round",
  TOTAL_ROUNDS: "total-rounds",
  POPUP_SCORE: "popup-score",
  NEXT_ROUND_BUTTON: "next-round-button",
  QUESTION_TEXT: "question-text",
  QUESTION_CONTAINER: "question-container",
  OPTIONS_CONTAINER: "options-container",
  ENDGAME_POPUP: "endgame-popup",
  SCORE_BAR: "score-bar",
  DIFFICULTY_DISPLAY: "difficulty-display",
  CATEGORY_DISPLAY: "category-display",
  OVERLAY_ARTIST: "overlay-artist",
  OVERLAY_ALBUM: "overlay-album",
  OVERLAY_FUNFACT: "overlay-funfact",
  OVERLAY_YEAR: "overlay-year",
} as const;

/**
 * Type for game element IDs
 */
export type GameElementId = (typeof GAME_ELEMENT_IDS)[keyof typeof GAME_ELEMENT_IDS];

/**
 * Safely gets a game element by ID with type safety
 *
 * @param id - The game element ID
 * @returns The element or null if not found
 */
export function getGameElement<T extends HTMLElement>(id: GameElementId): T | null {
  return safeGetElementById<T>(id);
}

/**
 * Gets multiple game elements at once
 *
 * @param ids - Array of game element IDs to get
 * @returns Object mapping IDs to elements (null if not found)
 */
export function getGameElements<T extends HTMLElement>(
  ids: GameElementId[]
): Record<GameElementId, T | null> {
  const elements: Record<GameElementId, T | null> = {} as Record<GameElementId, T | null>;

  ids.forEach((id) => {
    elements[id] = getGameElement<T>(id);
  });

  return elements;
}

/**
 * Gets common score-related elements
 *
 * @returns Object with score and round elements
 */
export function getScoreElements() {
  return {
    scoreDisplay: getGameElement<HTMLElement>(GAME_ELEMENT_IDS.SCORE_DISPLAY),
    roundDisplay: getGameElement<HTMLElement>(GAME_ELEMENT_IDS.ROUND_DISPLAY),
    currentRound: getGameElement<HTMLElement>(GAME_ELEMENT_IDS.CURRENT_ROUND),
    totalRounds: getGameElement<HTMLElement>(GAME_ELEMENT_IDS.TOTAL_ROUNDS),
    popupScore: getGameElement<HTMLElement>(GAME_ELEMENT_IDS.POPUP_SCORE),
  };
}

/**
 * Gets common game control elements
 *
 * @returns Object with game control elements
 */
export function getGameControlElements() {
  return {
    nextRoundButton: getGameElement<HTMLButtonElement>(GAME_ELEMENT_IDS.NEXT_ROUND_BUTTON),
    restartButton: getGameElement<HTMLButtonElement>(GAME_ELEMENT_IDS.RESTART_BUTTON),
    jokerButton: getGameElement<HTMLButtonElement>(GAME_ELEMENT_IDS.JOKER_BUTTON),
    jokerCount: getGameElement<HTMLElement>(GAME_ELEMENT_IDS.JOKER_COUNT),
  };
}

/**
 * Gets common game content elements
 *
 * @returns Object with game content elements
 */
export function getGameContentElements() {
  return {
    questionText: getGameElement<HTMLElement>(GAME_ELEMENT_IDS.QUESTION_TEXT),
    questionContainer: getGameElement<HTMLDivElement>(GAME_ELEMENT_IDS.QUESTION_CONTAINER),
    optionsContainer: getGameElement<HTMLDivElement>(GAME_ELEMENT_IDS.OPTIONS_CONTAINER),
    overlay: getGameElement<HTMLDivElement>(GAME_ELEMENT_IDS.OVERLAY),
  };
}

/**
 * Gets common end game elements
 *
 * @returns Object with end game elements
 */
export function getEndGameElements() {
  return {
    endgamePopup: getGameElement<HTMLElement>(GAME_ELEMENT_IDS.ENDGAME_POPUP),
    scoreBar: getGameElement<HTMLElement>(GAME_ELEMENT_IDS.SCORE_BAR),
    difficultyDisplay: getGameElement<HTMLElement>(GAME_ELEMENT_IDS.DIFFICULTY_DISPLAY),
    categoryDisplay: getGameElement<HTMLElement>(GAME_ELEMENT_IDS.CATEGORY_DISPLAY),
  };
}

/**
 * Gets common overlay elements
 *
 * @returns Object with overlay elements
 */
export function getOverlayElements() {
  return {
    overlayArtist: getGameElement<HTMLElement>(GAME_ELEMENT_IDS.OVERLAY_ARTIST),
    overlayAlbum: getGameElement<HTMLElement>(GAME_ELEMENT_IDS.OVERLAY_ALBUM),
    overlayFunfact: getGameElement<HTMLElement>(GAME_ELEMENT_IDS.OVERLAY_FUNFACT),
    overlayYear: getGameElement<HTMLElement>(GAME_ELEMENT_IDS.OVERLAY_YEAR),
  };
}

/**
 * Checks if all required game elements are present
 *
 * @param requiredIds - Array of required element IDs
 * @returns boolean - True if all elements are present
 */
export function validateGameElements(requiredIds: GameElementId[]): boolean {
  return requiredIds.every((id) => getGameElement(id) !== null);
}

/**
 * Gets all game elements for a specific game type
 *
 * @param gameType - The type of game (e.g., 'quiz', 'chronology', 'time-pressure')
 * @returns Object with all relevant game elements
 */
export function getAllGameElements(gameType: string) {
  const commonElements = {
    ...getScoreElements(),
    ...getGameControlElements(),
    ...getGameContentElements(),
  };

  // Add game-specific elements
  switch (gameType) {
    case "quiz":
      return {
        ...commonElements,
        ...getEndGameElements(),
      };
    case "chronology":
      return {
        ...commonElements,
        ...getEndGameElements(),
      };
    case "time-pressure":
      return {
        ...commonElements,
        ...getOverlayElements(),
      };
    default:
      return commonElements;
  }
}

export interface GameElements {
  container: HTMLElement | null;
  score: HTMLParagraphElement | null;
  round: HTMLParagraphElement | null;
  feedback: HTMLParagraphElement | null;
  options: HTMLElement | null;
  question: HTMLHeadingElement | null;
  cover: HTMLImageElement | null;
  audio: HTMLAudioElement | null;
  jokerButton: HTMLButtonElement | null;
  jokerCount: HTMLSpanElement | null;
  restartButton: HTMLButtonElement | null;
  overlay: HTMLElement | null;
  loadingSpinner: HTMLElement | null;
  scoreProgress: HTMLElement | null;
}
