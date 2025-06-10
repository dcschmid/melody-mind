# Achievements Page Documentation

## Overview

The Achievements Page (`/[lang]/achievements.astro`) is a dynamic multilingual page that displays
all available achievements and user progress with comprehensive filtering capabilities. It
implements WCAG AAA accessibility standards and performance optimizations for the MelodyMind music
trivia game.

![Achievements Page Screenshot](../assets/screenshots/achievements-page.png)

## Features

- **Achievement filtering** by category and status
- **Responsive grid layout** with CSS Grid auto-fit
- **Real-time achievement notifications**
- **Progress tracking and statistics**
- **Performance optimized** with lazy loading and event cleanup
- **WCAG AAA compliant** with 7:1 contrast ratios
- **Multilingual support** through i18n system
- **Authentication required** with automatic redirect handling

## Page Structure

### Route Parameters

| Parameter | Type              | Required | Description                                              |
| --------- | ----------------- | -------- | -------------------------------------------------------- |
| `lang`    | SupportedLanguage | Yes      | Language code for localized content (en, de, es, fr, it) |

### Dependencies

```typescript
// Core dependencies
import Layout from "../../layouts/Layout.astro";
import { useTranslations } from "../../utils/i18n.ts";
import { getUserAchievements } from "../../services/achievementService.ts";
import { requireAuth } from "../../middleware/auth.ts";

// Component dependencies
import type { LocalizedAchievement } from "../../types/achievement.ts";
import AchievementCard from "@components/Achievements/AchievementCard.astro";
import AchievementFilter from "@components/Achievements/AchievementFilter.astro";
import AchievementNotification from "@components/Achievements/AchievementNotification.astro";
```

## Data Flow

### 1. Route Generation

```typescript
// Static path generation for all supported languages
export async function getStaticPaths() {
  const supportedLocales = ["en", "de", "es", "fr", "it"];

  return supportedLocales.map((lang) => ({
    params: { lang },
  }));
}
```

### 2. Authentication Flow

```typescript
// Authentication check with redirect handling
const { authenticated, user, redirectToLogin } = await requireAuth(Astro.request);

if (!authenticated || !user) {
  if (redirectToLogin) {
    return redirectToLogin;
  }
}
```

### 3. Data Fetching

```typescript
// Fetch user achievements with error handling
let achievements: LocalizedAchievement[] = [];
let error: Error | null = null;

if (authenticated && user) {
  try {
    achievements = await getUserAchievements(user.id, langString);
  } catch (e) {
    console.error("Error retrieving achievements:", e);
    error = e instanceof Error ? e : new Error(String(e));
  }
}
```

### 4. Data Processing

```typescript
// Achievement categorization and sorting
const achievementsByCategory = achievements.reduce<Record<string, LocalizedAchievement[]>>(
  (acc, achievement) => {
    const categoryId = achievement.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(achievement);
    return acc;
  },
  {}
);

// Sort categories by sortOrder for consistent display
const sortedCategories = Object.entries(achievementsByCategory).sort(
  ([, achievementsA], [, achievementsB]) => {
    const sortOrderA = (achievementsA[0]?.category?.sortOrder as number) || 0;
    const sortOrderB = (achievementsB[0]?.category?.sortOrder as number) || 0;
    return sortOrderA - sortOrderB;
  }
);
```

## UI Components

### Achievement Summary Section

Displays overall achievement statistics:

```astro
<section class="achievements__summary" aria-labelledby="summary-title">
  <h2 id="summary-title" class="achievements__summary-title">
    {t("achievements.summary.title")}
  </h2>
  <div class="achievements__summary-stats" role="list" aria-labelledby="summary-title">
    <!-- Statistics display -->
  </div>
</section>
```

### Achievement Filter Component

```astro
<AchievementFilter lang={langString} />
```

### Category Display

```astro
<section
  class="achievements__category"
  data-category-id={categoryId}
  aria-labelledby={`category-${categoryId}-title`}
>
  <h3
    id={`category-${categoryId}-title`}
    class={`achievements__category-title achievements__category-title--${categoryCode}`}
    aria-describedby={`category-${categoryId}-count`}
  >
    {categoryTitle}
  </h3>
  <div class="achievements__grid" role="list" aria-labelledby={`category-${categoryId}-title`}>
    <!-- Achievement cards -->
  </div>
</section>
```

## CSS Architecture

### Design System Usage

The page follows the MelodyMind design system using CSS custom properties:

```css
/* MANDATORY: All styling uses CSS variables from global.css */
.achievements {
  padding: var(--space-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.achievements__title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--space-lg);
}
```

### Responsive Grid System

```css
/* High-performance responsive grid with CSS Grid auto-fit */
.achievements__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
  gap: var(--space-md);
  padding: var(--space-md) 0;
}

/* Responsive breakpoints */
@media (min-width: 48em) {
  .achievements__grid {
    grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr));
  }
}

@media (min-width: 64em) {
  .achievements__grid {
    grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr));
    max-width: none;
  }
}
```

## Accessibility Implementation

### WCAG AAA Compliance

- **Color Contrast**: 7:1 ratio for normal text, 4.5:1 for large text
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Reader Support**: Comprehensive ARIA attributes and semantic HTML
- **Touch Targets**: Minimum 44×44px touch targets for mobile

### ARIA Implementation

```html
<!-- Screen reader announcements for dynamic content -->
<div role="status" aria-live="polite" aria-atomic="true">
  <!-- Status updates -->
</div>

<!-- Category navigation -->
<nav aria-label="Achievement categories">
  <!-- Category links -->
</nav>

<!-- Achievement lists -->
<div role="list" aria-labelledby="category-title">
  <div role="listitem">
    <!-- Achievement cards -->
  </div>
</div>
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .achievements,
  .achievements__login-button,
  .achievements__grid {
    animation: none;
    transition: none;
  }
}
```

## Performance Optimizations

### Layout Containment

```css
.achievements__grid > * {
  min-width: 0;
  width: 100%;
  contain: layout style; /* Performance: Enable efficient paint and layout containment */
}
```

### Event Cleanup

```typescript
// Performance optimization with proper cleanup
document.addEventListener("astro:page-load", () => {
  initializePagePerformance();
  initializeAchievements();
});

document.addEventListener("astro:before-preparation", cleanup);
window.addEventListener("beforeunload", cleanup);
```

## Internationalization

### Translation Keys

The page uses comprehensive i18n support:

```typescript
// Common translation keys used
const translationKeys = {
  "achievements.title": "Page title",
  "achievements.description": "Page description",
  "achievements.loading": "Loading state",
  "achievements.error": "Error messages",
  "achievements.empty": "Empty state",
  "achievements.summary.title": "Summary section title",
  "achievements.summary.total": "Total count label",
  "achievements.summary.unlocked": "Unlocked count label",
  "achievements.summary.progress": "Progress percentage label",
  "achievements.categories": "Categories section title",
  "achievements.category.count": "Category count description",
  "achievements.category.bronze": "Bronze category",
  "achievements.category.silver": "Silver category",
  "achievements.category.gold": "Gold category",
  "achievements.category.platinum": "Platinum category",
};
```

## Error Handling

### Authentication Errors

```astro
{
  !authenticated && (
    <div class="achievements__auth-required" role="alert">
      <h2 id="auth-title" class="achievements__auth-title">
        {t("auth.required.title")}
      </h2>
      <p class="achievements__auth-description">{t("auth.required.description")}</p>
      <a href={`/${langString}/login`} class="achievements__login-button">
        {t("auth.login.submit")}
      </a>
    </div>
  )
}
```

### Data Loading Errors

```astro
{
  error && (
    <div class="achievements__error" role="alert">
      <p>{t("achievements.error")}</p>
    </div>
  )
}
```

### Empty States

```astro
{
  authenticated && achievements.length === 0 && !error && (
    <div class="achievements__empty" role="status">
      <p>{t("achievements.empty")}</p>
    </div>
  )
}
```

## Integration with Achievement System

### Event System Integration

```astro
<!-- Achievement notification component -->
<AchievementNotification lang={langString} />
```

### Real-time Updates

The page integrates with the achievement event system for real-time updates:

```typescript
// Achievement events are handled by the notification component
// No additional JavaScript needed on the page level
```

## Related Components

- **[AchievementCard](../components/AchievementCard.md)** - Individual achievement display
- **[AchievementFilter](../components/AchievementFilter.md)** - Achievement filtering functionality
- **[AchievementNotification](../components/AchievementNotification.md)** - Real-time achievement
  notifications

## API Integration

- **[/api/achievements/user](../api/user-achievements-endpoint.md)** - User achievements endpoint
- **[Achievement Service](../services/AchievementService.md)** - Server-side achievement logic

## Testing

### Manual Testing Checklist

- [ ] Page loads correctly for all supported languages
- [ ] Authentication redirect works properly
- [ ] Achievement categorization displays correctly
- [ ] Filtering functionality works
- [ ] Responsive design works on all screen sizes
- [ ] Keyboard navigation is fully functional
- [ ] Screen reader compatibility is complete
- [ ] Performance meets standards (Core Web Vitals)

### Accessibility Testing

- [ ] WCAG AAA compliance verified
- [ ] Screen reader testing completed
- [ ] Keyboard-only navigation tested
- [ ] High contrast mode support verified
- [ ] Reduced motion preferences respected

## Performance Metrics

### Target Metrics

- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

### Optimization Techniques

- CSS Grid for efficient layouts
- CSS containment for performance optimization
- Lazy loading for images and dynamic content
- Event cleanup for memory management
- CSS custom properties for consistent theming

## Browser Support

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Progressive Enhancement

The page works with JavaScript disabled, providing:

- Basic achievement display
- Static categorization
- Accessible navigation
- Core functionality

## Changelog

- **v3.0.0** - Added WCAG AAA compliance, improved keyboard navigation, enhanced performance
  optimizations
- **v2.5.0** - Added achievement filtering system and notification integration
- **v2.0.0** - Redesigned with modern CSS Grid and dark mode support
- **v1.5.0** - Added internationalization support for all text
- **v1.0.0** - Initial implementation

---

**Last Updated**: May 29, 2025  
**Page Version**: 3.0.0  
**WCAG Compliance**: AAA (Level 7:1 contrast ratio)  
**Language**: English (as per project documentation standards)
