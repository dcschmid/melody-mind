# MelodyMind Agent Guide

This file guides agentic contributors working in this repository.
Keep changes small, follow existing patterns, and prefer repo scripts.

## Project summary

- Astro 5 static site for melody-mind.de knowledge articles.
- Content lives in `src/content/knowledge-en` (English only, active).
- Styling is BEM-based with scoped `<style>` blocks in components.
- TypeScript is strict via `astro/tsconfigs/strict`.

## Environment

- Node.js: >= 18.19.0
- Package manager: Yarn 1.x (`yarn@1.22.22`)

## Common commands

- Install: `yarn install`
- Dev server: `yarn dev`
- Production build: `yarn build`
- Build with prod env: `yarn build:production`
- Preview build: `yarn preview`
- Start server (serves `dist/`): `yarn start`

## Lint, format, checks

- Lint (fix + format): `yarn lint`
- Lint (no fix): `yarn lint:check`
- Lint CSS (stylelint): `yarn lint:css`
- Lint CSS (fix): `yarn lint:css:fix`
- Format (write): `yarn format`
- Format (check): `yarn format:check`
- Type check: `astro check`
- Scoped CSS check: `yarn check:scoped-css`

## Single-file and targeted checks

- ESLint one file: `npx eslint "src/path/to/file.ts"`
- Prettier one file: `npx prettier --write "src/path/to/file.astro"`
- Prettier check one file: `npx prettier --check "src/path/to/file.mdx"`
- Content frontmatter + link check for one file:
  `node scripts/check_content.mjs src/content/knowledge-en/some-article.mdx`
- Scoped CSS check (global): `node scripts/check_scoped_css.mjs`

## Content tooling

- Content validation runs in lint-staged on `src/content/knowledge-en/**/*.{md,mdx}`.
- Required frontmatter for knowledge articles:
  - `title` (non-empty)
  - `description` (non-empty)
  - `keywords` (non-empty array)
- Optional date fields `createdAt`, `updatedAt` must parse as valid dates.
- Markdown link checks validate relative files and `/public` or `/src` assets.

## Imports and module resolution

- Use path aliases when possible:
  - `@components/*`, `@layouts/*`, `@utils/*`, `@constants/*`, `@i18n/*`, `@content/*`
- Preferred import order:
  1. Node/standard library
  2. External packages
  3. Internal aliases (`@utils`, `@components`, etc.)
  4. Relative paths
- Use `import type` for TypeScript type-only imports.

## Formatting rules (Prettier)

- `printWidth: 90`
- `trailingComma: "es5"`
- `singleQuote: false` (use double quotes)
- MDX uses `proseWrap: "always"`.
- Rely on Prettier instead of manual alignment.

## ESLint rules (highlights)

- JS + TS recommended configs with Astro plugin.
- `no-undef` is off (handled by TS and Astro).
- Unused variables are errors; prefix with `_` to intentionally ignore.
- Lint ignores: `dist/`, `.astro/`, `node_modules/`, `public/`.

## Astro component conventions

- Keep frontmatter at the top and type props explicitly.
- Prefer `export interface Props` for component props.
- Use `set:html` only when necessary and sanitize inputs.
- Co-locate styles in `<style>` blocks; avoid global CSS.
- Do not reintroduce `src/styles/global.css` in `Layout.astro`.

## CSS and naming conventions

- BEM class naming only (block\_\_element--modifier).
- Avoid disallowed classes enforced by scripts:
  - `sr-only`
  - `heading-anchor`
- Prefer CSS variables and existing design tokens.
- Keep styles scoped to the component when possible.

## TypeScript practices

- Strict mode is enabled; avoid `any`.
- Use `unknown` with explicit narrowing when needed.
- Favor small pure helpers in `src/utils/*`.
- Keep public helper APIs typed and documented via types.

## Error handling

- Fail fast with clear error messages in scripts.
- Use `try/catch` only where IO or parsing can fail.
- Prefer returning early instead of deep nesting.

## Data and content conventions

- Content collections are defined in `src/content/config.ts`.
- Knowledge content is English-only in `knowledge-en`.
- Prefer `date-fns` for date formatting in UI.
- Use `@utils/readingTime` helpers rather than inline math.

## Accessibility content guidelines (WCAG 2.2 AAA)

- Provide a plain-language summary near the top of each article (2-4 sentences).
- Keep sentences short and direct; prefer active voice and common words.
- Define jargon on first use; add a short glossary if needed.
- Use descriptive headings that stand alone (no "More"/"Overview" headings).
- Link text must be self-contained (avoid "click here" or "read more").
- Avoid relying on emoji for meaning; pair with text.
- Ensure lists and steps are explicit and ordered when sequence matters.

## Lint-staged / hooks

- `lint-staged` runs Prettier + ESLint on `src/**/*.{astro,ts,tsx,js}`.
- Content checks run on staged Markdown files only.
- Husky is enabled via `yarn prepare`.

## Assets and build output

- Static assets go in `public/` or component-local assets.
- Build output goes to `dist/` (ignored by lint/format).

## Cursor / Copilot rules

- No `.cursor/rules`, `.cursorrules`, or `.github/copilot-instructions.md` found.

## If you are unsure

- Start with `README.md` for project context.
- Follow existing patterns in nearby files.
- Run targeted checks before full builds for faster feedback.
