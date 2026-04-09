# Knowledge App

The Knowledge app is MelodyMind's editorial music knowledge product. It combines long-form
articles, taxonomy-driven discovery, search, legal pages, and supporting content tooling.

## What This App Owns

- editorial music articles in `src/content/knowledge-en/`
- taxonomy landing pages and taxonomy-driven navigation
- article pages, related content, and discovery flows
- Knowledge-specific SEO builders and page assembly logic
- redirects from historical category URLs to the current taxonomy model

Shared concerns such as cards, navigation, SEO primitives, app-shell config types, and
image rendering are consumed from the workspace packages rather than reimplemented here.

## Directory Structure

```text
src/
├── assets/
│   ├── category/
│   ├── knowledge/
│   └── taxonomy/
├── components/
├── constants/
├── content/
│   └── knowledge-en/
├── data/
├── layouts/
├── pages/
│   ├── knowledge/
│   └── taxonomy/
├── types/
└── utils/
    ├── knowledge/
    ├── legal/
    └── taxonomy/
```

## Content Model

Knowledge content uses Astro Content Collections and is English-only in the active app.

Common article frontmatter fields:

- `title`
- `description`
- `keywords`
- `image`
- `createdAt`
- `updatedAt`
- `taxonomySubsection`
- `taxonomyGroup` (optional)
- `takeaways`

The old `category` field is no longer part of the active information model.

## Taxonomy Model

Taxonomy is the primary structure for the Knowledge app.

- source of truth: `src/data/musicTaxonomy.ts`
- primary route: `src/pages/taxonomy/[section].astro`
- utility helpers: `src/utils/taxonomy/`
- article page helpers: `src/utils/knowledge/`

Legacy `/categories/*` URLs are handled through redirect mappings in
`src/constants/categoryRedirects.js`.

When changing taxonomy:

1. update the source data
2. verify taxonomy routes
3. verify article assignment via `taxonomySubsection` and optional `taxonomyGroup`
4. verify old `/categories/*` URLs still resolve correctly

## Images

Visible Knowledge UI images are stored in `src/assets/` and rendered through Astro assets.
Inline article figures also use local app assets instead of `public/knowledge/...` image
paths.

Current split of responsibility:

- app-local asset resolution and content-specific image mapping stay in Knowledge
- shared rendering primitives come from `@melody-mind/shared-ui`
- shared asset/URL helpers come from `@melody-mind/shared-utils`

## Commands

### Development

```bash
pnpm --filter knowledge dev
pnpm --filter knowledge preview
```

### Build and Quality

```bash
pnpm --filter knowledge build
pnpm --filter knowledge lint
pnpm --filter knowledge lint:check
pnpm --filter knowledge format
pnpm --filter knowledge format:check
pnpm --filter knowledge stylelint
pnpm --filter knowledge stylelint:check
pnpm --filter knowledge check:scoped-css
pnpm --filter knowledge check:seo
```

### Content Tooling

```bash
pnpm --filter knowledge convert-images
pnpm --filter knowledge convert-images:exec
pnpm --filter knowledge convert-images:exec:delete
```

The scripts under `scripts/` are documented separately in
[scripts/README.md](/home/daniel/dev/github/melody-mind/apps/knowledge/scripts/README.md).

## Recommended Validation

For most Knowledge changes, the minimum verification is:

```bash
pnpm --filter knowledge format:check
pnpm --filter knowledge lint:check
pnpm --filter knowledge build
```

Additionally verify these cases when relevant:

- taxonomy changes: section pages, breadcrumbs, related article groupings
- redirect changes: historical `/categories/*` routes
- content tooling changes: dry-run first, then apply
- article/media changes: spot-check optimized figures and SEO images

## Important Files

- `astro.config.mjs`
- `src/content.config.ts`
- `src/data/musicTaxonomy.ts`
- `src/pages/knowledge/[...slug].astro`
- `src/pages/taxonomy/[section].astro`
- `src/utils/knowledge/articlePage.ts`
- `src/utils/taxonomy/taxonomyPage.ts`
- `src/constants/categoryRedirects.js`
- `docs/CATEGORY-TAXONOMY-MIGRATION.md`

## Notes

- Keep app logic about taxonomy, article assembly, and redirects inside Knowledge.
- Do not move taxonomy-specific decisions into shared packages.
- Prefer the shared UI/layout/SEO/image stack when adding new presentation features.
