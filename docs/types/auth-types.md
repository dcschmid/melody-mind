# Authentication Types and Interfaces

## Overview

This document describes the core data types and interfaces used in the MelodyMind authentication
system. All types follow TypeScript best practices and include comprehensive JSDoc documentation.

## Core Interfaces

### AuthFormProps

```typescript
/**
 * Properties for the AuthForm component
 *
 * @interface AuthFormProps
 * @since 3.0.0
 */
interface AuthFormProps {
  /**
   * Initial mode of the authentication form component.
   * Controls which form tab is active when the component first renders.
   *
   * @default "login"
   * @example "login" | "register"
   */
  initialMode?: "login" | "register";
}
```

### AuthFormState

```typescript
/**
 * Internal state management for authentication forms
 *
 * @interface AuthFormState
 * @since 3.0.0
 */
interface AuthFormState {
  /** Current active form mode */
  currentMode: "login" | "register";

  /** Whether form submission is in progress */
  isLoading: boolean;

  /** Form validation errors keyed by field name */
  errors: Record<string, string>;

  /** Overall form validation status */
  isValid: boolean;

  /** Number of failed authentication attempts */
  attemptCount: number;

  /** Whether rate limiting is active */
  isRateLimited: boolean;
}
```

### AuthTranslations

```typescript
/**
 * Translation keys and values for authentication forms
 * Used to provide localized error messages and form feedback
 *
 * @interface AuthTranslations
 * @since 3.0.0
 */
interface AuthTranslations {
  /** Message shown for invalid login credentials */
  invalidCredentials: string;

  /** Message shown when rate limit is exceeded */
  tooManyAttempts: string;

  /** Generic network error message */
  networkError: string;

  /** Form validation error message */
  validationError: string;

  /** Password requirements not met message */
  passwordRequirements: string;

  /** Password confirmation mismatch message */
  passwordMismatch: string;

  /** Email format validation error */
  invalidEmail: string;

  /** Username requirements message */
  usernameRequirements: string;
}
```

### AuthFieldProps

```typescript
/**
 * Properties for individual authentication form fields
 *
 * @interface AuthFieldProps
 * @since 3.0.0
 */
interface AuthFieldProps {
  /** Unique identifier for the form field */
  id: string;

  /** HTML name attribute for form submission */
  name: string;

  /** Input type (email, password, text, etc.) */
  type: "email" | "password" | "text" | "tel";

  /** Accessible label text for the field */
  label: string;

  /** Placeholder text for the input */
  placeholder?: string;

  /** Whether the field is required for form submission */
  required: boolean;

  /** HTML autocomplete attribute value */
  autocomplete?: string;

  /** Whether to show password visibility toggle */
  showPasswordToggle?: boolean;

  /** Additional content to append to the label */
  labelSuffix?: string;

  /** ARIA describedby attribute value */
  describedBy?: string;

  /** Validation pattern for input validation */
  pattern?: string;

  /** Minimum length for input validation */
  minLength?: number;

  /** Maximum length for input validation */
  maxLength?: number;
}
```

### AuthSubmitButtonProps

```typescript
/**
 * Properties for authentication form submit buttons
 *
 * @interface AuthSubmitButtonProps
 * @since 3.0.0
 */
interface AuthSubmitButtonProps {
  /** Unique identifier for the submit button */
  id: string;

  /** Button text content */
  buttonText: string;

  /** ID of the text element for state announcements */
  textId: string;

  /** ID of the loading spinner element */
  spinnerId: string;

  /** Whether the button is currently in loading state */
  isLoading?: boolean;

  /** Whether the button is disabled */
  disabled?: boolean;

  /** ARIA label for accessibility */
  ariaLabel?: string;
}
```

### PasswordRequirements

```typescript
/**
 * Password validation requirements configuration
 *
 * @interface PasswordRequirements
 * @since 3.0.0
 */
interface PasswordRequirements {
  /** Minimum password length */
  minLength: number;

  /** Whether uppercase letters are required */
  requireUppercase: boolean;

  /** Whether lowercase letters are required */
  requireLowercase: boolean;

  /** Whether numbers are required */
  requireNumbers: boolean;

  /** Whether special characters are required */
  requireSpecialChars: boolean;

  /** Whether password and confirmation must match */
  requireConfirmation: boolean;

  /** List of common passwords to reject */
  forbiddenPasswords?: string[];
}
```

### PasswordValidationResult

```typescript
/**
 * Result of password validation checks
 *
 * @interface PasswordValidationResult
 * @since 3.0.0
 */
interface PasswordValidationResult {
  /** Overall validation status */
  isValid: boolean;

  /** Password strength score (0-4) */
  strength: 0 | 1 | 2 | 3 | 4;

  /** Individual requirement validation results */
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
    isNotCommon: boolean;
  };

  /** Whether password and confirmation match */
  confirmationMatch?: boolean;

  /** Validation error messages */
  errors: string[];

  /** Suggestions for improvement */
  suggestions: string[];
}
```

## Authentication API Types

### LoginRequest

```typescript
/**
 * Login request payload
 *
 * @interface LoginRequest
 * @since 3.0.0
 */
interface LoginRequest {
  /** User email address */
  email: string;

  /** User password */
  password: string;

  /** Whether to remember login across sessions */
  rememberMe?: boolean;

  /** CSRF token for request validation */
  csrfToken: string;
}
```

### LoginResponse

```typescript
/**
 * Login response from authentication API
 *
 * @interface LoginResponse
 * @since 3.0.0
 */
interface LoginResponse {
  /** Authentication success status */
  success: boolean;

  /** JWT access token */
  accessToken?: string;

  /** JWT refresh token */
  refreshToken?: string;

  /** User profile information */
  user?: UserProfile;

  /** Error message if authentication failed */
  error?: string;

  /** Remaining retry attempts before rate limiting */
  remainingAttempts?: number;

  /** Rate limit reset time in milliseconds */
  rateLimitReset?: number;
}
```

### RegisterRequest

```typescript
/**
 * Registration request payload
 *
 * @interface RegisterRequest
 * @since 3.0.0
 */
interface RegisterRequest {
  /** User email address */
  email: string;

  /** User chosen username (optional) */
  username?: string;

  /** User password */
  password: string;

  /** Password confirmation */
  passwordConfirm: string;

  /** Acceptance of terms and conditions */
  acceptTerms: boolean;

  /** Acceptance of privacy policy */
  acceptPrivacy: boolean;

  /** Newsletter subscription opt-in */
  subscribeNewsletter?: boolean;

  /** CSRF token for request validation */
  csrfToken: string;

  /** Captcha response token */
  captchaToken?: string;
}
```

### RegisterResponse

```typescript
/**
 * Registration response from authentication API
 *
 * @interface RegisterResponse
 * @since 3.0.0
 */
interface RegisterResponse {
  /** Registration success status */
  success: boolean;

  /** Created user ID */
  userId?: string;

  /** Whether email verification is required */
  requiresVerification: boolean;

  /** Verification email sent status */
  verificationEmailSent?: boolean;

  /** Registration error message */
  error?: string;

  /** Field-specific validation errors */
  fieldErrors?: Record<string, string[]>;
}
```

### UserProfile

```typescript
/**
 * User profile information
 *
 * @interface UserProfile
 * @since 3.0.0
 */
interface UserProfile {
  /** Unique user identifier */
  id: string;

  /** User email address */
  email: string;

  /** User display name */
  username?: string;

  /** User's preferred language */
  preferredLanguage: string;

  /** Email verification status */
  emailVerified: boolean;

  /** Account creation timestamp */
  createdAt: Date;

  /** Last login timestamp */
  lastLoginAt?: Date;

  /** User preferences */
  preferences: {
    /** Theme preference (light/dark/auto) */
    theme: "light" | "dark" | "auto";

    /** Reduced motion preference */
    reducedMotion: boolean;

    /** High contrast preference */
    highContrast: boolean;

    /** Newsletter subscription status */
    newsletter: boolean;
  };
}
```

## Form Validation Types

### ValidationRule

```typescript
/**
 * Individual validation rule for form fields
 *
 * @interface ValidationRule
 * @since 3.0.0
 */
interface ValidationRule {
  /** Rule identifier */
  name: string;

  /** Validation function */
  validate: (value: string) => boolean;

  /** Error message when validation fails */
  message: string;

  /** Whether this rule is required for submission */
  required: boolean;
}
```

### FieldValidationResult

```typescript
/**
 * Result of field validation
 *
 * @interface FieldValidationResult
 * @since 3.0.0
 */
interface FieldValidationResult {
  /** Field validation status */
  isValid: boolean;

  /** Validation error messages */
  errors: string[];

  /** Validation warnings (non-blocking) */
  warnings: string[];

  /** Field touched status */
  touched: boolean;

  /** Field dirty status (value changed) */
  dirty: boolean;
}
```

## Event Types

### AuthFormEvent

```typescript
/**
 * Custom events dispatched by authentication forms
 *
 * @interface AuthFormEvent
 * @since 3.0.0
 */
interface AuthFormEvent extends CustomEvent {
  detail: {
    /** Event type */
    type: "login" | "register" | "switch-tab" | "validation-error";

    /** Event payload data */
    data?: any;

    /** Target form element */
    target?: HTMLFormElement;

    /** Timestamp of event */
    timestamp: number;
  };
}
```

### FormSubmissionEvent

```typescript
/**
 * Form submission event data
 *
 * @interface FormSubmissionEvent
 * @since 3.0.0
 */
interface FormSubmissionEvent {
  /** Form data being submitted */
  formData: FormData;

  /** Submission type */
  type: "login" | "register";

  /** Validation results */
  validation: Record<string, FieldValidationResult>;

  /** Whether submission should proceed */
  shouldSubmit: boolean;
}
```

## Error Types

### AuthError

```typescript
/**
 * Authentication-specific error types
 *
 * @interface AuthError
 * @extends Error
 * @since 3.0.0
 */
interface AuthError extends Error {
  /** Error code for programmatic handling */
  code:
    | "INVALID_CREDENTIALS"
    | "USER_NOT_FOUND"
    | "USER_ALREADY_EXISTS"
    | "EMAIL_NOT_VERIFIED"
    | "PASSWORD_TOO_WEAK"
    | "RATE_LIMITED"
    | "NETWORK_ERROR"
    | "VALIDATION_ERROR"
    | "CSRF_ERROR"
    | "CAPTCHA_ERROR";

  /** HTTP status code if applicable */
  statusCode?: number;

  /** Additional error context */
  context?: Record<string, any>;

  /** Whether error should be displayed to user */
  userFacing: boolean;

  /** Retry-related information */
  retryInfo?: {
    canRetry: boolean;
    retryAfter?: number;
    maxRetries?: number;
    currentAttempt?: number;
  };
}
```

### ValidationError

```typescript
/**
 * Form validation error
 *
 * @interface ValidationError
 * @extends Error
 * @since 3.0.0
 */
interface ValidationError extends Error {
  /** Field that failed validation */
  field: string;

  /** Validation rule that failed */
  rule: string;

  /** User-friendly error message */
  userMessage: string;

  /** Technical validation details */
  details?: Record<string, any>;
}
```

## Configuration Types

### AuthFormConfig

```typescript
/**
 * Configuration options for authentication forms
 *
 * @interface AuthFormConfig
 * @since 3.0.0
 */
interface AuthFormConfig {
  /** API endpoints configuration */
  api: {
    loginUrl: string;
    registerUrl: string;
    verifyUrl: string;
    resetPasswordUrl: string;
  };

  /** Validation configuration */
  validation: {
    email: ValidationRule[];
    password: PasswordRequirements;
    username?: ValidationRule[];
  };

  /** Rate limiting configuration */
  rateLimiting: {
    maxAttempts: number;
    windowMs: number;
    lockoutMs: number;
  };

  /** Accessibility configuration */
  accessibility: {
    announceChanges: boolean;
    focusManagement: boolean;
    reducedMotion: boolean;
  };

  /** Internationalization configuration */
  i18n: {
    defaultLanguage: string;
    supportedLanguages: string[];
    fallbackLanguage: string;
  };
}
```

## Usage Examples

### Basic Form Implementation

```typescript
// Example of implementing a form with these types
import type { AuthFormProps, AuthTranslations, LoginRequest, RegisterRequest } from "@types/auth";

const authTranslations: AuthTranslations = {
  invalidCredentials: "Invalid email or password",
  tooManyAttempts: "Too many failed attempts. Please try again later.",
  networkError: "Network error. Please check your connection.",
  validationError: "Please correct the errors below",
  passwordRequirements: "Password must meet security requirements",
  passwordMismatch: "Passwords do not match",
  invalidEmail: "Please enter a valid email address",
  usernameRequirements: "Username must be 3-20 characters",
};

const handleLogin = async (formData: LoginRequest): Promise<void> => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result: LoginResponse = await response.json();
    // Handle response...
  } catch (error) {
    // Handle error...
  }
};
```

### Password Validation Example

```typescript
import type { PasswordRequirements, PasswordValidationResult } from "@types/auth";

const passwordRequirements: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  requireConfirmation: true,
};

const validatePassword = (password: string): PasswordValidationResult => {
  // Implementation would check each requirement
  return {
    isValid: true,
    strength: 4,
    requirements: {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*]/.test(password),
      isNotCommon: true,
    },
    errors: [],
    suggestions: [],
  };
};
```

## Type Guards

### Authentication Type Guards

```typescript
/**
 * Type guard to check if an error is an AuthError
 */
const isAuthError = (error: unknown): error is AuthError => {
  return error instanceof Error && "code" in error && "userFacing" in error;
};

/**
 * Type guard to check if a response is a successful login
 */
const isSuccessfulLogin = (
  response: LoginResponse
): response is Required<Pick<LoginResponse, "accessToken" | "user">> => {
  return response.success && !!response.accessToken && !!response.user;
};

/**
 * Type guard to check if validation result indicates success
 */
const isValidPassword = (result: PasswordValidationResult): boolean => {
  return result.isValid && result.strength >= 3;
};
```

## Changelog

### v3.1.0 - 2025-05-25

- **Added**: `AuthFormConfig` interface for centralized configuration
- **Enhanced**: Error types with retry information and context
- **Added**: Type guards for better type safety

### v3.0.0 - 2025-05-20

- **Breaking**: Complete rewrite with comprehensive TypeScript support
- **Added**: All core authentication interfaces
- **Added**: Comprehensive JSDoc documentation
- **Added**: Password validation types and configuration

## Contributing

When adding new types to the authentication system:

1. **Follow Naming Conventions**: Use descriptive names with proper TypeScript conventions
2. **Add JSDoc Documentation**: Include comprehensive documentation for all properties
3. **Maintain Backwards Compatibility**: Use optional properties and deprecation notices
4. **Include Examples**: Provide usage examples for complex types
5. **Update Documentation**: Keep this file current with all changes
