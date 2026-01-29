import type { QuizQuestion } from "./knowledgeQuizTypes";
import { quizzes } from "./knowledgeQuizzesData";
export { quizDecades, type QuizDecade } from "./knowledgeQuizzes/index";

export type { QuizQuestion };

export const getKnowledgeQuiz = (slug: string): QuizQuestion[] =>
  quizzes[slug] ? quizzes[slug] : [];
