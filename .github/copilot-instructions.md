# MelodyMind - GitHub Copilot Instructions

This file provides general instructions for GitHub Copilot when working with the MelodyMind project.

## Project Overvie## Documentation Guidelines

- All documentation must be written in English, regardless of the user interface language
- Use clear and concise language
- Add comprehensive JSDoc comments to all functions and components
- Document parameters, return values, and potential errors
- Provide usage examples for complex functionality
- Keep documentation up-to-date when code changes
- Include type information in all documentation
- Document accessibility considerations for UI components
- Create Markdown files for major features and components
- Maintain consistent terminology throughout the codebase
- Use descriptive variable and function names that clearly indicate purposend is an engaging and
  competitive music trivia game where players can test their knowledge across various music genres.
  Whether you're a rock enthusiast, pop aficionado, or jazz expert, this game offers a thrilling
  experience with multiple categories and rounds.

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
- Ensure script sections in Astro components are always written in TypeScript
- Convert existing JavaScript scripts to TypeScript when necessary
- Follow Astro.js component patterns
- Maintain responsive design for all UI elements
- Add JSDoc comments to all functions and components
- Use semantic HTML elements
- Follow accessibility best practices (WCAG)
- Implement proper error handling
- Use meaningful variable and function names
- **All documentation must be written in English**, regardless of the user interface language
- When creating dynamic routes in Astro, always export a `getStaticPaths()` function
- Extract scripts to external `.ts` files only when they are complex or reused
- Always use English language versions as templates for translations and documentation

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

- Use vanilla CSS for all styling needs - prioritize clean, maintainable CSS over inline styles
- Implement a CSS methodology like BEM (Block Element Modifier) for consistent class naming
- Use CSS custom properties (variables) for theme colors, spacing, and other repeated values
- Maintain styles in dedicated `.css` files organized by component or functionality
- Implement a design system with consistent spacing, typography, and color schemes
- Use a consistent color scheme (purple, pink, dark background) defined with CSS variables
- Create responsive designs using CSS Grid, Flexbox, and media queries
- Implement proper CSS architecture with base styles, components, and utilities
- Keep selectors simple and avoid deep nesting for better performance
- Use CSS modules or scoped styles with Astro's built-in support to prevent style conflicts
- Follow accessibility guidelines for contrast and readability
- Implement transitions and animations with CSS properties for smooth user experiences
- Minimize the use of !important declarations

## Performance Considerations

- Optimize CSS delivery with critical path rendering
- Minify CSS files for production
- Optimize image assets
- Minimize JavaScript bundle size
- Implement code splitting
- Use efficient rendering strategies
- Cache static assets appropriately
- Optimize database queries
- Use HTTP/2 or HTTP/3 for resource delivery
- Apply browser hints like preload and prefetch for critical resources

## Astro Specific Guidelines

- **Dynamic Routes**: Always export a `getStaticPaths()` function from dynamic route components:
  ```typescript
  export async function getStaticPaths() {
    // Return an array of objects with params property
    return [
      { params: { param: "value1" } },
      { params: { param: "value2" } },
      // Include all possible path values
    ];
  }
  ```
  **IMPORTANT**: The `getStaticPaths()` function is REQUIRED for all dynamic routes. Make sure that
  you always `export` a `getStaticPaths` function from your dynamic route components.
- **Script Management**:
  - Use inline scripts for simple functionality
  - Extract complex logic to external `.ts` files
  - Always use `type="module"` for all script tags
- **Style Management**:
  - Use scoped component styles with Astro's built-in `<style>` tag
  - Maintain global styles in dedicated CSS files in the `src/styles/` directory
  - Use CSS modules for component-specific styles
  - Follow the project's CSS naming conventions
  - Keep selectors simple and specific to components
  - Extract common styles to shared utility classes

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

**Note: Please do not write any tests at this time. Test implementation will be handled separately
at a later stage.**

- ~~Write unit tests for game logic~~
- ~~Create component tests for UI elements~~
- ~~Implement integration tests for key user flows~~
- ~~Use mock data for testing scenarios~~
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

## Documentation Guidelines

- All documentation must be written in English, regardless of the UI language
- Use clear and concise language
- Add comprehensive JSDoc comments to all functions and components
- Document parameters, return values, and potential errors
- Provide usage examples for complex functionality
- Keep documentation up-to-date when code changes
- Include type information in all documentation
- Document accessibility considerations for UI components
- Create Markdown files for major features and components
