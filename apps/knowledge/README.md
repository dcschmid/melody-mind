# Knowledge App

The Knowledge app is MelodyMind's editorial site for music history, topic exploration, and
taxonomy-driven discovery.

## Focus

- Long-form music knowledge articles in `src/content/knowledge-en/`
- Taxonomy section pages in `src/pages/taxonomy/`
- Article pages in `src/pages/knowledge/[...slug].astro`
- Shared SEO and UI infrastructure from the workspace packages

## Content Model

Knowledge articles use Astro Content Collections with taxonomy-based metadata.

Common frontmatter fields:

- `title`
- `description`
- `keywords`
- `image`
- `createdAt`
- `updatedAt`
- `taxonomySubsection`
- `taxonomyGroup` (optional)
- `takeaways`

The old `category` field is no longer part of the active model.

## Taxonomy

- Source of truth: `src/data/musicTaxonomy.ts`
- Primary route: `src/pages/taxonomy/[section].astro`
- Utility helpers: `src/utils/taxonomy/taxonomyUtils.ts`

Legacy `/categories/*` URLs are handled via redirects from
`src/constants/categoryRedirects.js`.

## Commands

```bash
pnpm --filter knowledge dev
pnpm --filter knowledge build
pnpm --filter knowledge lint
pnpm --filter knowledge lint:check
pnpm --filter knowledge format
pnpm --filter knowledge format:check
pnpm --filter knowledge check:scoped-css
```

## Validation

For Knowledge changes, the usual minimum verification is:

- `pnpm --filter knowledge format:check`
- `pnpm --filter knowledge lint:check`
- `pnpm --filter knowledge build`

If routing or discovery changed, also manually verify:

- taxonomy section pages
- article breadcrumbs
- legacy `/categories/*` redirects

## Related Files

- `astro.config.mjs`
- `src/content.config.ts`
- `src/pages/knowledge/[...slug].astro`
- `src/pages/taxonomy/[section].astro`
- `src/constants/categoryRedirects.js`
- `docs/CATEGORY-TAXONOMY-MIGRATION.md`
