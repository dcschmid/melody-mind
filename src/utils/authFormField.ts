/**
 * Auth Form Field Functionality - Performance Optimized
 *
 * Handles form field interactions and validation state management.
 * Uses CSS variables from global.css for consistent styling and WCAG AAA compliance.
 *
 * Performance optimizations:
 * - Cached CSS variables to avoid repeated getComputedStyle calls
 * - Debounced validation to reduce unnecessary processing
 * - Reused validation utilities from centralized password-validation module
 * - Efficient DOM manipulation with minimal reflow/repaint
 */

// Import centralized validation utilities (MANDATORY: Code Deduplication)
import { validateEmail } from "./password-validation";

// Extend the Window interface to include our custom properties
declare global {
  interface Window {
    authTranslations?: Record<string, string>;
    cleanupAuthFormFields?: () => void;
    showFieldError?: (fieldId: string, message: string) => void;
    hideFieldError?: (fieldId: string) => void;
    validateEmailFormat?: (email: string) => boolean;
  }
}

// Performance: Cache CSS timing values to avoid repeated calculations
const TIMING_CACHE = new Map<string, number>();
let isTimingCached = false;

function cacheTransitionDelays(): void {
  if (isTimingCached) {
    return;
  }

  const root = document.documentElement;
  const style = getComputedStyle(root);

  TIMING_CACHE.set(
    "fast",
    parseInt(style.getPropertyValue("--transition-fast").replace("ms", ""), 10) || 100
  );
  TIMING_CACHE.set(
    "normal",
    parseInt(style.getPropertyValue("--transition-normal").replace("ms", ""), 10) || 200
  );
  TIMING_CACHE.set(
    "slow",
    parseInt(style.getPropertyValue("--transition-slow").replace("ms", ""), 10) || 500
  );

  isTimingCached = true;
}

function getCachedDelay(type = "fast"): number {
  cacheTransitionDelays();
  return TIMING_CACHE.get(type) || 100;
}

// Performance: Debounce validation calls
const validationTimeouts = new Map<string, number>();

function debounceValidation(fieldId: string, validationFn: () => void, delay = 300): void {
  if (validationTimeouts.has(fieldId)) {
    clearTimeout(validationTimeouts.get(fieldId)!);
  }

  const timeoutId = window.setTimeout(validationFn, delay);
  validationTimeouts.set(fieldId, timeoutId);
}

/**
 * Enhanced Accessibility Announcer - Performance Optimized
 */
class AccessibilityAnnouncer {
  private static instance: AccessibilityAnnouncer;
  private politeAnnouncer!: HTMLElement;
  private assertiveAnnouncer!: HTMLElement;

  constructor() {
    if (AccessibilityAnnouncer.instance) {
      return AccessibilityAnnouncer.instance;
    }

    this.politeAnnouncer = this.createAnnouncer("polite");
    this.assertiveAnnouncer = this.createAnnouncer("assertive");
    AccessibilityAnnouncer.instance = this;
  }

  static getInstance(): AccessibilityAnnouncer {
    if (!AccessibilityAnnouncer.instance) {
      AccessibilityAnnouncer.instance = new AccessibilityAnnouncer();
    }
    return AccessibilityAnnouncer.instance;
  }

  announcePolite(message: string): void {
    this.announce(this.politeAnnouncer, message);
  }

  announceAssertive(message: string): void {
    this.announce(this.assertiveAnnouncer, message);
  }

  private announce(announcer: HTMLElement, message: string): void {
    announcer.textContent = "";
    const delay = getCachedDelay("fast");

    // Performance: Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      setTimeout(() => {
        announcer.textContent = message;
      }, delay);
    });
  }

  private createAnnouncer(priority: "polite" | "assertive"): HTMLElement {
    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", priority);
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    document.body.appendChild(announcer);
    return announcer;
  }
}

/**
 * Display an error message for a form field
 * @param {string} fieldId - The ID of the form field
 * @param {string} message - The error message to display
 */
function showFieldError(fieldId: string, message: string): void {
  const errorElement = document.getElementById(`${fieldId}Error`);
  const inputElement = document.getElementById(fieldId) as HTMLInputElement;

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
    errorElement.setAttribute("aria-live", "assertive");
  }

  if (inputElement) {
    inputElement.setAttribute("aria-invalid", "true");
    inputElement.classList.add("auth-form-field__input--error");

    // Performance: Use cached delay and requestAnimationFrame
    const focusDelay = getCachedDelay("fast");
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (document.activeElement !== inputElement) {
          inputElement.focus();
          inputElement.setAttribute("aria-describedby", `${fieldId}Error`);
        }
      }, focusDelay);
    });

    try {
      const announcer = AccessibilityAnnouncer.getInstance();
      const fieldLabel =
        inputElement.closest(".auth-form-field")?.querySelector(".auth-form-field__label")
          ?.textContent || "Field";
      const errorAnnouncement =
        window.authTranslations?.["auth.accessibility.field_error"] || "has an error";
      announcer.announceAssertive(`${fieldLabel} ${errorAnnouncement}: ${message}`);
    } catch {
      console.warn("AccessibilityAnnouncer failed, using fallback");
    }
  }
}

/**
 * Hide the error message for a form field
 * @param {string} fieldId - The ID of the form field
 */
function hideFieldError(fieldId: string): void {
  const errorElement = document.getElementById(`${fieldId}Error`);
  const inputElement = document.getElementById(fieldId) as HTMLInputElement;

  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
    errorElement.setAttribute("aria-live", "polite");
  }

  if (inputElement) {
    inputElement.removeAttribute("aria-invalid");
    inputElement.classList.remove("auth-form-field__input--error");

    try {
      const announcer = AccessibilityAnnouncer.getInstance();
      const fieldLabel =
        inputElement.closest(".auth-form-field")?.querySelector(".auth-form-field__label")
          ?.textContent || "Field";
      const resolvedAnnouncement =
        window.authTranslations?.["auth.accessibility.error_resolved"] || "error resolved";
      announcer.announcePolite(`${fieldLabel} ${resolvedAnnouncement}`);
    } catch {
      // Silent fail for announcements on error clearing
    }
  }
}

/**
 * Validate email format using centralized validation utility
 * @param {string} email - The email address to validate
 * @returns {boolean} True if email format is valid
 */
function validateEmailFormat(email: string): boolean {
  return validateEmail(email);
}

/**
 * Perform immediate validation on an input field
 * @param {HTMLInputElement} input - The input element to validate
 * @returns {boolean} True if validation passes
 */
function performImmediateValidation(input: HTMLInputElement): boolean {
  const fieldId = input.id;
  const value = input.value.trim();

  if (input.type === "email" && value) {
    if (!validateEmailFormat(value)) {
      showFieldError(
        fieldId,
        window.authTranslations?.["auth.form.email_invalid"] || "Please enter a valid email address"
      );
      return false;
    }
  }

  const minPasswordLength = 8;
  if (input.type === "password" && value.length > 0 && value.length < minPasswordLength) {
    showFieldError(
      fieldId,
      window.authTranslations?.["auth.form.password_min_length"] ||
        `Password must be at least ${minPasswordLength} characters long`
    );
    return false;
  }

  hideFieldError(fieldId);
  return true;
}

/**
 * Initialize event listeners and validation for all auth form fields
 */
function initializeAuthFormFields(): void {
  const formFields = document.querySelectorAll(
    ".auth-form-field__input"
  ) as NodeListOf<HTMLInputElement>;
  const eventHandlers = new Map<
    HTMLInputElement,
    {
      input: () => void;
      focus: () => void;
      blur: () => void;
    }
  >();
  const minPasswordLength = 8;

  formFields.forEach((input) => {
    const fieldId = input.id;

    const inputHandler = (): void => {
      if (input.classList.contains("auth-form-field__input--error")) {
        hideFieldError(fieldId);
      }

      if (input.type === "email" && input.value.length > 0) {
        const isValid = validateEmailFormat(input.value.trim());
        if (!isValid && input.value.includes("@")) {
          // Performance: Use debounced validation with cached delay
          debounceValidation(
            fieldId,
            () => performImmediateValidation(input),
            getCachedDelay("slow")
          );
        }
      }
    };

    const focusHandler = (): void => {
      input.classList.add("auth-form-field__input--focused");

      const announcer = AccessibilityAnnouncer.getInstance();
      if (input.type === "email") {
        const emailHint = "Enter a valid email address format: example@domain.com";
        announcer.announcePolite(emailHint);
      } else if (input.type === "password") {
        const passwordHint = `Password must be at least ${minPasswordLength} characters long for security`;
        announcer.announcePolite(passwordHint);
      }
    };

    const blurHandler = (): void => {
      input.classList.remove("auth-form-field__input--focused");
      performImmediateValidation(input);
    };

    // Performance: Use passive listeners where possible
    input.addEventListener("input", inputHandler, { passive: true });
    input.addEventListener("focus", focusHandler, { passive: true });
    input.addEventListener("blur", blurHandler, { passive: true });

    eventHandlers.set(input, {
      input: inputHandler,
      focus: focusHandler,
      blur: blurHandler,
    });
  });

  // Enhanced cleanup function for memory management
  window.cleanupAuthFormFields = (): void => {
    validationTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    validationTimeouts.clear();

    eventHandlers.forEach((handlers, input) => {
      input.removeEventListener("input", handlers.input);
      input.removeEventListener("focus", handlers.focus);
      input.removeEventListener("blur", handlers.blur);
    });
    eventHandlers.clear();

    TIMING_CACHE.clear();
    isTimingCached = false;
  };
}

// Performance: Use requestIdleCallback for non-critical initialization
function initialize(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAuthFormFields);
  } else {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(initializeAuthFormFields);
    } else {
      initializeAuthFormFields();
    }
  }
}

// Expose optimized utilities globally
window.showFieldError = showFieldError;
window.hideFieldError = hideFieldError;
window.validateEmailFormat = validateEmailFormat;

// Auto-initialize when module is imported
initialize();

// Export for ES modules
export { showFieldError, hideFieldError, validateEmailFormat, initializeAuthFormFields };
