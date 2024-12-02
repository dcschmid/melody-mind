import { getLangFromUrl, useTranslations } from "@utils/i18n";
import {
  Difficulty,
  use5050Joker,
  createInitialJokerState,
} from "./jokerUtils";

/**
 * Interface representing DOM elements required for joker functionality
 */
interface JokerElements {
  jokerButton: HTMLButtonElement;
  jokerCounter: HTMLElement;
}

/**
 * Configuration interface for initializing the JokerManager
 */
interface JokerManagerConfig {
  difficulty: Difficulty;
  elements: JokerElements;
}

/**
 * Manages the 50:50 joker functionality in the quiz game
 */
export class JokerManager {
  private currentJokerState;
  private readonly maxJokers;
  private readonly elements: JokerElements;
  private currentQuestion: any = null;

  /**
   * Creates a new JokerManager instance
   * @param {JokerManagerConfig} config - Configuration object containing difficulty and DOM elements
   */
  constructor({ difficulty, elements }: JokerManagerConfig) {
    const { maxJokers, jokerState } = createInitialJokerState(difficulty);
    this.maxJokers = maxJokers;
    this.currentJokerState = jokerState;
    this.elements = elements;

    this.updateJokerCounter();
    this.initializeJokerButton();
  }

  /**
   * Updates the joker counter display in the UI
   * @private
   */
  private updateJokerCounter() {
    const lang = getLangFromUrl(
      new URL(window.location.pathname, window.location.origin),
    );
    const t = useTranslations(lang);
    this.elements.jokerCounter.textContent = `Joker: ${this.maxJokers} ${t("game.remaining")}`;
  }

  /**
   * Handles the joker button click event
   * Applies the 50:50 joker effect to the current question
   * @private
   */
  private handleJokerClick = () => {
    if (!this.currentQuestion) return;

    this.currentJokerState = use5050Joker(
      this.currentQuestion,
      this.currentJokerState,
      this.maxJokers,
      {
        updateButton: (disabled) => {
          this.elements.jokerButton.disabled = disabled;
        },
        updateCounter: (remaining) => {
          const lang = getLangFromUrl(
            new URL(window.location.pathname, window.location.origin),
          );
          const t = useTranslations(lang);
          this.elements.jokerCounter.textContent = `Joker: ${remaining} ${t("game.remaining")}`;
        },
      },
    );
  };

  /**
   * Initializes the joker button click event listener
   * @private
   */
  private initializeJokerButton() {
    if (this.elements.jokerButton) {
      this.elements.jokerButton.addEventListener(
        "click",
        this.handleJokerClick,
      );
    }
  }

  /**
   * Sets the current active question
   * @param {any} question - The current question object
   */
  setCurrentQuestion(question: any) {
    this.currentQuestion = question;
  }

  /**
   * Returns the current joker state
   * @returns The current state of the joker system
   */
  getCurrentJokerState() {
    return this.currentJokerState;
  }

  /**
   * Removes event listeners and performs cleanup
   */
  cleanup() {
    this.elements.jokerButton?.removeEventListener(
      "click",
      this.handleJokerClick,
    );
  }
}
