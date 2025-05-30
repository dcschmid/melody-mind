# AuthForm Component - Comprehensive Documentation

## Overview

The `AuthForm` component is a sophisticated, WCAG AAA compliant authentication solution for
MelodyMind that combines both login and registration functionality in a single, accessible
component. It features tab-based navigation, real-time validation, comprehensive
internationalization support, and follows all MelodyMind coding standards.

![AuthForm Component Preview](../../public/docs/components/auth-form.png)

## Table of Contents

1. [Key Features](#key-features)
2. [Properties](#properties)
3. [Usage Examples](#usage-examples)
4. [Sub-components](#sub-components)
5. [CSS Architecture](#css-architecture)
6. [Accessibility Compliance](#accessibility-compliance)
7. [Internationalization](#internationalization)
8. [JavaScript API](#javascript-api)
9. [Performance Optimizations](#performance-optimizations)
10. [Error Handling](#error-handling)
11. [Testing Guidelines](#testing-guidelines)
12. [Migration Notes](#migration-notes)
13. [Related Components](#related-components)
14. [Troubleshooting](#troubleshooting)
15. [Changelog](#changelog)

## Key Features

### Core Functionality

- **Dual Mode Operation**: Seamless switching between login and registration forms
- **Tab-based Navigation**: Accessible tab interface with keyboard navigation support
- **Real-time Validation**: Client-side validation with accessibility announcements
- **Progress Tracking**: Visual progress indicators for form completion
- **Loading States**: Comprehensive loading state management with accessibility features

### Accessibility Excellence

- **WCAG AAA Compliance**: Meets the highest accessibility standards with 7:1 contrast ratios
- **Screen Reader Support**: Comprehensive ARIA attributes and live regions
- **Keyboard Navigation**: Full keyboard accessibility with logical tab order
- **Focus Management**: Visible focus indicators and proper focus restoration
- **Reduced Motion**: Respects user motion preferences
- **Enhanced Text Spacing**: Supports 2x letter spacing and 1.5x line height customization

### Performance Optimizations

- **Efficient DOM Manipulation**: Batched updates using `requestAnimationFrame`
- **Memory Management**: Intelligent caching with automatic cleanup
- **Intersection Observer**: Lazy loading for performance-critical components
- **Container Queries**: Component-specific responsive design
- **CSS Custom Properties**: Consistent theming with global variables

### International Support

- **Multi-language Ready**: Supports all MelodyMind languages (EN, DE, FR, ES, IT)
- **Dynamic Language Switching**: Runtime language updates without page reload
- **Localized Validation**: Language-specific error messages and form guidance
- **RTL Support**: Ready for right-to-left languages

## Properties

| Property      | Type                    | Required | Description                                    | Default   |
| ------------- | ----------------------- | -------- | ---------------------------------------------- | --------- |
| `initialMode` | `"login" \| "register"` | No       | Initial form mode when component first renders | `"login"` |

### Property Details

#### `initialMode`

Controls which form tab is active when the component first renders. This is particularly useful for
deep-linking scenarios where users arrive directly at a registration or login page.

**Example Usage:**

```astro
<!-- Start with login form (default) -->
<AuthForm />

<!-- Start with registration form -->
<AuthForm initialMode="register" />
```

## Usage Examples

### Basic Implementation

```astro
---
// src/pages/[lang]/auth/login.astro
import Layout from "@layouts/BaseLayout.astro";
import AuthForm from "@components/auth/AuthForm.astro";
import { getLangFromUrl } from "@utils/i18n";

const lang = getLangFromUrl(Astro.url);
---

<Layout title="Authentication - MelodyMind" lang={lang}>
  <main class="auth-page">
    <div class="auth-page__container">
      <h1 class="auth-page__title">Welcome to MelodyMind</h1>
      <AuthForm />
    </div>
  </main>
</Layout>
```

### Registration-first Implementation

```astro
---
// src/pages/[lang]/auth/register.astro
import Layout from "@layouts/BaseLayout.astro";
import AuthForm from "@components/auth/AuthForm.astro";
import { getLangFromUrl } from "@utils/i18n";

const lang = getLangFromUrl(Astro.url);
---

<Layout title="Create Account - MelodyMind" lang={lang}>
  <main class="auth-page">
    <div class="auth-page__container">
      <h1 class="auth-page__title">Join MelodyMind Today</h1>
      <AuthForm initialMode="register" />
    </div>
  </main>
</Layout>
```

### Advanced Integration with Error Handling

```astro
---
// src/pages/[lang]/auth/index.astro
import Layout from "@layouts/BaseLayout.astro";
import AuthForm from "@components/auth/AuthForm.astro";
import ErrorBoundary from "@components/ErrorBoundary.astro";
import { getLangFromUrl } from "@utils/i18n";

const lang = getLangFromUrl(Astro.url);
const mode = (Astro.url.searchParams.get("mode") as "login" | "register") || "login";
---

<Layout title="Authentication - MelodyMind" lang={lang}>
  <main class="auth-page">
    <ErrorBoundary>
      <div class="auth-page__container">
        <h1 class="auth-page__title">MelodyMind Authentication</h1>
        <AuthForm initialMode={mode} />
      </div>
    </ErrorBoundary>
  </main>
</Layout>
```

## Sub-components

The AuthForm component is composed of several modular sub-components that can be reused
independently:

### AuthFormField

Handles individual form fields with validation and accessibility features.

**Props:**

- `id: string` - Unique identifier for the form field
- `name: string` - HTML name attribute for form submission
- `type: "email" | "password" | "text"` - Input type
- `label: string` - Accessible label text
- `required: boolean` - Whether the field is required
- `showPasswordToggle?: boolean` - Show password visibility toggle

**Example:**

```astro
<AuthFormField
  id="email"
  name="email"
  type="email"
  label={t("auth.login.email")}
  required={true}
  autocomplete="email"
/>
```

### AuthSubmitButton

Provides submit buttons with loading states and accessibility features.

**Props:**

- `id: string` - Unique identifier for the submit button
- `textId: string` - ID for the button text element
- `spinnerId: string` - ID for the loading spinner
- `buttonText: string` - Text to display on the button

**Example:**

```astro
<AuthSubmitButton
  id="loginSubmit"
  buttonText={t("auth.login.submit")}
  textId="loginSubmitText"
  spinnerId="loginLoadingSpinner"
/>
```

### PasswordRequirementsPanel

Displays password requirements with real-time validation feedback.

**Props:**

- `passwordFieldId: string` - ID of the password field to monitor
- `confirmFieldId: string` - ID of the password confirmation field
- `toggleButtonText: string` - Text for the toggle button

**Example:**

```astro
<PasswordRequirementsPanel
  passwordFieldId="registerPassword"
  confirmFieldId="registerPasswordConfirm"
  toggleButtonText={t("auth.register.password_requirements")}
/>
```

## CSS Architecture

The component follows MelodyMind's CSS standards with comprehensive use of CSS custom properties
from `global.css`.

### CSS Variables Usage

The component exclusively uses CSS custom properties for all design tokens:

#### Colors

```css
/* Semantic color system */
--text-primary, --text-secondary, --text-tertiary
--bg-primary, --bg-secondary, --bg-tertiary
--interactive-primary, --interactive-primary-hover
--border-primary, --border-secondary, --border-focus
```

#### Spacing System

```css
/* Consistent spacing scale */
--space-xs (4px), --space-sm (8px), --space-md (16px)
--space-lg (24px), --space-xl (32px), --space-2xl (48px)
```

#### Typography Scale

```css
/* Responsive typography */
--text-xs (12px), --text-sm (14px), --text-base (16px)
--text-lg (18px), --text-xl (20px), --text-2xl (24px)
--font-normal (400), --font-medium (500), --font-semibold (600)
```

#### Layout Elements

```css
/* Consistent layout system */
--radius-sm (6px), --radius-md (8px), --radius-lg (12px)
--shadow-sm, --shadow-md, --shadow-lg
--transition-fast, --transition-normal, --transition-slow
```

### BEM Methodology

The component follows the Block-Element-Modifier (BEM) methodology for consistent class naming:

```css
/* Block */
.auth-form__container

/* Elements */
.auth-form__tabs
.auth-form__tab
.auth-form__form
.auth-form__progress
.auth-form__message

/* Modifiers */
.auth-form__tab--active
.auth-form__form--active
.auth-form__message--error
.auth-form__message--success
```

### Responsive Design

The component implements mobile-first responsive design using CSS custom properties and container
queries:

```css
/* Base mobile styles */
.auth-form__container {
  padding: var(--space-md);
}

/* Tablet and desktop enhancements */
@media (min-width: 768px) {
  .auth-form__container {
    padding: var(--space-lg);
    max-width: var(--container-md);
  }
}

/* Container queries for component-specific responsiveness */
@container auth-form (max-width: 480px) {
  .auth-form__tab {
    padding: var(--space-sm);
    font-size: var(--text-sm);
  }
}
```

## Accessibility Compliance

The component achieves WCAG AAA compliance through comprehensive accessibility features:

### WCAG AAA Standards Met

#### Color Contrast (Success Criterion 1.4.6)

- **Normal Text**: 7:1 contrast ratio minimum
- **Large Text**: 4.5:1 contrast ratio minimum
- **UI Components**: 3:1 contrast ratio minimum
- **Focus Indicators**: 3:1 contrast ratio with adjacent colors

#### Keyboard Navigation (Success Criterion 2.1.1)

- **Tab Navigation**: Logical tab order throughout the form
- **Arrow Key Navigation**: Left/right arrows switch between form tabs
- **Enter/Space**: Activates buttons and submits forms
- **Escape**: Dismisses error messages and resets focus

#### Focus Management (Success Criterion 2.4.7)

- **Visible Focus Indicators**: 3px solid outline with 2px offset
- **Focus Restoration**: Returns focus to appropriate elements after interactions
- **Focus Trapping**: Keeps focus within modal dialogs when present

#### Screen Reader Support (Success Criterion 4.1.3)

```html
<!-- Live regions for dynamic content -->
<div aria-live="assertive" id="errorRegion">
  <!-- Error messages announced immediately -->
</div>

<div aria-live="polite" id="statusRegion">
  <!-- Status updates announced when convenient -->
</div>

<!-- Proper form labeling -->
<form aria-labelledby="loginFormHeading" role="tabpanel">
  <h2 id="loginFormHeading" class="sr-only">Login Form</h2>
  <!-- Form fields with proper associations -->
</form>
```

#### Touch Targets (Success Criterion 2.5.5)

- **Minimum Size**: 44×44px for all interactive elements
- **Spacing**: Adequate spacing between adjacent touch targets
- **Mobile Optimization**: Enhanced touch targets on mobile devices

### Enhanced Accessibility Features

#### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .auth-form__form {
    transition: none;
    transform: none;
  }

  .auth-form__tab {
    transition: none;
  }
}
```

#### Enhanced Text Spacing

```css
.enhanced-text-spacing .auth-form__container * {
  letter-spacing: var(--text-spacing-letter-2x) !important;
  word-spacing: var(--text-spacing-word-enhanced) !important;
  line-height: var(--text-spacing-line-1-5x) !important;
}
```

#### High Contrast Mode

```css
@media (prefers-contrast: high) {
  .auth-form__tab {
    border: var(--border-width-enhanced) solid var(--color-white);
  }

  .auth-form__tab:focus-visible {
    outline-width: var(--border-width-enhanced);
  }
}
```

## Internationalization

The component provides comprehensive internationalization support for all MelodyMind languages.

### Supported Languages

| Language | Code | Status      |
| -------- | ---- | ----------- |
| English  | `en` | ✅ Complete |
| German   | `de` | ✅ Complete |
| French   | `fr` | ✅ Complete |
| Spanish  | `es` | ✅ Complete |
| Italian  | `it` | ✅ Complete |

### Translation Keys

The component uses the following translation keys for proper internationalization:

#### Form Labels and Placeholders

```typescript
// Login form
"auth.login.title";
"auth.login.email";
"auth.login.email.placeholder";
"auth.login.password";
"auth.login.password.placeholder";
"auth.login.submit";
"auth.login.forgot_password";

// Registration form
"auth.register.title";
"auth.register.email";
"auth.register.email.placeholder";
"auth.register.username";
"auth.register.username.placeholder";
"auth.register.password";
"auth.register.password.placeholder";
"auth.register.password_confirm";
"auth.register.password_confirm.placeholder";
"auth.register.password_requirements";
"auth.register.submit";
```

#### Accessibility Strings

```typescript
// Screen reader announcements
"auth.accessibility.login_form_active";
"auth.accessibility.register_form_active";
"auth.accessibility.error_message_dismissed";
"auth.accessibility.success_message_dismissed";
"auth.accessibility.password_toggle";
"auth.accessibility.loading_state";
```

#### Error Messages

```typescript
// Validation errors
"auth.form.email_required";
"auth.form.email_invalid";
"auth.form.password_required";
"auth.form.password_requirements";
"auth.form.password_confirm_required";
"auth.form.passwords_not_match";

// Service errors
"auth.service.invalid_credentials";
"auth.service.too_many_attempts";
"auth.service.network_error";
"auth.service.server_error";
```

### Dynamic Language Switching

The component supports runtime language switching without page reload:

```typescript
// Utility function for updating component language
function updateComponentLanguage(newLang: string): void {
  const currentLang = document.documentElement.lang || "en";
  if (currentLang !== newLang) {
    // Update translations
    const t = useTranslations(newLang);

    // Update form labels
    updateFormLabels(t);

    // Update error messages
    updateErrorMessages(t);

    // Update accessibility strings
    updateAccessibilityStrings(t);
  }
}
```

## JavaScript API

The component exposes several utility functions for programmatic control and integration.

### Core Functions

#### `setupAuthForm(): void`

Initializes the authentication form with all required event listeners and accessibility features.

**Features:**

- Tab switching functionality
- Form validation
- Progress tracking
- Session timeout management
- Accessibility enhancements

**Example:**

```typescript
// Manual initialization (automatically called on page load)
setupAuthForm();
```

#### `switchTab(mode: 'login' | 'register'): void`

Programmatically switches between login and registration forms with accessibility announcements.

**Parameters:**

- `mode`: The target form mode

**Example:**

```typescript
// Switch to registration form
switchTab("register");

// Switch to login form
switchTab("login");
```

#### `setFormLoadingState(formId: string, isLoading: boolean): void`

Controls the loading state of a specific form with accessibility updates.

**Parameters:**

- `formId`: ID of the form element
- `isLoading`: Whether to show loading state

**Example:**

```typescript
// Show loading state for login form
setFormLoadingState("loginForm", true);

// Hide loading state
setFormLoadingState("loginForm", false);
```

### Event Handlers

#### Form Submission

```typescript
// Login form submission
async function handleLoginSubmit(event: Event): Promise<void> {
  event.preventDefault();

  // Show loading state
  setFormLoadingState("loginForm", true);

  try {
    // Validate form data
    const formData = new FormData(event.target as HTMLFormElement);
    await validateLoginData(formData);

    // Submit to API
    const response = await submitLogin(formData);

    // Handle success
    if (response.success) {
      showSuccessMessage(t("auth.login.success"));
      redirectToAccount();
    }
  } catch (error) {
    // Handle errors
    showErrorMessage(error.message);
  } finally {
    // Hide loading state
    setFormLoadingState("loginForm", false);
  }
}
```

#### Tab Switching

```typescript
// Tab switching with accessibility
function handleTabSwitch(newMode: "login" | "register"): void {
  // Update visual state
  updateTabAppearance(newMode);

  // Show/hide forms
  toggleFormVisibility(newMode);

  // Update ARIA attributes
  updateTabAriaAttributes(newMode);

  // Announce change to screen readers
  announceTabChange(newMode);

  // Update browser history
  updateURLState(newMode);
}
```

## Performance Optimizations

The component implements several performance optimizations for optimal user experience.

### Efficient DOM Manipulation

#### Batched Updates

```typescript
// Use requestAnimationFrame for batched DOM updates
function updateFormState(newState: FormState): void {
  requestAnimationFrame(() => {
    // Batch all DOM updates together
    updateFormVisibility(newState);
    updateButtonStates(newState);
    updateProgressIndicators(newState);
    updateAccessibilityAttributes(newState);
  });
}
```

#### Memory Management

```typescript
// Intelligent caching with automatic cleanup
const MAX_CACHE_SIZE = 50;
const elementCache = new Map();

function manageCache(): void {
  if (elementCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entries (FIFO)
    const oldestKey = elementCache.keys().next().value;
    elementCache.delete(oldestKey);
  }
}
```

### Lazy Loading

#### Intersection Observer

```typescript
// Lazy load components when they become visible
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        initializeComponent(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "50px" }
);
```

### CSS Performance

#### Container Queries

```css
/* Component-specific responsive design */
@container auth-form (max-width: 480px) {
  .auth-form__container {
    padding: var(--space-sm);
  }
}
```

#### Hardware Acceleration

```css
/* GPU acceleration for smooth animations */
.auth-form__form {
  will-change: transform, opacity;
  transform: translateZ(0);
}
```

## Error Handling

The component provides comprehensive error handling for various scenarios.

### Error Types

#### Validation Errors

```typescript
interface ValidationError {
  field: string;
  message: string;
  type: "required" | "format" | "length" | "match";
}

// Example validation error handling
function handleValidationError(error: ValidationError): void {
  // Show field-specific error
  showFieldError(error.field, error.message);

  // Focus the problematic field
  focusField(error.field);

  // Announce error to screen readers
  announceError(error.message);
}
```

#### Network Errors

```typescript
// Network error handling with retry mechanism
async function handleNetworkError(error: NetworkError): Promise<void> {
  if (error.status === 429) {
    // Rate limiting
    showRateLimitMessage();
    enableRetryAfterDelay(error.retryAfter);
  } else if (error.status >= 500) {
    // Server errors
    showServerErrorMessage();
    enableRetryButton();
  } else {
    // Client errors
    showValidationErrors(error.validationErrors);
  }
}
```

#### Authentication Errors

```typescript
// Authentication-specific error handling
function handleAuthError(error: AuthError): void {
  switch (error.type) {
    case "invalid_credentials":
      showError(t("auth.service.invalid_credentials"));
      clearPasswordField();
      focusPasswordField();
      break;

    case "account_locked":
      showError(t("auth.service.account_locked"));
      disableLoginForm();
      showAccountRecoveryOptions();
      break;

    case "email_not_verified":
      showError(t("auth.service.email_not_verified"));
      showResendVerificationButton();
      break;
  }
}
```

### Error Recovery

#### Automatic Recovery

```typescript
// Automatic error recovery mechanisms
function setupErrorRecovery(): void {
  // Network retry with exponential backoff
  const retryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
  };

  // Form state recovery from localStorage
  const saveFormState = debounce(() => {
    const formData = getFormData();
    localStorage.setItem("authFormState", JSON.stringify(formData));
  }, 500);

  // Session timeout recovery
  setupSessionTimeoutRecovery();
}
```

## Testing Guidelines

The component requires comprehensive testing across multiple dimensions.

### Unit Testing

#### Component Logic Tests

```typescript
// Test tab switching functionality
describe('AuthForm Tab Switching', () => {
  test('switches to registration form when register tab clicked', () => {
    const { getByRole } = render(<AuthForm initialMode="login" />);
    const registerTab = getByRole('tab', { name: /register/i });

    fireEvent.click(registerTab);

    expect(getByRole('tabpanel', { name: /register/i })).toBeVisible();
  });
});

// Test form validation
describe('AuthForm Validation', () => {
  test('shows error for invalid email format', async () => {
    const { getByLabelText, getByText } = render(<AuthForm />);
    const emailInput = getByLabelText(/email/i);

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(getByText(/invalid email format/i)).toBeVisible();
    });
  });
});
```

### Accessibility Testing

#### Screen Reader Testing

```typescript
// Test ARIA attributes and announcements
describe('AuthForm Accessibility', () => {
  test('announces tab changes to screen readers', async () => {
    const { getByRole } = render(<AuthForm />);
    const registerTab = getByRole('tab', { name: /register/i });

    fireEvent.click(registerTab);

    await waitFor(() => {
      const announcement = getByRole('status');
      expect(announcement).toHaveTextContent(/registration form active/i);
    });
  });
});

// Test keyboard navigation
describe('AuthForm Keyboard Navigation', () => {
  test('supports arrow key navigation between tabs', () => {
    const { getByRole } = render(<AuthForm />);
    const loginTab = getByRole('tab', { name: /login/i });

    loginTab.focus();
    fireEvent.keyDown(loginTab, { key: 'ArrowRight' });

    const registerTab = getByRole('tab', { name: /register/i });
    expect(registerTab).toHaveFocus();
  });
});
```

### Integration Testing

#### API Integration Tests

```typescript
// Test form submission with API
describe('AuthForm API Integration', () => {
  test('submits login form to correct endpoint', async () => {
    const mockApiCall = jest.fn().mockResolvedValue({ success: true });
    const { getByRole, getByLabelText } = render(<AuthForm />);

    fireEvent.change(getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
```

### Performance Testing

#### Loading Time Tests

```typescript
// Test component initialization performance
describe('AuthForm Performance', () => {
  test('initializes within acceptable time limit', async () => {
    const startTime = performance.now();

    render(<AuthForm />);

    await waitFor(() => {
      const endTime = performance.now();
      const initTime = endTime - startTime;
      expect(initTime).toBeLessThan(100); // 100ms threshold
    });
  });
});
```

### Cross-browser Testing

Test the component across all supported browsers:

- **Chrome 88+**
- **Firefox 85+**
- **Safari 14+**
- **Edge 88+**
- **Mobile browsers** (iOS Safari 14+, Chrome Mobile 88+)

## Migration Notes

### From v2.x to v3.x

#### Breaking Changes

- **Props Interface**: Updated for better TypeScript support
- **CSS Variables**: Migration to design token system required
- **Accessibility**: Enhanced ARIA attributes may require theme updates

#### Upgrade Path

1. **Update Import Statements**

   ```typescript
   // Old
   import AuthForm from "@components/AuthForm.astro";

   // New
   import AuthForm from "@components/auth/AuthForm.astro";
   ```

2. **Review CSS Customizations**

   ```css
   /* Update hardcoded values to CSS variables */
   /* Old */
   .custom-auth-form {
     background-color: #1f2937;
     padding: 24px;
   }

   /* New */
   .custom-auth-form {
     background-color: var(--bg-secondary);
     padding: var(--space-lg);
   }
   ```

3. **Test Accessibility Features**
   - Verify screen reader compatibility
   - Test keyboard navigation
   - Check focus management
   - Validate color contrast ratios

### Compatibility Matrix

| Version | Astro | TypeScript | Node.js |
| ------- | ----- | ---------- | ------- |
| 3.x     | 4.0+  | 5.0+       | 18+     |
| 2.x     | 3.0+  | 4.5+       | 16+     |
| 1.x     | 2.0+  | 4.0+       | 16+     |

## Related Components

### Direct Dependencies

- [AuthFormField](./AuthFormField.md) - Individual form field component
- [AuthSubmitButton](./AuthSubmitButton.md) - Submit button with loading states
- [PasswordRequirementsPanel](./PasswordRequirementsPanel.md) - Password validation display

### Utility Dependencies

- [i18n utilities](../utils/i18n.md) - Internationalization support
- [authFormUtils](../utils/auth/authFormUtils.md) - Form handling logic
- [ui-interactions](../utils/auth/ui-interactions.md) - UI interaction handlers

### Layout Components

- [BaseLayout](../layouts/BaseLayout.md) - Standard page layout
- [ErrorBoundary](./ErrorBoundary.md) - Error handling wrapper

### Optional Enhancements

- [LoadingSpinner](./LoadingSpinner.md) - Custom loading indicators
- [Toast](./Toast.md) - Notification system
- [Modal](./Modal.md) - Modal dialog wrapper

## Troubleshooting

### Common Issues

#### Forms Not Switching

**Problem**: Tab clicks don't switch between login and registration forms. **Solution**: Ensure
JavaScript is enabled and check for console errors.

```typescript
// Debug tab switching
function debugTabSwitching(): void {
  console.log("Current active tab:", document.querySelector(".auth-form__tab--active"));
  console.log("Available forms:", document.querySelectorAll(".auth-form__form"));
}
```

#### Validation Errors Not Showing

**Problem**: Form validation errors aren't displayed to users. **Solution**: Check that error
elements have proper ARIA attributes.

```html
<!-- Ensure error region exists -->
<div id="errorRegion" aria-live="assertive" class="auth-form__error">
  <!-- Error messages will be inserted here -->
</div>
```

#### Loading States Not Working

**Problem**: Submit buttons don't show loading states. **Solution**: Verify button elements have
required classes and IDs.

```typescript
// Debug button elements
function debugButtonElements(buttonId: string): void {
  const button = document.getElementById(buttonId);
  const textElement = button?.querySelector(".auth-form__submit-text");
  const spinner = button?.querySelector(".auth-form__spinner");

  console.log({ button, textElement, spinner });
}
```

### Performance Issues

#### Slow Form Initialization

**Problem**: Form takes too long to become interactive. **Solution**: Check for blocking JavaScript
and optimize DOM queries.

```typescript
// Performance monitoring
function monitorFormPerformance(): void {
  const startTime = performance.now();

  // Initialize form
  setupAuthForm();

  const endTime = performance.now();
  console.log(`Form initialization took ${endTime - startTime} milliseconds`);
}
```

#### Memory Leaks

**Problem**: Memory usage increases over time. **Solution**: Ensure proper cleanup of event
listeners and cache management.

```typescript
// Memory leak prevention
function cleanupAuthForm(): void {
  // Remove event listeners
  document.removeEventListener("click", handleTabClick);

  // Clear caches
  elementCache.clear();

  // Cancel any pending animations
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
}
```

### Accessibility Issues

#### Screen Reader Not Announcing Changes

**Problem**: State changes aren't announced to screen readers. **Solution**: Verify ARIA live
regions are properly configured.

```html
<!-- Ensure live regions exist -->
<div id="tabSwitchAnnouncer" class="sr-only" aria-live="polite" aria-atomic="true"></div>
```

#### Focus Not Visible

**Problem**: Focus indicators aren't visible or have poor contrast. **Solution**: Check CSS focus
styles and color contrast ratios.

```css
/* Ensure visible focus styles */
.auth-form__tab:focus-visible {
  outline: var(--focus-outline);
  outline-offset: var(--focus-ring-offset);
  box-shadow: var(--focus-enhanced-shadow);
}
```

## Changelog

### Version 3.2.0 (Current)

- **Added**: Enhanced text spacing support for WCAG 2.2 compliance
- **Added**: Container queries for component-specific responsive design
- **Added**: Memory management optimizations with automatic cache cleanup
- **Improved**: Error recovery mechanisms with exponential backoff
- **Fixed**: Focus management edge cases in tab switching

### Version 3.1.0

- **Added**: Touch device optimizations with enhanced touch targets
- **Added**: High contrast mode support for improved visibility
- **Improved**: Form validation with real-time feedback
- **Fixed**: Screen reader announcements for dynamic content

### Version 3.0.0

- **Breaking**: Complete rewrite with TypeScript and modern CSS
- **Added**: WCAG AAA compliance with 7:1 contrast ratios
- **Added**: Comprehensive internationalization support
- **Added**: Performance optimizations with intersection observers
- **Added**: CSS custom properties integration

### Version 2.5.0

- **Added**: Password requirements panel with visual feedback
- **Added**: Session timeout management
- **Improved**: Error handling with specific validation messages

### Version 2.0.0

- **Breaking**: Migrated from class-based to functional components
- **Added**: Tab-based navigation between login and registration
- **Added**: Real-time form validation
- **Improved**: Accessibility with proper ARIA attributes

### Version 1.0.0

- **Initial**: Basic authentication form with login functionality
- **Added**: Email and password validation
- **Added**: Basic responsive design

## Contributing

### Development Setup

1. **Clone Repository**

   ```bash
   git clone https://github.com/your-org/melody-mind.git
   cd melody-mind
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

### Code Standards

- Follow the [MelodyMind Coding Standards](../../.github/copilot-instructions.md)
- Use CSS custom properties from `global.css`
- Ensure WCAG AAA compliance for all changes
- Add comprehensive JSDoc comments
- Include unit tests for new functionality

### Pull Request Guidelines

1. **Code Quality**

   - [ ] All CSS uses custom properties from `global.css`
   - [ ] No hardcoded design values
   - [ ] Proper TypeScript typing
   - [ ] Comprehensive JSDoc documentation

2. **Accessibility**

   - [ ] WCAG AAA compliance verified
   - [ ] Screen reader testing completed
   - [ ] Keyboard navigation tested
   - [ ] Color contrast ratios validated

3. **Testing**
   - [ ] Unit tests added/updated
   - [ ] Integration tests passing
   - [ ] Cross-browser testing completed
   - [ ] Performance impact assessed

## License

This component is part of the MelodyMind project and is licensed under the MIT License. See the
[LICENSE](../../LICENSE) file for details.

---

## Additional Resources

### External Documentation

- [Astro Components Documentation](https://docs.astro.build/en/basics/astro-components/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

### MelodyMind Resources

- [Design System Documentation](../design-system/README.md)
- [Component Library](../components/README.md)
- [Internationalization Guide](../i18n/README.md)
- [Testing Strategy](../testing/README.md)
- [Performance Guidelines](../performance/README.md)

### Support

For questions or issues related to the AuthForm component:

1. **Check Documentation**: Review this comprehensive guide first
2. **Search Issues**: Look for existing issues in the project repository
3. **Create Issue**: Submit a detailed issue with reproduction steps
4. **Code Review**: Request code review for complex modifications

---

_This documentation follows MelodyMind's comprehensive documentation standards and is maintained in
English for consistency across the project._
