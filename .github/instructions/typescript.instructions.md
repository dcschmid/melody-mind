---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---

# TypeScript & JavaScript Coding Standards

These instructions apply to all TypeScript and JavaScript files in the MelodyMind project.

## General Guidelines

- Use TypeScript for all new files
- Leverage ES6+ features and idiomatic patterns
- Add comprehensive JSDoc comments to all functions and components
- Use descriptive and meaningful variable and function names
- Implement proper error handling with contextual information
- Follow consistent code formatting with Prettier
- Use strict TypeScript compiler options

**Example:**

```typescript
/**
 * Calculates the player's score based on correct answers and time taken
 * @param {number} correctAnswers - Number of questions answered correctly
 * @param {number} timeInSeconds - Time taken to answer in seconds
 * @param {Difficulty} difficulty - Selected difficulty level
 * @returns {number} The calculated score with time bonus
 */
export const calculateScore = (
  correctAnswers: number,
  timeInSeconds: number,
  difficulty: Difficulty
): number => {
  const baseScore = correctAnswers * 50;
  const timeBonus = timeInSeconds < 10 ? 50 : timeInSeconds < 15 ? 25 : 0;

  return baseScore + timeBonus;
};
```

## Type Safety

- Avoid the `any` type unless absolutely necessary
- Define interfaces and types for all data structures
- Use generic types where they improve type safety and reusability
- Prefer readonly types and immutability for better predictability
- Use union and intersection types for precise type definitions
- Enable strict null checks and ensure proper null handling
- Use type guards for runtime type checking

**Example:**

```typescript
// Define precise types for game difficulty
type Difficulty = "easy" | "medium" | "hard";

// Use readonly properties for immutable data
interface Question {
  readonly id: string;
  readonly text: string;
  readonly options: readonly string[];
  readonly correctAnswer: number;
  readonly difficulty: Difficulty;
  readonly genre: string;
  readonly explanation?: string;
}

// Type guard example
function isValidQuestion(obj: unknown): obj is Question {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "text" in obj &&
    "options" in obj &&
    "correctAnswer" in obj
  );
}
```

## Functional Paradigm

- Write pure functions without side effects when possible
- Use array methods like map, filter, reduce instead of loops
- Leverage optional chaining (?.) and nullish coalescing operator (??)
- Use destructuring for cleaner object and array handling
- Prefer arrow functions for consistent `this` context
- Use the spread operator for immutable data manipulation
- Implement function composition for complex operations

**Example:**

```typescript
// Using array methods and destructuring
const getTopScores = (scores: UserScore[], limit = 10): UserScore[] => {
  return [...scores].sort((a, b) => b.score - a.score).slice(0, limit);
};

// Using optional chaining and nullish coalescing
const getUserName = (user?: User): string => {
  return user?.displayName ?? user?.username ?? "Anonymous Player";
};

// Immutable data manipulation with spread operator
const addAchievement = (userScore: UserScore, achievement: string): UserScore => {
  return {
    ...userScore,
    achievements: [...userScore.achievements, achievement],
  };
};
```

## Error Handling

- Use try/catch blocks for error-prone operations
- Implement async/await with proper error handling
- Provide detailed error messages with contextual information
- Create custom error types for better error tracking and debugging
- Use Error subclasses for different error categories
- Implement global error handling for uncaught exceptions
- Add proper error recovery mechanisms

**Example:**

```typescript
// Custom error class
class GameApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly endpoint?: string
  ) {
    super(message);
    this.name = "GameApiError";
  }
}

// Async function with proper error handling
async function fetchQuestions(genre: string, difficulty: Difficulty): Promise<Question[]> {
  try {
    const endpoint = `/api/questions?genre=${encodeURIComponent(genre)}&difficulty=${difficulty}`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new GameApiError(
        `Failed to fetch questions: ${response.statusText}`,
        response.status,
        endpoint
      );
    }

    const data = await response.json();
    return data as Question[];
  } catch (error) {
    console.error("Error fetching questions:", error);
    // Re-throw as a custom error with context
    if (error instanceof GameApiError) {
      throw error;
    }
    throw new GameApiError(
      error instanceof Error ? error.message : "Unknown error occurred",
      undefined,
      `questions/${genre}/${difficulty}`
    );
  }
}
```

## Performance

- Avoid unnecessary re-renders and calculations
- Implement memoization for expensive computations
- Prevent excessive DOM manipulation and rendering
- Use efficient data structures for specific use cases
- Implement lazy loading for components and assets
- Optimize async operations with Promise.all for parallel requests
- Use web workers for CPU-intensive tasks

**Example:**

```typescript
import { memoize } from "lodash-es";

// Memoize expensive calculation
export const calculateLeaderboardRanking = memoize((scores: UserScore[]): RankedScore[] => {
  // Complex ranking algorithm...
  return scores
    .sort((a, b) => b.score - a.score)
    .map((score, index) => ({
      ...score,
      rank: index + 1,
    }));
});

// Optimize multiple async requests
export async function loadGameAssets(genre: string): Promise<GameAssets> {
  try {
    const [questions, soundEffects, backgroundMusic] = await Promise.all([
      fetchQuestions(genre, currentDifficulty),
      loadSoundEffects(),
      loadBackgroundMusic(genre),
    ]);

    return { questions, soundEffects, backgroundMusic };
  } catch (error) {
    console.error("Failed to load game assets:", error);
    throw error;
  }
}
```

## Module Organization

- Use ES modules with named exports for better tree-shaking
- Group related functionality in feature modules
- Avoid circular dependencies between modules
- Use barrel files (index.ts) to simplify imports
- Keep modules focused on a single responsibility
- Use dynamic imports for code splitting

**Example:**

```typescript
// Feature module structure (game/index.ts)
export * from './types';
export * from './constants';
export * from './utils';
export * from './hooks';
export * from './components';

// Using dynamic imports for code splitting
const GamePage = () => {
  const [DifficultySelector, setDifficultySelector] = useState<ComponentType | null>(null);

  useEffect(() => {
    // Dynamically load component when needed
    import('../components/DifficultySelector').then(
      module => setDifficultySelector(() => module.default)
    );
  }, []);

  return (
    <div className="game-page">
      {DifficultySelector && <DifficultySelector />}
    </div>
  );
};
```
