---
applyTo: "**/*.{css,scss,astro}"
---

# Styling Standards for MelodyMind

These instructions apply to all CSS and SCSS files in the MelodyMind project, incorporating Context7
optimizations and the latest standards.

## General Guidelines

- Use Tailwind CSS for all styling needs
- Prioritize Tailwind utility classes over custom CSS
- Follow Tailwind's utility-first workflow
- Use a consistent color scheme through Tailwind's configuration (purple, pink, dark background)
- Leverage component organization for a more maintainable codebase
- Support both light and dark themes with proper contrast in each mode

## Responsive Design

- Implement responsive design with Tailwind's responsive modifiers:
  - `sm:` - from 640px
  - `md:` - from 768px
  - `lg:` - from 1024px
  - `xl:` - from 1280px
  - `2xl:` - from 1536px
- Implement container queries for component-specific responsiveness
- Use modern layout techniques (Grid, Flexbox, subgrid)
- Test all components on different screen sizes and orientations

## Accessibility (WCAG AAA)

- Ensure sufficient color contrast according to WCAG AAA standards (7:1 for normal text)
- Implement focus indicators for all interactive elements (3px solid borders)
- Use semantic classes to support the HTML structure
- Ensure base font size is at least 18px for improved readability
- Implement proper line height (at least 1.8) for readability
- Support reduced motion preferences
- Provide alternative indicators beyond color
- Ensure touchpoints are at least 44x44px for mobile accessibility
- Avoid deep nesting

## Modern CSS Features

- Use CSS custom properties for maintaining design tokens
- Leverage CSS Grid for two-dimensional layouts
- Utilize Flexbox for one-dimensional layouts
- Implement container queries for component-specific responsive behavior
- Apply CSS logical properties for better internationalization support
- Use modern selectors like `:is()` and `:where()` to reduce specificity
- Implement CSS subgrid for nested grid alignment

## Tailwind Best Practices

- Use `@apply` only when absolutely necessary for complex components
- Extend the Tailwind theme in `tailwind.config.js` rather than using custom values
- Use Tailwind's dark mode utilities for theming
- Use Tailwind's transition utilities for animations
- Leverage Tailwind's JIT (Just-In-Time) mode for development
- Integrate Tailwind plugins only when needed for specific functionality
- Ensure PurgeCSS is properly configured to eliminate unused styles

## CSS Structure (when not using Tailwind)

- Organize CSS with logical sections
- Use BEM (Block-Element-Modifier) methodology for class names
- Keep specificity low
- Avoid deep nesting

## Example of Typical Implementation

```html
<!-- Preferred: Tailwind utility classes -->
<div
  class="mb-6 rounded-lg bg-purple-100 p-4 shadow-md transition-shadow hover:shadow-lg dark:bg-purple-900"
>
  <h2 class="mb-2 text-xl font-bold text-purple-800 dark:text-purple-200">Component Title</h2>
  <p class="text-gray-700 dark:text-gray-300">
    Component text with <span class="font-semibold">highlighted</span> part.
  </p>
</div>

<!-- Avoid: Custom CSS classes -->
<div class="custom-component">
  <h2 class="component-title">Component Title</h2>
  <p class="component-text">Component text with <span class="highlight">highlighted</span> part.</p>
</div>
```

## Advanced Examples

### Responsive Grid with Tailwind

```html
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  <div class="rounded-lg bg-purple-100 p-4 dark:bg-purple-900">Card 1</div>
  <div class="rounded-lg bg-purple-100 p-4 dark:bg-purple-900">Card 2</div>
  <div class="rounded-lg bg-purple-100 p-4 dark:bg-purple-900">Card 3</div>
  <div class="rounded-lg bg-purple-100 p-4 dark:bg-purple-900">Card 4</div>
</div>
```

### Accessible Form Input with Tailwind

```html
<div class="mb-4">
  <label for="email" class="mb-2 block text-lg font-medium text-gray-900 dark:text-gray-100">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    autocomplete="email"
    required
    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-3 focus:ring-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
    placeholder="your.email@example.com"
    aria-describedby="email-hint"
  />
  <p id="email-hint" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
    We'll never share your email with anyone else.
  </p>
</div>
```

## Performance

- Optimize Tailwind's output with proper PurgeCSS configuration
- Minimize unnecessary animations and transition effects
- Prefer CSS solutions over JavaScript for visual effects
- Use modern CSS features like Grid and Flexbox for layouts
- Implement responsive images with srcset and sizes attributes
- Leverage container queries for component-specific responsiveness
- Use CSS will-change property sparingly and only when needed
- Consider print styles for optimal printing experience

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
  <ul role="list" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <li>
      <a
        href="/categories/rock"
        class="block p-4 bg-purple-800 hover:bg-purple-700 text-white rounded-lg
               focus:outline-none focus:ring-3 focus:ring-purple-500"
        aria-current={currentCategory === 'rock' ? 'page' : undefined}
      >
        <span class="sr-only">Category: </span>Rock
      </a>
    </li>
    <!-- Other categories -->
  </ul>
</nav>
```

## Modern Context7-Optimized Implementation

This example incorporates all the latest Context7 optimizations:

```html
<div
  class="game-container grid grid-cols-1 md:grid-cols-[30%_70%] gap-6 p-4 md:p-6"
  role="region"
  aria-labelledby="game-title"
>
  <!-- Game title with proper heading level -->
  <h1
    id="game-title"
    class="col-span-full text-3xl font-bold text-purple-800 dark:text-purple-200 mb-4"
  >
    Music Trivia Challenge
  </h1>

  <!-- Sidebar with stats -->
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
    role="complementary"
    aria-label="Game statistics"
  >
    <!-- Score display with proper text contrast -->
    <div class="mb-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Score</h2>
      <p class="text-3xl font-bold text-purple-700 dark:text-purple-300">
        {score}
        <span class="sr-only">points</span>
      </p>
    </div>

    <!-- Timer with visual and text indicators -->
    <div
      role="timer"
      aria-label="Question timer"
      aria-live="polite"
      class="mb-4"
    >
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Time</h2>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
        <div
          class="bg-purple-600 h-4 rounded-full transition-all"
          style={`width: ${timePercentage}%`}
        ></div>
      </div>
      <p class="sr-only">{timeLeft} seconds remaining</p>
    </div>

    <!-- Joker button with proper accessibility -->
    <button
      type="button"
      class="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700
             text-white font-semibold rounded-lg
             focus:outline-none focus:ring-3 focus:ring-pink-500 focus:ring-offset-2
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-colors"
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
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
    aria-live="polite"
  >
    <div role="status" class="sr-only">Question {currentQuestionIndex + 1} of {totalQuestions}</div>

    <!-- Question text with proper contrast -->
    <h2
      id="current-question"
      class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6"
    >
      {currentQuestion.text}
    </h2>

    <!-- Answer options as a proper group -->
    <div
      role="radiogroup"
      aria-labelledby="current-question"
      class="space-y-3"
    >
      {currentQuestion.options.map((option, index) => (
        <button
          type="button"
          role="radio"
          aria-checked={selectedAnswer === index ? 'true' : 'false'}
          class={`w-full text-left p-4 rounded-lg transition-colors
                 focus:outline-none focus:ring-3 focus:ring-purple-500
                 ${getBgColorClass(index)}`}
          onClick={() => selectAnswer(index)}
          disabled={answerSubmitted}
        >
          <span class="font-medium">{option}</span>
        </button>
      ))}
    </div>

    <!-- Next button with proper states -->
    <div class="mt-8 flex justify-end">
      <button
        type="button"
        class="py-3 px-6 bg-purple-600 hover:bg-purple-700
               text-white font-semibold rounded-lg
               focus:outline-none focus:ring-3 focus:ring-purple-500 focus:ring-offset-2
               disabled:opacity-50 disabled:cursor-not-allowed
               transition-colors"
        disabled={!answerSubmitted && !timeExpired}
        onClick={nextQuestion}
      >
        Next Question
      </button>
    </div>
  </div>
</div>
```
