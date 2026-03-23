# Quiz App

The Quiz app serves MelodyMind's music-history quiz experience. It is a smaller app than
Knowledge, but it still uses the same shared app-shell, SEO, image, and theme
infrastructure.

## What This App Owns

- the quiz landing page
- quiz detail routes
- quiz-specific content and category mapping
- quiz-specific asset resolution
- app-local layout decisions such as showing or hiding header/footer in certain flows

## Directory Structure

```text
src/
├── assets/
│   └── category/
├── constants/
├── content/
│   └── quizzes/
├── layouts/
├── pages/
├── scripts/
│   └── quiz/
└── utils/
```

## Shared Dependencies

The Quiz app intentionally leans on the workspace packages for common behavior:

- `@melody-mind/shared-ui`: shared cards, layout primitives, navigation, footer, media,
  and theme tokens
- `@melody-mind/shared-utils`: shared SEO helpers, URL helpers, app-shell config types,
  and related utilities

This means new quiz features should usually reuse existing shared patterns before adding
local alternatives.

## Images

Visible quiz images are handled through Astro assets in `src/assets/` rather than `public`
image paths. Shared rendering comes from the shared UI package, while quiz-specific asset
mapping stays in the app.

## Commands

### Development

```bash
pnpm --filter quiz dev
pnpm --filter quiz preview
```

### Build and Quality

```bash
pnpm --filter quiz build
pnpm --filter quiz build:production
pnpm --filter quiz lint
pnpm --filter quiz lint:check
pnpm --filter quiz format
pnpm --filter quiz format:check
pnpm --filter quiz stylelint
pnpm --filter quiz stylelint:check
```

## Recommended Validation

Typical verification for Quiz changes:

```bash
pnpm --filter quiz format:check
pnpm --filter quiz lint:check
pnpm --filter quiz build
```

Also manually spot-check:

- the landing page
- one or two quiz detail pages
- card and hero imagery
- header/footer visibility when route-level options changed

## Notes

- Astro app with static output
- uses the shared token and app-shell system
- keep component CSS scoped and BEM-based
- keep quiz-domain logic local instead of pushing it into shared packages
