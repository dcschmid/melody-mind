/**
 * Represents a question in the music quiz.
 *
 * @interface Question
 */
export interface Question {
  /** The question text to be displayed to the user */
  question: string;
  /** Array of possible answer options */
  options: string[];
  /** The correct answer among the options */
  correctAnswer: string;
  /** Additional trivia information to display after answering */
  trivia: string;
}

/**
 * Represents an album in the music quiz.
 *
 * @interface Album
 */
export interface Album {
  /** URL to the album cover image */
  coverSrc: string;
  /** Name of the artist */
  artist: string;
  /** Name of the album */
  album: string;
  /** Release year of the album */
  year: string;
}

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
 * This function handles the complete process of displaying a question to the user, including:
 * - Setting up the question text
 * - Creating and shuffling answer options
 * - Setting appropriate ARIA attributes for accessibility
 * - Attaching event handlers to answer buttons
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

  // Short delay for better UX and to ensure DOM is ready
  setTimeout(() => {
    try {
      // Ensure question data is valid
      if (!question || typeof question !== "object") {
        throw new Error("Invalid question data received");
      }

      const questionText = question.question || "";
      const options = Array.isArray(question.options) ? question.options : [];

      // Update question display
      questionElement.textContent = questionText;
      optionsContainer.innerHTML = "";

      // Create shuffled options array using a synchronous Fisher-Yates shuffle algorithm
      // instead of the asynchronous shuffleArray function
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

      // Create and append option buttons
      createOptionButtons(
        shuffledOptions,
        optionsContainer,
        handlers.handleAnswer,
        question,
        album
      );

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

      // Remove announcement after it's been read to prevent cluttering the DOM
      setTimeout(() => srAnnouncement.remove(), 1000);

      // Focus first option for keyboard users (with small delay for animation)
      setTimeout(() => {
        const firstOption = optionsContainer.querySelector("button");
        if (firstOption) {
          firstOption.focus();
        }
      }, 100);
    } catch (error) {
      console.error("Error displaying question:", error);
      // Display an error message to the user
      questionElement.textContent =
        "Sorry, there was a problem loading the question. Please try again.";
      spinner.classList.add("hidden");
      questionContainer.classList.remove("hidden");
      questionContainer.setAttribute("aria-busy", "false");
    }
  }, 500);
}

/**
 * Creates and appends option buttons to the options container.
 *
 * @param {string[]} options - Array of answer options
 * @param {HTMLElement} container - Container element for the buttons
 * @param {Function} handleAnswer - Callback for answer selection
 * @param {Question} question - Current question object
 * @param {Album} album - Current album object
 */
function createOptionButtons(
  options: string[],
  container: HTMLElement,
  handleAnswer: (option: string, correctAnswer: string, question: Question, album: Album) => void,
  question: Question,
  album: Album
): void {
  options.forEach((option: string, index: number) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.className =
      "relative w-full py-4 px-5 rounded-xl text-left text-lg font-medium bg-zinc-800 border border-zinc-600 hover:bg-zinc-700 hover:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all duration-200 shadow-sm hover:shadow-md text-zinc-50";

    // Set appropriate ARIA attributes
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", "false");
    button.setAttribute("aria-label", `Option: ${option}`);
    button.setAttribute("data-index", index.toString());
    button.setAttribute("data-testid", `option-${index}`); // For easier testing

    // Add structure to help with visual scanning
    const optionNumber = document.createElement("span");
    optionNumber.className =
      "inline-flex items-center justify-center w-6 h-6 mr-3 rounded-full bg-zinc-700 text-zinc-100 text-sm";
    optionNumber.textContent = `${index + 1}`;
    button.prepend(optionNumber);

    // Attach click handler
    button.onclick = () => {
      // Disable all buttons to prevent double clicks
      const allButtons = container.querySelectorAll("button");
      allButtons.forEach((btn) => (btn.disabled = true));

      // Mark this option as selected for screen readers
      button.setAttribute("aria-checked", "true");

      // Add visual feedback for selection
      button.classList.add("selected-option");

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
 * Implements keyboard controls:
 * - Arrow keys to navigate between options
 * - Enter/Space to select an option
 *
 * @param {HTMLElement} optionsContainer - Container element for option buttons
 * @param {Question} question - Current question object
 * @param {Album} album - Current album object
 * @param {Function} handleAnswer - Callback for answer selection
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
        case "ArrowDown":
        case "ArrowRight":
          // Navigate to next option in a circular manner
          const nextIndex = (index + 1) % options.length;
          options[nextIndex].focus();
          break;

        case "ArrowUp":
        case "ArrowLeft":
          // Navigate to previous option in a circular manner
          const prevIndex = (index - 1 + options.length) % options.length;
          options[prevIndex].focus();
          break;

        case "Enter":
        case " ": // Space key
          // Select the current option
          const optionText = button.textContent || "";
          button.setAttribute("aria-checked", "true");
          handleAnswer(optionText, question.correctAnswer, question, album);
          break;
      }
    });
  });
}
