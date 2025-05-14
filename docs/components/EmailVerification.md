# EmailVerification Component

## Overview

The `EmailVerification` component handles the email verification process for new user accounts in MelodyMind. This component is displayed when a user clicks the confirmation link sent to their email after registration. It shows different states (loading, success, or error) based on the verification result.

![Email Verification Component States](../images/email-verification-states.png)

## Properties

| Property | Type   | Required | Description                     | Default |
| -------- | ------ | -------- | ------------------------------- | ------- |
| token    | string | Yes      | The verification token from URL | -       |

## Usage

```astro
---
import EmailVerification from "../components/auth/EmailVerification.astro";

const { token } = Astro.params;
---

<EmailVerification token={token} />
```

## Implementation Details

The component handles three distinct states during the email verification process:

1. **Loading State**: Displayed initially while verification is in progress
2. **Success State**: Shown when the email is successfully verified
3. **Error State**: Displayed when verification fails (invalid/expired token)

Each state includes accessible status messages and appropriate ARIA attributes for screen reader announcements.

## Accessibility (WCAG AAA)

The component meets WCAG AAA standards with the following features:

- Semantic HTML with proper heading hierarchy
- ARIA live regions for dynamic content announcements
- Keyboard navigation support (including Escape key)
- Focus management between state transitions
- High contrast design (7:1 ratio) for all text
- Reduced motion support for animations
- Proper error handling and status communication
- Touch-friendly targets (minimum 44×44px)

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
