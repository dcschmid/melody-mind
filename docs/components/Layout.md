# Layout Component Documentation

## Overview

The Layout component serves as the main structural component for all pages in the MelodyMind
application. It implements a fully WCAG AAA-compliant foundation with comprehensive accessibility
features, performance optimizations, and responsive design.

![Layout Component Structure](../public/docs/layout-structure.png)

## Properties

| Property        | Type                                  | Required | Description                         | Default   |
| --------------- | ------------------------------------- | -------- | ----------------------------------- | --------- |
| title           | string                                | Yes      | Page title                          | -         |
| description     | string                                | No       | Page meta description               | undefined |
| keywords        | string                                | No       | Page meta keywords                  | undefined |
| image           | string                                | No       | Social sharing image URL            | undefined |
| type            | "website"｜"article"｜"music"｜"game" | No       | Page content type                   | "website" |
| publishDate     | Date                                  | No       | Content publish date for SEO        | undefined |
| modifiedDate    | Date                                  | No       | Content modification date for SEO   | undefined |
| showHeader      | boolean                               | No       | Whether to show the header          | true      |
| showHeaderIcons | boolean                               | No       | Whether to show icons in the header | true      |
| showCoins       | boolean                               | No       | Whether to show the coin counter    | false     |
| ogMusic         | Object                                | No       | Music-specific OpenGraph meta tags  | undefined |

## Usage

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout
  title="Music Trivia Quiz"
  description="Test your knowledge of music history across multiple genres"
  type="game"
  showCoins={true}
>
  <main>
    <!-- Your page content here -->
  </main>
</Layout>
```

## Accessibility

The Layout component implements the following accessibility features that meet WCAG 2.2 AAA
standards:

- Semantic HTML with proper document structure and landmarks
- Skip link for keyboard navigation
- Focus indicators with high contrast (3px solid purple borders)
- Proper color contrast ratios (7:1 for normal text)
- Base font size of 18px and line height of 1.8 for better readability
- Touch targets sized at least 44×44px for mobile accessibility
- Screen reader announcements for reduced motion
- Reduced motion support for vestibular disorders
- Print-specific styles for better document printing
- Proper language attributes based on user preferences

## Implementation Notes

- Uses Tailwind utility classes for styling
- Implements dark theme by default
- Includes system for screen reader announcements
- Provides optimized font loading with display=swap
- Includes performance optimizations for resource loading
- Implements proper SEO metadata

## Related Components

- [Navigation](./Navigation.md) - Header navigation component
- [Footer](./Footer.md) - Site-wide footer component
- [SkipLink](./SkipLink.md) - Accessibility skip navigation link
- [ShowCoins](./ShowCoins.md) - Coin counter display

## Changelog

- v3.1.0 (16.05.2025) - Entfernt Theme-Toggle-Button, nutzt ausschließlich dunkles Theme
- v3.0.0 - Verbesserte WCAG AAA Konformität mit optimierten Fokus-Indikatoren
- v2.5.0 - Verbesserte Barrierefreiheit und Lokalisierung
- v2.0.0 - Neu gestaltet mit Tailwind CSS und responsivem Layout
- v1.0.0 - Erste Version mit grundlegender Struktur
