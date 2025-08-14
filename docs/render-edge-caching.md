# Render Edge Caching Optimization Guide

This document outlines how to optimize the MelodyMind Astro project for Render's Edge Caching
system.

## Overview

Render Edge Caching provides a global CDN for static assets served by paid web services. This guide
explains how to configure our Astro project to maximize cache efficiency and improve performance.

## Cache-Eligible Content

### Automatically Cached Assets

The following file extensions in our project are automatically cache-eligible:

- **Images**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.avif`, `.svg`, `.ico`
- **Fonts**: `.woff`, `.woff2`, `.ttf`, `.otf`, `.eot`
- **Stylesheets**: `.css`
- **Scripts**: `.js`
- **Documents**: `.pdf`
- **Media**: `.mp3`, `.mp4`, `.webm`, `.ogg`
- **Archives**: `.zip`, `.7z`, `.rar`

### Project-Specific Assets

```
public/
├── images/          # All images cached for 1 year
├── fonts/           # Font files cached for 1 year
├── icons/           # Icon files cached for 1 year
├── sounds/          # Audio files cached for 1 year
└── styles/          # CSS files cached for 1 year

dist/_astro/         # Build artifacts cached for 1 year
```

## Configuration Changes Made

### 1. Astro Configuration (`astro.config.mjs`)

```javascript
export default defineConfig({
  output: "server", // In Astro 5.0, use "server" with prerender for hybrid behavior
  build: {
    splitting: true, // Enable code splitting for better caching
  },
  experimental: {
    contentCollectionCache: true,
  },
});
```

**Benefits:**

- Server mode with selective prerendering allows static generation of cacheable pages
- Code splitting creates smaller chunks for better cache efficiency
- Content collection caching reduces build times

### 2. Middleware Cache Headers (`src/middleware.ts`)

Added automatic cache headers for different content types:

```javascript
// Static assets: 1 year cache with immutable flag
Cache-Control: public, max-age=31536000, immutable
CDN-Cache-Control: public, max-age=31536000

// HTML pages: 5 minutes with stale-while-revalidate
Cache-Control: public, max-age=300, stale-while-revalidate=60
```

### 3. Static Page Generation

Added `prerender = true` to eligible pages:

```javascript
// sitemap-index.xml.js
export const prerender = true;
```

## Cache Behavior Monitoring

Use the `CF-Cache-Status` header to monitor cache performance:

- **HIT**: Response served from edge cache ✅
- **MISS**: Response fetched from server and cached
- **DYNAMIC**: Request not cache-eligible (needs optimization)
- **EXPIRED**: Cache entry expired, refreshed from server
- **BYPASS**: Response not cached (check Cache-Control headers)

## Optimization Strategies

### 1. Static vs Dynamic Content

**Make Static (Add `export const prerender = true`):**

- Legal pages (`/legal-notice`, `/privacy-policy`)
- Sitemap files
- RSS feeds
- Landing pages with minimal dynamic content
- Documentation pages

**Keep Dynamic (Default in server mode):**

- User dashboards
- Game sessions
- API endpoints
- User-specific content

### 2. Cache Invalidation

Cache is automatically purged on:

- New deployments
- Manual purge from Render Dashboard
- TTL expiration

### 3. Performance Best Practices

**Asset Optimization:**

```javascript
// Use versioned filenames for cache busting
build: {
  assets: "_astro", // Astro handles versioning automatically
}
```

**Image Optimization:**

```javascript
image: {
  service: {
    entrypoint: "astro/assets/services/sharp",
  },
}
```

**Font Loading:**

```css
/* Preload critical fonts */
<link rel="preload" href="/fonts/font.woff2" as="font" type="font/woff2" crossorigin>
```

## Testing Cache Performance

### 1. Browser Developer Tools

Check response headers:

```bash
curl -I https://melody-mind.de/images/logo.png
# Look for: CF-Cache-Status, Cache-Control headers
```

### 2. Performance Monitoring

Monitor these metrics:

- Time to First Byte (TTFB)
- Largest Contentful Paint (LCP)
- Cache hit ratio
- Asset load times

### 3. Cache Analysis

```bash
# Check cache status for different asset types
curl -I https://melody-mind.de/styles/main.css
curl -I https://melody-mind.de/fonts/font.woff2
curl -I https://melody-mind.de/images/hero.jpg
```

## Troubleshooting

### Common Issues

1. **DYNAMIC status for static assets**
   - Check file extensions are cache-eligible
   - Verify Cache-Control headers are set correctly

2. **BYPASS status for expected cached content**
   - Check for Set-Cookie headers
   - Verify no-cache directives aren't being set

3. **Poor cache hit ratio**
   - Review URL patterns for query parameters
   - Consider prerendering more pages

### Debug Commands

```bash
# Check cache headers
curl -I -H "Accept-Encoding: gzip" https://melody-mind.de/

# Test different asset types
curl -I https://melody-mind.de/_astro/main.12345.css
curl -I https://melody-mind.de/images/cover.jpg
```

## Recommendations

### Immediate Actions

1. ✅ Enable Edge Caching in Render Dashboard
2. ✅ Deploy middleware changes for Cache-Control headers
3. ✅ Switch to hybrid rendering mode
4. ✅ Add prerender to eligible pages

### Future Optimizations

1. **Identify More Static Pages**
   - Analyze page dynamics
   - Add `prerender = true` where appropriate

2. **Optimize Cache TTL**
   - Monitor cache hit ratios
   - Adjust TTL values based on content update frequency

3. **Implement Service Worker**
   - Add client-side caching for better offline experience
   - Cache game assets for faster loading

4. **Monitor Performance**
   - Set up performance monitoring
   - Track cache efficiency metrics
   - Regular performance audits

## Security Considerations

- Static assets are publicly cached
- Ensure no sensitive data in cached responses
- Use appropriate TTL for different content types
- Monitor cache invalidation after security updates

## Conclusion

With these optimizations, the MelodyMind project should see significant performance improvements
through effective edge caching. The server mode with selective prerendering allows us to cache
static content while maintaining dynamic functionality where needed.

Regular monitoring and optimization of cache performance will ensure the best user experience as the
application grows.
