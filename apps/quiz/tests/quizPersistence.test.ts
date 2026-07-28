import { describe, expect, it } from "vitest";

import {
  ACTIVE_QUIZ_STORAGE_KEY,
  clearActiveQuiz,
  readActiveQuiz,
  saveActiveQuiz,
} from "../src/scripts/quizPersistence";
import type { QuizSessionSnapshot } from "../src/types/quiz";

class MemoryStorage {
  readonly values = new Map<string, string>();
  failReads = false;
  failWrites = false;

  getItem(key: string): string | null {
    if (this.failReads) {
      throw new Error("Storage unavailable");
    }
    return this.values.get(key) ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    if (this.failWrites) {
      throw new Error("Storage unavailable");
    }
    this.values.set(key, value);
  }
}

const snapshot: QuizSessionSnapshot = {
  currentIndex: 1,
  questions: [
    {
      id: "question-one",
      optionIds: ["question-one-option-1", "question-one-option-2"],
    },
    {
      id: "question-two",
      optionIds: ["question-two-option-1", "question-two-option-2"],
    },
  ],
  answers: [
    {
      selectedOptionIds: ["question-one-option-1"],
      correct: true,
      revealed: false,
    },
    null,
  ],
  selectedOptionIds: ["question-two-option-2"],
};

describe("quiz persistence", () => {
  it("saves and reads one versioned active round", () => {
    const storage = new MemoryStorage();

    expect(
      saveActiveQuiz(storage, {
        quizId: "the-1980s",
        title: "The 1980s",
        fingerprint: "content-1",
        snapshot,
      })
    ).toBe(true);

    const stored = readActiveQuiz(storage);
    expect(stored.status).toBe("ready");
    if (stored.status === "ready") {
      expect(stored.round.quizId).toBe("the-1980s");
      expect(stored.round.snapshot).toEqual(snapshot);
      expect(stored.round.version).toBe(1);
    }
  });

  it("discards malformed or unsupported data", () => {
    const storage = new MemoryStorage();
    storage.values.set(ACTIVE_QUIZ_STORAGE_KEY, '{"version":2}');

    expect(readActiveQuiz(storage)).toEqual({ status: "invalid" });
    expect(storage.values.has(ACTIVE_QUIZ_STORAGE_KEY)).toBe(false);
  });

  it("fails safely when storage access is blocked", () => {
    const storage = new MemoryStorage();
    storage.failWrites = true;
    expect(
      saveActiveQuiz(storage, {
        quizId: "the-1980s",
        title: "The 1980s",
        fingerprint: "content-1",
        snapshot,
      })
    ).toBe(false);

    storage.failWrites = false;
    storage.failReads = true;
    expect(readActiveQuiz(storage)).toEqual({ status: "invalid" });
  });

  it("clears completed or discarded progress", () => {
    const storage = new MemoryStorage();
    storage.values.set(ACTIVE_QUIZ_STORAGE_KEY, "{}");

    expect(clearActiveQuiz(storage)).toBe(true);
    expect(storage.values.has(ACTIVE_QUIZ_STORAGE_KEY)).toBe(false);
  });
});
