# Render Deployment Guide

## Overview

This monorepo deploys 3 static sites to Render (all on free tier):

| Site | Domain | Build Command | Publish Directory |
|------|--------|---------------|-------------------|
| Knowledge | melody-mind.de | `pnpm build:knowledge` | `apps/knowledge/dist` |
| Quiz | quiz.melody-mind.de | `pnpm build:quiz` | `apps/quiz/dist` |
| Podcasts | podcasts.melody-mind.de | `pnpm build:podcasts` | `apps/podcasts/dist` |

## Prerequisites

1. Render account (free tier)
2. GitHub repository connected to Render
3. Custom domains configured in Render dashboard

## Setup Instructions

### 1. Add Build Scripts to Root package.json

The following scripts are already added:

```json
{
  "scripts": {
    "build:knowledge": "turbo run build --filter=knowledge",
    "build:quiz": "turbo run build --filter=quiz", 
    "build:podcasts": "turbo run build --filter=podcasts"
  }
}
```

### 2. Create Static Sites on Render

For each site, create a new **Static Site** in Render:

#### Knowledge Site
- **Name**: melody-mind-knowledge
- **Build Command**: `pnpm install && pnpm build:knowledge`
- **Publish Directory**: `apps/knowledge/dist`
- **Custom Domain**: melody-mind.de

#### Quiz Site
- **Name**: melody-mind-quiz
- **Build Command**: `pnpm install && pnpm build:quiz`
- **Publish Directory**: `apps/quiz/dist`
- **Custom Domain**: quiz.melody-mind.de

#### Podcasts Site
- **Name**: melody-mind-podcasts
- **Build Command**: `pnpm install && pnpm build:podcasts`
- **Publish Directory**: `apps/podcasts/dist`
- **Custom Domain**: podcasts.melody-mind.de

### 3. Environment Variables

Set in Render dashboard for each site:

```
NODE_VERSION=22
```

### 4. Custom Domain Configuration

For each custom domain:
1. Add domain in Render dashboard
2. Configure DNS records:
   - **A Record**: Point to Render's IP (provided in dashboard)
   - **CNAME**: For subdomains (quiz, podcasts)

## Cost Savings

**Before (single app with SSR):**
- 1 Web Service: $7/month

**After (3 static sites):**
- 3 Static Sites: $0/month (free tier)
- **Savings**: $84/year

## Troubleshooting

### Build Fails
- Check Node.js version (must be 22+)
- Verify all dependencies in pnpm-lock.yaml

### Domain Not Working
- Wait for DNS propagation (up to 48 hours)
- Verify CNAME/A records in DNS provider

### 404 on Subpages
- Ensure `astro.config.mjs` has correct `site` URL
- Check sitemap generation

## Build Times (approximate)

- Knowledge: ~28s
- Quiz: ~4s
- Podcasts: ~4s
- **Total parallel**: ~42s
