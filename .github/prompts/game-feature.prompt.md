# Generate Game Feature

Your goal is to implement game logic for a specific MelodyMind feature.

## Feature Requirements

If not specified, ask for:

- Feature name and purpose
- How it relates to existing game mechanics
- Any UI components it interacts with
- Required data models or state

## Technical Requirements

- Use TypeScript with proper type definitions
- Implement as utility functions in dedicated files
- Follow functional programming principles
- Add comprehensive JSDoc comments
- Include unit tests
- Handle edge cases and errors gracefully

## Game Mechanics to Consider

- Difficulty levels: Easy (10 questions), Medium (15), Hard (20)
- Scoring: 50 points per correct answer
- Speed bonuses: +50 points (<10s), +25 points (<15s)
- Joker usage: 3/5/10 uses based on difficulty
- Results tracking and achievements

## Example Implementation

For a "Score Calculator" feature:

```typescript
/**
 * Calculates the score for a given answer
 * @param isCorrect Whether the answer is correct
 * @param timeElapsed Time taken to answer in seconds
 * @returns The score for this answer including any speed bonuses
 */
export function calculateAnswerScore(
  isCorrect: boolean,
  timeElapsed: number,
): number {
  if (!isCorrect) return 0;

  // Base score for correct answer
  let score = 50;

  // Add speed bonus
  if (timeElapsed < 10) {
    score += 50; // Fast answer bonus
  } else if (timeElapsed < 15) {
    score += 25; // Quick answer bonus
  }

  return score;
}

/**
 * Calculates the total possible score for a given difficulty
 * @param difficulty The game difficulty level
 * @returns The maximum possible score without speed bonuses
 */
export function getMaxBaseScore(
  difficulty: "easy" | "medium" | "hard",
): number {
  const questionCounts = {
    easy: 10,
    medium: 15,
    hard: 20,
  };

  return questionCounts[difficulty] * 50;
}

/**
 * Determines if the player has earned a special achievement
 * @param score The player's final score
 * @param maxPossibleScore The maximum possible score for the difficulty
 * @param correctAnswers Number of correct answers
 * @param totalQuestions Total number of questions
 * @returns Achievement name or null if none earned
 */
export function checkForAchievement(
  score: number,
  maxPossibleScore: number,
  correctAnswers: number,
  totalQuestions: number,
): string | null {
  if (correctAnswers === totalQuestions) {
    if (score >= maxPossibleScore * 1.5) {
      return "Musik-Legend"; // Perfect score with maximum speed bonuses
    } else if (score >= maxPossibleScore * 1.25) {
      return "Musik-Master"; // Perfect score with good speed
    } else {
      return "Musik-Novice"; // Perfect score
    }
  }

  return null;
}
```
