---
applyTo: "**/*.test.{ts,js}"
---

# Testing Standards for MelodyMind

These instructions apply to all test files in the MelodyMind project. They incorporate modern
testing best practices and ensure a comprehensive testing strategy across all components of the
application.

## Testing Philosophy

- Write tests that validate behavior, not implementation details
- Each test should have a single responsibility and clear purpose
- Make tests resilient to implementation changes
- Tests should serve as living documentation for the codebase
- Follow the AAA pattern: Arrange-Act-Assert
- Use descriptive test names that explain the expected behavior

## Testing Framework and Tools

- Use **Vitest** as the primary test runner for unit and component tests
- Use **Playwright** for end-to-end and integration tests
- Use **@testing-library** packages for component testing
- Use **axe-core** or similar tools for accessibility validation
- Configure **Vitest** to run tests in isolation to prevent state leakage

## Unit Tests

```typescript
// Example unit test for game utility functions
import { describe, it, expect } from "vitest";
import { calculateScore } from "../utils/scoreCalculator";

describe("calculateScore", () => {
  it("awards 50 points for correct answers", () => {
    const result = calculateScore({
      isCorrect: true,
      timeElapsed: 20,
      difficulty: "medium",
    });
    expect(result).toBe(50);
  });

  it("adds 50 point speed bonus for answers under 10 seconds", () => {
    const result = calculateScore({
      isCorrect: true,
      timeElapsed: 8,
      difficulty: "medium",
    });
    expect(result).toBe(100); // 50 base + 50 speed bonus
  });

  it("adds 25 point speed bonus for answers between 10-15 seconds", () => {
    const result = calculateScore({
      isCorrect: true,
      timeElapsed: 12,
      difficulty: "medium",
    });
    expect(result).toBe(75); // 50 base + 25 speed bonus
  });

  it("awards 0 points for incorrect answers regardless of time", () => {
    const result = calculateScore({
      isCorrect: false,
      timeElapsed: 5,
      difficulty: "hard",
    });
    expect(result).toBe(0);
  });
});
```

## Component Tests

### Astro Components

```typescript
// For Astro components
import { expect, test } from "@playwright/test";
import { astroComponentFactory } from "@astrojs/test-utils";

test("GenreSelector displays all music genres correctly", async () => {
  const component = await astroComponentFactory({
    componentPath: "./src/components/GenreSelector.astro",
    props: {
      genres: ["Rock", "Pop", "Jazz", "Classical"],
      selectedGenre: "Rock",
    },
  });

  const html = await component.render();

  // Verify all genres are rendered
  expect(html).toContain("Rock");
  expect(html).toContain("Pop");
  expect(html).toContain("Jazz");
  expect(html).toContain("Classical");

  // Verify active state for selected genre
  expect(html).toContain('class="genre-option selected"');
});
```

### Client Components (React/Preact)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import QuestionCard from '../components/QuestionCard';

describe('QuestionCard Component', () => {
  // Arrange - Prepare test data
  const mockQuestion = {
    id: 'q1',
    text: 'Who wrote "Bohemian Rhapsody"?',
    options: ['Freddie Mercury', 'John Lennon', 'David Bowie', 'Elton John'],
    correctAnswer: 0,
    difficulty: 'medium',
    genre: 'Rock'
  };

  const mockOnAnswer = vi.fn();

  // Setup and teardown
  beforeEach(() => {
    // Common setup code
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Reset mocks and timers
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  it('renders the question text correctly', () => {
    // Act - Render component
    render(<QuestionCard question={mockQuestion} onAnswer={mockOnAnswer} />);

    // Assert - Check rendering using semantic queries
    expect(screen.getByRole('heading')).toHaveTextContent(mockQuestion.text);
  });

  it('displays all answer options', () => {
    render(<QuestionCard question={mockQuestion} onAnswer={mockOnAnswer} />);

    // Use appropriate queries that reflect how users interact with your UI
    const options = screen.getAllByRole('button', { name: /Freddie Mercury|John Lennon|David Bowie|Elton John/i });
    expect(options).toHaveLength(4);

    mockQuestion.options.forEach(option => {
      expect(screen.getByRole('button', { name: option })).toBeInTheDocument();
    });
  });

  it('calls onAnswer with correct index when an option is clicked', async () => {
    render(<QuestionCard question={mockQuestion} onAnswer={mockOnAnswer} />);

    // Click on the first option using semantic selectors
    fireEvent.click(screen.getByRole('button', { name: mockQuestion.options[0] }));

    // Check if the handler was called with the correct index
    expect(mockOnAnswer).toHaveBeenCalledWith(0);
  });

  it('visually indicates selected option when clicked', () => {
    render(<QuestionCard question={mockQuestion} onAnswer={mockOnAnswer} />);

    const option = screen.getByRole('button', { name: mockQuestion.options[0] });
    fireEvent.click(option);

    expect(option).toHaveClass('selected');
  });

  it('disables all options after selection', async () => {
    render(<QuestionCard question={mockQuestion} onAnswer={mockOnAnswer} />);

    // Click on an option
    fireEvent.click(screen.getByRole('button', { name: mockQuestion.options[0] }));

    // Check that all options are now disabled
    const options = screen.getAllByRole('button', { name: /Freddie Mercury|John Lennon|David Bowie|Elton John/i });
    options.forEach(option => {
      expect(option).toBeDisabled();
    });
  });
});
```

## API and Service Tests

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchQuestions } from "../services/questionService";

// Mock the fetch API
vi.mock("global", () => ({
  fetch: vi.fn(),
}));

describe("questionService", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();

    // Setup mock response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        questions: [
          {
            id: "q1",
            text: "Test question?",
            options: ["A", "B", "C", "D"],
            correctAnswer: 2,
          },
        ],
      }),
    });
  });

  it("fetches questions for the specified genre and difficulty", async () => {
    const questions = await fetchQuestions("rock", "medium");

    // Verify fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/questions?genre=rock&difficulty=medium"),
      expect.any(Object)
    );

    // Verify response handling
    expect(questions).toHaveLength(1);
    expect(questions[0].text).toBe("Test question?");
  });

  it("handles API errors gracefully", async () => {
    // Override the mock to simulate an error
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    // Verify error handling
    await expect(fetchQuestions("rock", "medium")).rejects.toThrow("Failed to fetch questions");
  });
});
```

## Accessibility Tests

```typescript
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import QuestionCard from '../components/QuestionCard';

// Add jest-axe custom matchers
expect.extend(toHaveNoViolations);

describe('QuestionCard accessibility', () => {
  it('should not have accessibility violations', async () => {
    const mockQuestion = {
      id: 'q1',
      text: 'Who wrote "Bohemian Rhapsody"?',
      options: ['Freddie Mercury', 'John Lennon', 'David Bowie', 'Elton John'],
      correctAnswer: 0,
      difficulty: 'medium',
      genre: 'Rock'
    };

    // Render the component
    const { container } = render(<QuestionCard question={mockQuestion} onAnswer={() => {}} />);

    // Run axe accessibility test
    const results = await axe(container);

    // Assert that there are no violations
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation between options', async () => {
    // Test implementation for keyboard navigation
    // This would involve simulating Tab and Enter key presses
    // and verifying focus movement and selection behavior
  });
});
```

## End-to-End Tests

```typescript
import { test, expect } from "@playwright/test";

test("complete game flow works correctly", async ({ page }) => {
  // Navigate to the starting page
  await page.goto("/");

  // Start a new game
  await page.getByRole("button", { name: "Start Game" }).click();

  // Select genre and difficulty
  await page.getByRole("button", { name: "Rock" }).click();
  await page.getByRole("button", { name: "Medium" }).click();

  // Verify game started with correct settings
  await expect(page.getByText("Rock Trivia - Medium")).toBeVisible();

  // Answer questions and verify progress
  for (let i = 0; i < 5; i++) {
    // Wait for question to load
    await page.waitForSelector(".question-card");

    // Select the first option (doesn't matter if correct for this test)
    await page.getByRole("button", { name: /.+/ }).first().click();

    // Move to next question or finish
    const nextButton = page.getByRole("button", { name: "Next" });
    if (await nextButton.isVisible()) {
      await nextButton.click();
    }
  }

  // Verify results are displayed
  await expect(page.getByText("Game Results")).toBeVisible();
  await expect(page.getByText("Your Score:")).toBeVisible();
});
```

## State Management Tests

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { gameStore, setDifficulty, setGenre, incrementScore } from "../stores/gameStore";

describe("gameStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    gameStore.setState({
      score: 0,
      difficulty: "easy",
      genre: "",
      currentQuestionIndex: 0,
      jokersRemaining: 3,
      answeredQuestions: [],
      gameStarted: false,
      gameFinished: false,
    });
  });

  it("updates difficulty correctly", () => {
    setDifficulty("hard");

    const state = gameStore.getState();
    expect(state.difficulty).toBe("hard");
    expect(state.jokersRemaining).toBe(10); // Verify joker count updated for hard difficulty
  });

  it("increments score with correct values based on time", () => {
    incrementScore(true, 5); // Correct answer in 5 seconds

    let state = gameStore.getState();
    expect(state.score).toBe(100); // 50 points + 50 time bonus

    incrementScore(true, 12); // Correct answer in 12 seconds

    state = gameStore.getState();
    expect(state.score).toBe(175); // Previous 100 + 50 points + 25 time bonus
  });

  it("tracks answered questions correctly", () => {
    const questionId = "q123";

    incrementScore(true, 10, questionId);

    const state = gameStore.getState();
    expect(state.answeredQuestions).toContain(questionId);
    expect(state.currentQuestionIndex).toBe(1);
  });
});
```

## Test Coverage Requirements

- **Game Logic**: >95% coverage (critical to game functionality)
- **UI Components**: >85% coverage (focus on user interactions)
- **Utilities**: >90% coverage (shared functionality)
- **State Management**: >90% coverage (critical to application state)
- **API Services**: >85% coverage (including error handling)

Use Vitest's built-in coverage reports and configure thresholds in the CI pipeline to enforce these
standards.

## Mocking Best Practices

- Use `vi.mock()` for external dependencies
- Create factory functions for generating test data
- Use MSW (Mock Service Worker) for API mocking in more complex scenarios
- Keep mocks focused on the specific behavior needed for each test
- Create reusable mock utilities for common patterns

```typescript
// Example of a test data factory
function createMockQuestion(overrides = {}) {
  return {
    id: "q1",
    text: "Default question text?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    difficulty: "medium",
    genre: "Rock",
    ...overrides,
  };
}

// Example usage
const customQuestion = createMockQuestion({
  text: "Custom question?",
  correctAnswer: 2,
});
```

## CI Integration

- Configure tests to run on every pull request
- Fail CI pipeline if any tests fail or coverage drops below thresholds
- Generate and publish test reports for review
- Use test timing data to identify slow tests for optimization

## Context Isolation

- Use `beforeEach` and `afterEach` to reset state between tests
- Prefer creating fresh component instances for each test
- Avoid shared state between test files
- Use `vi.isolateModules()` for module-level isolation when needed

## Special Testing Considerations for MelodyMind

- Test timer functionality using `vi.useFakeTimers()`
- Verify animations complete correctly using `await screen.findBy...` queries
- Ensure sound effects play correctly by mocking audio APIs
- Test achievements and progress tracking across game sessions
- Verify correct handling of network issues during API calls
- Test responsive design using Playwright's device emulation

These testing standards help ensure MelodyMind delivers a high-quality, reliable gaming experience
across all devices and scenarios.
