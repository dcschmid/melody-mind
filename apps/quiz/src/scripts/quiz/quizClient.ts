/**
 * Quiz Client Script
 *
 * Handles quiz interactions: selecting answers, navigation, and scoring.
 * All state is managed in memory and optionally saved to localStorage.
 */

import { safeLocalStorage } from "@shared-utils/utils/storage/safeStorage";
import { icons as tablerIconSet } from "@iconify-json/tabler";

const QUIZ_RESULTS_KEY = "quiz-results";

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

interface IconifyCollection {
  width?: number;
  height?: number;
  icons: Record<
    string,
    {
      body: string;
      width?: number;
      height?: number;
    }
  >;
}

const TABLER_ICONS = tablerIconSet as IconifyCollection;

function renderTablerIcon(name: string): string {
  const icon = TABLER_ICONS.icons[name];
  if (!icon) {
    return "";
  }

  const width = icon.width ?? TABLER_ICONS.width ?? 24;
  const height = icon.height ?? TABLER_ICONS.height ?? 24;

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${icon.body}</svg>`;
}

const icons = {
  check: renderTablerIcon("check"),
  x: renderTablerIcon("x"),
  circle: renderTablerIcon("circle"),
  circleCheck: renderTablerIcon("circle-check"),
  square: renderTablerIcon("square"),
  squareCheck: renderTablerIcon("square-check"),
  info: renderTablerIcon("info-circle"),
  refresh: renderTablerIcon("refresh"),
  grid: renderTablerIcon("layout-grid"),
  trophy: renderTablerIcon("trophy"),
  arrowLeft: renderTablerIcon("arrow-left"),
  arrowRight: renderTablerIcon("arrow-right"),
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

  if (!questionContainer) {
    return;
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

  function renderQuestion() {
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
        <div class="quiz-question__explanation" aria-live="polite">
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

    const hintHtml =
      q.type === "multi-choice"
        ? `<p class="quiz-question__hint">Select all that apply</p>`
        : "";

    const sourceHtml =
      isAnswered && q.source
        ? `<p class="quiz-question__explanation-source"><strong>Source:</strong> ${q.source}${q.sourceLine ? `, line ${q.sourceLine}` : ""}</p>`
        : "";

    questionContainer.innerHTML = `
      <div class="quiz-question" data-answered="${isAnswered}" data-correct="${isCorrect}">
        <div class="quiz-question__topline">
          <span class="quiz-question__number">Q${state.currentQuestion + 1}</span>
          <span class="quiz-question__type">${questionTypeLabel}</span>
          ${badgeHtml}
        </div>
        <div class="quiz-question__card">
          <p class="quiz-question__prompt">Question</p>
          <h3 class="quiz-question__text">${q.question}</h3>
          ${hintHtml}
          <div class="quiz-question__options" role="group">
            ${optionsHtml}
          </div>
        </div>
        ${explanationHtml}
        ${sourceHtml}
      </div>
    `;

    // Add event listeners to options
    questionContainer.querySelectorAll(".quiz-question__option").forEach((btn) => {
      btn.addEventListener("click", handleOptionClick);
    });

    updateNavigation();
  }

  function handleOptionClick(e: Event) {
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

    renderQuestion();
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

    renderQuestion();
    renderProgress();
  }

  function updateNavigation() {
    if (!navPrev || !navNext || !navSubmit || !checkAnswerBtn) {
      return;
    }

    navPrev.hidden = state.currentQuestion === 0;

    const isCurrentAnswered = state.isAnswered[state.currentQuestion];
    const isLastQuestion = state.currentQuestion === questions.length - 1;

    navNext.hidden = isLastQuestion && isCurrentAnswered;
    navSubmit.hidden = !isLastQuestion || !isCurrentAnswered;
    checkAnswerBtn.hidden = isCurrentAnswered;

    if (navNext) {
      (navNext as HTMLButtonElement).disabled = !isCurrentAnswered && !navNext.hidden;
    }
  }

  function goToQuestion(index: number) {
    if (index < 0 || index >= questions.length) {
      return;
    }
    state.currentQuestion = index;
    renderQuestion();
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
          <h2 class="quiz-result__title">${passed ? "Congratulations!" : "Keep Learning!"}</h2>
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
              style="display:block; inline-size:9rem; block-size:9rem; border-radius:50%; background:conic-gradient(${passed ? "var(--color-gn-green-400)" : "var(--color-gn-red-400)"} 0 ${score}%, var(--gn-panel-border) ${score}% 100%);"
            ></span>
            <span
              class="quiz-result__score-ring-core"
              aria-hidden="true"
              style="position:absolute; inline-size:7.75rem; block-size:7.75rem; border-radius:50%; background:var(--gn-bg);"
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
  }

  function saveResult(score: number, passed: boolean) {
    const raw = safeLocalStorage.getRaw(QUIZ_RESULTS_KEY);
    const results = raw ? JSON.parse(raw) : {};
    const slug = window.location.pathname.replace("/", "");
    results[slug] = {
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
