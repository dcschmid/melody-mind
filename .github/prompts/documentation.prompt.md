---
mode: "agent"
tools: ["codebase"]
description: "Creates comprehensive documentation for code areas following MelodyMind standards"
---

# Create Code Documentation

Your goal is to create comprehensive, type-safe documentation for a part of the MelodyMind project
that follows the latest project standards.

## Documentation Process

I'll help you create high-quality documentation for MelodyMind. For this I need:

1. The area to be documented (component, module, function, API)
2. The desired documentation type (JSDoc, Markdown, README, API Reference)
3. Specific requirements or focus areas (accessibility, i18n, etc.)

## Documentation Standards

The documentation will be created according to these standards:

- Documentation must always be written in English, regardless of the application's UI language
- Clear, precise language with consistent terminology
- Structured sections following project conventions (Overview, Usage, API, Examples)
- Type-safe code examples with proper TypeScript typing
- Notes on potential pitfalls and edge cases
- Detailed type information for TypeScript code
- References to related components or modules
- Accessibility considerations (WCAG AAA compliance)
- Internationalization details when applicable
- Breaking changes clearly highlighted with migration notes
- Version information for feature availability

## Documentation Types

### JSDoc for Functions/Classes

```typescript
/**
 * Calculates the player's score based on correct answers and time taken
 *
 * @since 2.8.0
 * @function calculateScore
 * @category Game Logic
 * @description Calculates the final score with base points and time bonuses
 *
 * @param {number} correctAnswers - Number of questions answered correctly
 * @param {number} answerTimeMs - Answer time in milliseconds
 * @param {Difficulty} difficulty - Selected difficulty level
 * @returns {number} The calculated score including any time bonuses
 *
 * @example
 * // Medium difficulty, 8 correct answers in 8 seconds
 * const score = calculateScore(8, 8000, 'medium');
 * // Result: 450 points (400 base points + 50 time bonus)
 *
 * @example
 * // Hard difficulty, 12 correct answers in 16 seconds
 * const score = calculateScore(12, 16000, 'hard');
 * // Result: 600 points (600 base points + 0 time bonus)
 *
 * @throws {TypeError} When parameters have invalid types
 * @see {@link saveScore} For storing the calculated score
 * @see {@link ScoreboardType} For the leaderboard data structure
 *
 * @a11y This function doesn't directly impact accessibility
 */
```

### Markdown for Components

````markdown
# QuestionCard Component

## Overview

The QuestionCard component displays a single trivia question with multiple-choice answers and
handles user interactions during gameplay.

![Question Card Screenshot](../public/docs/question-card.png)

## Properties

| Property        | Type                    | Required | Description                            | Default |
| --------------- | ----------------------- | -------- | -------------------------------------- | ------- |
| question        | Question                | Yes      | The question object to display         | -       |
| onAnswer        | (index: number) => void | Yes      | Callback when user selects an answer   | -       |
| timeRemaining   | number                  | Yes      | Seconds remaining for current question | -       |
| activeJoker     | boolean                 | No       | Whether 50:50 joker is active          | false   |
| disabledOptions | number[]                | No       | Option indexes disabled by joker       | []      |

## Usage

```astro
---
import QuestionCard from "../components/QuestionCard.astro";
import type { Question } from "../types/game";

const currentQuestion: Question = {
  id: "q1",
  text: 'Who released the album "Thriller"?',
  options: ["Madonna", "Michael Jackson", "Prince", "Whitney Houston"],
  correctAnswer: 1,
  difficulty: "medium",
  genre: "pop",
};

const handleAnswer = (index: number) => {
  // Process user answer
};
---

<QuestionCard
  question={currentQuestion}
  onAnswer={handleAnswer}
  timeRemaining={15}
  activeJoker={false}
/>
```

## Accessibility

- Meets WCAG AAA standards for color contrast (7:1 ratio)
- Uses semantic HTML with proper ARIA attributes
- Keyboard navigable with visible focus states
- Screen reader optimized with aria-live for time updates
- Touch-friendly targets (minimum 44×44px)

## Internationalization

The component supports multiple languages through the i18n system:

```typescript
// Text keys used by this component
const i18nKeys = {
  questionPrefix: "game.question.prefix",
  timeRemaining: "game.question.timeRemaining",
  submitAnswer: "game.question.submitAnswer",
};
```

## Implementation Notes

- The component uses Tailwind for responsive design
- Time-based color changes meet accessibility standards
- Joker functionality reduces options while maintaining UI balance

## Related Components

- [Timer](./Timer.md) - Displays countdown timer
- [JokerButton](./JokerButton.md) - Implements the 50:50 feature
- [QuestionExplanation](./QuestionExplanation.md) - Shows answer explanations

## Changelog

- v3.0.0 - Added WCAG AAA compliance, improved keyboard navigation
- v2.5.0 - Added explanation feature for incorrect answers
- v2.0.0 - Redesigned with Tailwind CSS and dark mode support
````

### API Reference Documentation

````markdown
# Game API Endpoints

## Overview

These endpoints manage game sessions, player progress, and scoring for the MelodyMind trivia game.

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Base URL

```
https://api.melodymind.com/v2/game
```

## Endpoints

### Start New Game

Creates a new game session with selected parameters.

**URL**: `/sessions` **Method**: `POST` **Version**: 2.0+

**Request Body**:

```typescript
interface NewGameRequest {
  difficulty: "easy" | "medium" | "hard";
  genre: string;
  language?: string; // ISO 639-1 code, defaults to 'en'
}
```

**Response**: `201 Created`

```typescript
interface GameSession {
  sessionId: string;
  totalQuestions: number;
  jokersAvailable: number;
  expiresAt: string; // ISO date
}
```

**Error Responses**:

- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Missing or invalid authentication
- `429 Too Many Requests` - Rate limit exceeded

**Example Request**:

```bash
curl -X POST https://api.melodymind.com/v2/game/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbG..." \
  -d '{"difficulty": "medium", "genre": "rock", "language": "de"}'
```

**Accessibility Considerations**:

- Response contains properly structured data for screen readers
- Error messages are clear and descriptive

**Rate Limiting**:

- 60 requests per minute per user
- Headers include X-RateLimit-Limit and X-RateLimit-Remaining
````

### Comprehensive Documentation for Types and Interfaces

````markdown
# Game Types and Interfaces

## Overview

This document describes the core data types and interfaces used in the MelodyMind game system.

## Type Definitions

### Game Difficulty

```typescript
/**
 * Represents the available difficulty levels in the game.
 *
 * @since 1.0.0
 */
export type Difficulty = "easy" | "medium" | "hard";

/**
 * Configuration for each difficulty level.
 *
 * @since 2.0.0
 */
export interface DifficultyConfig {
  /** Number of questions presented to the player */
  questionCount: number;
  /** Number of jokers available */
  jokerCount: number;
  /** Time limit in seconds per question */
  timeLimit: number;
  /** Maximum possible score (without time bonuses) */
  maxBaseScore: number;
}

/**
 * Default configuration values for each difficulty.
 *
 * @since 2.0.0
 */
export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    questionCount: 10,
    jokerCount: 3,
    timeLimit: 30,
    maxBaseScore: 500,
  },
  medium: {
    questionCount: 15,
    jokerCount: 5,
    timeLimit: 20,
    maxBaseScore: 750,
  },
  hard: {
    questionCount: 20,
    jokerCount: 10,
    timeLimit: 15,
    maxBaseScore: 1000,
  },
};
```

## Architecture Diagram

Below is a simplified diagram of how these types relate to each other:

```
GameSession
    │
    ├── User
    │    └── Achievements
    │
    ├── Questions
    │    ├── Options
    │    └── Explanations
    │
    └── GameState
         ├── Score
         ├── Timers
         └── UsedJokers
```

## Usage Examples

### Creating a Game Session

```typescript
import { createGameSession } from "../utils/gameSession";
import type { Difficulty } from "../types/game";

// Start a new game with medium difficulty in the rock genre
const difficulty: Difficulty = "medium";
const session = await createGameSession({
  userId: currentUser.id,
  difficulty,
  genre: "rock",
  language: "en",
});

// The session will have the properties defined in GameSession
console.log(`Started game with ${session.totalQuestions} questions`);
console.log(`You have ${session.jokersAvailable} jokers available`);
```

## Breaking Changes

The following breaking changes have been made in recent versions:

### Version 3.0.0

- `GameState` interface now uses ISO date strings instead of timestamps
- `saveScore` function now returns a Promise instead of void

### Version 2.5.0

- `Question` interface requires an `explanation` field
- `Answer` type now includes timestamp for time tracking
````

## Architecture Documentation

For complex systems, include architecture diagrams showing how components interact:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Question Data  │────▶│  Game Engine    │────▶│  UI Components  │
│  (Collections)  │     │  (State Logic)  │     │  (Rendering)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │                 │
                        │  Score System   │
                        │  (Game Results) │
                        │                 │
                        └─────────────────┘
```

I'll adapt the documentation style to your needs and ensure it meets the project standards. My goal
is to create documentation that is comprehensive, maintainable, and provides clear value to
developers working on the MelodyMind project.
