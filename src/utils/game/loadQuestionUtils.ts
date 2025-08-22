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

  // Use requestAnimationFrame for better performance
  requestAnimationFrame(() => {
    try {
      // Ensure question data is valid
      if (!question || typeof question !== "object") {
        throw new Error("Invalid question data received");
      }

      const questionText = question.question || "";
      const options = Array.isArray(question.options) ? question.options : [];

      // Update question display
      questionElement.textContent = questionText;

      // Clear options container with performance optimization
      while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
      }

      // Create shuffled options array using a more efficient Fisher-Yates shuffle
      const shuffledOptions = [...options];
      for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
      }

      // Set accessibility attributes - only set if they've changed
      if (questionContainer.getAttribute("role") !== "main") {
        questionContainer.setAttribute("role", "main");
      }

      questionContainer.setAttribute("aria-label", "Current game question");

      if (questionElement.getAttribute("role") !== "heading") {
        questionElement.setAttribute("role", "heading");
        questionElement.setAttribute("aria-level", "2");
      }

      if (optionsContainer.getAttribute("role") !== "radiogroup") {
        optionsContainer.setAttribute("role", "radiogroup");
        optionsContainer.setAttribute("aria-label", "Answer options");
      }

      // Create option buttons with DocumentFragment for better performance
      const fragment = document.createDocumentFragment();
      createOptionButtons(shuffledOptions, fragment, handlers.handleAnswer, question, album);

      // Single DOM update for better performance
      optionsContainer.appendChild(fragment);

      // Setup keyboard navigation for accessibility
      setupKeyboardNavigation(optionsContainer, question, album, handlers.handleAnswer);

      // Show question and hide spinner using RAF for smooth transition
      requestAnimationFrame(() => {
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

        // Focus first option for keyboard users using requestAnimationFrame for reliable timing
        requestAnimationFrame(() => {
          const firstOption = optionsContainer.querySelector("button");
          if (firstOption) {
            firstOption.focus();
          }
        });
      });
    } catch (error) {
      console.error("Error displaying question:", error);
      // Display an error message to the user
      questionElement.textContent =
        "Sorry, there was a problem loading the question. Please try again.";

      requestAnimationFrame(() => {
        spinner.classList.add("hidden");
        questionContainer.classList.remove("hidden");
        questionContainer.setAttribute("aria-busy", "false");
      });
    }
  });
}

/**
 * Creates and appends option buttons to the options container.
 *
 * @param {string[]} options - Array of answer options
 * @param {HTMLElement|DocumentFragment} container - Container element for the buttons
 * @param {Function} handleAnswer - Callback for answer selection
 * @param {Question} question - Current question object
 * @param {Album} album - Current album object
 * @returns {void}
 */
function createOptionButtons(
  options: string[],
  container: HTMLElement | DocumentFragment,
  handleAnswer: (option: string, correctAnswer: string, question: Question, album: Album) => void,
  question: Question,
  album: Album
): void {
  options.forEach((option: string, index: number) => {
    const button = document.createElement("button");
    button.className =
      "relative w-full p-6 rounded-2xl text-left text-lg font-bold bg-gradient-to-br from-slate-700/90 to-slate-800/80 backdrop-blur-sm border border-slate-600/30 text-white transition-all duration-300 shadow-lg cursor-pointer min-h-[var(--min-touch-size)] flex items-center overflow-hidden hover:from-slate-600/95 hover:to-slate-700/90 hover:border-slate-500/50 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-3 focus-visible:shadow-[0_0_0_4px_rgba(59,130,246,0.3)] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:filter-grayscale";

    // Set appropriate ARIA attributes
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", "false");
    button.setAttribute("aria-label", `Option: ${option}`);
    button.setAttribute("data-index", index.toString());
    button.setAttribute("data-testid", `option-${index}`); // For easier testing

    // Create structured content for better visual scanning
    const optionNumber = document.createElement("span");
    optionNumber.className =
      "flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center mr-4 shadow-md border border-blue-400/30";
    optionNumber.textContent = `${index + 1}`;

    const optionText = document.createElement("span");
    optionText.className = "flex-1 text-left text-shadow-[0_1px_2px_rgba(0,0,0,0.3)]";
    optionText.textContent = option;

    // Append both elements to the button
    button.appendChild(optionNumber);
    button.appendChild(optionText);

    // Attach click handler
    button.onclick = (): void => {
      // Disable all buttons to prevent double clicks
      document.querySelectorAll("#options button").forEach((btn) => {
        (btn as HTMLButtonElement).disabled = true;
      });

      // Mark this option as selected for screen readers
      button.setAttribute("aria-checked", "true");

      // Add visual feedback for selection
      button.classList.add("selected-option");

      // Update styles for correct/incorrect answers
      setTimeout(() => {
        if (option === question.correctAnswer) {
          // Correct answer styling
          button.className = button.className.replace(
            "from-slate-700/90 to-slate-800/80",
            "from-green-600/95 to-green-700/90"
          );
          button.className = button.className.replace("border-slate-600/30", "border-green-500/60");
          button.className = button.className.replace(
            "shadow-lg",
            "shadow-[0_20px_25px_-5px_rgba(22,163,74,0.3),0_10px_10px_-5px_rgba(22,163,74,0.2)]"
          );
          button.style.animation = "correctPulse 0.6s ease-out";
        } else {
          // Incorrect answer styling
          button.className = button.className.replace(
            "from-slate-700/90 to-slate-800/80",
            "from-red-600/95 to-red-700/90"
          );
          button.className = button.className.replace("border-slate-600/30", "border-red-500/60");
          button.className = button.className.replace(
            "shadow-lg",
            "shadow-[0_20px_25px_-5px_rgba(220,38,38,0.3),0_10px_10px_-5px_rgba(220,38,38,0.2)]"
          );
          button.style.animation = "incorrectShake 0.6s ease-out";
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
 * Implements keyboard controls:
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
        case "ArrowDown":
        case "ArrowRight": {
          // Navigate to next option in a circular manner
          const nextIndex = (index + 1) % options.length;
          options[nextIndex].focus();
          break;
        }

        case "ArrowUp":
        case "ArrowLeft": {
          // Navigate to previous option in a circular manner
          const prevIndex = (index - 1 + options.length) % options.length;
          options[prevIndex].focus();
          break;
        }

        case "Enter":
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
