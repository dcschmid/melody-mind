---
applyTo: "**/*.{css,scss,astro}"
---

# Styling Standards for MelodyMind

These instructions apply to all CSS and SCSS files in the MelodyMind project and take into account
Context7 optimizations and the latest standards.

## General Guidelines

- Use pure CSS for all styling requirements
- **ALWAYS use CSS custom properties (root variables) from `/src/styles/global.css`** - Never
  hardcode colors, spacing, or other design tokens
- **ALWAYS perform code deduplication** - Check for existing similar CSS patterns before creating
  new ones
- Organize CSS with logical sections and components
- Use the BEM methodology (Block-Element-Modifier) for class names
- Apply a consistent color scheme using predefined CSS variables (--color-primary-_,
  --color-secondary-_, etc.)
- Implement component-based organization for better maintainability
- Support both light and dark themes with sufficient contrast using semantic color variables

## Responsive Design

- Implement Media Queries for responsive design:
  - `@media (min-width: 640px)` - from 640px (small)
  - `@media (min-width: 768px)` - from 768px (medium)
  - `@media (min-width: 1024px)` - from 1024px (large)
  - `@media (min-width: 1280px)` - from 1280px (extra large)
  - `@media (min-width: 1536px)` - from 1536px (2x large)
- Implement Container Queries for component-specific responsiveness
- Use modern layout techniques (Grid, Flexbox, Subgrid)
- Test all components on different screen sizes and orientations

## Barrierefreiheit (WCAG AAA)

- Ensure sufficient color contrast according to WCAG AAA standards (7:1 for normal text)
- Implement focus indicators for all interactive elements (3px solid borders)
- Use semantic classes to support the HTML structure
- Ensure base font size is at least 18px for improved readability
- Implement proper line height (at least 1.8) for readability
- Support reduced motion preferences
- Provide alternative indicators beyond color
- Ensure touchpoints are at least 44x44px for mobile accessibility
- Avoid deep nesting

## CSS Variables and Design System

- **MANDATORY: Use CSS custom properties from global.css** - Never hardcode design values
- **Available root variables include:**
  - **Colors**: `--color-primary-*`, `--color-secondary-*`, `--color-neutral-*` (50-950 scale)
  - **Semantic colors**: `--bg-primary`, `--bg-secondary`, `--text-primary`, `--text-secondary`,
    `--border-primary`, etc.
  - **Interactive colors**: `--interactive-primary`, `--interactive-primary-hover`,
    `--interactive-primary-active`
  - **Component colors**: `--btn-primary-bg`, `--card-bg`, `--form-bg`, etc.
  - **Spacing**: `--space-xs` (4px) to `--space-3xl` (64px)
  - **Typography**: `--text-xs` (12px) to `--text-4xl` (36px), `--font-normal` to `--font-bold`
  - **Border radius**: `--radius-sm` (6px) to `--radius-full` (9999px)
  - **Shadows**: `--shadow-sm` to `--shadow-xl`
  - **Transitions**: `--transition-fast`, `--transition-normal`, `--transition-slow`
  - **Z-index**: `--z-dropdown` to `--z-notification`
  - **Focus system**: `--focus-ring`, `--focus-outline`
- **Example usage**: `color: var(--text-primary);` instead of `color: #ffffff;`

## Code Deduplication Requirements

- **ALWAYS check for existing CSS patterns** before creating new styles
- **Reuse existing component classes** from the global design system
- **Extract common patterns** into utility classes when used multiple times
- **Use existing layout utilities** like `.container`, `.grid-responsive`
- **Follow established naming conventions** to prevent style conflicts
- **Consolidate similar selectors** using CSS grouping and `:is()` pseudo-class

## CSS Structure

- Organize CSS with logical sections
- Use BEM (Block-Element-Modifier) methodology for class names
- Keep specificity low
- Avoid deep nesting
- Follow a consistent naming convention
- Group related properties
- Use comments to document complex sections

## Example of Typical Implementation

```html
<!-- Preferred: BEM structured CSS classes with root variables -->
<div class="component">
  <h2 class="component__title">Component Title</h2>
  <p class="component__text">
    Component text with <span class="component__text--highlighted">highlighted</span> part.
  </p>
</div>

<!-- With corresponding CSS using root variables -->
<style>
  .component {
    margin-bottom: var(--space-lg);
    padding: var(--space-md);
    background-color: var(--card-bg);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    transition: box-shadow var(--transition-normal);
  }

  .component:hover {
    box-shadow: var(--shadow-lg);
  }

  .component__title {
    margin-bottom: var(--space-md);
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    color: var(--text-primary);
  }

  .component__text {
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--text-secondary);
  }

  .component__text--highlighted {
    padding: var(--space-xs) var(--space-sm);
    background-color: var(--interactive-primary);
    color: var(--btn-primary-text);
    border-radius: var(--radius-sm);
  }

  /* Dark/light mode automatically handled by semantic variables */
</style>
```

```html
<!-- Preferred: BEM structured CSS classes -->
<div class="component">
  <h2 class="component__title">Component Title</h2>
  <p class="component__text">
    Component text with <span class="component__text--highlighted">highlighted</span> part.
  </p>
</div>

<!-- With corresponding CSS -->
<style>
  .component {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: var(--color-purple-100);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;
  }

  .component:hover {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  .component__title {
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-purple-800);
  }

  .component__text {
    color: var(--color-gray-700);
  }

  .component__text--highlighted {
    font-weight: 600;
  }

  @media (prefers-color-scheme: dark) {
    .component {
      background-color: var(--color-purple-900);
    }

    .component__title {
      color: var(--color-purple-200);
    }

    .component__text {
      color: var(--color-gray-300);
    }
  }
</style>
```

## Advanced Examples

### Responsive Grid with CSS

```html
<div class="card-grid">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
</div>

<style>
  .card-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .card {
    padding: 1rem;
    background-color: var(--color-purple-100);
    border-radius: 0.5rem;
  }

  @media (min-width: 640px) {
    .card-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 768px) {
    .card-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .card-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (prefers-color-scheme: dark) {
    .card {
      background-color: var(--color-purple-900);
    }
  }
</style>
```

### Accessible Form Input with CSS

```html
<div class="form-field">
  <label for="email" class="form-field__label"> Email Address </label>
  <input
    id="email"
    type="email"
    autocomplete="email"
    required
    class="form-field__input"
    placeholder="your.email@example.com"
    aria-describedby="email-hint"
  />
  <p id="email-hint" class="form-field__hint">We'll never share your email with anyone else.</p>
</div>

<style>
  .form-field {
    margin-bottom: 1rem;
  }

  .form-field__label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--color-gray-900);
  }

  .form-field__input {
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: var(--color-white);
    border: 1px solid var(--color-gray-300);
    border-radius: 0.5rem;
    color: var(--color-gray-900);
    font-size: 1rem;
  }

  .form-field__input::placeholder {
    color: var(--color-gray-400);
  }

  .form-field__input:focus {
    outline: none;
    border-color: var(--color-purple-500);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
  }

  .form-field__hint {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-gray-600);
  }

  @media (prefers-color-scheme: dark) {
    .form-field__label {
      color: var(--color-gray-100);
    }

    .form-field__input {
      background-color: var(--color-gray-800);
      border-color: var(--color-gray-700);
      color: var(--color-gray-100);
    }

    .form-field__input::placeholder {
      color: var(--color-gray-500);
    }

    .form-field__hint {
      color: var(--color-gray-400);
    }
  }
</style>
```

## Performance

- Minimize unnecessary animations and transition effects
- Prefer CSS solutions over JavaScript for visual effects
- Use modern CSS features like Grid and Flexbox for layouts
- Implement responsive images with srcset and sizes attributes
- Leverage container queries for component-specific responsiveness
- Use CSS will-change property sparingly and only when needed
- Consider print styles for optimal printing experience
- Minimize the number of CSS files to reduce HTTP requests
- Use efficient selectors to improve rendering performance

## Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001s !important;
    scroll-behavior: auto !important;
  }

  .question-transition,
  .category-card-hover {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

## ARIA Implementation Example

```html
<nav aria-label="Music categories">
  <ul role="list" class="category-list">
    <li>
      <a
        href="/categories/rock"
        class="category-list__item"
        aria-current={currentCategory === 'rock' ? 'page' : undefined}
      >
        <span class="sr-only">Category: </span>Rock
      </a>
    </li>
    <!-- Other categories -->
  </ul>
</nav>

<style>
  .category-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .category-list__item {
    display: block;
    padding: 1rem;
    background-color: var(--color-purple-800);
    color: var(--color-white);
    border-radius: 0.5rem;
    text-decoration: none;
  }

  .category-list__item:hover {
    background-color: var(--color-purple-700);
  }

  .category-list__item:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-purple-500);
  }

  .category-list__item[aria-current="page"] {
    background-color: var(--color-purple-600);
    font-weight: bold;
  }

  @media (min-width: 768px) {
    .category-list {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .category-list {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
```

## Modern Context7-Optimized Implementation

This example incorporates all the latest Context7 optimizations:

```html
<div
  class="game-container"
  role="region"
  aria-labelledby="game-title"
>
  <!-- Game title with proper heading level -->
  <h1
    id="game-title"
    class="game-title"
  >
    Music Trivia Challenge
  </h1>

  <!-- Sidebar with stats -->
  <div
    class="game-sidebar"
    role="complementary"
    aria-label="Game statistics"
  >
    <!-- Score display with proper text contrast -->
    <div class="score-display">
      <h2 class="score-display__title">Score</h2>
      <p class="score-display__value">
        {score}
        <span class="sr-only">points</span>
      </p>
    </div>

    <!-- Timer with visual and text indicators -->
    <div
      class="timer"
      role="timer"
      aria-label="Question timer"
      aria-live="polite"
    >
      <h2 class="timer__title">Time</h2>
      <div class="timer__bar">
        <div
          class="timer__progress"
          style={`width: ${timePercentage}%`}
        ></div>
      </div>
      <p class="sr-only">{timeLeft} seconds remaining</p>
    </div>

    <!-- Joker button with proper accessibility -->
    <button
      type="button"
      class="joker-button"
      aria-pressed={jokerUsed ? 'true' : 'false'}
      disabled={jokerUsed || !canUseJoker}
      onClick={activateJoker}
    >
      Use 50:50 Joker
      <span class="sr-only">
        {jokerUsed ? 'Joker already used' : 'Eliminates two wrong answers'}
      </span>
    </button>
  </div>

  <!-- Main question area -->
  <div
    class="question-area"
    aria-live="polite"
  >
    <div role="status" class="sr-only">Question {currentQuestionIndex + 1} of {totalQuestions}</div>

    <!-- Question text with proper contrast -->
    <h2
      id="current-question"
      class="question-title"
    >
      {currentQuestion.text}
    </h2>

    <!-- Answer options as a proper group -->
    <div
      class="answer-options"
      role="radiogroup"
      aria-labelledby="current-question"
    >
      {currentQuestion.options.map((option, index) => (
        <button
          type="button"
          role="radio"
          aria-checked={selectedAnswer === index ? 'true' : 'false'}
          class={`answer-option ${getAnswerStateClass(index)}`}
          onClick={() => selectAnswer(index)}
          disabled={answerSubmitted}
        >
          <span class="answer-option__text">{option}</span>
        </button>
      ))}
    </div>

    <!-- Next button with proper states -->
    <div class="question-navigation">
      <button
        type="button"
        class="next-button"
        disabled={!answerSubmitted && !timeExpired}
        onClick={nextQuestion}
      >
        Next Question
      </button>
    </div>
  </div>
</div>

<style>
  /* Game container layout */
  .game-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1rem;
  }

  /* Game title styling */
  .game-title {
    grid-column: 1 / -1;
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--color-purple-800);
    margin-bottom: 1rem;
  }

  /* Sidebar styling */
  .game-sidebar {
    background-color: var(--color-white);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1rem;
  }

  /* Score display */
  .score-display {
    margin-bottom: 1rem;
  }

  .score-display__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-gray-900);
  }

  .score-display__value {
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--color-purple-700);
  }

  /* Timer styling */
  .timer {
    margin-bottom: 1rem;
  }

  .timer__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-gray-900);
  }

  .timer__bar {
    width: 100%;
    height: 1rem;
    background-color: var(--color-gray-200);
    border-radius: 9999px;
  }

  .timer__progress {
    height: 100%;
    background-color: var(--color-purple-600);
    border-radius: 9999px;
    transition: width 0.3s;
  }

  /* Joker button */
  .joker-button {
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: var(--color-pink-600);
    color: var(--color-white);
    font-weight: 600;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .joker-button:hover:not(:disabled) {
    background-color: var(--color-pink-700);
  }

  .joker-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-pink-500);
  }

  .joker-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Question area */
  .question-area {
    background-color: var(--color-white);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1rem;
  }

  /* Question title */
  .question-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-gray-900);
    margin-bottom: 1.5rem;
  }

  /* Answer options */
  .answer-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .answer-option {
    width: 100%;
    text-align: left;
    padding: 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--color-gray-100);
    color: var(--color-gray-900);
    transition: background-color 0.3s;
    cursor: pointer;
  }

  .answer-option:hover:not(:disabled) {
    background-color: var(--color-gray-200);
  }

  .answer-option:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-purple-500);
  }

  .answer-option[aria-checked="true"] {
    background-color: var(--color-purple-100);
    border: 2px solid var(--color-purple-500);
  }

  .answer-option.correct {
    background-color: var(--color-green-100);
    border: 2px solid var(--color-green-500);
  }

  .answer-option.incorrect {
    background-color: var(--color-red-100);
    border: 2px solid var(--color-red-500);
  }

  .answer-option:disabled {
    cursor: default;
  }

  .answer-option__text {
    font-weight: 500;
  }

  /* Navigation */
  .question-navigation {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
  }

  .next-button {
    padding: 0.75rem 1.5rem;
    background-color: var(--color-purple-600);
    color: var(--color-white);
    font-weight: 600;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .next-button:hover:not(:disabled) {
    background-color: var(--color-purple-700);
  }

  .next-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-purple-500);
  }

  .next-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Screen reader only class */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Responsive layout */
  @media (min-width: 768px) {
    .game-container {
      grid-template-columns: 30% 70%;
      padding: 1.5rem;
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .game-title {
      color: var(--color-purple-200);
    }

    .game-sidebar,
    .question-area {
      background-color: var(--color-gray-800);
    }

    .score-display__title,
    .timer__title {
      color: var(--color-gray-100);
    }

    .score-display__value {
      color: var(--color-purple-300);
    }

    .timer__bar {
      background-color: var(--color-gray-700);
    }

    .question-title {
      color: var(--color-gray-100);
    }

    .answer-option {
      background-color: var(--color-gray-700);
      color: var(--color-gray-100);
    }

    .answer-option:hover:not(:disabled) {
      background-color: var(--color-gray-600);
    }

    .answer-option[aria-checked="true"] {
      background-color: var(--color-purple-900);
    }

    .answer-option.correct {
      background-color: var(--color-green-900);
    }

    .answer-option.incorrect {
      background-color: var(--color-red-900);
    }
  }
</style>
```
