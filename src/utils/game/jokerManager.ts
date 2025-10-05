import { JOKERS_PER_DIFFICULTY, isDifficulty } from "@constants/game";

import { safeGetElementById } from "../dom/domUtils";
import { getDocumentLanguage } from "../i18n/detectLanguage";

import { Difficulty } from "./jokerUtils";

/**
 * Required DOM elements for the joker functionality
 * @interface JokerElements
 */
interface JokerElements {
  jokerButton?: HTMLButtonElement | null;
  jokerCounter?: HTMLElement | null;
}

/**
 * Configuration options for the JokerManager
 * @interface JokerManagerOptions
 */
interface JokerManagerOptions {
  difficulty: Difficulty;
  elements: JokerElements;
}

/**
 * Represents the current state of jokers in the game
 * @interface JokerState
 */
interface JokerState {
  jokerCount: number;
  jokerUsed: boolean;
}

/**
 * Question structure with options and correct answer
 * @interface Question
 */
interface Question {
  options: string[];
  correctAnswer: string;
}

/**
 * JokerManager handles the 50:50 joker functionality in the quiz game
 * It manages the joker state, UI updates, and handles the logic for removing wrong options
 *
 * @class JokerManager
 */
export class JokerManager {
  private readonly difficulty: Difficulty;
  private readonly jokerButton: HTMLButtonElement | null;
  private readonly jokerCounter: HTMLElement | null;
  private currentQuestion: Question | null = null;
  private jokerState: JokerState;
  private clickListener: ((e: MouseEvent) => void) | null = null;
  // Stored reference for custom 'jokerUsed' event listener so it can be removed during cleanup
  private jokerUsedListener: (() => void) | null = null;

  /**
   * Creates a new JokerManager instance
   * @param {JokerManagerOptions} options - Configuration options
   */
  constructor(options: JokerManagerOptions) {
    this.difficulty = options.difficulty;
    this.jokerButton = options.elements.jokerButton || null;
    this.jokerCounter = options.elements.jokerCounter || null;

    this.jokerState = {
      jokerCount: this.getInitialJokerCount(),
      jokerUsed: false,
    };

    this.init();
  }

  /**
   * Initializes the joker manager by setting up event listeners
   * @private
   */
  private init(): void {
    // Store click listener as a property for removal during cleanup
    this.clickListener = (e: MouseEvent): void => this.handleJokerClick(e);

    // Add click event listener to the joker button
    if (this.jokerButton) {
      this.jokerButton.addEventListener("click", this.clickListener);
    }

    // Listen for custom jokerUsed events from the Joker component
    // Store a reference to the handler so it can be removed in `cleanup()`.
    this.jokerUsedListener = (): void => this.useJoker();
    document.addEventListener("jokerUsed", this.jokerUsedListener);

    this.updateJokerUI();
  }

  /**
   * Performs cleanup by removing event listeners
   * @public
   */
  public cleanup(): void {
    if (this.jokerButton && this.clickListener) {
      this.jokerButton.removeEventListener("click", this.clickListener);
    }
    // Remove stored jokerUsed listener if it was registered
    if (this.jokerUsedListener) {
      document.removeEventListener("jokerUsed", this.jokerUsedListener);
      this.jokerUsedListener = null;
    }
  }

  /**
   * Determines the initial joker count based on difficulty level
   * @private
   * @returns {number} The initial number of jokers available
   */
  private getInitialJokerCount(): number {
    if (isDifficulty(this.difficulty)) {
      return JOKERS_PER_DIFFICULTY[this.difficulty];
    }
    return 0;
  }

  /**
   * Handles joker button click events
   * @private
   * @param {MouseEvent} e - The click event
   */
  private handleJokerClick(e: MouseEvent): void {
    e.preventDefault();
    this.useJoker();
  }

  /**
   * Sets the current question and resets the joker state for the new question
   * @public
   * @param {Question} question - The current question object
   */
  public setCurrentQuestion(question: Question): void {
    this.currentQuestion = question;
    this.jokerState.jokerUsed = false;
    this.updateJokerUI();
  }

  /**
   * Returns the current joker state
   * @public
   * @returns {JokerState} The current joker state
   */
  public getCurrentJokerState(): JokerState {
    return { ...this.jokerState };
  }

  /**
   * Activates the 50:50 joker to remove two wrong answer options
   * @private
   */
  private useJoker(): void {
    // Exit early if joker cannot be used
    if (this.jokerState.jokerCount <= 0 || this.jokerState.jokerUsed || !this.currentQuestion) {
      return;
    }

    // Update joker state (reduce count and mark as used)
    this.jokerState.jokerCount--;
    this.jokerState.jokerUsed = true;

    const { options, correctAnswer } = this.currentQuestion;

    // Process answer options and hide incorrect ones
    try {
      // Identify wrong options (all non-correct answers)
      const wrongOptions = options.filter((option) => option !== correctAnswer);

      // Safety check: ensure correct answer is not in wrong options
      if (wrongOptions.includes(correctAnswer)) {
        return;
      }

      // Exit if there aren't enough wrong options to use 50:50
      if (wrongOptions.length < 2) {
        return;
      }

      // Select random wrong options to hide (up to 2)
      let toHide = [...wrongOptions];
      if (toHide.length > 2) {
        toHide = toHide
          .sort(() => Math.random() - 0.5) // Randomize
          .slice(0, 2); // Take first 2
      }

      // Get the options container from the DOM
      const optionsContainer = safeGetElementById<HTMLElement>("options");
      if (!optionsContainer) {
        return;
      }

      // Find all option buttons
      const allButtons = Array.from(optionsContainer.querySelectorAll("button"));

      // Text normalization function for better matching
      function normalizeText(text: string): string {
        return text.trim().toLowerCase().replace(/\s+/g, " ");
      }

      // Normalize the correct answer and options to hide for comparison
      const normalizedCorrectAnswer = normalizeText(correctAnswer);
      const normalizedToHide = toHide.map((opt) => normalizeText(opt));

      // Track how many buttons were hidden
      let hiddenCount = 0;

      // Process each button
      allButtons.forEach((button) => {
        const normalizedButtonText = normalizeText(button.textContent || "");

        // Skip the correct answer - never hide it
        if (normalizedButtonText === normalizedCorrectAnswer) {
          return;
        }

        // Check if this button should be hidden (fuzzy matching)
        const shouldHide = normalizedToHide.some(
          (hideText) =>
            normalizedButtonText.includes(hideText) || hideText.includes(normalizedButtonText)
        );

        // Apply multiple hiding techniques for maximum compatibility
        if (shouldHide) {
          button.style.display = "none";
          button.style.visibility = "hidden";
          button.classList.add("hidden");
          button.disabled = true;
          button.setAttribute("aria-hidden", "true");
          button.setAttribute("data-hidden-by-joker", "true");
          hiddenCount++;
        }
      });

      // If no buttons were hidden, try alternative approach
      if (hiddenCount === 0) {
        this.tryAlternativeHiding(allButtons, normalizedCorrectAnswer, normalizedToHide);
      }
    } catch {
      // Silent error handling to prevent game disruption
    }

    // Update UI and announce to screen readers
    this.updateJokerUI();
    this.announceJokerUsage(2);
  }

  /**
   * Announces joker usage to screen readers
   * @private
   * @param {number} removedCount - Number of options removed
   */
  private announceJokerUsage(removedCount: number): void {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "assertive");
    announcement.setAttribute("role", "status");
    announcement.className = "sr-only";

    const lang = getDocumentLanguage();
    const remaining = this.jokerState.jokerCount;

    // Create localized message
    let message = "";
    if (lang === "de") {
      message = `50:50 Joker verwendet. ${removedCount} falsche Antworten wurden ausgeblendet. Noch ${remaining} Joker verfügbar.`;
    } else {
      message = `50:50 Joker used. ${removedCount} wrong answers have been hidden. ${remaining} jokers remaining.`;
    }

    announcement.textContent = message;
    document.body.appendChild(announcement);

    // Clean up after announcement is likely read
    setTimeout(() => announcement.remove(), 3000);
  }

  /**
   * Alternative method for hiding options when text matching fails
   * Uses a more direct approach with DOM elements
   * @private
   * @param {HTMLButtonElement[]} buttons - All answer buttons
   * @param {string} normalizedCorrectAnswer - The normalized correct answer text
   * @param {string[]} _normalizedToHide - The normalized options that should be hidden
   */
  private tryAlternativeHiding(
    buttons: HTMLButtonElement[],
    normalizedCorrectAnswer: string,
    _normalizedToHide: string[]
  ): void {
    // Text normalization helper
    function normalizeText(text: string): string {
      return text.trim().toLowerCase().replace(/\s+/g, " ");
    }

    // Separate buttons into correct and wrong
    const wrongButtons: HTMLButtonElement[] = [];
    let correctButton: HTMLButtonElement | null = null;

    buttons.forEach((button) => {
      const normalizedButtonText = normalizeText(button.textContent || "");

      // Identify the correct button (with fuzzy matching)
      if (
        normalizedButtonText === normalizedCorrectAnswer ||
        normalizedButtonText.includes(normalizedCorrectAnswer) ||
        normalizedCorrectAnswer.includes(normalizedButtonText)
      ) {
        correctButton = button;
      } else {
        wrongButtons.push(button);
      }
    });

    // Safety check: don't proceed if we can't identify the correct button
    if (!correctButton) {
      // If we can't tell which is correct, use a fallback approach
      if (buttons.length >= 3) {
        const shuffledButtons = [...buttons].sort(() => Math.random() - 0.5);
        // Hide first two, hoping the correct one isn't among them
        this.hideButtons(shuffledButtons.slice(0, 2));
      }
      return;
    }

    // Hide 2 wrong buttons if possible
    if (wrongButtons.length >= 2) {
      const randomizedWrongButtons = [...wrongButtons].sort(() => Math.random() - 0.5);
      const buttonsToHide = randomizedWrongButtons.slice(0, 2);
      this.hideButtons(buttonsToHide);
    } else if (wrongButtons.length === 1) {
      // Hide the one wrong button if that's all we have
      this.hideButtons(wrongButtons);
    }
  }

  /**
   * Helper method to hide buttons
   * @private
   * @param {HTMLButtonElement[]} buttons - Buttons to hide
   */
  private hideButtons(buttons: HTMLButtonElement[]): void {
    buttons.forEach((button) => {
      button.style.display = "none";
      button.style.visibility = "hidden";
      button.classList.add("hidden");
      button.disabled = true;
      button.setAttribute("aria-hidden", "true");
      button.setAttribute("data-hidden-by-joker", "true");
    });
  }

  /**
   * Updates the joker UI elements based on current state
   * @private
   */
  private updateJokerUI(): void {
    // Update joker button state
    if (this.jokerButton) {
      const disabled = this.jokerState.jokerCount <= 0 || this.jokerState.jokerUsed;
      this.jokerButton.disabled = disabled;

      if (disabled) {
        this.jokerButton.setAttribute("disabled", "true");
        this.jokerButton.classList.add("opacity-50", "cursor-not-allowed");
        this.jokerButton.setAttribute("aria-disabled", "true");
      } else {
        this.jokerButton.removeAttribute("disabled");
        this.jokerButton.classList.remove("opacity-50", "cursor-not-allowed");
        this.jokerButton.setAttribute("aria-disabled", "false");
      }
    }

    // Update joker counter text with appropriate translation
    if (this.jokerCounter) {
      const translations = {
        de: `${this.jokerState.jokerCount} übrig`,
        en: `${this.jokerState.jokerCount} remaining`,
        es: `${this.jokerState.jokerCount} restantes`,
        fr: `${this.jokerState.jokerCount} restants`,
        it: `${this.jokerState.jokerCount} rimanenti`,
        pt: `${this.jokerState.jokerCount} restante`,
        da: `${this.jokerState.jokerCount} tilbage`,
        nl: `${this.jokerState.jokerCount} resterend`,
        sv: `${this.jokerState.jokerCount} kvar`,
        fi: `${this.jokerState.jokerCount} jäljellä`,
        default: `${this.jokerState.jokerCount} remaining`,
      };

      const lang = (document.documentElement.lang as keyof typeof translations) || "default";
      const text = translations[lang] || translations.default;
      this.jokerCounter.textContent = text;
    }
  }
}
