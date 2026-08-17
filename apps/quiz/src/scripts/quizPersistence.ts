import type { QuizSessionSnapshot } from "@quiz-types/quiz";

export const ACTIVE_QUIZ_STORAGE_KEY = "melodymind.quiz.active.v1";

export interface PersistedQuizRoundV1 {
  version: 1;
  quizId: string;
  title: string;
  fingerprint: string;
  savedAt: string;
  snapshot: QuizSessionSnapshot;
}

export type ActiveQuizReadResult =
  | { status: "empty" }
  | { status: "invalid" }
  | { status: "ready"; round: PersistedQuizRoundV1 };

interface StorageLike {
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isAnswer(value: unknown): boolean {
  if (value === null) {
    return true;
  }

  return (
    isRecord(value) &&
    isStringArray(value.selectedOptionIds) &&
    typeof value.correct === "boolean" &&
    typeof value.revealed === "boolean"
  );
}

function isSnapshot(value: unknown): value is QuizSessionSnapshot {
  if (!isRecord(value)) {
    return false;
  }

  const { currentIndex, questions, answers, selectedOptionIds } = value;
  if (
    typeof currentIndex !== "number" ||
    !Number.isInteger(currentIndex) ||
    currentIndex < 0 ||
    !Array.isArray(questions) ||
    questions.length === 0 ||
    !Array.isArray(answers) ||
    answers.length !== questions.length ||
    !isStringArray(selectedOptionIds)
  ) {
    return false;
  }

  return (
    currentIndex < questions.length &&
    questions.every(
      (question) =>
        isRecord(question) &&
        typeof question.id === "string" &&
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(question.id) &&
        isStringArray(question.optionIds) &&
        question.optionIds.length >= 2
    ) &&
    answers.every(isAnswer)
  );
}

function isPersistedRound(value: unknown): value is PersistedQuizRoundV1 {
  return (
    isRecord(value) &&
    value.version === 1 &&
    typeof value.quizId === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value.quizId) &&
    typeof value.title === "string" &&
    value.title.length > 0 &&
    typeof value.fingerprint === "string" &&
    value.fingerprint.length > 0 &&
    typeof value.savedAt === "string" &&
    !Number.isNaN(Date.parse(value.savedAt)) &&
    isSnapshot(value.snapshot)
  );
}

export function getBrowserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readActiveQuiz(storage: StorageLike): ActiveQuizReadResult {
  try {
    const serialized = storage.getItem(ACTIVE_QUIZ_STORAGE_KEY);
    if (!serialized) {
      return { status: "empty" };
    }

    const value: unknown = JSON.parse(serialized);
    if (!isPersistedRound(value)) {
      storage.removeItem(ACTIVE_QUIZ_STORAGE_KEY);
      return { status: "invalid" };
    }

    return { status: "ready", round: value };
  } catch {
    try {
      storage.removeItem(ACTIVE_QUIZ_STORAGE_KEY);
    } catch {
      /* Unreadable storage may also be unwritable; the UI still shows the hint. */
    }
    return { status: "invalid" };
  }
}

export function saveActiveQuiz(
  storage: StorageLike,
  round: Omit<PersistedQuizRoundV1, "savedAt" | "version">
): boolean {
  try {
    storage.setItem(
      ACTIVE_QUIZ_STORAGE_KEY,
      JSON.stringify({
        ...round,
        version: 1,
        savedAt: new Date().toISOString(),
      } satisfies PersistedQuizRoundV1)
    );
    return true;
  } catch {
    return false;
  }
}

export function clearActiveQuiz(storage: StorageLike): boolean {
  try {
    storage.removeItem(ACTIVE_QUIZ_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
