/**
 * AuthForm Utility Functions
 * Extracted from AuthForm.astro to enable proper TypeScript support
 */

export interface AuthFormTranslations {
  invalidCredentials: string;
  tooManyAttempts: string;
}

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Displays an error message in the form error container
 * @param message - The error message to display
 */
export function showError(message: string): void {
  const formError = document.getElementById("formError");
  if (formError) {
    formError.textContent = message;
    formError.style.display = "block";
  }
}

/**
 * Email validation function - matches the one from AuthFormField
 * @param email - The email address to validate
 * @returns True if email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Shows an error message for a specific form field
 * @param fieldId - The ID of the form field
 * @param message - The error message to display
 */
export function showFieldError(fieldId: string, message: string): void {
  const errorElement = document.getElementById(`${fieldId}Error`);
  const inputElement = document.getElementById(fieldId);

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
    errorElement.setAttribute("aria-live", "assertive");
  }

  if (inputElement) {
    inputElement.setAttribute("aria-invalid", "true");
    inputElement.classList.add("auth-form__input--error");
  }
}

/**
 * Hides the error message for a specific form field
 * @param fieldId - The ID of the form field
 */
export function hideFieldError(fieldId: string): void {
  const errorElement = document.getElementById(`${fieldId}Error`);
  const inputElement = document.getElementById(fieldId);

  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
    errorElement.setAttribute("aria-live", "polite");
  }

  if (inputElement) {
    inputElement.removeAttribute("aria-invalid");
    inputElement.classList.remove("auth-form__input--error");
  }
}

/**
 * Sets the loading state of a submit button
 * @param buttonId - The ID of the submit button
 * @param isLoading - Whether the button should show loading state
 * @param loadingText - Optional custom loading text
 */
export function setAuthButtonLoadingState(
  buttonId: string,
  isLoading: boolean,
  loadingText?: string
): void {
  const button = document.getElementById(buttonId);
  if (!button) {
    return;
  }

  const textElement = button.querySelector(".auth-form__submit-text");
  const spinner = button.querySelector(".auth-form__spinner");

  if (!textElement || !spinner) {
    return;
  }

  if (isLoading) {
    if (!button.dataset.originalText) {
      button.dataset.originalText = textElement.textContent || "";
    }

    button.disabled = true;
    button.setAttribute("aria-busy", "true");

    const lang = document.documentElement.lang || "en";
    const defaultLoadingText = lang === "de" ? "Wird verarbeitet..." : "Processing...";
    textElement.textContent = loadingText || defaultLoadingText;

    (spinner as HTMLElement).style.display = "inline-flex";
    spinner.setAttribute("aria-hidden", "false");

    button.classList.add("auth-form__submit-button--loading");
  } else {
    button.disabled = false;
    button.removeAttribute("aria-busy");

    const originalText = button.dataset.originalText;
    if (originalText) {
      textElement.textContent = originalText;
    }

    (spinner as HTMLElement).style.display = "none";
    spinner.setAttribute("aria-hidden", "true");

    button.classList.remove("auth-form__submit-button--loading");
  }
}

/**
 * Switches the active tab and form between login and registration
 * @param mode - The mode to switch to
 */
export function switchTab(mode: "login" | "register"): void {
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const formError = document.getElementById("formError");
  const formSuccess = document.getElementById("formSuccess");

  if (!loginTab || !registerTab || !loginForm || !registerForm) {
    return;
  }

  if (mode === "login") {
    loginTab.classList.add("auth-form__tab--active");
    registerTab.classList.remove("auth-form__tab--active");
    loginTab.setAttribute("aria-selected", "true");
    registerTab.setAttribute("aria-selected", "false");

    loginForm.classList.add("auth-form__form--active");
    registerForm.classList.remove("auth-form__form--active");
    loginForm.setAttribute("aria-hidden", "false");
    registerForm.setAttribute("aria-hidden", "true");
  } else {
    loginTab.classList.remove("auth-form__tab--active");
    registerTab.classList.add("auth-form__tab--active");
    loginTab.setAttribute("aria-selected", "false");
    registerTab.setAttribute("aria-selected", "true");

    loginForm.classList.remove("auth-form__form--active");
    registerForm.classList.add("auth-form__form--active");
    loginForm.setAttribute("aria-hidden", "true");
    registerForm.setAttribute("aria-hidden", "false");
  }

  // Reset errors
  if (formError) {
    formError.textContent = "";
    formError.style.display = "none";
  }
  if (formSuccess) {
    formSuccess.textContent = "";
    formSuccess.style.display = "none";
  }
}

/**
 * Handles login form submission
 * @param event - The form submission event
 * @param translations - Translation strings for error messages
 */
export async function handleLoginSubmit(
  event: Event,
  translations: AuthFormTranslations
): Promise<void> {
  event.preventDefault();

  const emailInput = document.getElementById("loginEmail") as HTMLInputElement;
  const passwordInput = document.getElementById("loginPassword") as HTMLInputElement;

  if (!emailInput || !passwordInput) {
    return;
  }

  // Reset error displays
  hideFieldError("loginEmail");
  hideFieldError("loginPassword");
  const formError = document.getElementById("formError");
  if (formError) {
    formError.textContent = "";
    formError.style.display = "none";
  }

  let isValid = true;

  // Basic validation
  if (!emailInput.value) {
    showFieldError(
      "loginEmail",
      document.documentElement.lang === "de"
        ? "E-Mail-Adresse ist erforderlich"
        : "Email address is required"
    );
    isValid = false;
  } else if (!validateEmail(emailInput.value)) {
    showFieldError(
      "loginEmail",
      document.documentElement.lang === "de" ? "Ungültige E-Mail-Adresse" : "Invalid email address"
    );
    isValid = false;
  }

  if (!passwordInput.value) {
    showFieldError(
      "loginPassword",
      document.documentElement.lang === "de" ? "Passwort ist erforderlich" : "Password is required"
    );
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Set loading state
  setAuthButtonLoadingState("loginSubmitButton", true);

  try {
    const currentLang = document.documentElement.lang || "de";
    const redirectUrl =
      new URLSearchParams(window.location.search).get("redirect") || window.location.pathname;

    const response = await fetch(`/${currentLang}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
        redirectUrl: redirectUrl,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const formSuccess = document.getElementById("formSuccess");
      if (formSuccess) {
        formSuccess.textContent =
          document.documentElement.lang === "de" ? "Anmeldung erfolgreich!" : "Login successful!";
        formSuccess.style.display = "block";
      }

      // Dispatch auth event
      document.dispatchEvent(
        new CustomEvent("auth:login", {
          detail: { user: data.user, token: data.token },
          bubbles: true,
        })
      );

      const redirectTo = data.redirectUrl || redirectUrl || `/${document.documentElement.lang}`;
      setTimeout(() => (window.location.href = redirectTo), 300);
    } else {
      if (response.status === 401) {
        showError(translations.invalidCredentials);
      } else if (response.status === 429) {
        showError(translations.tooManyAttempts);
      } else {
        showError(
          data.error ||
            (document.documentElement.lang === "de"
              ? "Anmeldung fehlgeschlagen. Bitte überprüfe deine Eingaben."
              : "Login failed. Please check your credentials.")
        );
      }
    }
  } catch {
    showError(
      document.documentElement.lang === "de"
        ? "Ein Fehler ist aufgetreten. Bitte versuche es später erneut."
        : "An error occurred. Please try again later."
    );
  } finally {
    setAuthButtonLoadingState("loginSubmitButton", false);
  }
}

/**
 * Handles registration form submission
 * @param event - The form submission event
 */
export async function handleRegisterSubmit(event: Event): Promise<void> {
  event.preventDefault();

  const emailInput = document.getElementById("registerEmail") as HTMLInputElement;
  const usernameInput = document.getElementById("registerUsername") as HTMLInputElement;
  const passwordInput = document.getElementById("registerPassword") as HTMLInputElement;
  const confirmInput = document.getElementById("registerPasswordConfirm") as HTMLInputElement;

  if (!emailInput || !passwordInput || !confirmInput) {
    return;
  }

  // Reset error displays
  hideFieldError("registerEmail");
  hideFieldError("registerPassword");
  hideFieldError("registerPasswordConfirm");
  const formError = document.getElementById("formError");
  const formSuccess = document.getElementById("formSuccess");
  if (formError) {
    formError.textContent = "";
    formError.style.display = "none";
  }
  if (formSuccess) {
    formSuccess.textContent = "";
    formSuccess.style.display = "none";
  }

  let isValid = true;

  // Email validation
  if (!emailInput.value) {
    showFieldError(
      "registerEmail",
      document.documentElement.lang === "de"
        ? "E-Mail-Adresse ist erforderlich"
        : "Email address is required"
    );
    isValid = false;
  } else if (!validateEmail(emailInput.value)) {
    showFieldError(
      "registerEmail",
      document.documentElement.lang === "de" ? "Ungültige E-Mail-Adresse" : "Invalid email address"
    );
    isValid = false;
  }

  // Password validation
  if (!passwordInput.value) {
    showFieldError(
      "registerPassword",
      document.documentElement.lang === "de" ? "Passwort ist erforderlich" : "Password is required"
    );
    isValid = false;
  }

  // Password confirmation
  if (!confirmInput.value) {
    showFieldError(
      "registerPasswordConfirm",
      document.documentElement.lang === "de"
        ? "Passwortbestätigung ist erforderlich"
        : "Password confirmation is required"
    );
    isValid = false;
  } else if (passwordInput.value !== confirmInput.value) {
    showFieldError(
      "registerPasswordConfirm",
      document.documentElement.lang === "de"
        ? "Die Passwörter stimmen nicht überein"
        : "Passwords do not match"
    );
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Set loading state
  setAuthButtonLoadingState("registerSubmitButton", true);

  try {
    const currentLang = document.documentElement.lang || "de";
    const redirectUrl =
      new URLSearchParams(window.location.search).get("redirect") || window.location.pathname;

    const response = await fetch(`/${currentLang}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput.value,
        username: usernameInput?.value || undefined,
        password: passwordInput.value,
        redirectUrl: redirectUrl,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      if (formSuccess) {
        formSuccess.textContent =
          data.message ||
          (document.documentElement.lang === "de"
            ? "Registrierung erfolgreich! Bitte überprüfe dein E-Mail-Postfach, um deine E-Mail-Adresse zu bestätigen."
            : "Registration successful! Please check your email to verify your email address.");
        formSuccess.style.display = "block";
      }
      const registerForm = document.getElementById("registerForm") as HTMLFormElement;
      if (registerForm) {
        registerForm.reset();
      }
    } else {
      showError(
        data.error ||
          (document.documentElement.lang === "de"
            ? "Registrierung fehlgeschlagen. Bitte überprüfe deine Eingaben."
            : "Registration failed. Please check your inputs.")
      );
    }
  } catch {
    showError(
      document.documentElement.lang === "de"
        ? "Ein Fehler ist aufgetreten. Bitte versuche es später erneut."
        : "An error occurred. Please try again later."
    );
  } finally {
    setAuthButtonLoadingState("registerSubmitButton", false);
  }
}

/**
 * Initializes the AuthForm with event listeners
 * @param translations - Translation strings for error messages
 */
export function initializeAuthForm(translations: AuthFormTranslations): void {
  // Get DOM elements
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // Tab-switching functionality
  if (loginTab && registerTab) {
    loginTab.addEventListener("click", () => switchTab("login"));
    registerTab.addEventListener("click", () => switchTab("register"));

    // Keyboard navigation for tabs
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

  // Form submission handlers
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => handleLoginSubmit(e, translations));
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => handleRegisterSubmit(e));
  }

  // Reduced motion detection for accessibility
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    document.documentElement.classList.add("reduced-motion");
  }
}
