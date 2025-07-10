# Comprehensive Test Generator for MelodyMind

Your goal is to generate comprehensive, well-structured tests for MelodyMind components, utilities,
and features following the project's testing standards and best practices. This prompt helps create
consistent, maintainable tests that validate behavior rather than implementation details.

**Important**: All test code and documentation must be written in English, regardless of the user
interface language. This includes test descriptions, comments, variable names, and any
documentation.

## Quick Start Templates

If no specific details are provided, ask for:

- The file/component to test (provide the file path)
- The type of test needed (unit, component, accessibility, integration)
- Specific functionality to test (if any)
- Any edge cases or special requirements

## Test Type Selection Guide

### 1. **Unit Tests** - For utility functions and pure logic

```typescript
// Use for: /src/utils/, pure functions, calculations, data transformations
import { describe, it, expect } from "vitest";
import { functionToTest } from "../path/to/function";
```

### 2. **Component Tests** - For Astro components

```typescript
// Use for: /src/components/*.astro files
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, test } from "vitest";
import ComponentName from "../components/ComponentName.astro";
```

### 3. **Accessibility Tests** - WCAG 2.2 AAA compliance

```typescript
// Use for: All interactive components, forms, navigation
import { describe, test, expect } from "vitest";
// + accessibility testing utilities
```

### 4. **Integration Tests** - For API endpoints and services

```typescript
// Use for: /src/pages/api/, database operations, external services
import { describe, it, expect, beforeEach, afterEach } from "vitest";
```

### 5. **End-to-End Tests** - For complete user flows

```typescript
// Use for: Complete game flows, user journeys, cross-page interactions
import { test, expect } from "@playwright/test";
```

## Automated Test Generation Templates

### Template 1: Astro Component Test Suite

When testing an Astro component, generate a comprehensive test suite:

```typescript
// filepath: /src/components/ComponentName.test.ts
/* eslint-disable max-lines-per-function */
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, test } from "vitest";

import ComponentName from "../components/ComponentName.astro";

describe("ComponentName Component", () => {
  // ======================================
  // BASIC FUNCTIONALITY TESTS
  // ======================================

  test("renders with required props", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ComponentName, {
      props: {
        // Add required props here
        requiredProp: "test value",
      },
    });

    expect(result).toContain("expected content");
    expect(result).toContain("expected CSS class");
  });

  test("renders with optional props", async () => {
    // Test optional props and default values
  });

  test("handles slot content correctly", async () => {
    // Test slot content if component uses slots
  });

  // ======================================
  // EDGE CASES AND ERROR HANDLING
  // ======================================

  test("handles missing props gracefully", async () => {
    // Test behavior with missing or undefined props
  });

  test("handles empty/invalid prop values", async () => {
    // Test edge cases like empty strings, null values, etc.
  });

  // ======================================
  // SNAPSHOT TESTS
  // ======================================

  describe("Snapshot Tests", () => {
    test("matches snapshot for basic configuration", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ComponentName, {
        props: {
          // Basic configuration
        },
      });

      expect(result).toMatchSnapshot();
    });

    test("matches snapshot for all props configuration", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ComponentName, {
        props: {
          // All props configuration
        },
      });

      expect(result).toMatchSnapshot();
    });
  });

  // ======================================
  // WCAG 2.2 AAA ACCESSIBILITY TESTS
  // ======================================

  describe("WCAG 2.2 AAA Accessibility Tests", () => {
    test("ensures proper semantic HTML structure", async () => {
      // Test semantic HTML elements
    });

    test("provides accessible focus management", async () => {
      // Test focus behavior if interactive
    });

    test("supports screen reader accessibility", async () => {
      // Test ARIA attributes and labels
    });

    test("maintains proper document structure", async () => {
      // Test heading hierarchy, landmarks, etc.
    });

    test("ensures keyboard navigation support", async () => {
      // Test keyboard accessibility
    });

    test("validates HTML structure integrity", async () => {
      // Test valid HTML output
    });
  });
});
```

### Template 2: Utility Function Test Suite

When testing utility functions, generate focused unit tests:

```typescript
// filepath: /src/utils/functionName.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { functionToTest, type FunctionParams } from "../utils/functionName";

describe("functionToTest", () => {
  // ======================================
  // CORE FUNCTIONALITY TESTS
  // ======================================

  it("returns expected result for valid input", () => {
    const input: FunctionParams = {
      // Valid input parameters
    };
    const result = functionToTest(input);

    expect(result).toBe(expectedValue);
  });

  it("handles edge cases correctly", () => {
    // Test boundary conditions, empty inputs, etc.
  });

  // ======================================
  // ERROR HANDLING TESTS
  // ======================================

  it("throws appropriate error for invalid input", () => {
    expect(() => functionToTest(invalidInput)).toThrow("Expected error message");
  });

  it("handles null/undefined gracefully", () => {
    // Test null safety
  });

  // ======================================
  // PERFORMANCE TESTS (if applicable)
  // ======================================

  it("performs efficiently with large datasets", () => {
    // Performance tests for heavy computations
  });
});
```

### Template 3: Game Logic Test Suite

For MelodyMind-specific game functionality:

```typescript
// filepath: /src/utils/game/gameLogic.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { gameFunction } from "../utils/game/gameLogic";

describe("Game Logic: gameFunction", () => {
  beforeEach(() => {
    // Reset game state, timers, etc.
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ======================================
  // GAME MECHANICS TESTS
  // ======================================

  it("calculates score correctly for different difficulties", () => {
    const difficulties = ["easy", "medium", "hard"] as const;

    difficulties.forEach((difficulty) => {
      const score = gameFunction({ difficulty, correct: true });
      expect(score).toBe(expectedScoreForDifficulty[difficulty]);
    });
  });

  it("applies speed bonus correctly", () => {
    // Test timing-based scoring
    const fastAnswer = gameFunction({ answerTime: 5000 }); // 5 seconds
    const slowAnswer = gameFunction({ answerTime: 20000 }); // 20 seconds

    expect(fastAnswer).toBeGreaterThan(slowAnswer);
  });

  it("handles joker usage correctly", () => {
    // Test 50:50 joker functionality
  });

  // ======================================
  // GAME STATE TESTS
  // ======================================

  it("tracks game progress correctly", () => {
    // Test question progression, completion, etc.
  });

  it("manages achievements properly", () => {
    // Test achievement unlocking logic
  });
});
```

### Template 4: API Endpoint Test Suite

For testing API routes:

```typescript
// filepath: /src/pages/api/endpoint.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("API Endpoint: /api/endpoint", () => {
  beforeEach(() => {
    // Setup test database, mocks, etc.
  });

  afterEach(() => {
    // Cleanup
  });

  // ======================================
  // SUCCESS CASES
  // ======================================

  it("returns expected data for valid request", async () => {
    const response = await fetch("/api/endpoint", {
      method: "POST",
      body: JSON.stringify(validData),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject(expectedResponse);
  });

  // ======================================
  // ERROR HANDLING
  // ======================================

  it("returns 400 for invalid request data", async () => {
    const response = await fetch("/api/endpoint", {
      method: "POST",
      body: JSON.stringify(invalidData),
    });

    expect(response.status).toBe(400);
  });

  it("handles database errors gracefully", async () => {
    // Mock database failure
    vi.mock("../db/connection", () => ({
      query: vi.fn().mockRejectedValue(new Error("Database error")),
    }));

    // Test error handling
  });

  // ======================================
  // SECURITY TESTS
  // ======================================

  it("validates authentication properly", async () => {
    // Test auth requirements
  });

  it("sanitizes input data", async () => {
    // Test input validation and sanitization
  });
});
```

### Template 5: End-to-End Test Suite

For complete user flows:

```typescript
// filepath: /e2e/game-flow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Complete Game Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Setup test environment
    await page.goto("/");
  });

  test("user can complete a full game session", async ({ page }) => {
    // ======================================
    // GAME SETUP
    // ======================================

    // Start new game
    await page.getByRole("button", { name: "Start Game" }).click();

    // Select genre and difficulty
    await page.getByRole("button", { name: "Rock" }).click();
    await page.getByRole("button", { name: "Medium" }).click();

    // Verify game started
    await expect(page.getByText("Rock Trivia - Medium")).toBeVisible();

    // ======================================
    // GAME PLAY
    // ======================================

    // Answer questions
    for (let i = 0; i < 15; i++) {
      // Medium = 15 questions
      // Wait for question to load
      await expect(page.getByRole("heading", { level: 2 })).toBeVisible();

      // Select an answer
      await page.getByRole("button").first().click();

      // Wait for next question or results
      await page.waitForTimeout(1000);
    }

    // ======================================
    // RESULTS VERIFICATION
    // ======================================

    // Verify results screen
    await expect(page.getByText("Game Results")).toBeVisible();
    await expect(page.getByText("Your Score:")).toBeVisible();
    await expect(page.getByText(/\d+ points/)).toBeVisible();
  });

  test("accessibility: game is fully keyboard navigable", async ({ page }) => {
    // Test complete keyboard navigation
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    // Continue testing keyboard flow
  });

  test("responsive design: works on mobile devices", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    // Verify mobile functionality
  });
});
```

## MelodyMind-Specific Test Patterns

### Testing Game Components

```typescript
// For game-specific components like QuestionCard, ScoreDisplay, etc.
describe("Game Component Tests", () => {
  it("displays correct question count for difficulty", () => {
    const difficulties = {
      easy: 10,
      medium: 15,
      hard: 20,
    };
    // Test logic
  });

  it("manages joker usage correctly", () => {
    const jokerCounts = {
      easy: 3,
      medium: 5,
      hard: 10,
    };
    // Test joker functionality
  });
});
```

### Testing Audio Features

```typescript
// For sound effects and audio feedback
describe("Audio Features", () => {
  beforeEach(() => {
    // Mock Audio API
    global.Audio = vi.fn().mockImplementation(() => ({
      play: vi.fn(),
      pause: vi.fn(),
      load: vi.fn(),
    }));
  });

  it("plays correct sound for answer feedback", () => {
    // Test audio implementation
  });
});
```

### Testing Internationalization

```typescript
// For i18n features
import { useTranslations } from "../utils/i18n";

describe("Internationalization", () => {
  it("displays content in correct language", () => {
    const t = useTranslations("de");
    expect(t("game.start")).toBe("Spiel starten");
  });
});
```

## Quick Test Generation Workflow

1. **Identify the file type**:
   - `.astro` → Use Astro Component Template
   - `/utils/` → Use Utility Function Template
   - `/pages/api/` → Use API Endpoint Template
   - Game logic → Use Game Logic Template

2. **Generate base structure** from appropriate template

3. **Customize for specific functionality**:
   - Add component-specific props and behaviors
   - Include relevant edge cases
   - Add accessibility tests for interactive elements
   - Include snapshot tests for UI components

4. **Add MelodyMind-specific tests**:
   - Game mechanics (scoring, timing, difficulty)
   - Audio features (if applicable)
   - Internationalization (if applicable)
   - Achievements and progress tracking

5. **Ensure comprehensive coverage**:
   - Happy path scenarios
   - Edge cases and error conditions
   - Accessibility compliance
   - Performance considerations
   - Security validations (for API endpoints)

## Coverage Requirements

Follow MelodyMind's coverage requirements:

- **Game Logic**: >95% coverage
- **UI Components**: >85% coverage
- **Utilities**: >90% coverage
- **API Services**: >85% coverage
- **State Management**: >90% coverage

## Test File Organization

```
src/
├── components/
│   ├── ComponentName.astro
│   └── ComponentName.test.ts
├── utils/
│   ├── utilityFunction.ts
│   └── utilityFunction.test.ts
├── pages/api/
│   ├── endpoint.ts
│   └── endpoint.test.ts
└── __snapshots__/
    └── ComponentName.test.ts.snap
```

## Final Checklist

Before completing test generation, ensure:

- ✅ All tests follow AAA pattern (Arrange-Act-Assert)
- ✅ Test names clearly describe expected behavior
- ✅ Edge cases and error conditions are covered
- ✅ Accessibility tests included for interactive components
- ✅ Snapshot tests added for UI components
- ✅ Mocks are properly setup and cleaned up
- ✅ Tests are isolated and don't depend on external state
- ✅ Performance considerations tested where relevant
- ✅ MelodyMind-specific game mechanics tested
- ✅ All code and comments in English

This comprehensive test generator ensures consistent, maintainable, and thorough test coverage
across the entire MelodyMind project while following best practices and project-specific
requirements.
