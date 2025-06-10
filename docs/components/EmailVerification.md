# EmailVerification Component

## Overview

The EmailVerification component provides a comprehensive email verification interface for the MelodyMind authentication system. It handles the complete verification flow with three distinct states (loading, success, error) while maintaining full WCAG AAA accessibility compliance and seamless internationalization support.

This component is designed as a standalone verification page that users access via email confirmation links. It automatically processes verification tokens, communicates with the backend API, and provides clear visual feedback throughout the verification process.

![Email Verification Component States](../images/email-verification-states.png)

## Features

- **Three distinct states**: Loading, Success, and Error with smooth transitions
- **WCAG AAA compliant**: Full accessibility support with screen readers and keyboard navigation
- **Internationalization ready**: Multi-language content via i18n system
- **Responsive design**: Optimized for all screen sizes and devices
- **Performance optimized**: Efficient DOM operations and API calls with timeout handling
- **Reduced motion support**: Respects user motion preferences
- **High contrast support**: Enhanced visibility for users with visual impairments

## Properties

| Property | Type   | Required | Description                                            | Default |
| -------- | ------ | -------- | ------------------------------------------------------ | ------- |
| token    | string | Yes      | The verification token from the email confirmation URL | -       |

## Usage Examples

### Basic Implementation

```astro
---
import EmailVerification from "@components/auth/EmailVerification.astro";

// Token is typically extracted from URL parameters
const { token } = Astro.params;
---

<EmailVerification token={token} />
```

### Complete Page Implementation with Dynamic Routes

```astro
---
// src/pages/[lang]/auth/verify-email/[token].astro
import EmailVerification from "../../../../components/auth/EmailVerification.astro";
import AuthLayout from "../../../../layouts/AuthLayout.astro";
import { getLangFromUrl } from "@utils/i18n";

export async function getStaticPaths() {
  // Required for dynamic routes in Astro
  return [
    { params: { lang: "en", token: "example-token" } },
    { params: { lang: "de", token: "example-token" } },
    // Add other language/token combinations as needed
  ];
}

const { lang, token } = Astro.params;

if (!token) {
  return Astro.redirect(`/${lang}/auth/login`);
}
---

<AuthLayout title="Email Verification" lang={lang}>
  <EmailVerification token={token} />
</AuthLayout>
```

### Error Handling Implementation

```astro
---
import EmailVerification from "@components/auth/EmailVerification.astro";
import ErrorBoundary from "@components/Shared/ErrorBoundary.astro";

const { token } = Astro.params;

// Validate token format before rendering
const tokenValidation = /^[a-zA-Z0-9\-_]+$/.test(token || '');

if (!token || !tokenValidation) {
  return Astro.redirect(`/${lang}/auth/login?error=invalid_token`);
}
---

<ErrorBoundary>
  <EmailVerification token={token} />
</ErrorBoundary>
```
</AuthLayout>
```

## Component States and Behavior

The component handles three distinct states during the email verification process:

### Loading State

- Displays an animated spinner with loading message
- Automatically initiates email verification API call
- Announces loading state to screen readers via `aria-live="polite"`
- Shows localized loading text from i18n system

### Success State

- Shows check icon with success confirmation message
- Provides "Continue to Login" button for immediate access
- Focuses on heading for screen reader accessibility
- Uses `role="status"` for non-intrusive announcements

### Error State

- Displays exclamation triangle icon with error message
- Offers login button as fallback navigation option
- Uses `role="alert"` and `aria-live="assertive"` for immediate error announcement
- Provides clear error indication for all users

## WCAG AAA Accessibility Features

### Color Contrast and Visual Design

- **Text Contrast**: 7:1 ratio for normal text, 4.5:1 for large text
- **Focus Indicators**: 3px solid borders with high contrast colors
- **Icon Clarity**: Icons properly sized (24px minimum) with semantic meaning
- **High Contrast Mode**: Optimized styling for high contrast preferences

### Keyboard and Screen Reader Support

- **Focus Management**: Automatic focus on state changes with 100ms delay for processing
- **Screen Reader Announcements**: Comprehensive aria-live regions with proper timing
- **Keyboard Navigation**: Full keyboard accessibility with visible focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmark regions

### Touch and Mobile Accessibility

- **Touch Targets**: Minimum 44×44px (48×48px on touch devices)
- **Spacing**: Adequate spacing between interactive elements (8px minimum)
- **Font Sizes**: Minimum 16px to prevent iOS zoom, scalable with clamp()
- **Touch Actions**: Proper touch-action manipulation for performance

## CSS Variables and Design System

The component follows MelodyMind's CSS variable system from `global.css`:

### Layout and Spacing
```css
--space-xs      /* 4px */
--space-sm      /* 8px */
--space-md      /* 16px */
--space-lg      /* 24px */
--space-xl      /* 32px */
--space-2xl     /* 48px */
--space-3xl     /* 64px */
```

### Typography
```css
--text-base     /* 16px */
--text-lg       /* 18px */
--text-xl       /* 20px */
--text-2xl      /* 24px */
--font-medium   /* 500 */
--font-bold     /* 700 */
--leading-tight /* 1.25 */
```

## Internationalization Support

The component uses the MelodyMind i18n system with the following translation keys:

```typescript
// Text keys used by this component
const i18nKeys = {
  "auth.skip_to_verification": "Skip to verification content",
  "auth.email_verification.loading_label": "Verifying your email address",
  "auth.email_verification.title": "Email Verification",
  "auth.email_verification.message": "Your email has been successfully verified!",
  "auth.email_verification.error": "Email verification failed. Please try again.",
  "auth.email_verification.login": "Continue to Login",
  "auth.email_verification.success_icon_label": "Success checkmark",
  "auth.email_verification.error_icon_label": "Error warning"
};
```

### Language Support

- **German (de)** - Primary language for UI
- **English (en)** - Secondary language
- **Extensible** - Ready for additional languages
- **RTL Support** - Uses CSS logical properties for right-to-left languages

### Translation Integration

```typescript
// Automatic language detection from URL
const lang = String(getLangFromUrl(Astro.url));
const t = useTranslations(String(lang));

// Usage in component
<p class="email-verification__text">
  {t("auth.email_verification.loading_label")}
</p>
```

### Colors (WCAG AAA Compliant)
```css
--bg-success-aaa     /* Success background with 7:1 contrast */
--text-success-aaa   /* Success text with 7:1 contrast */
--bg-error-aaa       /* Error background with 7:1 contrast */
--text-error-aaa     /* Error text with 7:1 contrast */
--bg-primary         /* Primary background */
--text-primary       /* Primary text */
--text-secondary     /* Secondary text */
```

### Interactive Elements
```css
--btn-primary-bg       /* Primary button background */
--btn-primary-hover    /* Primary button hover state */
--btn-primary-text     /* Primary button text */
--border-primary       /* Primary borders */
--interactive-primary  /* Interactive elements */
```

### Focus System
```css
--focus-outline                 /* Standard focus outline */
--focus-ring                   /* Focus ring shadow */
--focus-ring-offset           /* Focus ring offset */
--focus-enhanced-outline-dark /* Enhanced focus for WCAG 2.2 */
--focus-enhanced-shadow       /* Enhanced focus shadow */
```

### Accessibility and Motion
```css
--transition-normal     /* Standard transitions */
--radius-md            /* Medium border radius */
--radius-full          /* Full border radius */
--min-touch-size       /* Minimum touch target (44px) */
```

## Code Deduplication and Reusability

### Existing Utility Functions Used

```typescript
// i18n utilities - Always reuse these
import { getLangFromUrl, useTranslations } from "@utils/i18n";

// Icon system - Reuse existing icon components
import { Icon } from "astro-icon/components";
```

### Reusable CSS Patterns

The component follows established patterns from the global design system:

```css
/* Button pattern - reused from global system */
.email-verification__button {
  /* Uses --btn-primary-* variables */
  /* Follows standard focus indicators */
  /* Maintains accessibility standards */
}

/* Icon pattern - consistent with other components */
.email-verification__icon {
  /* Uses standard spacing variables */
  /* Follows accessibility contrast requirements */
  /* Maintains touch target standards */
}
```

## Icon Usage with astro-icon

The component uses two primary icons from the astro-icon package:

### Success Icon

```astro
<Icon name="check" class="email-verification__svg" aria-hidden="true" />
```

### Error Icon (Highlighted Feature)

```astro
<Icon name="exclamation-triangle" class="email-verification__svg" aria-hidden="true" />
```

Both icons are:

- Properly sized (24px/1.5rem) for optimal visibility
- Hidden from screen readers with `aria-hidden="true"`
- Accompanied by proper text alternatives via surrounding context
- Styled for theme compatibility with CSS custom properties

## API Integration

### Verification Endpoint

The component calls the email verification API:

```typescript
const response = await fetch(
  `/${currentLang}/api/auth/verify-email?token=${encodeURIComponent(token)}`,
  {
    signal: controller.signal,
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }
);
```

### Error Handling

- 10-second request timeout with AbortController
- Network error handling with user-friendly messages
- Invalid token handling with automatic error state
- Graceful degradation for API failures

## Performance Optimizations

### CSS Performance

- CSS custom properties for consistent theming
- CSS containment for layout isolation (`contain: layout style`)
- GPU acceleration with `transform: translateZ(0)` and `will-change`
- Efficient selectors to minimize repaints
- Consolidated media queries for better performance

### JavaScript Performance

- Efficient DOM queries with early returns
- Batched DOM operations for state changes
- AbortController for request management and cleanup
- Minimal DOM manipulation with class toggles
- Event listeners optimized with `{ once: true }` where appropriate

## Security Considerations

### Token Handling

- URL-safe token encoding with `encodeURIComponent()`
- Client-side token validation before API calls
- No token storage in localStorage or sessionStorage
- Secure handling of verification tokens

### API Security

- CORS-protected endpoints
- Rate limiting on verification attempts
- Token expiration handling
- Protection against replay attacks

## Browser Support and Fallbacks

### Modern Browser Features

- CSS custom properties (CSS Variables)
- CSS Grid and Flexbox layouts
- CSS color-mix() function for transparent backgrounds
- CSS logical properties for internationalization
- AbortController for fetch request management

### Progressive Enhancement

- Graceful degradation for older browsers
- Fallback colors for unsupported color-mix()
- Standard properties alongside logical properties
- Essential functionality works without JavaScript

## Related Components

- [AuthLayout](./AuthLayout.md) - Provides authentication page structure
- [AuthFormField](./AuthFormField.md) - Form input components for authentication
- [AuthSubmitButton](./AuthSubmitButton.md) - Authentication action buttons

## Implementation Notes

### State Management

The component uses a simple, efficient state machine approach:

- Single source of truth with DOM-based state
- Efficient class-based state transitions
- No external state management dependencies
- Clear state isolation between verification attempts

### Animation and Motion

- Respects user motion preferences with `prefers-reduced-motion`
- Hardware-accelerated spinner animation
- Smooth state transitions with CSS transitions
- Performance-optimized animations using transform properties

## Changelog

- **v3.1.0** - Added touch device optimizations, enhanced error handling
- **v3.0.0** - WCAG AAA compliance upgrade, performance optimizations
- **v2.5.0** - Added comprehensive internationalization support
- **v2.0.0** - Complete rewrite with TypeScript and modern CSS
- **v1.0.0** - Initial implementation

This comprehensive documentation covers all aspects of the EmailVerification component following
MelodyMind's documentation standards with complete English documentation, accessibility
considerations, and technical implementation details.

## Internationalization

The component uses the MelodyMind i18n system with the following translation keys:

```typescript
// Text keys used by this component
const statusKeys = {
  loading: "auth.email_verification.status.loading",
  success: "auth.email_verification.status.success",
  error: "auth.email_verification.status.error",
};
```

These keys are available in all supported languages in the `/src/i18n/locales/` directory.

## Client-Side JavaScript

The component uses client-side JavaScript for:

- Making the API call to verify the email token
- Managing state transitions between loading/success/error views
- Handling keyboard navigation (Escape key)
- Updating page title to reflect current verification state
- Proper focus management for accessibility

## Related Components

- [LoginForm](./LoginForm.md) - Form for user login after verification
- [RegistrationForm](./RegistrationForm.md) - Initial form that triggers verification email

## Technical Implementation

### HTML Structure

The component uses a semantic structure with:

- `<section>` as the main container with `aria-labelledby` attribute
- Appropriate heading levels with `<h1>` for the main title
- Status containers with `role="status"` or `role="alert"`
- ARIA live regions for dynamic content updates

### JavaScript Functions

| Function        | Description                                             |
| --------------- | ------------------------------------------------------- |
| verifyEmail()   | Makes API call to validate the token                    |
| showState()     | Manages UI state transitions with accessibility support |
| handleKeyDown() | Implements keyboard shortcuts for navigation            |
| cleanup()       | Handles event listener cleanup for page transitions     |

## Changelog

- v3.0.0 - Added WCAG AAA compliance, improved keyboard navigation
- v2.5.0 - Added support for multiple languages and translation keys
- v2.0.0 - Redesigned with Tailwind CSS and improved state management
- v1.0.0 - Initial implementation
