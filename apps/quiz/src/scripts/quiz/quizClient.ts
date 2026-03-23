/**
 * Quiz Client Script
 *
 * Handles quiz interactions: selecting answers, navigation, and scoring.
 * All state is managed in memory and optionally saved to localStorage.
 */

import { safeLocalStorage } from "@shared-utils/utils/storage/safeStorage";

const QUIZ_RESULTS_KEY = "quiz-results";
const QUIZ_ROOT_SELECTOR = "[data-analytics-quiz='true']";

function sanitizeAnalyticsToken(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "unknown"
  );
}

function bucketScore(score: number): string {
  if (score >= 85) {
    return "85-100";
  }
  if (score >= 70) {
    return "70-84";
  }
  if (score >= 50) {
    return "50-69";
  }
  return "0-49";
}

export interface QuizQuestion {
  question: string;
  type: "single-choice" | "multi-choice" | "true-false";
  difficulty: "easy" | "medium" | "hard";
  options: string[];
  correct: number | number[] | boolean;
  explanation: string;
  source: string;
  sourceLine?: number;
}

export interface QuizState {
  currentQuestion: number;
  answers: (number | number[] | null)[];
  isAnswered: boolean[];
  correctCount: number;
  isComplete: boolean;
}

type AnalyticsWindow = Window & {
  mmAnalytics?: {
    trackEvent: (eventName: string) => void;
    trackConversion: (goalKey: "quizStart" | "quizComplete" | "quizPass") => void;
  };
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Selects a random subset of questions and shuffles them
 */
function selectRandomQuestions(questions: QuizQuestion[], count: number): QuizQuestion[] {
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, count);
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
  arrowLeft:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 6l-6 6l6 6"/></svg>',
  arrowRight:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 6l6 6l-6 6"/></svg>',
};

export function initQuiz(
  allQuestions: QuizQuestion[],
  passingScore: number,
  questionsPerSession: number = 20
) {
  // Select random questions for this session
  const questions = selectRandomQuestions(allQuestions, questionsPerSession);

  const state: QuizState = {
    currentQuestion: 0,
    answers: questions.map(() => null),
    isAnswered: questions.map(() => false),
    correctCount: 0,
    isComplete: false,
  };

  // DOM Elements
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

  const quizRoot = document.querySelector<HTMLElement>(QUIZ_ROOT_SELECTOR);
  const quizSlug = quizRoot?.dataset.analyticsQuizSlug || "unknown";
  const quizCategory = quizRoot?.dataset.analyticsQuizCategory || "unknown";
  const analyticsCategory = sanitizeAnalyticsToken(quizCategory);
  const analytics = (window as AnalyticsWindow).mmAnalytics;
  let hasTrackedStart = false;
  let hasTrackedCompletion = false;

  function trackQuizStart() {
    if (hasTrackedStart) {
      return;
    }

    hasTrackedStart = true;
    analytics?.trackEvent(`Quiz: start ${analyticsCategory}`);
    analytics?.trackConversion("quizStart");
  }

  function trackQuizCompletion(score: number, passed: boolean) {
    if (hasTrackedCompletion) {
      return;
    }

    hasTrackedCompletion = true;
    analytics?.trackEvent(`Quiz: complete ${analyticsCategory}`);
    analytics?.trackEvent(`Quiz: result ${passed ? "pass" : "fail"}`);
    analytics?.trackEvent(`Quiz: score ${bucketScore(score)}`);
    analytics?.trackConversion("quizComplete");

    if (passed) {
      analytics?.trackConversion("quizPass");
    }
  }

  function getCurrentSelectionCount(): number {
    const currentAnswer = state.answers[state.currentQuestion];

    if (currentAnswer === null) {
      return 0;
    }

    return Array.isArray(currentAnswer) ? currentAnswer.length : 1;
  }

  function renderProgress() {
    if (!progressContainer) {
      return;
    }

    const answeredCount = state.isAnswered.filter(Boolean).length;
    const scorePercentage =
      answeredCount > 0 ? Math.round((state.correctCount / answeredCount) * 100) : 0;
    progressContainer.innerHTML = `
      <div class="quiz-progress" role="progressbar" aria-valuenow="${answeredCount}" aria-valuemin="0" aria-valuemax="${questions.length}">
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

  function renderQuestion(focusTarget?: "question" | "explanation" | number) {
    if (!questionContainer) {
      return;
    }

    const q = questions[state.currentQuestion];
    const selectedAnswer = state.answers[state.currentQuestion];
    const isAnswered = state.isAnswered[state.currentQuestion];

    let isCorrect: boolean | null = null;
    if (isAnswered && selectedAnswer !== null) {
      if (q.type === "true-false") {
        isCorrect = (q.correct as boolean) === (selectedAnswer === 0);
      } else if (q.type === "multi-choice") {
        const correctArr = q.correct as number[];
        const selectedArr = selectedAnswer as number[];
        isCorrect =
          correctArr.length === selectedArr.length &&
          correctArr.every((i) => selectedArr.includes(i));
      } else {
        isCorrect = (q.correct as number) === selectedAnswer;
      }
    }

    const displayOptions = q.type === "true-false" ? ["True", "False"] : q.options;

    function isOptionCorrect(index: number): boolean {
      if (q.type === "true-false") {
        return (q.correct as boolean) === (index === 0);
      }
      if (q.type === "multi-choice") {
        return (q.correct as number[]).includes(index);
      }
      return (q.correct as number) === index;
    }

    function isOptionSelected(index: number): boolean {
      if (selectedAnswer === null) {
        return false;
      }
      if (q.type === "multi-choice") {
        return (selectedAnswer as number[]).includes(index);
      }
      return (selectedAnswer as number) === index;
    }

    const optionsHtml = displayOptions
      .map((option, index) => {
        const isSelected = isOptionSelected(index);
        const isCorrectOption = isOptionCorrect(index);

        let optionState = "";
        if (isAnswered) {
          if (isCorrectOption) {
            optionState = "correct";
          } else if (isSelected && !isCorrectOption) {
            optionState = "incorrect";
          }
        } else if (isSelected) {
          optionState = "selected";
        }

        const markerIcon =
          q.type === "multi-choice"
            ? isSelected
              ? icons.squareCheck
              : icons.square
            : isSelected
              ? icons.circleCheck
              : icons.circle;

        const statusIcon =
          isAnswered && isCorrectOption
            ? `<span class="quiz-question__option-status quiz-question__option-status--correct">${icons.check}</span>`
            : isAnswered && isSelected && !isCorrectOption
              ? `<span class="quiz-question__option-status quiz-question__option-status--incorrect">${icons.x}</span>`
              : "";

        return `
          <button
            type="button"
            class="quiz-question__option ${optionState ? `quiz-question__option--${optionState}` : ""}"
            data-index="${index}"
            data-type="${q.type}"
            role="${q.type === "multi-choice" ? "checkbox" : "radio"}"
            aria-checked="${isSelected ? "true" : "false"}"
            ${isAnswered ? "disabled" : ""}
          >
            <span class="quiz-question__option-marker">${markerIcon}</span>
            <span class="quiz-question__option-text">${option}</span>
            ${statusIcon}
          </button>
        `;
      })
      .join("");

    const explanationHtml =
      isAnswered && q.explanation
        ? `
        <div class="quiz-question__explanation" role="status" aria-live="polite" aria-atomic="true" tabindex="-1">
          <div class="quiz-question__explanation-header">
            ${icons.info}
            <span>Explanation</span>
          </div>
          <p class="quiz-question__explanation-text">${q.explanation}</p>
        </div>
      `
        : "";

    const badgeHtml = isAnswered
      ? `<span class="quiz-question__badge quiz-question__badge--${isCorrect ? "correct" : "incorrect"}">
          ${isCorrect ? icons.check : icons.x}
          ${isCorrect ? "Correct" : "Incorrect"}
        </span>`
      : "";

    const questionTypeLabel =
      q.type === "true-false"
        ? "True or False"
        : q.type === "multi-choice"
          ? "Multi-select"
          : "Single choice";
    const selectionCount = getCurrentSelectionCount();

    const hintHtml =
      q.type === "multi-choice"
        ? `<p class="quiz-question__hint">${
            selectionCount > 0
              ? `${selectionCount} selected. You can choose more than one answer.`
              : "Select all that apply."
          }</p>`
        : `<p class="quiz-question__hint">Choose one answer.</p>`;

    questionContainer.innerHTML = `
      <div class="quiz-question" data-answered="${isAnswered}" data-correct="${isCorrect}">
        <div class="quiz-question__topline">
          <span class="quiz-question__number">Q${state.currentQuestion + 1}</span>
          <span class="quiz-question__type">${questionTypeLabel}</span>
          ${badgeHtml}
        </div>
        <div class="quiz-question__card">
          <p class="quiz-question__prompt">Question</p>
          <h3 class="quiz-question__text" tabindex="-1">${q.question}</h3>
          ${hintHtml}
          <div
            class="quiz-question__options"
            role="${q.type === "multi-choice" ? "group" : "radiogroup"}"
            aria-label="Answer options"
          >
            ${optionsHtml}
          </div>
        </div>
        ${explanationHtml}
      </div>
    `;

    // Add event listeners to options
    questionContainer.querySelectorAll(".quiz-question__option").forEach((btn) => {
      btn.addEventListener("click", handleOptionClick);
    });

    updateNavigation();

    if (typeof focusTarget === "number") {
      const option = questionContainer.querySelector<HTMLButtonElement>(
        `.quiz-question__option[data-index="${focusTarget}"]`
      );
      option?.focus();
      return;
    }

    if (focusTarget === "explanation") {
      const explanation = questionContainer.querySelector<HTMLElement>(
        ".quiz-question__explanation"
      );
      explanation?.focus();
      return;
    }

    if (focusTarget === "question") {
      const heading =
        questionContainer.querySelector<HTMLElement>(".quiz-question__text");
      heading?.focus();
    }
  }

  function handleOptionClick(e: Event) {
    trackQuizStart();

    const btn = e.currentTarget as HTMLButtonElement;
    const index = parseInt(btn.dataset.index || "0", 10);
    const type = btn.dataset.type as QuizQuestion["type"];

    if (state.isAnswered[state.currentQuestion]) {
      return;
    }

    if (type === "multi-choice") {
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

    renderQuestion(index);
  }

  function submitAnswer() {
    const selectedAnswer = state.answers[state.currentQuestion];

    if (selectedAnswer === null) {
      return;
    }

    const q = questions[state.currentQuestion];
    let isCorrect: boolean;

    if (q.type === "true-false") {
      isCorrect = (q.correct as boolean) === (selectedAnswer === 0);
    } else if (q.type === "multi-choice") {
      const correctArr = q.correct as number[];
      const selectedArr = selectedAnswer as number[];
      isCorrect =
        correctArr.length === selectedArr.length &&
        correctArr.every((i) => selectedArr.includes(i));
    } else {
      isCorrect = (q.correct as number) === selectedAnswer;
    }

    state.isAnswered[state.currentQuestion] = true;
    if (isCorrect) {
      state.correctCount++;
    }

    renderQuestion(q.explanation ? "explanation" : "question");
    renderProgress();

    if (!q.explanation) {
      const nextAction = !navNext?.hidden
        ? navNext
        : !navSubmit?.hidden
          ? navSubmit
          : null;
      nextAction?.focus();
    }
  }

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
    if (index < 0 || index >= questions.length) {
      return;
    }
    state.currentQuestion = index;
    renderQuestion("question");
  }

  function showResults() {
    state.isComplete = true;

    if (!resultContainer) {
      return;
    }

    const score = Math.round((state.correctCount / questions.length) * 100);
    const passed = score >= passingScore;
    // Hide question and nav
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

    // Show results
    resultContainer.innerHTML = `
      <div class="quiz-result quiz-result--${passed ? "passed" : "failed"}">
        <div class="quiz-result__header">
          <div class="quiz-result__icon">
            ${passed ? icons.trophy : icons.refresh}
          </div>
          <h2 class="quiz-result__title" tabindex="-1">${passed ? "Congratulations!" : "Keep Learning!"}</h2>
          <p class="quiz-result__subtitle">
            ${passed ? `You passed this quiz!` : `You didn't pass this quiz this time.`}
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
              style="display:block; inline-size:9rem; block-size:9rem; border-radius:50%; background:conic-gradient(${passed ? "var(--color-success-500)" : "var(--color-error-500)"} 0 ${score}%, var(--border-default) ${score}% 100%);"
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

    // Save result to localStorage
    saveResult(score, passed);
    trackQuizCompletion(score, passed);

    const resultTitle = resultContainer.querySelector<HTMLElement>(".quiz-result__title");
    resultTitle?.focus();
  }

  function saveResult(score: number, passed: boolean) {
    const raw = safeLocalStorage.getRaw(QUIZ_RESULTS_KEY);
    const results = raw ? JSON.parse(raw) : {};
    const slug = window.location.pathname.replace("/", "");
    results[slug || quizSlug] = {
      score,
      passed,
      correctCount: state.correctCount,
      totalQuestions: questions.length,
      completedAt: new Date().toISOString(),
    };
    safeLocalStorage.set(QUIZ_RESULTS_KEY, results);
  }

  // Event listeners
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

  // Initial render
  renderProgress();
  renderQuestion();
}
