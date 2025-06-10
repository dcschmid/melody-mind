---
applyTo: "**/*.{ts,astro}"
---

## Component Generation and Code Organization

### File Focus and Component Reuse

- **Focus on the currently edited file** - Prioritize modifying and improving existing code instead
  of creating external files
- **Always check first if a suitable component already exists** in the following directories:
  - `/src/components/` - General UI components
  - `/src/components/Game/` - Game-specific components
  - `/src/components/Shared/` - Shared utility components
  - `/src/components/Overlays/` - Modal and overlay components
  - `/src/components/Header/` - Navigation and header components
- **Use existing utility functions** from `/src/utils/`, especially:
  - `/src/utils/game/` - Game logic and functionality
  - `/src/utils/i18n.ts` - Internationalization
  - `/src/utils/seo.ts` - SEO functions

### Code Organization and Script Management

- **Prefer inline solutions** for simple functionality
  ```astro
  ---
  // Keep simple transformations and calculations here
  const formattedText = text.toUpperCase();
  const score = correctAnswers * 50;
  // ALWAYS use CSS variables for styling values
  const dynamicStyles = `
    background-color: var(--card-bg);
    padding: var(--space-lg);
    border-radius: var(--radius-md);
  `;
  ---
  ```
- **MANDATORY: Use CSS custom properties from global.css** - Never hardcode design tokens
- **ALWAYS perform code deduplication** - Check for existing patterns before creating new ones
- **Use local scripts with `is:inline`** or as modules for the main functionality

  ```astro
  <script is:inline>
    // Use for simple DOM interactions
    document.querySelector("#toggle").addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  </script>

  <script>
    // Prefer modules for more complex functionality
    // with type="module" whenever possible
    const handleSubmit = () => {
      /* ... */
    };
    document.querySelector("form").addEventListener("submit", handleSubmit);
  </script>
  ```

- **Create modular TypeScript functions only when:**
  1. The functionality is **reused in multiple components**
  2. The logic is **too complex** for an inline script (more than 50 lines)
  3. The functionality **needs unit testing**
  4. There is a clear **domain/responsibility** that should be centrally managed

### Component Extraction

- **Create new components only when:**

  1. The UI structure is **reused in multiple places**
  2. The component represents a **standalone functional unit** (e.g., a QuestionCard)
  3. The UI logic becomes too complex for a single file (more than 100 lines of HTML)
  4. The structure enables a **clear separation of responsibilities**

- **When extracting components:**
  1. Follow the existing naming conventions in the project
  2. Place in logically related subdirectories (e.g., `/src/components/Game/`)
  3. Ensure complete TypeScript typing and JSDoc documentation
  4. Use the established component structure of the project

### TypeScript and Utility Organization

- **For new TypeScript utilities:**

  1. Check if the functionality already exists in `/src/utils/`
  2. Place domain-specific utilities in appropriate subdirectories (e.g., `/src/utils/game/`)
  3. Export only what is actually needed (named exports)
  4. Ensure complete TypeScript type definitions and JSDoc documentation

- **TypeScript in Astro components:**

  ```astro
  ---
  /**
   * @component ComponentName
   * @description Brief description
   */

  // 1. Imports
  import { getLangFromUrl, useTranslations } from "@utils/i18n";
  import existingComponent from "@components/ExistingComponent.astro";

  // 2. Props definition with TypeScript
  interface Props {
    /** Description of the prop */
    category: string;
    /** Description of the prop */
    difficulty: "easy" | "medium" | "hard";
  }

  // 3. Props processing
  const { category, difficulty = "medium" } = Astro.props;

  // 4. Inline logic with CSS variables
  const lang = getLangFromUrl(Astro.url);
  const t = useTranslations(lang);

  // Implement logic directly here if it's only relevant for this component
  const isHardMode = difficulty === "hard";
  const questionCount = isHardMode ? 20 : difficulty === "medium" ? 15 : 10;
  
  // Use CSS variables for dynamic styling
  const difficultyClass = `difficulty-${difficulty}`;
  ---

  <!-- HTML structure with semantic markup and CSS variables -->
  <div class={`quiz-component ${difficultyClass}`}>
    <h2 class="quiz-component__title">{t('quiz.title')}</h2>
    <p class="quiz-component__info">{questionCount} {t('quiz.questions')}</p>
  </div>

  <style>
    .quiz-component {
      padding: var(--space-lg);
      background-color: var(--card-bg);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
    }

    .quiz-component__title {
      font-size: var(--text-2xl);
      font-weight: var(--font-bold);
      color: var(--text-primary);
      margin-bottom: var(--space-md);
    }

    .quiz-component__info {
      font-size: var(--text-lg);
      color: var(--text-secondary);
    }

    .difficulty-easy {
      border-left: 4px solid var(--color-success-500);
    }

    .difficulty-medium {
      border-left: 4px solid var(--color-warning-500);
    }

    .difficulty-hard {
      border-left: 4px solid var(--color-error-500);
    }

    /* Use existing responsive breakpoints */
    @media (min-width: 48em) {
      .quiz-component {
        padding: var(--space-xl);
      }
    }
  </style>
  ```

### Performance Optimization

- **Prefer static site generation (SSG)** with `export const prerender = true;`
- **Keep client-side JavaScript minimal** - use only for necessary interactivity
- **Use Tailwind for styling** instead of external CSS files
- **Keep the DOM structure flat** and avoid unnecessary wrapper elements
- **Use optimized Astro image components** for images

### Decision Matrix for Code Organization

| Scenario                    | Solution                                          |
| --------------------------- | ------------------------------------------------- |
| Simple UI logic             | Inline in Astro frontmatter with CSS variables   |
| Simple DOM interactions     | Inline script with `is:inline`                   |
| More complex frontend logic | Module script (`<script>`) using CSS variables   |
| Reusable frontend logic     | In `/src/utils/` as TS file                      |
| Game logic                  | In `/src/utils/game/` as TS file                 |
| Reusable UI element         | As Astro component in `/src/components/`         |
| Page-specific UI element    | Keep in the current file with CSS variables      |
| **CSS Styling**             | **ALWAYS use root variables from global.css**    |
| **Code Patterns**           | **ALWAYS check for existing patterns first**     |

### Code Analysis and Refactoring Process

When working on an existing file, follow this process to identify reusable parts:

1. **Identify repetitive patterns** in the current file:

   - Similar UI structures that appear multiple times
   - Logic that performs similar operations in different parts
   - Event handlers that could be consolidated

2. **Extract reusable UI components** when you find:

   - UI patterns that are used across multiple pages
   - Complex UI elements with their own state/behavior
   - UI fragments that represent a discrete concept

3. **Extract TypeScript utilities** when you find:

   - Data transformation or calculation logic
   - Complex validation functions
   - State management functions
   - Helper functions used in multiple places

4. **Naming and organization**:

   - Name components based on their function, not their appearance
   - Name utilities based on what they do, not how they do it
   - Place components in appropriate subdirectories by domain
   - Group related utilities in domain-specific files

5. **Documentation during extraction**:
   - Add JSDoc comments to explain purpose and usage
   - Document parameters, return values, and side effects
   - Add usage examples for complex utilities
   - Include accessibility considerations
