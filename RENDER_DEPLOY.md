# Render Deployment Guide

## Overview

MelodyMind deploys as one static Astro app on Render:

| Service | Domain | Publish Path |
| --- | --- | --- |
| `melody-mind-music` | `melody-mind.de` | `apps/music/dist` |

The Blueprint is defined in [render.yaml](/home/daniel/dev/github/melody-mind/render.yaml).

## Setup Instructions

### 1. Create Blueprint in Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New** -> **Blueprint**.
3. Connect the GitHub repository: `dcschmid/melody-mind`.
4. Render will detect `render.yaml` automatically.
5. Review the `melody-mind-music` service and click **Apply**.

### Blueprint Auto Sync

If Blueprint Auto Sync is enabled:

- Changes to the existing service in `render.yaml` are applied automatically.
- Newly added services in `render.yaml` are created automatically.
- Removed services are not deleted automatically.

### 2. Configure Custom Domains

After the service is deployed:

1. Go to service -> Settings -> Custom Domains.
2. Add `melody-mind.de`.
3. Add `www.melody-mind.de` if needed.
4. Copy the DNS records Render provides.

### 3. Configure DNS Records

In your DNS provider, configure the records Render gives you. Typical setup:

```text
TYPE    NAME        VALUE
A       @           <Render IP from dashboard>
CNAME   www         melody-mind-music.onrender.com
```

Render provides the exact IP address after adding the custom domain.

### 4. Verify Deployment

1. Wait for DNS propagation.
2. Check that SSL is provisioned.
3. Test `https://melody-mind.de`.

## Configuration Details

### Build Filter

The service rebuilds when Music app or root deployment files change:

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

### Security Headers

| Header | Value |
| --- | --- |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |

### Cache Headers

| Path | Cache-Control |
| --- | --- |
| `/assets/*` | `public, max-age=31536000, immutable` |
| `/fonts/*` | `public, max-age=31536000, immutable` |
| `/audio/*` | `public, max-age=31536000, immutable` |

### Environment Variables

| Variable | Value | Description |
| --- | --- | --- |
| `NODE_VERSION` | `22` | Required for Astro v6 |

## Local Testing

```bash
pnpm install
pnpm build
pnpm preview
```

For package-scoped runs:

```bash
pnpm --filter music build
pnpm --filter music preview
```

## Adding Another App Later

The repository is currently maintained as a single Music app. If another app is added later, add a matching root build script and a new service block in `render.yaml`.

## Troubleshooting

### Build Fails

- Check Node.js version: `node --version` must be 22+.
- Verify `pnpm-lock.yaml` is committed.
- Check Render build logs for the specific error.
- Test locally with `pnpm build`.

### Domain Not Working

- Wait for DNS propagation.
- Verify DNS records match Render's instructions exactly.
- Check domain verification status in Render.
- If using Cloudflare, verify whether the record should be DNS-only.

### 404 on Subpages

- Ensure `apps/music/astro.config.mjs` has the correct `site` URL.
- Check `apps/music/dist/` contains the generated route HTML files.
- Verify the sitemap includes the expected routes.

### Changes Not Deploying

- Check that the changed file path is included in `buildFilter.paths`.
