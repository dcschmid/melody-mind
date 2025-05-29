# AchievementFilter Component Documentation

## Overview

The AchievementFilter component provides an interactive filtering interface for achievements in the
MelodyMind application. It enables users to filter achievements by status (locked, in progress,
unlocked) and category (Bronze, Silver, Gold, Platinum, Diamond, Time) while maintaining full WCAG
AAA accessibility compliance and keyboard navigation.

## Component Location

```
📁 src/components/Achievements/
   └── AchievementFilter.astro
```

## API Reference

### Properties

| Property | Type     | Required | Description                            | Default |
| -------- | -------- | -------- | -------------------------------------- | ------- |
| `lang`   | `string` | Yes      | Language code for internationalization | -       |

### TypeScript Interfaces

```typescript
interface FilterState {
  /** Current status filter value */
  status: string;
  /** Current category filter value */
  category: string;
}

interface FilterOption {
  /** Option value */
  value: string;
  /** Localized option label */
  label: string;
}
```

## Usage Examples

### Basic Implementation

```astro
---
import AchievementFilter from "@components/Achievements/AchievementFilter.astro";
---

<AchievementFilter lang="en" />
```

### With Custom Achievement List

```astro
---
import AchievementFilter from "@components/Achievements/AchievementFilter.astro";
import AchievementCard from "@components/Achievements/AchievementCard.astro";
---

<main>
  <AchievementFilter lang={Astro.currentLocale || "en"} />

  <div class="achievements__grid" id="achievement-list">
    {achievements.map((achievement) => <AchievementCard achievement={achievement} lang={lang} />)}
  </div>
</main>
```

## Accessibility Features

### WCAG AAA Compliance

- **Color Contrast**: Maintains 7:1 contrast ratio compliance for all text elements
- **Focus Management**: Visible focus indicators for all interactive elements
- **Keyboard Navigation**: Full keyboard accessibility with custom shortcuts
- **Screen Reader Support**: ARIA live regions for filter announcements
- **Touch Accessibility**: Minimum 44×44px touch targets on mobile devices

### Keyboard Shortcuts

| Shortcut  | Action                |
| --------- | --------------------- |
| `Alt + R` | Reset all filters     |
| `Alt + S` | Focus status filter   |
| `Alt + C` | Focus category filter |
| `Alt + K` | Toggle keyboard help  |

## JavaScript Functionality

### Core Features

1. **Progressive Enhancement**: Works without JavaScript, enhanced with interactive features
2. **Real-time Filtering**: Immediate visual feedback on filter changes
3. **Keyboard Shortcuts**: Alt-based shortcuts for power users
4. **Screen Reader Announcements**: Live updates for accessibility
5. **Count Updates**: Dynamic display of visible achievement counts

### Filter Logic

```typescript
/**
 * Applies filters to achievement cards in the DOM
 * Uses optimized CSS classes for seamless grid layout
 */
private applyFilters(): void {
  const statusFilter = this.statusSelect?.value || "all";
  const categoryFilter = this.categorySelect?.value || "all";

  const achievementSections = document.querySelectorAll(".achievements__category");

  achievementSections.forEach((section: Element) => {
    const cardsInSection = section.querySelectorAll('[data-testid^="achievement-card-"]');
    let visibleCardsInSection = 0;

    cardsInSection.forEach((card: Element) => {
      const cardElement = card as HTMLElement;
      const cardStatus = cardElement.dataset.status || "";
      const cardCategory = cardElement.dataset.category || "";

      const statusMatch = statusFilter === "all" || cardStatus === statusFilter;
      const categoryMatch = categoryFilter === "all" || cardCategory === categoryFilter;

      if (statusMatch && categoryMatch) {
        cardElement.classList.remove("filtered-hidden");
        cardElement.setAttribute("aria-hidden", "false");
        visibleCardsInSection++;
      } else {
        cardElement.classList.add("filtered-hidden");
        cardElement.setAttribute("aria-hidden", "true");
      }
    });
  });
}
```

---

## 2. AchievementCard Component

### Übersicht

Die `AchievementCard`-Komponente ist ein umfassendes UI-Element, das einzelne Achievements mit ihrem
Status, Fortschritt und Metadaten anzeigt. Diese Komponente dient als **Goldstandard** für
barrierefreie interaktive Komponenten im MelodyMind-Projekt und erreicht **98% WCAG 2.2
AAA-Konformität**.

### Komponentenspeicherort

```text
src/components/Achievements/AchievementCard.astro
```

## CSS Architecture

### BEM Methodology

The AchievementFilter component follows the Block Element Modifier (BEM) naming convention:

```css
/* Block */
.achievement-filter {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* Elements */
.achievement-filter__container {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

.achievement-filter__select {
  min-height: 44px;
  padding: var(--space-sm) var(--space-md);
  border: var(--border-width-thin) solid var(--input-border);
  border-radius: var(--radius-md);
  background-color: var(--input-bg);
  color: var(--input-text);
}

/* Modifiers */
.achievement-filter__select--focused {
  border-color: var(--color-primary);
  outline: 2px solid var(--focus-outline);
  outline-offset: 2px;
}
```

### CSS Custom Properties

The component uses semantic CSS variables from the global design system:

```css
.achievement-filter {
  /* Colors */
  background-color: var(--card-bg);
  border: var(--border-width-thin) solid var(--card-border);
  color: var(--text-primary);

  /* Spacing */
  padding: var(--space-lg);
  gap: var(--space-md);

  /* Layout */
  border-radius: var(--radius-lg);
  box-shadow: var(--card-shadow);

  /* Transitions */
  transition: box-shadow var(--transition-normal);
}
```

### Responsive Design

```css
/* Mobile-first approach */
.achievement-filter__container {
  grid-template-columns: 1fr;
}

/* Tablet and above */
@media (min-width: 48em) {
  .achievement-filter__container {
    grid-template-columns: 1fr 1fr;
  }
}

/* Desktop */
@media (min-width: 64em) {
  .achievement-filter__container {
    grid-template-columns: 1fr 1fr auto;
  }
}
```

## Internationalization

### Translation Keys

```typescript
// Filter Interface
"achievements.filter.title": "Filter Achievements"
"achievements.filter.status": "Status"
"achievements.filter.category": "Category"
"achievements.filter.reset": "Reset Filters"

// Status Options
"achievements.status.all": "All Statuses"
"achievements.status.unlocked": "Unlocked"
"achievements.status.in_progress": "In Progress"
"achievements.status.locked": "Locked"

// Category Options
"achievements.category.all": "All Categories"
"achievements.category.bronze": "Bronze"
"achievements.category.silver": "Silver"
"achievements.category.gold": "Gold"
"achievements.category.platinum": "Platinum"
"achievements.category.diamond": "Diamond"
"achievements.category.time": "Time-based"

// Screen Reader Announcements
"achievements.filter.announcement.changed": "Filter changed: {filterType} to {filterValue}"
"achievements.filter.announcement.results": "{visibleCards} achievement{cardPlural} found in {visibleSections} categor{sectionPlural}"
```

### Supported Languages

The component fully supports all MelodyMind languages:

- English (en)
- German (de)
- French (fr)
- Spanish (es)
- Italian (it)
- Dutch (nl)
- Swedish (sv)

## Performance Optimizations

### CSS Optimizations

1. **CSS Containment**: `contain: layout style;` for performance isolation
2. **Will-change Optimization**: Strategic use of `will-change: auto;`
3. **Efficient Transitions**: Only necessary properties transition
4. **Reduced Motion**: Respects `prefers-reduced-motion`

### JavaScript Optimizations

1. **Event Delegation**: Efficient event handling
2. **Debounced Updates**: Prevents excessive DOM manipulation
3. **CSS-only Grid Layout**: Minimal JavaScript for layout changes
4. **Lazy Initialization**: Components initialize only when needed

### Browser Support

- **Modern CSS Features**: Grid, Custom Properties, color-mix
- **Fallbacks**: Graceful degradation for older browsers
- **Progressive Enhancement**: Core functionality works without JavaScript

## Testing and Compliance

### Accessibility Testing

- **Screen Reader Compatibility**: Tested with NVDA, JAWS, VoiceOver
- **Keyboard Navigation**: Full functionality via keyboard only
- **Color Contrast**: Automated testing ensures 7:1 ratio compliance
- **Focus Management**: Logical tab order and visible focus indicators

### Browser Testing

- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Accessibility Tools**: axe-core, Lighthouse Accessibility Audit

### Compliance Standards

- ✅ **WCAG 2.2 AAA**: Full compliance with latest accessibility guidelines
- ✅ **Section 508**: US federal accessibility requirements
- ✅ **EN 301 549**: European accessibility standard
- ✅ **ARIA 1.2**: Latest ARIA specification compliance

## Events

### Custom Events

The AchievementFilter component dispatches custom events for integration with other components:

```typescript
interface FilterChangeEvent extends CustomEvent {
  type: "filter:change";
  detail: {
    filterType: "status" | "category";
    filterValue: string;
    visibleCount: number;
  };
}

interface FilterResetEvent extends CustomEvent {
  type: "filter:reset";
  detail: {
    totalCount: number;
  };
}
```

### Event Usage

```typescript
// Listen for filter changes
document.addEventListener("filter:change", (event: FilterChangeEvent) => {
  console.log(`Filter changed: ${event.detail.filterType} = ${event.detail.filterValue}`);
  updateAnalytics(event.detail);
});

// Listen for filter resets
document.addEventListener("filter:reset", (event: FilterResetEvent) => {
  console.log(`Filters reset, showing ${event.detail.totalCount} achievements`);
  trackFilterReset();
});
```

## Future Considerations

### Planned Enhancements

1. **Search Functionality**: Text-based achievement search
2. **Advanced Sorting**: Multiple sort criteria support
3. **Filter Presets**: Saved filter combinations
4. **Animation Options**: Enhanced visual feedback options

### Technical Debt

1. **Component Separation**: Consider extracting keyboard shortcut panel
2. **State Management**: Evaluate need for centralized filter state
3. **Performance Monitoring**: Add metrics for large achievement lists

## Related Components

- [AchievementCard](./AchievementCard.md) - Individual achievement display
- [AchievementBadge](./AchievementBadge.md) - Navigation notification badge
- [SkipLink](../Shared/SkipLink.md) - Navigation accessibility helper

## Related Documentation

- [Achievement API](../api/achievements.md) - Backend achievement system
- [Achievement Types](../types/Achievements.md) - TypeScript interfaces
- [CSS Variables Guide](../styles/css-variables.md) - Design system reference
- [Accessibility Guidelines](../accessibility/wcag-aaa-optimization.md) - WCAG AAA compliance

## Changelog

### v3.2.0 (Current)

- **Enhanced Accessibility**: WCAG AAA compliance improvements
- **Better Keyboard Navigation**: Detailed focus announcements
- **Improved Screen Reader Support**: Dynamic role switching
- **Performance Optimizations**: RequestAnimationFrame usage

### v3.1.0

- **High Contrast Support**: prefers-contrast and forced-colors media queries
- **Text Spacing Adaptation**: Support for user text spacing settings
- **Enhanced Error Handling**: Graceful localStorage fallbacks

### v3.0.0

- **Breaking**: Switch to CSS Custom Properties exclusively
- **Accessibility**: Full WCAG AAA compliance implementation
- **TypeScript**: Complete type safety with interfaces
- **i18n**: Multi-language support integration

### v2.5.0

- **Feature**: Keyboard navigation support
- **Feature**: Screen reader optimizations
- **Fix**: LocalStorage error handling

### v2.0.0

- **Breaking**: Component restructuring for Astro
- **Feature**: Event-driven architecture
- **Feature**: Persistent count storage
