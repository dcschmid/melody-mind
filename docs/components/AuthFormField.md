# AuthFormField Component

## Overview

The `AuthFormField` component is a highly accessible, reusable form field component designed specifically for authentication forms in the MelodyMind project. It provides consistent styling, behavior, and validation across all form inputs while meeting WCAG AAA accessibility standards.

![AuthFormField Example](../public/docs/auth-form-field.png)

## Features

- **Full Accessibility**: WCAG AAA compliant with enhanced screen reader support
- **Type Safety**: Complete TypeScript interface with proper prop validation
- **Real-time Validation**: Immediate feedback for email and password fields
- **Password Toggle Integration**: Seamless integration with PasswordToggleButton
- **Progressive Enhancement**: Works without JavaScript via NoScript fallback
- **Internationalization**: Full i18n support with client-side translations
- **Error Management**: Advanced error handling with accessibility announcements
- **Responsive Design**: Optimized for all device sizes and input methods

## Properties

| Property              | Type                                            | Required | Description                                           | Default                       |
| --------------------- | ----------------------------------------------- | -------- | ----------------------------------------------------- | ----------------------------- |
| `id`                  | `string`                                        | Yes      | Unique identifier for the input field                 | -                             |
| `name`                | `string`                                        | Yes      | Name attribute for form submission                    | -                             |
| `type`                | `"email" \| "password" \| "text" \| "tel" \| "url" \| "search" \| "number"` | Yes      | Input type determining validation and behavior        | -                             |
| `label`               | `string`                                        | Yes      | Accessible label text for the input                   | -                             |
| `placeholder`         | `string`                                        | No       | Placeholder text shown when field is empty           | `undefined`                   |
| `required`            | `boolean`                                       | No       | Whether the field is required for form submission     | `false`                       |
| `autocomplete`        | `string`                                        | No       | Autocomplete attribute for browser assistance         | `undefined`                   |
| `class`               | `string`                                        | No       | Additional CSS classes to apply                       | `""`                          |
| `labelSuffix`         | `string`                                        | No       | HTML content to display after the label              | `undefined`                   |
| `showPasswordToggle`  | `boolean`                                       | No       | Whether to show password visibility toggle            | `true` for password type      |
| `passwordToggleLabel` | `string`                                        | No       | Accessible label for password toggle button          | `"Toggle password visibility"` |
| `inputAttributes`     | `Record<string, string \| number \| boolean>`  | No       | Additional attributes to pass to the input element   | `{}`                          |

## Usage Examples

### Basic Email Field

```astro
---
import AuthFormField from "@components/auth/AuthFormField.astro";
import { getLangFromUrl, useTranslations } from "@utils/i18n";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---

<AuthFormField
  id="loginEmail"
  name="email"
  type="email"
  label={t("auth.login.email")}
  placeholder={t("auth.login.email.placeholder")}
  required={true}
  autocomplete="email"
/>
```

### Password Field with Toggle

```astro
<AuthFormField
  id="loginPassword"
  name="password"
  type="password"
  label={t("auth.login.password")}
  placeholder={t("auth.login.password.placeholder")}
  required={true}
  autocomplete="current-password"
  showPasswordToggle={true}
  passwordToggleLabel={t("auth.toggle_password_visibility")}
/>
```

### Field with Custom Label Suffix

```astro
<AuthFormField
  id="forgotEmail"
  name="email"
  type="email"
  label={t("auth.forgot.email")}
  labelSuffix={`<a href="/auth/login" class="text-primary hover:underline">${t("auth.back_to_login")}</a>`}
  required={true}
  autocomplete="email"
/>
```

### Text Field with Custom Validation

```astro
<AuthFormField
  id="displayName"
  name="displayName"
  type="text"
  label={t("auth.register.display_name")}
  placeholder={t("auth.register.display_name.placeholder")}
  required={true}
  autocomplete="nickname"
  inputAttributes={{
    minlength: 2,
    maxlength: 50,
    pattern: "^[a-zA-Z0-9_\\s]+$"
  }}
/>
```

## TypeScript Interface

```typescript
export interface Props {
  /** Unique identifier for the input field */
  id: string;
  /** Name attribute for the input */
  name: string;
  /** Input type (email, password, text, etc.) */
  type: "email" | "password" | "text" | "tel" | "url" | "search" | "number";
  /** Label text for the input */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Autocomplete attribute value */
  autocomplete?: string;
  /** Additional CSS classes */
  class?: string;
  /** Custom content to display after the label (e.g., forgot password link) */
  labelSuffix?: string;
  /** Whether to show password toggle (only for password type) */
  showPasswordToggle?: boolean;
  /** Accessible label for password toggle button */
  passwordToggleLabel?: string;
  /** Additional attributes to pass to the input */
  inputAttributes?: Record<string, string | number | boolean>;
}
```

## Client-Side API

The component exposes several JavaScript functions for programmatic interaction:

### `showFieldError(fieldId: string, message: string): void`

Displays an error message for a specific field with enhanced accessibility support.

```javascript
// Show validation error
window.showFieldError("loginEmail", "Please enter a valid email address");
```

### `hideFieldError(fieldId: string): void`

Hides the error message for a specific field and announces resolution to screen readers.

```javascript
// Clear validation error
window.hideFieldError("loginEmail");
```

### `validateEmailFormat(email: string): boolean`

Validates email format using comprehensive regex pattern.

```javascript
// Validate email format
const isValid = window.validateEmailFormat("user@example.com");
// Returns: true
```

### `AccessibilityAnnouncer`

Enhanced screen reader support with polite and assertive announcements.

```javascript
// Get singleton instance
const announcer = AccessibilityAnnouncer.getInstance();

// Announce politely (doesn't interrupt screen reader)
announcer.announcePolite("Form field updated");

// Announce assertively (interrupts screen reader)
announcer.announceAssertive("Error: Invalid email format");
```

## Accessibility Features

### WCAG AAA Compliance

- **Color Contrast**: All text meets 7:1 contrast ratio for normal text, 4.5:1 for large text
- **Focus Indicators**: 4px solid outline with 2px offset for maximum visibility
- **Keyboard Navigation**: Complete keyboard accessibility with logical tab order
- **Screen Reader Support**: Proper ARIA attributes and live regions
- **Touch Targets**: Minimum 48px touch targets for mobile devices

### Enhanced Features

- **Error Announcements**: Real-time error communication via `aria-live` regions
- **Context Announcements**: Field requirements announced on focus
- **High Contrast Support**: Enhanced styling for high contrast preferences
- **Reduced Motion**: Respects `prefers-reduced-motion` settings
- **Touch Optimization**: Prevents zoom on iOS with 16px minimum font size

### ARIA Implementation

```html
<input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="emailError"
  aria-invalid="false"
  class="auth-form-field__input"
/>
<div 
  id="emailError" 
  class="auth-form-field__error-message" 
  role="alert" 
  aria-live="polite"
></div>
```

## Internationalization

The component supports full internationalization through the MelodyMind i18n system:

### Required Translation Keys

```typescript
// Client-side validation messages
const clientTranslations = {
  "auth.form.email_invalid": "Please enter a valid email address",
  "auth.form.password_min_length": "Password must be at least 6 characters long",
  "auth.accessibility.field_error": "has an error",
  "auth.accessibility.error_resolved": "error resolved"
};
```

### Usage in Templates

```astro
---
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---

<AuthFormField
  label={t("auth.login.email")}
  placeholder={t("auth.login.email.placeholder")}
  passwordToggleLabel={t("auth.toggle_password_visibility")}
/>
```

## Styling and Theming

### CSS Variables Used

The component leverages the MelodyMind design system variables:

```css
/* Spacing */
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg

/* Colors */
--color-primary, --color-background-card, --color-border
--color-text-primary, --color-text-secondary
--color-red-400, --color-red-500, --color-error-background, --color-error-text

/* Typography */
--font-size-sm, --font-size-md
--font-weight-medium, --font-weight-semibold
--line-height-normal, --line-height-snug

/* Effects */
--border-radius-sm, --border-radius-md
--transition-duration-300, --transition-timing-in-out
```

### BEM Methodology

The component follows BEM (Block-Element-Modifier) naming:

```css
.auth-form-field {}                    /* Block */
.auth-form-field__label {}             /* Element */
.auth-form-field__input {}             /* Element */
.auth-form-field__input--error {}      /* Modifier */
.auth-form-field__input--focused {}    /* Modifier */
```

### Responsive Breakpoints

```css
@media (min-width: 768px) { /* Medium screens and up */ }
@media (hover: none) and (pointer: coarse) { /* Touch devices */ }
@media (prefers-contrast: high) { /* High contrast mode */ }
@media (prefers-reduced-motion: reduce) { /* Reduced motion */ }
```

## Performance Optimizations

### CSS Containment

```css
.auth-form-field {
  contain: layout style; /* Isolates layout and style calculations */
}
```

### Event Handling

- **Passive Listeners**: Input and focus events use `{ passive: true }`
- **Debounced Validation**: Email validation debounced by 500ms
- **Memory Management**: Cleanup function for SPA scenarios

### Progressive Enhancement

- **NoScript Fallback**: Error states work without JavaScript
- **Graceful Degradation**: Core functionality preserved without client-side features

## Security Considerations

### Input Validation

- **Client-Side**: Immediate feedback for user experience
- **Server-Side**: Always validate on server (client validation is UX enhancement)
- **XSS Prevention**: Safe handling of labelSuffix HTML content

### Email Validation

```typescript
// Comprehensive email regex (RFC 5322 compliant)
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Length validation (RFC 5321 limit)
return email.length <= 320 && emailRegex.test(email);
```

## Testing Recommendations

### Unit Tests

```typescript
// Test prop validation
describe("AuthFormField Props", () => {
  test("validates required props", () => {
    // Test implementation
  });
  
  test("applies optional props correctly", () => {
    // Test implementation
  });
});
```

### Accessibility Tests

```typescript
// Test ARIA attributes
describe("AuthFormField Accessibility", () => {
  test("has proper ARIA attributes", () => {
    // Test aria-required, aria-describedby, etc.
  });
  
  test("announces errors to screen readers", () => {
    // Test aria-live behavior
  });
});
```

### Integration Tests

```typescript
// Test with real forms
describe("AuthFormField Integration", () => {
  test("works in login form", () => {
    // Test form submission and validation
  });
  
  test("integrates with PasswordToggleButton", () => {
    // Test password visibility toggle
  });
});
```

## Related Components

- **[PasswordToggleButton](./PasswordToggleButton.md)** - Password visibility toggle functionality
- **[AuthForm](./AuthForm.md)** - Parent form component for authentication
- **[FormErrorMessage](./FormErrorMessage.md)** - Standalone error message component
- **[ValidationTooltip](./ValidationTooltip.md)** - Advanced validation feedback

## Migration Guide

### From v2.x to v3.x

**Breaking Changes:**
- `showPasswordToggle` now defaults to `true` for password fields
- `AccessibilityAnnouncer` is now a singleton pattern
- CSS classes updated to follow strict BEM methodology

**Migration Steps:**

1. Update import paths if using relative imports
2. Review custom CSS that targets component classes
3. Update TypeScript types if extending the Props interface
4. Test accessibility features with screen readers

```astro
<!-- Before (v2.x) -->
<AuthFormField
  id="password"
  type="password"
  showPasswordToggle={true}  <!-- Explicitly required -->
/>

<!-- After (v3.x) -->
<AuthFormField
  id="password"
  type="password"
  <!-- showPasswordToggle defaults to true -->
/>
```

## Changelog

### v3.0.0 (Current)
- **Added**: WCAG AAA compliance with enhanced focus indicators
- **Added**: AccessibilityAnnouncer singleton for better screen reader support
- **Added**: CSS containment for performance optimization
- **Added**: Comprehensive high contrast mode support
- **Added**: Touch device optimizations with 48px minimum targets
- **Changed**: BEM methodology enforcement for all CSS classes
- **Changed**: Enhanced email validation with RFC 5322 compliance
- **Fixed**: Focus management issues in error states

### v2.5.0
- **Added**: Real-time validation for email and password fields
- **Added**: Progressive enhancement with NoScript fallback
- **Added**: Internationalization support for validation messages
- **Improved**: Error handling with better user feedback

### v2.0.0
- **Added**: TypeScript interface for Props
- **Added**: Integration with PasswordToggleButton component
- **Added**: Responsive design with CSS Grid and Flexbox
- **Changed**: Complete redesign with design system variables

## Support

For questions or issues related to the AuthFormField component:

1. Check the [Component Guidelines](../guidelines/components.md)
2. Review [Accessibility Standards](../accessibility/wcag-aaa-optimization.md)
3. Consult [TypeScript Integration](../development/typescript-integration.md)
4. Create an issue in the project repository
