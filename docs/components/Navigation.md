# Navigation Component

## Overview

The Navigation component is the main responsive navigation system for MelodyMind, providing a
comprehensive mobile-first menu with accessibility support, authentication-aware content, and
multi-language functionality. It implements WCAG 2.2 AAA standards and serves as the primary
navigation interface across the application.

![Navigation Component](../../public/docs/navigation-component.png)

## Features

### Core Functionality

- **Responsive hamburger menu** with slide-out navigation
- **Authentication-aware content** showing/hiding based on user status
- **Multi-language support** with dynamic route generation
- **Session timeout warnings** for authenticated users
- **Donation links** with external site indicators
- **Achievement badge integration** with real-time updates

### Accessibility Features

- **WCAG 2.2 AAA compliance** with enhanced focus management
- **Full keyboard navigation** with logical tab order
- **Screen reader optimization** with ARIA live regions
- **Focus trap implementation** within open menu
- **Enhanced target sizes** (minimum 44×44px)
- **High contrast mode support** with border enhancements
- **Reduced motion support** for users with vestibular disorders

### Performance Optimizations

- **Dynamic import** of session timeout utilities
- **Event-driven authentication** monitoring with cookie watching
- **Optimized polling** with exponential backoff for network resilience
- **Background task management** with proper cleanup
- **Memory leak prevention** with event listener management

## Properties

| Property        | Type    | Required | Description                                                                            | Default |
| --------------- | ------- | -------- | -------------------------------------------------------------------------------------- | ------- |
| showHeaderIcons | boolean | No       | Controls visibility of additional navigation icons (Knowledge, Playlists, Rules, etc.) | true    |

## Usage

### Basic Implementation

```astro
---
import Navigation from "@components/Header/Navigation.astro";
---

<!-- Standard navigation with all icons -->
<Navigation />

<!-- Minimal navigation without additional icons -->
<Navigation showHeaderIcons={false} />
```

### Advanced Integration

```astro
---
import Navigation from "@components/Header/Navigation.astro";
import { getLangFromUrl } from "@utils/i18n";

const lang = getLangFromUrl(Astro.url);
const isGamePage = Astro.url.pathname.includes("/game/");
---

<!-- Conditional navigation based on page context -->
<Navigation showHeaderIcons={!isGamePage} />
```

## Component Structure

### HTML Hierarchy

```
header.navigation-header
├── LanguagePicker (component)
└── nav.navigation-nav
    ├── button.navigation-hamburger (menu toggle)
    ├── div.navigation-backdrop (overlay)
    └── div.navigation-menu (slide-out menu)
        ├── button.navigation-menu__close
        ├── h2.navigation-menu__title
        ├── div#menu-status-announcer (SR only)
        ├── ul.navigation-menu__list
        │   ├── li > a (Home)
        │   ├── li > a (Knowledge) *conditional*
        │   ├── li > a (Playlists) *conditional*
        │   ├── li > a (Rules) *conditional*
        │   ├── li > a (Highscores) *conditional*
        │   ├── li > a (Achievements) *conditional*
        │   ├── div.navigation-menu__divider
        │   ├── li > a (Profile) *auth-dependent*
        │   └── li > button (Logout) *auth-dependent*
        └── div.navigation-menu__donation
            ├── h3 (donation heading)
            └── div.navigation-menu__donation-links
                ├── a (PayPal link)
                └── a (Buy Me a Coffee link)
```

## TypeScript Functions

### Core Functions

#### `initNavigationMenu(): void`

Main initialization function that sets up all event listeners and functionality.

**Responsibilities:**

- DOM element validation and error handling
- Event listener setup for menu interactions
- Keyboard navigation initialization
- Authentication monitoring setup

#### `toggleMenu(menuToggle, mainMenu, menuBackdrop, statusAnnouncer?): void`

Manages menu state transitions with accessibility announcements.

**Parameters:**

- `menuToggle: HTMLButtonElement` - The hamburger menu button
- `mainMenu: HTMLElement` - The slide-out menu container
- `menuBackdrop: HTMLElement` - The overlay backdrop
- `statusAnnouncer?: HTMLElement` - Screen reader announcement area

**Features:**

- ARIA attribute management
- Focus restoration
- Body scroll prevention
- Status announcements for screen readers

#### `setupFocusTrap(menuElement: HTMLElement): void`

Implements keyboard focus trapping within the open menu.

**WCAG 2.2 Enhancements:**

- Tab cycling between first and last elements
- Alternative interaction methods (Home/End keys)
- Enhanced keyboard shortcuts (h/H for home, e/E for end)
- Navigation announcements for screen readers

### Authentication Management

#### `initLogoutButton(): void`

Handles logout functionality with proper cleanup and redirection.

**Process:**

1. Removes authentication status from localStorage
2. Dispatches custom `auth:logout` event
3. Makes API call to server logout endpoint
4. Redirects to language-appropriate login page
5. Handles network errors gracefully

#### `updateLogoutButtonVisibility(): void`

Updates UI based on authentication status with retry logic.

**Features:**

- localStorage-based authentication checking
- Exponential backoff for network failures
- Visual state management for auth-dependent elements
- Performance optimization with state caching

### Session Management

#### Session Timeout Integration

Implements WCAG 2.2 SC 2.2.6 Timeouts requirements.

**Configuration:**

- **Session Duration:** 20 minutes
- **Warning Time:** 2 minutes (WCAG minimum)
- **Multi-language Support:** Localized warning messages
- **Graceful Degradation:** Fallback polling for unsupported browsers

## Internationalization

The component supports comprehensive internationalization with the following key patterns:

### Translation Keys Used

```typescript
// Core navigation
"nav.ariaLabel"; // Main navigation aria-label
"nav.title"; // Menu title
"nav.menu.open"; // Open menu button label
"nav.menu.close"; // Close menu button label
"nav.menu.text"; // Menu button text
"nav.menu.home"; // Home link text
"nav.menu.rules"; // Rules link text
"nav.menu.highscores"; // Highscores link text
"nav.menu.logout"; // Logout button text

// Authentication
"nav.logout.label"; // Logout button aria-label
"profile.nav.aria"; // Profile link aria-label
"profile.nav.link"; // Profile link text

// Donations
"nav.donate.heading"; // Donation section heading
"nav.donate.paypal"; // PayPal link text
"nav.donate.coffee"; // Buy Me a Coffee link text
"nav.openNewWindow"; // External link indicator

// Other pages
"knowledge.title"; // Knowledge page title
"playlist.page.heading"; // Playlists page heading
"achievements.nav.aria"; // Achievements link aria-label
"achievements.nav.link"; // Achievements link text
```

### Language-Aware Routing

```typescript
// Automatic language detection and routing
const lang = getLangFromUrl(Astro.url);
const homeUrl = getRelativeLocaleUrl(lang, "gamehome");
const logoutRedirect = `/${lang}/auth/login?reason=session_expired`;
```

## Accessibility Implementation

### WCAG 2.2 AAA Compliance

#### SC 1.4.3 Contrast (Minimum) - Level AA ✅

- All text meets 4.5:1 contrast ratio minimum
- Interactive elements exceed 3:1 contrast requirements

#### SC 1.4.6 Contrast (Enhanced) - Level AAA ✅

- Text achieves 7:1 contrast ratio for enhanced readability
- Large text maintains 4.5:1 contrast minimum

#### SC 2.1.1 Keyboard - Level A ✅

- Full keyboard navigation support
- Logical tab order through all interactive elements
- Custom keyboard shortcuts (Home/End navigation)

#### SC 2.1.2 No Keyboard Trap - Level A ✅

- Focus trap implementation with escape mechanisms
- Escape key closes menu and restores focus
- Tab cycling within menu boundaries

#### SC 2.4.3 Focus Order - Level A ✅

- Logical focus sequence through menu items
- Focus restoration to trigger element on close
- Skip links for efficient navigation

#### SC 2.4.7 Focus Visible - Level AA ✅

- Enhanced focus indicators with 3px borders
- High contrast focus outlines
- Focus shadow effects for depth perception

#### SC 2.5.5 Target Size - Level AAA ✅

- Minimum 44×44px touch targets
- Enhanced spacing between interactive elements
- 24px minimum spacing implementation

#### SC 2.2.6 Timeouts - Level AAA ✅

- 2-minute advance warning for session timeout
- User control over session extension
- Graceful degradation for timeout warnings

### Screen Reader Support

```typescript
// Live region for dynamic announcements
<div aria-live="polite" aria-atomic="true" class="sr-only"
     id="menu-status-announcer"></div>

// Enhanced navigation announcements
function announceNavigation(message: string): void {
  const announcer = document.getElementById("menu-status-announcer");
  if (announcer) {
    announcer.textContent = message;
  }
}
```

### Keyboard Navigation Features

```typescript
// Enhanced keyboard shortcuts
menuElement.addEventListener("keydown", (e: KeyboardEvent) => {
  switch (e.key) {
    case "Home":
    case "h":
    case "H":
      // Navigate to first menu item
      break;
    case "End":
    case "e":
    case "E":
      // Navigate to last menu item
      break;
    case "Escape":
      // Close menu and restore focus
      break;
  }
});
```

## Styling Architecture

### CSS Custom Properties Usage

The component exclusively uses CSS custom properties from `/src/styles/global.css`:

```css
/* Color system */
--bg-primary, --bg-secondary, --bg-tertiary
--text-primary, --text-secondary
--interactive-primary, --interactive-primary-hover
--border-primary, --border-focus

/* Spacing system */
--space-xs, --space-sm, --space-md, --space-lg, --space-xl, --space-2xl, --space-3xl

/* Typography system */
--text-base, --text-lg, --text-xl
--font-medium, --font-bold

/* Layout system */
--radius-lg, --radius-xl, --radius-full
--shadow-md, --shadow-lg, --shadow-xl
--transition-fast, --transition-normal
--z-modal, --z-modal-backdrop

/* Accessibility system */
--focus-enhanced-outline-dark, --focus-enhanced-shadow
--focus-ring-offset
--min-touch-size
```

### Responsive Design Patterns

```css
/* Mobile-first approach */
.navigation-menu {
  width: 90%;
  max-width: 448px; /* 28rem */
  margin: var(--space-md);
}

/* Small screen optimizations */
@media (max-width: 40em) {
  .navigation-menu {
    margin: var(--space-sm);
    width: calc(100% - var(--space-md));
  }
}

/* Progressive enhancement for larger screens */
@media (min-width: 40em) {
  .navigation-hamburger__text {
    position: static;
    width: auto;
    height: auto;
  }
}
```

### Animation and Motion

```css
/* Respectful motion design */
.navigation-menu {
  transition:
    transform var(--transition-normal) ease-out,
    opacity var(--transition-normal);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .navigation-hamburger,
  .navigation-backdrop,
  .navigation-menu,
  .navigation-menu__item {
    transition: none;
  }

  .navigation-menu__item:hover {
    transform: none;
  }
}
```

## Performance Considerations

### Dynamic Imports

```typescript
// Session timeout utility loaded only when needed
import("../../utils/auth/sessionTimeout")
  .then(({ createSessionTimeoutManager }) => {
    // Initialize only for authenticated users
  })
  .catch((error) => {
    // Graceful fallback to polling
  });
```

### Event Management

```typescript
// Proper cleanup to prevent memory leaks
window.addEventListener("beforeunload", () => {
  if (authListeners) {
    authListeners.remove();
  }
  if (cookieWatcher) {
    stopCookieWatcher(cookieWatcher);
  }
});
```

### Optimized Polling

```typescript
// Exponential backoff for network resilience
const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
setTimeout(updateLogoutButtonVisibilityWithRetry, delay);
```

## Error Handling

### Network Resilience

- Exponential backoff for failed authentication checks
- Graceful fallback to polling when cookie watching fails
- Online/offline event handling for network state changes
- Document visibility API integration for battery optimization

### LocalStorage Safety

```typescript
function checkLocalStorage(key: string): boolean {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return false;
  }
}
```

### DOM Safety

```typescript
// Comprehensive element validation
if (!menuToggle || !mainMenu || !menuBackdrop || !closeButton) {
  console.error("Navigation: Required DOM elements not found");
  return;
}
```

## Testing Considerations

### Accessibility Testing

- Test with screen readers (NVDA, JAWS, VoiceOver)
- Verify keyboard navigation flow
- Check focus indicator visibility
- Validate ARIA attribute updates
- Test session timeout warnings

### Responsive Testing

- Test menu functionality across viewport sizes
- Verify touch target sizes on mobile devices
- Check backdrop overlay behavior
- Validate scroll prevention

### Authentication Flow Testing

- Test logout functionality with network failures
- Verify proper cleanup of event listeners
- Check session timeout behavior
- Test authentication state synchronization

## Related Components

- [LanguagePicker](./LanguagePicker.md) - Integrated language selection
- [AchievementBadge](./AchievementBadge.md) - Real-time achievement indicators
- [Header Layout](../layouts/Header.md) - Overall header structure

## Implementation Notes

### Browser Support

- Modern browsers with ES2020+ support
- Progressive enhancement for older browsers
- Cookie watching requires modern browser APIs
- Fallback polling for unsupported features

### Security Considerations

- XSS prevention through proper content encoding
- CSRF protection via SameSite cookie attributes
- Secure logout with server-side session invalidation
- Content Security Policy compliance

### Future Enhancements

- Service Worker integration for offline navigation
- Progressive Web App navigation patterns
- Voice control integration
- Advanced personalization options

## Changelog

- **v3.0.0** - WCAG 2.2 AAA compliance, enhanced keyboard navigation
- **v2.8.0** - Session timeout warnings with multi-language support
- **v2.7.0** - Cookie-based authentication monitoring
- **v2.6.0** - Achievement badge integration
- **v2.5.0** - Enhanced error handling and network resilience
- **v2.0.0** - Complete rewrite with TypeScript and accessibility focus
