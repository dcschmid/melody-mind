---
applyTo: "**/*.{astro,css,scss,ts,tsx,js,jsx}"
---

# CSS Variables & Code Deduplication Standards

These instructions apply to ALL files in the MelodyMind project and have the highest priority.

## MANDATORY CSS Variable Usage

### RULE 1: NEVER use hardcoded design values

**❌ WRONG:**

```css
.component {
  color: #ffffff;
  background-color: #8b5cf6;
  padding: 16px;
  border-radius: 8px;
  font-size: 18px;
}
```

**✅ CORRECT:**

```css
.component {
  color: var(--text-primary);
  background-color: var(--interactive-primary);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  font-size: var(--text-lg);
}
```

### RULE 2: Available CSS variables from global.css

**Always available variables:**

#### Colors

```css
/* Primary colors (Purple) */
--color-primary-50 to --color-primary-900

/* Secondary colors (Pink) */
--color-secondary-50 to --color-secondary-900

/* Neutral colors */
--color-neutral-50 to --color-neutral-950

/* Semantic colors */
--bg-primary, --bg-secondary, --bg-tertiary
--text-primary, --text-secondary, --text-tertiary
--border-primary, --border-secondary, --border-focus
--interactive-primary, --interactive-primary-hover
```

#### Spacing

```css
--space-xs    /* 4px */
--space-sm    /* 8px */
--space-md    /* 16px */
--space-lg    /* 24px */
--space-xl    /* 32px */
--space-2xl   /* 48px */
--space-3xl   /* 64px */
```

#### Typography

```css
--text-xs     /* 12px */
--text-sm     /* 14px */
--text-base   /* 16px */
--text-lg     /* 18px */
--text-xl     /* 20px */
--text-2xl    /* 24px */
--text-3xl    /* 30px */
--text-4xl    /* 36px */

--font-normal, --font-medium, --font-semibold, --font-bold
--leading-tight, --leading-normal, --leading-relaxed
```

#### Layout

```css
--radius-sm, --radius-md, --radius-lg, --radius-xl, --radius-full
--shadow-sm, --shadow-md, --shadow-lg, --shadow-xl
--transition-fast, --transition-normal, --transition-slow
--z-dropdown, --z-modal, --z-tooltip, --z-notification
```

#### Components

```css
--btn-primary-bg, --btn-primary-hover, --btn-primary-text
--card-bg, --card-border, --card-shadow
--form-bg, --form-border, --form-text
--focus-ring, --focus-outline
```

### RULE 3: Practical Implementation

**In Astro components:**

```astro
---
// Logic for dynamic styles with CSS variables
const difficultyLevel = difficulty === "hard" ? "high" : "normal";
---

<div class={`quiz-card quiz-card--${difficultyLevel}`}>
  <h2 class="quiz-card__title">{title}</h2>
  <p class="quiz-card__description">{description}</p>
</div>

<style>
  .quiz-card {
    padding: var(--space-lg);
    background-color: var(--card-bg);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    box-shadow: var(--card-shadow);
    transition: box-shadow var(--transition-normal);
  }

  .quiz-card:hover {
    box-shadow: var(--shadow-lg);
  }

  .quiz-card--high {
    border-left: 4px solid var(--color-error-500);
  }

  .quiz-card__title {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    color: var(--text-primary);
    margin-bottom: var(--space-md);
  }

  .quiz-card__description {
    font-size: var(--text-lg);
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
  }
</style>
```

**In TypeScript for dynamic styles:**

```typescript
/**
 * Generates CSS custom property styles for dynamic components
 * @param variant - Component variant type
 * @returns CSS string with custom properties
 */
export const getVariantStyles = (variant: "primary" | "secondary" | "danger"): string => {
  const variantMap = {
    primary: "var(--interactive-primary)",
    secondary: "var(--color-secondary-600)",
    danger: "var(--color-error-500)",
  };

  return `
    background-color: ${variantMap[variant]};
    color: var(--btn-primary-text);
    padding: var(--space-md) var(--space-lg);
    border-radius: var(--radius-md);
    transition: opacity var(--transition-fast);
  `;
};
```

## MANDATORY Code Deduplication

### RULE 1: ALWAYS check existing patterns

**Before creating new functions/components:**

1. **Search in `/src/utils/`** for similar functionality
2. **Check `/src/components/`** for reusable UI elements
3. **Review `/src/types/`** for existing TypeScript interfaces
4. **Look in `/src/styles/global.css`** for available utility classes

### RULE 2: Use existing utility functions

**Commonly used utils - ALWAYS reuse:**

```typescript
// i18n utilities
import { getLangFromUrl, useTranslations } from "@utils/i18n";

// Game logic
import { calculateScore, getQuestionsByCategory } from "@utils/game/score";

// SEO helpers
import { generateMetaTags, createStructuredData } from "@utils/seo";

// Validation utilities
import { validateEmail, sanitizeInput } from "@utils/validation";
```

### RULE 3: Component Reuse Patterns

**ALWAYS check these component directories:**

```
/src/components/Shared/     - Base UI components
/src/components/Game/       - Game-specific components
/src/components/Overlays/   - Modals and overlays
/src/components/Header/     - Navigation
/src/components/Footer/     - Footer areas
```

**Example for Component Reuse:**

```astro
---
// ❌ WRONG: Create new button component
// ✅ CORRECT: Use existing ones
import PrimaryButton from "@components/Shared/PrimaryButton.astro";
import Modal from "@components/Overlays/Modal.astro";
import ScoreDisplay from "@components/Game/ScoreDisplay.astro";
---

<Modal title="Game Results">
  <ScoreDisplay score={finalScore} maxScore={totalPoints} />
  <PrimaryButton onClick={playAgain}>Play Again</PrimaryButton>
</Modal>
```

### RULE 4: CSS Pattern Deduplication

**Use existing CSS classes:**

```css
/* Globally available utility classes */
.container          /* Responsive Container */
.grid-responsive    /* Responsive Grid Layout */
.sr-only           /* Screen-reader only content */
.hidden-xs         /* Responsive visibility */

/* Example for pattern reuse */
.new-component {
  /* Use existing container logic */
  @extend .container;

  /* Use CSS variables for styling */
  background-color: var(--card-bg);
  padding: var(--space-lg);
}
```

## Validation Checklist

**Check before every commit:**

- [ ] **CSS Variables**: No hardcoded colors, spacing, or font sizes
- [ ] **Utility Reuse**: Used existing functions from `/src/utils/`
- [ ] **Component Reuse**: Reused existing components
- [ ] **Type Reuse**: Used existing interfaces from `/src/types/`
- [ ] **Pattern Deduplication**: Consolidated similar code patterns
- [ ] **Semantic Variables**: `var(--text-primary)` instead of `var(--color-white)`
- [ ] **Responsive Variables**: `var(--space-md)` instead of fixed pixel values

## Code Review Standards

**Automatic rejection criteria:**

```typescript
// ❌ AUTOMATICALLY REJECTED
const styles = {
  color: "#ffffff", // Hardcoded color
  padding: "16px", // Hardcoded spacing
  fontSize: "18px", // Hardcoded font size
};

// ❌ AUTOMATICALLY REJECTED - Duplicated functionality
export const calculatePoints = (correct: number) => {
  return correct * 50; // Already exists in /src/utils/game/score.ts
};

// ✅ ACCEPTED
const styles = {
  color: "var(--text-primary)",
  padding: "var(--space-md)",
  fontSize: "var(--text-lg)",
};

// ✅ ACCEPTED - Reuse
import { calculateScore } from "@utils/game/score";
```

## Performance Implications

**CSS variables provide:**

- **Consistency**: Unified design system
- **Maintainability**: Central changes possible
- **Performance**: Browser-optimized CSS Custom Properties
- **Theming**: Automatic Dark/Light mode support
- **Accessibility**: WCAG-compliant contrasts through semantic variables

**Code deduplication provides:**

- **Bundle Size**: Smaller JavaScript/CSS bundles
- **Maintainability**: Less code to maintain
- **Consistency**: Unified implementations
- **Testing**: Less code to test
- **Bug Reduction**: Fix errors in only one place

## Migration Strategy

**For existing code:**

1. **Identify hardcoded values**
2. **Replace with CSS variables**
3. **Consolidate duplicated patterns**
4. **Test functionality**
5. **Update documentation**

**Migration example:**

```typescript
// BEFORE
const buttonStyle = {
  backgroundColor: "#8b5cf6",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "8px",
};

// AFTER
const buttonStyle = {
  backgroundColor: "var(--interactive-primary)",
  color: "var(--btn-primary-text)",
  padding: "var(--space-md) var(--space-lg)",
  borderRadius: "var(--radius-md)",
};
```

These standards are **NOT OPTIONAL** and must be followed in EVERY code change.
