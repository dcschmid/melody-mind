# AGENTS.md

This document provides essential guidelines for AI agents working on the MelodyMind Knowledge codebase.

## Project Overview

- **Framework**: Astro v6+ with Static Site Generation (SSG)
- **Language**: TypeScript (strict mode)
- **Styling**: BEM-based CSS (scoped in Astro components)
- **Content**: Markdown articles via Astro Content Collections
- **Editorial Language**: English-only (knowledge-en collection)
- **Package Manager**: pnpm
- **Workspace**: Monorepo with `apps/knowledge`, `apps/quiz`, `apps/podcasts`, `packages/shared-ui`, and `packages/shared-utils`

## Knowledge Structure

- `taxonomy` is the primary information architecture for Knowledge.
- Main taxonomy source: `apps/knowledge/src/data/musicTaxonomy.ts`
- Primary routed taxonomy page: `apps/knowledge/src/pages/taxonomy/[section].astro`
- Articles are assigned via frontmatter fields:
  - `taxonomySubsection`
  - `taxonomyGroup` (optional)
- Legacy `/categories/*` pages were removed.
- Old category URLs are preserved only through redirects defined in:
  `apps/knowledge/src/constants/categoryRedirects.js`

## Essential Commands

### Development

```bash
pnpm dev                 # Run all app dev tasks via turbo
pnpm dev:knowledge       # Start only Knowledge locally
pnpm build               # Build the monorepo
pnpm build:knowledge     # Build only Knowledge
pnpm preview             # Preview app builds where supported
```

### Code Quality

```bash
pnpm lint                      # Format + lint across the monorepo
pnpm lint:check                # Check without auto-fix across the monorepo
pnpm format                    # Format across the monorepo
pnpm format:check              # Check formatting across the monorepo
pnpm --filter knowledge build  # Knowledge build, includes astro check
pnpm --filter knowledge lint:check
pnpm --filter knowledge check:scoped-css
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
import { buildPageSeo } from "@shared-utils/utils/seo/buildPageSeo";
```

**Path Aliases**: `@components/*`, `@layouts/*`, `@utils/*`, `@constants/*`, `@i18n/*`, `@content/*`

### Formatting

- Print width: 90 chars, trailing commas: ES5, double quotes, semicolons always
- Run `pnpm format` before committing when broad changes span packages
- For Knowledge-only work, prefer `pnpm --filter knowledge format`

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
- Required: `title`, `description`
- Common optional fields: `image`, `createdAt`, `updatedAt`, `taxonomySubsection`, `taxonomyGroup`, `keywords`, `takeaways`
- Do not introduce new `category` frontmatter for Knowledge articles
- If an old `/categories/*` URL must keep working, update the redirect map instead of recreating category pages

### Editorial Standards

- Write in international, clear, neutral American English at a B2-C1 reading level
- Prefer short sentences, common words, and consistent terminology
- Use US spelling and avoid idioms, slang, sarcasm, and culture-specific references
- Prefer active voice unless passive voice improves accuracy or readability
- Explain specialized music or technical terms in context when they may be unclear to a broad audience
- Keep claims specific and proportionate; avoid hype, vague superlatives, and unsupported historical "first" or "best" statements
- When dates matter, use exact dates or clearly bounded timeframes instead of relative wording such as "recently" or "nowadays"

### Fact Accuracy & Research

- Factual correctness is mandatory for all user-facing knowledge content
- Verify any claim that is time-sensitive, disputed, niche, or likely to be misremembered
- If a statement depends on current information, validate it with up-to-date primary or otherwise authoritative sources before publishing
- Prefer primary sources first: official artist, label, festival, chart, museum, archive, standards body, academic publisher, or platform documentation
- If no reliable source confirms a claim, rewrite conservatively or omit the claim
- Do not present inference, synthesis, or genre interpretation as a confirmed fact
- When multiple reputable sources disagree, reflect the disagreement neutrally and avoid false certainty
- Keep source language out of the article unless the user explicitly asks for citations; use research to improve accuracy, not to stuff copy with references

## Before Committing

1. Run `pnpm lint` or the narrower package-specific checks you actually changed
2. Run `pnpm build` or at minimum `pnpm --filter knowledge build` for Knowledge work
3. If Knowledge routing or content changed, verify affected taxonomy pages manually in `pnpm dev:knowledge`
4. If redirects changed, verify legacy `/categories/*` routes resolve to the intended taxonomy targets

## Common Pitfalls

- Don't forget `pnpm format` or the package-specific formatter before commit
- Don't use inline styles (use scoped CSS)
- Don't skip error handling in async functions
- Don't forget `export const prerender = true` for static pages
- Don't reintroduce `category` as the primary Knowledge content model
- Don't delete legacy redirects casually; they currently preserve historical `/categories/*` URLs

## Resources

- [Astro Docs](https://docs.astro.build)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [BEM CSS](https://getbem.com)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Microsoft Writing Style Guide](https://learn.microsoft.com/en-us/style-guide/welcome/)
- [Google Technical Writing](https://developers.google.com/tech-writing)
- [Introduction to Plain Language](https://digital.gov/resources/an-introduction-to-plain-language/)
