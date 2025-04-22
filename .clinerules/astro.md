# Astro Rules for MelodyMind

## Component Structure

- Follow the Astro component structure with frontmatter script and template
- Use Astro slots for flexible component composition
- Leverage Astro's built-in partial hydration with directives when needed
- Keep component logic in the frontmatter section
- Extract complex logic to utility files

## Page Organization

- Use a consistent page structure with proper SEO metadata
- Implement layouts for consistent UI across pages
- Use dynamic routes for game categories and genres
- Implement proper navigation between pages

## Data Flow

- Use Astro.props for component data
- Implement server-side data fetching where appropriate
- Use Astro.glob() for working with collections of files
- Work with Astro DB for persistent data storage

## Example Component Pattern

```astro
---
// Script section (frontmatter)
import { GameCard } from "../components/GameCard";
import type { GameCategory } from "../types";

interface Props {
  categories: GameCategory[];
  title: string;
}

const { categories, title } = Astro.props;
---

<!-- Template section -->
<section class="game-categories">
  <h2>{title}</h2>
  <div class="card-grid">
    {
      categories.map((category) => (
        <GameCard
          title={category.title}
          difficulty={category.difficulty}
          genre={category.genre}
          client:load
        />
      ))
    }
  </div>
</section>

<style>
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
</style>
```

## Performance Considerations

- Use client:load, client:idle, or client:visible appropriately
- Optimize images with Astro's built-in image optimization
- Implement lazy loading for below-the-fold content
- Use resource hints for critical resources
