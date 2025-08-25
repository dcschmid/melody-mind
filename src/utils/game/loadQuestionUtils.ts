import { handleGameError } from "../error/errorHandlingUtils";
import type { Question, Album } from "../../types/game";

/**
 * DOM elements required for displaying a question.
 *
 * @interface QuestionElements
 */
interface QuestionElements {
  /** Container element for the entire question section */
  questionContainer: HTMLElement;
  /** Loading spinner element shown while question is being prepared */
  spinner: HTMLElement;
  /** Element where the question text is displayed */
  questionElement: HTMLElement;
  /** Container for answer option buttons */
  optionsContainer: HTMLElement;
}

/**
 * Event handlers for question interactions.
 *
 * @interface QuestionHandlers
 */
interface QuestionHandlers {
  /** Callback function invoked when a user selects an answer */
  handleAnswer: (option: string, correctAnswer: string, question: Question, album: Album) => void;
}

/**
 * State of the joker feature for the current question.
 *
 * @interface JokerState
 */
interface JokerState {
  /** Indicates if the joker has been used for this question */
  jokerUsed: boolean;
}

/**
 * Parameters required for loading and displaying a question.
 *
 * @interface LoadQuestionParams
 */
interface LoadQuestionParams {
  /** The question object to be displayed */
  question: Question;
  /** The album associated with the question */
  album: Album;
  /** DOM elements required for displaying the question */
  elements: QuestionElements;
  /** Event handlers for question interactions */
  handlers: QuestionHandlers;
  /** State management for the joker feature */
  jokerState: JokerState;
}

/**
 * Loads and displays a question in the game interface.
 *
 * - Setting up the question text
 * - Creating and shuffling answer options
 * - Setting appropriate ARIA attributes for accessibility
 * - Attaching event listeners to answer buttons
 * - Managing loading states
 *
 * @param {LoadQuestionParams} params - Object containing all necessary parameters
 */
export function loadQuestion({
  question,
  album,
  elements,
  handlers,
  jokerState,
}: LoadQuestionParams): void {
  const { questionContainer, spinner, questionElement, optionsContainer } = elements;

  // Set loading state
  questionContainer.setAttribute("aria-busy", "true");
  questionContainer.classList.add("hidden");
  spinner.classList.remove("hidden");

  // Reset joker state for the new question
  jokerState.jokerUsed = false;

  try {
    // Ensure question data is valid
    if (!question || typeof question !== "object") {
      throw new Error("Invalid question data received");
    }

    const questionText = question.question || "";
    const options = Array.isArray(question.options) ? question.options : [];

    // Update question display
    questionElement.textContent = questionText;

    // Clear options container
    optionsContainer.innerHTML = "";

    // Create shuffled options array using Fisher-Yates shuffle
    const shuffledOptions = [...options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }

    // Set accessibility attributes
    questionContainer.setAttribute("role", "main");
    questionContainer.setAttribute("aria-label", "Current game question");
    questionElement.setAttribute("role", "heading");
    questionElement.setAttribute("aria-level", "2");
    optionsContainer.setAttribute("role", "radiogroup");
    optionsContainer.setAttribute("aria-label", "Answer options");

    // Create option buttons
    createOptionButtons(shuffledOptions, optionsContainer, handlers.handleAnswer, question, album);

    // Setup keyboard navigation for accessibility
    setupKeyboardNavigation(optionsContainer, question, album, handlers.handleAnswer);

    // Show question and hide spinner
    spinner.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    questionContainer.setAttribute("aria-busy", "false");

    // Announce question for screen readers
    const srAnnouncement = document.createElement("div");
    srAnnouncement.setAttribute("aria-live", "polite");
    srAnnouncement.classList.add("sr-only");
    srAnnouncement.textContent = `Neue Frage: ${questionText}`;
    questionContainer.appendChild(srAnnouncement);

    // Remove announcement after it's been read
    setTimeout(() => srAnnouncement.remove(), 1000);

    // Focus first option for keyboard users
    const firstOption = optionsContainer.querySelector("button");
    if (firstOption) {
      firstOption.focus();
    }
  } catch (error) {
    handleGameError(error, "question display");
    // Display an error message to the user
    questionElement.textContent =
      "Sorry, there was a problem loading the question. Please try again.";

    spinner.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    questionContainer.setAttribute("aria-busy", "false");
  }
}

/**
 * Creates option buttons for the question
 */
function createOptionButtons(
  options: string[],
  container: HTMLElement,
  handleAnswer: (option: string, correctAnswer: string, question: Question, album: Album) => void,
  question: Question,
  album: Album
): void {
  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className =
      "w-full p-4 mb-3 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gradient-to-r from-slate-700/90 to-slate-800/80 border-slate-600/30 shadow-lg hover:shadow-xl";
    button.type = "button";
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", "false");
    button.setAttribute("aria-label", `Option: ${option}`);
    button.setAttribute("data-index", index.toString());

    // Create option content
    button.innerHTML = `
      <div class="flex items-center">
        <span class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center mr-4 shadow-md border border-blue-400/30">
          ${index + 1}
        </span>
        <span class="flex-1 text-left text-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
          ${option}
        </span>
      </div>
    `;

    // Attach click handler
    button.onclick = (): void => {
      // Disable all buttons to prevent double clicks
      document.querySelectorAll("#options button").forEach((btn) => {
        (btn as HTMLButtonElement).disabled = true;
      });

      // Mark this option as selected
      button.setAttribute("aria-checked", "true");
      button.classList.add("selected-option");

      // Update styles for correct/incorrect answers
      setTimeout(() => {
        if (option === question.correctAnswer) {
          button.className = button.className.replace(
            "from-slate-700/90 to-slate-800/80",
            "from-green-600/95 to-green-700/90"
          );
          button.className = button.className.replace("border-slate-600/30", "border-green-500/60");
        } else {
          button.className = button.className.replace(
            "from-slate-700/90 to-slate-800/80",
            "from-red-600/95 to-red-700/90"
          );
          button.className = button.className.replace("border-slate-600/30", "border-red-500/60");
        }
      }, 100);

      // Call the answer handler
      handleAnswer(option, question.correctAnswer, question, album);
    };

    // Append to container
    container.appendChild(button);
  });
}

/**
 * Sets up keyboard navigation for question options to improve accessibility.
 *
 * - Arrow keys to navigate between options
 * - Enter/Space to select an option
 *
 * @param {HTMLElement} optionsContainer - Container element for option buttons
 * @param {Question} question - Current question object
 * @param {Album} album - Current album object
 * @param {Function} handleAnswer - Callback for answer selection
 * @returns {void}
 */
function setupKeyboardNavigation(
  optionsContainer: HTMLElement,
  question: Question,
  album: Album,
  handleAnswer: (option: string, correctAnswer: string, question: Question, album: Album) => void
): void {
  const options = Array.from(optionsContainer.querySelectorAll<HTMLElement>("button"));

  options.forEach((button, index) => {
    button.addEventListener("keydown", (e: KeyboardEvent) => {
      // Only process if it's a navigation or selection key
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " "].includes(e.key)) {
        return;
      }

      e.preventDefault(); // Prevent page scrolling

      switch (e.key) {
        case "ArrowRight": {
          // Navigate to next option in a circular manner
          const nextIndex = (index + 1) % options.length;
          options[nextIndex].focus();
          break;
        }

        case "ArrowLeft": {
          // Navigate to previous option in a circular manner
          const prevIndex = (index - 1 + options.length) % options.length;
          options[prevIndex].focus();
          break;
        }

        case " ": {
          // Select the current option
          const optionText = button.textContent || "";
          button.setAttribute("aria-checked", "true");
          handleAnswer(optionText, question.correctAnswer, question, album);
          break;
        }
      }
    });
  });
}
