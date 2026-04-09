/**
 * Quiz Client Script
 *
 * Handles quiz interactions: selecting answers, navigation, and scoring.
 * All state is managed in memory and optionally saved to localStorage.
 */

import { safeLocalStorage } from "@shared-utils/utils/storage/safeStorage";

const QUIZ_RESULTS_KEY = "quiz-results";

// ── Discriminated union eliminates all `as` casts on `correct` ──

interface TrueFalseQuestion {
  question: string;
  type: "true-false";
  difficulty: "easy" | "medium" | "hard";
  options: string[];
  correct: boolean;
  explanation: string;
  source: string;
  sourceLine?: number;
}

interface SingleChoiceQuestion {
  question: string;
  type: "single-choice";
  difficulty: "easy" | "medium" | "hard";
  options: string[];
  correct: number;
  explanation: string;
  source: string;
  sourceLine?: number;
}

interface MultiChoiceQuestion {
  question: string;
  type: "multi-choice";
  difficulty: "easy" | "medium" | "hard";
  options: string[];
  correct: number[];
  explanation: string;
  source: string;
  sourceLine?: number;
}

export type QuizQuestion = TrueFalseQuestion | SingleChoiceQuestion | MultiChoiceQuestion;

export interface QuizState {
  currentQuestion: number;
  answers: (number | number[] | null)[];
  isAnswered: boolean[];
  correctCount: number;
  isComplete: boolean;
}

// ── Helpers ──

/**
 * Returns true when the supplied answer matches the question's correct value.
 */
function checkAnswer(q: QuizQuestion, answer: number | number[] | null): boolean {
  if (answer === null) {
    return false;
  }

  if (q.type === "true-false") {
    return q.correct === (answer === 0);
  }

  if (q.type === "multi-choice") {
    const selected = answer as number[];
    return (
      q.correct.length === selected.length && q.correct.every((i) => selected.includes(i))
    );
  }

  return (q.correct as number) === answer;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function selectRandomQuestions(questions: QuizQuestion[], count: number): QuizQuestion[] {
  return shuffleArray(questions).slice(0, count);
}

// ── SVG icons (server-rendered once, referenced as innerHTML only when needed) ──

const icons = {
  check:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 12l5 5L20 7"/></svg>',
  x: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m18 6l-12 12M6 6l12 12"/></svg>',
  circle:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>',
  circleCheck:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 12l2 2l4-4"/></svg>',
  square:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><rect x="5" y="5" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>',
  squareCheck:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><rect x="5" y="5" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 12l2 2l4-4"/></svg>',
  info: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11v4"/><path fill="currentColor" d="M12 8.25a1.25 1.25 0 1 0 0 2.5a1.25 1.25 0 0 0 0-2.5"/></svg>',
  refresh:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4"/></svg>',
  grid: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7 5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm9 0a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM7 14a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2zm9 0a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2z"/></svg>',
  trophy:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21h8M12 17v4M7 4h10v3a5 5 0 0 1-10 0zm10 1h2a2 2 0 0 1 0 4h-2M7 5H5a2 2 0 1 0 0 4h2"/></svg>',
};

// ── Main init ──

export function initQuiz(
  allQuestions: QuizQuestion[],
  passingScore: number,
  questionsPerSession: number = 20
) {
  const questions = selectRandomQuestions(allQuestions, questionsPerSession);

  const state: QuizState = {
    currentQuestion: 0,
    answers: questions.map(() => null),
    isAnswered: questions.map(() => false),
    correctCount: 0,
    isComplete: false,
  };

  const questionContainer = document.getElementById("quiz-question-container");
  const progressContainer = document.getElementById("quiz-progress-container");
  const resultContainer = document.getElementById("quiz-result-container");
  const navPrev = document.getElementById("quiz-nav-prev");
  const navNext = document.getElementById("quiz-nav-next");
  const navSubmit = document.getElementById("quiz-nav-submit");
  const checkAnswerBtn = document.getElementById("quiz-check-answer");
  const navNextLabel = navNext?.childNodes[0];

  if (!questionContainer) {
    return;
  }

  // ── Progress ──

  function renderProgress() {
    if (!progressContainer) {
      return;
    }

    const answeredCount = state.isAnswered.filter(Boolean).length;
    const scorePercentage =
      answeredCount > 0 ? Math.round((state.correctCount / answeredCount) * 100) : 0;
    const ariaValueText = `${answeredCount} of ${questions.length} questions answered`;

    progressContainer.innerHTML = `
      <div class="quiz-progress" role="progressbar" aria-valuenow="${answeredCount}" aria-valuemin="0" aria-valuemax="${questions.length}" aria-valuetext="${ariaValueText}">
        <p class="quiz-progress__eyebrow">Quiz progress</p>
        <div class="quiz-progress__headline">
          <span class="quiz-progress__index">Question ${state.currentQuestion + 1} of ${questions.length}</span>
          <span class="quiz-progress__target">Reach ${passingScore}% overall to pass this quiz.</span>
        </div>
        <div class="quiz-progress__bar">
          <div class="quiz-progress__fill" style="width: ${(answeredCount / questions.length) * 100}%"></div>
        </div>
        <div class="quiz-progress__stats">
          <div class="quiz-progress__stat">
            <span class="quiz-progress__stat-label">Answered</span>
            <strong class="quiz-progress__stat-value">${answeredCount}/${questions.length}</strong>
          </div>
          <div class="quiz-progress__stat">
            <span class="quiz-progress__stat-label">Correct so far</span>
            <strong class="quiz-progress__stat-value">${state.correctCount}</strong>
          </div>
          <div class="quiz-progress__stat">
            <span class="quiz-progress__stat-label">Accuracy</span>
            <strong class="quiz-progress__stat-value">${scorePercentage}%</strong>
          </div>
        </div>
      </div>
    `;
  }

  // ── Question DOM helpers ──

  /** Build the full question HTML on first render or question change. */
  function buildQuestionHTML(q: QuizQuestion): string {
    const displayOptions = q.type === "true-false" ? ["True", "False"] : q.options;
    const questionTypeLabel =
      q.type === "true-false"
        ? "True or False"
        : q.type === "multi-choice"
          ? "Multi-select"
          : "Single choice";

    const optionsHtml = displayOptions
      .map((option, index) => {
        const markerIcon = q.type === "multi-choice" ? icons.square : icons.circle;
        return `
          <button
            type="button"
            class="quiz-question__option"
            data-index="${index}"
            data-type="${q.type}"
            role="${q.type === "multi-choice" ? "checkbox" : "radio"}"
            aria-checked="false"
          >
            <span class="quiz-question__option-marker">${markerIcon}</span>
            <span class="quiz-question__option-text">${option}</span>
          </button>
        `;
      })
      .join("");

    return `
      <div class="quiz-question" data-answered="false" data-correct="">
        <div class="quiz-question__topline">
          <span class="quiz-question__number">Q${state.currentQuestion + 1}</span>
          <span class="quiz-question__type">${questionTypeLabel}</span>
          <span class="quiz-question__badge" hidden></span>
        </div>
        <div class="quiz-question__card">
          <p class="quiz-question__prompt">Question</p>
          <h3 class="quiz-question__text" tabindex="-1">${q.question}</h3>
          <p class="quiz-question__hint">${
            q.type === "multi-choice" ? "Select all that apply." : "Choose one answer."
          }</p>
          <div
            class="quiz-question__options"
            role="${q.type === "multi-choice" ? "group" : "radiogroup"}"
            aria-label="Answer options"
          >
            ${optionsHtml}
          </div>
        </div>
        <div class="quiz-question__explanation" role="status" aria-live="polite" aria-atomic="true" tabindex="-1" hidden>
          <div class="quiz-question__explanation-header">
            ${icons.info}
            <span>Explanation</span>
          </div>
          <p class="quiz-question__explanation-text"></p>
        </div>
      </div>
    `;
  }

  /** Update option visuals without rebuilding the DOM. */
  function updateOptionVisuals(q: QuizQuestion) {
    if (!questionContainer) {
      return;
    }
    const selectedAnswer = state.answers[state.currentQuestion];
    const isAnswered = state.isAnswered[state.currentQuestion];

    questionContainer
      .querySelectorAll<HTMLButtonElement>(".quiz-question__option")
      .forEach((btn) => {
        const index = Number(btn.dataset.index);
        const isSelected =
          q.type === "multi-choice"
            ? Array.isArray(selectedAnswer) && selectedAnswer.includes(index)
            : selectedAnswer === index;

        const isCorrectOption = checkAnswer(
          q,
          q.type === "multi-choice" ? [index] : index
        );
        const isCorrectSelected = isCorrectOption && isSelected;

        // Reset
        btn.classList.remove(
          "quiz-question__option--selected",
          "quiz-question__option--correct",
          "quiz-question__option--incorrect"
        );
        btn.setAttribute("aria-checked", String(isSelected));

        if (isAnswered) {
          btn.disabled = true;
          if (isCorrectOption) {
            btn.classList.add("quiz-question__option--correct");
          } else if (isSelected) {
            btn.classList.add("quiz-question__option--incorrect");
          }
        } else if (isSelected) {
          btn.classList.add("quiz-question__option--selected");
        }

        // Update marker icon
        const marker = btn.querySelector<HTMLSpanElement>(
          ".quiz-question__option-marker"
        );
        if (marker) {
          if (isAnswered && isCorrectOption) {
            marker.innerHTML =
              q.type === "multi-choice" ? icons.squareCheck : icons.circleCheck;
          } else if (isSelected && !isAnswered) {
            marker.innerHTML =
              q.type === "multi-choice" ? icons.squareCheck : icons.circleCheck;
          } else {
            marker.innerHTML = q.type === "multi-choice" ? icons.square : icons.circle;
          }
        }

        // Remove old status icons
        btn
          .querySelectorAll(".quiz-question__option-status")
          .forEach((el) => el.remove());

        // Add status icons after answer
        if (isAnswered) {
          const statusIcon = document.createElement("span");
          if (isCorrectSelected) {
            statusIcon.className =
              "quiz-question__option-status quiz-question__option-status--correct";
            statusIcon.innerHTML = icons.check;
          } else if (isSelected && !isCorrectOption) {
            statusIcon.className =
              "quiz-question__option-status quiz-question__option-status--incorrect";
            statusIcon.innerHTML = icons.x;
          }
          if (statusIcon.className) {
            btn.appendChild(statusIcon);
          }
        }
      });
  }

  /** Update the correctness badge after answering. */
  function updateBadge(q: QuizQuestion) {
    if (!questionContainer) {
      return;
    }
    const selectedAnswer = state.answers[state.currentQuestion];
    const isAnswered = state.isAnswered[state.currentQuestion];
    if (!isAnswered) {
      return;
    }

    const isCorrect = checkAnswer(q, selectedAnswer);
    const badge = questionContainer.querySelector<HTMLSpanElement>(
      ".quiz-question__badge"
    );
    if (badge) {
      badge.hidden = false;
      badge.className = `quiz-question__badge quiz-question__badge--${isCorrect ? "correct" : "incorrect"}`;
      badge.innerHTML = `${isCorrect ? icons.check : icons.x} ${isCorrect ? "Correct" : "Incorrect"}`;
    }

    const root = questionContainer.querySelector<HTMLDivElement>(".quiz-question");
    if (root) {
      root.dataset.answered = "true";
      root.dataset.correct = String(isCorrect);
    }
  }

  /** Show / fill explanation after answering. */
  function updateExplanation(q: QuizQuestion) {
    if (!questionContainer) {
      return;
    }
    const explanationEl = questionContainer.querySelector<HTMLElement>(
      ".quiz-question__explanation"
    );
    if (!explanationEl) {
      return;
    }

    const isAnswered = state.isAnswered[state.currentQuestion];
    if (isAnswered && q.explanation) {
      explanationEl.hidden = false;
      const textEl = explanationEl.querySelector<HTMLParagraphElement>(
        ".quiz-question__explanation-text"
      );
      if (textEl) {
        textEl.textContent = q.explanation;
      }
    } else {
      explanationEl.hidden = true;
    }
  }

  /** Update hint text with selection count for multi-choice. */
  function updateHint(q: QuizQuestion) {
    if (!questionContainer) {
      return;
    }
    const hint =
      questionContainer.querySelector<HTMLParagraphElement>(".quiz-question__hint");
    if (!hint) {
      return;
    }

    if (q.type === "multi-choice") {
      const count = getCurrentSelectionCount();
      hint.textContent =
        count > 0
          ? `${count} selected. You can choose more than one answer.`
          : "Select all that apply.";
    }
    // single-choice / true-false hint stays static
  }

  /** Update the question number label. */
  function updateQuestionNumber() {
    if (!questionContainer) {
      return;
    }
    const numberEl = questionContainer.querySelector<HTMLSpanElement>(
      ".quiz-question__number"
    );
    if (numberEl) {
      numberEl.textContent = `Q${state.currentQuestion + 1}`;
    }
  }

  /** Update the question type label. */
  function updateQuestionTypeLabel(q: QuizQuestion) {
    if (!questionContainer) {
      return;
    }
    const label =
      questionContainer.querySelector<HTMLSpanElement>(".quiz-question__type");
    if (!label) {
      return;
    }

    label.textContent =
      q.type === "true-false"
        ? "True or False"
        : q.type === "multi-choice"
          ? "Multi-select"
          : "Single choice";
  }

  // ── Selection ──

  function getCurrentSelectionCount(): number {
    const currentAnswer = state.answers[state.currentQuestion];
    if (currentAnswer === null) {
      return 0;
    }
    return Array.isArray(currentAnswer) ? currentAnswer.length : 1;
  }

  function handleOptionInteraction(index: number, q: QuizQuestion) {
    if (state.isAnswered[state.currentQuestion]) {
      return;
    }

    if (q.type === "multi-choice") {
      let currentSelection = (state.answers[state.currentQuestion] as number[]) || [];
      if (currentSelection.includes(index)) {
        currentSelection = currentSelection.filter((i) => i !== index);
      } else {
        currentSelection = [...currentSelection, index];
      }
      state.answers[state.currentQuestion] =
        currentSelection.length > 0 ? currentSelection : null;
    } else {
      state.answers[state.currentQuestion] = index;
    }

    updateOptionVisuals(q);
    updateHint(q);
  }

  // ── Navigation ──

  function updateNavigation() {
    if (!navPrev || !navNext || !navSubmit || !checkAnswerBtn) {
      return;
    }

    navPrev.hidden = state.currentQuestion === 0;

    const isCurrentAnswered = state.isAnswered[state.currentQuestion];
    const isLastQuestion = state.currentQuestion === questions.length - 1;
    const hasSelection = state.answers[state.currentQuestion] !== null;

    navNext.hidden = isLastQuestion && isCurrentAnswered;
    navSubmit.hidden = !isLastQuestion || !isCurrentAnswered;
    checkAnswerBtn.hidden = isCurrentAnswered;
    (checkAnswerBtn as HTMLButtonElement).disabled = !hasSelection || isCurrentAnswered;

    if (navNextLabel) {
      navNextLabel.textContent =
        isLastQuestion && !isCurrentAnswered ? "Check & Finish" : "Next";
    }

    if (navNext) {
      (navNext as HTMLButtonElement).disabled = !isCurrentAnswered && !navNext.hidden;
      navNext.setAttribute(
        "aria-label",
        isLastQuestion && !isCurrentAnswered
          ? "Check answer and finish quiz"
          : "Next question"
      );
    }
  }

  function goToQuestion(index: number) {
    if (index < 0 || index >= questions.length || !questionContainer) {
      return;
    }

    state.currentQuestion = index;
    const q = questions[index];
    questionContainer.innerHTML = buildQuestionHTML(q);
    bindOptionListeners(q);
    updateOptionVisuals(q);
    updateHint(q);
    updateNavigation();
    updateQuestionNumber();
    updateQuestionTypeLabel(q);

    if (state.isAnswered[index]) {
      updateBadge(q);
      updateExplanation(q);
    }

    // Focus the question text for accessibility
    const heading = questionContainer.querySelector<HTMLElement>(".quiz-question__text");
    heading?.focus();
  }

  function submitAnswer() {
    const selectedAnswer = state.answers[state.currentQuestion];
    if (selectedAnswer === null || !questionContainer) {
      return;
    }

    const q = questions[state.currentQuestion];
    const isCorrect = checkAnswer(q, selectedAnswer);

    state.isAnswered[state.currentQuestion] = true;
    if (isCorrect) {
      state.correctCount++;
    }

    updateOptionVisuals(q);
    updateBadge(q);
    updateExplanation(q);
    updateNavigation();
    renderProgress();

    // Focus explanation if present, otherwise next action
    if (q.explanation) {
      const explanation = questionContainer.querySelector<HTMLElement>(
        ".quiz-question__explanation"
      );
      explanation?.focus();
    } else {
      const nextAction = !navNext?.hidden
        ? navNext
        : !navSubmit?.hidden
          ? navSubmit
          : null;
      nextAction?.focus();
    }
  }

  // ── Keyboard navigation for answer options ──

  function handleOptionKeydown(e: KeyboardEvent, q: QuizQuestion) {
    if (state.isAnswered[state.currentQuestion] || !questionContainer) {
      return;
    }

    const options = Array.from(
      questionContainer.querySelectorAll<HTMLButtonElement>(".quiz-question__option")
    );
    const currentIndex = options.indexOf(e.currentTarget as HTMLButtonElement);
    if (currentIndex === -1) {
      return;
    }

    let targetIndex = -1;

    if (q.type === "multi-choice") {
      // Space toggles, ArrowRight/ArrowLeft moves focus
      if (e.key === " ") {
        e.preventDefault();
        handleOptionInteraction(currentIndex, q);
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        targetIndex = (currentIndex + 1) % options.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        targetIndex = (currentIndex - 1 + options.length) % options.length;
      }
    } else {
      // Single-choice / radio: arrows move and select
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        targetIndex = (currentIndex + 1) % options.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        targetIndex = (currentIndex - 1 + options.length) % options.length;
      }
    }

    if (targetIndex >= 0) {
      options[targetIndex].focus();
      // For radio-style questions, also select the option
      if (q.type !== "multi-choice") {
        handleOptionInteraction(targetIndex, q);
      }
    }
  }

  function bindOptionListeners(q: QuizQuestion) {
    if (!questionContainer) {
      return;
    }
    questionContainer
      .querySelectorAll<HTMLButtonElement>(".quiz-question__option")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = Number(btn.dataset.index);
          handleOptionInteraction(index, q);
        });

        btn.addEventListener("keydown", (e) => handleOptionKeydown(e, q));
      });
  }

  // ── Results ──

  function showResults() {
    state.isComplete = true;
    if (!resultContainer) {
      return;
    }

    const score = Math.round((state.correctCount / questions.length) * 100);
    const passed = score >= passingScore;

    if (questionContainer) {
      questionContainer.innerHTML = "";
    }
    if (navPrev) {
      navPrev.hidden = true;
    }
    if (navNext) {
      navNext.hidden = true;
    }
    if (navSubmit) {
      navSubmit.hidden = true;
    }
    if (checkAnswerBtn) {
      checkAnswerBtn.hidden = true;
    }

    resultContainer.innerHTML = `
      <div class="quiz-result quiz-result--${passed ? "passed" : "failed"}">
        <div class="quiz-result__header">
          <div class="quiz-result__icon">
            ${passed ? icons.trophy : icons.refresh}
          </div>
          <h2 class="quiz-result__title" tabindex="-1">${passed ? "Congratulations!" : "Keep Learning!"}</h2>
          <p class="quiz-result__subtitle">
            ${passed ? "You passed this quiz!" : "You didn't pass this quiz this time."}
          </p>
        </div>

        <div class="quiz-result__summary">
          <div class="quiz-result__summary-item">
            <span class="quiz-result__summary-label">Score</span>
            <strong class="quiz-result__summary-value">${score}%</strong>
          </div>
          <div class="quiz-result__summary-item">
            <span class="quiz-result__summary-label">Correct answers</span>
            <strong class="quiz-result__summary-value">${state.correctCount}/${questions.length}</strong>
          </div>
          <div class="quiz-result__summary-item">
            <span class="quiz-result__summary-label">Pass mark</span>
            <strong class="quiz-result__summary-value">${passingScore}%</strong>
          </div>
        </div>

        <div class="quiz-result__score">
          <div class="quiz-result__score-circle">
            <span
              class="quiz-result__score-ring"
              aria-hidden="true"
              style="display:block; inline-size:9rem; block-size:9rem; border-radius:50%; background:conic-gradient(${passed ? "var(--color-success)" : "var(--color-error)"} 0 ${score}%, var(--border-default) ${score}% 100%);"
            ></span>
            <span
              class="quiz-result__score-ring-core"
              aria-hidden="true"
              style="position:absolute; inline-size:7.75rem; block-size:7.75rem; border-radius:50%; background:var(--surface-1);"
            ></span>
            <span class="quiz-result__score-value">${score}%</span>
          </div>
          <p class="quiz-result__score-text">
            <strong>${state.correctCount}</strong> out of <strong>${questions.length}</strong> correct
          </p>
          <p class="quiz-result__passing">
            Passing score: <strong>${passingScore}%</strong>
          </p>
        </div>

        <div class="quiz-result__actions">
          <a href="${window.location.pathname}" class="quiz-result__btn quiz-result__btn--primary">
            ${icons.refresh}
            Try Again
          </a>
          <a href="/" class="quiz-result__btn quiz-result__btn--secondary">
            ${icons.grid}
            All Quizzes
          </a>
        </div>
      </div>
    `;

    // Live announcement for screen readers
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "assertive");
    liveRegion.setAttribute("role", "status");
    liveRegion.className = "quiz-result__announcement";
    liveRegion.textContent = passed
      ? `Congratulations! You passed with ${score} percent, ${state.correctCount} out of ${questions.length} correct.`
      : `You scored ${score} percent, ${state.correctCount} out of ${questions.length} correct. Passing score is ${passingScore} percent.`;
    resultContainer.prepend(liveRegion);

    saveResult(score, passed);

    const resultTitle = resultContainer.querySelector<HTMLElement>(".quiz-result__title");
    resultTitle?.focus();
  }

  function saveResult(score: number, passed: boolean) {
    const raw = safeLocalStorage.getRaw(QUIZ_RESULTS_KEY);
    const results = raw ? JSON.parse(raw) : {};
    const slug = window.location.pathname.replace("/", "");
    results[slug || "quiz"] = {
      score,
      passed,
      correctCount: state.correctCount,
      totalQuestions: questions.length,
      completedAt: new Date().toISOString(),
    };
    safeLocalStorage.set(QUIZ_RESULTS_KEY, results);
  }

  // ── Event listeners ──

  if (navPrev) {
    navPrev.addEventListener("click", () => goToQuestion(state.currentQuestion - 1));
  }

  if (navNext) {
    navNext.addEventListener("click", () => {
      if (!state.isAnswered[state.currentQuestion]) {
        submitAnswer();
      } else {
        goToQuestion(state.currentQuestion + 1);
      }
    });
  }

  if (navSubmit) {
    navSubmit.addEventListener("click", showResults);
  }

  if (checkAnswerBtn) {
    checkAnswerBtn.addEventListener("click", submitAnswer);
  }

  // ── Initial render ──

  renderProgress();
  const initialQ = questions[0];
  questionContainer.innerHTML = buildQuestionHTML(initialQ);
  bindOptionListeners(initialQ);
}
