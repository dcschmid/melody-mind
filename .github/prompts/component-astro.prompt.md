# Generate Astro Component

Your goal is to generate a new Astro component for the MelodyMind music trivia game.

## Component Requirements

If not specified, ask for:

- Component name
- Purpose/functionality
- Props it should accept
- Whether it needs client-side interactivity
- Which pages or components will use this component

## Technical Requirements

- Follow Astro component structure with frontmatter script and template
- Use TypeScript for type safety
- Define a proper interface for component props
- Use Tailwind CSS for styling (no custom CSS)
- Ensure WCAG AAA accessibility compliance (7:1 contrast ratio)
- Add proper JSDoc comments
- Include semantic HTML elements
- Add appropriate ARIA attributes
- Support both light and dark mode with Tailwind

## Performance Considerations

- Keep components focused and minimal
- Avoid unnecessary client-side JavaScript
- Use Astro islands pattern for interactive components
- Consider mobile performance and responsive design
- Add appropriate loading strategies (eager/lazy)

## File Structure

````astro
---
// Import statements
import { type ComponentProps } from "../types";

/**
 * ComponentName - Brief description
 *
 * @component
 * @example
 * ```astro
 * <ComponentName propName="value" />
 * ```
 */

// Interface definition
interface Props {
  /** Description of this prop */
  propName: string;
  /** Optional prop with default value */
  optionalProp?: boolean;
}

// Get props and other logic
const { propName, optionalProp = false } = Astro.props;

// Any additional processing
const processedValue = propName.toUpperCase();
---

<!-- Component HTML structure with proper accessibility -->
<div class="tailwind-classes dark:text-white" data-testid="component-name">
  <h2 class="text-xl font-bold" id="heading-id">{processedValue}</h2>
  <div aria-labelledby="heading-id">
    <!-- Content here -->
    {optionalProp && <p>Optional content</p>}
  </div>
</div>

<script>
  // Only if client-side interactivity is needed
  // Use TypeScript here as well
  const elements = document.querySelectorAll('[data-testid="component-name"]');

  elements.forEach((element) => {
    // Add interaction logic
  });
</script>
````

## Example

For a "GenreCard" component that displays a music genre with an icon and allows selection:

````astro
---
import { Icon } from "astro-icon";

/**
 * GenreCard - Displays a selectable music genre card with icon and description
 *
 * @component
 * @example
 * ```astro
 * <GenreCard
 *   genre="Rock"
 *   icon="music-rock"
 *   description="Test your rock music knowledge"
 *   isSelected={false}
 * />
 * ```
 */

interface Props {
  /** The name of the music genre */
  genre: string;
  /** Icon name from the icon library */
  icon: string;
  /** Short description of the genre or quiz */
  description: string;
  /** Whether this genre is currently selected */
  isSelected?: boolean;
}

const { genre, icon, description, isSelected = false } = Astro.props;

// Generate unique ID for accessibility labels
const buttonId = `genre-${genre.toLowerCase().replace(/\s+/g, "-")}`;
---

<button
  id={buttonId}
  class={`p-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
    isSelected
      ? "bg-purple-700 text-white dark:bg-purple-600"
      : "bg-zinc-800 hover:bg-zinc-700 text-white dark:bg-zinc-900 dark:hover:bg-zinc-800"
  }`}
  aria-pressed={isSelected}
  data-genre={genre}
  data-testid="genre-card"
>
  <div class="flex items-center gap-3">
    <Icon name={icon} width="24" height="24" aria-hidden="true" />
    <span class="font-bold text-lg">{genre}</span>
  </div>
  <p class="mt-2 text-sm opacity-80">{description}</p>
</button>

<script>
  // Client-side code for handling selection
  const buttons = document.querySelectorAll("[data-genre]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update selection state
      document.querySelectorAll("[data-genre]").forEach((el) => {
        el.setAttribute("aria-pressed", "false");
        el.classList.remove(
          "bg-purple-700",
          "text-white",
          "dark:bg-purple-600",
        );
        el.classList.add("bg-zinc-800", "dark:bg-zinc-900");
      });

      button.setAttribute("aria-pressed", "true");
      button.classList.add("bg-purple-700", "text-white", "dark:bg-purple-600");
      button.classList.remove("bg-zinc-800", "dark:bg-zinc-900");

      // Dispatch custom event
      const selectedGenre = button.getAttribute("data-genre");
      window.dispatchEvent(
        new CustomEvent("genre-selected", {
          detail: { genre: selectedGenre },
        }),
      );
    });
  });
</script>
````
