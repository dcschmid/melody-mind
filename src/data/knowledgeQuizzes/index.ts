import type { QuizQuestion } from "../knowledgeQuizTypes";
import { quiz1950s } from "./1950s";
import { quiz1960s } from "./1960s";
import { quiz1970s } from "./1970s";

export const quizDecades = ["1950s", "1960s", "1970s"] as const;

export const quizzes: Record<string, QuizQuestion[]> = {
  "1950s": quiz1950s,
  "1960s": quiz1960s,
  "1970s": quiz1970s,
};

export type QuizDecade = (typeof quizDecades)[number];
