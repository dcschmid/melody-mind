# Testing Setup - MelodyMind

This document describes the testing setup for the MelodyMind project using Vitest.

## Overview

We use [Vitest](https://vitest.dev/) as our testing framework, which is optimized for Vite-based
projects like Astro. Vitest provides excellent TypeScript support, ESM compatibility, and fast
execution.

## Configuration

The main configuration is in `vitest.config.ts`, which uses Astro's `getViteConfig()` helper to
ensure compatibility with the Astro project settings.

### Key Configuration Options:

- **Environment**: `jsdom` for browser-like testing environment
- **Globals**: Enabled for global test functions (`describe`, `it`, `expect`)
- **Coverage**: V8 provider with text, JSON, and HTML reports
- **Setup Files**: `src/tests/setup.ts` for global test setup
- **Include Pattern**: `src/**/*.{test,spec}.{js,ts,jsx,tsx}`

## Test Scripts

Available npm/yarn scripts for testing:

```bash
# Run all tests once
yarn test:run

# Run tests in watch mode
yarn test

# Run tests with UI
yarn test:ui

# Run tests with coverage report
yarn test:coverage

# Run tests in watch mode
yarn test:watch
```

## Writing Tests

### File Naming

Test files should follow the naming convention:

- `*.test.ts` or `*.spec.ts` for unit tests
- Place test files next to the code they test (e.g., `utils/memoize.test.ts`)

### Example Test Structure

```typescript
import { describe, it, expect, vi } from "vitest";
import { functionToTest } from "./moduleToTest";

describe("Module Name", () => {
  describe("functionToTest", () => {
    it("should do something specific", () => {
      // Arrange
      const input = "test input";

      // Act
      const result = functionToTest(input);

      // Assert
      expect(result).toBe("expected output");
    });

    it("should handle edge cases", () => {
      expect(() => functionToTest(null)).toThrow();
    });
  });
});
```

### Testing Utilities

#### Mocking

```typescript
import { vi } from "vitest";

// Mock a function
const mockFn = vi.fn();

// Spy on existing function
const spy = vi.spyOn(object, "method");

// Mock timers
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
vi.useRealTimers();
```

#### DOM Testing

For components that interact with the DOM:

```typescript
import { beforeEach } from "vitest";

describe("DOM Component", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should update DOM correctly", () => {
    // Test DOM interactions
  });
});
```

## Test Categories

### Unit Tests

- Test individual functions and utilities
- Located next to the source files
- Focus on pure functions and business logic

### Integration Tests

- Test component interactions
- Located in `src/tests/integration/`
- Test multiple modules working together

### Accessibility Tests

- Automated accessibility testing
- Use tools like `@axe-core/core` for WCAG compliance
- Located in `src/tests/accessibility/`

## Coverage

Coverage reports are generated in the `coverage/` directory:

- `coverage/index.html` - HTML report for browser viewing
- `coverage/coverage-final.json` - JSON data for CI/CD integration
- Text report in terminal during test execution

### Coverage Goals

- Aim for >80% code coverage on utility functions
- Focus on critical business logic and error handling
- Don't obsess over 100% coverage; focus on meaningful tests

## Best Practices

### 1. Test Naming

- Use descriptive test names that explain the expected behavior
- Follow the pattern: "should [expected behavior] when [condition]"

### 2. Test Structure

- Follow Arrange-Act-Assert (AAA) pattern
- Keep tests focused on a single concern
- Use `describe` blocks to group related tests

### 3. Mocking

- Mock external dependencies and side effects
- Use real implementations for the code under test
- Be careful not to mock too much (avoid testing mocks)

### 4. Async Testing

```typescript
it("should handle async operations", async () => {
  const result = await asyncFunction();
  expect(result).toBe("expected");
});
```

### 5. Error Testing

```typescript
it("should throw an error for invalid input", () => {
  expect(() => functionWithValidation("")).toThrow("Validation error");
});
```

## Debugging Tests

### Running Specific Tests

```bash
# Run tests for specific file
npx vitest run src/utils/memoize.test.ts

# Run tests matching pattern
npx vitest run --grep "memoize"

# Run tests in watch mode for specific file
npx vitest src/utils/memoize.test.ts
```

### Using Debugger

```typescript
it("should debug test", () => {
  debugger; // Will pause execution when DevTools are open
  // test code
});
```

## Example Tests

The project includes example tests in:

- `src/utils/memoize.test.ts` - Testing utility functions
- `src/utils/game/scoreUtils.test.ts` - Testing game utilities

These serve as templates for writing additional tests.

## Continuous Integration

Tests are automatically run in CI/CD pipelines. Make sure all tests pass before merging:

```bash
# This should pass before committing
yarn test:run
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure import paths are correct relative to the test file
2. **DOM Not Available**: Ensure `jsdom` environment is configured
3. **TypeScript Errors**: Check that test files are included in `tsconfig.json`
4. **Mock Issues**: Verify mocks are properly reset between tests

### Getting Help

- Check the [Vitest documentation](https://vitest.dev/)
- Look at existing test examples in the codebase
- Review test failures carefully for hints about the issue
