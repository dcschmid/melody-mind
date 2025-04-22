# TypeScript Rules for MelodyMind

## Coding Style

- Use TypeScript strict mode
- Define proper interfaces for all data structures
- Use type annotations for function parameters and return types
- Prefer `const` over `let` where possible
- Use arrow functions for callbacks
- Use async/await for asynchronous operations
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer code

## Component Structure

- Use functional components with explicit type definitions
- Define component props with interfaces
- Export components as named exports unless they're the default export for a file
- Keep components focused on a single responsibility

## Example Component Pattern

```typescript
interface GameCardProps {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  genre: string;
  onSelect: () => void;
}

export const GameCard = ({
  title,
  difficulty,
  genre,
  onSelect,
}: GameCardProps): JSX.Element => {
  // Implementation
};
```

## Game Logic

- Implement proper score calculation based on difficulty:
  - Easy: 50 points per question, max 500 points
  - Medium: 50 points per question, max 750 points
  - Hard: 50 points per question, max 1000 points
- Add speed bonus logic:
  - Within 10 seconds: +50 bonus points
  - Within 15 seconds: +25 bonus points
- Implement Joker functionality with limits based on difficulty level

## Error Handling

- Use try/catch blocks for error-prone operations
- Provide meaningful error messages
- Implement graceful fallbacks for failed operations
- Log errors appropriately
