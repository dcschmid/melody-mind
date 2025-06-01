/**
 * DOM Manipulation Utilities for Password Reset Form
 *
 * This module contains utilities for DOM manipulation, UI state management,
 * and accessibility enhancements used by the PasswordResetForm component.
 *
 * Features:
 * - Error and success message handling
 * - Loading state management
 * - Password visibility toggles
 * - Requirements UI updates
 * - WCAG AAA accessibility support
 *
 * @module PasswordResetDOMUtils
 */

/**
 * Interface for form elements
 */
export interface FormElements {
  [key: string]: HTMLElement | null;
}

/**
 * Interface for translations object
 */
export interface Translations {
  [key: string]: string;
}

/**
 * Reset error displays efficiently
 * @param elements - Array of elements to reset
 */
export function resetErrorDisplays(elements: (HTMLElement | null)[]): void {
  elements.forEach((element) => {
    if (element) {
      element.textContent = "";
      element.classList.add(
        "password-reset-form__error--hidden",
        "password-reset-form__message--hidden"
      );
    }
  });
}

/**
 * Show error message with ARIA support
 * @param element - Element to show error in
 * @param message - Error message to display
 */
export function showError(element: HTMLElement | null, message: string): void {
  if (element) {
    element.textContent = message;
    element.classList.remove(
      "password-reset-form__error--hidden",
      "password-reset-form__message--hidden"
    );
  }
}

/**
 * Show success message with ARIA support
 * @param element - Element to show success in
 * @param message - Success message to display
 */
export function showSuccess(element: HTMLElement | null, message: string): void {
  if (element) {
    element.textContent = message;
    element.classList.remove("password-reset-form__message--hidden");
  }
}

/**
 * Set loading state with optimized DOM manipulation
 * @param textElement - Element containing submit text
 * @param spinnerElement - Element containing loading spinner
 * @param text - Text to display
 * @param isLoading - Whether form is in loading state
 */
export function setLoadingState(
  textElement: HTMLElement | null,
  spinnerElement: HTMLElement | null,
  text: string,
  isLoading: boolean
): void {
  if (textElement) {
    textElement.textContent = text;
  }
  if (spinnerElement) {
    if (isLoading) {
      spinnerElement.classList.remove("password-reset-form__spinner--hidden");
    } else {
      spinnerElement.classList.add("password-reset-form__spinner--hidden");
    }
  }
}

/**
 * Update password requirements with visual indicators
 * @param password - Current password value
 * @param translations - Translation object
 */
export function updatePasswordRequirements(password: string, translations: Translations): void {
  const requirements = [
    { id: "req-length", test: (p: string) => p.length >= 8 },
    { id: "req-uppercase", test: (p: string) => /[A-Z]/.test(p) },
    { id: "req-lowercase", test: (p: string) => /[a-z]/.test(p) },
    { id: "req-number", test: (p: string) => /[0-9]/.test(p) },
    { id: "req-special", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  requirements.forEach((req) => {
    const element = document.getElementById(req.id);
    const descElement = document.getElementById(`${req.id}-desc`);
    const iconElement = element?.querySelector(".password-reset-form__requirement-icon");

    if (element && descElement && iconElement) {
      const isValid = req.test(password);

      if (isValid) {
        element.classList.remove("password-reset-form__requirement--invalid");
        element.classList.add("password-reset-form__requirement--valid");
        iconElement.textContent = "✓";
        iconElement.setAttribute("aria-hidden", "false");
        descElement.textContent =
          translations["auth.accessibility.requirement.met"] || "Requirement met";
      } else {
        element.classList.remove("password-reset-form__requirement--valid");
        element.classList.add("password-reset-form__requirement--invalid");
        iconElement.textContent = "✗";
        iconElement.setAttribute("aria-hidden", "false");
        descElement.textContent =
          translations["auth.accessibility.requirement.unmet"] || "Requirement not met";
      }
    }
  });
}

/**
 * Update password strength meter with accessibility
 * @param score - Password strength score (0-100)
 * @param level - Password strength level
 * @param translations - Translation object
 */
export function updatePasswordStrengthMeter(
  score: number,
  level: "weak" | "medium" | "strong" | "very-strong",
  translations: Translations
): void {
  const strengthProgress = document.getElementById("passwordStrength") as HTMLElement;
  const strengthText = document.getElementById("passwordStrengthText") as HTMLElement;
  const strengthProgressBar = document.querySelector(
    ".password-reset-form__strength-bar"
  ) as HTMLElement;
  const strengthDescription = document.getElementById("passwordStrengthDescription") as HTMLElement;

  if (strengthProgress) {
    // Update visual progress
    strengthProgress.style.width = `${score}%`;

    // Remove all strength classes
    strengthProgress.classList.remove(
      "password-reset-form__strength-progress--weak",
      "password-reset-form__strength-progress--medium",
      "password-reset-form__strength-progress--strong",
      "password-reset-form__strength-progress--very-strong"
    );

    // Add current strength class
    strengthProgress.classList.add(`password-reset-form__strength-progress--${level}`);
  }

  if (strengthText) {
    const strengthTextContent = translations[`auth.password.strength.${level}`] || level;
    strengthText.textContent = strengthTextContent;

    // Remove all text classes
    strengthText.classList.remove(
      "password-reset-form__strength-text--weak",
      "password-reset-form__strength-text--medium",
      "password-reset-form__strength-text--strong",
      "password-reset-form__strength-text--very-strong"
    );

    // Add current text class
    strengthText.classList.add(`password-reset-form__strength-text--${level}`);

    // Update ARIA attributes for progress bar
    if (strengthProgressBar) {
      strengthProgressBar.setAttribute("aria-valuenow", score.toString());
      const percentageText = `${score}% ${strengthTextContent}`;
      strengthProgressBar.setAttribute("aria-valuetext", percentageText);
    }

    // Enhanced ARIA label with complete description and percentage
    const strengthLabel = translations["auth.password.strength"] || "Password strength";
    strengthText.setAttribute(
      "aria-label",
      `${strengthLabel}: ${strengthTextContent}, ${score}% complete`
    );
  }

  // Update strength description for screen readers with percentage information
  if (strengthDescription) {
    const detailsText =
      translations["auth.password.strength.description"] ||
      "Password strength indicator shows how secure your password is";
    const strengthTextContent = translations[`auth.password.strength.${level}`] || level;
    strengthDescription.textContent = `${detailsText} Current strength: ${strengthTextContent} at ${score} percent`;
  }
}

/**
 * Toggle password visibility with improved accessibility and state announcements
 * @param input - Password input element
 * @param button - Toggle button element
 * @param translations - Translation object
 */
export function togglePasswordVisibility(
  input: HTMLInputElement | null,
  button: HTMLButtonElement | null,
  translations: Translations
): void {
  if (!input || !button) {
    return;
  }

  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";

  const showIcon = button.querySelector(".show-password");
  const hideIcon = button.querySelector(".hide-password");

  if (showIcon && hideIcon) {
    if (isPassword) {
      showIcon.classList.add("password-reset-form__toggle-hidden");
      hideIcon.classList.remove("password-reset-form__toggle-hidden");
    } else {
      showIcon.classList.remove("password-reset-form__toggle-hidden");
      hideIcon.classList.add("password-reset-form__toggle-hidden");
    }
  }

  // Update aria-pressed state
  button.setAttribute("aria-pressed", isPassword ? "true" : "false");

  // Announce state change to screen readers
  const statusElement = button.getAttribute("aria-describedby");
  const statusDiv = statusElement ? document.getElementById(statusElement) : null;
  if (statusDiv) {
    const statusText = isPassword
      ? translations["auth.accessibility.password.visible"] || "Password is now visible"
      : translations["auth.accessibility.password.hidden"] || "Password is now hidden";
    statusDiv.textContent = statusText;
  }

  // Maintain focus for accessibility
  input.focus();
}

/**
 * Initialize password visibility toggles
 * @param translations - Translation object
 */
export function initializePasswordToggles(translations: Translations): void {
  const passwordToggle = document.getElementById("passwordToggle") as HTMLButtonElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const confirmToggle = document.getElementById("passwordConfirmToggle") as HTMLButtonElement;
  const confirmInput = document.getElementById("passwordConfirm") as HTMLInputElement;

  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener("click", (e) => {
      e.preventDefault();
      togglePasswordVisibility(passwordInput, passwordToggle, translations);
    });
  }

  if (confirmToggle && confirmInput) {
    confirmToggle.addEventListener("click", (e) => {
      e.preventDefault();
      togglePasswordVisibility(confirmInput, confirmToggle, translations);
    });
  }
}

/**
 * Initialize requirements toggle with accessibility
 * @param translations - Translation object
 */
export function initializeRequirementsToggle(translations: Translations): void {
  const toggleButton = document.getElementById("toggleRequirements") as HTMLButtonElement;
  const requirementsDiv = document.getElementById("passwordRequirements") as HTMLElement;

  if (toggleButton && requirementsDiv) {
    toggleButton.addEventListener("click", (e) => {
      e.preventDefault();
      const isHidden = requirementsDiv.classList.contains(
        "password-reset-form__requirements--hidden"
      );

      if (isHidden) {
        requirementsDiv.classList.remove("password-reset-form__requirements--hidden");
        toggleButton.setAttribute("aria-expanded", "true");
        toggleButton.textContent =
          translations["auth.password.hide_requirements"] || "Hide Requirements";

        // Announce expansion to screen readers
        const announceText =
          translations["auth.accessibility.requirements.expanded"] ||
          "Password requirements expanded";
        announceToScreenReader(announceText);
      } else {
        requirementsDiv.classList.add("password-reset-form__requirements--hidden");
        toggleButton.setAttribute("aria-expanded", "false");
        toggleButton.textContent =
          translations["auth.password.show_requirements"] || "Show Requirements";

        // Announce collapse to screen readers
        const announceText =
          translations["auth.accessibility.requirements.collapsed"] ||
          "Password requirements collapsed";
        announceToScreenReader(announceText);
      }
    });
  }
}

/**
 * Initialize contextual help functionality
 * @param translations - Translation object
 */
export function initializeContextualHelp(translations: Translations): void {
  const helpButtons = document.querySelectorAll(".password-reset-form__help-button");

  helpButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const helpType = button.getAttribute("data-help-type");
      const tooltip = button.querySelector(".password-reset-form__help-tooltip") as HTMLElement;

      if (tooltip) {
        const isVisible = !tooltip.classList.contains("password-reset-form__help-tooltip--hidden");

        if (isVisible) {
          tooltip.classList.add("password-reset-form__help-tooltip--hidden");
          button.setAttribute("aria-expanded", "false");
        } else {
          // Hide other tooltips first
          document.querySelectorAll(".password-reset-form__help-tooltip").forEach((t) => {
            t.classList.add("password-reset-form__help-tooltip--hidden");
          });
          document.querySelectorAll(".password-reset-form__help-button").forEach((b) => {
            b.setAttribute("aria-expanded", "false");
          });

          // Show current tooltip
          tooltip.classList.remove("password-reset-form__help-tooltip--hidden");
          button.setAttribute("aria-expanded", "true");

          // Update tooltip content based on help type
          updateHelpTooltipContent(tooltip, helpType || "", translations);
        }
      }
    });
  });

  // Close tooltips when clicking outside
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".password-reset-form__help-button")) {
      document.querySelectorAll(".password-reset-form__help-tooltip").forEach((tooltip) => {
        tooltip.classList.add("password-reset-form__help-tooltip--hidden");
      });
      document.querySelectorAll(".password-reset-form__help-button").forEach((button) => {
        button.setAttribute("aria-expanded", "false");
      });
    }
  });
}

/**
 * Update help tooltip content based on type
 * @param tooltip - Tooltip element
 * @param helpType - Type of help content
 * @param translations - Translation object
 */
function updateHelpTooltipContent(
  tooltip: HTMLElement,
  helpType: string,
  translations: Translations
): void {
  let content = "";

  switch (helpType) {
    case "password":
      content =
        translations["auth.form.help.password_suggestions"] ||
        "Use a mix of letters, numbers, and symbols. Avoid common words or personal information.";
      break;
    case "requirements":
      content =
        translations["auth.form.help.requirements_explanation"] ||
        "These requirements help ensure your password is secure and protects your account.";
      break;
    default:
      content = translations["auth.form.help.general"] || "Additional help information.";
  }

  tooltip.textContent = content;
}

/**
 * Announce text to screen readers using aria-live region
 * @param text - Text to announce
 */
function announceToScreenReader(text: string): void {
  let announcer = document.getElementById("screen-reader-announcer");

  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "screen-reader-announcer";
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    document.body.appendChild(announcer);
  }

  // Clear and then set the text to ensure announcement
  announcer.textContent = "";
  setTimeout(() => {
    announcer!.textContent = text;
  }, 100);
}
