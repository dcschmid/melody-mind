# AchievementCard Component Documentation

## Overview

The `AchievementCard` component is a comprehensive UI element designed to display individual
achievements in the MelodyMind trivia game. It provides visual feedback for achievement status,
progress tracking, and interactive elements while maintaining strict accessibility and
internationalization standards.

## Features

### Core Functionality

- **Multi-state Display**: Supports unlocked, in-progress, and locked achievement states
- **Progress Visualization**: Animated progress bars with percentage indicators
- **Interactive Elements**: Keyboard navigation and click handlers with custom events
- **Status Indicators**: Visual badges and state-specific styling

### Accessibility (WCAG AAA Compliant)

- **Screen Reader Support**: Comprehensive ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility with Enter/Space activation
- **Focus Management**: Visible focus indicators with proper contrast ratios
- **Reduced Motion**: Respects user's motion preferences
- **High Contrast**: Enhanced borders and colors for high contrast displays

### Internationalization

- **Multi-language Support**: All text content is localized
- **RTL Support**: Layout adapts to right-to-left languages
- **Cultural Formatting**: Numbers and percentages formatted per locale

### Performance

- **Lazy Loading**: Images are loaded only when needed
- **Optimized Assets**: WebP format support for better compression
- **Minimal JavaScript**: Client-side code is optimized and non-blocking

## Props Interface

```typescript
interface Props {
  /** The achievement object containing all display data */
  achievement: LocalizedAchievement;
  /** Language code for internationalization (e.g., "en", "de") */
  lang: string;
}
```

### LocalizedAchievement Type

```typescript
interface LocalizedAchievement {
  id: string;
  code: string;
  name: string;
  description: string;
  status: "unlocked" | "in-progress" | "locked";
  progressPercentage: number;
  rarityPercentage: number;
  iconPath?: string;
  category: AchievementCategory;
}
```

## Usage Examples

### Basic Usage

```astro
---
import AchievementCard from "@components/Achievements/AchievementCard.astro";

const achievement = {
  id: "first-game",
  code: "FIRST_GAME",
  name: "Getting Started",
  description: "Complete your first game",
  status: "unlocked",
  progressPercentage: 100,
  rarityPercentage: 85.2,
  iconPath: "/icons/first-game.webp",
  category: { code: "bronze", points: 100 },
};
---

<AchievementCard achievement={achievement} lang="en" />
```

### In-Progress Achievement

```astro
---
const progressAchievement = {
  id: "music-master",
  code: "MUSIC_MASTER",
  name: "Music Master",
  description: "Answer 500 questions correctly",
  status: "in-progress",
  progressPercentage: 73,
  rarityPercentage: 12.4,
  iconPath: "/icons/music-master.webp",
  category: { code: "gold", points: 1000 },
};
---

<AchievementCard achievement={progressAchievement} lang="de" />
```

### Grid Layout

```astro
---
import AchievementCard from "@components/Achievements/AchievementCard.astro";
const achievements = await getPlayerAchievements(playerId);
---

<div class="achievements-grid">
  {
    achievements.map((achievement) => (
      <AchievementCard achievement={achievement} lang={currentLang} />
    ))
  }
</div>

<style>
  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-lg);
    padding: var(--space-lg);
  }
</style>
```

## Event Handling

The component emits custom events that can be handled by parent components:

```javascript
// Listen for achievement selection events
document.addEventListener("achievement:select", (event) => {
  const { category, status } = event.detail;
  console.log(`Achievement selected: ${category} (${status})`);

  // Handle achievement interaction
  if (status === "unlocked") {
    showAchievementDetails(event.detail);
  }
});
```

## Styling and Theming

### CSS Architecture

The component follows BEM methodology and uses the global design system:

```css
/* Block */
.achievement-card {
}

/* Elements */
.achievement-card__header {
}
.achievement-card__icon {
}
.achievement-card__content {
}
.achievement-card__title {
}

/* Modifiers */
.achievement-card--unlocked {
}
.achievement-card--in-progress {
}
.achievement-card--locked {
}
```

### Custom Styling

```css
/* Override component spacing */
.achievement-card {
  --card-padding: var(--space-xl);
}

/* Custom status colors */
.achievement-card--unlocked {
  --status-color: var(--color-success-500);
}

.achievement-card--in-progress {
  --status-color: var(--color-info-500);
}
```

### CSS Variables Used

The component leverages the global design system variables:

- **Spacing**: `--space-xs` through `--space-3xl`
- **Colors**: `--color-primary-*`, `--color-success-*`, `--color-info-*`
- **Typography**: `--text-xs` through `--text-xl`, `--font-*`
- **Borders**: `--radius-*`, `--border-*`
- **Shadows**: `--shadow-*`, `--card-shadow-*`
- **Focus**: `--focus-outline`, `--focus-ring-offset`

## Accessibility Features

### WCAG AAA Compliance

- **Color Contrast**: All text meets AAA contrast ratios (7:1 minimum)
- **Focus Indicators**: Visible focus rings with 3px minimum thickness
- **Interactive Size**: All interactive elements meet 44px minimum touch target
- **Motion Sensitivity**: Animations respect `prefers-reduced-motion`

### Screen Reader Support

```html
<!-- Comprehensive ARIA labeling -->
<div role="button" tabindex="0" aria-label="Music Master: 73% complete, 1000 points">
  <h3>
    Music Master
    <span class="sr-only">73% complete</span>
  </h3>
  <div role="progressbar" aria-valuenow="73" aria-valuemin="0" aria-valuemax="100"></div>
</div>
```

### Keyboard Navigation

- **Tab Navigation**: Logical tab order through interactive elements
- **Activation**: Enter and Space keys trigger selection
- **Focus Management**: Focus indicators remain visible until blur

## Performance Considerations

### Image Optimization

```astro
<Image
  src={iconPath}
  alt=""
  width={64}
  height={64}
  loading="lazy"
  format="webp"
  aria-hidden="true"
/>
```

### JavaScript Optimization

- **Minimal Footprint**: Only essential interaction code
- **Event Delegation**: Efficient event handling for multiple cards
- **No Dependencies**: Pure vanilla JavaScript implementation

### CSS Optimization

- **CSS Variables**: Leverages global design tokens
- **Efficient Selectors**: Minimal specificity and nesting
- **Responsive Design**: Mobile-first approach with progressive enhancement

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **CSS Features**: CSS Grid, Flexbox, CSS Variables, color-mix()
- **JavaScript Features**: ES6+, Custom Events, Event Delegation

## Testing

### Accessibility Testing

```bash
# Run accessibility audits
npm run test:a11y

# Check color contrast
npm run test:contrast

# Validate keyboard navigation
npm run test:keyboard
```

### Component Testing

```typescript
// Example test structure
describe("AchievementCard", () => {
  test("renders achievement data correctly", () => {
    // Test implementation
  });

  test("handles keyboard navigation", () => {
    // Test implementation
  });

  test("emits selection events", () => {
    // Test implementation
  });
});
```

## Common Issues and Solutions

### Problem: Icons not loading

**Solution**: Ensure iconPath is absolute and images exist in public directory

### Problem: Progress bar not animating

**Solution**: Check for `prefers-reduced-motion` setting and CSS transition support

### Problem: Focus indicators not visible

**Solution**: Verify CSS custom properties are defined and contrast meets requirements

### Problem: Events not firing

**Solution**: Ensure event listeners are attached after DOM content is loaded

## Related Components

- **AchievementGrid**: Container for multiple achievement cards
- **AchievementModal**: Detailed view for individual achievements
- **ProgressBar**: Standalone progress indicator component
- **Badge**: Status indicator component

## Migration Guide

### From v1.x to v2.x

```astro
<!-- Old syntax -->
<AchievementCard
  id={achievement.id}
  name={achievement.name}
  status={achievement.status}
  lang={lang}
/>

<!-- New syntax -->
<AchievementCard achievement={achievement} lang={lang} />
```

## Contributing

When modifying this component:

1. **Maintain Accessibility**: Always test with screen readers
2. **Follow BEM**: Use established naming conventions
3. **Use Design Tokens**: Leverage global CSS variables
4. **Test Internationalization**: Verify with multiple languages
5. **Document Changes**: Update this documentation file

## References

- [WCAG AAA Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/)
- [BEM Methodology](https://bem.info/)
- [Astro Component Guide](https://docs.astro.build/en/core-concepts/astro-components/)
- [MelodyMind Design System](../architecture/design-system.md)
