# Password Validation Module

## Overview

The Password Validation module provides a comprehensive set of utilities for password management
within the MelodyMind authentication system. This module includes functionality for validating
password strength, generating secure passwords, and enforcing password policies.

![Password System Architecture](../assets/password-system-architecture.png)

## Key Features

- **Type-safe password handling** with branded types
- **Comprehensive validation criteria** against common security vulnerabilities
- **Strength assessment** with detailed scoring breakdown
- **Secure password generation** with customizable parameters
- **Internationalization** support for error messages
- **Memory-efficient caching** for performance optimization

## Type Definitions

### Core Types

```typescript
// Strong Password type using branded types for better type safety
export type Password = string & { readonly __brand: "Password" };

// Password strength as a branded number type
export type PasswordStrength = number & { readonly __brand: "PasswordStrength" };

// Password strength levels
export enum PasswordStrengthLevel {
  VeryWeak = "very-weak",
  Weak = "weak",
  Moderate = "moderate",
  Strong = "strong",
  VeryStrong = "very-strong",
}
```

### Configuration Interfaces

```typescript
// Password configuration parameters
export interface PasswordConfig {
  /** Minimum required password length */
  minLength: number;
  /** Whether uppercase letters are required */
  requireUppercase: boolean;
  /** Whether lowercase letters are required */
  requireLowercase: boolean;
  /** Whether numbers are required */
  requireNumber: boolean;
  /** Whether special characters are required */
  requireSpecialChar: boolean;
}

// Options for password generation
export interface PasswordGenerationOptions {
  /** The desired password length */
  length?: number;
  /** Include uppercase characters */
  includeUppercase?: boolean;
  /** Include lowercase characters */
  includeLowercase?: boolean;
  /** Include numeric characters */
  includeNumbers?: boolean;
  /** Include special characters */
  includeSpecial?: boolean;
}
```

### Result Types

```typescript
// Type definition for password validation results
export interface ValidationResult {
  /** Whether the password meets all requirements */
  valid: boolean;
  /** Array of error message keys for any failed validation criteria */
  errors: PasswordErrorKey[];
}

// Result of password strength calculation
export interface PasswordStrengthResult {
  /** Numerical strength score from 0-100 */
  score: PasswordStrength;
  /** Descriptive strength level */
  level: PasswordStrengthLevel;
  /** Detailed breakdown of strength calculation */
  details: {
    /** Points from password length */
    lengthScore: number;
    /** Points from character diversity */
    complexityScore: number;
    /** Deductions for common patterns */
    penalties: number;
  };
}
```

### Error Handling

```typescript
// Error message keys for password validation
export type PasswordErrorKey =
  | `auth.password.min_length_error`
  | `auth.password.uppercase_error`
  | `auth.password.lowercase_error`
  | `auth.password.number_error`
  | `auth.password.special_char_error`
  | `auth.password.common_password`
  | `auth.password.repeats_error`
  | `auth.password.sequence_error`
  | `auth.password.match_error`;

// Custom error class for password validation failures
export class PasswordValidationError extends Error {
  // The errors that occurred during validation
  public readonly errors: readonly PasswordErrorKey[];
}
```

## API Reference

### validatePassword

Validates a password against multiple security criteria. Returns a validation result with status and
any error messages.

**Since:** 3.0.0

**Parameters:**

- `password: string` - The password to validate
- `config?: Partial<PasswordConfig>` - Optional custom password configuration

**Returns:** `ValidationResult` - Validation result with validity status and any error messages

**Example:**

```typescript
import { validatePassword } from "../lib/auth/password-validation";

// Validate with default configuration
const result = validatePassword("Weak123!");
if (!result.valid) {
  console.log(result.errors); // Display validation errors
}

// Validate with custom configuration
const customResult = validatePassword("simple", {
  minLength: 6,
  requireUppercase: false,
});
```

**Default Configuration:**

```typescript
const DEFAULT_PASSWORD_CONFIG = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};
```

**i18n Integration:**

The validation errors are returned as translation keys that can be passed to the application's
translation system:

```typescript
import { validatePassword } from "../lib/auth/password-validation";
import { translate } from "../i18n/translate";

const result = validatePassword(userInput);
if (!result.valid) {
  const translatedErrors = result.errors.map((key) => {
    if (key === "auth.password.min_length_error") {
      return translate(key, { minLength: 8 });
    }
    return translate(key);
  });

  displayErrors(translatedErrors);
}
```

### validatePasswordMatch

Validates that two passwords match, useful for confirmation scenarios like registration or password
resets.

**Since:** 3.0.0

**Parameters:**

- `password: string` - The original password
- `confirmPassword: string` - The confirmation password

**Returns:** `ValidationResult` - Validation result with validity status

**Example:**

```typescript
import { validatePasswordMatch } from "../lib/auth/password-validation";

// Check if passwords match
const matchResult = validatePasswordMatch("securePass123!", "securePass123!");
if (!matchResult.valid) {
  console.log("Passwords don't match");
}
```

### generateSecurePassword

Generates a cryptographically secure random password with customizable options.

**Since:** 3.0.0

**Parameters:**

- `options?: PasswordGenerationOptions` - Password generation options

**Returns:** `Password` - A secure password meeting all security requirements

**Example:**

```typescript
import { generateSecurePassword } from "../lib/auth/password-validation";

// Generate default secure password (16 characters)
const safePassword = generateSecurePassword();

// Generate custom password (20 characters, no special chars)
const customPassword = generateSecurePassword({
  length: 20,
  includeSpecial: false,
});
```

### calculatePasswordStrength

Calculates the strength of a password and provides a detailed breakdown of the score. This function
is memoized for performance when repeatedly checking the same password.

**Since:** 3.0.0

**Parameters:**

- `password: string` - The password to evaluate

**Returns:** `PasswordStrengthResult` - Detailed password strength assessment

**Example:**

```typescript
import { calculatePasswordStrength, PasswordStrengthLevel } from "../lib/auth/password-validation";

const result = calculatePasswordStrength("Example123!");
console.log(`Password strength: ${result.score}/100 (${result.level})`);
console.log(`Length contribution: ${result.details.lengthScore}`);

// Show different UI based on strength level
switch (result.level) {
  case PasswordStrengthLevel.VeryWeak:
  case PasswordStrengthLevel.Weak:
    showWarningMessage("Please choose a stronger password");
    break;
  case PasswordStrengthLevel.Moderate:
    showNeutralMessage("Password strength is acceptable");
    break;
  case PasswordStrengthLevel.Strong:
  case PasswordStrengthLevel.VeryStrong:
    showSuccessMessage("Good password choice!");
    break;
}
```

**Scoring Algorithm:**

The password strength calculation considers:

- Password length (up to 40 points)
- Character complexity (uppercase, lowercase, numbers, special chars - up to 40 points)
- Deductions for common passwords, repetitions, and sequences (varying penalties)

### isStrongPassword

Type guard to check if a string is a strong password. This provides TypeScript type narrowing.

**Since:** 3.0.0

**Parameters:**

- `value: string` - The value to check

**Returns:** `boolean` - Whether the value is a strong password

**Example:**

```typescript
import { isStrongPassword } from "../lib/auth/password-validation";

function saveUserPassword(password: string | unknown) {
  if (isStrongPassword(password)) {
    // TypeScript knows password is a Password type here
    saveToDatabase(password); // Type-safe operation
  } else {
    throw new Error("Password doesn't meet strength requirements");
  }
}
```

### createPassword

Creates a type-safe Password from a string, throwing an error if the password does not meet
requirements.

**Since:** 3.0.0

**Parameters:**

- `value: string` - The password string to validate

**Returns:** `Password` - The validated Password

**Throws:** `PasswordValidationError` - If the password fails validation

**Example:**

```typescript
import { createPassword, isPasswordValidationError } from "../lib/auth/password-validation";

try {
  const safePassword = createPassword(userInput);
  saveToDatabase(safePassword);
} catch (error) {
  if (isPasswordValidationError(error)) {
    console.error("Password validation errors:", error.errors);
  } else {
    console.error("Unexpected error:", error.message);
  }
}
```

### isPasswordStrongEnough

Checks if a password is strong enough for the given security level.

**Since:** 3.0.0

**Parameters:**

- `password: string` - The password to check
- `minimumLevel?: PasswordStrengthLevel` - The minimum required strength level (default: Strong)

**Returns:** `boolean` - Whether the password meets the minimum strength requirement

**Example:**

```typescript
import { isPasswordStrongEnough, PasswordStrengthLevel } from "../lib/auth/password-validation";

// Check if password is very strong (suitable for admin accounts)
if (isPasswordStrongEnough(adminPassword, PasswordStrengthLevel.VeryStrong)) {
  enableAdminAccess();
} else {
  showStrongPasswordRequirementMessage();
}

// Default level is "Strong"
if (isPasswordStrongEnough(userPassword)) {
  createUserAccount();
}
```

## Internal Utilities

The module contains several internal utility functions that are not exported but are used by the
public API:

- `memoize<Args, Result>()` - Generic memoization helper with cache size limits
- `validatePasswordCriteria()` - Validates a specific aspect of a password
- `calculateComplexityScore()` - Scores password complexity based on character types
- `calculatePenalties()` - Calculates penalty scores for weak password patterns
- `getStrengthLevel()` - Maps numerical scores to strength levels

## Security Considerations

### Common Password Protection

The module maintains a list of commonly used passwords against which all passwords are checked. This
helps prevent users from choosing easily guessable passwords.

```typescript
// Using Set for O(1) lookup performance instead of array
const COMMON_PASSWORDS: ReadonlySet<string> = new Set([
  "password",
  "123456",
  "qwerty" /* and more */,
]);
```

### Pattern Recognition

The module checks for potentially vulnerable patterns:

- Character repetition (3+ identical characters in sequence)
- Sequential patterns like "123456" or "qwerty"

### Secure Random Generation

The password generator ensures:

- At least one character from each selected character set
- Cryptographically secure randomness
- Proper shuffling to prevent predictable patterns

## Performance Optimization

### Memoization

The password strength calculation function is memoized to improve performance when the same password
is evaluated multiple times:

```typescript
export const calculatePasswordStrength = memoize(calculatePasswordStrengthInternal, {
  maxCacheSize: 100,
  shouldCache: (key: string): boolean => {
    const password = JSON.parse(key)[0];
    return typeof password === "string" && password.length > 3;
  },
});
```

Key performance features:

- Limited cache size (100 entries) to prevent memory leaks
- FIFO cache eviction policy
- Selective caching that ignores very short passwords

## Accessibility Considerations

While this module doesn't directly interact with the UI, it provides several features that support
building accessible password interfaces:

- Clear, descriptive error keys for translation into any language
- Specific error types that can be mapped to appropriate ARIA announcements
- Support for different strength levels that can be communicated through visual and non-visual means

## Internationalization

The module is designed with internationalization in mind:

- All error messages are returned as translation keys, not hardcoded strings
- Parameters needed for translation are exported as types
- The module avoids language-specific validation rules

Translation example:

```typescript
import { validatePassword } from "../lib/auth/password-validation";
import { translate } from "../i18n/translate";

const errors = validatePassword("weak").errors;
const translated = errors.map((key) => translate(key));
```

## Related Modules

- **AuthService** - Primary authentication service that uses this module
- **UserManager** - For creating and updating user accounts
- **PasswordResetFlow** - For secure password reset functionality

## Breaking Changes

### Version 3.0.0

- Introduced branded types for `Password` and `PasswordStrength`
- Added `PasswordValidationError` class (previously used generic `Error`)
- `createPassword` now throws a specific `PasswordValidationError` instead of a generic `Error`
- Added new error type `auth.password.match_error` for password confirmation

### Version 2.5.0

- Added memoization for performance optimization
- Increased default minimum password length from 6 to 8 characters

## Implementation Notes

### Type Safety

The module uses TypeScript's branded types to create strong type safety:

```typescript
export type Password = string & { readonly __brand: "Password" };
```

This prevents accidental use of unvalidated strings where secure password values are expected.

### Memory Management

- The internal Set and Array data structures are marked as `readonly` to prevent modification
- The memoization cache has a size limit and FIFO eviction policy
- Object properties are frozen with `Object.freeze()` to prevent mutation

## Examples

### Complete Registration Flow

```typescript
import {
  validatePassword,
  validatePasswordMatch,
  createPassword,
  isPasswordValidationError,
  calculatePasswordStrength,
  PasswordStrengthLevel,
} from "../lib/auth/password-validation";

async function handleRegistration(username: string, password: string, confirmPassword: string) {
  // Step 1: Check if passwords match
  const matchResult = validatePasswordMatch(password, confirmPassword);
  if (!matchResult.valid) {
    return { success: false, errors: ["Passwords don't match"] };
  }

  // Step 2: Check password strength requirements
  const strengthResult = calculatePasswordStrength(password);
  if (strengthResult.level < PasswordStrengthLevel.Moderate) {
    return {
      success: false,
      errors: ["Password is too weak"],
      strengthDetails: strengthResult.details,
    };
  }

  // Step 3: Validate password against security requirements
  try {
    // This throws if validation fails
    const validatedPassword = createPassword(password);

    // Step 4: Create the user account
    await userService.createUser(username, validatedPassword);

    return { success: true };
  } catch (error) {
    if (isPasswordValidationError(error)) {
      return {
        success: false,
        errors: error.errors.map((key) => translate(key)),
      };
    }

    throw error; // Re-throw unexpected errors
  }
}
```

### Password Strength Meter

```typescript
import { calculatePasswordStrength, PasswordStrengthLevel } from "../lib/auth/password-validation";

function renderPasswordStrengthMeter(password: string) {
  const { score, level, details } = calculatePasswordStrength(password);

  // Map strength level to color
  const colorMap = {
    [PasswordStrengthLevel.VeryWeak]: "#ff0000", // Red
    [PasswordStrengthLevel.Weak]: "#ff8000", // Orange
    [PasswordStrengthLevel.Moderate]: "#ffff00", // Yellow
    [PasswordStrengthLevel.Strong]: "#80ff00", // Light Green
    [PasswordStrengthLevel.VeryStrong]: "#00ff00", // Green
  };

  // Color meets WCAG AAA contrast requirements when used with black text
  const color = colorMap[level];

  // Render meter
  return `
    <div class="password-strength-meter">
      <div class="meter-bar" style="width: ${score}%; background-color: ${color};"
           role="progressbar" 
           aria-valuenow="${score}" 
           aria-valuemin="0" 
           aria-valuemax="100">
      </div>
      <div class="strength-label" aria-live="polite">
        Strength: ${level.replace("-", " ")} (${score}/100)
      </div>
      <div class="strength-details">
        <ul>
          <li>Length: ${details.lengthScore}/40</li>
          <li>Character diversity: ${details.complexityScore}/40</li>
          <li>Penalties: -${details.penalties}</li>
        </ul>
      </div>
    </div>
  `;
}
```

## Future Enhancements

Planned enhancements for future versions:

- **Zxcvbn Integration** - Advanced password strength estimation library
- **Password History Check** - Prevent reuse of previous passwords
- **Enhanced Entropy Analysis** - More sophisticated password strength measurement
- **Password Expiration Support** - Utilities for managing password lifetimes

---

_Documentation last updated: May 17, 2025_
