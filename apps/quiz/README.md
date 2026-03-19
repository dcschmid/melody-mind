# Quiz App

The Quiz app serves MelodyMind's music history quiz experience.

## Focus

- Quiz landing page and quiz detail routes
- Shared design system usage through `@melody-mind/shared-ui`
- Shared SEO and utility helpers through `@melody-mind/shared-utils`

## Commands

```bash
pnpm --filter quiz dev
pnpm --filter quiz build
pnpm --filter quiz lint
pnpm --filter quiz lint:check
pnpm --filter quiz format
pnpm --filter quiz format:check
```

## Validation

Typical verification for Quiz changes:

- `pnpm --filter quiz format:check`
- `pnpm --filter quiz lint:check`
- `pnpm --filter quiz build`

## Notes

- Astro app with static output
- Uses the shared token system from `packages/shared-ui`
- Keep component CSS scoped and BEM-based
