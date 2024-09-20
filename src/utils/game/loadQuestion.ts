/**
 * Loads a new question and displays it in the UI.
 *
 * @param {any} question - The question object
 * @param {any} album - The album object
 * @param {HTMLDivElement} optionsContainer - The container for the options
 * @param {HTMLDivElement} spinner - The spinner element
 * @param {HTMLParagraphElement} questionElement - The element to display the question text
 * @param {Function} handleAnswer - The function to call when the user answers the question
 * @param {HTMLParagraphElement} feedbackElement - The element to display the feedback
 */
export function loadQuestion(
  question: any,
  album: any,
  optionsContainer: HTMLDivElement,
  spinner: HTMLDivElement,
  questionElement: HTMLParagraphElement,
  handleAnswer: Function,
  feedbackElement: HTMLParagraphElement,
) {
  const questionContainer = document.getElementById(
    "question-container",
  ) as HTMLDivElement;

  // Fade-out the current question
  // We use setTimeout to create a small delay between the fade-out and fade-in
  // This creates a nicer animation
  setTimeout(() => {
    questionContainer.classList.add("hidden");

    // Display the spinner
    spinner.classList.remove("hidden");

    // Wait a little bit before displaying the new question
    // This is to make sure the spinner is visible
    setTimeout(() => {
      // Set the question text
      questionElement.textContent = question.question;

      // Clear the options container
      optionsContainer.innerHTML = "";

      // Create a button for each option
      question.options.forEach(function (option: any) {
        const button = document.createElement("button");
        button.textContent = option;
        button.className = "button";
        button.onclick = function () {
          handleAnswer(option, question.correctAnswer, question, album);
        };
        optionsContainer.appendChild(button);
      });

      // Hide the spinner
      spinner.classList.add("hidden");

      // Fade-in the new question
      questionContainer.classList.remove("hidden");
    }, 500);

    // Reset the feedback
    feedbackElement.textContent = "";
  }, 500);
}
