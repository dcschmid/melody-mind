import type {
  QuizAnswer,
  QuizQuestion,
  QuizResultBreakdown,
  QuizReviewItem,
  QuizSession,
  QuizSessionSnapshot,
  RuntimeQuestion,
} from "@quiz-types/quiz";

export type RandomSource = () => number;

export const SESSION_DIFFICULTY_QUOTAS = {
  easy: 4,
  medium: 4,
  hard: 2,
} as const;

export function secureRandom(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] / 0x1_0000_0000;
  }

  return Math.random();
}

export function shuffle<T>(items: readonly T[], random: RandomSource): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }

  return result;
}

function getCorrectIndexes(question: QuizQuestion): number[] {
  if (typeof question.correct === "boolean") {
    return [question.correct === true ? 0 : 1];
  }

  return Array.isArray(question.correct) ? question.correct : [question.correct];
}

export function normalizeQuestion(
  question: QuizQuestion,
  random: RandomSource
): RuntimeQuestion {
  const labels =
    question.type === "true-false" && question.options.length !== 2
      ? ["True", "False"]
      : question.options;
  const correctIndexes = getCorrectIndexes(question);
  const options = labels.map((label, index) => ({
    id: `${question.id}-option-${index + 1}`,
    label,
    correct: correctIndexes.includes(index),
  }));
  const shuffledOptions = shuffle(options, random);

  return {
    id: question.id,
    question: question.question,
    type: question.type,
    difficulty: question.difficulty,
    options: shuffledOptions.map(({ id, label }) => ({ id, label })),
    correctOptionIds: shuffledOptions
      .filter((option) => option.correct)
      .map((option) => option.id),
    explanation: question.explanation,
    context: question.context,
    sources: question.sources,
  };
}

export function createQuizSession(
  questions: QuizQuestion[],
  random: RandomSource = secureRandom
): QuizSession {
  const selected = Object.entries(SESSION_DIFFICULTY_QUOTAS).flatMap(
    ([difficulty, count]) => {
      const candidates = questions.filter(
        (question) => question.difficulty === difficulty
      );

      if (candidates.length < count) {
        throw new Error(`Not enough ${difficulty} questions to start this quiz.`);
      }

      return shuffle(candidates, random).slice(0, count);
    }
  );
  const runtimeQuestions = shuffle(selected, random).map((question) =>
    normalizeQuestion(question, random)
  );

  return {
    currentIndex: 0,
    questions: runtimeQuestions,
    answers: runtimeQuestions.map(() => null),
    complete: false,
  };
}

export function createQuizSessionSnapshot(
  session: QuizSession,
  selectedOptionIds: Iterable<string>
): QuizSessionSnapshot {
  return {
    currentIndex: session.currentIndex,
    questions: session.questions.map((question) => ({
      id: question.id,
      optionIds: question.options.map((option) => option.id),
    })),
    answers: session.answers,
    selectedOptionIds: Array.from(selectedOptionIds),
  };
}

export function restoreQuizSession(
  questions: QuizQuestion[],
  snapshot: QuizSessionSnapshot
): QuizSession {
  if (
    !Number.isInteger(snapshot.currentIndex) ||
    snapshot.currentIndex < 0 ||
    snapshot.currentIndex >= snapshot.questions.length ||
    snapshot.questions.length !== snapshot.answers.length
  ) {
    throw new Error("Saved quiz progress is invalid.");
  }

  const questionById = new Map(questions.map((question) => [question.id, question]));
  const runtimeQuestions = snapshot.questions.map((storedQuestion) => {
    const sourceQuestion = questionById.get(storedQuestion.id);
    if (!sourceQuestion) {
      throw new Error(`Saved question is no longer available: ${storedQuestion.id}`);
    }

    const normalized = normalizeQuestion(sourceQuestion, () => 0.999_999);
    const optionById = new Map(normalized.options.map((option) => [option.id, option]));
    const options = storedQuestion.optionIds.map((optionId) => {
      const option = optionById.get(optionId);
      if (!option) {
        throw new Error(`Saved answer option is no longer available: ${optionId}`);
      }
      return option;
    });

    if (
      options.length !== normalized.options.length ||
      new Set(storedQuestion.optionIds).size !== normalized.options.length
    ) {
      throw new Error(`Saved answer options are invalid: ${storedQuestion.id}`);
    }

    return {
      ...normalized,
      options,
    };
  });
  const answersAreValid = snapshot.answers.every((answer, questionIndex) => {
    const availableOptionIds = new Set(
      runtimeQuestions[questionIndex].options.map((option) => option.id)
    );
    return (
      answer === null ||
      answer.selectedOptionIds.every((optionId) => availableOptionIds.has(optionId))
    );
  });
  const selectionIsValid = snapshot.selectedOptionIds.every((optionId) =>
    runtimeQuestions[snapshot.currentIndex].options.some(
      (option) => option.id === optionId
    )
  );
  const restoredAnswers = snapshot.answers.map((answer, questionIndex) =>
    answer
      ? evaluateAnswer(
          runtimeQuestions[questionIndex],
          answer.selectedOptionIds,
          answer.revealed
        )
      : null
  );

  if (
    runtimeQuestions.length !== snapshot.answers.length ||
    new Set(runtimeQuestions.map((question) => question.id)).size !==
      runtimeQuestions.length ||
    !answersAreValid ||
    !selectionIsValid
  ) {
    throw new Error("Saved quiz progress is invalid.");
  }

  return {
    currentIndex: snapshot.currentIndex,
    questions: runtimeQuestions,
    answers: restoredAnswers,
    complete: false,
  };
}

export function evaluateAnswer(
  question: RuntimeQuestion,
  selectedOptionIds: string[],
  revealed = false
): QuizAnswer {
  const selected = [...selectedOptionIds].sort();
  const correct = [...question.correctOptionIds].sort();

  return {
    selectedOptionIds,
    correct:
      !revealed &&
      selected.length === correct.length &&
      selected.every((id, index) => id === correct[index]),
    revealed,
  };
}

export function getScore(session: QuizSession): number {
  return session.answers.filter((answer) => answer?.correct).length;
}

export function getResultBreakdown(session: QuizSession): QuizResultBreakdown {
  return session.answers.reduce<QuizResultBreakdown>(
    (result, answer) => {
      if (answer?.correct) {
        result.correct += 1;
      } else if (answer?.revealed) {
        result.revealed += 1;
      } else if (answer) {
        result.incorrect += 1;
      }
      return result;
    },
    { correct: 0, incorrect: 0, revealed: 0 }
  );
}

export function getReviewItems(session: QuizSession): QuizReviewItem[] {
  return session.questions.flatMap((question, index) => {
    const answer = session.answers[index];
    if (!answer || answer.correct) {
      return [];
    }

    const optionById = new Map(
      question.options.map((option) => [option.id, option.label])
    );
    return [
      {
        question,
        answer,
        selectedLabels: answer.selectedOptionIds.flatMap((id) => {
          const label = optionById.get(id);
          return label ? [label] : [];
        }),
        correctLabels: question.correctOptionIds.flatMap((id) => {
          const label = optionById.get(id);
          return label ? [label] : [];
        }),
      },
    ];
  });
}

export function getNextQuizId(currentId: string, categoryIds: readonly string[]): string {
  if (categoryIds.length === 0) {
    throw new Error("A quiz category needs at least one quiz.");
  }

  const currentIndex = categoryIds.indexOf(currentId);
  if (currentIndex === -1) {
    throw new Error(`Quiz is not part of its category: ${currentId}`);
  }

  return categoryIds[(currentIndex + 1) % categoryIds.length];
}

export function getScoreBand(score: number): string {
  if (score <= 3) {
    return "Getting started";
  }
  if (score <= 6) {
    return "Good foundations";
  }
  if (score <= 8) {
    return "Strong knowledge";
  }
  return "Excellent knowledge";
}

export function buildShareText(title: string, score: number, url: string): string {
  return `I scored ${score}/10 on ${title} at MelodyMind Quiz. Try it: ${url}`;
}

export interface QuizChallenge {
  score: number;
  fingerprint: string;
}

export const CHALLENGE_MAX_SCORE = 10;

const CHALLENGE_HASH_PATTERN = /^#challenge=(\d{1,2})\.([a-f0-9]{16})$/u;

export function buildShareUrl(
  baseUrl: string,
  score: number,
  fingerprint: string
): string {
  const url = baseUrl.split("#")[0];
  return `${url}#challenge=${score}.${fingerprint}`;
}

export function parseChallengeHash(hash: string): QuizChallenge | null {
  const match = CHALLENGE_HASH_PATTERN.exec(hash);
  if (!match) {
    return null;
  }

  const score = Number(match[1]);
  if (!Number.isInteger(score) || score < 0 || score > CHALLENGE_MAX_SCORE) {
    return null;
  }

  return { score, fingerprint: match[2] };
}
