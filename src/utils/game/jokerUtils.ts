interface JokerState {
  jokerUsed: boolean;
  jokerUsedCount: number;
}

interface Question {
  correctAnswer: string;
}

/**
 * Represents the state of a joker in the game
 * @interface JokerState
 * @property {boolean} jokerUsed - Whether the joker has been used in the current round
 * @property {number} jokerUsedCount - Total number of jokers used in the game
 */
export function use5050Joker(
  question: Question,
  jokerState: JokerState,
  maxJokers: number,
  updateUI: {
    updateButton?: (disabled: boolean) => void;
    updateCounter?: (remaining: number) => void;
  } = {},
): JokerState {
  const { jokerUsed, jokerUsedCount } = jokerState;

  if (jokerUsed) {
    return jokerState;
  }

  const options = Array.from(document.querySelectorAll("#options button"));

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

export function createInitialJokerState(difficulty: string): {
  maxJokers: number;
  jokerState: JokerState;
} {
  const maxJokers = difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 7;

  return {
    maxJokers,
    jokerState: {
      jokerUsed: false,
      jokerUsedCount: 0,
    },
  };
}
