# Render Deployment Guide

## Overview

This monorepo uses Render Blueprints for Infrastructure as Code. The `render.yaml` file defines 3 static sites:

| Site | Domain | Publish Directory |
|------|--------|-------------------|
| Knowledge | melody-mind.de | `apps/knowledge/dist` |
| Quiz | quiz.melody-mind.de | `apps/quiz/dist` |
| Podcasts | podcasts.melody-mind.de | `apps/podcasts/dist` |

## Setup Instructions

### 1. Create Blueprint in Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Blueprint**
3. Connect your GitHub repository (`dcschmid/melody-mind`)
4. Render will detect the `render.yaml` file
5. Review and create the services

### 2. Configure Custom Domains

After services are created, add custom domains in Render Dashboard:

#### Knowledge Site
- Service: `melody-mind-knowledge`
- Add domain: `melody-mind.de`
- Add domain: `www.melody-mind.de` (auto-redirects to root)

#### Quiz Site
- Service: `melody-mind-quiz`
- Add domain: `quiz.melody-mind.de`

#### Podcasts Site
- Service: `melody-mind-podcasts`
- Add domain: `podcasts.melody-mind.de`

### 3. Configure DNS Records

In your DNS provider (e.g., Cloudflare), configure:

```
# Knowledge (main domain)
A       @           → Render IP (from dashboard)
CNAME   www         → melody-mind-knowledge.onrender.com

# Quiz subdomain
CNAME   quiz        → melody-mind-quiz.onrender.com

# Podcasts subdomain
CNAME   podcasts    → melody-mind-podcasts.onrender.com
```

## Build Configuration

Each service has a `buildFilter` to only trigger builds when relevant files change:

```yaml
buildFilter:
  paths:
    - apps/knowledge/**    # Only this app's files
    - package.json         # Root config changes
    - pnpm-lock.yaml
    - turbo.json
    - pnpm-workspace.yaml
```

## Headers Configuration

Security headers are applied to all sites:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

Cache headers for static assets:

- `/assets/*` → 1 year cache (immutable)
- `/fonts/*` → 1 year cache (immutable)
- `/audio/*` → 1 year cache (immutable, podcasts only)

## Cost

- 3 Static Sites: **$0/month** (free tier)
- Previous cost (1 SSR web service): $7/month
- **Savings: $84/year**

## Build Times (approximate)

| App | Pages | Build Time |
|-----|-------|------------|
| Knowledge | 85 | ~28s |
| Quiz | 21 | ~4s |
| Podcasts | 22 | ~4s |

## Troubleshooting

### Build Fails
- Check Node.js version (must be 22+)
- Verify `pnpm-lock.yaml` is committed
- Check build logs in Render dashboard

### Domain Not Working
- Wait for DNS propagation (up to 48 hours)
- Verify CNAME/A records match Render's instructions
- Check domain is verified in Render dashboard

### 404 on Subpages
- Ensure `astro.config.mjs` has correct `site` URL
- Check that routes are generated in sitemap

## Local Testing

Test builds locally before pushing:

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build:knowledge
pnpm build:quiz
pnpm build:podcasts

# Preview locally
cd apps/knowledge && pnpm preview
```
