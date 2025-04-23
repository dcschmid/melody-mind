# Generate Component Tests

Your goal is to generate comprehensive tests for a MelodyMind component following Astro's testing best practices.

## Testing Requirements

If not specified, ask for:

- The component to test
- Any specific behaviors to verify
- Props variations to test
- Edge cases to consider

## Technical Requirements

- Use Vitest for unit and component testing
- Use Playwright for end-to-end testing where appropriate
- Follow AAA pattern: Arrange, Act, Assert
- Use descriptive test names
- Test both normal and edge cases
- For UI components, test accessibility features

## Test Structure

For Astro components:

```typescript
// For Astro components
import { expect, test } from "@playwright/test";
import { astroComponentFactory } from "@astrojs/test-utils";

const component = await astroComponentFactory(
  "./src/components/ComponentName.astro",
  {
    props: {
      /* props here */
    },
  },
);

test("ComponentName renders with expected content", async () => {
  const html = await component.render();
  expect(html).toBeTruthy();
  expect(html).toContain("Expected content");
});
```

For React components:

```typescript
// For React components or client islands
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render with default props', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    const handleClick = vi.fn();
    render(<ComponentName onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Example Tests

For a "JokerButton" component:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JokerButton } from '../components/JokerButton';

describe('JokerButton', () => {
  it('should render with the correct number of jokers remaining', () => {
    render(<JokerButton jokersRemaining={3} onUseJoker={() => {}} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByLabelText('Use 50:50 joker')).toBeInTheDocument();
  });

  it('should be disabled when no jokers are remaining', () => {
    render(<JokerButton jokersRemaining={0} onUseJoker={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should call onUseJoker when clicked with jokers remaining', () => {
    const handleUseJoker = vi.fn();
    render(<JokerButton jokersRemaining={2} onUseJoker={handleUseJoker} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleUseJoker).toHaveBeenCalledTimes(1);
  });

  it('should not call onUseJoker when clicked with no jokers remaining', () => {
    const handleUseJoker = vi.fn();
    render(<JokerButton jokersRemaining={0} onUseJoker={handleUseJoker} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleUseJoker).not.toHaveBeenCalled();
  });

  it('should have proper focus styling for keyboard users', async () => {
    render(<JokerButton jokersRemaining={3} onUseJoker={() => {}} />);
    const button = screen.getByRole('button');

    // Tab to focus the button
    button.focus();

    // Check that focus styling is applied
    expect(button).toHaveClass('ring-2', 'ring-offset-2', 'ring-purple-500');
  });
});
```
