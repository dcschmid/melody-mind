# MelodyMind - GitHub Copilot Instructions

This file provides general instructions for GitHub Copilot when working with the MelodyMind project.

## Project Overview

MelodyMind is an engaging and competitive music trivia game where players can test their knowledge across various music genres. Whether you're a rock enthusiast, pop aficionado, or jazz expert, this game offers a thrilling experience with multiple categories and rounds.

## Key Features

- **Multiple Difficulty Levels**: Easy (10 questions), Medium (15 questions), Hard (20 questions)
- **Point System**: 50 points per correct answer (max 500/750/1000 points based on difficulty)
- **Speed Bonus**: +50 points (within 10s), +25 points (within 15s)
- **50:50 Joker**: Eliminates two wrong answers (3/5/10 uses based on difficulty)
- **Diverse Music Genres**: Multiple categories for varied interests

## Game Mechanics

- Players select a music genre and difficulty level
- Questions are presented one by one with multiple-choice answers
- The timer affects the speed bonus points
- Jokers can be used to eliminate incorrect options
- Scores are calculated based on correct answers and speed
- Results are displayed at the end of each round
- Special achievements are awarded for perfect scores

## Coding Standards

- Use TypeScript for all new code
- Follow Astro.js component patterns
- Maintain responsive design for all UI elements
- Add JSDoc comments to all functions and components
- Use semantic HTML elements
- Follow accessibility best practices (WCAG)
- Implement proper error handling
- Use meaningful variable and function names

## Architectural Guidelines

- Use Astro components for page structure
- Keep game logic in dedicated utility files
- Store data models in separate TypeScript interfaces
- Use client-side scripts minimally for interactivity
- Leverage Astro islands for interactive components
- Implement proper state management

## File Structure

- `/src/pages/` - All page components
- `/src/components/` - Reusable UI components
- `/src/layouts/` - Page layout templates
- `/src/utils/` - Utility functions and game logic
- `/src/styles/` - Global CSS and styling utilities
- `/src/data/` - Question data and static content
- `/src/types/` - TypeScript interfaces and types
- `/public/` - Static assets like images and fonts

## Data Models

### Question Format

```typescript
interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
  genre: string;
  explanation?: string;
}
```

### User Score Format

```typescript
interface UserScore {
  userId: string;
  username: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  difficulty: "easy" | "medium" | "hard";
  genre: string;
  completedAt: Date;
  achievements: string[];
}
```

## UI Components

- **QuestionCard**: Displays the current question and options
- **Timer**: Shows remaining time for speed bonus
- **ScoreDisplay**: Shows current score and stats
- **JokerButton**: Activates the 50:50 feature
- **ResultsOverlay**: Displays end-of-round results
- **GenreSelector**: For choosing music categories
- **DifficultyPicker**: For selecting difficulty level

## Styling Guidelines

- Use Tailwind CSS for all styling needs - prioritize Tailwind utility classes over custom CSS
- Follow the Tailwind utility-first workflow and avoid custom CSS when possible
- Use a consistent color scheme through Tailwind's configuration (purple, pink, dark background)
- Implement responsive design using Tailwind's responsive modifiers (sm:, md:, lg:, xl:)
- Leverage Tailwind's design system for spacing, typography, and colors
- Use Tailwind's dark mode utilities for theme switching
- For complex components, use Tailwind's @apply directive only when necessary
- Follow accessibility guidelines for contrast and readability
- Implement transitions using Tailwind's transition utilities
- Extend the Tailwind theme in tailwind.config.js rather than using custom values

## Performance Considerations

- Optimize Tailwind's output with proper PurgeCSS configuration
- Optimize image assets
- Minimize JavaScript bundle size
- Implement code splitting
- Use efficient rendering strategies
- Cache static assets appropriately
- Optimize database queries
- Use Tailwind's JIT mode for development

## Accessibility Guidelines

- Follow WCAG AAA guidelines for all content and interactions
- Ensure color contrast ratios meet AAA standards (7:1 for normal text, 4.5:1 for large text)
- Provide proper focus indicators for all interactive elements
- Implement keyboard navigation for all features
- Use appropriate ARIA attributes when necessary
- Ensure all content is screen reader friendly
- Support various input methods (keyboard, mouse, touch)
- Add descriptive alt text to all images
- Use semantic HTML elements to convey structure
- Maintain a logical tab order for all interactive elements
- Provide text alternatives for non-text content

## Testing Strategy

- Write unit tests for game logic
- Create component tests for UI elements
- Implement integration tests for key user flows
- Use mock data for testing scenarios
- Ensure cross-browser compatibility
- Conduct accessibility audits against WCAG AAA standards
- Test with screen readers and assistive technologies

## Best Practices

- Follow the principle of least privilege
- Implement proper error boundaries
- Use defensive coding practices
- Document complex logic with comments
- Follow Git workflow best practices
- Keep dependencies up to date
