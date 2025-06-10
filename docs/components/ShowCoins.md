# ShowCoins Component

## Overview

The `ShowCoins` component is a highly accessible and performance-optimized display for player coin
counts in the MelodyMind trivia game. It provides real-time updates with WCAG AAA compliant
animations, multi-level feedback based on coin change significance, and comprehensive screen reader
support.

![ShowCoins Component Demo](../../public/docs/showcoins-demo.png)

## Features

- **WCAG AAA Compliance**: Meets all accessibility standards with enhanced focus indicators and
  screen reader support
- **Multi-level Animations**: Different animation intensity based on coin change magnitude (subtle,
  medium, enhanced)
- **Contextual Announcements**: Dynamic screen reader announcements with context-aware messaging
- **Performance Optimized**: Uses Web Animations API, GPU acceleration, and efficient event handling
- **Reduced Motion Support**: Respects user preferences for motion sensitivity
- **High Contrast Mode**: Full support for forced-colors accessibility mode
- **Internationalization**: Complete i18n support with contextual translations

## Properties

| Property     | Type                       | Required | Description                                     | Default |
| ------------ | -------------------------- | -------- | ----------------------------------------------- | ------- |
| initialCount | number                     | No       | The initial coin count to display               | 0       |
| userType     | "authenticated" \| "guest" | No       | User authentication type for contextual display | "guest" |
| showTooltip  | boolean                    | No       | Show tooltip with additional coin information   | false   |
| context      | string                     | No       | Context for screen reader announcements         | "game"  |

## Usage

### Basic Implementation

```astro
---
import ShowCoins from "@components/Shared/ShowCoins.astro";
---

<!-- Simple coin display -->
<ShowCoins initialCount={120} />
```

### Advanced Implementation with Context

```astro
---
import ShowCoins from "@components/Shared/ShowCoins.astro";

// Get player data from game state
const playerCoins = gameState.coins;
const isAuthenticated = user.isLoggedIn;
---

<!-- Contextual coin display with tooltip -->
<ShowCoins
  initialCount={playerCoins}
  userType={isAuthenticated ? "authenticated" : "guest"}
  showTooltip={true}
  context="game"
/>
```

### Dynamic Updates via JavaScript

```javascript
// Update coin count from game logic
window.updateCoinCount(250);

// Custom event dispatch for component communication
document.dispatchEvent(
  new CustomEvent("melody-mind:update-coins", {
    detail: { count: 175 },
  })
);
```

## Animation Levels

The component provides three distinct animation levels based on coin change magnitude:

### Subtle Animation (< 50 coins)

- Scale: 1.1x
- Duration: 300ms
- Color: Standard primary interaction color
- Use case: Small rewards, minor adjustments

### Medium Animation (50-99 coins)

- Scale: 1.15x
- Duration: 450ms
- Color: Enhanced primary or warning colors
- Use case: Moderate achievements, bonus rewards

### Enhanced Animation (100+ coins)

- Scale: 1.2x
- Duration: 600ms
- Color: Prominent success or error indication
- Use case: Major achievements, significant transactions

## Accessibility Features

### WCAG AAA Compliance

- **Color Contrast**: 7:1 ratio for all text and 4.5:1 for large text
- **Focus Management**: Enhanced focus indicators with 3px visible outlines
- **Touch Targets**: Minimum 44×44px interaction areas
- **Keyboard Navigation**: Full keyboard accessibility with logical tab order

### Screen Reader Support

```typescript
// Example of dynamic announcements
"Excellent! Earned 150 coins while playing the game! New total: 270 coins. Progress saved to your account.";
"Great job! Gained 75 coins while completing a challenge. Total: 195 coins.";
"Lost 25 coins while answering quiz questions. Remaining: 170 coins.";
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .coins-count__icon {
    animation: none;
  }

  .coins-count {
    transition: none;
  }
}
```

## Internationalization

The component supports comprehensive i18n with context-aware translations:

### Translation Keys Used

```typescript
const i18nKeys = {
  // Basic display
  "coins.collected": "Coins collected",
  "coins.tooltip.authenticated": "Your earned coins are saved to your account",
  "coins.tooltip.guest": "Sign in to save your coin progress",

  // Announcements by magnitude
  "coins.announce.earned_excellent":
    "Excellent! Earned {difference} coins while {context}! New total: {newCount} coins.",
  "coins.announce.earned_great":
    "Great job! Gained {difference} coins while {context}. Total: {newCount} coins.",
  "coins.announce.earned_normal":
    "Gained {difference} coins while {context}. Total: {newCount} coins.",
  "coins.announce.lost": "Lost {lost} coins while {context}. Remaining: {newCount} coins.",
  "coins.announce.updated": "Coins updated while {context}. Current total: {newCount} coins.",

  // Context descriptions
  "coins.context.game": "playing the game",
  "coins.context.shop": "making a purchase",
  "coins.context.achievement": "earning an achievement",
  "coins.context.bonus": "receiving a bonus",
  "coins.context.daily": "collecting daily reward",
  "coins.context.quiz": "answering quiz questions",
  "coins.context.challenge": "completing a challenge",
  "coins.context.streak": "maintaining a streak",
};
```

## CSS Custom Properties

The component uses MelodyMind's design system through CSS custom properties:

### Core Design Tokens

```css
/* Layout and spacing */
--min-touch-size: 44px;
--space-sm: 8px;
--space-md: 16px;
--radius-lg: 12px;

/* Colors */
--bg-tertiary: /* Background color */ --text-primary: /* Primary text color */
  --border-primary: /* Border color */ --interactive-primary: /* Interactive state color */
  /* Animations */ --transition-normal: 0.2s ease;
--animation-scale-subtle: 1.1;
--animation-scale-medium: 1.15;
--animation-scale-enhanced: 1.2;

/* Focus and accessibility */
--focus-enhanced-outline-dark: 3px solid var(--color-primary-400);
--focus-ring-offset: 2px;
```

## Performance Optimizations

### Web Animations API

- GPU-accelerated animations using `transform` and `scale`
- Efficient keyframe animations with `cubic-bezier` easing
- `will-change` properties for optimized rendering

### Event Handling

- Passive event listeners for better scroll performance
- AbortController for automatic cleanup
- RequestAnimationFrame for smooth updates

### Memory Management

- Proper cleanup in `disconnectedCallback`
- Efficient DOM queries with element caching
- Minimal DOM manipulation during updates

## Implementation Examples

### Game Integration

```astro
---
// src/pages/quiz/[...category].astro
import ShowCoins from "@components/Shared/ShowCoins.astro";
import { getPlayerData } from "@utils/game/player";

const playerData = await getPlayerData(playerId);
---

<div class="game-header">
  <ShowCoins
    initialCount={playerData.coins}
    userType={playerData.isAuthenticated ? "authenticated" : "guest"}
    showTooltip={true}
    context="quiz"
  />
</div>

<script>
  // Update coins when player answers correctly
  function handleCorrectAnswer(pointsEarned: number) {
    const newCoinTotal = currentCoins + Math.floor(pointsEarned / 10);
    window.updateCoinCount(newCoinTotal);
  }
</script>
```

### Shop Integration

```astro
---
import ShowCoins from "@components/Shared/ShowCoins.astro";
---

<div class="shop-header">
  <ShowCoins initialCount={userCoins} userType="authenticated" showTooltip={true} context="shop" />
</div>

<script>
  // Update coins after purchase
  function handlePurchase(itemCost: number) {
    const newTotal = currentCoins - itemCost;
    window.updateCoinCount(newTotal);
  }
</script>
```

## Testing Considerations

### Accessibility Testing

- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Keyboard navigation testing
- High contrast mode verification
- Color contrast validation (WebAIM tools)

### Performance Testing

- Animation frame rate monitoring
- Memory leak detection during rapid updates
- Touch target size validation on mobile devices

### Browser Compatibility

- Web Animations API support
- CSS custom properties support
- Custom elements lifecycle testing

## Related Components

- [Timer](./Timer.md) - Countdown timer with similar animation patterns
- [ScoreDisplay](./ScoreDisplay.md) - Game score visualization
- [ProgressBar](./ProgressBar.md) - Achievement progress indication
- [TooltipWrapper](./TooltipWrapper.md) - Reusable tooltip functionality

## Changelog

- **v3.2.0** - Enhanced multi-level animations based on coin change magnitude
- **v3.1.0** - Added comprehensive context-aware screen reader announcements
- **v3.0.0** - Complete WCAG AAA compliance implementation with enhanced focus management
- **v2.5.0** - Performance optimizations with Web Animations API and GPU acceleration
- **v2.0.0** - Custom element implementation with TypeScript
- **v1.0.0** - Initial release with basic coin display functionality

## Migration Guide

### From v2.x to v3.x

The component maintains backward compatibility, but new accessibility features are available:

```diff
<ShowCoins
  initialCount={coins}
+ userType="authenticated"
+ showTooltip={true}
+ context="game"
/>
```

### Custom Event Changes

```diff
- document.dispatchEvent(new CustomEvent("coin-update", { detail: count }));
+ window.updateCoinCount(count);
```

## Best Practices

1. **Use appropriate context**: Set the `context` prop to match the user's current action
2. **Enable tooltips for new users**: Use `showTooltip={true}` in onboarding flows
3. **Provide user type context**: Always set `userType` based on authentication state
4. **Test with screen readers**: Verify announcement clarity and timing
5. **Monitor performance**: Check animation performance on lower-end devices
