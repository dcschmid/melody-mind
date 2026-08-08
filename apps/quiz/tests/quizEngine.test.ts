import { describe, expect, it } from "vitest";

import {
  buildShareText,
  buildShareUrl,
  CHALLENGE_MAX_SCORE,
  createQuizSession,
  createQuizSessionSnapshot,
  evaluateAnswer,
  getResultBreakdown,
  getReviewItems,
  getScore,
  getScoreBand,
  getNextQuizId,
  normalizeQuestion,
  parseChallengeHash,
  restoreQuizSession,
} from "../src/scripts/quizEngine";
import type { QuestionDifficulty, QuizQuestion } from "../src/types/quiz";

const source = {
  publisher: "Library of Congress",
  title: "Research reference",
  url: "https://www.loc.gov/",
  checkedAt: "2026-07-24",
};

function buildQuestion(
  id: string,
  difficulty: QuestionDifficulty,
  overrides: Partial<QuizQuestion> = {}
): QuizQuestion {
  return {
    id,
    question: `Which answer is correct for ${id}?`,
    type: "single-choice",
    difficulty,
    options: ["Correct", "Incorrect", "Also incorrect"],
    correct: 0,
    explanation: "The first option is correct for this deterministic test question.",
    context:
      "This second paragraph verifies that editorial context survives normalization without affecting answer evaluation.",
    sources: [source],
    ...overrides,
  };
}

function buildPool(): QuizQuestion[] {
  return [
    ...Array.from({ length: 8 }, (_, index) => buildQuestion(`easy-${index}`, "easy")),
    ...Array.from({ length: 8 }, (_, index) =>
      buildQuestion(`medium-${index}`, "medium")
    ),
    ...Array.from({ length: 6 }, (_, index) => buildQuestion(`hard-${index}`, "hard")),
  ];
}

describe("createQuizSession", () => {
  it("selects ten unique questions with the required difficulty balance", () => {
    const session = createQuizSession(buildPool(), () => 0.999);
    const counts = session.questions.reduce<Record<string, number>>(
      (result, question) => {
        result[question.difficulty] = (result[question.difficulty] ?? 0) + 1;
        return result;
      },
      {}
    );

    expect(session.questions).toHaveLength(10);
    expect(new Set(session.questions.map((question) => question.id)).size).toBe(10);
    expect(counts).toEqual({ easy: 4, medium: 4, hard: 2 });
    expect(session.answers).toEqual(Array.from({ length: 10 }, () => null));
  });

  it("rejects a pool without enough hard questions", () => {
    const pool = buildPool().filter((question) => question.difficulty !== "hard");
    expect(() => createQuizSession(pool, () => 0.5)).toThrow("Not enough hard questions");
  });

  it("restores the exact question and option order from a snapshot", () => {
    const original = createQuizSession(buildPool(), () => 0);
    const selectedOptionId = original.questions[0].options[1].id;
    original.answers[0] = evaluateAnswer(original.questions[0], [selectedOptionId]);
    original.currentIndex = 1;
    const currentSelection = [original.questions[1].options[0].id];
    const snapshot = createQuizSessionSnapshot(original, currentSelection);
    const restored = restoreQuizSession(buildPool(), snapshot);

    expect(restored.questions.map((question) => question.id)).toEqual(
      original.questions.map((question) => question.id)
    );
    expect(restored.questions.map((question) => question.options)).toEqual(
      original.questions.map((question) => question.options)
    );
    expect(restored.answers).toEqual(original.answers);
    expect(snapshot.selectedOptionIds).toEqual(currentSelection);
  });

  it("rejects saved progress when a question is no longer available", () => {
    const original = createQuizSession(buildPool(), () => 0.999);
    const snapshot = createQuizSessionSnapshot(original, []);
    const changedPool = buildPool().filter(
      (question) => question.id !== snapshot.questions[0].id
    );

    expect(() => restoreQuizSession(changedPool, snapshot)).toThrow(
      "Saved question is no longer available"
    );
  });
});

describe("answer evaluation", () => {
  it("keeps shuffled option IDs connected to the correct single answer", () => {
    const question = normalizeQuestion(buildQuestion("single", "easy"), () => 0);
    expect(evaluateAnswer(question, question.correctOptionIds).correct).toBe(true);
    expect(question.context).toContain("editorial context");
  });

  it("requires the exact set for a multi-choice answer", () => {
    const question = normalizeQuestion(
      buildQuestion("multiple", "medium", {
        type: "multi-choice",
        options: ["One", "Two", "Three", "Four"],
        correct: [0, 2],
      }),
      () => 0.999
    );

    expect(evaluateAnswer(question, question.correctOptionIds).correct).toBe(true);
    expect(evaluateAnswer(question, [question.correctOptionIds[0]]).correct).toBe(false);
  });

  it("normalizes true and false into stable option IDs", () => {
    const trueQuestion = normalizeQuestion(
      buildQuestion("boolean-true", "easy", {
        type: "true-false",
        options: ["True", "False"],
        correct: true,
      }),
      () => 0.999
    );
    const falseQuestion = normalizeQuestion(
      buildQuestion("boolean-false", "easy", {
        type: "true-false",
        options: ["True", "False"],
        correct: false,
      }),
      () => 0.999
    );

    expect(trueQuestion.correctOptionIds).toEqual(["boolean-true-option-1"]);
    expect(falseQuestion.correctOptionIds).toEqual(["boolean-false-option-2"]);
  });

  it("never awards a point when the answer was revealed", () => {
    const question = normalizeQuestion(buildQuestion("revealed", "easy"), () => 0.999);
    expect(evaluateAnswer(question, question.correctOptionIds, true)).toEqual({
      selectedOptionIds: question.correctOptionIds,
      correct: false,
      revealed: true,
    });
  });
});

describe("results", () => {
  it("counts correct answers and returns the agreed score bands", () => {
    const session = createQuizSession(buildPool(), () => 0.999);
    session.answers[0] = {
      selectedOptionIds: [],
      correct: true,
      revealed: false,
    };
    session.answers[1] = {
      selectedOptionIds: [],
      correct: false,
      revealed: true,
    };

    expect(getScore(session)).toBe(1);
    expect(getScoreBand(3)).toBe("Getting started");
    expect(getScoreBand(6)).toBe("Good foundations");
    expect(getScoreBand(8)).toBe("Strong knowledge");
    expect(getScoreBand(10)).toBe("Excellent knowledge");
  });

  it("separates correct, incorrect, and revealed answers", () => {
    const session = createQuizSession(buildPool(), () => 0.999);
    session.answers[0] = {
      selectedOptionIds: [],
      correct: true,
      revealed: false,
    };
    session.answers[1] = {
      selectedOptionIds: [],
      correct: false,
      revealed: false,
    };
    session.answers[2] = {
      selectedOptionIds: [],
      correct: false,
      revealed: true,
    };

    expect(getResultBreakdown(session)).toEqual({
      correct: 1,
      incorrect: 1,
      revealed: 1,
    });
  });

  it("builds tracking-free share copy", () => {
    expect(buildShareText("The 1980s", 7, "https://quiz.melody-mind.de/1980s/")).toBe(
      "I scored 7/10 on The 1980s at MelodyMind Quiz. Try it: https://quiz.melody-mind.de/1980s/"
    );
  });

  it("returns only incorrect and revealed answers for review", () => {
    const session = createQuizSession(buildPool(), () => 0.999);
    const incorrectQuestion = session.questions[0];
    const incorrectOption = incorrectQuestion.options.find(
      (option) => !incorrectQuestion.correctOptionIds.includes(option.id)
    );
    if (!incorrectOption) {
      throw new Error("Test question needs an incorrect option.");
    }

    session.answers[0] = evaluateAnswer(incorrectQuestion, [incorrectOption.id]);
    session.answers[1] = evaluateAnswer(
      session.questions[1],
      session.questions[1].correctOptionIds
    );
    session.answers[2] = evaluateAnswer(session.questions[2], [], true);

    const reviewItems = getReviewItems(session);
    expect(reviewItems).toHaveLength(2);
    expect(reviewItems[0].selectedLabels).toEqual([incorrectOption.label]);
    expect(reviewItems[0].correctLabels).toHaveLength(1);
    expect(reviewItems[1].answer.revealed).toBe(true);
    expect(reviewItems[1].selectedLabels).toEqual([]);
  });

  it("returns no review items for a perfect round", () => {
    const session = createQuizSession(buildPool(), () => 0.999);
    session.answers = session.questions.map((question) =>
      evaluateAnswer(question, question.correctOptionIds)
    );

    expect(getReviewItems(session)).toEqual([]);
  });

  it("selects the next quiz in a category and wraps at the end", () => {
    const category = ["1950s", "1960s", "1970s"];
    expect(getNextQuizId("1950s", category)).toBe("1960s");
    expect(getNextQuizId("1970s", category)).toBe("1950s");
    expect(() => getNextQuizId("1980s", category)).toThrow(
      "Quiz is not part of its category"
    );
  });
});

describe("challenge sharing", () => {
  const fingerprint = "abcdef1234567890";

  it("appends the score and content fingerprint to the shared URL", () => {
    expect(buildShareUrl("https://quiz.melody-mind.de/1980s/", 7, fingerprint)).toBe(
      `https://quiz.melody-mind.de/1980s/#challenge=7.${fingerprint}`
    );
  });

  it("replaces an incoming challenge hash so results never stack", () => {
    expect(
      buildShareUrl(
        `https://quiz.melody-mind.de/1980s/#challenge=9.${fingerprint}`,
        4,
        "fedcba0987654321"
      )
    ).toBe("https://quiz.melody-mind.de/1980s/#challenge=4.fedcba0987654321");
  });

  it("parses a valid challenge hash", () => {
    expect(parseChallengeHash(`#challenge=8.${fingerprint}`)).toEqual({
      score: 8,
      fingerprint,
    });
    expect(parseChallengeHash("#challenge=0.abcdef1234567890")?.score).toBe(0);
    expect(
      parseChallengeHash(`#challenge=${CHALLENGE_MAX_SCORE}.${fingerprint}`)?.score
    ).toBe(CHALLENGE_MAX_SCORE);
  });

  it("rejects malformed, out-of-range, and tampered challenge hashes", () => {
    expect(parseChallengeHash("")).toBeNull();
    expect(parseChallengeHash("#score=8.abcdef1234567890")).toBeNull();
    expect(parseChallengeHash(`#challenge=11.${fingerprint}`)).toBeNull();
    expect(parseChallengeHash("#challenge=8.ABCDEF1234567890")).toBeNull();
    expect(parseChallengeHash("#challenge=8.abc")).toBeNull();
    expect(parseChallengeHash("#challenge=8.abcdef1234567890extra")).toBeNull();
  });
});
