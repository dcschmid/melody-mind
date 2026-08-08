# Render Deployment Guide

## Overview

MelodyMind deploys as five static Astro services on Render. The Blueprint is
defined in [render.yaml](./render.yaml).

| Service               | Domain                   | Build Command                        | Publish Path            |
| --------------------- | ------------------------ | ------------------------------------ | ----------------------- |
| `melody-mind-music`   | `melody-mind.de`         | `pnpm install && pnpm build`         | `apps/music/dist`       |
| `melody-mind-embed`   | `embed.melody-mind.de`   | `pnpm install && pnpm build:embed`   | `apps/music/dist-embed` |
| `melody-mind-quiz`    | `quiz.melody-mind.de`    | `pnpm install && pnpm build:quiz`    | `apps/quiz/dist`        |
| `melody-mind-stories` | `stories.melody-mind.de` | `pnpm install && pnpm build:stories` | `apps/stories/dist`     |
| `melody-mind-reviews` | `reviews.melody-mind.de` | `pnpm install && pnpm build:reviews` | `apps/reviews/dist`     |

Domains declared in `render.yaml`: Embed, Stories, and Reviews. The Music and
Quiz domains are configured in the Render dashboard instead.

## Setup Instructions

### 1. Create Blueprint in Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New** -> **Blueprint**.
3. Connect the GitHub repository: `dcschmid/melody-mind`.
4. Render will detect `render.yaml` automatically.
5. Review the five services and click **Apply**.

### Blueprint Auto Sync

If Blueprint Auto Sync is enabled:

- Changes to an existing service in `render.yaml` are applied automatically.
- Newly added services in `render.yaml` are created automatically.
- Removed services are not deleted automatically.

### 2. Configure Custom Domains

For services whose domains are not declared in `render.yaml` (Music, Quiz):

1. Go to service -> Settings -> Custom Domains.
2. Add the domain (e.g. `melody-mind.de`, `quiz.melody-mind.de`).
3. Copy the DNS records Render provides.

### 3. Configure DNS Records

In your DNS provider, configure the records Render gives you. Typical setup:

```text
TYPE    NAME        VALUE
A       @           <Render IP from dashboard>
CNAME   quiz        melody-mind-quiz.onrender.com
```

Render provides the exact values after adding the custom domain.

### 4. Verify Deployment

1. Wait for DNS propagation.
2. Check that SSL is provisioned.
3. Test each site (e.g. `https://melody-mind.de`, `https://quiz.melody-mind.de`).

## Configuration Details

### Build Filters

Each service rebuilds only when its app directory or a root deployment file
changes. Example (Music):

```yaml
buildFilter:
  paths:
    - apps/music/**
    - package.json
    - pnpm-lock.yaml
    - turbo.json
    - pnpm-workspace.yaml
    - render.yaml
```

The other services use the same root file list with their own app path
(`apps/quiz/**`, `apps/stories/**`, `apps/reviews/**`; Embed also watches
`apps/music/**`).

### Security Headers

All services set `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
`Permissions-Policy`, a strict `Content-Security-Policy`, and Cache-Control
headers. Music, Quiz, Stories, and Reviews additionally set
`X-Frame-Options: DENY`; the Embed service allows framing by any HTTPS parent
(`frame-ancestors https:`) instead, because it exists to be embedded.

The exact values live in `render.yaml` and are the source of truth — do not
duplicate them here.

### Cache Headers

| Path                            | Cache-Control                                        |
| ------------------------------- | ---------------------------------------------------- |
| `/*`                            | `public, max-age=0, must-revalidate`                 |
| `/assets/*`                     | `public, max-age=31536000, immutable`                |
| `/audio/*` (Music only)         | `public, max-age=31536000, immutable`                |
| `/player-queues/*` (Music only) | `public, max-age=3600, stale-while-revalidate=86400` |

Self-hosted fonts are emitted under `/assets/*` by the Astro fonts API, so the
`/assets/*` rule covers them.

### Environment Variables

| Variable       | Value | Description                                            |
| -------------- | ----- | ------------------------------------------------------ |
| `NODE_VERSION` | `22`  | Required for Astro 7 (see root `package.json` engines) |

## Local Testing

```bash
pnpm install
pnpm build && pnpm preview            # Music
pnpm build:embed                      # Embed bundle (apps/music/dist-embed)
pnpm build:quiz && pnpm preview:quiz
pnpm build:stories && pnpm preview:stories
pnpm build:reviews && pnpm preview:reviews
```

For package-scoped runs:

```bash
pnpm --filter music build
pnpm --filter music preview
```

## Adding Another App

1. Add the app under `apps/` with its own `package.json` and a root
   `build:<app>` script.
2. Add a matching service block in `render.yaml` (copy the header set from an
   existing service and adjust the CSP to the app's needs).
3. Update the Blueprint in Render and add a custom domain if needed.

## Troubleshooting

### Build Fails

- Check Node.js version: `node --version` must be 22+.
- Verify `pnpm-lock.yaml` is committed.
- Check Render build logs for the specific error.
- Test locally with the app's build command (see Local Testing).

### Domain Not Working

- Wait for DNS propagation.
- Verify DNS records match Render's instructions exactly.
- Check domain verification status in Render.
- If using Cloudflare, verify whether the record should be DNS-only.

### 404 on Subpages

- Ensure the app's `astro.config.mjs` has the correct `site` URL.
- Check the app's `dist/` directory contains the generated route HTML files.
- Verify the sitemap includes the expected routes.

### Changes Not Deploying

- Check that the changed file path is included in the service's
  `buildFilter.paths` in `render.yaml`.
