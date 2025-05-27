# AchievementCard Component Documentation

## Overview

The `AchievementCard` component is a comprehensive UI element that displays individual achievements
with their status, progress, and metadata. This component is optimized for performance,
accessibility (WCAG AAA compliance), and internationalization while following MelodyMind's design
standards.

## Component Location

```text
src/components/Achievements/AchievementCard.astro
```

## Properties

| Property      | Type                   | Required | Description                                               |
| ------------- | ---------------------- | -------- | --------------------------------------------------------- |
| `achievement` | `LocalizedAchievement` | ✅       | The achievement object containing all display data        |
| `lang`        | `string`               | ✅       | Language code for internationalization (e.g., "en", "de") |

### LocalizedAchievement Interface

```typescript
interface LocalizedAchievement {
  id: string;
  code: string;
  name: string;
  description: string;
  status: "locked" | "in-progress" | "unlocked";
  progressPercentage: number;
  rarityPercentage: number;
  iconPath?: string;
  category?: AchievementCategory;
  unlockedAt?: Date;
}
```

### AchievementCategory Interface

```typescript
interface AchievementCategory {
  id: string;
  code: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  points: number;
  iconPath: string;
  sortOrder: number;
}
```

## Usage

### Basic Implementation

```astro
---
import AchievementCard from "@components/Achievements/AchievementCard.astro";
import type { LocalizedAchievement } from "@types/achievement";

const achievement: LocalizedAchievement = {
  id: "first-game",
  code: "FIRST_GAME",
  name: "First Steps",
  description: "Play your first game",
  status: "unlocked",
  progressPercentage: 100,
  rarityPercentage: 85.3,
  iconPath: "/icons/achievements/first-game.webp",
  category: {
    id: "bronze-1",
    code: "bronze",
    points: 50,
    iconPath: "/icons/categories/bronze.webp",
    sortOrder: 1,
  },
};
---

<AchievementCard achievement={achievement} lang="en" />
```

### In Progress Achievement

```astro
---
const progressAchievement: LocalizedAchievement = {
  id: "music-master",
  code: "MUSIC_MASTER",
  name: "Music Master",
  description: "Play 100 games",
  status: "in-progress",
  progressPercentage: 65,
  rarityPercentage: 23.7,
  category: {
    id: "gold-1",
    code: "gold",
    points: 500,
    iconPath: "/icons/categories/gold.webp",
    sortOrder: 3,
  },
};
---

<AchievementCard achievement={progressAchievement} lang="de" />
```

### Locked Achievement

```astro
---
const lockedAchievement: LocalizedAchievement = {
  id: "legendary",
  code: "LEGENDARY_PLAYER",
  name: "???",
  description: "A mysterious achievement...",
  status: "locked",
  progressPercentage: 0,
  rarityPercentage: 0.1,
  category: {
    id: "platinum-1",
    code: "platinum",
    points: 2000,
    iconPath: "/icons/categories/platinum.webp",
    sortOrder: 4,
  },
};
---

<AchievementCard achievement={lockedAchievement} lang="en" />
```

## Accessibility Features

### WCAG AAA Compliance

The component implements comprehensive accessibility features to meet WCAG 2.2 AAA standards:

#### Keyboard Navigation

- **Tab Navigation**: Full keyboard support with proper focus indicators
- **Enter/Space Activation**: Both keys trigger card selection
- **Focus Ring**: 3px solid outline with 2px offset for enhanced visibility

#### Screen Reader Support

- **Role Attribution**: `role="button"` for interactive behavior
- **ARIA Labels**: Descriptive labels combining name and status
- **Progress Bar**: Proper `progressbar` role with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- **Hidden Content**: `.sr-only` class for screen reader only information

#### Visual Accessibility

- **High Contrast**: Support for `prefers-contrast: high` media query
- **Reduced Motion**: Respects `prefers-reduced-motion: reduce` preference
- **Color Independence**: Information conveyed through multiple means, not color alone
- **Touch Targets**: Minimum 44x44px touch targets for mobile accessibility

### ARIA Attributes

```html
<div
  class="achievement-card achievement-card--unlocked"
  role="button"
  tabindex="0"
  aria-label="First Steps: Unlocked"
  data-testid="achievement-card"
  data-category="bronze"
  data-status="unlocked"
>
  <!-- Progress bar with proper ARIA -->
  <div
    class="achievement-card__progress-bar"
    role="progressbar"
    aria-valuenow="100"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Progress: 100%"
  ></div>
</div>
```

## Internationalization

### Translation Keys

The component uses the following i18n keys:

```typescript
// Achievement status translations
"achievements.status.unlocked": "Unlocked"
"achievements.status.in_progress": "In Progress ({percent}%)"
"achievements.status.locked": "Locked"

// Points and rarity
"achievements.points": "{points} points"
"achievements.rarity": "{percentage}% of players"
"achievements.rarity.tooltip": "Rarity indicates how many players have earned this achievement"

// Progress indicator
"achievements.progress": "Progress: {progress}%"
```

### Language Support Examples

```astro
---
import { useTranslations } from "@utils/i18n";

const t = useTranslations(lang);
const statusText =
  status === "unlocked"
    ? t("achievements.status.unlocked")
    : status === "in-progress"
      ? t("achievements.status.in_progress", { percent: progressPercentage })
      : t("achievements.status.locked");
---
```

## Achievement Data Structure

The component expects a `LocalizedAchievement` object with the following structure:

```typescript
interface LocalizedAchievement {
  id: string;
  name: string; // Localized achievement name
  description: string; // Localized achievement description
  status: "locked" | "in-progress" | "unlocked";
  progressPercentage: number; // 0-100
  category?: {
    code: "bronze" | "silver" | "gold" | "platinum" | "diamond";
    points: number;
  };
  rarityPercentage: number; // How rare this achievement is (0-100)
  iconPath?: string; // Optional custom icon path
}
```

## Features

### Status Indicators

The component displays three distinct achievement states:

- **Locked**: Grayed out with 70% opacity and grayscale filter
- **In Progress**: Blue accent color with partial progress bar
- **Unlocked**: Green accent color with gold badge and completed progress bar

### Interactive Elements

- **Keyboard Navigation**: Supports Enter and Space key activation
- **Custom Events**: Dispatches `achievement:select` events when clicked
- **Screen Reader Support**: Comprehensive ARIA labels and semantic markup

### Visual Enhancements

- **Smooth Animations**: Hover effects with transform and shadow transitions
- **Progress Visualization**: Animated progress bars with gradient fills
- **Icon Support**: Fallback to trophy icon when custom icon unavailable
- **Responsive Design**: Adapts padding and typography across screen sizes

## Accessibility

### WCAG Compliance Standards

The component meets WCAG AAA standards through:

- **Color Contrast**: 7:1 ratio for normal text, 4.5:1 for large text
- **Touch Targets**: Minimum 44×44px clickable areas
- **Keyboard Navigation**: Full keyboard accessibility with visible focus indicators
- **Screen Reader Support**:
  - Semantic HTML structure with proper roles
  - Descriptive aria-labels combining achievement name and status
  - Progress bars with proper aria attributes
  - Hidden decorative elements with `aria-hidden="true"`

### Focus Management

```css
.achievement-card:focus-visible {
  outline: var(--focus-outline);
  outline-offset: var(--focus-ring-offset);
}
```

### Screen Reader Optimization

- Achievement title includes hidden status text
- Progress containers have descriptive aria-labels
- Decorative icons are hidden from screen readers
- Status badges provide meaningful context

## Language Support

The component supports multiple languages through the i18n system:

### Text Keys Used

```typescript
const i18nKeys = {
  "achievements.status.unlocked": "Unlocked",
  "achievements.status.in_progress": "In Progress ({percent}%)",
  "achievements.status.locked": "Locked",
  "achievements.points": "{points} Points",
  "achievements.rarity": "Earned by {percentage}% of players",
  "achievements.rarity.tooltip": "Achievement rarity percentage",
  "achievements.progress": "Progress: {progress}%",
};
```

### Usage with Different Languages

```astro
<!-- English -->
<AchievementCard achievement={achievement} lang="en" />

<!-- German -->
<AchievementCard achievement={achievement} lang="de" />

<!-- Spanish -->
<AchievementCard achievement={achievement} lang="es" />
```

## CSS Architecture

### Design System Integration

The component uses CSS custom properties from `global.css` for consistency:

```css
.achievement-card {
  /* Layout */
  padding: var(--space-lg);
  border-radius: var(--radius-lg);

  /* Colors */
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--text-primary);

  /* Effects */
  box-shadow: var(--card-shadow);
  transition: var(--transition-normal);
}
```

### BEM Methodology Implementation

The component follows Block Element Modifier (BEM) naming conventions:

```css
/* Block */
.achievement-card {
}

/* Elements */
.achievement-card__header {
}
.achievement-card__content {
}
.achievement-card__title {
}
.achievement-card__description {
}
.achievement-card__meta {
}
.achievement-card__points {
}
.achievement-card__rarity {
}
.achievement-card__progress-container {
}
.achievement-card__progress-bar {
}
.achievement-card__icon {
}
.achievement-card__icon-placeholder {
}
.achievement-card__badge {
}

/* Modifiers */
.achievement-card--unlocked {
}
.achievement-card--in-progress {
}
.achievement-card--locked {
}
```

### CSS Variables Used

#### Global Variables from `global.css`

```css
/* Layout & Spacing */
--space-xs, --space-sm, --space-md, --space-lg, --space-xl
--radius-sm, --radius-md, --radius-lg, --radius-full

/* Typography */
--text-xs, --text-sm, --text-lg, --text-xl
--font-normal, --font-medium, --font-semibold
--leading-tight, --leading-normal

/* Colors */
--text-primary, --text-secondary, --text-tertiary, --text-disabled
--bg-primary, --bg-tertiary
--border-primary, --border-focus
--card-bg, --card-border, --card-shadow, --card-shadow-hover

/* State Colors */
--color-success-400, --color-success-500, --color-success-600
--color-info-500, --color-info-600
--color-neutral-600
--color-primary-600, --color-secondary-600

/* Focus & Interaction */
--focus-outline, --focus-ring-offset
--transition-normal
--min-touch-size
```

#### Component-Specific Variables

```css
.achievement-card {
  --icon-size: 64px;
  --badge-size: 24px;
}
```

### Status-Based Styling

#### Unlocked Achievements

```css
.achievement-card--unlocked {
  border-color: var(--color-success-500);
  background: linear-gradient(
    135deg,
    var(--card-bg) 0%,
    color-mix(in srgb, var(--color-success-500) 5%, transparent) 100%
  );
}

.achievement-card--unlocked:hover {
  border-color: var(--color-success-400);
  box-shadow:
    var(--shadow-xl),
    0 0 40px color-mix(in srgb, var(--color-success-500) 20%, transparent);
}
```

#### In Progress Achievements

```css
.achievement-card--in-progress {
  border-color: var(--color-info-500);
  background: linear-gradient(
    135deg,
    var(--card-bg) 0%,
    color-mix(in srgb, var(--color-info-500) 5%, transparent) 100%
  );
}

.achievement-card--in-progress .achievement-card__progress-bar {
  background: linear-gradient(90deg, var(--color-info-500) 0%, var(--color-primary-600) 100%);
}
```

#### Locked Achievements

```css
.achievement-card--locked {
  opacity: 0.7;
  filter: grayscale(0.5);
}

.achievement-card--locked .achievement-card__title {
  color: var(--text-tertiary);
}

.achievement-card--locked .achievement-card__description {
  color: var(--text-disabled);
}
```

## Events

### Custom Events

The component dispatches custom events for interaction:

```typescript
// Event dispatched when achievement card is clicked
interface AchievementSelectEvent extends CustomEvent {
  detail: {
    category: string; // Achievement category code
    status: string; // Current achievement status
  };
}
```

### Event Handling

```astro
<script>
  document.addEventListener("achievement:select", (event) => {
    const { category, status } = event.detail;
    console.log(`Achievement selected: ${category} (${status})`);

    // Handle achievement selection logic
    if (status === "unlocked") {
      // Show achievement details
    } else if (status === "in-progress") {
      // Show progress information
    }
  });
</script>
```

## Performance Optimizations

### Image Optimization

- WebP format for achievement icons with lazy loading
- Fallback to SVG icons when custom images unavailable
- Proper alt attributes for accessibility (empty for decorative images)

### CSS Performance

- Hardware-accelerated transforms for smooth animations
- Minimal reflows with transform and opacity changes
- Efficient selectors avoiding deep nesting
- Reduced motion support for accessibility preferences

### Bundle Size

- Inline styles scoped to component
- Minimal JavaScript for interaction
- CSS variables reduce duplicate declarations

## Browser Support

### Modern Features Used

- CSS Grid and Flexbox for layout
- CSS Custom Properties (variables)
- CSS `color-mix()` function for overlay effects
- `prefers-reduced-motion` media query
- `prefers-contrast` media query support

### Fallbacks

- Graceful degradation for unsupported CSS features
- Alternative layouts for older browsers
- Semantic HTML ensures basic functionality

## Testing Considerations

### Accessibility Testing

```typescript
// Example accessibility tests
describe("AchievementCard Accessibility", () => {
  test("should have proper ARIA labels", () => {
    // Test aria-label includes achievement name and status
  });

  test("should support keyboard navigation", () => {
    // Test Enter and Space key activation
  });

  test("should meet color contrast requirements", () => {
    // Test WCAG AAA contrast ratios
  });
});
```

### Visual Testing

- Component renders correctly in all three states
- Progress bars display accurate percentages
- Hover and focus states work properly
- Responsive behavior across screen sizes

### Integration Testing

- Custom events fire correctly
- Internationalization works for all supported languages
- Achievement data binding functions properly

## Related Components

- **[AchievementsList](./AchievementsList.md)** - Container for multiple achievement cards
- **[AchievementDetails](./AchievementDetails.md)** - Detailed view of individual achievements
- **[ProgressBar](../Shared/ProgressBar.md)** - Standalone progress visualization
- **[Icon](../Shared/Icon.md)** - Icon component used for achievement badges

## Implementation Notes

### Performance Considerations

- Component uses minimal JavaScript for maximum performance
- CSS transitions are optimized for 60fps animations
- Images are lazy-loaded and optimized for web delivery
- Event listeners are properly scoped to avoid memory leaks

### Design Patterns

- Follows Astro Islands architecture for minimal hydration
- Uses CSS-only hover and focus effects where possible
- Implements progressive enhancement principles
- Maintains semantic HTML structure for accessibility

## Changelog

### v3.0.0 - Current

- Added WCAG AAA compliance with 7:1 contrast ratios
- Enhanced keyboard navigation support
- Improved screen reader optimization
- Added CSS variable system integration
- Implemented BEM methodology for class naming
- Added high contrast and reduced motion support

### v2.5.0

- Added explanation feature for achievement requirements
- Enhanced progress bar animations
- Improved touch target sizes for mobile

### v2.0.0

- Complete redesign with design system integration
- Added dark mode support with semantic color variables
- Improved accessibility with ARIA attributes
- Enhanced responsive design

### v1.0.0

- Initial release with basic achievement display
- Simple hover effects and status indicators
