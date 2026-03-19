# Podcasts App

The Podcasts app is MelodyMind's podcast site, including episode pages, RSS generation,
search entry points, and podcast metadata tooling.

## Focus

- Episode pages and podcast homepage
- RSS and podcasting metadata
- Audio metadata maintenance scripts
- Shared UI and shared utility usage from the workspace packages

## Commands

```bash
pnpm --filter podcasts dev
pnpm --filter podcasts build
pnpm --filter podcasts lint
pnpm --filter podcasts lint:check
pnpm --filter podcasts format
pnpm --filter podcasts format:check
```

## Podcast-specific Scripts

```bash
pnpm --filter podcasts update:audio-metadata
pnpm --filter podcasts validate:podcasts
```

## Validation

Typical verification for Podcasts changes:

- `pnpm --filter podcasts format:check`
- `pnpm --filter podcasts lint:check`
- `pnpm --filter podcasts build`

For metadata or publishing work, also run:

- `pnpm --filter podcasts validate:podcasts`

## Notes

- Astro app with static output
- Uses shared components from `packages/shared-ui`
- Uses workspace utilities from `packages/shared-utils`
- Keep platform brand colors only where they represent external platforms directly
