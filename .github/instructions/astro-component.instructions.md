---
applyTo: "**/*.astro"
---

# Astro Component Standards

These instructions apply to all Astro components in the MelodyMind project.

## Component Structure

- Use a consistent file structure across all components
- Clearly separate the frontmatter script from the template
- Group imports, props, helper functions, and reactive variables
- Add JSDoc comments to all components
- Define props with TypeScript interfaces

## Example of a component structure:

```astro
---
/**
 * @component ComponentName
 * @description Brief description of the component
 */

// 1. Imports
import { type ComponentProps } from "astro";
import OtherComponent from "./OtherComponent.astro";

// 2. Props definition
interface Props {
  /** Description of the prop */
  title: string;
  /** Description of the prop */
  items: string[];
  /** Description of the prop */
  isActive?: boolean;
}

// 3. Props processing
const { title, items, isActive = false } = Astro.props;

// 4. Reactive variables and helper functions
const formattedTitle = title.toUpperCase();
---

<!-- 5. Component template with semantic HTML -->
<section class="component-container">
  <h2>{formattedTitle}</h2>

  <ul role="list">
    {items.map((item) => <li class:list={[{ active: isActive }]}>{item}</li>)}
  </ul>

  <OtherComponent />
</section>

<!-- 6. Component styles with CSS -->
<style>
  .component-container {
    border-radius: 0.5rem;
    background-color: #f3f4f6;
    padding: 1rem;
  }

  :global(.dark) .component-container {
    background-color: #1f2937;
  }

  .active {
    font-weight: bold;
    color: #8b5cf6;
  }
</style>
```

## Islands Architecture

- Use Astro Islands for interactive components
- Keep client-side execution minimal
- Choose `client:*` directives strategically:
  - `client:load` - Loaded immediately
  - `client:idle` - After page load
  - `client:visible` - When visible in viewport
  - `client:media` - Based on media queries
  - `client:only` - Only for client-side components
- Use `server:defer` for Server Islands (parallelized server components)
- Add fallback content with `slot="fallback"` for Server Islands
- Use `transition:persist` for state preservation between page transitions

Example:

```astro
<div class="game-controls">
  <!-- Loads immediately when page loads -->
  <GameControl client:load />

  <!-- Loads only when scrolled into view, with fallback -->
  <LeaderBoard server:defer>
    <LoadingSpinner slot="fallback" />
  </LeaderBoard>

  <!-- Maintains state during navigation -->
  <SoundSettings client:load transition:persist />
</div>

<style>
  .game-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 2rem 0;
  }
</style>
```

## Accessibility

- Use semantic HTML elements (section, article, nav, etc.)
- Add appropriate ARIA attributes where needed
- Ensure color contrasts meet WCAG AAA standards (7:1 for normal text, 4.5:1 for large text)
- Support keyboard navigation for all interactive elements
- Provide visual focus indicators for all interactive elements
- Implement appropriate text alternatives for non-text content
- Ensure a logical tab order for all interactive elements
- Test components with screen readers

Example:

```astro
<nav aria-label="Main navigation">
  <ul>
    {
      navigationItems.map((item) => (
        <li>
          <a href={item.url} class="nav-link" aria-current={item.isCurrent ? "page" : undefined}>
            {item.label}
          </a>
        </li>
      ))
    }
  </ul>
</nav>

<style>
  nav {
    background-color: #581c87; /* purple-900 */
    padding: 1rem;
  }

  ul {
    display: flex;
    gap: 1rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-link {
    border-radius: 0.375rem;
    color: white;
    display: block;
    padding: 0.5rem 0.75rem;
    text-decoration: none;
  }

  .nav-link:hover {
    color: #e9d5ff; /* purple-200 */
  }

  .nav-link:focus {
    outline: none;
    box-shadow: 0 0 0 2px #c4b5fd; /* purple-300 */
  }
</style>
```

## Performance

- Optimize rendering paths (SSG vs. SSR)
- Use Astro features like `<Fragment>` and `set:html` judiciously
- Use dynamic imports for large components
- Minimize JavaScript usage with preference for HTML and CSS
- Implement responsive images with `<Image>` and `<Picture>` components
- Use the `layout` attribute for optimized images (`layout="constrained"`, `layout="full-width"`,
  `layout="none"`)
- Use modern image formats (WebP, AVIF) with the `formats` attribute
- Implement state sharing between islands with Nano Stores or Context API
- Optimize performance for page transitions with `<ViewTransitions />`

Example:

```astro
---
import { Image } from "astro:assets";
import albumCover from "../assets/images/album-cover.jpg";
---

<div class="album-display">
  <!-- Responsive image with WebP/AVIF formats -->
  <Image
    src={albumCover}
    alt="Album cover for Dark Side of the Moon"
    width={800}
    height={800}
    class="album-cover"
    layout="constrained"
    formats={["avif", "webp"]}
  />

  <!-- Minimal JavaScript usage -->
  <div class="album-info">
    <h2>Dark Side of the Moon</h2>
    <p class="album-meta">Pink Floyd • 1973</p>
  </div>
</div>

<style>
  .album-display {
    margin-bottom: 2rem;
  }

  .album-cover {
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
  }

  .album-cover:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  .album-info {
    background-color: #1f2937; /* gray-800 */
    border-radius: 0.375rem;
    color: white;
    margin-top: 1rem;
    padding: 1rem;
  }

  .album-info h2 {
    font-size: 1.25rem;
    font-weight: bold;
    letter-spacing: -0.025em;
    margin: 0 0 0.5rem 0;
  }

  .album-meta {
    color: #d1d5db; /* gray-300 */
    font-size: 0.875rem;
    margin: 0;
  }
</style>
```

## Advanced Component Patterns

- Implement nested layouts for complex page structures
- Use slots and named slots for flexible component composition
- Use environment variables via `import.meta.env` for configurable components
- Integrate Server-Side Rendering (SSR) for dynamic data when needed
- Access cookies with `Astro.cookies` in server components
- Use `Astro.locals` for data exchange between middleware and components
- Implement type-safe props with TypeScript interfaces
- Use Error Boundaries for robust error handling

Example:

```astro
---
// src/components/GameCard.astro
interface Props {
  /** The game difficulty level */
  difficulty: "easy" | "medium" | "hard";
  /** Number of questions in the game */
  questionCount: number;
  /** The game genre/category */
  genre: string;
  /** Whether the game is currently active */
  isActive?: boolean;
}

const { difficulty, questionCount, genre, isActive = false } = Astro.props;

// Access environment variables
const apiEndpoint = import.meta.env.PUBLIC_API_ENDPOINT;
---

<div class={`game-card ${isActive ? "active" : ""}`}>
  <div class="card-header">
    <h3>{genre}</h3>
    <span class={`difficulty-badge difficulty-${difficulty}`}>
      {difficulty}
    </span>
  </div>

  <p class="question-count">Contains {questionCount} questions</p>

  <div class="actions-container">
    <slot name="actions" />
  </div>

  <!-- Named slot with fallback content -->
  <div class="footer">
    <slot name="footer">
      <p>Play and earn points!</p>
    </slot>
  </div>
</div>

<style>
  .game-card {
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }

  .game-card.active {
    border: 2px solid #8b5cf6; /* purple-500 */
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .card-header h3 {
    color: #581c87; /* purple-900 */
    font-size: 1.25rem;
    font-weight: bold;
    margin: 0;
  }

  .difficulty-badge {
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.25rem 0.75rem;
  }

  .difficulty-easy {
    background-color: #dcfce7; /* green-100 */
    color: #166534; /* green-800 */
  }

  .difficulty-medium {
    background-color: #fef9c3; /* yellow-100 */
    color: #854d0e; /* yellow-800 */
  }

  .difficulty-hard {
    background-color: #fee2e2; /* red-100 */
    color: #991b1b; /* red-800 */
  }

  .question-count {
    color: #374151; /* gray-700 */
    margin-bottom: 1rem;
  }

  .actions-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }

  .footer {
    color: #6b7280; /* gray-500 */
    font-size: 0.875rem;
    margin-top: 1rem;
  }
</style>
```

## Modern Astro Practices

- Prefer modular, specific components over monolithic ones
- Implement progressive enhancement for JavaScript functionality
- Use partial hydration through the Islands architecture
- Use View Transitions API for seamless page transitions
- Leverage Content Collections for structured data
- Implement middleware for cross-route functionality
- Be mindful of build-time vs. runtime execution
- Conduct component testing with testing libraries

Example:

```astro
---
// src/components/QuizQuestion.astro
import Timer from "./Timer.astro";
import AnswerOption from "./AnswerOption.astro";
import { useJokerStore } from "../stores/joker";

interface Props {
  question: {
    id: string;
    text: string;
    options: string[];
    correctAnswerIndex: number;
  };
  timeLimit: number;
}

const { question, timeLimit } = Astro.props;
---

<div class="quiz-question">
  <div class="question-header">
    <h2>{question.text}</h2>

    <Timer class="timer" seconds={timeLimit} client:visible />
  </div>

  <div class="options-grid">
    {
      question.options.map((option, index) => (
        <AnswerOption
          text={option}
          index={index}
          isCorrect={index === question.correctAnswerIndex}
          questionId={question.id}
          client:visible
        />
      ))
    }
  </div>

  <div class="joker-container">
    <button id="joker-button" class="joker-button" client:load> Use 50:50 Joker </button>
  </div>
</div>

<style>
  .quiz-question {
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }

  :global(.dark) .quiz-question {
    background-color: #1f2937; /* gray-800 */
  }

  .question-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  h2 {
    color: #5b21b6; /* purple-800 */
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
  }

  :global(.dark) h2 {
    color: #c4b5fd; /* purple-300 */
  }

  .timer {
    background-color: #f3e8ff; /* purple-100 */
    border-radius: 0.5rem;
    color: #5b21b6; /* purple-800 */
    font-family: monospace;
    font-size: 1.125rem;
    padding: 0.5rem 1rem;
  }

  :global(.dark) .timer {
    background-color: #581c87; /* purple-900 */
    color: #e9d5ff; /* purple-200 */
  }

  .options-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;
    margin-top: 2rem;
  }

  @media (min-width: 768px) {
    .options-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .joker-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  .joker-button {
    background-color: #eab308; /* yellow-500 */
    border: none;
    border-radius: 0.5rem;
    color: white;
    cursor: pointer;
    font-medium: medium;
    padding: 0.5rem 1rem;
    transition: background-color 0.2s;
  }

  .joker-button:hover {
    background-color: #ca8a04; /* yellow-600 */
  }

  .joker-button:focus {
    box-shadow: 0 0 0 2px #fef08a; /* yellow-300 */
    outline: none;
  }
</style>

<script>
  // Progressive enhancement - joker functionality only works when JS is enabled
  const jokerButton = document.getElementById("joker-button");
  const options = document.querySelectorAll(".answer-option");

  if (jokerButton) {
    jokerButton.addEventListener("click", () => {
      const store = useJokerStore();
      if (store.jokersLeft > 0) {
        store.useJoker();
        // Implementation of 50:50 joker logic
      }
    });
  }
</script>
```

## CSS Styling Best Practices

- Use component-scoped CSS with the `<style>` tag in Astro components
- Create clear, semantic class names that describe the purpose of the element
- Use CSS variables for theming and consistent values across components
- Implement responsive design with media queries
- Use the `:global()` selector for styling elements that are passed via slots
- Create a consistent design system with reusable CSS properties
- Implement dark mode with a global `.dark` class and appropriate selectors
- Use CSS Grid and Flexbox for layout rather than complex positioning
- Implement CSS transitions for smooth state changes
- Follow a consistent naming convention for CSS classes

Example:

```astro
---
const { score, maxScore, level } = Astro.props;
const percentage = Math.round((score / maxScore) * 100);
const isHighScore = percentage > 80;
---

<div class="score-display">
  <!-- Sized container with responsive adjustments -->
  <div class="container">
    <!-- Score display with conditional styling -->
    <div class={`score-card ${isHighScore ? "high-score" : "normal-score"}`}>
      <h3>Your Score</h3>
      <div class="score-value">{score}/{maxScore}</div>
      <div class="level-indicator">Level: {level}</div>
    </div>

    <!-- Progress bar with dynamic width -->
    <div class="progress-container">
      <div
        class="progress-bar"
        style={`width: ${percentage}%`}
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
        role="progressbar"
      >
      </div>
    </div>

    <!-- Responsive button layout -->
    <div class="button-container">
      <button class="primary-button"> Play Again </button>

      <button class="secondary-button"> Share Results </button>
    </div>
  </div>
</div>

<style>
  /* Component container */
  .score-display {
    background: linear-gradient(to bottom right, #f5f3ff, #fce7f3);
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
  }

  :global(.dark) .score-display {
    background: linear-gradient(to bottom right, #581c87, #831843);
  }

  /* Responsive container */
  .container {
    margin: 0 auto;
    max-width: 28rem;
    width: 100%;
  }

  @media (min-width: 640px) {
    .container {
      width: 75%;
    }
  }

  @media (min-width: 768px) {
    .container {
      width: 50%;
    }
  }

  /* Score card styling */
  .score-card {
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    text-align: center;
  }

  .high-score {
    background-color: #dcfce7;
    color: #166534;
  }

  :global(.dark) .high-score {
    background-color: #14532d;
    color: #86efac;
  }

  .normal-score {
    background-color: #dbeafe;
    color: #1e40af;
  }

  :global(.dark) .normal-score {
    background-color: #1e3a8a;
    color: #93c5fd;
  }

  .score-card h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .score-value {
    font-size: 2.25rem;
    font-weight: 800;
  }

  .level-indicator {
    font-size: 0.875rem;
    margin-top: 0.25rem;
    opacity: 0.75;
  }

  /* Progress bar */
  .progress-container {
    background-color: #e5e7eb;
    border-radius: 9999px;
    height: 1rem;
    margin-bottom: 1.5rem;
    width: 100%;
  }

  :global(.dark) .progress-container {
    background-color: #374151;
  }

  .progress-bar {
    background-color: #8b5cf6;
    border-radius: 9999px;
    height: 100%;
    transition: width 1s ease-out;
  }

  :global(.dark) .progress-bar {
    background-color: #a78bfa;
  }

  /* Button layout */
  .button-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
  }

  @media (min-width: 640px) {
    .button-container {
      flex-direction: row;
    }
  }

  /* Button styles */
  .primary-button,
  .secondary-button {
    border-radius: 0.5rem;
    font-weight: 500;
    padding: 0.75rem 1.5rem;
    transition: all 0.2s;
  }

  .primary-button {
    background-color: #8b5cf6;
    border: none;
    color: white;
  }

  .primary-button:hover {
    background-color: #7c3aed;
  }

  .primary-button:focus {
    box-shadow: 0 0 0 2px #c4b5fd;
    outline: none;
  }

  .primary-button:active {
    background-color: #6d28d9;
  }

  .secondary-button {
    background-color: transparent;
    border: 2px solid #8b5cf6;
    color: #8b5cf6;
  }

  .secondary-button:hover {
    background-color: #f5f3ff;
  }

  :global(.dark) .secondary-button {
    color: #c4b5fd;
    border-color: #c4b5fd;
  }

  :global(.dark) .secondary-button:hover {
    background-color: #4c1d95;
  }

  .secondary-button:focus {
    box-shadow: 0 0 0 2px #c4b5fd;
    outline: none;
  }

  .secondary-button:active {
    background-color: #f5f3ff;
  }

  :global(.dark) .secondary-button:active {
    background-color: #5b21b6;
  }
</style>
```

## Icon Usage with astro-icon

- Always use the `astro-icon` package for all icon needs, avoid direct SVG usage
- Store project-specific icons in the `/src/icons/` directory
- Use consistent sizing and styling for icons across the application
- Ensure icons have proper accessibility attributes
- Leverage Tailwind classes for icon styling and positioning

### Why use astro-icon?

- **Optimization**: Icons are automatically optimized at build time
- **Consistency**: Creates uniform icon implementation across the project
- **Accessibility**: Makes it easier to implement accessible icon patterns
- **Performance**: Icons load only when needed and can be cached efficiently
- **Maintainability**: Simplified icon management with a central repository

### Implementation Example:

```astro
---
import { Icon } from "astro-icon/components";
---

<!-- Basic icon usage -->
<Icon name="music-note" class="icon" />

<!-- Icon with accessibility improvements -->
<button aria-label="Play music">
  <Icon name="play" class="icon-small" aria-hidden="true" />
</button>

<!-- Responsive icon sizing -->
<Icon name="share" class="icon-responsive" />

<!-- Animated icon -->
<Icon name="loader" class="icon-loader" />

<!-- Icon with conditional styling -->
<Icon name="star" class={`icon-medium ${isActive ? "icon-active" : "icon-inactive"}`} />

<style>
  .icon {
    height: 1.5rem;
    width: 1.5rem;
    color: #8b5cf6; /* purple-600 */
  }

  .icon-small {
    height: 1.25rem;
    width: 1.25rem;
    color: white;
  }

  .icon-medium {
    height: 1.5rem;
    width: 1.5rem;
  }

  .icon-responsive {
    color: #3b82f6; /* blue-500 */
    height: 1rem;
    width: 1rem;
    transition: color 0.2s;
  }

  .icon-responsive:hover {
    color: #1d4ed8; /* blue-700 */
  }

  @media (min-width: 640px) {
    .icon-responsive {
      height: 1.25rem;
      width: 1.25rem;
    }
  }

  @media (min-width: 768px) {
    .icon-responsive {
      height: 1.5rem;
      width: 1.5rem;
    }
  }

  .icon-loader {
    animation: spin 1s linear infinite;
    color: #8b5cf6; /* purple-600 */
    height: 2rem;
    width: 2rem;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .icon-active {
    color: #eab308; /* yellow-500 */
  }

  .icon-inactive {
    color: #9ca3af; /* gray-400 */
  }
</style>
```

### Best Practices:

1. **Import Correctly**:

   ```astro
   import {Icon} from "astro-icon/components";
   ```

2. **Icon Naming**:

   - Use kebab-case for icon names (e.g., `music-note`, `arrow-right`)
   - Be descriptive but concise
   - Group related icons with prefixes (e.g., `social-twitter`, `social-facebook`)

3. **Accessibility**:

   - Add `aria-hidden="true"` to decorative icons
   - Always include text or `aria-label` for interactive icons
   - Use proper color contrast (WCAG AAA)

4. **Performance**:

   - Avoid excessively large icons
   - Use the smallest icon that maintains visual clarity
   - Consider lazy-loading icons below the fold

5. **Styling**:
   - Create reusable classes for common icon sizes and colors
   - Maintain consistent sizing within similar UI components
   - Apply transitions for hover/active states when appropriate

### Icon Organization:

- `/src/icons/`: Project-specific custom SVG icons
- `astro-icon` automatically includes multiple icon sets
- Document any custom icon usage patterns for the team
