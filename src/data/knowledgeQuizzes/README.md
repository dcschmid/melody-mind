# Knowledge quizzes

## Add a new decade

1. Create a new file named like `1980s.ts` in this folder.
2. Export a `QuizQuestion[]` using the `quiz1980s` naming pattern.
3. Add the import and entry in `index.ts`.

Example template:

```ts
import type { QuizQuestion } from "../knowledgeQuizTypes";

export const quiz1980s: QuizQuestion[] = [
  {
    question: "Example question?",
    options: ["A", "B", "C", "D"],
    correct: 0,
    explanation: "Example explanation.",
    difficulty: "easy",
  },
];
```
