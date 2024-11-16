/**
 * Represents the state of a joker in the game
 * @interface JokerState
 */
interface JokerState {
  /** Whether the joker has been used in the current round */
  jokerUsed: boolean;
  /** Total number of jokers used in the game */
  jokerUsedCount: number;
}

/**
 * Represents a question in the game
 * @interface Question
 */
interface Question {
  /** The correct answer for the question */
  correctAnswer: string;
}

/**
 * Difficulty levels available in the game
 * @enum {string}
 */
export enum Difficulty {
  /** Easy difficulty - 3 jokers available */
  EASY = 'easy',
  /** Medium difficulty - 5 jokers available */
  MEDIUM = 'medium',
  /** Hard difficulty - 7 jokers available */
  HARD = 'hard'
}

/**
 * Interface for UI update callbacks
 * @interface UpdateUI
 */
interface UpdateUI {
  /** Callback to update button state */
  updateButton?: (disabled: boolean) => void;
  /** Callback to update joker counter */
  updateCounter?: (remaining: number) => void;
}

/**
 * Activates the 50/50 joker, removing two incorrect answer options
 * @param {Question} question - The current question object
 * @param {JokerState} jokerState - Current state of the joker
 * @param {number} maxJokers - Maximum number of jokers allowed
 * @param {UpdateUI} updateUI - Callbacks for updating the UI
 * @returns {JokerState} Updated joker state
 */
export function use5050Joker(
  question: Question,
  jokerState: JokerState,
  maxJokers: number,
  updateUI: UpdateUI = {},
): JokerState {
  const { jokerUsed, jokerUsedCount } = jokerState;

  if (jokerUsed) {
    return jokerState;
  }

  if (!question.correctAnswer) {
    console.warn("Keine korrekte Antwort definiert");
    return jokerState;
  }

  const options = Array.from(document.querySelectorAll<HTMLButtonElement>("#options button"));

  if (options.length === 0) {
    console.warn("Keine Antwortoptionen gefunden");
    return jokerState;
  }

  try {
    const incorrectOptions = options.filter(
      (option) => option.textContent !== question.correctAnswer,
    );

    const optionsToRemove = incorrectOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    optionsToRemove.forEach((option) => {
      option.classList.add("hidden");
      option.addEventListener("transitionend", () => option.remove());
    });

    const newJokerCount = jokerUsedCount + 1;

    if (updateUI.updateButton && newJokerCount >= maxJokers) {
      updateUI.updateButton(true);
    }

    if (updateUI.updateCounter) {
      updateUI.updateCounter(maxJokers - newJokerCount);
    }

    return {
      jokerUsed: true,
      jokerUsedCount: newJokerCount,
    };
  } catch (error) {
    console.error("Fehler beim Ausführen des Jokers:", error);
    return jokerState;
  }
}

/**
 * Creates the initial joker state based on the selected difficulty
 * @param {Difficulty} difficulty - The selected game difficulty
 * @returns {{ maxJokers: number; jokerState: JokerState }} Initial joker configuration
 */
export function createInitialJokerState(difficulty: Difficulty): {
  maxJokers: number;
  jokerState: JokerState;
} {
  const maxJokers = difficulty === Difficulty.EASY ? 3 : difficulty === Difficulty.MEDIUM ? 5 : 7;

  return {
    maxJokers,
    jokerState: {
      jokerUsed: false,
      jokerUsedCount: 0,
    },
  };
}
