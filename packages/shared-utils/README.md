# Shared Utils

`@melody-mind/shared-utils` contains cross-app utilities used by Knowledge, Quiz, and
Podcasts. It is the low-level shared layer for SEO, URL handling, analytics, consent,
content helpers, and app-shell infrastructure.

## What Belongs Here

- SEO builders and schema helpers
- content loading helpers with generic behavior
- URL and site helpers
- analytics and consent helpers
- theme and storage utilities
- shared app-shell config types and builders
- framework-light helpers that can be reused by multiple apps

## What Does Not Belong Here

- app-specific route assembly
- podcast feed rendering decisions
- knowledge taxonomy grouping logic
- quiz-domain logic
- helpers that only make sense for one app's content model

If a helper starts depending heavily on one app's route structure or content shape, move
that logic back to the app and keep only the reusable primitive here.

## Directory Structure

```text
src/
├── constants/
├── scripts/
└── utils/
    ├── analytics/
    ├── bookmarks/
    ├── cache/
    ├── consent/
    ├── content/
    ├── seo/
    ├── storage/
    └── theme/
```

## Current Responsibilities

### SEO

- page SEO builders
- schema generation
- shared structured-data helpers
- cross-app social/meta support

### URLs and App Shell

- base URL and absolute URL resolution
- trailing slash helpers
- shared app-shell types and SEO context builders

### Client/State Helpers

- analytics events
- consent storage and client helpers
- theme persistence helpers
- general storage wrappers

## Usage

Import utilities through the workspace alias or package path:

```ts
import { buildPageSeo } from "@shared-utils/utils/seo/buildPageSeo";
import { resolveAbsoluteUrl } from "@shared-utils/utils/siteUrls";
```

## Design Guidelines

- keep utilities small and predictable
- prefer plain data in, plain data out
- avoid hidden app assumptions
- do not pull Astro component concerns into shared utils
- if a helper belongs to rendering, it likely belongs in `shared-ui`, not here

## Verification

This package is consumed by multiple apps, so validation should follow the blast radius of
the change.

Typical safe path:

1. run targeted formatting and linting on changed files
2. run the affected app builds
3. if the helper is truly cross-app, run all three app builds

In practice that often means:

```bash
pnpm --filter knowledge build
pnpm --filter quiz build
pnpm build:podcasts
```

## Notes

- The package currently exports directly from `src` via the workspace path.
- Keep helper naming explicit enough that callers do not need to inspect implementation
  just to understand side effects.
