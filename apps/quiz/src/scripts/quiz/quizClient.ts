import { safeLocalStorage } from "@shared-utils/utils/storage/safeStorage";

const QUIZ_RESULTS_KEY = "quiz-results";

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

function isCorrectOption(q: QuizQuestion, index: number): boolean {
  if (q.type === "true-false") {
    return q.correct === (index === 0);
  }

  if (q.type === "multi-choice") {
    return q.correct.includes(index);
  }

  return q.correct === index;
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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

  function renderProgress() {
    if (!progressContainer) {
      return;
    }

    const answeredCount = state.isAnswered.filter(Boolean).length;
    const ariaValueText = `${answeredCount} of ${questions.length} questions answered`;

    progressContainer.innerHTML = `
      <div class="quiz-progress" role="progressbar" aria-valuenow="${answeredCount}" aria-valuemin="0" aria-valuemax="${questions.length}" aria-valuetext="${ariaValueText}">
        <div class="quiz-progress__headline">
          <span class="quiz-progress__index">${state.currentQuestion + 1}/${questions.length}</span>
          <span class="quiz-progress__target">${passingScore}% pass mark</span>
        </div>
        <div class="quiz-progress__bar">
          <div class="quiz-progress__fill" style="width: ${(answeredCount / questions.length) * 100}%"></div>
        </div>
      </div>
    `;
  }

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
        const inputType = q.type === "multi-choice" ? "checkbox" : "radio";
        const inputName = `quiz-question-${state.currentQuestion}`;
        return `
          <label
            class="quiz-question__option"
            data-index="${index}"
            data-type="${q.type}"
          >
            <input
              class="quiz-question__option-control"
              type="${inputType}"
              name="${inputName}"
              value="${index}"
            />
            <span class="quiz-question__option-text">${escapeHtml(option)}</span>
          </label>
        `;
      })
      .join("");

    return `
      <div class="quiz-question" data-answered="false" data-correct="">
        <div class="quiz-question__topline">
          <span class="quiz-question__type">${questionTypeLabel}</span>
          <span class="quiz-question__badge" hidden></span>
        </div>
        <div class="quiz-question__card">
          <h3 class="quiz-question__text" tabindex="-1">${escapeHtml(q.question)}</h3>
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

  function updateOptionVisuals(q: QuizQuestion) {
    if (!questionContainer) {
      return;
    }
    const selectedAnswer = state.answers[state.currentQuestion];
    const isAnswered = state.isAnswered[state.currentQuestion];

    questionContainer
      .querySelectorAll<HTMLLabelElement>(".quiz-question__option")
      .forEach((optionEl) => {
        const input = optionEl.querySelector<HTMLInputElement>(
          ".quiz-question__option-control"
        );
        if (!input) {
          return;
        }

        const index = Number(optionEl.dataset.index);
        const isSelected =
          q.type === "multi-choice"
            ? Array.isArray(selectedAnswer) && selectedAnswer.includes(index)
            : selectedAnswer === index;

        const correctOption = isCorrectOption(q, index);
        const isCorrectSelected = correctOption && isSelected;

        optionEl.classList.remove(
          "quiz-question__option--selected",
          "quiz-question__option--correct",
          "quiz-question__option--incorrect"
        );
        input.checked = isSelected;
        input.disabled = isAnswered;

        if (isAnswered) {
          if (correctOption) {
            optionEl.classList.add("quiz-question__option--correct");
          } else if (isSelected) {
            optionEl.classList.add("quiz-question__option--incorrect");
          }
        } else if (isSelected) {
          optionEl.classList.add("quiz-question__option--selected");
        }

        optionEl
          .querySelectorAll(".quiz-question__option-status")
          .forEach((el) => el.remove());

        if (isAnswered) {
          const statusIcon = document.createElement("span");
          if (isCorrectSelected) {
            statusIcon.className =
              "quiz-question__option-status quiz-question__option-status--correct";
            statusIcon.innerHTML = icons.check;
          } else if (isSelected && !correctOption) {
            statusIcon.className =
              "quiz-question__option-status quiz-question__option-status--incorrect";
            statusIcon.innerHTML = icons.x;
          }
          if (statusIcon.className) {
            optionEl.appendChild(statusIcon);
          }
        }
      });
  }

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
  }

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
    updateNavigation();
  }

  function updateNavigation() {
    if (!navPrev || !navNext || !navSubmit || !checkAnswerBtn) {
      return;
    }

    navPrev.hidden = state.currentQuestion === 0;

    const isCurrentAnswered = state.isAnswered[state.currentQuestion];
    const isLastQuestion = state.currentQuestion === questions.length - 1;
    const hasSelection = state.answers[state.currentQuestion] !== null;

    navNext.hidden = !isCurrentAnswered || isLastQuestion;
    navSubmit.hidden = !isLastQuestion || !isCurrentAnswered;
    checkAnswerBtn.hidden = isCurrentAnswered;
    (checkAnswerBtn as HTMLButtonElement).disabled = !hasSelection || isCurrentAnswered;

    if (navNextLabel) {
      navNextLabel.textContent = "Next";
    }

    if (navNext) {
      (navNext as HTMLButtonElement).disabled = navNext.hidden;
      navNext.setAttribute("aria-label", "Next question");
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
    updateQuestionTypeLabel(q);

    if (state.isAnswered[index]) {
      updateBadge(q);
      updateExplanation(q);
    }

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

  function bindOptionListeners(q: QuizQuestion) {
    if (!questionContainer) {
      return;
    }

    questionContainer
      .querySelectorAll<HTMLInputElement>(".quiz-question__option-control")
      .forEach((input) => {
        input.addEventListener("change", () => {
          const optionEl = input.closest<HTMLElement>(".quiz-question__option");
          const index = Number(optionEl?.dataset.index);
          if (!Number.isFinite(index)) {
            return;
          }
          handleOptionInteraction(index, q);
        });
      });
  }

  function showResults() {
    state.isComplete = true;
    if (!resultContainer) {
      return;
    }

    const score = Math.round((state.correctCount / questions.length) * 100);
    const passed = score >= passingScore;
    const missedCount = questions.length - state.correctCount;
    const title = passed ? "Strong score" : "Almost there";
    const subtitle = passed
      ? "You passed this quiz and kept a solid command of the topic."
      : "You did not pass this run, but the explanations are there for a cleaner second attempt.";
    const performanceLabel =
      score >= 90
        ? "Excellent"
        : score >= passingScore
          ? "Passed"
          : score >= Math.max(0, passingScore - 15)
            ? "Close"
            : "Needs review";
    const resultColor = passed ? "var(--color-success)" : "var(--color-error)";

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
          <p class="quiz-result__eyebrow">${performanceLabel}</p>
          <h2 class="quiz-result__title" tabindex="-1">${title}</h2>
          <p class="quiz-result__subtitle">
            ${subtitle}
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
            <span class="quiz-result__summary-label">Missed</span>
            <strong class="quiz-result__summary-value">${missedCount}</strong>
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
              style="--quiz-result-score:${score}%; --quiz-result-color:${resultColor};"
            ></span>
            <span
              class="quiz-result__score-ring-core"
              aria-hidden="true"
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
    let results: Record<string, unknown> = {};

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          results = parsed as Record<string, unknown>;
        }
      } catch (error) {
        console.warn("[quiz] Ignoring corrupt saved quiz results", error);
      }
    }

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

  renderProgress();
  const initialQ = questions[0];
  questionContainer.innerHTML = buildQuestionHTML(initialQ);
  bindOptionListeners(initialQ);
  updateNavigation();
}
