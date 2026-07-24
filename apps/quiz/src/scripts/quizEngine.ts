import type {
  QuizAnswer,
  QuizQuestion,
  QuizSession,
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
