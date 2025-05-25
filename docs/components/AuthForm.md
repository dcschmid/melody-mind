# AuthForm Component

## Overview

The AuthForm component is a comprehensive authentication solution for MelodyMind that combines both login and registration functionality in a single, accessible component. It features tab-based navigation, real-time validation, and full WCAG AAA compliance.

![AuthForm Component Preview](../../public/docs/components/auth-form.png)

## Properties

| Property    | Type                    | Required | Description                                    | Default   |
| ----------- | ----------------------- | -------- | ---------------------------------------------- | --------- |
| initialMode | "login" \| "register"   | No       | Initial form mode when component first renders | "login"   |

## Usage

### Basic Usage

```astro
---
import AuthForm from "@components/auth/AuthForm.astro";
---

<!-- Default login mode -->
<AuthForm />
```

### Start with Registration

```astro
---
import AuthForm from "@components/auth/AuthForm.astro";
---

<!-- Start with registration form active -->
<AuthForm initialMode="register" />
```

### Integration Example

```astro
---
// src/pages/[lang]/auth/login.astro
import Layout from "@layouts/BaseLayout.astro";
import AuthForm from "@components/auth/AuthForm.astro";
import { getLangFromUrl } from "@utils/i18n";

const lang = getLangFromUrl(Astro.url);
---

<Layout title="Login - MelodyMind" lang={lang}>
  <main class="auth-page">
    <div class="auth-page__container">
      <h1 class="auth-page__title">Welcome to MelodyMind</h1>
      <AuthForm initialMode="login" />
    </div>
  </main>
</Layout>
```

## Features

### Tab-based Navigation
- Smooth transitions between login and registration forms
- Keyboard accessible with arrow key navigation
- Visual focus indicators that meet WCAG AAA standards
- Screen reader announcements for state changes

### Form Validation
- Real-time client-side validation
- Server-side validation integration
- Accessible error messages with live regions
- Password strength requirements with visual feedback

### Accessibility Features
- **WCAG AAA Compliant**: Meets all Level AAA success criteria
- **Screen Reader Support**: Proper ARIA attributes and live regions
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Logical focus order and visible indicators
- **Reduced Motion**: Respects user motion preferences
- **High Contrast**: Enhanced visibility for users with vision needs

### Internationalization
- Supports all MelodyMind languages (EN, DE, FR, ES, IT)
- Dynamic language switching
- RTL language support ready
- Localized error messages and form labels

## Sub-components

The AuthForm component is composed of several modular sub-components:

### AuthFormField
Handles individual form fields with validation and accessibility features.

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

```astro
<PasswordRequirementsPanel
  passwordFieldId="registerPassword"
  confirmFieldId="registerPasswordConfirm"
  toggleButtonText={t("auth.register.password_requirements")}
/>
```

## API Integration

The component integrates with MelodyMind's authentication API through utility functions:

### Login Flow
1. User submits login form
2. Client-side validation checks
3. API request to `/api/auth/login`
4. Success: Redirect to dashboard
5. Error: Display localized error message

### Registration Flow
1. User submits registration form
2. Password requirements validation
3. API request to `/api/auth/register`
4. Success: Email verification flow
5. Error: Display specific validation errors

## Error Handling

The component handles various error scenarios:

- **Invalid Credentials**: Clear, non-revealing error messages
- **Network Errors**: Retry mechanisms and user-friendly messaging
- **Validation Errors**: Real-time feedback with specific guidance
- **Rate Limiting**: Graceful degradation with clear explanations

## Styling Architecture

The component follows MelodyMind's CSS architecture:

### BEM Methodology
```css
.auth-form__container       /* Block */
.auth-form__tab            /* Element */
.auth-form__tab--active    /* Modifier */
```

### CSS Custom Properties
```css
/* Color tokens */
--color-primary: #8b5cf6;
--color-error: #ef4444;
--color-success: #10b981;

/* Spacing tokens */
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;

/* Typography tokens */
--font-size-sm: 0.875rem;
--font-weight-medium: 500;
--line-height-relaxed: 1.625;
```

### Responsive Design
```css
/* Mobile-first approach */
@media (min-width: 640px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }

/* Container queries for component isolation */
@container (max-width: 400px) {
  .auth-form__tabs {
    flex-direction: column;
  }
}
```

## Accessibility Compliance

### WCAG AAA Standards

#### Perceivable
- **Color Contrast**: 7:1 ratio for normal text, 4.5:1 for large text
- **Text Alternatives**: All non-text content has appropriate alternatives
- **Adaptable Content**: Content can be presented in different ways without losing meaning

#### Operable
- **Keyboard Accessible**: All functionality available via keyboard
- **Touch Targets**: Minimum 44×44px touch targets for mobile
- **Focus Indicators**: 3px solid borders for all interactive elements

#### Understandable
- **Readable Text**: Minimum 18px base font size
- **Predictable Navigation**: Consistent navigation patterns
- **Input Assistance**: Clear labels, instructions, and error messages

#### Robust
- **Valid Markup**: Semantic HTML with proper ARIA attributes
- **Assistive Technology**: Compatible with screen readers and other AT

### Screen Reader Support

The component provides comprehensive screen reader support:

```html
<!-- Live regions for dynamic content -->
<div id="formError" role="alert" aria-live="assertive">
<!-- Tab navigation with proper roles -->
<div class="auth-form__tabs" role="tablist">
<button role="tab" aria-selected="true" aria-controls="loginForm">

<!-- Form labeling and descriptions -->
<form aria-labelledby="loginFormHeading" role="tabpanel">
<h2 id="loginFormHeading" class="sr-only">Login Form</h2>
```

## Performance Considerations

### Loading Performance
- **Critical CSS**: Inline critical styles for above-the-fold content
- **Progressive Enhancement**: Works without JavaScript
- **Code Splitting**: Authentication utilities loaded on demand

### Runtime Performance
- **Event Delegation**: Efficient event listener management
- **Throttled Validation**: Debounced input validation to prevent excessive API calls
- **Memory Management**: Proper cleanup of event listeners

### Bundle Size
- **Tree Shaking**: Only used utility functions included
- **Modular Architecture**: Components can be imported individually
- **Minimal Dependencies**: Pure CSS and vanilla JavaScript approach

## Testing Strategy

### Unit Tests
```typescript
// Example test structure (implementation pending)
describe('AuthForm Component', () => {
  test('should render login form by default', () => {
    // Test implementation
  });
  
  test('should switch to registration form when tab is clicked', () => {
    // Test implementation
  });
  
  test('should validate email format in real-time', () => {
    // Test implementation
  });
});
```

### Accessibility Tests
- **Automated Testing**: axe-core integration for WCAG compliance
- **Manual Testing**: Screen reader testing with NVDA, JAWS, VoiceOver
- **Keyboard Testing**: Complete keyboard navigation verification

### Cross-browser Testing
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Assistive Technology**: NVDA, JAWS, VoiceOver compatibility

## Migration Notes

### From v2.x to v3.x
- **Breaking Changes**: Props interface updated for better TypeScript support
- **CSS Variables**: Migration to design token system required
- **Accessibility**: Enhanced ARIA attributes may require theme updates

### Upgrade Path
1. Update import statements to new component path
2. Review custom CSS for design token compatibility
3. Test accessibility features with assistive technology
4. Validate internationalization setup

## Related Components

- [AuthFormField](./AuthFormField.md) - Individual form field component
- [AuthSubmitButton](./AuthSubmitButton.md) - Submit button with loading states
- [PasswordRequirementsPanel](./PasswordRequirementsPanel.md) - Password validation display
- [ErrorBoundary](./ErrorBoundary.md) - Error handling wrapper
- [LoadingSpinner](./LoadingSpinner.md) - Loading state indicator

## API Reference

### Utility Functions

#### `initializeAuthForm(translations: AuthTranslations): void`
Initializes form validation and event listeners.

#### `switchTab(mode: 'login' | 'register'): void`
Switches between login and registration forms with accessibility announcements.

#### `handleLoginSubmit(event: Event, translations: AuthTranslations): Promise<void>`
Handles login form submission with validation and API integration.

#### `handleRegisterSubmit(event: Event): Promise<void>`
Handles registration form submission with password validation.

### Type Definitions

```typescript
interface AuthTranslations {
  invalidCredentials: string;
  tooManyAttempts: string;
  networkError: string;
  validationError: string;
}

interface AuthFormProps {
  initialMode?: 'login' | 'register';
}

interface AuthFormState {
  currentMode: 'login' | 'register';
  isLoading: boolean;
  errors: Record<string, string>;
  isValid: boolean;
}
```

## Changelog

### v3.1.0 - 2025-05-25
- **Added**: Container queries for better responsive behavior
- **Enhanced**: High contrast mode support
- **Improved**: Screen reader compatibility with enhanced ARIA attributes
- **Fixed**: Focus management issues in tab navigation

### v3.0.0 - 2025-05-20
- **Breaking**: Updated to WCAG AAA compliance standards
- **Added**: Comprehensive internationalization support
- **Enhanced**: Password requirements with real-time validation
- **Improved**: Mobile accessibility with larger touch targets

### v2.5.0 - 2025-05-15
- **Added**: Reduced motion support for accessibility
- **Enhanced**: Error handling with specific validation messages
- **Improved**: TypeScript definitions for better developer experience

## Contributing

When contributing to the AuthForm component:

1. **Follow Standards**: Adhere to MelodyMind coding standards
2. **Test Accessibility**: Verify WCAG AAA compliance
3. **Document Changes**: Update this documentation
4. **Internationalization**: Ensure all text is translatable
5. **Performance**: Consider impact on bundle size and runtime performance

## License

This component is part of the MelodyMind project and follows the project's licensing terms.
