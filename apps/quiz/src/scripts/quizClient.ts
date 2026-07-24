import {
  buildShareText,
  createQuizSession,
  evaluateAnswer,
  getScore,
  getScoreBand,
} from "./quizEngine";
import type { QuizQuestion, QuizSession, RuntimeQuestion } from "@quiz-types/quiz";

interface QuizPayload {
  title: string;
  questions: QuizQuestion[];
}

function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing quiz element: ${id}`);
  }
  return element as T;
}

function createTextElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text: string
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

export function initQuiz(): void {
  const dataElement = getElement<HTMLScriptElement>("quiz-data");
  const payload = JSON.parse(dataElement.textContent || "{}") as QuizPayload;
  const intro = getElement<HTMLElement>("quiz-intro");
  const game = getElement<HTMLElement>("quiz-game");
  const result = getElement<HTMLElement>("quiz-result");
  const error = getElement<HTMLElement>("quiz-error");
  const questionHost = getElement<HTMLElement>("quiz-question");
  const feedbackHost = getElement<HTMLElement>("quiz-feedback");
  const progress = getElement<HTMLProgressElement>("quiz-progress");
  const progressText = getElement<HTMLElement>("quiz-progress-text");
  const checkButton = getElement<HTMLButtonElement>("quiz-check");
  const revealButton = getElement<HTMLButtonElement>("quiz-reveal");
  const nextButton = getElement<HTMLButtonElement>("quiz-next");
  const startButton = getElement<HTMLButtonElement>("quiz-start");
  const replayButton = getElement<HTMLButtonElement>("quiz-replay");
  const shareButton = getElement<HTMLButtonElement>("quiz-share");
  const shareStatus = getElement<HTMLElement>("quiz-share-status");

  let session: QuizSession | null = null;
  let selectedOptionIds = new Set<string>();

  const setView = (view: "intro" | "game" | "result" | "error") => {
    intro.hidden = view !== "intro";
    game.hidden = view !== "game";
    result.hidden = view !== "result";
    error.hidden = view !== "error";
  };

  const currentQuestion = (): RuntimeQuestion => {
    if (!session) {
      throw new Error("Quiz session has not started.");
    }
    return session.questions[session.currentIndex];
  };

  const updateSelection = (question: RuntimeQuestion) => {
    const controls = questionHost.querySelectorAll<HTMLInputElement>(
      'input[name="quiz-answer"]'
    );
    selectedOptionIds = new Set(
      Array.from(controls)
        .filter((control) => control.checked)
        .map((control) => control.value)
    );
    checkButton.disabled = selectedOptionIds.size === 0;

    if (question.type === "multi-choice") {
      const hint = questionHost.querySelector<HTMLElement>("[data-selection-hint]");
      if (hint) {
        hint.textContent =
          selectedOptionIds.size === 0
            ? "Select all answers that apply."
            : `${selectedOptionIds.size} selected. Select all answers that apply.`;
      }
    }
  };

  const renderFeedback = (question: RuntimeQuestion) => {
    if (!session) {
      return;
    }
    const answer = session.answers[session.currentIndex];
    if (!answer) {
      return;
    }

    feedbackHost.replaceChildren();
    feedbackHost.hidden = false;
    feedbackHost.className = [
      "quiz-feedback",
      answer.correct ? "quiz-feedback--correct" : "quiz-feedback--incorrect",
    ].join(" ");

    const heading = createTextElement(
      "h2",
      "quiz-feedback__title",
      answer.correct ? "Correct" : answer.revealed ? "Answer shown" : "Not quite"
    );
    heading.tabIndex = -1;
    feedbackHost.append(heading);

    if (!answer.correct) {
      const correctLabels = question.options
        .filter((option) => question.correctOptionIds.includes(option.id))
        .map((option) => option.label)
        .join(", ");
      feedbackHost.append(
        createTextElement(
          "p",
          "quiz-feedback__answer",
          `Correct answer: ${correctLabels}`
        )
      );
    }

    feedbackHost.append(
      createTextElement("p", "quiz-feedback__explanation", question.explanation)
    );

    feedbackHost.append(
      createTextElement("p", "quiz-feedback__source-label", "Topic reading")
    );

    const sources = document.createElement("ul");
    sources.className = "quiz-feedback__sources";
    sources.setAttribute("aria-label", "Topic reading");
    question.sources.forEach((source) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = source.url;
      link.textContent = `${source.publisher}: ${source.title}`;
      link.rel = "external";
      item.append(link);
      sources.append(item);
    });
    feedbackHost.append(sources);

    questionHost
      .querySelectorAll<HTMLInputElement>('input[name="quiz-answer"]')
      .forEach((control) => {
        control.disabled = true;
        const option = control.closest<HTMLElement>(".quiz-option");
        if (!option) {
          return;
        }
        const isCorrect = question.correctOptionIds.includes(control.value);
        const isSelected = answer.selectedOptionIds.includes(control.value);
        option.dataset.correct = String(isCorrect);
        option.dataset.selected = String(isSelected);
      });

    checkButton.hidden = true;
    revealButton.hidden = true;
    nextButton.hidden = false;
    nextButton.textContent =
      session.currentIndex === session.questions.length - 1
        ? "See your result"
        : "Next question";
    heading.focus();
  };

  const renderQuestion = () => {
    if (!session) {
      return;
    }
    const question = currentQuestion();
    selectedOptionIds = new Set();
    feedbackHost.hidden = true;
    feedbackHost.replaceChildren();
    checkButton.hidden = false;
    checkButton.disabled = true;
    revealButton.hidden = false;
    nextButton.hidden = true;

    progress.value = session.currentIndex + 1;
    progress.max = session.questions.length;
    progressText.textContent = `Question ${session.currentIndex + 1} of ${session.questions.length}`;

    const fieldset = document.createElement("fieldset");
    fieldset.className = "quiz-question";
    const legend = document.createElement("legend");
    legend.className = "quiz-question__legend";
    legend.textContent = question.question;
    legend.tabIndex = -1;
    fieldset.append(legend);

    const hint = createTextElement(
      "p",
      "quiz-question__hint",
      question.type === "multi-choice"
        ? "Select all answers that apply."
        : "Choose one answer."
    );
    hint.dataset.selectionHint = "";
    fieldset.append(hint);

    const options = document.createElement("div");
    options.className = "quiz-question__options";
    question.options.forEach((option, index) => {
      const label = document.createElement("label");
      label.className = "quiz-option";
      const control = document.createElement("input");
      control.className = "quiz-option__control";
      control.type = question.type === "multi-choice" ? "checkbox" : "radio";
      control.name = "quiz-answer";
      control.value = option.id;
      control.addEventListener("change", () => updateSelection(question));

      const marker = createTextElement(
        "span",
        "quiz-option__marker",
        String.fromCharCode(65 + index)
      );
      marker.setAttribute("aria-hidden", "true");
      const text = createTextElement("span", "quiz-option__text", option.label);
      label.append(control, marker, text);
      options.append(label);
    });
    fieldset.append(options);
    questionHost.replaceChildren(fieldset);
    legend.focus();
  };

  const startSession = () => {
    try {
      session = createQuizSession(payload.questions);
      setView("game");
      renderQuestion();
    } catch (cause) {
      console.error("[quiz] Failed to start", cause);
      setView("error");
      error.querySelector<HTMLElement>("h1")?.focus();
    }
  };

  const showResult = () => {
    if (!session) {
      return;
    }
    session.complete = true;
    const score = getScore(session);
    getElement<HTMLElement>("quiz-score").textContent = `${score} of 10 correct`;
    getElement<HTMLElement>("quiz-score-band").textContent = getScoreBand(score);
    setView("result");
    getElement<HTMLElement>("quiz-result-title").focus();
  };

  startButton.addEventListener("click", startSession);
  replayButton.addEventListener("click", startSession);

  checkButton.addEventListener("click", () => {
    if (!session || selectedOptionIds.size === 0) {
      return;
    }
    session.answers[session.currentIndex] = evaluateAnswer(
      currentQuestion(),
      Array.from(selectedOptionIds)
    );
    renderFeedback(currentQuestion());
  });

  revealButton.addEventListener("click", () => {
    if (!session) {
      return;
    }
    session.answers[session.currentIndex] = evaluateAnswer(currentQuestion(), [], true);
    renderFeedback(currentQuestion());
  });

  nextButton.addEventListener("click", () => {
    if (!session) {
      return;
    }
    if (session.currentIndex === session.questions.length - 1) {
      showResult();
      return;
    }
    session.currentIndex += 1;
    renderQuestion();
  });

  shareButton.addEventListener("click", async () => {
    if (!session) {
      return;
    }
    const text = buildShareText(payload.title, getScore(session), window.location.href);
    shareStatus.textContent = "";

    try {
      if (navigator.share) {
        await navigator.share({ title: `${payload.title} | MelodyMind Quiz`, text });
        shareStatus.textContent = "Share sheet opened.";
        return;
      }

      await navigator.clipboard.writeText(text);
      shareStatus.textContent = "Result copied.";
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") {
        return;
      }
      shareStatus.textContent = "The result could not be shared. Try again.";
    }
  });

  setView("intro");
}
