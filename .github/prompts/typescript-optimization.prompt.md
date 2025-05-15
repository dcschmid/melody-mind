# TypeScript Optimization and Performance for MelodyMind

This prompt is dedicated to optimizing TypeScript code according to the latest standards (TypeScript
5.8+) with special focus on performance, modern TypeScript features, and high-quality code
documentation.

## Overview

The optimization of the MelodyMind project encompasses the following main areas:

- Utilizing modern TypeScript features for better type safety
- Performance optimization according to current best practices
- Improved documentation with JSDoc
- Reducing bundle size
- Code quality and maintainability

## Modern TypeScript Features

### 1. Improved Type Definitions

**Before:**

```typescript
interface UserData {
  name: string;
  score: number;
  achievements: string[];
  preferences?: {
    difficulty: string;
    theme: string;
  };
}
```

**After (with Template Literal Types, Branded Types, and More Precise Definitions):**

```typescript
type DifficultyLevel = "easy" | "medium" | "hard";
type ThemeOption = "light" | "dark" | "system";

// Branded type for better type differentiation
type UserId = string & { readonly __brand: unique symbol };

interface UserPreferences {
  difficulty: DifficultyLevel;
  theme: ThemeOption;
}

interface UserData {
  id: UserId;
  name: string;
  score: number;
  achievements: Array<AchievementId>; // More specific than string[]
  preferences: UserPreferences | null; // Null instead of undefined for better control flow analysis
  lastActive: Date;
}
```

### 2. Modern Utility Types

Use the latest TypeScript utility types for more precise typing:

```typescript
// Partial with certain required fields
type PartialWithRequired<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Example for an update operation
type UserUpdate = PartialWithRequired<UserData, "id">;

// Record with specific value types based on keys
type CategoryScores = Record<GameCategory, number>;

// Template Literal Types for string enums
type AchievementCategory = `achievement:${string}`;
type ErrorCode = `ERR-${number}`;

// Conditional Types for more flexible type definitions
type ExtractScoreType<T> = T extends { score: infer S } ? S : never;
```

### 3. Modern Class Features

```typescript
// Private class fields
class ScoreManager {
  #privateData: Map<UserId, UserScore> = new Map();

  // Parameter Properties for shorter constructors
  constructor(
    private readonly gameId: string,
    private readonly difficultyLevel: DifficultyLevel
  ) {}

  // Getters/setters with type checking
  get topScore(): number {
    return Math.max(...Array.from(this.#privateData.values()).map((u) => u.score));
  }

  // Methods with signature overloads
  addScore(userId: UserId, score: number): void;
  addScore(user: UserData, score: number): void;
  addScore(userOrId: UserData | UserId, score: number): void {
    // Implementation
  }
}
```

## Performance Optimizations

### 1. Efficient Data Structures

```typescript
// Before: Inefficient search in array
const findUser = (users: UserData[], id: string): UserData | undefined => {
  return users.find((user) => user.id === id);
};

// After: More efficient Map structure
const createUserMap = (users: UserData[]): Map<UserId, UserData> => {
  return new Map(users.map((user) => [user.id, user]));
};

// Lookup in O(1) instead of O(n)
const getUserById = (userMap: Map<UserId, UserData>, id: UserId): UserData | undefined => {
  return userMap.get(id);
};
```

### 2. Memoization for Complex Calculations

```typescript
/**
 * Memoized function for calculating game results
 * Stores results for identical inputs
 */
const calculateFinalScore = memoize(
  (correctAnswers: number, timeBonus: number, difficultyMultiplier: number): number => {
    // Complex calculation
    return correctAnswers * 50 + timeBonus * difficultyMultiplier;
  }
);

/**
 * Generic memoization helper function
 */
function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result
): (...args: Args) => Result {
  const cache = new Map<string, Result>();

  return (...args: Args): Result => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

### 3. Lazy Loading and Code Splitting

```typescript
// Dynamic import for code splitting
const loadGameModule = async (category: string): Promise<GameModule> => {
  switch (category) {
    case "rock":
      return import("./modules/rock-module");
    case "pop":
      return import("./modules/pop-module");
    case "jazz":
      return import("./modules/jazz-module");
    default:
      return import("./modules/default-module");
  }
};
```

### 4. Event Delegation and Removal of Event Listeners

```typescript
/**
 * Event delegation for better performance with many elements
 */
class EventManager {
  private eventHandlers: Map<string, Function> = new Map();

  /**
   * Adds a delegated event listener
   */
  addDelegatedListener(
    parentElement: HTMLElement,
    eventType: string,
    childSelector: string,
    handler: (event: Event, delegateTarget: HTMLElement) => void
  ): void {
    const wrappedHandler = (event: Event): void => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const delegateTarget = target.closest(childSelector) as HTMLElement;
      if (delegateTarget && parentElement.contains(delegateTarget)) {
        handler(event, delegateTarget);
      }
    };

    this.eventHandlers.set(`${parentElement.id}-${eventType}`, wrappedHandler);
    parentElement.addEventListener(eventType, wrappedHandler);
  }

  /**
   * Removes all event listeners for clean cleanup
   */
  cleanup(): void {
    this.eventHandlers.forEach((handler, key) => {
      const [elementId, eventType] = key.split("-");
      const element = document.getElementById(elementId);
      if (element) {
        element.removeEventListener(eventType, handler as EventListener);
      }
    });
    this.eventHandlers.clear();
  }
}
```

## Optimized Documentation Following the Latest JSDoc Standard

All public functions and classes should be comprehensively documented:

```typescript
/**
 * Calculates the total score of a player based on correct answers and time bonuses.
 * Applies different multipliers depending on the difficulty level.
 *
 * @since 3.0.0
 * @category Scoring
 *
 * @param {Object} options - The input parameters for score calculation
 * @param {number} options.correctAnswers - Number of correctly answered questions
 * @param {number} options.timeInSeconds - Total time in seconds
 * @param {DifficultyLevel} options.difficulty - Selected difficulty level
 * @param {boolean} [options.bonusEnabled=true] - Whether time bonuses are enabled
 *
 * @returns {ScoreResult} The calculation result with total score and breakdown
 *
 * @throws {InvalidDifficultyError} When an invalid difficulty level is passed
 *
 * @example
 * // Calculate score for a player with medium difficulty
 * const result = calculateScore({
 *   correctAnswers: 8,
 *   timeInSeconds: 45,
 *   difficulty: 'medium',
 * });
 * console.log(`Total score: ${result.total}`);
 */
function calculateScore({
  correctAnswers,
  timeInSeconds,
  difficulty,
  bonusEnabled = true,
}: ScoreCalculationOptions): ScoreResult {
  // Implementation
}

/**
 * Options for score calculation
 */
interface ScoreCalculationOptions {
  /** Number of correctly answered questions */
  correctAnswers: number;
  /** Total time in seconds */
  timeInSeconds: number;
  /** Selected difficulty level */
  difficulty: DifficultyLevel;
  /** Whether time bonuses are enabled (default: true) */
  bonusEnabled?: boolean;
}

/**
 * Result of score calculation
 */
interface ScoreResult {
  /** Total score */
  total: number;
  /** Base points for correct answers */
  basePoints: number;
  /** Additional points for fast answers */
  timeBonus: number;
  /** Applied difficulty multiplier */
  multiplier: number;
}
```

## i18n and TypeScript Integration

```typescript
/**
 * Type-safe translation function with Template Literal Types
 * @category Internationalization
 */
type TranslationKeys =
  | "game.difficulty.easy"
  | "game.difficulty.medium"
  | "game.difficulty.hard"
  | "game.score.result"
  | "achievements.badge.new"
  | "achievements.badge.count"
  | `category.${string}`; // Dynamic part for category names

/**
 * Type-safe translation parameters based on the translation key
 */
type TranslationParams<K extends TranslationKeys> = K extends "game.score.result"
  ? { points: number; total: number }
  : K extends "achievements.badge.count"
    ? { count: number }
    : Record<string, never>;

/**
 * Type-safe translation function
 *
 * @param key - The translation key
 * @param params - Parameters for the translation (only required if the key needs parameters)
 * @returns The translated string
 *
 * @example
 * // Simple translation without parameters
 * const easyText = translate('game.difficulty.easy');
 *
 * // Translation with parameters
 * const scoreText = translate('game.score.result', { points: 450, total: 500 });
 */
function translate<K extends TranslationKeys>(key: K, params?: TranslationParams<K>): string {
  // Implementation of the translation function
  return "Translated text";
}
```

## Bundle Size Optimization

### 1. Tree-Shaking Support

```typescript
// Before: Non-tree-shakeable exports
export default {
  calculateScore,
  formatTime,
  checkAnswer,
  loadQuestions,
};

// After: Tree-shakeable exports
export { calculateScore, formatTime, checkAnswer, loadQuestions };
```

### 2. Dynamic Imports for Advanced Code Splitting

```typescript
/**
 * Loads the appropriate sound manager based on user settings.
 * Reduces initial bundle size through dynamic import.
 *
 * @param type - The sound manager type to load
 * @returns A Promise with the sound manager instance
 */
async function loadSoundManager(type: "basic" | "advanced"): Promise<SoundManager> {
  if (type === "advanced") {
    const { AdvancedSoundManager } = await import("./sound/advanced-manager");
    return new AdvancedSoundManager();
  } else {
    const { BasicSoundManager } = await import("./sound/basic-manager");
    return new BasicSoundManager();
  }
}
```

## Modern Error Handling Strategies

```typescript
/**
 * Specialized error classes for better error handling
 */
class GameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameError";
  }
}

class QuestionLoadError extends GameError {
  constructor(
    message: string,
    public readonly category: string,
    public readonly statusCode?: number
  ) {
    super(`Error loading questions for category ${category}: ${message}`);
    this.name = "QuestionLoadError";
  }
}

/**
 * Type guard for error types
 */
function isQuestionLoadError(error: unknown): error is QuestionLoadError {
  return error instanceof QuestionLoadError;
}

/**
 * Type-safe error handling
 */
async function loadQuestionsWithErrorHandling(category: string): Promise<Question[]> {
  try {
    return await fetchQuestions(category);
  } catch (error: unknown) {
    if (isQuestionLoadError(error)) {
      // Handle typed error
      console.error(`Error loading (status ${error.statusCode}): ${error.message}`);
    } else if (error instanceof Error) {
      // Handle generic error
      console.error(`Unexpected error: ${error.message}`);
    } else {
      // Handle unknown error type
      console.error("An unknown error has occurred");
    }
    // Return empty fallback questions
    return [];
  }
}
```

## Accessibility with TypeScript

```typescript
/**
 * Type-safe ARIA attributes for better accessibility
 */
type AriaRole =
  | "button"
  | "checkbox"
  | "menuitem"
  | "menuitemcheckbox"
  | "menuitemradio"
  | "option"
  | "radio"
  | "switch"
  | "tab"
  | "treeitem";

type AriaLiveValues = "off" | "polite" | "assertive";

interface AccessibilityProps {
  /** The ARIA role of the element */
  role?: AriaRole;
  /** Whether the element is currently selected */
  "aria-selected"?: boolean;
  /** Whether the element is currently checked */
  "aria-checked"?: boolean | "mixed";
  /** Whether the element is currently disabled */
  "aria-disabled"?: boolean;
  /** The ID of the element that describes this element */
  "aria-describedby"?: string;
  /** The ID of the element that serves as a label for this element */
  "aria-labelledby"?: string;
  /** A label for the element */
  "aria-label"?: string;
  /** The value for live regions */
  "aria-live"?: AriaLiveValues;
  /** Whether changes to the element should be announced */
  "aria-atomic"?: boolean;
}

/**
 * Creates an accessible quiz element with correct ARIA attributes
 * @param props - The properties for the quiz element
 * @returns An accessible quiz element
 */
function createAccessibleQuizOption(props: {
  text: string;
  isSelected: boolean;
  isCorrect?: boolean;
  onSelect: () => void;
  index: number;
}): HTMLElement {
  const { text, isSelected, onSelect, index } = props;

  const element = document.createElement("button");
  element.className = "quiz-option";
  element.textContent = text;

  // Type-checked ARIA attributes
  const accessibilityProps: AccessibilityProps = {
    role: "radio",
    "aria-checked": isSelected,
    "aria-labelledby": `option-label-${index}`,
    "aria-describedby": `option-desc-${index}`,
  };

  // Add ARIA attributes
  Object.entries(accessibilityProps).forEach(([key, value]) => {
    if (value !== undefined) {
      element.setAttribute(key, String(value));
    }
  });

  element.addEventListener("click", onSelect);

  return element;
}
```

## Tooling and Configuration

### 1. tsconfig.json Optimization

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true
  }
}
```

### 2. TypeScript + ESLint Integration

```js
// eslint.config.js
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // Performance rules
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/prefer-for-of": "error",

      // Promote newer TypeScript features
      "@typescript-eslint/prefer-ts-expect-error": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/consistent-type-exports": [
        "error",
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],

      // Documentation rules
      "jsdoc/require-jsdoc": "warn",
      "jsdoc/require-description": "warn",
      "jsdoc/require-param-type": "warn",
      "jsdoc/require-returns-type": "warn",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "error",
    },
  },
];
```

## Code Optimization Checklist

When reviewing and optimizing TypeScript code, the following points should be considered:

1. **Type Safety:**

   - Avoid `any` and `as` type casts
   - Use union types instead of optional parameters where appropriate
   - Use template literal types for string validation
   - Use branded/nominal types for better type differentiation

2. **Performance:**

   - Efficient data structures (Maps, Sets) for frequent operations
   - Avoid unnecessary array copies and iterations
   - Memoization for computationally intensive functions
   - Event delegation instead of many individual event listeners
   - Proper cleanup of event listeners and resources

3. **Bundle Size:**

   - Individual named exports instead of default exports
   - Code splitting with dynamic imports
   - Lazy loading of non-critical components
   - Tree-shakeable module design

4. **Documentation:**

   - JSDoc comments for all public APIs
   - Type definitions in both comments and as TypeScript types
   - Examples for complex functions
   - Clear description of parameters, return values, and error cases
   - Mark breaking changes, deprecations, and version info

5. **Accessibility:**

   - Type-safe ARIA attributes
   - Correct semantic elements
   - Keyboard navigation and focus management
   - Screen reader announcements for dynamic content

6. **i18n Integration:**
   - No hardcoded strings
   - Type-safe translation functions
   - Consistent naming conventions for translation keys
   - Proper handling of parameters in translations

## Refactoring Checklist

- [ ] Replace all JavaScript files with TypeScript
- [ ] Remove all `any` and implicit `any` types
- [ ] Update JSDoc comments to current standard
- [ ] Check for array methods with high performance costs
- [ ] Implement lazy loading for non-critical modules
- [ ] Check event listeners for memory leaks
- [ ] Implement type-safe translation functions
- [ ] Update error handling strategies
- [ ] Optimize computationally intensive functions with memoization
- [ ] Check accessibility with TypeScript type support
