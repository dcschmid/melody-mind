# Podcast Migration Plan: MelodyMind → podcasts.melody-mind.de

## Overview

Migration der Podcast-Funktionalität von der Haupt-MelodyMind-App zu einer eigenständigen Subdomain
mit vollständiger Multi-Language-Unterstützung (6 Sprachen: en, de, es, fr, it, pt).

## Current State Analysis

### Existing Structure

```
src/
├── data/podcasts/
│   └── en.json (38 episodes, ~192KB)
├── pages/[lang]/
│   ├── podcasts.astro (listing page)
│   ├── podcasts/[id].astro (episode page)
│   └── podcasts/rss.xml.ts (RSS feed)
├── types/podcast.ts
└── components/ (SEO, navigation integration)

public/podcast/ (~23MB audio/media files)
```

### Current Features

- 38 podcast episodes (English only)
- Rich HTML show notes
- Audio streaming with subtitles
- RSS feed generation
- SEO optimization with structured data
- Image optimization
- Navigation integration

## Migration Strategy

### Phase 1: New Repository Setup

Create `melody-mind-podcasts` repository with:

#### 1.1 Base Astro Configuration

```typescript
// astro.config.mjs
export default defineConfig({
  site: "https://podcasts.melody-mind.de",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "es", "fr", "it", "pt"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // ... other configs
});
```

#### 1.2 Directory Structure

```
podcasts-melody-mind/
├── src/
│   ├── data/
│   │   ├── podcasts/
│   │   │   ├── en.json
│   │   │   ├── de.json
│   │   │   ├── es.json
│   │   │   ├── fr.json
│   │   │   ├── it.json
│   │   │   └── pt.json
│   │   └── metadata/
│   │       └── series-info.json
│   ├── pages/
│   │   ├── [lang]/
│   │   │   ├── index.astro
│   │   │   ├── [id].astro
│   │   │   └── rss.xml.ts
│   │   └── index.astro (redirect to /en)
│   ├── components/
│   │   ├── PodcastCard.astro
│   │   ├── PodcastPlayer.astro
│   │   ├── PodcastNavigation.astro
│   │   └── Layout.astro
│   ├── layouts/
│   │   └── PodcastLayout.astro
│   ├── i18n/
│   │   └── locales/
│   │       ├── en.ts
│   │       ├── de.ts
│   │       └── ... (other languages)
│   └── types/
│       └── podcast.ts
├── public/
│   ├── audio/
│   ├── images/
│   └── subtitles/
└── scripts/
    └── migrate-from-main.js
```

### Phase 2: Data Structure Enhancement

#### 2.1 Multi-Language Data Schema

```typescript
interface PodcastDataMultiLang extends PodcastData {
  // Enhanced for multi-language
  translations: {
    [lang: string]: {
      title: string;
      description: string;
      showNotesHtml: string;
    };
  };
  // Original audio remains language-agnostic
  audioUrl: string;
  // Localized subtitles
  subtitles: {
    [lang: string]: string; // VTT URLs
  };
}
```

#### 2.2 Data Migration Script

```javascript
// scripts/migrate-podcast-data.js
// - Copy existing en.json as base
// - Create template structures for other languages
// - Generate translation templates
// - Set up fallback mechanisms
```

### Phase 3: Component Migration & Enhancement

#### 3.1 Core Components to Migrate

- `PodcastCard` (from current listing page)
- `PodcastPlayer` (audio player with subtitles)
- `PodcastNavigation` (prev/next episode)
- `SEO` component (adapted for podcast-specific needs)

#### 3.2 New Components to Create

- `LanguageSwitcher` (podcast-specific)
- `EpisodeTranscript` (expandable transcript viewer)
- `SeriesInfo` (podcast series metadata)
- `SubscriptionButtons` (RSS, Apple Podcasts, etc.)

### Phase 4: Routing & i18n Setup

#### 4.1 Route Structure

```
podcasts.melody-mind.de/
├── / (redirect to /en)
├── /en/
│   ├── / (episode listing)
│   ├── /1950s (episode detail)
│   └── /rss.xml
├── /de/
│   ├── / (German listing)
│   ├── /1950s (same episode, German translation)
│   └── /rss.xml
└── ... (other languages)
```

#### 4.2 i18n Implementation

- Language-specific navigation
- Translated episode metadata
- Localized RSS feeds
- Language-aware SEO

### Phase 5: Integration with Main Site

#### 5.1 Cross-Domain Integration

```typescript
// In main melody-mind repo
// Update navigation to point to podcasts.melody-mind.de
// Remove podcast routes and components
// Add podcast preview/teaser component
```

#### 5.2 Shared Resources

```typescript
// Shared design system package
// Common TypeScript types
// Shared utilities (SEO, i18n helpers)
```

## Technical Implementation Steps

### Step 1: Repository Setup

```bash
# Create new repository
git clone https://github.com/dcschmid/melody-mind-podcasts.git
cd melody-mind-podcasts

# Initialize Astro with TypeScript
yarn create astro@latest . --template=minimal --typescript
yarn add @astrojs/sitemap @astrojs/node

# Install additional dependencies
yarn add @astrojs/tailwind tailwindcss
```

### Step 2: Data Migration

```bash
# Copy existing podcast data
cp -r ../melody-mind/src/data/podcasts ./src/data/
cp ../melody-mind/src/types/podcast.ts ./src/types/

# Run migration script to create multi-language structure
node scripts/create-multilang-structure.js
```

### Step 3: Component Migration

```bash
# Copy and adapt relevant components
cp ../melody-mind/src/components/SEO.astro ./src/components/
# Adapt navigation, remove main game references
# Create podcast-specific layout
```

### Step 4: Testing & Validation

```bash
# Build and test
yarn build
yarn preview

# Test all language routes
# Validate RSS feeds
# Check SEO metadata
# Test audio playback
```

## Content Translation Strategy

### Immediate (Launch):

- English: Complete (existing content)
- German: Machine translation + manual review
- Other languages: Template structure, gradual translation

### Progressive Enhancement:

1. **Phase 1**: Basic metadata translation (titles, descriptions)
2. **Phase 2**: Show notes translation
3. **Phase 3**: Subtitles/transcripts (if feasible)
4. **Phase 4**: Language-specific episodes (future consideration)

## SEO & Performance Considerations

### SEO Migration

- 301 redirects from melody-mind.de/[lang]/podcasts/_ to podcasts.melody-mind.de/[lang]/_
- Update sitemap.xml in main site to remove podcast URLs
- Create new sitemap for podcast subdomain
- Update internal linking strategy

### Performance Optimization

- CDN setup for audio files
- Image optimization for podcast covers
- Progressive loading for episode lists
- Service worker for offline audio caching

## Deployment Strategy

### Infrastructure

```yaml
# render.yaml for podcasts subdomain
services:
  - type: web
    name: podcasts-melody-mind
    env: static
    buildCommand: yarn build
    staticPublishPath: ./dist
    domains:
      - podcasts.melody-mind.de
```

### DNS Configuration

```
CNAME podcasts.melody-mind.de -> melody-mind-podcasts.onrender.com
```

## Timeline & Milestones

### Week 1: Foundation

- [ ] New repository setup
- [ ] Base Astro configuration
- [ ] Data structure design

### Week 2: Migration

- [ ] Component migration
- [ ] Route setup
- [ ] Basic i18n implementation

### Week 3: Enhancement

- [ ] Multi-language data preparation
- [ ] SEO optimization
- [ ] Performance tuning

### Week 4: Testing & Launch

- [ ] Cross-browser testing
- [ ] SEO validation
- [ ] DNS/deployment setup
- [ ] 301 redirects implementation

## Post-Migration Benefits

### For Main Site:

- Reduced build size (~125MB less: 101MB content + 23MB audio)
- Faster builds and deployments
- Cleaner codebase focus on core game

### For Podcast Site:

- Dedicated SEO optimization
- Language-specific content strategy
- Independent scaling and optimization
- Easier content management workflow

### For Development:

- Separated concerns
- Independent deployment cycles
- Specialized tooling per domain
- Easier contributor onboarding for content

## Risks & Mitigation

### SEO Impact

- **Risk**: Loss of domain authority for podcast content
- **Mitigation**: Proper 301 redirects, cross-domain canonical tags, strategic internal linking

### User Experience

- **Risk**: Fragmented navigation between domains
- **Mitigation**: Consistent design system, clear navigation cues, seamless transitions

### Technical Complexity

- **Risk**: Maintaining shared components across repositories
- **Mitigation**: Shared npm packages, documented APIs, automated sync tools

## Success Metrics

### Technical

- [ ] Build time reduction in main site (target: 50%+ faster)
- [ ] Podcast site performance (target: <2s loading time)
- [ ] SEO ranking maintenance (monitor for 3 months post-migration)

### Content

- [ ] Multi-language engagement metrics
- [ ] RSS subscription tracking
- [ ] Audio playback analytics

### Development

- [ ] Deployment frequency improvement
- [ ] Developer productivity metrics
- [ ] Issue resolution time
