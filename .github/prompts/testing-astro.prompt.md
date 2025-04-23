# Generate Astro Tests

Your goal is to create comprehensive tests for MelodyMind components and functionality following Astro's official testing patterns.

## Test Requirements

If not specified, ask for:

- The component or utility to test
- The type of test needed (unit, component, integration, e2e)
- Specific behaviors or edge cases to verify
- Any mock data requirements

## Testing Approaches

### Unit Testing with Vitest

Use Vitest for testing utility functions, game logic, and other non-UI code:

```typescript
// Example unit test for game utility functions
import { describe, it, expect } from "vitest";
import { calculateScore, determineAchievement } from "../utils/gameUtils";

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
});
```

### Component Testing

For testing static Astro components, use the `@astrojs/test-utils` package:

```typescript
// Example component test for Astro components
import { expect } from "@playwright/test";
import { test, astroComponentFactory } from "@astrojs/test-utils";

test("GenreSelector displays all music genres", async () => {
  const component = await astroComponentFactory({
    componentPath: "./src/components/GenreSelector.astro",
    props: {
      genres: ["Rock", "Pop", "Jazz", "Classical"],
    },
  });

  const html = await component.render();

  expect(html).toContain("Rock");
  expect(html).toContain("Pop");
  expect(html).toContain("Jazz");
  expect(html).toContain("Classical");
});
```

### UI Component Testing

For interactive UI components with client-side JavaScript, use the Testing Library approach:

```typescript
// Example test for interactive UI component
import { test, expect } from "@playwright/test";

test("JokerButton eliminates two wrong answers when clicked", async ({
  page,
}) => {
  // Navigate to the page containing the component
  await page.goto("/quiz/rock/medium");

  // Initial state: all 4 answer options are displayed
  expect(await page.locator(".answer-option").count()).toBe(4);

  // Use the joker button
  await page.click('[data-testid="joker-button"]');

  // Now only 2 answer options should be visible
  expect(await page.locator(".answer-option:visible").count()).toBe(2);

  // One of visible options should be the correct answer
  expect(
    await page.locator('.answer-option[data-correct="true"]:visible').count(),
  ).toBe(1);
});
```

### End-to-End Testing

Use Playwright for complete user journey testing:

```typescript
// Example end-to-end test
import { test, expect } from "@playwright/test";

test("Complete quiz flow from genre selection to results", async ({ page }) => {
  // Start on the home page
  await page.goto("/");

  // Select a genre
  await page.click('[data-testid="genre-card"][data-genre="rock"]');

  // Select difficulty
  await page.click('[data-testid="difficulty-option"][data-difficulty="easy"]');

  // Answer all questions (simulated for test)
  const questionCount = 10; // Easy mode has 10 questions

  for (let i = 0; i < questionCount; i++) {
    // Select the correct answer (for this test we're assuming it's always option 1)
    await page.click('.answer-option[data-index="1"]');

    // Wait for next question or results screen
    await page.waitForSelector(".question-text, .results-container");
  }

  // Verify we reached the results screen
  await expect(page.locator(".results-container")).toBeVisible();

  // Verify score is displayed
  await expect(page.locator('[data-testid="final-score"]')).toBeVisible();
});
```

## Test Coverage

Aim to test these key areas:

- Core game mechanics (scoring, timer, joker functionality)
- UI interactions (selecting genres, answering questions)
- Edge cases (time running out, using all jokers)
- Accessibility features (keyboard navigation, screen reader compatibility)
- i18n functionality (correct translations display)

## Mocking Strategies

- For API calls, use Vitest's mocking capabilities
- For browser APIs, use standard mocking approaches
- Create realistic test data that represents actual gameplay

```typescript
// Example of mocking quiz data
vi.mock("../data/quizData", () => {
  return {
    fetchQuestions: vi.fn().mockResolvedValue([
      {
        id: "test-question-1",
        text: "Which band performed Bohemian Rhapsody?",
        options: ["The Beatles", "Queen", "Led Zeppelin", "Pink Floyd"],
        correctAnswer: 1,
        difficulty: "easy",
        genre: "rock",
      },
      // Additional test questions...
    ]),
  };
});
```

## Accessibility Testing

Include specific tests for accessibility compliance:

```typescript
// Example accessibility test
import { test, expect } from "@playwright/test";

test("Quiz interface meets accessibility standards", async ({ page }) => {
  await page.goto("/quiz/rock/easy");

  // Check for proper heading structure
  expect(await page.locator("h1").count()).toBe(1);

  // Verify keyboard navigation works
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toHaveAttribute(
    "class",
    /answer-option/,
  );

  // Verify ARIA attributes
  await expect(page.locator('[role="button"]')).toHaveAttribute("aria-pressed");

  // Run axe accessibility tests (requires axe-playwright package)
  // await checkA11y(page);
});
```

## Testing Best Practices

- Use descriptive test names that explain the behavior being tested
- Follow the AAA pattern: Arrange, Act, Assert
- Keep tests independent - don't create dependencies between tests
- Use test data factories for generating consistent test data
- Test both happy paths and error conditions
- Setup proper cleanup between tests
