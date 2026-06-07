# AGENTS.md

This document provides essential guidelines for AI agents working on the MelodyMind Music codebase.

## Project Overview

- **Framework**: Astro v6+ with Static Site Generation (SSG)
- **Language**: TypeScript (strict mode)
- **Styling**: BEM-based CSS scoped in Astro components
- **Content**: Album MDX via Astro Content Collections
- **Editorial Language**: English-only
- **Package Manager**: pnpm
- **Workspace**: Single app at `apps/music`
- **Design source of truth**: Music app components, tokens, and visual language

## Music App Structure

- Public app path: `apps/music`
- Album content: `apps/music/src/content/albums/*.mdx`
- Album schema: `apps/music/src/content.config.ts`
- Main app layout: `apps/music/src/layouts/Layout.astro`
- Album route: `apps/music/src/pages/[album].astro`
- Genre landing route: `apps/music/src/pages/genre/[genre].astro`
- Genre landing data: `apps/music/src/data/genreLandingPages.ts`
- Legacy `/categories`, `/knowledge`, and `/taxonomy` routes are redirected to `/` in `apps/music/astro.config.mjs`.

## Essential Commands

### Development

```bash
pnpm dev                 # Start the Music app locally
pnpm dev:music           # Same app-specific dev command
pnpm build               # Build the Music app
pnpm build:music         # Same app-specific build command
pnpm preview             # Preview the built Music app
```

### Code Quality

```bash
pnpm lint                # Format + lint the Music app
pnpm lint:check          # Check lint/style without auto-fix
pnpm format              # Format the Music app
pnpm format:check        # Check formatting
pnpm --filter music build
pnpm --filter music lint:check
pnpm --filter music stylelint:check
```

**Note**: No conventional test suite. Validate with the local dev server and the build output.

## Code Style Guidelines

### Design System

- Reuse the established Music app chrome and components:
  - `components/navigation/SiteHeader.astro`
  - `components/navigation/HeaderNav.astro`
  - `components/navigation/HeaderMobileExtras.astro`
  - `components/layout/Footer.astro`
  - `components/actions/ThemeToggle.astro`
  - `components/navigation/BackToTop.astro`
- Keep app-specific page components scoped to `apps/music/src`.
- Keep reusable Music UI in the existing component folders instead of duplicating chrome.
- Colors and semantic tokens live in the Music app styles.
- Current visual direction:
  - Light mode: warm paper, ink, ember accents
  - Dark mode: music-room night palette with violet-blue accents

### Import Organization

```typescript
// 1. External packages
import { defineCollection, z } from "astro:content";
import { Image } from "astro:assets";

// 2. Internal imports using path aliases
import Layout from "@layouts/Layout.astro";
import { buildPageSeo } from "@utils/seo/buildPageSeo";
```

**Path Aliases**: `@components/*`, `@layouts/*`, `@utils/*`, `@constants/*`, `@scripts/*`, `@data/*`, `@types/*`

### Formatting

- Print width: 90 chars, trailing commas: ES5, double quotes, semicolons always
- Run `pnpm format` before committing broad changes.
- For app-only checks, prefer `pnpm --filter music format`.

### Component Structure

```astro
---
import Layout from "@layouts/Layout.astro";

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

- Components: PascalCase, e.g. `ContentCard`
- Files: PascalCase for components, camelCase for utilities
- Functions: camelCase, e.g. `buildPageSeo`
- Constants: UPPER_SNAKE_CASE, e.g. `FALLBACK_LANGUAGE`
- CSS: BEM notation, e.g. `album-card__title`

### TypeScript

- Strict mode is enabled.
- Always define `interface Props` for Astro components with props.
- Use Zod for content validation.
- Export reusable types and use `const` assertions for readonly arrays where useful.

### Error Handling

```typescript
try {
  return await getCollection("albums");
} catch (e) {
  console.warn("Failed to load albums", { error: (e as any)?.message || e });
  return [];
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

- Use semantic HTML (`<article>`, `<section>`, `<time>`, etc.).
- Provide ARIA labels and keyboard navigation for interactive controls.
- Use `aria-hidden` for decorative icons.
- Keep `data-testid` where existing components already use it.
- Provide accurate alt text for album artwork and other images.

### SEO & Content

- Use `buildPageSeo()` and include relevant JSON-LD structured data.
- Albums live in `src/content/albums/`; schema lives in `src/content.config.ts`.
- Required album fields include `title`, `description`, `coverImage`, `publishedAt`, `isAvailable`, and `songs`.
- Common optional fields include `genre`, `mainGenre`, `moods`, `tags`, `language`, `era`, `energy`, `artist`, `coverImageWidth`, `coverImageHeight`, and `zipUrl`.
- Keep canonical URLs stable and directory-style with trailing slashes.
- If an old non-music route must keep working, update the redirect map in `apps/music/astro.config.mjs` instead of recreating removed apps.

### Editorial Standards

- Write in clear, neutral American English at a B2-C1 reading level.
- Prefer short sentences, common words, and consistent music terminology.
- Use US spelling and avoid idioms, slang, sarcasm, and culture-specific references.
- Prefer active voice unless passive voice improves accuracy or readability.
- Explain specialized music or technical terms in context when they may be unclear to a broad audience.
- Keep claims specific and proportionate; avoid hype, vague superlatives, and unsupported historical "first" or "best" statements.
- When dates matter, use exact dates or clearly bounded timeframes instead of relative wording such as "recently" or "nowadays".

### Fact Accuracy & Research

- Factual correctness is mandatory for user-facing album and music content.
- Verify any claim that is time-sensitive, disputed, niche, or likely to be misremembered.
- If a statement depends on current information, validate it with up-to-date primary or otherwise authoritative sources before publishing.
- Prefer primary sources first: official artist, label, festival, chart, museum, archive, standards body, academic publisher, or platform documentation.
- If no reliable source confirms a claim, rewrite conservatively or omit the claim.
- Do not present inference, synthesis, or genre interpretation as a confirmed fact.
- When multiple reputable sources disagree, reflect the disagreement neutrally and avoid false certainty.

## Before Committing

1. Run `pnpm lint` or the narrower package-specific checks you actually changed.
2. Run `pnpm build` or `pnpm --filter music build`.
3. If routing or redirects changed, verify affected routes manually in `pnpm dev:music`.
4. If album content changed, check at least one affected album page and the home album shelf.

## Common Pitfalls

- Do not use inline styles unless an existing component explicitly uses a CSS variable bridge.
- Do not skip error handling in async content utilities.
- Do not recreate removed Knowledge or Quiz app structure.
- Do not delete legacy redirects casually; they preserve historical URLs.
- Do not leave media tracks without a real source or an accessible lyrics/transcript fallback.

## Resources

- [Astro Docs](https://docs.astro.build)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [BEM CSS](https://getbem.com)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Microsoft Writing Style Guide](https://learn.microsoft.com/en-us/style-guide/welcome/)
