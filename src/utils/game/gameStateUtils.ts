/**
 * Game State Utilities
 *
 * Centralized utilities for common game state management patterns.
 * Eliminates code duplication across different game engines.
 */
/* eslint-disable jsdoc/require-param-type, jsdoc/require-returns-type */

import { safeSetTextContent } from "../dom/domUtils";

import { GAME_ELEMENT_IDS, getGameElement } from "./gameElementUtils";

/**
 * Interface for basic game state
 */
export interface BasicGameState {
  score: number;
  round: number;
  totalRounds: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

/**
 * Interface for game state update options
 */
export interface GameStateUpdateOptions {
  updateDisplay?: boolean;
  announceToScreenReader?: boolean;
  validateScore?: boolean;
}

/**
 * Default game state update options
 */
const DEFAULT_UPDATE_OPTIONS: GameStateUpdateOptions = {
  updateDisplay: true,
  announceToScreenReader: false,
  validateScore: true,
};

/**
 * Updates the game score with validation and display updates
 *
 * @param currentScore - Current score
 * @param pointsToAdd - Points to add (can be negative)
 * @param options - Update options
 * @returns New score
 */
export function updateGameScore(
  currentScore: number,
  pointsToAdd: number,
  options: GameStateUpdateOptions = {}
): number {
  const opts = { ...DEFAULT_UPDATE_OPTIONS, ...options };

  // Calculate new score
  let newScore = currentScore + pointsToAdd;

  // Validate score (ensure it doesn't go below 0)
  if (opts.validateScore) {
    newScore = Math.max(0, newScore);
  }

  // Update display if requested
  if (opts.updateDisplay) {
    const scoreDisplay = getGameElement<HTMLElement>(GAME_ELEMENT_IDS.SCORE_DISPLAY);
    if (scoreDisplay) {
      safeSetTextContent(scoreDisplay, newScore.toString());
    }

    // Also update popup score if it exists
    const popupScore = getGameElement<HTMLElement>(GAME_ELEMENT_IDS.POPUP_SCORE);
    if (popupScore) {
      safeSetTextContent(popupScore, newScore.toString());
    }
  }

  // Announce to screen reader if requested
  if (opts.announceToScreenReader) {
    announceScoreChange(newScore, pointsToAdd);
  }

  return newScore;
}

/**
 * Updates the game round with display updates
 *
 * @param currentRound - Current round
 * @param roundIncrement - Round increment (usually 1)
 * @param totalRounds - Total number of rounds
 * @param options - Update options
 * @returns New round number
 */
export function updateGameRound(
  currentRound: number,
  roundIncrement: number = 1,
  totalRounds: number,
  options: GameStateUpdateOptions = {}
): number {
  const opts = { ...DEFAULT_UPDATE_OPTIONS, ...options };

  const newRound = currentRound + roundIncrement;

  // Update display if requested
  if (opts.updateDisplay) {
    const roundDisplay = getGameElement<HTMLElement>(GAME_ELEMENT_IDS.ROUND_DISPLAY);
    if (roundDisplay) {
      safeSetTextContent(roundDisplay, newRound.toString());
    }

    const currentRoundDisplay = getGameElement<HTMLElement>(GAME_ELEMENT_IDS.CURRENT_ROUND);
    if (currentRoundDisplay) {
      safeSetTextContent(currentRoundDisplay, newRound.toString());
    }

    const totalRoundsDisplay = getGameElement<HTMLElement>(GAME_ELEMENT_IDS.TOTAL_ROUNDS);
    if (totalRoundsDisplay) {
      safeSetTextContent(totalRoundsDisplay, totalRounds.toString());
    }
  }

  return newRound;
}

/**
 * Resets the game state to initial values
 *
 * @param initialState - Initial game state
 * @param options - Update options
 */
export function resetGameState(
  initialState: BasicGameState,
  options: GameStateUpdateOptions = {}
): void {
  const opts = { ...DEFAULT_UPDATE_OPTIONS, ...options };

  if (opts.updateDisplay) {
    // Reset score display
    updateGameScore(0, 0, { updateDisplay: true, validateScore: false });

    // Reset round display
    updateGameRound(0, 0, initialState.totalRounds, { updateDisplay: true });
  }
}

/**
 * Checks if the game is in the final round
 *
 * @param currentRound - Current round
 * @param totalRounds - Total number of rounds
 * @returns boolean - True if this is the final round
 */
export function isFinalRound(currentRound: number, totalRounds: number): boolean {
  return currentRound >= totalRounds;
}

/**
 * Calculates game completion percentage
 *
 * @param currentRound - Current round
 * @param totalRounds - Total number of rounds
 * @returns number - Completion percentage (0-100)
 */
export function getGameCompletionPercentage(currentRound: number, totalRounds: number): number {
  if (totalRounds === 0) {
    return 0;
  }
  return Math.min(100, Math.round((currentRound / totalRounds) * 100));
}

/**
 * Calculates accuracy percentage
 *
 * @param correctAnswers - Number of correct answers
 * @param totalAnswers - Total number of answers
 * @returns number - Accuracy percentage (0-100)
 */
export function getAccuracyPercentage(correctAnswers: number, totalAnswers: number): number {
  if (totalAnswers === 0) {
    return 0;
  }
  return Math.round((correctAnswers / totalAnswers) * 100);
}

/**
 * Formats score for display with locale support
 *
 * @param score - Score to format
 * @param locale - Locale for formatting (default: 'de')
 * @returns Formatted score string
 */
export function formatScoreForDisplay(score: number, locale: string = "de"): string {
  return score.toLocaleString(locale);
}

/**
 * Formats round information for display
 *
 * @param currentRound - Current round
 * @param totalRounds - Total number of rounds
 * @param locale - Locale for formatting (default: 'de')
 * @returns Formatted round string
 */
export function formatRoundForDisplay(
  currentRound: number,
  totalRounds: number,
  locale: string = "de"
): string {
  return `${currentRound.toLocaleString(locale)} / ${totalRounds.toLocaleString(locale)}`;
}

/**
 * Announces score change to screen reader
 *
 * @param newScore - New score
 * @param pointsChange - Points change (can be negative)
 */
function announceScoreChange(newScore: number, pointsChange: number): void {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "assertive");
  announcement.classList.add("sr-only");

  if (pointsChange > 0) {
    announcement.textContent = `Score increased by ${pointsChange} points. New score: ${newScore}`;
  } else if (pointsChange < 0) {
    announcement.textContent = `Score decreased by ${Math.abs(pointsChange)} points. New score: ${newScore}`;
  } else {
    announcement.textContent = `Score updated to ${newScore}`;
  }

  document.body.appendChild(announcement);

  // Remove announcement after it's been read
  setTimeout(() => {
    announcement.remove();
  }, 1000);
}

/**
 * Validates game state values
 *
 * @param state - Game state to validate
 * @returns boolean - True if state is valid
 */
export function validateGameState(state: BasicGameState): boolean {
  return (
    state.score >= 0 &&
    state.round >= 0 &&
    state.totalRounds > 0 &&
    state.round <= state.totalRounds &&
    state.correctAnswers >= 0 &&
    state.incorrectAnswers >= 0
  );
}

/**
 * Creates a summary of the current game state
 *
 * @param state - Current game state
 * @returns Formatted game state summary
 */
export function getGameStateSummary(state: BasicGameState): string {
  const accuracy = getAccuracyPercentage(
    state.correctAnswers,
    state.correctAnswers + state.incorrectAnswers
  );
  const completion = getGameCompletionPercentage(state.round, state.totalRounds);

  return `Round ${state.round}/${state.totalRounds} (${completion}% complete) - Score: ${state.score} - Accuracy: ${accuracy}%`;
}
