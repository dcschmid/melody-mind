/**
 * Authentication Form Enhancement Utilities
 *
 * Provides enhanced accessibility and interaction features for authentication forms.
 * Includes keyboard navigation, announcements, and motion preference handling.
 *
 * @module AuthFormEnhancements
 * @accessibility Provides WCAG AAA compliant enhancements
 * @performance Optimized with efficient event delegation and minimal DOM queries
 */

export interface AuthElements {
  loginTab: HTMLElement | null;
  registerTab: HTMLElement | null;
  loginForm: HTMLElement | null;
  registerForm: HTMLElement | null;
  formError: HTMLElement | null;
  formSuccess: HTMLElement | null;
}

export interface AuthTranslations {
  invalidCredentials: string;
  tooManyAttempts: string;
  loginFormActive: string;
  registerFormActive: string;
}

/**
 * Sets up accessibility enhancements for the authentication form
 *
 * @param elements - Form elements
 * @param translations - Translation strings
 */
export function setupAccessibilityEnhancements(
  elements: AuthElements,
  translations: AuthTranslations
): void {
  setupReducedMotionSupport();
  setupEnhancedTextSpacing();
  setupTabAnnouncements(elements, translations);
  setupKeyboardNavigation();
}

/**
 * Detects and applies reduced motion preferences
 */
function setupReducedMotionSupport(): void {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("reduced-motion");
  }
}

/**
 * Detects touch devices and applies enhanced text spacing
 */
function setupEnhancedTextSpacing(): void {
  if (window.matchMedia && window.matchMedia("(any-hover: none)").matches) {
    document.documentElement.classList.add("enhanced-text-spacing");
  }
}

/**
 * Sets up tab switch announcements for screen readers
 *
 * @param elements - Form elements
 * @param translations - Translation strings
 */
function setupTabAnnouncements(elements: AuthElements, translations: AuthTranslations): void {
  const announcer = document.getElementById("tabSwitchAnnouncer");

  if (!announcer) {
    return;
  }

  if (elements.loginTab) {
    elements.loginTab.addEventListener("click", () => {
      announcer.textContent = translations.loginFormActive;
    });
  }

  if (elements.registerTab) {
    elements.registerTab.addEventListener("click", () => {
      announcer.textContent = translations.registerFormActive;
    });
  }
}

/**
 * Sets up enhanced keyboard navigation with Escape key handling
 */
function setupKeyboardNavigation(): void {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      handleEscapeKeyPress(event);
    }
  });
}

/**
 * Handles Escape key press to dismiss messages
 *
 * @param event - Keyboard event
 */
function handleEscapeKeyPress(event: KeyboardEvent): void {
  const errorElement = document.getElementById("formError");
  const successElement = document.getElementById("formSuccess");
  const announcer = document.getElementById("tabSwitchAnnouncer");

  let messageCleared = false;

  if (errorElement && hasVisibleContent(errorElement)) {
    clearMessage(errorElement);
    announceMessageDismissal(announcer, "Error message dismissed");
    messageCleared = true;
  }

  if (successElement && hasVisibleContent(successElement)) {
    clearMessage(successElement);
    announceMessageDismissal(announcer, "Success message dismissed");
    messageCleared = true;
  }

  if (messageCleared) {
    event.preventDefault();
  }
}

/**
 * Checks if an element has visible content
 *
 * @param element - Element to check
 * @returns True if element has visible content
 */
function hasVisibleContent(element: HTMLElement): boolean {
  return element.textContent !== null && element.textContent.trim() !== "";
}

/**
 * Clears a message element
 *
 * @param element - Element to clear
 */
function clearMessage(element: HTMLElement): void {
  element.textContent = "";
  element.style.display = "none";
}

/**
 * Announces message dismissal to screen readers
 *
 * @param announcer - Announcer element
 * @param message - Message to announce
 */
function announceMessageDismissal(announcer: HTMLElement | null, message: string): void {
  if (announcer) {
    announcer.textContent = message;
  }
}

/**
 * Creates session timeout configuration
 *
 * @param currentLang - Current language code
 * @param translations - Translation function
 * @returns Session timeout configuration
 */
export function createSessionTimeoutConfig(
  currentLang: string,
  translations: (key: string) => string
): {
  sessionTimeout: number;
  warningTime: number;
  redirectUrl: string;
  translations: {
    title: string;
    message: string;
    extend: string;
    close: string;
  };
} {
  return {
    sessionTimeout: 20 * 60 * 1000, // 20 minutes
    warningTime: 2 * 60 * 1000, // 2 minutes warning
    redirectUrl: `/${currentLang}/auth/login?reason=session_expired`,
    translations: {
      title: translations("auth.session.timeout.title"),
      message: translations("auth.session.timeout.message"),
      extend: translations("auth.session.timeout.extend"),
      close: translations("auth.session.timeout.close"),
    },
  };
}
