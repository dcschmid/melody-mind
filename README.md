# MelodyMind Monorepo

MelodyMind is an Astro-based monorepo for three public-facing music products plus the
shared packages they build on:

- `apps/knowledge`: editorial music knowledge, taxonomy pages, and long-form articles
- `apps/quiz`: music history quizzes and category landing pages
- `apps/podcasts`: podcast homepage, episode archive, and RSS feed generation
- `packages/shared-ui`: shared Astro components, layouts, tokens, and interaction helpers
- `packages/shared-utils`: shared URL, SEO, analytics, content, and app-shell utilities

The repository is organized around one rule: cross-app concerns belong in shared
packages, while routing, content models, and domain logic stay inside the app that owns
them.

## Stack

- Astro 6 with static output
- TypeScript
- pnpm workspaces
- Turbo for task orchestration
- Scoped Astro component CSS with BEM naming
- Shared SEO, app-shell, and image helpers via local workspace packages

## Requirements

- Node.js `>=22.12.0`
- pnpm `9.x`

## Getting Started

Install dependencies from the repository root:

```bash
pnpm install
```

Start all workspace dev tasks:

```bash
pnpm dev
```

Or run a single app locally:

```bash
pnpm dev:knowledge
pnpm dev:quiz
pnpm dev:podcasts
```

## Repository Layout

```text
.
├── apps/
│   ├── knowledge/
│   ├── podcasts/
│   └── quiz/
├── packages/
│   ├── shared-ui/
│   └── shared-utils/
├── AGENTS.md
├── eslint.config.mjs
├── stylelint.config.cjs
├── turbo.json
└── package.json
```

## Workspace Overview

### `apps/knowledge`

The Knowledge app is the editorial foundation of the project. It contains long-form music
articles, taxonomy landing pages, legal pages, and search/discovery routes.

Important directories:

- `src/content/knowledge-en/`: article content
- `src/data/musicTaxonomy.ts`: taxonomy source of truth
- `src/pages/knowledge/`: article routes
- `src/pages/taxonomy/`: taxonomy routes
- `src/utils/knowledge/` and `src/utils/taxonomy/`: page builders and helpers

### `apps/quiz`

The Quiz app delivers music quiz entry points and quiz detail pages using the shared UI
and shared SEO/image stack.

Important directories:

- `src/content/quizzes/`: quiz content
- `src/pages/`: landing and quiz routes
- `src/utils/quizImages.ts`: quiz-specific Astro asset mapping

### `apps/podcasts`

The Podcasts app owns the podcast homepage, episode pages, RSS feed generation, and audio
metadata workflows.

Important directories:

- `src/content/podcasts/`: episode content
- `src/pages/podcast.xml.ts`: feed route
- `src/utils/rss.ts`: RSS rendering
- `src/utils/podcasts.ts`: episode loading helpers

### `packages/shared-ui`

Shared Astro UI components, layouts, navigation, cards, media primitives, and theme
tokens. This package should stay app-agnostic.

### `packages/shared-utils`

Shared helpers for URLs, SEO, consent, analytics, content utilities, app-shell config,
and related low-level logic. This package should stay framework-light where possible.

## Common Commands

### Monorepo

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm lint:check
pnpm format
pnpm format:check
pnpm clean
```

### App-specific

```bash
pnpm dev:knowledge
pnpm build:knowledge

pnpm dev:quiz
pnpm build:quiz

pnpm dev:podcasts
pnpm build:podcasts
```

You can also target packages directly with workspace filters:

```bash
pnpm --filter knowledge build
pnpm --filter quiz lint:check
pnpm --filter podcasts format
pnpm --filter @melody-mind/shared-ui lint:check
```

## Images and Assets

Visible UI images are now handled through Astro assets in app-local `src/assets`
directories. Shared rendering and URL helpers live in the workspace packages.

Current pattern:

- app-specific asset discovery stays local to each app
- shared image rendering lives in `packages/shared-ui`
- shared image/path helpers live in `packages/shared-utils`
- RSS and SEO reuse the same imported source assets where possible

This keeps optimization centralized without forcing app-specific content structure into
shared packages.

## Knowledge Taxonomy Model

Knowledge uses taxonomy as its primary information architecture.

- Source of truth: `apps/knowledge/src/data/musicTaxonomy.ts`
- Primary route: `apps/knowledge/src/pages/taxonomy/[section].astro`
- Article frontmatter fields:
  - `taxonomySubsection`
  - `taxonomyGroup` (optional)

Legacy `/categories/*` pages were removed. Historical URLs are preserved through redirect
mappings in `apps/knowledge/src/constants/categoryRedirects.js`.

## Quality Gates

There is currently no conventional automated test suite. The primary validation path is:

```bash
pnpm format:check
pnpm lint:check
pnpm build
```

For scoped work, prefer the narrowest affected package checks rather than always building
the whole monorepo.

Typical examples:

- app-only UI change: package `format:check`, `lint:check`, and app `build`
- shared utility change: package checks plus all affected app builds
- content/routing change in Knowledge: `pnpm --filter knowledge build` plus manual route
  verification

## Working Conventions

- Keep shared code generic. If a helper knows too much about one app's route model, move
  that logic back into the app.
- Keep CSS scoped and BEM-based.
- Prefer semantic design tokens from `packages/shared-ui/src/styles/master-theme.css`.
- Avoid duplicating SEO, URL, image, or app-shell logic across apps when a shared helper
  already exists.
- Follow the additional repo-specific working rules in `AGENTS.md`.

## Additional Documentation

- [Knowledge README](/home/daniel/dev/github/melody-mind/apps/knowledge/README.md)
- [Knowledge Scripts README](/home/daniel/dev/github/melody-mind/apps/knowledge/scripts/README.md)
- [Quiz README](/home/daniel/dev/github/melody-mind/apps/quiz/README.md)
- [Podcasts README](/home/daniel/dev/github/melody-mind/apps/podcasts/README.md)
- [Shared UI README](/home/daniel/dev/github/melody-mind/packages/shared-ui/README.md)
- [Shared Utils README](/home/daniel/dev/github/melody-mind/packages/shared-utils/README.md)
