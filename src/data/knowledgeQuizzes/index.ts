import type { QuizQuestion } from "../knowledgeQuizTypes";
import { quiz1950s } from "./1950s";
import { quiz1960s } from "./1960s";
import { quiz1970s } from "./1970s";
import { quiz1980s } from "./1980s";
import { quiz1990s } from "./1990s";
import { quiz2000s } from "./2000s";

export const quizDecades = [
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
] as const;

export const quizzes: Record<string, QuizQuestion[]> = {
  "1950s": quiz1950s,
  "1960s": quiz1960s,
  "1970s": quiz1970s,
  "1980s": quiz1980s,
  "1990s": quiz1990s,
  "2000s": quiz2000s,
};

export type QuizDecade = (typeof quizDecades)[number];
