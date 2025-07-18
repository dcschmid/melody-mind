/**
 * @file UI interaction handlers for authentication forms
 * @description Provides functions for handling UI interactions like password toggles, tab switching, etc.
 * @since 3.0.0
 * @category Authentication
 */

import {
  validatePassword,
  calculatePasswordStrength,
  PasswordStrengthLevel,
} from "../../lib/auth/password-validation";

/**
 * Password requirements update configuration
 */
export interface PasswordRequirementsConfig {
  passwordField: HTMLInputElement;
  confirmField?: HTMLInputElement;
  requirementElements: {
    length: HTMLElement;
    uppercase: HTMLElement;
    lowercase: HTMLElement;
    number: HTMLElement;
    special: HTMLElement;
    common: HTMLElement;
    repeats: HTMLElement;
    sequences: HTMLElement;
    match?: HTMLElement;
  };
  strengthMeter: {
    progress: HTMLElement;
    text: HTMLElement;
  };
}

/**
 * DOM element collection for authentication forms
 */
export interface AuthFormElements {
  // Tabs
  loginTab: HTMLElement;
  registerTab: HTMLElement;

  // Forms
  loginForm: HTMLFormElement;
  registerForm: HTMLFormElement;

  // Login form elements
  loginEmailInput: HTMLInputElement;
  loginPasswordInput: HTMLInputElement;
  loginEmailError: HTMLElement;
  loginPasswordError: HTMLElement;
  loginSubmitText: HTMLElement;
  loginLoadingSpinner: HTMLElement;
  toggleLoginPasswordButton: HTMLButtonElement;

  // Registration form elements
  registerEmailInput: HTMLInputElement;
  registerUsernameInput?: HTMLInputElement;
  registerPasswordInput: HTMLInputElement;
  registerPasswordConfirmInput: HTMLInputElement;
  registerEmailError: HTMLElement;
  registerPasswordError: HTMLElement;
  registerPasswordConfirmError: HTMLElement;
  registerSubmitText: HTMLElement;
  registerLoadingSpinner: HTMLElement;
  toggleRegisterPasswordButton: HTMLButtonElement;
  toggleRegisterPasswordConfirmButton: HTMLButtonElement;

  // Password requirements elements
  toggleRequirementsButton?: HTMLButtonElement;
  passwordRequirements?: HTMLElement;
  passwordStrength?: HTMLElement;
  strengthText?: HTMLElement;

  // Requirements checklist
  reqLength?: HTMLElement;
  reqUppercase?: HTMLElement;
  reqLowercase?: HTMLElement;
  reqNumber?: HTMLElement;
  reqSpecial?: HTMLElement;
  reqCommon?: HTMLElement;
  reqRepeats?: HTMLElement;
  reqSequences?: HTMLElement;
  reqMatch?: HTMLElement;

  // Message elements
  formError: HTMLElement;
  formSuccess: HTMLElement;
}

/**
 * Initializes and returns all required DOM elements for the authentication form
 *
 * @returns Object containing all form elements or null if required elements are missing
 */
export function initializeAuthFormElements(): AuthFormElements | null {
  const elements = {
    // Tabs
    loginTab: document.getElementById("loginTab"),
    registerTab: document.getElementById("registerTab"),

    // Forms
    loginForm: document.getElementById("loginForm") as HTMLFormElement,
    registerForm: document.getElementById("registerForm") as HTMLFormElement,

    // Login form elements
    loginEmailInput: document.getElementById("loginEmail") as HTMLInputElement,
    loginPasswordInput: document.getElementById("loginPassword") as HTMLInputElement,
    loginEmailError: document.getElementById("loginEmailError"),
    loginPasswordError: document.getElementById("loginPasswordError"),
    loginSubmitText: document.getElementById("loginSubmitText"),
    loginLoadingSpinner: document.getElementById("loginLoadingSpinner"),
    toggleLoginPasswordButton: document.getElementById("toggleLoginPassword") as HTMLButtonElement,

    // Registration form elements
    registerEmailInput: document.getElementById("registerEmail") as HTMLInputElement,
    registerUsernameInput: document.getElementById("registerUsername") as HTMLInputElement,
    registerPasswordInput: document.getElementById("registerPassword") as HTMLInputElement,
    registerPasswordConfirmInput: document.getElementById(
      "registerPasswordConfirm"
    ) as HTMLInputElement,
    registerEmailError: document.getElementById("registerEmailError"),
    registerPasswordError: document.getElementById("registerPasswordError"),
    registerPasswordConfirmError: document.getElementById("registerPasswordConfirmError"),
    registerSubmitText: document.getElementById("registerSubmitText"),
    registerLoadingSpinner: document.getElementById("registerLoadingSpinner"),
    toggleRegisterPasswordButton: document.getElementById(
      "toggleRegisterPassword"
    ) as HTMLButtonElement,
    toggleRegisterPasswordConfirmButton: document.getElementById(
      "toggleRegisterPasswordConfirm"
    ) as HTMLButtonElement,

    // Password requirements elements
    toggleRequirementsButton: document.getElementById("toggleRequirements") as HTMLButtonElement,
    passwordRequirements: document.getElementById("passwordRequirements"),
    passwordStrength: document.getElementById("passwordStrength"),
    strengthText: document.getElementById("strengthText"),

    // Requirements checklist
    reqLength: document.getElementById("req-length"),
    reqUppercase: document.getElementById("req-uppercase"),
    reqLowercase: document.getElementById("req-lowercase"),
    reqNumber: document.getElementById("req-number"),
    reqSpecial: document.getElementById("req-special"),
    reqCommon: document.getElementById("req-common"),
    reqRepeats: document.getElementById("req-repeats"),
    reqSequences: document.getElementById("req-sequences"),
    reqMatch: document.getElementById("req-match"),

    // Message elements
    formError: document.getElementById("formError"),
    formSuccess: document.getElementById("formSuccess"),
  } as AuthFormElements;

  // Verify required elements exist
  if (
    !elements.loginTab ||
    !elements.registerTab ||
    !elements.loginForm ||
    !elements.registerForm
  ) {
    console.error("Required form elements not found");
    return null;
  }

  return elements;
}

/**
 * Updates password requirements UI based on current password values
 *
 * @param config - Configuration object with DOM elements
 */
export function updatePasswordRequirements(config: PasswordRequirementsConfig): void {
  const password = config.passwordField.value;
  const passwordConfirm = config.confirmField?.value || "";

  // Validate the password
  const { errors } = validatePassword(password);

  // Update requirements in the UI
  updateRequirementStatus(
    config.requirementElements.length,
    !errors.includes("auth.password.min_length_error")
  );
  updateRequirementStatus(
    config.requirementElements.uppercase,
    !errors.includes("auth.password.uppercase_error")
  );
  updateRequirementStatus(
    config.requirementElements.lowercase,
    !errors.includes("auth.password.lowercase_error")
  );
  updateRequirementStatus(
    config.requirementElements.number,
    !errors.includes("auth.password.number_error")
  );
  updateRequirementStatus(
    config.requirementElements.special,
    !errors.includes("auth.password.special_char_error")
  );
  updateRequirementStatus(
    config.requirementElements.common,
    !errors.includes("auth.password.common_password")
  );
  updateRequirementStatus(
    config.requirementElements.repeats,
    !errors.includes("auth.password.repeats_error")
  );
  updateRequirementStatus(
    config.requirementElements.sequences,
    !errors.includes("auth.password.sequence_error")
  );

  // Check if passwords match (if confirm field exists)
  if (config.confirmField && config.requirementElements.match) {
    const isMatch: boolean = Boolean(password && passwordConfirm && password === passwordConfirm);
    updateRequirementStatus(config.requirementElements.match, isMatch);
  }

  // Update password strength meter
  updateStrengthMeter(password, config.strengthMeter);
}

/**
 * Updates a single requirement status in the UI
 *
 * @param element - The requirement element
 * @param isValid - Whether the requirement is met
 */
function updateRequirementStatus(element: HTMLElement, isValid: boolean): void {
  element.className = isValid
    ? "auth-form__requirement auth-form__requirement--valid"
    : "auth-form__requirement auth-form__requirement--invalid";
}

/**
 * Updates the password strength meter
 *
 * @param password - The password to evaluate
 * @param strengthElements - Strength meter elements
 */
function updateStrengthMeter(
  password: string,
  strengthElements: { progress: HTMLElement; text: HTMLElement }
): void {
  const strengthResult = calculatePasswordStrength(password);
  const strength = strengthResult.score;

  strengthElements.progress.style.width = `${strength}%`;

  // Update color and text based on strength
  let strengthClass: string;
  let strengthText: string;

  switch (strengthResult.level) {
    case PasswordStrengthLevel.VeryWeak:
    case PasswordStrengthLevel.Weak:
      strengthClass = "weak";
      strengthText = document.documentElement.lang === "de" ? "Schwach" : "Weak";
      break;
    case PasswordStrengthLevel.Moderate:
      strengthClass = "medium";
      strengthText = document.documentElement.lang === "de" ? "Mittel" : "Medium";
      break;
    case PasswordStrengthLevel.Strong:
      strengthClass = "strong";
      strengthText = document.documentElement.lang === "de" ? "Stark" : "Strong";
      break;
    case PasswordStrengthLevel.VeryStrong:
      strengthClass = "very-strong";
      strengthText = document.documentElement.lang === "de" ? "Sehr stark" : "Very Strong";
      break;
    default:
      strengthClass = "weak";
      strengthText = document.documentElement.lang === "de" ? "Schwach" : "Weak";
  }

  strengthElements.progress.className = `auth-form__strength-progress auth-form__strength-progress--${strengthClass}`;
  strengthElements.text.className = `auth-form__strength-text auth-form__strength-text--${strengthClass}`;
  strengthElements.text.textContent = strengthText;

  // Update ARIA attributes for screen readers
  const strengthLabel =
    document.documentElement.lang === "de" ? "Passwortstärke: " : "Password strength: ";
  strengthElements.text.setAttribute("aria-label", strengthLabel + strengthText);
}

/**
 * Sets up password visibility toggle functionality
 *
 * @param toggleButton - The toggle button element
 * @param passwordInput - The password input element
 */
export function setupPasswordToggle(
  toggleButton: HTMLElement,
  passwordInput: HTMLInputElement
): void {
  toggleButton.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    // Update icon visibility
    const showIcon = toggleButton.querySelector(".auth-form__icon--show") as HTMLElement;
    const hideIcon = toggleButton.querySelector(".auth-form__icon--hide") as HTMLElement;

    if (showIcon && hideIcon) {
      if (isPassword) {
        showIcon.style.display = "none";
        hideIcon.style.display = "flex";
      } else {
        showIcon.style.display = "flex";
        hideIcon.style.display = "none";
      }
    }

    // Maintain focus on the input
    passwordInput.focus();
  });
}

/**
 * Sets up tab switching functionality
 *
 * @param loginTab - Login tab element
 * @param registerTab - Register tab element
 * @param loginForm - Login form element
 * @param registerForm - Register form element
 * @param errorElement - Error message element
 * @param successElement - Success message element
 */
export function setupTabSwitching(
  loginTab: HTMLElement,
  registerTab: HTMLElement,
  loginForm: HTMLElement,
  registerForm: HTMLElement,
  errorElement: HTMLElement,
  successElement: HTMLElement
): void {
  /**
   * Switches between login and registration tabs
   */
  function switchTab(mode: "login" | "register"): void {
    if (mode === "login") {
      // Update tabs
      loginTab.classList.add("auth-form__tab--active");
      registerTab.classList.remove("auth-form__tab--active");
      loginTab.setAttribute("aria-selected", "true");
      registerTab.setAttribute("aria-selected", "false");

      // Update forms
      loginForm.classList.add("auth-form__form--active");
      registerForm.classList.remove("auth-form__form--active");
      loginForm.setAttribute("aria-hidden", "false");
      registerForm.setAttribute("aria-hidden", "true");
    } else {
      // Update tabs
      loginTab.classList.remove("auth-form__tab--active");
      registerTab.classList.add("auth-form__tab--active");
      loginTab.setAttribute("aria-selected", "false");
      registerTab.setAttribute("aria-selected", "true");

      // Update forms
      loginForm.classList.remove("auth-form__form--active");
      registerForm.classList.add("auth-form__form--active");
      loginForm.setAttribute("aria-hidden", "true");
      registerForm.setAttribute("aria-hidden", "false");
    }

    // Reset messages
    errorElement.textContent = "";
    errorElement.style.display = "none";
    successElement.textContent = "";
    successElement.style.display = "none";
  }

  // Set up event listeners
  loginTab.addEventListener("click", () => switchTab("login"));
  registerTab.addEventListener("click", () => switchTab("register"));

  // Keyboard navigation
  loginTab.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      switchTab("login");
    }
  });

  registerTab.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      switchTab("register");
    }
  });
}

/**
 * Sets up password requirements toggle functionality
 *
 * @param toggleButton - Toggle button element
 * @param requirementsPanel - Requirements panel element
 * @param updateCallback - Function to call when panel is expanded
 */
export function setupRequirementsToggle(
  toggleButton: HTMLElement,
  requirementsPanel: HTMLElement,
  updateCallback: () => void
): void {
  toggleButton.addEventListener("click", () => {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    const newState = !isExpanded;

    toggleButton.setAttribute("aria-expanded", newState ? "true" : "false");
    requirementsPanel.style.display = newState ? "block" : "none";
    requirementsPanel.setAttribute("aria-hidden", newState ? "false" : "true");

    if (newState) {
      updateCallback();
    }
  });
}

/**
 * Sets up form submission with loading states
 *
 * @param form - Form element
 * @param submitButton - Submit button element
 * @param submitText - Submit text element
 * @param loadingSpinner - Loading spinner element
 * @param onSubmit - Submit handler function
 */
export function setupFormSubmission(
  form: HTMLFormElement,
  submitButton: HTMLButtonElement,
  submitText: HTMLElement,
  loadingSpinner: HTMLElement,
  onSubmit: (event: Event) => Promise<void>
): void {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Show loading state
    const originalText = submitText.textContent;
    submitText.textContent =
      document.documentElement.lang === "de" ? "Wird geladen..." : "Loading...";
    loadingSpinner.style.display = "inline-block";
    submitButton.disabled = true;

    try {
      await onSubmit(e);
    } finally {
      // Reset loading state
      submitText.textContent = originalText;
      loadingSpinner.style.display = "none";
      submitButton.disabled = false;
    }
  });
}

/**
 * Shows an error message
 *
 * @param element - Error message element
 * @param message - Error message to display
 */
export function showError(element: HTMLElement, message: string): void {
  element.textContent = message;
  element.style.display = "block";
}

/**
 * Shows a success message
 *
 * @param element - Success message element
 * @param message - Success message to display
 */
export function showSuccess(element: HTMLElement, message: string): void {
  element.textContent = message;
  element.style.display = "block";
}

/**
 * Hides a message element
 *
 * @param element - Message element to hide
 */
export function hideMessage(element: HTMLElement): void {
  element.textContent = "";
  element.style.display = "none";
}

/**
 * Sets up accessibility improvements
 */
export function setupAccessibilityFeatures(): void {
  // Reduced motion detection
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    document.documentElement.classList.add("reduced-motion");
  }

  // Store redirect URL announcement for accessibility
  if (!new URLSearchParams(window.location.search).has("redirect")) {
    const redirectAnnouncement = document.createElement("div");
    redirectAnnouncement.className = "sr-only";
    redirectAnnouncement.setAttribute("aria-live", "polite");
    redirectAnnouncement.textContent =
      document.documentElement.lang === "de"
        ? "Nach erfolgreicher Anmeldung werden Sie auf diese Seite zurückgeleitet."
        : "After successful login, you will be redirected back to this page.";
    document.body.appendChild(redirectAnnouncement);
  }
}

/**
 * Sets up all password toggle functionality
 *
 * @param elements - Form elements collection
 */
export function setupPasswordToggles(elements: AuthFormElements): void {
  if (elements.toggleLoginPasswordButton && elements.loginPasswordInput) {
    setupPasswordToggle(elements.toggleLoginPasswordButton, elements.loginPasswordInput);
  }

  if (elements.toggleRegisterPasswordButton && elements.registerPasswordInput) {
    setupPasswordToggle(elements.toggleRegisterPasswordButton, elements.registerPasswordInput);
  }

  if (elements.toggleRegisterPasswordConfirmButton && elements.registerPasswordConfirmInput) {
    setupPasswordToggle(
      elements.toggleRegisterPasswordConfirmButton,
      elements.registerPasswordConfirmInput
    );
  }
}

/**
 * Creates a password requirements configuration object
 *
 * @param {AuthFormElements} elements - Form elements collection
 * @returns {PasswordRequirementsConfig | null} - Requirements configuration or null if elements missing
 */
export function createPasswordRequirementsConfig(
  elements: AuthFormElements
): PasswordRequirementsConfig | null {
  if (!elements.registerPasswordInput || !elements.passwordStrength || !elements.strengthText) {
    return null;
  }

  return {
    passwordField: elements.registerPasswordInput,
    confirmField: elements.registerPasswordConfirmInput,
    requirementElements: {
      length: elements.reqLength!,
      uppercase: elements.reqUppercase!,
      lowercase: elements.reqLowercase!,
      number: elements.reqNumber!,
      special: elements.reqSpecial!,
      common: elements.reqCommon!,
      repeats: elements.reqRepeats!,
      sequences: elements.reqSequences!,
      match: elements.reqMatch,
    },
    strengthMeter: {
      progress: elements.passwordStrength,
      text: elements.strengthText,
    },
  };
}

/**
 * Sets up login form submission handler
 *
 * @param {AuthFormElements} elements - Form elements collection
 * @param {any} translations - Translation object for error messages
 */
export function setupLoginFormHandler(elements: AuthFormElements, translations: any): void {
  if (!elements.loginForm) {
    return;
  }

  const { handleLoginSubmission, validateLoginForm } = require("../../utils/auth/form-handlers.ts");

  setupFormSubmission(
    elements.loginForm,
    elements.loginForm.querySelector('button[type="submit"]') as HTMLButtonElement,
    elements.loginSubmitText,
    elements.loginLoadingSpinner,
    async () => {
      // Reset error displays
      hideMessage(elements.loginEmailError);
      hideMessage(elements.loginPasswordError);
      hideMessage(elements.formError);

      // Collect form data
      const formData = {
        email: elements.loginEmailInput.value,
        password: elements.loginPasswordInput.value,
      };

      // Validate form
      const validation = validateLoginForm(formData);
      if (!validation.isValid) {
        if (validation.errors.email) {
          showError(elements.loginEmailError, validation.errors.email);
        }
        if (validation.errors.password) {
          showError(elements.loginPasswordError, validation.errors.password);
        }
        return;
      }

      // Submit form
      const result = await handleLoginSubmission(formData, translations);
      handleLoginResult(result, elements);
    }
  );
}

/**
 * Sets up registration form submission handler
 *
 * @param {AuthFormElements} elements - Form elements collection
 */
export function setupRegistrationFormHandler(elements: AuthFormElements): void {
  if (!elements.registerForm) {
    return;
  }

  const {
    handleRegistrationSubmission,
    validateRegistrationForm,
  } = require("../../utils/auth/form-handlers.ts");

  setupFormSubmission(
    elements.registerForm,
    elements.registerForm.querySelector('button[type="submit"]') as HTMLButtonElement,
    elements.registerSubmitText,
    elements.registerLoadingSpinner,
    async () => {
      // Reset error displays
      hideMessage(elements.registerEmailError);
      hideMessage(elements.registerPasswordError);
      hideMessage(elements.registerPasswordConfirmError);
      hideMessage(elements.formError);
      hideMessage(elements.formSuccess);

      // Collect form data
      const formData = {
        email: elements.registerEmailInput.value,
        username: elements.registerUsernameInput?.value,
        password: elements.registerPasswordInput.value,
        passwordConfirm: elements.registerPasswordConfirmInput.value,
      };

      // Validate form
      const validation = validateRegistrationForm(formData);
      if (!validation.isValid) {
        if (validation.errors.email) {
          showError(elements.registerEmailError, validation.errors.email);
        }
        if (validation.errors.password) {
          showError(elements.registerPasswordError, validation.errors.password);
        }
        if (validation.errors.passwordConfirm) {
          showError(elements.registerPasswordConfirmError, validation.errors.passwordConfirm);
        }
        return;
      }

      // Submit form
      const result = await handleRegistrationSubmission(formData);
      handleRegistrationResult(result, elements);
    }
  );
}

/**
 * Handles login submission result
 *
 * @param {any} result - Login result from submission
 * @param {AuthFormElements} elements - Form elements collection
 */
function handleLoginResult(result: any, elements: AuthFormElements): void {
  if (result.success) {
    showSuccess(elements.formSuccess, result.message);

    // Update UI state if user data available
    document.body.classList.add("user-authenticated");

    // Check if we're on a category page and should stay here
    const currentPath = window.location.pathname;
    const shouldStayOnCurrentPage = currentPath.includes('category') || 
                                    currentPath.match(/^\/[a-z]{2}\/[^\/]+$/); // matches pattern like /de/1980s

    if (shouldStayOnCurrentPage) {
      // Instead of redirecting, reload the page to show the game modes
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      // Redirect after successful login for other pages
      if (result.redirectUrl) {
        setTimeout(() => {
          try {
            window.location.href = result.redirectUrl;
          } catch (error) {
            console.error("Redirect failed:", error);
            showSuccess(
              elements.formSuccess,
              document.documentElement.lang === "de"
                ? "Anmeldung erfolgreich! Sie können diese Seite jetzt schließen oder aktualisieren."
                : "Login successful! You can now close or refresh this page."
            );
          }
        }, 300);
      }
    }
  } else {
    showError(elements.formError, result.error);
  }
}

/**
 * Handles registration submission result
 *
 * @param {any} result - Registration result from submission
 * @param {AuthFormElements} elements - Form elements collection
 */
function handleRegistrationResult(result: any, elements: AuthFormElements): void {
  if (result.success) {
    showSuccess(elements.formSuccess, result.message);

    // Reset form on successful registration
    elements.registerForm.reset();

    // Reset password requirements display
    const requirementsConfig = createPasswordRequirementsConfig(elements);
    if (requirementsConfig) {
      updatePasswordRequirements(requirementsConfig);
    }
  } else {
    showError(elements.formError, result.error);
  }
}

/**
 * Sets up password requirements functionality
 *
 * @param elements - Form elements collection
 */
export function setupPasswordRequirements(elements: AuthFormElements): void {
  if (!elements.registerPasswordInput || !elements.passwordRequirements) {
    return;
  }

  const requirementsConfig: PasswordRequirementsConfig = {
    passwordField: elements.registerPasswordInput,
    confirmField: elements.registerPasswordConfirmInput,
    requirementElements: {
      length: elements.reqLength!,
      uppercase: elements.reqUppercase!,
      lowercase: elements.reqLowercase!,
      number: elements.reqNumber!,
      special: elements.reqSpecial!,
      common: elements.reqCommon!,
      repeats: elements.reqRepeats!,
      sequences: elements.reqSequences!,
      match: elements.reqMatch,
    },
    strengthMeter: {
      progress: elements.passwordStrength!,
      text: elements.strengthText!,
    },
  };

  // Set up requirements toggle
  if (elements.toggleRequirementsButton) {
    setupRequirementsToggle(elements.toggleRequirementsButton, elements.passwordRequirements, () =>
      updatePasswordRequirements(requirementsConfig)
    );
  }

  // Set up real-time password validation
  elements.registerPasswordInput.addEventListener("input", () => {
    updatePasswordRequirements(requirementsConfig);
  });

  if (elements.registerPasswordConfirmInput) {
    elements.registerPasswordConfirmInput.addEventListener("input", () => {
      updatePasswordRequirements(requirementsConfig);
    });
  }
}

/**
 * Sets up keyboard navigation enhancements
 *
 * @param elements - Form elements collection
 */
export function setupKeyboardNavigation(elements: AuthFormElements): void {
  // Enhanced keyboard navigation for login form
  if (elements.loginForm) {
    elements.loginForm.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target === elements.loginPasswordInput) {
        e.preventDefault();
        elements.loginForm.dispatchEvent(new Event("submit"));
      }
    });
  }

  // Enhanced keyboard navigation for registration form
  if (elements.registerForm) {
    elements.registerForm.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target === elements.registerPasswordConfirmInput) {
        e.preventDefault();
        elements.registerForm.dispatchEvent(new Event("submit"));
      }
    });
  }
}
