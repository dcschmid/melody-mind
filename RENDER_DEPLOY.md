# Render Deployment Guide

## Overview

This monorepo uses [Render Blueprints](https://render.com/docs/blueprint-spec) for Infrastructure as Code. The `render.yaml` file defines 3 static sites that deploy for free:

| Service | Domain | Pages | Build Time |
|---------|--------|-------|------------|
| melody-mind-knowledge | melody-mind.de | 85 | ~28s |
| melody-mind-quiz | quiz.melody-mind.de | 21 | ~4s |
| melody-mind-podcasts | podcasts.melody-mind.de | 22 | ~4s |

**Cost: $0/month** (3 free static sites)  
**Previous cost: $7/month** (1 SSR web service)  
**Savings: $84/year**

---

## Setup Instructions

### 1. Create Blueprint in Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Blueprint**
3. Connect your GitHub repository: `dcschmid/melody-mind`
4. Render will detect the `render.yaml` file automatically
5. Review the 3 services and click **Apply**
6. Wait for initial deployment (~2-3 minutes per service)

### Blueprint Auto Sync

If you enable **Auto Sync** for the Blueprint in Render:

- Changes to existing services in `render.yaml` are applied automatically
- Newly added services in `render.yaml` are created automatically
- Removed services are **not** deleted automatically

This is separate from normal service Auto-Deploy on code pushes.

### 2. Configure Custom Domains

After services are deployed, add custom domains:

#### Knowledge Site (`melody-mind-knowledge`)
1. Go to service → Settings → Custom Domains
2. Add domain: `melody-mind.de`
3. Add domain: `www.melody-mind.de` (auto-redirects to root)
4. Note the DNS records Render provides

#### Quiz Site (`melody-mind-quiz`)
1. Go to service → Settings → Custom Domains
2. Add domain: `quiz.melody-mind.de`
3. Note the CNAME record Render provides

#### Podcasts Site (`melody-mind-podcasts`)
1. Go to service → Settings → Custom Domains
2. Add domain: `podcasts.melody-mind.de`
3. Note the CNAME record Render provides

### 3. Configure DNS Records

In your DNS provider (e.g., Cloudflare, Namecheap), configure:

```
# Knowledge (main domain - use A record for root)
TYPE    NAME        VALUE
A       @           → <Render IP from dashboard>
CNAME   www         → melody-mind-knowledge.onrender.com

# Quiz subdomain
TYPE    NAME        VALUE
CNAME   quiz        → melody-mind-quiz.onrender.com

# Podcasts subdomain
TYPE    NAME        VALUE
CNAME   podcasts    → melody-mind-podcasts.onrender.com
```

**Note:** Render provides the exact IP address in the dashboard after adding the custom domain.

### 4. Verify Deployment

1. Wait for DNS propagation (up to 48 hours, usually faster)
2. Check SSL certificates are provisioned (automatic)
3. Test each site:
   - https://melody-mind.de
   - https://quiz.melody-mind.de
   - https://podcasts.melody-mind.de

---

## Configuration Details

### Build Filters

Each service only rebuilds when relevant files change:

```yaml
buildFilter:
  paths:
    - apps/knowledge/**     # App-specific files
    - packages/shared-ui/** # Shared workspace package changes
    - packages/shared-utils/**
    - package.json          # Root config changes
    - pnpm-lock.yaml
    - turbo.json
    - pnpm-workspace.yaml
```

This means:
- Changes to `apps/knowledge/**` → Only knowledge rebuilds
- Changes to `apps/quiz/**` → Only quiz rebuilds
- Changes to `packages/shared-ui/**` or `packages/shared-utils/**` → All apps rebuild
- Changes to root configs → All services rebuild

### Security Headers

All sites have these security headers configured:

| Header | Value |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |

### Cache Headers

Static assets are cached for 1 year with immutable flag:

| Path | Cache-Control |
|------|---------------|
| `/assets/*` | `public, max-age=31536000, immutable` |
| `/fonts/*` | `public, max-age=31536000, immutable` |
| `/audio/*` | `public, max-age=31536000, immutable` (podcasts only) |

### Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_VERSION` | `22` | Required for Astro v6 |

---

## Blueprint File Reference

The complete `render.yaml` structure:

```yaml
services:
  - type: web                    # Static sites use type: web
    name: melody-mind-knowledge  # Service identifier
    runtime: static              # Required for static sites
    buildCommand: pnpm install && pnpm build:knowledge
    staticPublishPath: apps/knowledge/dist
    buildFilter:
      paths:
        - apps/knowledge/**
        - packages/shared-ui/**
        - packages/shared-utils/**
        - package.json
        - pnpm-lock.yaml
        - turbo.json
        - pnpm-workspace.yaml
    headers:
      - path: /*
        name: X-Frame-Options
        value: DENY
    envVars:
      - key: NODE_VERSION
        value: "22"
```

See [Render Blueprint Spec](https://render.com/docs/blueprint-spec) for all available options.

---

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
cd apps/quiz && pnpm preview
cd apps/podcasts && pnpm preview
```

---

## Adding Another App Later

If you later add another app to this monorepo, Render will only create it automatically if
you also add it to `render.yaml`.

Example for a fourth static Astro app:

```yaml
- type: web
  name: melody-mind-new-app
  runtime: static
  buildCommand: pnpm install && pnpm build:new-app
  staticPublishPath: apps/new-app/dist
  buildFilter:
    paths:
      - apps/new-app/**
      - packages/shared-ui/**
      - packages/shared-utils/**
      - package.json
      - pnpm-lock.yaml
      - turbo.json
      - pnpm-workspace.yaml
  headers:
    - path: /*
      name: X-Content-Type-Options
      value: nosniff
  envVars:
    - key: NODE_VERSION
      value: "22"
```

Checklist:

1. Add the app under `apps/<name>`
2. Add a root script like `build:new-app` in [package.json](/home/daniel/dev/github/melody-mind/package.json)
3. Add a new service block to [render.yaml](/home/daniel/dev/github/melody-mind/render.yaml)
4. Push the change
5. If Blueprint Auto Sync is enabled, Render creates the new service automatically
6. Add the custom domain for that new service in the Render dashboard

---

## Troubleshooting

### Build Fails

**Symptom:** Build exits with error code

**Solutions:**
- Check Node.js version: `node --version` (must be 22+)
- Verify `pnpm-lock.yaml` is committed to repo
- Check build logs in Render dashboard for specific error
- Test build locally first: `pnpm build:knowledge`

### Domain Not Working

**Symptom:** Custom domain shows 404 or SSL error

**Solutions:**
- Wait for DNS propagation (up to 48 hours)
- Verify DNS records match Render's instructions exactly
- Check domain verification status in Render dashboard
- Ensure no CNAME flattening if using Cloudflare (use DNS only)

### 404 on Subpages

**Symptom:** Homepage works but subpages return 404

**Solutions:**
- Ensure `astro.config.mjs` has correct `site` URL:
  ```js
  site: 'https://melody-mind.de'
  ```
- Check `dist/` folder contains all HTML files
- Verify sitemap includes all routes

### Changes Not Deploying

**Symptom:** Push to main branch but site doesn't update

**Solutions:**
- Check build filter paths match your changed files
- Verify branch is set to `main` (or your default branch)
- Check Render dashboard for deploy status
- Manual deploy: Service → Manual Deploy → Deploy latest commit

---

## CI/CD Flow

```
Push to main branch
        ↓
Render detects changes
        ↓
Build filter matches?
    ├── Yes → Trigger build
    └── No  → Skip build
        ↓
pnpm install
        ↓
pnpm build:<app>
        ↓
Deploy to .onrender.com
        ↓
Custom domain serves new version
```

---

## Monitoring

### View Logs
1. Go to service in Render dashboard
2. Click **Logs** tab
3. Real-time build and runtime logs

### View Deploys
1. Go to service in Render dashboard
2. Click **Deploys** tab
3. History of all deployments with commit info

### Set Up Alerts
1. Go to Account Settings → Notifications
2. Enable email/Slack notifications for:
   - Deploy successes
   - Deploy failures
   - Service issues

---

## Additional Resources

- [Render Blueprint Spec](https://render.com/docs/blueprint-spec)
- [Render Static Sites](https://render.com/docs/static-sites)
- [Custom Domains on Render](https://render.com/docs/custom-domains)
- [Render CLI](https://render.com/docs/cli) for local validation
