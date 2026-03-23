# AGENTS.md

Operating guide for agentic coding assistants in `melody-mind-podcasts`.
Use this file for build/lint/test commands, style rules, and repo conventions.

## 1) Project Snapshot

- Stack: Astro 5.x + TypeScript 5.x, static output
- Package manager: Yarn (preferred). `package-lock.json` exists; avoid mixing npm.
- Language: English-only content
- Data source: Astro Content Collections in `src/content/podcasts/*.json`

## 2) Commands (Build/Lint/Test)

Run the fastest applicable command. Do not invent alternatives.

### Install

- `yarn install`

### Dev / Build

- Dev server: `yarn dev`
- Production build: `yarn build`
- Preview: `yarn preview`

### Lint / Format

- ESLint: `yarn lint`
- ESLint fix: `yarn lint:fix`
- Stylelint: `yarn lint:css`
- Stylelint fix: `yarn lint:css:fix`
- Prettier write: `yarn format`
- Prettier check: `yarn format:check`

### Data / Maintenance

- Update audio metadata: `yarn update:audio-metadata`
- Validate podcasts: `yarn validate:podcasts`
- Check content style rules: `yarn check:style`
- Normalize images: `yarn normalize:images`
- Convert PNG to JPG: `yarn convert:png`

### Tests

- No test runner is configured. For a “single test,” run the most targeted script above.

## 3) Husky / Pre-commit

- Husky is enabled via `prepare`.
- Pre-commit runs `lint-staged`.
- Lint-staged targets all staged files:
  - `**/*.{js,ts,astro}` → `eslint --fix`
  - `**/*.{astro,css,md,json}` → `prettier --write`

## 4) Code Style & Formatting

### Formatting

- Prettier is the source of truth (`prettier.config.cjs`).
- Run `yarn format` after changes that affect markup or JSON.

### ESLint (strict)

- Flat config: `eslint.config.js`.
- `no-console` is **error**.
- `@typescript-eslint/no-unused-vars` is **error** (ignore args prefixed with `_`).
- `no-debugger`, `eqeqeq`, `curly`, `no-implicit-coercion` enabled.
- Globals are set for browser + node + ES2021.

### Stylelint (strict)

- Config: `stylelint.config.cjs`.
- A11y rules enforced (media-reduced-motion; focus-visible; etc.).
- Logical CSS required: prefer `inline-size`, `block-size`, `padding-inline`, `margin-block`.
- Logical units: use `vi`/`vb` instead of `vw`/`vh` when possible.
- Vendor prefixes allowed only where configured (e.g. `-webkit-background-clip`).

## 5) Naming & Structure

- File and component names: `PascalCase` for components, `kebab-case` for utilities.
- CSS classes: BEM-ish (`block__element--modifier`).
- Episode IDs: lowercase, hyphenated slugs (no spaces).

## 6) TypeScript Conventions

- Avoid `any`; add or refine types in `src/types/*`.
- Prefer narrow types and explicit return types for helpers.
- Use `type` for object shapes and unions; `interface` for component props when helpful.

## 7) Error Handling

- Fail fast in scripts; do not swallow errors silently.
- For optional data (e.g., missing `persons.json`), use guarded fallbacks.
- Keep defaults conservative (no breaking changes to RSS output).

## 8) Content Rules (critical)

- Podcast data lives in `src/content/podcasts/en.json`.
- Only `isAvailable: true` episodes are shown and emitted in RSS.
- Avoid inline `<script>` in content fields.

## 9) RSS Rules

File: `src/utils/rss.ts`

- Preserve namespaces and `<podcast:locked>` owner.
- Order episodes newest → oldest by `publishedAt`.
- Use `subtitleUrl` for transcript tag when present.
- Keep enclosure length fallback if `fileSizeBytes` missing.

## 10) Accessibility & UX

- Use semantic elements (`button`, `nav`, `main`).
- Provide `aria-label` for custom controls.
- Honor `prefers-reduced-motion`.
- Ensure keyboard focus is visible and non-destructive.

## 11) Data Contracts

### Episode shape (Content Collection)

Minimal keys:

- `id`, `title`, `description`, `publishedAt`, `imageUrl`, `audioUrl`, `language`, `isAvailable`
  Optional:
- `showNotesHtml`, `fileSizeBytes`, `durationSeconds`, `subtitleUrl`, `episodeNumber`, `knowledgeUrl`

### Persons

- `src/data/persons.json` for Podcasting 2.0 `<podcast:person>` tags.
- Do not remove entries without explicit request.

## 12) Modern CSS Features

- Allowed: `clamp`, `color-mix`, `content-visibility`, `text-wrap` (guarded via `@supports`).
- Use `@supports` for features with partial support.

## 13) Repo Rules (Cursor/Copilot)

- No `.cursorrules`, `.cursor/rules/`, or `.github/copilot-instructions.md` present.

## 14) Git Guidance

- Do not amend commits unless explicitly asked.
- No force-push.
- Keep commits focused and in English.

## 15) Quick Checklist

- `yarn lint` clean
- `yarn lint:css` clean
- `yarn format:check` clean
- `yarn validate:podcasts` after data edits
- `yarn build` for production changes
