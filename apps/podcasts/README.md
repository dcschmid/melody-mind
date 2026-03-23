# Podcasts App

The Podcasts app is MelodyMind's podcast site. It owns the homepage, episode archive,
episode detail pages, RSS feed generation, and podcast-specific metadata workflows.

## What This App Owns

- podcast homepage and episode routes
- RSS feed generation and XML formatting
- podcast schema and episode schema assembly
- audio metadata maintenance
- podcast-specific asset resolution and publishing helpers

Shared concerns such as UI primitives, app-shell structure, social meta rendering, and URL
helpers are consumed from the workspace packages.

## Directory Structure

```text
src/
├── assets/
│   └── podcast-images/
├── components/
├── constants/
├── content/
│   └── podcasts/
├── data/
├── layouts/
├── pages/
├── types/
└── utils/
```

## Content and Feed Model

The app combines human-authored episode content with generated feed output.

Important areas:

- `src/content/podcasts/`: episode content
- `src/pages/podcast.xml.ts`: RSS route
- `src/utils/rss.ts`: XML rendering and escaping
- `src/utils/podcasts.ts`: episode loading and normalization
- `src/utils/podcastImages.ts`: podcast-specific Astro asset mapping

The Podcasts app intentionally keeps feed and schema logic local. That logic is too
domain-specific to be a good fit for shared packages.

## Images

Visible podcast UI images use Astro assets from `src/assets/`, rendered through the shared
media stack. SEO and RSS image URLs reuse the same imported source assets where possible.

## Commands

### Development

```bash
pnpm --filter podcasts dev
pnpm --filter podcasts preview
```

### Build and Quality

```bash
pnpm --filter podcasts build
pnpm --filter podcasts lint
pnpm --filter podcasts lint:check
pnpm --filter podcasts format
pnpm --filter podcasts format:check
pnpm --filter podcasts stylelint
pnpm --filter podcasts stylelint:check
```

### Podcast-specific Maintenance

```bash
pnpm --filter podcasts update:audio-metadata
pnpm --filter podcasts validate:podcasts
```

Use `validate:podcasts` whenever episode metadata, feed output, duration handling, or RSS
structure changes.

## Recommended Validation

For most Podcasts changes:

```bash
pnpm --filter podcasts format:check
pnpm --filter podcasts lint:check
pnpm --filter podcasts build
```

For metadata or publishing work, also run:

```bash
pnpm --filter podcasts validate:podcasts
```

And manually verify at least:

- the homepage
- one episode detail page
- the generated `dist/podcast.xml`
- image URLs in the feed when touching SEO or asset logic

## Notes

- Astro app with static output
- uses workspace packages for shared UI and shared utilities
- platform brand colors should only represent external platforms directly
- keep RSS/feed logic local even when shared helpers are available for lower-level pieces
