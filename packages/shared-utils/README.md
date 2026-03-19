# Shared Utils

`@melody-mind/shared-utils` contains cross-app utilities for SEO, content loading,
analytics, URL building, logging, and related helpers.

## Scope

- SEO builders and schema helpers
- content collection helpers
- date and reading-time utilities
- analytics helpers
- site URL helpers
- logging helpers

## Usage

Import utilities through the workspace alias or package path, for example:

```ts
import { buildPageSeo } from "@shared-utils/utils/seo/buildPageSeo";
```

## Notes

- Keep utilities framework-light and reusable across apps.
- Prefer app-specific decisions in the app layer, not in shared helpers.
- If a helper starts depending on one app's route model or content shape too heavily,
  move that logic back into the app.

## Verification

Because this package is consumed by multiple apps, the safest validation path after shared
utility changes is:

- targeted formatting/linting for changed files
- `pnpm --filter knowledge build`
- and any other app build affected by the touched utility
