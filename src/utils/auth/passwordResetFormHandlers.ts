/**
 * Form Handlers for Password Reset Component
 *
 * This module contains form submission handlers and initialization logic
 * for the PasswordResetForm component.
 *
 * Features:
 * - Request form handling (email submission)
 * - Confirmation form handling (password reset)
 * - Session timeout management
 * - Performance optimizations
 * - WCAG AAA accessibility support
 *
 * @module PasswordResetFormHandlers
 */

import {
  resetErrorDisplays,
  showError,
  showSuccess,
  setLoadingState,
  updatePasswordRequirements,
  updatePasswordStrengthMeter,
  initializePasswordToggles,
  initializeRequirementsToggle,
  initializeContextualHelp,
  type FormElements,
  type Translations,
} from "./passwordResetDOMUtils.js";
import {
  validatePassword,
  validateEmail,
  provideEmailSuggestion,
  calculatePasswordStrength,
} from "./passwordResetUtils.js";

/**
 * Interface for form configuration
 */
export interface FormConfig {
  isConfirmReset: boolean;
  translations: Translations;
}

/**
 * Initialize password reset request form with optimized event handling
 * @param translations - Translation object
 */
export function initializeRequestForm(translations: Translations): void {
  const form = document.getElementById("passwordResetForm") as HTMLFormElement;
  if (!form) {
    return;
  }

  const elements: FormElements = {
    email: document.getElementById("email"),
    emailError: document.getElementById("emailError"),
    formError: document.getElementById("formError"),
    formSuccess: document.getElementById("formSuccess"),
    submitText: document.getElementById("submitText"),
    loadingSpinner: document.getElementById("loadingSpinner"),
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset error displays
    resetErrorDisplays([elements.emailError, elements.formError, elements.formSuccess]);

    // Email validation
    const emailInput = elements.email as HTMLInputElement;
    if (!emailInput?.value) {
      showError(
        elements.emailError,
        translations["auth.form.email_required"] || "Email is required"
      );
      isValid = false;
    } else if (!validateEmail(emailInput.value)) {
      // Enhanced error message with suggestion
      const suggestion = provideEmailSuggestion(emailInput.value);
      const errorMessage = suggestion
        ? `${translations["auth.form.email_invalid_format"] || "Invalid email format"} ${suggestion}`
        : translations["auth.form.email_invalid_format"] || "Invalid email format";
      showError(elements.emailError, errorMessage);
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Show loading state
    setLoadingState(
      elements.submitText,
      elements.loadingSpinner,
      translations["auth.form.loading_text"] || "Loading...",
      true
    );

    try {
      const currentLang = document.documentElement.lang || "de";

      // Add performance optimizations to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      await fetch(`/${currentLang}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: emailInput.value }),
        signal: controller.signal,
        priority: "high" as any, // Modern browsers priority hint
      });

      clearTimeout(timeoutId);

      // Always show success for security
      showSuccess(
        elements.formSuccess,
        translations["auth.password_reset.success_message"] || "Reset link sent successfully"
      );
      form.reset();
    } catch (error) {
      // Handle timeout specifically
      if (error instanceof Error && error.name === "AbortError") {
        showError(
          elements.formError,
          translations["auth.password_reset.timeout_error"] ||
            translations["auth.password_reset.error_message"] ||
            "Request timeout. Please try again."
        );
      } else {
        showError(
          elements.formError,
          translations["auth.password_reset.error_message"] ||
            "An error occurred. Please try again."
        );
      }
    } finally {
      setLoadingState(
        elements.submitText,
        elements.loadingSpinner,
        translations["auth.form.send_reset_link"] || "Send Reset Link",
        false
      );
    }
  });
}

/**
 * Initialize password reset confirmation form with optimized validation
 * @param translations - Translation object
 */
export function initializeConfirmationForm(translations: Translations): void {
  const form = document.getElementById("passwordResetConfirmForm") as HTMLFormElement;
  if (!form) {
    return;
  }

  const elements: FormElements = {
    password: document.getElementById("password"),
    passwordConfirm: document.getElementById("passwordConfirm"),
    token: document.getElementById("token"),
    passwordError: document.getElementById("passwordError"),
    passwordConfirmError: document.getElementById("passwordConfirmError"),
    formError: document.getElementById("formError"),
    formSuccess: document.getElementById("formSuccess"),
    submitText: document.getElementById("submitText"),
    loadingSpinner: document.getElementById("loadingSpinner"),
  };

  // Initialize UI components
  initializePasswordToggles(translations);
  initializeRequirementsToggle(translations);
  initializeContextualHelp(translations);

  // Real-time validation with performance optimization using passive listeners
  let validationTimeout: NodeJS.Timeout;

  // Optimized debouncing with adaptive delay based on input frequency
  let inputCount = 0;
  const debouncedValidation = () => {
    clearTimeout(validationTimeout);
    inputCount++;

    // Adaptive debounce: shorter delay for first few inputs, longer for rapid typing
    const delay = inputCount < 3 ? 100 : 200;

    validationTimeout = setTimeout(() => {
      updatePasswordRequirementsAndStrength();
      inputCount = 0; // Reset counter after validation
    }, delay);
  };

  // Function to update password requirements and strength
  const updatePasswordRequirementsAndStrength = () => {
    const passwordInput = elements.password as HTMLInputElement;
    const passwordConfirmInput = elements.passwordConfirm as HTMLInputElement;

    if (passwordInput?.value) {
      updatePasswordRequirements(passwordInput.value, translations);

      const strength = calculatePasswordStrength(passwordInput.value);
      updatePasswordStrengthMeter(strength.score, strength.level, translations);

      // Update match requirement
      const matchElement = document.getElementById("req-match");
      const matchDescElement = document.getElementById("req-match-desc");
      const matchIconElement = matchElement?.querySelector(
        ".password-reset-form__requirement-icon"
      );

      if (matchElement && matchDescElement && matchIconElement && passwordConfirmInput?.value) {
        const passwordsMatch = passwordInput.value === passwordConfirmInput.value;

        if (passwordsMatch) {
          matchElement.classList.remove("password-reset-form__requirement--invalid");
          matchElement.classList.add("password-reset-form__requirement--valid");
          matchIconElement.textContent = "✓";
          matchDescElement.textContent =
            translations["auth.accessibility.requirement.met"] || "Requirement met";
        } else {
          matchElement.classList.remove("password-reset-form__requirement--valid");
          matchElement.classList.add("password-reset-form__requirement--invalid");
          matchIconElement.textContent = "✗";
          matchDescElement.textContent =
            translations["auth.accessibility.requirement.unmet"] || "Requirement not met";
        }
      }
    }
  };

  // Use passive event listeners for better scroll performance on mobile
  const eventOptions = { passive: true };
  elements.password?.addEventListener("input", debouncedValidation, eventOptions);
  elements.passwordConfirm?.addEventListener("input", debouncedValidation, eventOptions);

  // Form submission with comprehensive validation
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset error displays
    resetErrorDisplays([
      elements.passwordError,
      elements.passwordConfirmError,
      elements.formError,
      elements.formSuccess,
    ]);

    const passwordInput = elements.password as HTMLInputElement;
    const passwordConfirmInput = elements.passwordConfirm as HTMLInputElement;
    const tokenInput = elements.token as HTMLInputElement;

    // Password validation
    if (!passwordInput?.value) {
      showError(
        elements.passwordError,
        translations["auth.form.password_required"] || "Password is required"
      );
      isValid = false;
    } else {
      const validation = validatePassword(passwordInput.value);
      if (!validation.valid) {
        showError(
          elements.passwordError,
          translations["auth.form.password_requirements"] || "Password does not meet requirements"
        );
        isValid = false;
      }
    }

    // Password confirmation validation
    if (!passwordConfirmInput?.value) {
      showError(
        elements.passwordConfirmError,
        translations["auth.form.password_confirm_required"] || "Password confirmation is required"
      );
      isValid = false;
    } else if (passwordInput?.value !== passwordConfirmInput.value) {
      showError(
        elements.passwordConfirmError,
        translations["auth.form.passwords_not_match"] || "Passwords do not match"
      );
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Show loading state
    setLoadingState(
      elements.submitText,
      elements.loadingSpinner,
      translations["auth.form.loading_text"] || "Loading...",
      true
    );

    try {
      const currentLang = document.documentElement.lang || "de";

      // Add performance optimizations to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for password change

      const response = await fetch(`/${currentLang}/api/auth/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token: tokenInput?.value,
          newPassword: passwordInput.value,
        }),
        signal: controller.signal,
        priority: "high" as any, // Modern browsers priority hint
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok) {
        showSuccess(
          elements.formSuccess,
          data.message ||
            translations["auth.password_reset.complete_success"] ||
            "Password reset successful"
        );

        // Redirect after successful password reset
        setTimeout(() => {
          window.location.href = `/${currentLang}/auth/login?message=password_reset_success`;
        }, 2000);
      } else {
        showError(
          elements.formError,
          data.error ||
            translations["auth.password_reset.complete_error"] ||
            "Failed to reset password"
        );
      }
    } catch (error) {
      // Handle timeout specifically
      if (error instanceof Error && error.name === "AbortError") {
        showError(
          elements.formError,
          translations["auth.password_reset.timeout_error"] ||
            translations["auth.password_reset.complete_error"] ||
            "Request timeout. Please try again."
        );
      } else {
        showError(
          elements.formError,
          translations["auth.password_reset.complete_error"] ||
            "An error occurred. Please try again."
        );
      }
    } finally {
      setLoadingState(
        elements.submitText,
        elements.loadingSpinner,
        translations["auth.password_reset.confirm_submit"] || "Reset Password",
        false
      );
    }
  });
}

/**
 * Initialize session timeout warning using the standardized utility
 * Implements WCAG 2.2 SC 2.2.6 Timeouts (AAA) compliance
 * @param translations - Translation object
 */
export async function initializeSessionTimeoutWarning(translations: Translations): Promise<any> {
  try {
    // Dynamic import for code splitting
    const { createSessionTimeoutManager } = await import("../../utils/auth/sessionTimeout.js");

    const sessionManager = createSessionTimeoutManager({
      sessionTimeout: 20 * 60 * 1000, // 20 minutes
      warningTime: 2 * 60 * 1000, // 2 minutes warning
      redirectUrl: `/${document.documentElement.lang || "de"}/auth/login?reason=session_expired`,
      translations: {
        title: translations["auth.session.timeout.title"] || "Session Timeout Warning",
        message: translations["auth.session.timeout.message"] || "Your session will expire soon.",
        extend: translations["auth.session.timeout.extend"] || "Extend Session",
        close: translations["auth.session.timeout.close"] || "Close",
      },
    });

    // Initialize the session timeout system
    sessionManager.initialize();

    // Cleanup for page navigation
    function cleanupSessionManager() {
      sessionManager.destroy();
    }

    // Add cleanup for page navigation and beforeunload
    window.addEventListener("beforeunload", cleanupSessionManager);

    // For Astro page navigation (if using View Transitions)
    document.addEventListener("astro:before-preparation", cleanupSessionManager);
    document.addEventListener("astro:page-load", cleanupSessionManager);

    return sessionManager;
  } catch (error) {
    console.error("Failed to load session timeout manager:", error);
    return null;
  }
}

/**
 * Initialize the appropriate form based on mode
 * @param config - Form configuration
 */
export function initializeForms(config: FormConfig): void {
  const { isConfirmReset, translations } = config;

  // Initialize appropriate form based on mode
  if (!isConfirmReset) {
    initializeRequestForm(translations);
  } else {
    initializeConfirmationForm(translations);
  }

  // Initialize session timeout warning
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initializeSessionTimeoutWarning(translations);
    });
  } else {
    initializeSessionTimeoutWarning(translations);
  }
}
