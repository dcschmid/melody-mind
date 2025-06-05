# KnowledgeCard Component

## Overview

The KnowledgeCard component is a fully accessible and aesthetically enhanced card component designed for displaying music knowledge articles within the MelodyMind application. It supports both standalone navigation links and integration within parent link elements.

![KnowledgeCard Component](../public/docs/knowledge-card-preview.png)

## Properties

| Property     | Type     | Required | Description                                       | Default           |
| ------------ | -------- | -------- | ------------------------------------------------- | ----------------- |
| title        | string   | Yes      | Title of the knowledge article                    | -                 |
| description  | string   | Yes      | Brief description or excerpt of the article       | -                 |
| image        | string   | No       | Path to the article's cover image                 | "/default-cover.jpg" |
| createdAt    | Date     | Yes      | Date when the article was created/published       | -                 |
| slug         | string   | Yes      | URL slug for the article link                     | -                 |
| lang         | string   | Yes      | Language code (en/de) for localization           | -                 |
| readingTime  | number   | No       | Estimated reading time in minutes                 | 0                 |
| articleUrl   | string   | No       | Complete URL to the article (enables own link)   | undefined         |
| keywords     | string   | No       | Comma-separated keywords for searchability        | undefined         |
| index        | number   | No       | Index for animation delay calculation             | 0                 |

## Usage

### Standalone Card with Own Link

```astro
---
import KnowledgeCard from "../components/KnowledgeCard.astro";

const article = {
  title: "The History of Rock Music",
  description: "Explore the evolution of rock from the 1950s to today, including major influences and breakthrough moments.",
  image: "/images/rock-history.jpg",
  createdAt: new Date('2024-01-15'),
  slug: "history-of-rock-music",
  readingTime: 8,
  keywords: "rock music, history, evolution, 1950s"
};
---

<KnowledgeCard
  title={article.title}
  description={article.description}
  image={article.image}
  createdAt={article.createdAt}
  slug={article.slug}
  lang="en"
  readingTime={article.readingTime}
  articleUrl="/en/knowledge/history-of-rock-music"
  keywords={article.keywords}
  index={0}
/>
```

### Card for Use Within Parent Link

```astro
---
import KnowledgeCard from "../components/KnowledgeCard.astro";
---

<a href="/en/knowledge/jazz-fundamentals" class="article-link">
  <KnowledgeCard
    title="Jazz Fundamentals"
    description="Learn the basic elements that define jazz music including improvisation, swing, and complex harmonies."
    createdAt={new Date('2024-02-10')}
    slug="jazz-fundamentals"
    lang="en"
    readingTime={5}
    index={1}
  />
</a>
```

### Grid Layout Implementation

```astro
---
import KnowledgeCard from "../components/KnowledgeCard.astro";
import type { Article } from "../types/knowledge";

interface Props {
  articles: Article[];
  lang: "en" | "de";
}

const { articles, lang } = Astro.props;
---

<div class="knowledge-grid">
  {articles.map((article, index) => (
    <KnowledgeCard
      title={article.title}
      description={article.description}
      image={article.image}
      createdAt={article.createdAt}
      slug={article.slug}
      lang={lang}
      readingTime={article.readingTime}
      articleUrl={`/${lang}/knowledge/${article.slug}`}
      keywords={article.keywords}
      index={index}
    />
  ))}
</div>

<style>
  .knowledge-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-xl);
    margin: var(--space-2xl) 0;
  }
</style>
```

## Accessibility

The KnowledgeCard component meets WCAG AAA standards with the following features:

- **Color Contrast**: 7:1 contrast ratio for normal text, 4.5:1 for large text
- **Keyboard Navigation**: Full keyboard accessibility with visible focus indicators
- **Screen Reader Support**: Comprehensive ARIA labeling and semantic HTML
- **Touch Targets**: Minimum 44×44px touch targets for mobile accessibility
- **High Contrast Mode**: Support for Windows High Contrast mode
- **Reduced Motion**: Respects `prefers-reduced-motion` user preferences

### ARIA Implementation

```html
<article
  class="knowledge-card"
  aria-labelledby="card-title-article-slug-0"
  aria-describedby="card-title-article-slug-0-desc card-title-article-slug-0-meta"
>
  <a
    href="/article-url"
    class="knowledge-card__link"
    aria-labelledby="card-title-article-slug-0"
    aria-describedby="card-title-article-slug-0-desc"
  >
    <h3 id="card-title-article-slug-0">Article Title</h3>
    <p id="card-title-article-slug-0-desc">Article description...</p>
    <div id="card-title-article-slug-0-meta">
      <time datetime="2024-01-15T00:00:00.000Z" aria-label="Published: January 15, 2024">
        January 15, 2024
      </time>
    </div>
  </a>
</article>
```

## Internationalization

The component supports multiple languages through the i18n system:

### Text Keys Used

```typescript
const i18nKeys = {
  "knowledge.reading.time.label": "Reading time",
  "knowledge.reading.time": "minutes",
  "knowledge.published": "Published",
  "navigation.article.opens": "Link opens in current tab"
};
```

### Language Support

- **English** (`en`): Full support with date formatting
- **German** (`de`): Full support with localized date formatting  
- **Extensible**: Easy to add additional languages through the i18n system

## CSS Architecture

The component uses only CSS custom properties from the global design system:

### CSS Variables Used

#### Layout Variables
```css
--radius-xl                    /* Border radius */
--border-width-thin           /* Border thickness */
--space-xs, --space-sm        /* Spacing scale */
--space-md, --space-lg        /* Padding and margins */
--space-xl, --space-2xl       /* Larger spacing */
```

#### Typography Variables
```css
--text-base, --text-lg        /* Font sizes */
--text-xl, --text-2xl         /* Heading sizes */
--font-bold                   /* Font weights */
--leading-tight               /* Line heights */
--leading-relaxed             /* Paragraph line height */
```

#### Color Variables
```css
--card-bg, --card-border      /* Card appearance */
--card-shadow                 /* Box shadows */
--text-primary                /* Primary text color */
--text-secondary              /* Secondary text color */
--text-tertiary               /* Meta text color */
--interactive-primary         /* Interactive elements */
--color-primary-400           /* Icon colors */
--color-primary-500           /* Accent colors */
```

#### Animation Variables
```css
--transition-normal           /* Standard transitions */
--transition-fast             /* Quick interactions */
--transition-slow             /* Image animations */
--scale-hover                 /* Hover scale factor */
```

## Performance Features

- **Image Optimization**: Uses Astro's optimized Image component with lazy loading
- **CSS Containment**: `contain: layout style` for improved rendering performance
- **Efficient Transitions**: Hardware-accelerated CSS transforms
- **Semantic HTML**: Minimal DOM structure for fast rendering

## Component Variants

### Linked Variant (with articleUrl)
- Renders as a clickable link element
- Includes screen reader announcement for navigation
- Full hover and focus states

### Unlinked Variant (without articleUrl)
- Renders as static content
- Designed for use within parent link elements
- Includes text clamping for title and description
- Overlay gradient for better text readability

## Implementation Notes

- The component automatically generates unique IDs for accessibility
- Image aspect ratio defaults to 16:9 but can be customized via CSS variables
- Reading time display is automatically localized
- Date formatting respects the specified language locale

## Related Components

- [Image](./shared/Image.md) - Astro's optimized image component
- [Icon](./shared/Icon.md) - Icon system implementation
- [Paragraph](./shared/Paragraph.md) - Text content component

## Related Utilities

- [i18n.ts](../utils/i18n.md) - Internationalization utilities
- [date-fns](https://date-fns.org/) - Date formatting library

## Browser Support

- **Modern Browsers**: Full support including CSS Grid, Flexbox, and Custom Properties
- **Fallbacks**: Graceful degradation for older browsers
- **Print Styles**: Optimized for printing with high contrast and simplified layout

## Testing

### Manual Testing Checklist

- [ ] Keyboard navigation works correctly
- [ ] Screen reader announces content properly
- [ ] High contrast mode displays correctly
- [ ] Touch targets are accessible on mobile
- [ ] Print styles render appropriately
- [ ] Reduced motion is respected

### Component Properties Testing

```typescript
// Test data for component validation
const testArticle = {
  title: "Test Article Title That Is Quite Long To Check Clamping Behavior",
  description: "This is a longer description that should demonstrate the text clamping functionality when the component is rendered in the unlinked variant within a parent link element.",
  image: "/test-images/sample-cover.jpg",
  createdAt: new Date('2024-01-15T10:30:00Z'),
  slug: "test-article-slug",
  readingTime: 12,
  keywords: "test, article, knowledge, music"
};
```

## Migration Guide

### From Version 2.x to 3.0

The component structure has been optimized to eliminate code duplication:

**Before (v2.x):**
```astro
<!-- Separate implementations for linked/unlinked variants -->
{hasOwnLink ? (
  <a href={articleUrl}>
    <!-- Duplicated card content -->
  </a>
) : (
  <!-- Duplicated card content -->
)}
```

**After (v3.0):**
```astro
<!-- Unified implementation with reusable components -->
{hasOwnLink ? (
  <a href={articleUrl}>
    <CardContent variant="linked" />
  </a>
) : (
  <CardContent variant="unlinked" />
)}
```

No breaking changes to the component API - all existing props remain the same.

## Changelog

### Version 3.0.0 (Current)

- ✅ **DRY Optimization**: Eliminated code duplication between linked/unlinked variants
- ✅ **CSS Variables**: 100% CSS custom properties usage, no hardcoded values
- ✅ **Enhanced Documentation**: Comprehensive JSDoc and markdown documentation
- ✅ **Performance**: Added CSS containment and optimized animations
- ✅ **Accessibility**: Maintained WCAG AAA compliance with improved focus management

### Version 2.5.0

- ✅ Enhanced hover animations with micro-interactions
- ✅ Improved responsive design for mobile devices
- ✅ Added support for keywords and search functionality

### Version 2.0.0

- ✅ Complete redesign with CSS variables and dark theme
- ✅ WCAG AA compliance implementation
- ✅ Responsive image optimization

### Version 1.0.0

- ✅ Initial KnowledgeCard implementation
- ✅ Basic card layout with title, description, and metadata
