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

<!-- 6. Component styles with Tailwind -->
<style>
  .component-container {
    @apply p-4 rounded-lg bg-gray-100 dark:bg-gray-800;
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
  <ul class="flex gap-4 p-4 bg-purple-900">
    {
      navigationItems.map((item) => (
        <li>
          <a
            href={item.url}
            class="text-white hover:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 px-3 py-2 rounded-md"
            aria-current={item.isCurrent ? "page" : undefined}
          >
            {item.label}
          </a>
        </li>
      ))
    }
  </ul>
</nav>
```

## Performance

- Optimize rendering paths (SSG vs. SSR)
- Use Astro features like `<Fragment>` and `set:html` judiciously
- Use dynamic imports for large components
- Minimize JavaScript usage with preference for HTML and CSS
- Implement responsive images with `<Image>` and `<Picture>` components
- Use the `layout` attribute for optimized images (`layout="constrained"`, `layout="full-width"`, `layout="none"`)
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
    class="rounded-lg shadow-lg hover:shadow-xl transition-shadow"
    layout="constrained"
    formats={["avif", "webp"]}
  />

  <!-- Minimal JavaScript usage -->
  <div class="album-info mt-4 p-4 bg-gray-800 rounded-md text-white">
    <h2 class="text-xl font-bold tracking-tight">Dark Side of the Moon</h2>
    <p class="text-gray-300 text-sm">Pink Floyd • 1973</p>
  </div>
</div>
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

<div
  class={`game-card p-6 rounded-xl shadow-md ${isActive ? "border-2 border-purple-500" : ""}`}
>
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-xl font-bold text-purple-900">{genre}</h3>
    <span
      class={`px-3 py-1 rounded-full text-sm font-medium
      ${
        difficulty === "easy"
          ? "bg-green-100 text-green-800"
          : difficulty === "medium"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
      }`}
    >
      {difficulty}
    </span>
  </div>

  <p class="text-gray-700 mb-4">Contains {questionCount} questions</p>

  <div class="mt-4 flex justify-end">
    <slot name="actions" />
  </div>

  <!-- Named slot with fallback content -->
  <div class="text-sm text-gray-500 mt-4">
    <slot name="footer">
      <p>Play and earn points!</p>
    </slot>
  </div>
</div>
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

<div class="quiz-question p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-purple-800 dark:text-purple-300">
      {question.text}
    </h2>

    <Timer
      class="text-lg font-mono bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-lg"
      seconds={timeLimit}
      client:visible
    />
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
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

  <div class="mt-8 flex justify-end">
    <button
      id="joker-button"
      class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-colors"
      client:load
    >
      Use 50:50 Joker
    </button>
  </div>
</div>

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

## Tailwind Usage Best Practices

- Use Tailwind utility classes directly in HTML elements
- Apply component-specific styles through Tailwind class composition
- Leverage Tailwind's responsive prefixes (sm:, md:, lg:, xl:, 2xl:)
- Use dark mode variants with dark: prefix for theme support
- Utilize state variants (hover:, focus:, active:, etc.) for interactive elements
- Group related utilities with appropriate spacing and line breaks
- Create logical class groupings: layout → spacing → sizing → typography → visual
- Use class:list directive for conditional classes
- Avoid @apply in <style> tags when possible
- Extract reusable patterns to components rather than custom CSS

Example:

```astro
---
const { score, maxScore, level } = Astro.props;
const percentage = Math.round((score / maxScore) * 100);
const isHighScore = percentage > 80;
---

<div
  class="score-display
  flex flex-col items-center p-6
  bg-gradient-to-br from-purple-50 to-pink-50
  dark:from-purple-900 dark:to-pink-900
  rounded-xl shadow-md"
>
  <!-- Sized container with responsive adjustments -->
  <div class="w-full sm:w-3/4 md:w-1/2 max-w-md mx-auto">
    <!-- Score display with conditional styling -->
    <div
      class={`
      text-center p-4 mb-6 rounded-lg
      ${
        isHighScore
          ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
          : "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100"
      }
    `}
    >
      <h3 class="text-xl font-bold mb-2">Your Score</h3>
      <div class="text-4xl font-extrabold">{score}/{maxScore}</div>
      <div class="text-sm mt-1 opacity-75">Level: {level}</div>
    </div>

    <!-- Progress bar with dynamic width -->
    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
      <div
        class="h-full rounded-full bg-purple-600 dark:bg-purple-400 transition-all duration-1000 ease-out"
        style={`width: ${percentage}%`}
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
        role="progressbar"
      >
      </div>
    </div>

    <!-- Responsive button layout -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center mt-6">
      <button
        class="px-6 py-3 rounded-lg
        bg-purple-600 hover:bg-purple-700 active:bg-purple-800
        focus:outline-none focus:ring-2 focus:ring-purple-300
        text-white font-medium
        transition-colors duration-200"
      >
        Play Again
      </button>

      <button
        class="px-6 py-3 rounded-lg
        bg-transparent hover:bg-purple-100 active:bg-purple-200
        dark:hover:bg-purple-800 dark:active:bg-purple-700
        border-2 border-purple-600
        text-purple-600 dark:text-purple-300 font-medium
        focus:outline-none focus:ring-2 focus:ring-purple-300
        transition-colors duration-200"
      >
        Share Results
      </button>
    </div>
  </div>
</div>
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
<Icon name="music-note" class="w-6 h-6 text-purple-600" />

<!-- Icon with accessibility improvements -->
<button aria-label="Play music">
  <Icon name="play" class="w-5 h-5 text-white" aria-hidden="true" />
</button>

<!-- Responsive icon sizing -->
<Icon
  name="share"
  class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-500 hover:text-blue-700 transition-colors"
/>

<!-- Animated icon -->
<Icon name="loader" class="w-8 h-8 text-purple-600 animate-spin" />

<!-- Icon with conditional styling -->
<Icon
  name="star"
  class={`w-6 h-6 ${isActive ? "text-yellow-500" : "text-gray-400"}`}
/>
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
   - Use Tailwind classes for size, color, and other properties
   - Maintain consistent sizing within similar UI components
   - Apply transitions for hover/active states when appropriate

### Icon Organization:

- `/src/icons/`: Project-specific custom SVG icons
- `astro-icon` automatically includes multiple icon sets
- Document any custom icon usage patterns for the team
