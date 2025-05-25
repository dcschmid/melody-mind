# Authentication Utilities API Reference

## Overview

This document provides a comprehensive API reference for all authentication utility functions and
modules used in the MelodyMind authentication system. These utilities provide form handling,
validation, UI interactions, and API integration.

## Core Modules

### authFormUtils.ts

The main utility module for authentication form functionality.

#### `initializeAuthForm(translations: AuthFormTranslations): void`

Initializes the authentication form with all necessary event listeners and functionality.

**Parameters:**

- `translations: AuthFormTranslations` - Translation object containing error messages

**Features:**

- Sets up tab switching between login and registration
- Attaches form submission handlers
- Initializes keyboard navigation
- Adds reduced motion detection for accessibility

**Example:**

```typescript
import { initializeAuthForm } from "@utils/auth/authFormUtils";

const translations = {
  invalidCredentials: "Invalid email or password",
  tooManyAttempts: "Too many failed attempts",
};

initializeAuthForm(translations);
```

**Dependencies:**

- DOM elements: `loginTab`, `registerTab`, `loginForm`, `registerForm`
- Utility functions: `switchTab`, `handleLoginSubmit`, `handleRegisterSubmit`

---

#### `switchTab(mode: "login" | "register"): void`

Switches between login and registration form tabs with proper accessibility support.

**Parameters:**

- `mode: "login" | "register"` - The target form mode

**Accessibility Features:**

- Updates `aria-selected` attributes
- Manages `aria-hidden` states
- Resets error messages when switching
- Maintains focus management

**Example:**

```typescript
import { switchTab } from "@utils/auth/authFormUtils";

// Switch to registration form
switchTab("register");

// Switch to login form
switchTab("login");
```

**DOM Updates:**

- Updates tab visual states with CSS classes
- Toggles form visibility
- Clears existing error/success messages
- Updates ARIA attributes for screen readers

---

#### `handleLoginSubmit(event: Event, translations: AuthFormTranslations): Promise<void>`

Handles login form submission with validation and API integration.

**Parameters:**

- `event: Event` - The form submission event
- `translations: AuthFormTranslations` - Translation object for error messages

**Validation:**

- Email format validation
- Password presence validation
- Real-time error display

**API Integration:**

- Sends POST request to login endpoint
- Handles success/error responses
- Manages redirect after successful login

**Example:**

```typescript
import { handleLoginSubmit } from "@utils/auth/authFormUtils";

const translations = {
  invalidCredentials: "Invalid credentials",
  tooManyAttempts: "Too many attempts",
};

// Attach to form
loginForm.addEventListener("submit", (event) => {
  handleLoginSubmit(event, translations);
});
```

**Loading States:**

- Shows loading spinner during submission
- Disables form inputs
- Provides loading announcements for screen readers

---

#### `handleRegisterSubmit(event: Event): Promise<void>`

Handles registration form submission with comprehensive validation.

**Parameters:**

- `event: Event` - The form submission event

**Validation Features:**

- Email format and uniqueness
- Password strength requirements
- Password confirmation matching
- Username format validation (if provided)

**Example:**

```typescript
import { handleRegisterSubmit } from "@utils/auth/authFormUtils";

// Attach to registration form
registerForm.addEventListener("submit", handleRegisterSubmit);
```

**Success Handling:**

- Displays success message
- Shows next steps (email verification)
- Provides clear user guidance

---

#### `setAuthButtonLoadingState(buttonId: string, isLoading: boolean, loadingText?: string): void`

Manages the loading state of authentication form submit buttons.

**Parameters:**

- `buttonId: string` - ID of the submit button
- `isLoading: boolean` - Whether to show loading state
- `loadingText?: string` - Optional custom loading text

**Loading State Features:**

- Shows/hides loading spinner
- Updates button text
- Manages button disabled state
- Provides ARIA busy state

**Example:**

```typescript
import { setAuthButtonLoadingState } from "@utils/auth/authFormUtils";

// Show loading state
setAuthButtonLoadingState("loginSubmit", true, "Signing in...");

// Hide loading state
setAuthButtonLoadingState("loginSubmit", false);
```

**Accessibility:**

- Updates `aria-busy` attribute
- Provides loading announcements
- Maintains keyboard focus

---

### form-handlers.ts

Handles form submission logic and API communication.

#### `handleLoginSubmission(formData: LoginFormData, translations: AuthTranslations): Promise<FormSubmissionResult>`

Processes login form data and communicates with the authentication API.

**Parameters:**

- `formData: { email: string; password: string }` - Login form data
- `translations: AuthTranslations` - Translation object for error messages

**Returns:**

- `Promise<FormSubmissionResult>` - Result object with success status and data

**API Communication:**

- Sends POST request to `/api/auth/login`
- Handles various HTTP status codes
- Manages CSRF protection
- Implements retry logic for network errors

**Example:**

```typescript
import { handleLoginSubmission } from "@utils/auth/form-handlers";

const formData = {
  email: "user@example.com",
  password: "securePassword123",
};

const result = await handleLoginSubmission(formData, translations);

if (result.success) {
  // Handle successful login
  window.location.href = result.redirectUrl;
} else {
  // Display error message
  showError(result.error);
}
```

**Error Handling:**

- Network connectivity issues
- Invalid credentials
- Rate limiting
- Server errors

---

#### `handleRegistrationSubmission(formData: RegisterFormData): Promise<FormSubmissionResult>`

Processes registration form data with comprehensive validation.

**Parameters:**

- `formData: RegisterFormData` - Registration form data object

**Form Data Structure:**

```typescript
interface RegisterFormData {
  email: string;
  username?: string;
  password: string;
  passwordConfirm: string;
}
```

**Validation Features:**

- Email format and availability checking
- Password strength requirements
- Password confirmation matching
- Username uniqueness (if provided)

**Example:**

```typescript
import { handleRegistrationSubmission } from "@utils/auth/form-handlers";

const formData = {
  email: "newuser@example.com",
  username: "newuser",
  password: "SecurePass123!",
  passwordConfirm: "SecurePass123!",
};

const result = await handleRegistrationSubmission(formData);

if (result.success) {
  showSuccess("Registration successful! Please check your email.");
} else {
  showError(result.error);
}
```

**Success Flow:**

- User account creation
- Email verification initiation
- Welcome message display
- Redirect to verification page

---

### ui-interactions.ts

Manages UI interactions and dynamic form behaviors.

#### `initializeAuthFormElements(): AuthFormElements | null`

Initializes and validates all required DOM elements for the authentication form.

**Returns:**

- `AuthFormElements | null` - Object containing all form elements or null if missing required
  elements

**Element Collection:**

```typescript
interface AuthFormElements {
  // Tab elements
  loginTab: HTMLElement;
  registerTab: HTMLElement;

  // Form elements
  loginForm: HTMLFormElement;
  registerForm: HTMLFormElement;

  // Input elements
  loginEmailInput: HTMLInputElement;
  loginPasswordInput: HTMLInputElement;
  registerEmailInput: HTMLInputElement;
  registerPasswordInput: HTMLInputElement;
  registerPasswordConfirmInput: HTMLInputElement;

  // Error display elements
  formError: HTMLElement;
  formSuccess: HTMLElement;
  loginEmailError: HTMLElement;
  loginPasswordError: HTMLElement;

  // Submit elements
  loginSubmitText: HTMLElement;
  loginLoadingSpinner: HTMLElement;
  registerSubmitText: HTMLElement;
  registerLoadingSpinner: HTMLElement;
}
```

**Example:**

```typescript
import { initializeAuthFormElements } from "@utils/auth/ui-interactions";

const elements = initializeAuthFormElements();

if (elements) {
  // All required elements found
  setupFormInteractions(elements);
} else {
  console.error("Required form elements not found");
}
```

**Validation:**

- Checks for presence of all required elements
- Returns null if any critical element is missing
- Provides type-safe element access

---

#### `setupTabSwitching(loginTab, registerTab, loginForm, registerForm, errorElement, successElement): void`

Sets up comprehensive tab switching functionality with accessibility support.

**Parameters:**

- `loginTab: HTMLElement` - Login tab button element
- `registerTab: HTMLElement` - Register tab button element
- `loginForm: HTMLElement` - Login form element
- `registerForm: HTMLElement` - Register form element
- `errorElement: HTMLElement` - Error message container
- `successElement: HTMLElement` - Success message container

**Features:**

- Click event handling
- Keyboard navigation (Enter, Space)
- ARIA attribute management
- Message clearing on tab switch

**Example:**

```typescript
import { setupTabSwitching } from "@utils/auth/ui-interactions";

const elements = initializeAuthFormElements();
if (elements) {
  setupTabSwitching(
    elements.loginTab,
    elements.registerTab,
    elements.loginForm,
    elements.registerForm,
    elements.formError,
    elements.formSuccess
  );
}
```

**Accessibility Features:**

- Updates `aria-selected` attributes
- Manages `aria-hidden` states
- Provides keyboard navigation
- Maintains logical focus order

---

#### `setupPasswordToggle(toggleButton: HTMLElement, passwordInput: HTMLInputElement): void`

Sets up password visibility toggle functionality with accessibility support.

**Parameters:**

- `toggleButton: HTMLElement` - Toggle button element
- `passwordInput: HTMLInputElement` - Password input element

**Features:**

- Toggle between password and text input types
- Icon state updates
- ARIA label updates for screen readers
- Keyboard accessibility

**Example:**

```typescript
import { setupPasswordToggle } from "@utils/auth/ui-interactions";

const passwordInput = document.getElementById("loginPassword") as HTMLInputElement;
const toggleButton = document.getElementById("toggleLoginPassword") as HTMLElement;

setupPasswordToggle(toggleButton, passwordInput);
```

**Accessibility:**

- Updates `aria-label` based on current state
- Provides clear button descriptions
- Maintains focus after toggle

---

#### `updatePasswordRequirements(config: PasswordRequirementsConfig): void`

Updates password requirements UI based on current password values.

**Parameters:**

- `config: PasswordRequirementsConfig` - Configuration object with elements and validation data

**Requirements Checked:**

- Minimum length (8 characters)
- Uppercase letters
- Lowercase letters
- Numbers
- Special characters
- Password confirmation match

**Example:**

```typescript
import { updatePasswordRequirements } from "@utils/auth/ui-interactions";

const config = {
  passwordInput: document.getElementById("registerPassword"),
  confirmInput: document.getElementById("registerPasswordConfirm"),
  requirements: {
    length: document.getElementById("req-length"),
    uppercase: document.getElementById("req-uppercase"),
    lowercase: document.getElementById("req-lowercase"),
    numbers: document.getElementById("req-numbers"),
    special: document.getElementById("req-special"),
    match: document.getElementById("req-match"),
  },
};

updatePasswordRequirements(config);
```

**Visual Updates:**

- Adds/removes success/error classes
- Updates requirement check icons
- Provides real-time feedback

---

#### `setupFormSubmission(form, submitButton, submitText, loadingSpinner, onSubmit): void`

Sets up form submission handling with loading states and error management.

**Parameters:**

- `form: HTMLFormElement` - Form element
- `submitButton: HTMLButtonElement` - Submit button element
- `submitText: HTMLElement` - Submit button text element
- `loadingSpinner: HTMLElement` - Loading spinner element
- `onSubmit: (event: Event) => Promise<void>` - Submission handler function

**Features:**

- Prevents default form submission
- Manages loading states
- Handles submission errors
- Provides user feedback

**Example:**

```typescript
import { setupFormSubmission } from "@utils/auth/ui-interactions";

setupFormSubmission(loginForm, submitButton, submitText, loadingSpinner, async (event) => {
  // Custom submission logic
  await handleLoginSubmission(formData, translations);
});
```

**Loading Management:**

- Disables form during submission
- Shows loading spinner
- Updates button text
- Provides ARIA busy states

---

## Type Definitions

### AuthFormTranslations

```typescript
interface AuthFormTranslations {
  invalidCredentials: string;
  tooManyAttempts: string;
  networkError?: string;
  validationError?: string;
}
```

### FormSubmissionResult

```typescript
interface FormSubmissionResult {
  success: boolean;
  message?: string;
  redirectUrl?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}
```

### PasswordRequirementsConfig

```typescript
interface PasswordRequirementsConfig {
  passwordInput: HTMLInputElement;
  confirmInput: HTMLInputElement;
  requirements: {
    length: HTMLElement;
    uppercase: HTMLElement;
    lowercase: HTMLElement;
    numbers: HTMLElement;
    special: HTMLElement;
    match: HTMLElement;
  };
}
```

## Error Handling

### Common Error Scenarios

#### Network Errors

```typescript
try {
  const result = await handleLoginSubmission(formData, translations);
} catch (error) {
  if (error.code === "NETWORK_ERROR") {
    showError(translations.networkError);
  }
}
```

#### Validation Errors

```typescript
const result = await handleRegistrationSubmission(formData);
if (!result.success && result.fieldErrors) {
  Object.entries(result.fieldErrors).forEach(([field, error]) => {
    showFieldError(field, error);
  });
}
```

#### Rate Limiting

```typescript
if (error.code === "RATE_LIMITED") {
  showError(translations.tooManyAttempts);
  disableFormFor(error.retryAfter);
}
```

## Best Practices

### Form Initialization

```typescript
// Always check for element availability
const elements = initializeAuthFormElements();
if (!elements) {
  console.error("Required form elements not found");
  return;
}

// Initialize with proper error handling
try {
  initializeAuthForm(translations);
} catch (error) {
  console.error("Form initialization failed:", error);
}
```

### Accessibility Considerations

```typescript
// Always provide loading states
setAuthButtonLoadingState("submitButton", true);

// Clear previous errors before new submission
clearAllErrors();

// Announce important state changes
announceToScreenReader("Form submitted successfully");
```

### Performance Optimization

```typescript
// Debounce real-time validation
const debouncedValidation = debounce(validateField, 300);
passwordInput.addEventListener("input", debouncedValidation);

// Lazy load validation utilities
const { validatePassword } = await import("@lib/auth/password-validation");
```

## Integration Examples

### Complete Form Setup

```typescript
import {
  initializeAuthForm,
  switchTab,
  handleLoginSubmit,
  handleRegisterSubmit,
} from "@utils/auth/authFormUtils";
import { useTranslations } from "@utils/i18n";

function setupAuthenticationForm() {
  // Get current language
  const currentLang = document.documentElement.lang || "en";
  const t = useTranslations(currentLang);

  // Setup translations
  const translations = {
    invalidCredentials: t("auth.service.invalid_credentials"),
    tooManyAttempts: t("auth.service.too_many_attempts"),
    networkError: t("auth.service.network_error"),
    validationError: t("auth.service.validation_error"),
  };

  // Initialize form
  initializeAuthForm(translations);

  // Setup additional features
  setupReducedMotion();
  setupPasswordStrengthMeter();
  setupFormAnalytics();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupAuthenticationForm);
} else {
  setupAuthenticationForm();
}
```

### Custom Validation Integration

```typescript
import { handleLoginSubmission } from "@utils/auth/form-handlers";
import { validateEmail, validatePassword } from "@lib/validation";

async function customLoginHandler(event: Event) {
  event.preventDefault();

  const formData = new FormData(event.target as HTMLFormElement);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Custom validation
  const emailValid = validateEmail(email);
  const passwordValid = validatePassword(password);

  if (!emailValid || !passwordValid) {
    showValidationErrors({ email: emailValid, password: passwordValid });
    return;
  }

  // Use standard submission handler
  const result = await handleLoginSubmission({ email, password }, translations);
  handleSubmissionResult(result);
}
```

## Testing Support

### Mock Utilities

```typescript
// Mock successful login
jest.mock("@utils/auth/form-handlers", () => ({
  handleLoginSubmission: jest.fn().mockResolvedValue({
    success: true,
    redirectUrl: "/dashboard",
  }),
}));

// Mock form elements
const mockElements = {
  loginForm: document.createElement("form"),
  submitButton: document.createElement("button"),
  // ... other elements
};
```

### Test Helpers

```typescript
// Helper for testing form submission
async function testFormSubmission(formData: any, expectedResult: any) {
  const result = await handleLoginSubmission(formData, translations);
  expect(result).toEqual(expectedResult);
}

// Helper for testing UI interactions
function testTabSwitching(targetMode: "login" | "register") {
  switchTab(targetMode);
  expect(document.getElementById(`${targetMode}Tab`)).toHaveClass("active");
}
```

## Migration Guide

### From v2.x to v3.x

#### Breaking Changes

- `initAuthForm` renamed to `initializeAuthForm`
- Translation object structure updated
- New required DOM element IDs

#### Migration Steps

1. Update function imports
2. Update translation object structure
3. Verify DOM element IDs match new requirements
4. Test all form interactions

#### Example Migration

```typescript
// v2.x (deprecated)
import { initAuthForm, handleLogin } from "@utils/auth";
initAuthForm({ invalidLogin: "Invalid login" });

// v3.x (current)
import { initializeAuthForm, handleLoginSubmit } from "@utils/auth/authFormUtils";
const translations = {
  invalidCredentials: "Invalid credentials",
  tooManyAttempts: "Too many attempts",
};
initializeAuthForm(translations);
```

## Performance Metrics

### Bundle Size Impact

- `authFormUtils.ts`: ~8KB minified
- `form-handlers.ts`: ~6KB minified
- `ui-interactions.ts`: ~12KB minified
- Total: ~26KB minified

### Runtime Performance

- Form initialization: <50ms
- Tab switching: <16ms (one frame)
- Validation: <10ms per field
- Submission: Network dependent

## Changelog

### v3.1.0 - 2025-05-25

- **Added**: Enhanced error handling with retry logic
- **Improved**: Accessibility support for screen readers
- **Fixed**: Race condition in form submission

### v3.0.0 - 2025-05-20

- **Breaking**: Complete rewrite with TypeScript
- **Added**: Comprehensive form validation
- **Enhanced**: WCAG AAA compliance
- **Improved**: Mobile accessibility
