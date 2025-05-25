# EmailVerification Component

## Overview

The EmailVerification component handles the email verification process for new user accounts in
MelodyMind. This component displays a confirmation page when users click the verification link in
their email. It manages three distinct states (loading, success, error) and provides a fully
accessible, WCAG AAA compliant user experience with comprehensive internationalization support.

![Email Verification Component States](../images/email-verification-states.png)

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

### Complete Page Implementation

```astro
---
// src/pages/[lang]/auth/verify-email.astro
import EmailVerification from "@components/auth/EmailVerification.astro";
import AuthLayout from "@layouts/AuthLayout.astro";
import { getLangFromUrl } from "@utils/i18n";

const lang = getLangFromUrl(Astro.url);
const token = Astro.url.searchParams.get("token");

if (!token) {
  return Astro.redirect(`/${lang}/auth/login`);
}
---

<AuthLayout title="Email Verification" lang={lang}>
  <EmailVerification token={token} />
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

## Internationalization Support

The component uses the MelodyMind i18n system with the following translation keys:

```typescript
// Text keys used by this component
const i18nKeys = {
  "auth.email_verification.loading_label": "Loading verification status",
  "auth.email_verification.success_icon_label": "Success icon",
  "auth.email_verification.error_icon_label": "Error icon",
  "auth.email_verification.title": "Email Verification",
  "auth.email_verification.message": "Your email has been successfully verified",
  "auth.email_verification.error": "Email verification failed",
  "auth.email_verification.login": "Continue to Login",
  "loading.content": "Verifying your email address...",
};
```

### Language Support

- German (de) - Primary language
- English (en) - Secondary language
- Extensible for additional languages
- Right-to-left (RTL) language support via CSS logical properties

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
