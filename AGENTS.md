# AGENTS.md

This document provides essential guidelines for AI agents working on the MelodyMind Knowledge codebase.

## Project Overview

- **Framework**: Astro v5+ with Static Site Generation (SSG)
- **Language**: TypeScript (strict mode)
- **Styling**: BEM-based CSS (scoped in Astro components)
- **Content**: Markdown articles via Astro Content Collections
- **Language**: English-only (knowledge-en collection)
- **Package Manager**: Yarn

## Essential Commands

### Development

```bash
yarn dev              # Start dev server with hot reload
yarn build            # Build for production (includes astro check)
yarn build:production # Production build with NODE_ENV=production
yarn preview          # Preview production build locally
```

### Code Quality

```bash
yarn lint             # Format + lint (prettier + eslint --fix)
yarn lint:check       # Check without auto-fix
yarn format           # Format with Prettier only
yarn format:check     # Check formatting
yarn check:scoped-css # Verify CSS scoping
astro check           # TypeScript type checking
```

**Note**: No test suite. Test manually via dev server.

## Code Style Guidelines

### Import Organization

```typescript
// 1. External packages
import { defineCollection, z } from "astro:content";
import { Image } from "astro:assets";

// 2. Internal packages using path aliases
import Layout from "@layouts/Layout.astro";
import { buildPageSeo } from "@utils/seo/buildPageSeo";
```

**Path Aliases**: `@components/*`, `@layouts/*`, `@utils/*`, `@constants/*`, `@i18n/*`, `@content/*`

### Formatting

- Print width: 90 chars, trailing commas: ES5, double quotes, semicolons always
- Run `yarn format` before committing

### Component Structure

```astro
---
import Layout from "@layouts/Layout.astro";
export const prerender = true;

interface Props {
  title: string;
  optional?: string;
}
const { title, optional = "default" } = Astro.props;
---

<article class="component" data-testid="component"><h1>{title}</h1></article>
<style>
  .component {
    /* BEM-based */
  }
</style>
```

### Naming Conventions

- Components: PascalCase (e.g., `KnowledgeCard`)
- Files: PascalCase (e.g., `KnowledgeCard.astro`)
- Functions: camelCase (e.g., `buildPageSeo`)
- Constants: UPPER_SNAKE_CASE (e.g., `FALLBACK_LANGUAGE`)
- CSS: BEM notation (e.g., `knowledge-card__title`)

### TypeScript

- Strict mode enabled, always define `interface Props`
- Use JSDoc for complex types, Zod for content validation
- Export reusable types, use `const assertions` for readonly arrays

### Error Handling

```typescript
try {
  return await getCollection("knowledge-en");
} catch (e) {
  console.warn("Failed", { error: (e as any)?.message || e });
  return []; // Graceful fallback
}
```

### CSS (BEM + Scoped)

```css
.block {
}
.block__element {
}
.block--modifier {
}
@media (min-width: 640px) {
  .block {
    /* desktop */
  }
}
```

### Accessibility

- Semantic HTML (`<article>`, `<time>`, etc.)
- ARIA labels, keyboard nav, `aria-hidden` for decor
- `data-testid` for testing, proper alt text for images

### SEO & Content

- Use `buildPageSeo()` utility, include JSON-LD structured data
- Articles in `src/content/knowledge-en/`, schema in `src/content/config.ts`
- Required: `title`, `description`. Optional: `image`, `createdAt`, `category`

## Before Committing

1. Run `yarn lint` (format + fix)
2. Run `yarn build` (verify build)
3. Run `astro check` (type check)
4. Test in `yarn dev` (manual testing)

## Common Pitfalls

- Don't forget `yarn format` before commit
- Don't use inline styles (use scoped CSS)
- Don't skip error handling in async functions
- Don't forget `export const prerender = true` for static pages

## Resources

- [Astro Docs](https://docs.astro.build)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [BEM CSS](https://getbem.com)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
