# Generate Astro Component

Your goal is to generate a new Astro component for the MelodyMind music trivia game.

## Component Requirements

If not specified, ask for:

- Component name
- Purpose/functionality
- Props it should accept
- Whether it needs client-side interactivity

## Technical Requirements

- Follow Astro component structure with frontmatter script and template
- Use TypeScript for type safety
- Define a proper interface for component props
- Use Tailwind CSS for styling (no custom CSS)
- Ensure WCAG AAA accessibility compliance
- Add proper JSDoc comments
- Include semantic HTML elements
- Add appropriate ARIA attributes

## File Structure

```astro
---
// Import statements
import { type ComponentProps } from "../types";

// Interface definition
interface Props {
  // Props here
}

// Get props and other logic
const { propName } = Astro.props;
---

<!-- Component HTML structure -->
<div class="tailwind-classes">
  <!-- Content here -->
</div>

<script>
  // Only if client-side interactivity is needed
</script>
```

## Example

For a "GenreCard" component that displays a music genre with an icon and allows selection:

```astro
---
import { Icon } from "astro-icon";

interface Props {
  genre: string;
  icon: string;
  description: string;
  isSelected?: boolean;
}

const { genre, icon, description, isSelected = false } = Astro.props;
---

<button
  class={`p-4 rounded-lg transition-all ${isSelected ? "bg-purple-700 text-white" : "bg-zinc-800 hover:bg-zinc-700"}`}
  aria-pressed={isSelected}
  data-genre={genre}
>
  <div class="flex items-center gap-3">
    <Icon name={icon} width="24" height="24" />
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
        el.classList.remove("bg-purple-700", "text-white");
        el.classList.add("bg-zinc-800");
      });

      button.setAttribute("aria-pressed", "true");
      button.classList.add("bg-purple-700", "text-white");
      button.classList.remove("bg-zinc-800");

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
```
