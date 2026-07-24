export const QUESTION_DIFFICULTIES = ["easy", "medium", "hard"] as const;
export const QUESTION_TYPES = ["single-choice", "multi-choice", "true-false"] as const;

export type QuestionDifficulty = (typeof QUESTION_DIFFICULTIES)[number];
export type QuestionType = (typeof QUESTION_TYPES)[number];

export interface QuizSource {
  publisher: string;
  title: string;
  url: string;
  checkedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  options: string[];
  correct: number | number[] | boolean;
  explanation: string;
  sources: QuizSource[];
}

export interface RuntimeOption {
  id: string;
  label: string;
}

export interface RuntimeQuestion {
  id: string;
  question: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  options: RuntimeOption[];
  correctOptionIds: string[];
  explanation: string;
  sources: QuizSource[];
}

export interface QuizAnswer {
  selectedOptionIds: string[];
  correct: boolean;
  revealed: boolean;
}

export interface QuizSession {
  currentIndex: number;
  questions: RuntimeQuestion[];
  answers: Array<QuizAnswer | null>;
  complete: boolean;
}
