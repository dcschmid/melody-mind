# PasswordResetForm Component

## Overview

The PasswordResetForm component provides a secure, accessible password reset functionality for the MelodyMind application. It supports two distinct modes: requesting a password reset via email and confirming the reset with a new password. The component is built with WCAG AAA accessibility compliance, comprehensive security features, and modern web standards.

![Password Reset Form](../assets/password-reset-form.png)

## Features

### Security Features
- **Strong Password Enforcement**: Real-time validation against 8 comprehensive security criteria
- **Common Password Detection**: Protection against dictionary attacks and weak passwords
- **Pattern Protection**: Prevents sequential characters (123, abc) and repeated character patterns
- **Input Sanitization**: Comprehensive validation and error handling
- **Timeout Protection**: Session management with WCAG 2.2 SC 2.2.6 compliance

### User Experience Features
- **Dual Mode Operation**: Request reset (email) and confirmation (new password) modes
- **Real-time Validation**: Instant feedback with debounced performance optimization
- **Password Strength Meter**: Visual indicator with 4-level strength assessment
- **Requirements Checklist**: Interactive visual indicators for each password criterion
- **Password Visibility Toggle**: Accessible show/hide functionality for password fields
- **Contextual Help**: Tooltip-based guidance with password creation tips
- **Error Recovery**: Intelligent suggestions for common input errors (email domains, etc.)

### Accessibility Features
- **WCAG AAA Compliance**: Meets all Level AAA accessibility standards
- **Screen Reader Optimized**: Comprehensive ARIA attributes and live regions
- **Keyboard Navigation**: Full keyboard accessibility with proper focus management
- **High Contrast Support**: Enhanced visibility for users with visual impairments
- **Reduced Motion Support**: Respects user motion preferences
- **Touch-Friendly**: Minimum 44×44px touch targets for mobile accessibility

### Technical Features
- **Performance Optimized**: Debounced validation, cached DOM elements, requestAnimationFrame
- **Internationalization**: Full i18n support with fallback translations
- **Responsive Design**: Mobile-first approach with adaptive breakpoints
- **Error Boundaries**: Comprehensive error handling with timeout management
- **Progressive Enhancement**: Works with JavaScript disabled

## Properties

| Property        | Type             | Required | Description                                    | Default |
| --------------- | ---------------- | -------- | ---------------------------------------------- | ------- |
| token           | string \| null   | No       | Reset token from email link (confirm mode)    | null    |
| isConfirmReset  | boolean          | No       | Determines form mode (request vs confirm)      | false   |

## Usage

### Basic Implementation

```astro
---
import PasswordResetForm from "@components/auth/PasswordResetForm.astro";
---

<!-- Request Mode: User enters email to receive reset link -->
<PasswordResetForm />

<!-- Confirmation Mode: User sets new password with valid token -->
<PasswordResetForm token="abc123def456" isConfirmReset={true} />
```

### With Error Handling

```astro
---
import PasswordResetForm from "@components/auth/PasswordResetForm.astro";
import { getResetToken } from "@utils/auth/tokens";

// Extract token from URL parameters
const url = new URL(Astro.request.url);
const token = url.searchParams.get('token');
const isValid = token ? await getResetToken(token) : false;
---

{isValid ? (
  <PasswordResetForm token={token} isConfirmReset={true} />
) : (
  <PasswordResetForm />
)}
```

### Integration with Routing

```astro
---
// src/pages/[lang]/auth/reset-password/[...token].astro
import PasswordResetForm from "@components/auth/PasswordResetForm.astro";
import BaseLayout from "@layouts/BaseLayout.astro";

export async function getStaticPaths() {
  return [
    { params: { lang: "en", token: "request" } },
    { params: { lang: "de", token: "request" } },
    // Dynamic token paths handled via SSR
  ];
}

const { token } = Astro.params;
const isConfirmReset = token !== 'request';
---

<BaseLayout title="Password Reset">
  <PasswordResetForm 
    token={isConfirmReset ? token : null} 
    isConfirmReset={isConfirmReset} 
  />
</BaseLayout>
```

## Component Modes

### Request Mode (isConfirmReset = false)
- **Purpose**: Allows users to request a password reset by entering their email
- **Form Fields**: Email address only
- **Validation**: Email format validation with domain suggestions
- **Security**: Always shows success message (prevents email enumeration)
- **Flow**: Submit → API call → Success message → Check email

### Confirmation Mode (isConfirmReset = true)
- **Purpose**: Allows users to set new password using valid reset token
- **Form Fields**: New password, confirm password
- **Validation**: Comprehensive password strength validation with real-time feedback
- **Features**: Requirements checklist, strength meter, contextual help
- **Flow**: Validate → Submit → Success → Redirect to login

## Security Implementation

### Password Validation Criteria

```typescript
interface PasswordValidation {
  minLength: 8;           // Minimum 8 characters
  uppercase: boolean;     // At least one A-Z
  lowercase: boolean;     // At least one a-z  
  number: boolean;        // At least one 0-9
  special: boolean;       // At least one !@#$%^&*(),.?":{}|<>
  noCommon: boolean;      // Not in common password list
  noRepeats: boolean;     // No more than 2 consecutive identical chars
  noSequences: boolean;   // No common sequences (123, abc, qwe)
}
```

### Password Strength Levels

| Level        | Score Range | Requirements                               |
| ------------ | ----------- | ------------------------------------------ |
| Very Weak    | 0-19        | Fails multiple criteria                    |
| Weak         | 20-39       | Meets basic length, few character types    |
| Medium       | 40-59       | Most criteria met, room for improvement    |
| Strong       | 60-79       | All criteria met, good length             |
| Very Strong  | 80-100      | Exceeds requirements, excellent length     |

## Accessibility Features

### WCAG AAA Compliance

- **Color Contrast**: 7:1 ratio for normal text, 4.5:1 for large text
- **Focus Management**: Visible focus indicators with 3px solid borders
- **Keyboard Navigation**: Tab order, Enter/Space activation, Escape dismissal
- **Screen Reader Support**: 
  - ARIA live regions for dynamic content
  - Descriptive labels and instructions
  - Status announcements for validation changes
  - Progress information for strength meter

### Screen Reader Optimizations

```html
<!-- Password field with comprehensive accessibility -->
<input 
  type="password"
  aria-required="true"
  aria-describedby="passwordRequirements passwordError passwordStrengthDescription"
  aria-invalid="false"
/>

<!-- Real-time status announcements -->
<div id="passwordStrengthDescription" class="sr-only" aria-live="polite" aria-atomic="true">
  Password strength indicator shows how secure your password is. Current strength: Weak at 25 percent
</div>
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .password-reset-form__spinner {
    animation: none;
  }
  
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

## Internationalization

### Supported Languages
- English (en)
- German (de)
- Extensible for additional languages

### Key Translation Categories

```typescript
interface Translations {
  // Form labels and placeholders
  "auth.password_reset.email": string;
  "auth.password_reset.password": string;
  
  // Validation messages
  "auth.form.email_required": string;
  "auth.form.password_requirements": string;
  
  // Strength indicators
  "auth.password.strength.weak": string;
  "auth.password.strength.strong": string;
  
  // Accessibility announcements
  "auth.accessibility.requirement.met": string;
  "auth.accessibility.password.visible": string;
  
  // Error recovery suggestions
  "auth.form.help.password_suggestions": string;
}
```

### Usage Example

```astro
---
import { getLangFromUrl, useTranslations } from "@utils/i18n";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---

<PasswordResetForm />
<!-- Component automatically uses language from URL -->
```

## Performance Optimizations

### Client-Side Performance
- **Debounced Validation**: Adaptive delays (100ms initial, 200ms for rapid typing)
- **Cached DOM Elements**: Eliminates repeated `getElementById` calls
- **RequestAnimationFrame**: Smooth UI updates without blocking
- **Passive Event Listeners**: Better scroll performance on mobile
- **Batch DOM Updates**: Minimizes reflows and repaints

### Network Performance
- **Request Timeouts**: 10s for reset requests, 15s for confirmations
- **Abort Controllers**: Cancellable requests to prevent race conditions
- **Priority Hints**: High priority for critical API calls
- **Minimal Payloads**: Optimized JSON request/response structures

### Memory Management
- **Event Cleanup**: Removes listeners on navigation
- **Cache Management**: Smart caching with automatic cleanup
- **Session Management**: Proper timeout handling with cleanup

## API Integration

### Reset Request Endpoint

```typescript
// POST /{lang}/api/auth/reset-password
interface ResetRequestBody {
  email: string;
}

interface ResetRequestResponse {
  success: boolean;
  message: string;
}
```

### Reset Confirmation Endpoint

```typescript
// PUT /{lang}/api/auth/reset-password  
interface ResetConfirmBody {
  token: string;
  newPassword: string;
}

interface ResetConfirmResponse {
  success: boolean;
  message?: string;
  error?: string;
}
```

## Error Handling

### Client-Side Error Recovery

```typescript
// Email domain suggestions
"user@gmai.com" → "Did you mean: user@gmail.com?"

// Password improvement hints
"Add an uppercase letter (A-Z), Add a number (0-9)"

// Network timeout handling
"Request timed out. Please check your connection and try again."
```

### Server-Side Error Mapping

```typescript
interface ErrorStates {
  INVALID_TOKEN: "Reset link has expired or is invalid";
  EMAIL_NOT_FOUND: "Account not found"; // Generic for security
  RATE_LIMITED: "Too many attempts. Please wait before trying again";
  VALIDATION_ERROR: "Please check your input and try again";
}
```

## Browser Support

### Modern Features Used
- **CSS Custom Properties**: Full support in supported browsers
- **Fetch API**: With polyfill fallback for older browsers
- **RequestAnimationFrame**: For smooth animations
- **IntersectionObserver**: For performance optimizations
- **ARIA Live Regions**: For accessibility

### Fallback Strategies
- **CSS**: Graceful degradation for older browsers
- **JavaScript**: Progressive enhancement approach
- **Accessibility**: Works with assistive technologies

## Testing Recommendations

### Unit Testing
```typescript
// Password validation testing
describe('Password Validation', () => {
  test('validates strong password correctly', () => {
    const result = validatePassword('MyStr0ng!Pass');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
```

### Accessibility Testing
- **Automated**: axe-core, Pa11y for WCAG compliance
- **Manual**: Screen reader testing (NVDA, JAWS, VoiceOver)
- **Keyboard**: Tab navigation, keyboard-only usage
- **Visual**: High contrast mode, zoom testing

### Integration Testing
```typescript
// Form submission flow
test('successful password reset flow', async () => {
  const { getByLabelText, getByRole } = render(PasswordResetForm);
  
  await user.type(getByLabelText(/email/i), 'user@example.com');
  await user.click(getByRole('button', { name: /send reset link/i }));
  
  expect(await screen.findByText(/check your email/i)).toBeInTheDocument();
});
```

## Related Components

- [LoginForm](./LoginForm.md) - Main authentication form
- [RegisterForm](./RegisterForm.md) - User registration form  
- [SessionTimeoutWarning](./SessionTimeoutWarning.md) - Session management
- [FormField](../Shared/FormField.md) - Reusable form field component
- [PasswordStrengthMeter](./PasswordStrengthMeter.md) - Standalone strength meter

## Migration Notes

### From Previous Versions

#### v2.0.0 → v3.0.0
- **Breaking**: `mode` prop replaced with `isConfirmReset` boolean
- **Enhanced**: Added contextual help tooltips
- **Improved**: WCAG AAA compliance with enhanced focus management

#### v1.x → v2.0.0  
- **Breaking**: Moved from Tailwind to CSS custom properties
- **Enhanced**: Added password strength meter
- **Added**: Comprehensive error recovery suggestions

## Changelog

- **v3.1.0** - Added session timeout management with WCAG 2.2 compliance
- **v3.0.0** - Major accessibility overhaul with WCAG AAA compliance
- **v2.5.0** - Added contextual help and improved error recovery
- **v2.0.0** - Redesigned with CSS custom properties and password strength meter
- **v1.0.0** - Initial release with basic reset functionality

## Security Considerations

- **Rate Limiting**: Implement server-side rate limiting for reset requests
- **Token Expiry**: Ensure reset tokens expire within reasonable timeframes
- **HTTPS Only**: All password operations must use secure connections
- **CSP Headers**: Configure Content Security Policy for form submissions
- **Input Validation**: Both client and server-side validation required

## Contributing

When modifying this component:

1. **Maintain Accessibility**: Test with screen readers after changes
2. **Follow CSS Standards**: Use only CSS custom properties from global.css
3. **Update Tests**: Add tests for new functionality
4. **Documentation**: Update this documentation for any API changes
5. **Performance**: Profile changes for performance impact
6. **i18n**: Add translation keys for new user-facing text

## Support

For questions about this component:
- **Accessibility Issues**: Contact the accessibility team
- **Performance Concerns**: Profile with browser dev tools
- **Translation Updates**: Update language files in `/src/i18n/`
- **Security Questions**: Consult the security team for validation changes
