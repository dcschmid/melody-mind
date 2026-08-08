import {
  buildShareText,
  buildShareUrl,
  createQuizSession,
  createQuizSessionSnapshot,
  evaluateAnswer,
  getResultBreakdown,
  getReviewItems,
  getScore,
  getScoreBand,
  parseChallengeHash,
  restoreQuizSession,
} from "./quizEngine";
import {
  clearActiveQuiz,
  getBrowserStorage,
  readActiveQuiz,
  saveActiveQuiz,
  type PersistedQuizRoundV1,
} from "./quizPersistence";
import type { QuizQuestion, QuizSession, RuntimeQuestion } from "@quiz-types/quiz";

interface QuizPayload {
  quizId: string;
  title: string;
  fingerprint: string;
  questions: QuizQuestion[];
}

type StartMode = "continue" | "fresh" | "replace";

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
  const continueOtherLink = getElement<HTMLAnchorElement>("quiz-continue-other");
  const newRoundButton = getElement<HTMLButtonElement>("quiz-new-round");
  const confirmation = getElement<HTMLElement>("quiz-replace-confirmation");
  const confirmationCopy = getElement<HTMLElement>("quiz-replace-copy");
  const confirmReplacementButton = getElement<HTMLButtonElement>("quiz-replace-confirm");
  const cancelReplacementButton = getElement<HTMLButtonElement>("quiz-replace-cancel");
  const storageStatus = getElement<HTMLElement>("quiz-storage-status");
  const replayButton = getElement<HTMLButtonElement>("quiz-replay");
  const shareButton = getElement<HTMLButtonElement>("quiz-share");
  const shareStatus = getElement<HTMLElement>("quiz-share-status");
  const exitLink = getElement<HTMLAnchorElement>("quiz-exit");
  const resultReview = getElement<HTMLElement>("quiz-result-review");
  const resultReviewList = getElement<HTMLElement>("quiz-result-review-list");
  const resultPerfect = getElement<HTMLElement>("quiz-result-perfect");
  const challengeBox = getElement<HTMLElement>("quiz-challenge");
  const challengeCopy = getElement<HTMLElement>("quiz-challenge-copy");
  const storage = getBrowserStorage();

  let session: QuizSession | null = null;
  let activeRound: PersistedQuizRoundV1 | null = null;
  let selectedOptionIds = new Set<string>();
  let startMode: StartMode = "fresh";
  let storageFailureAnnounced = false;

  const setView = (view: "intro" | "game" | "result" | "error") => {
    intro.hidden = view !== "intro";
    game.hidden = view !== "game";
    result.hidden = view !== "result";
    error.hidden = view !== "error";
  };

  const announceStorageFailure = () => {
    if (storageFailureAnnounced) {
      return;
    }
    storageFailureAnnounced = true;
    storageStatus.textContent =
      "This browser could not save progress. The current round still works until you leave.";
  };

  const currentQuestion = (): RuntimeQuestion => {
    if (!session) {
      throw new Error("Quiz session has not started.");
    }
    return session.questions[session.currentIndex];
  };

  const persistSession = () => {
    if (!session || !storage || session.complete) {
      return;
    }

    const saved = saveActiveQuiz(storage, {
      quizId: payload.quizId,
      title: payload.title,
      fingerprint: payload.fingerprint,
      snapshot: createQuizSessionSnapshot(session, selectedOptionIds),
    });
    if (!saved) {
      announceStorageFailure();
    }
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
        const selectionCopy =
          selectedOptionIds.size === 0
            ? "Select all answers that apply."
            : `${selectedOptionIds.size} selected. Select all answers that apply.`;
        const shortcut = hint.querySelector<HTMLElement>(".quiz-question__shortcut");
        hint.firstChild?.replaceWith(document.createTextNode(selectionCopy));
        if (shortcut) {
          hint.append(shortcut);
        }
      }
    }

    persistSession();
  };

  const scrollToQuestion = () => {
    game.scrollIntoView({ block: "start" });
  };

  const renderFeedback = (question: RuntimeQuestion, focusHeading = true) => {
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
      createTextElement("h3", "quiz-feedback__context-title", "Why it matters")
    );
    feedbackHost.append(
      createTextElement("p", "quiz-feedback__context", question.context)
    );

    const sourceDetails = document.createElement("details");
    sourceDetails.className = "quiz-feedback__source-details";
    const sourceSummary = createTextElement(
      "summary",
      "quiz-feedback__source-summary",
      `Sources (${question.sources.length})`
    );
    const sources = document.createElement("ul");
    sources.className = "quiz-feedback__sources";
    sources.setAttribute("aria-label", "Sources for this answer");
    question.sources.forEach((source) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = source.url;
      link.textContent = `${source.publisher}: ${source.title}`;
      link.rel = "external";
      item.append(link);
      sources.append(item);
    });
    sourceDetails.append(sourceSummary, sources);
    feedbackHost.append(sourceDetails);

    questionHost
      .querySelectorAll<HTMLInputElement>('input[name="quiz-answer"]')
      .forEach((control) => {
        control.checked = answer.selectedOptionIds.includes(control.value);
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
    if (focusHeading) {
      heading.focus();
    }
  };

  const renderQuestion = (focusContent = true) => {
    if (!session) {
      return;
    }
    const question = currentQuestion();
    const existingAnswer = session.answers[session.currentIndex];
    feedbackHost.hidden = true;
    feedbackHost.replaceChildren();
    checkButton.hidden = false;
    checkButton.disabled = selectedOptionIds.size === 0;
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
    const finalOptionLetter = String.fromCharCode(64 + question.options.length);
    const shortcut = createTextElement(
      "span",
      "quiz-question__shortcut",
      `Use A–${finalOptionLetter} or 1–${question.options.length}, then Enter.`
    );
    shortcut.setAttribute("aria-hidden", "true");
    hint.append(shortcut);
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
      control.checked = selectedOptionIds.has(option.id);
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

    if (existingAnswer) {
      selectedOptionIds = new Set(existingAnswer.selectedOptionIds);
      renderFeedback(question, focusContent);
    } else if (focusContent) {
      legend.focus({ preventScroll: true });
      scrollToQuestion();
    }
  };

  const renderResultReview = () => {
    if (!session) {
      return;
    }

    const activeSession = session;
    const reviewItems = getReviewItems(activeSession);
    resultReviewList.replaceChildren();
    resultReview.hidden = reviewItems.length === 0;
    resultPerfect.hidden = reviewItems.length > 0;

    reviewItems.forEach((item) => {
      const details = document.createElement("details");
      details.className = "quiz-review-item";

      const summary = document.createElement("summary");
      summary.className = "quiz-review-item__summary";
      const status = createTextElement(
        "span",
        "quiz-review-item__status",
        item.answer.revealed ? "Answer shown" : "Incorrect"
      );
      const question = createTextElement(
        "span",
        "quiz-review-item__question",
        `${activeSession.questions.indexOf(item.question) + 1}. ${item.question.question}`
      );
      summary.append(status, question);

      const body = document.createElement("div");
      body.className = "quiz-review-item__body";
      if (!item.answer.revealed) {
        body.append(
          createTextElement(
            "p",
            "quiz-review-item__answer",
            `Your answer: ${item.selectedLabels.join(", ") || "No answer selected"}`
          )
        );
      }
      body.append(
        createTextElement(
          "p",
          "quiz-review-item__answer",
          `Correct answer: ${item.correctLabels.join(", ")}`
        ),
        createTextElement(
          "p",
          "quiz-review-item__explanation",
          item.question.explanation
        ),
        createTextElement("h3", "quiz-review-item__context-title", "Why it matters"),
        createTextElement("p", "quiz-review-item__context", item.question.context)
      );

      const sources = document.createElement("ul");
      sources.className = "quiz-review-item__sources";
      sources.setAttribute("aria-label", "Sources for this reviewed answer");
      item.question.sources.forEach((source) => {
        const sourceItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = source.url;
        link.rel = "external";
        link.textContent = `${source.publisher}: ${source.title}`;
        sourceItem.append(link);
        sources.append(sourceItem);
      });
      body.append(sources);
      details.append(summary, body);
      resultReviewList.append(details);
    });
  };

  const startSession = () => {
    try {
      session = createQuizSession(payload.questions);
      selectedOptionIds = new Set();
      activeRound = null;
      confirmation.hidden = true;
      setView("game");
      renderQuestion();
      persistSession();
    } catch (cause) {
      console.error("[quiz] Failed to start", cause);
      setView("error");
      error.querySelector<HTMLElement>("h1")?.focus();
    }
  };

  const continueSession = () => {
    if (!session) {
      startSession();
      return;
    }
    confirmation.hidden = true;
    setView("game");
    renderQuestion();
  };

  const showReplacementConfirmation = (replacement: "restart" | "replace") => {
    confirmationCopy.textContent =
      replacement === "restart"
        ? "Starting a new round will replace your unfinished progress in this quiz."
        : `Starting ${payload.title} will replace your unfinished ${activeRound?.title ?? "quiz"} round.`;
    confirmation.hidden = false;
    confirmReplacementButton.focus();
  };

  const showResult = () => {
    if (!session) {
      return;
    }
    session.complete = true;
    const score = getScore(session);
    const breakdown = getResultBreakdown(session);
    getElement<HTMLElement>("quiz-score").textContent =
      `${score} of ${session.questions.length} correct`;
    getElement<HTMLElement>("quiz-score-band").textContent = getScoreBand(score);
    getElement<HTMLElement>("quiz-result-correct").textContent = String(
      breakdown.correct
    );
    getElement<HTMLElement>("quiz-result-incorrect").textContent = String(
      breakdown.incorrect
    );
    getElement<HTMLElement>("quiz-result-revealed").textContent = String(
      breakdown.revealed
    );
    renderResultReview();
    if (storage && !clearActiveQuiz(storage)) {
      announceStorageFailure();
    }
    activeRound = null;
    setView("result");
    getElement<HTMLElement>("quiz-result-title").focus();
  };

  startButton.addEventListener("click", () => {
    if (startMode === "continue") {
      continueSession();
    } else if (startMode === "replace") {
      showReplacementConfirmation("replace");
    } else {
      startSession();
    }
  });
  newRoundButton.addEventListener("click", () => showReplacementConfirmation("restart"));
  confirmReplacementButton.addEventListener("click", startSession);
  cancelReplacementButton.addEventListener("click", () => {
    confirmation.hidden = true;
    if (startMode === "continue") {
      newRoundButton.focus();
    } else {
      startButton.focus();
    }
  });
  replayButton.addEventListener("click", startSession);

  checkButton.addEventListener("click", () => {
    if (!session || selectedOptionIds.size === 0) {
      return;
    }
    session.answers[session.currentIndex] = evaluateAnswer(
      currentQuestion(),
      Array.from(selectedOptionIds)
    );
    persistSession();
    renderFeedback(currentQuestion());
  });

  revealButton.addEventListener("click", () => {
    if (!session) {
      return;
    }
    session.answers[session.currentIndex] = evaluateAnswer(currentQuestion(), [], true);
    selectedOptionIds = new Set();
    persistSession();
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
    selectedOptionIds = new Set();
    renderQuestion();
    persistSession();
  });

  game.addEventListener("keydown", (event) => {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.repeat ||
      (event.target instanceof HTMLElement && event.target.closest("a, button, summary"))
    ) {
      return;
    }

    if (event.key === "Enter") {
      if (!nextButton.hidden) {
        event.preventDefault();
        nextButton.click();
      } else if (!checkButton.disabled) {
        event.preventDefault();
        checkButton.click();
      }
      return;
    }

    if (!session || session.answers[session.currentIndex]) {
      return;
    }

    const key = event.key.toLowerCase();
    const optionIndex = /^[a-f]$/u.test(key)
      ? key.charCodeAt(0) - 97
      : /^[1-6]$/u.test(key)
        ? Number(key) - 1
        : -1;
    const controls = Array.from(
      questionHost.querySelectorAll<HTMLInputElement>('input[name="quiz-answer"]')
    );
    const control = controls[optionIndex];
    if (!control) {
      return;
    }

    event.preventDefault();
    control.checked = control.type === "checkbox" ? !control.checked : true;
    control.dispatchEvent(new Event("change", { bubbles: true }));
    control.focus();
  });

  shareButton.addEventListener("click", async () => {
    if (!session) {
      return;
    }
    const score = getScore(session);
    const shareUrl = buildShareUrl(window.location.href, score, payload.fingerprint);
    const text = buildShareText(payload.title, score, shareUrl);
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

  if (!storage) {
    exitLink.textContent = "Exit quiz";
    announceStorageFailure();
  } else {
    const stored = readActiveQuiz(storage);
    if (stored.status === "invalid") {
      storageStatus.textContent =
        "Saved progress could not be read and was discarded. You can start a new round.";
    } else if (stored.status === "ready") {
      activeRound = stored.round;
      if (activeRound.quizId === payload.quizId) {
        if (activeRound.fingerprint !== payload.fingerprint) {
          clearActiveQuiz(storage);
          activeRound = null;
          storageStatus.textContent =
            "This quiz was updated, so its saved round was discarded.";
        } else {
          try {
            session = restoreQuizSession(payload.questions, activeRound.snapshot);
            selectedOptionIds = new Set(activeRound.snapshot.selectedOptionIds);
            startMode = "continue";
            startButton.textContent = `Continue question ${session.currentIndex + 1} of ${session.questions.length}`;
            newRoundButton.hidden = false;
            storageStatus.textContent =
              "Your unfinished round is saved only in this browser.";
          } catch {
            clearActiveQuiz(storage);
            activeRound = null;
            session = null;
            selectedOptionIds = new Set();
            storageStatus.textContent =
              "Saved progress no longer matched this quiz and was discarded.";
          }
        }
      } else {
        startMode = "replace";
        continueOtherLink.href = `/${activeRound.quizId}/`;
        continueOtherLink.textContent = `Continue ${activeRound.title}`;
        continueOtherLink.hidden = false;
        storageStatus.textContent = `Question ${activeRound.snapshot.currentIndex + 1} of ${activeRound.snapshot.questions.length} is saved in ${activeRound.title}. Starting this quiz will replace it.`;
      }
    }
  }

  const challenge = parseChallengeHash(window.location.hash);
  if (challenge && challenge.fingerprint === payload.fingerprint) {
    challengeCopy.textContent = `Someone scored ${challenge.score}/10 on this quiz. Think you can do better?`;
    challengeBox.hidden = false;
  }

  setView("intro");
}
