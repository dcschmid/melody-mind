import { shuffleArray } from "../share/shuffleArray";

/**
 * Represents a question in the game
 */
type Question = {
  /** The question text to be displayed */
  question: string;
  /** Array of possible answer options */
  options: string[];
  /** The correct answer among the options */
  correctAnswer: string;
  /** Additional trivia information about the question */
  trivia: string;
};

/**
 * Represents an album in the game
 */
type Album = {
  /** URL to the album cover image */
  coverSrc: string;
  /** Name of the artist */
  artist: string;
  /** Name of the album */
  album: string;
  /** Release year of the album */
  year: string;
};

/**
 * Parameters required for loading a question
 */
type LoadQuestionParams = {
  /** The question to be loaded */
  question: Question;
  /** The album associated with the question */
  album: Album;
  /** DOM elements required for displaying the question */
  elements: {
    /** Container element for the entire question section */
    questionContainer: HTMLElement;
    /** Loading spinner element */
    spinner: HTMLElement;
    /** Element where the question text is displayed */
    questionElement: HTMLElement;
    /** Container for answer option buttons */
    optionsContainer: HTMLElement;
  };
  /** Event handlers for question interactions */
  handlers: {
    /** Callback function when an answer is selected */
    handleAnswer: (
      option: string,
      correctAnswer: string,
      question: Question,
      album: Album,
    ) => void;
  };
  /** State management for the joker feature */
  jokerState: {
    /** Indicates if the joker has been used for this question */
    jokerUsed: boolean;
  };
};

/**
 * Loads and displays a question in the game interface
 *
 * @param params - Object containing all necessary parameters for loading a question
 * @param params.question - The question to be displayed
 * @param params.album - The album associated with the question
 * @param params.elements - DOM elements required for the question display
 * @param params.handlers - Event handlers for question interactions
 * @param params.jokerState - State management for the joker feature
 */
export function loadQuestion({
  question,
  album,
  elements,
  handlers,
  jokerState,
}: LoadQuestionParams): void {
  const { questionContainer, spinner, questionElement, optionsContainer } =
    elements;

  // Initialize display state
  questionContainer.classList.add("hidden");
  spinner.classList.remove("hidden");
  jokerState.jokerUsed = false;

  setTimeout(() => {
    // Safely handle potentially undefined values
    const questionText = question?.question ?? "";
    const options = question?.options ?? [];

    // Update question display
    questionElement.textContent = questionText;
    optionsContainer.innerHTML = "";

    // Create shuffled options array
    const shuffledOptions = Array.isArray(options)
      ? shuffleArray([...options])
      : [];

    // Set accessibility attributes
    questionContainer.setAttribute("role", "main");
    questionContainer.setAttribute("aria-label", "Current game question");
    questionElement.setAttribute("role", "heading");
    questionElement.setAttribute("aria-level", "2");
    optionsContainer.setAttribute("role", "radiogroup");
    optionsContainer.setAttribute("aria-label", "Answer options");

    // Create and append option buttons
    shuffledOptions.forEach((option: string) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.className = "button";
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", "false");
      button.setAttribute("aria-label", `Select answer: ${option}`);

      button.onclick = () =>
        handlers.handleAnswer(
          option,
          question?.correctAnswer ?? "",
          question ?? {
            question: "",
            options: [],
            correctAnswer: "",
            trivia: "",
          },
          album ?? { coverSrc: "", artist: "", album: "", year: "" },
        );

      optionsContainer.appendChild(button);
    });

    // Initialize keyboard navigation
    setupKeyboardNavigation(
      optionsContainer,
      question ?? { question: "", options: [], correctAnswer: "", trivia: "" },
      album ?? { coverSrc: "", artist: "", album: "", year: "" },
      handlers.handleAnswer,
    );

    // Update display state
    spinner.classList.add("hidden");
    questionContainer.classList.remove("hidden");
  }, 500);
}

/**
 * Sets up keyboard navigation for question options
 *
 * @param optionsContainer - Container element holding the option buttons
 * @param question - Current question being displayed
 * @param album - Current album associated with the question
 * @param handleAnswer - Callback function for answer selection
 */
function setupKeyboardNavigation(
  optionsContainer: HTMLElement,
  question: Question,
  album: Album,
  handleAnswer: (
    option: string,
    correctAnswer: string,
    question: Question,
    album: Album,
  ) => void,
): void {
  const options = optionsContainer.querySelectorAll<HTMLElement>("button");

  options.forEach((button, index) => {
    button.addEventListener("keydown", (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          const nextButton = options[(index + 1) % options.length];
          nextButton.focus();
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          const prevButton =
            options[(index - 1 + options.length) % options.length];
          prevButton.focus();
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          const optionText = button.textContent || "";
          handleAnswer(optionText, question.correctAnswer, question, album);
          break;
      }
    });
  });

  // Set initial focus
  if (options.length > 0) {
    options[0].focus();
  }
}
