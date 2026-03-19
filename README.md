# MelodyMind Monorepo

MelodyMind is a content-focused Astro monorepo with three public apps and two shared
packages:

- `apps/knowledge`: editorial music knowledge and taxonomy-driven discovery
- `apps/quiz`: music history quizzes
- `apps/podcasts`: podcast site and episode archive
- `packages/shared-ui`: shared Astro UI components and theme tokens
- `packages/shared-utils`: shared utilities for SEO, content, analytics, and site helpers

## Stack

- Astro 6
- TypeScript
- pnpm workspaces
- Turbo
- Scoped Astro component CSS with BEM naming

## Requirements

- Node.js `>=22.12.0`
- pnpm `9.x`

## Install

```bash
pnpm install
```

## Common Commands

### Monorepo

```bash
pnpm dev
pnpm build
pnpm lint
pnpm lint:check
pnpm format
pnpm format:check
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
└── package.json
```

## Knowledge Architecture

The Knowledge app now uses taxonomy as its primary content structure.

- Main source: `apps/knowledge/src/data/musicTaxonomy.ts`
- Section route: `apps/knowledge/src/pages/taxonomy/[section].astro`
- Article frontmatter uses:
  - `taxonomySubsection`
  - `taxonomyGroup` (optional)

Legacy `/categories/*` pages were removed. Historical category URLs are preserved through
redirect mappings in `apps/knowledge/src/constants/categoryRedirects.js`.

## Quality Gates

There is no conventional test suite at the moment. The main validation path is:

- `pnpm format:check`
- `pnpm lint:check`
- `pnpm build`

For narrower work, use the package-specific commands instead of always running the whole
monorepo.

## Notes

- Husky is enabled through the root `prepare` script.
- Shared UI theme tokens live in `packages/shared-ui/src/styles/master-theme.css`.
- Knowledge-specific working rules are documented in `AGENTS.md`.
