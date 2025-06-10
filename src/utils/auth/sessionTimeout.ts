/**
 * Session Timeout Management Utility
 *
 * Implements WCAG 2.2 SC 2.2.6 Timeouts (AAA) requirements for accessibility.
 * Provides consistent session timeout warnings and user control across the application.
 *
 * Key Features:
 * - WCAG 2.2 AAA compliant timeout warnings
 * - User can extend session before expiration
 * - Activity detection to reset timers
 * - Keyboard accessible warning dialogs
 * - Multi-language support
 *
 * @fileoverview Session timeout utilities for accessibility compliance
 * @version 1.0.0
 * @since 2025-05-30
 */

/**
 * Configuration for session timeout management
 */
export interface SessionTimeoutConfig {
  /** Total session duration in milliseconds (default: 20 minutes) */
  sessionTimeout?: number;
  /** Warning time before session expires in milliseconds (default: 2 minutes) */
  warningTime?: number;
  /** Redirect URL when session expires */
  redirectUrl?: string;
  /** Translation keys for timeout messages */
  translations: {
    title: string;
    message: string;
    extend: string;
    close: string;
  };
}

/**
 * Extended HTMLElement interface for cleanup functionality
 */
interface ExtendedHTMLElement extends HTMLElement {
  _cleanup?: () => void;
}

/**
 * Session timeout manager interface
 */
export interface SessionTimeoutManager {
  /** Initialize the session timeout system */
  initialize(): void;
  /** Reset timers when user activity is detected */
  resetTimers(): void;
  /** Manually extend the session */
  extendSession(): void;
  /** Destroy the timeout manager and clean up resources */
  destroy(): void;
}

/**
 * Creates a session timeout manager instance
 *
 * @param {SessionTimeoutConfig} config - Configuration options for session timeout
 * @returns {SessionTimeoutManager} Session timeout manager with methods to control timeout behavior
 */
export function createSessionTimeoutManager(config: SessionTimeoutConfig): SessionTimeoutManager {
  // Default configuration values
  const sessionTimeoutDuration = config.sessionTimeout ?? 20 * 60 * 1000; // 20 minutes
  const warningTimeDuration = config.warningTime ?? 2 * 60 * 1000; // 2 minutes
  const { redirectUrl, translations } = config;

  let timeoutWarningTimer: number | null = null;
  let sessionTimeoutTimer: number | null = null;
  let warningElement: ExtendedHTMLElement | null = null;
  let lastActivity = Date.now();
  let isDestroyed = false;

  // Activity events to monitor for user interaction
  const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];

  /**
   * Handle user activity to reset session timers
   */
  function onActivity(): void {
    if (isDestroyed) {
      return;
    }

    const now = Date.now();
    // Only reset if more than 1 minute since last activity to avoid excessive timer resets
    if (now - lastActivity > 60000) {
      lastActivity = now;
      resetTimers();
    }
  }

  /**
   * Create the timeout warning dialog element
   */
  function createTimeoutWarning(): ExtendedHTMLElement {
    if (warningElement) {
      return warningElement;
    }

    warningElement = document.createElement("div") as ExtendedHTMLElement;
    warningElement.id = "sessionTimeoutWarning";
    warningElement.className = "session-timeout-warning";
    warningElement.setAttribute("role", "alert");
    warningElement.setAttribute("aria-live", "assertive");
    warningElement.setAttribute("aria-atomic", "true");
    warningElement.setAttribute("tabindex", "-1");

    warningElement.innerHTML = `
      <div class="session-timeout-warning__overlay">
        <div class="session-timeout-warning__content">
          <h3 class="session-timeout-warning__title">${translations.title}</h3>
          <p class="session-timeout-warning__message">${translations.message}</p>
          <div class="session-timeout-warning__actions">
            <button type="button" id="extendSessionBtn" class="session-timeout-warning__btn session-timeout-warning__btn--primary">
              ${translations.extend}
            </button>
            <button type="button" id="closeWarningBtn" class="session-timeout-warning__btn session-timeout-warning__btn--secondary">
              ${translations.close}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(warningElement);

    // Add event listeners
    const extendBtn = document.getElementById("extendSessionBtn");
    const closeBtn = document.getElementById("closeWarningBtn");

    if (extendBtn) {
      extendBtn.addEventListener("click", extendSession);
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", hideTimeoutWarning);
    }

    // Handle Escape key
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (
        event.key === "Escape" &&
        warningElement?.classList.contains("session-timeout-warning--visible")
      ) {
        hideTimeoutWarning();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Store cleanup function on the element
    warningElement._cleanup = (): void => {
      document.removeEventListener("keydown", handleKeyDown);
    };

    return warningElement;
  }

  /**
   * Show the session timeout warning dialog
   */
  function showTimeoutWarning(): void {
    if (isDestroyed) {
      return;
    }

    const warning = createTimeoutWarning();
    warning.classList.add("session-timeout-warning--visible");

    // Focus the extend button for keyboard accessibility
    setTimeout(() => {
      const extendBtn = document.getElementById("extendSessionBtn");
      if (extendBtn) {
        extendBtn.focus();
      }
    }, 100);
  }

  /**
   * Hide the session timeout warning dialog
   */
  function hideTimeoutWarning(): void {
    if (warningElement) {
      warningElement.classList.remove("session-timeout-warning--visible");
    }
  }

  /**
   * Extend the session and reset timers
   */
  function extendSession(): void {
    hideTimeoutWarning();
    resetTimers();
  }

  /**
   * Handle session expiration
   */
  function handleSessionExpired(): void {
    if (isDestroyed) {
      return;
    }

    // Clean up warning dialog
    hideTimeoutWarning();

    // Redirect to login or configured URL
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      // Default redirect to login with session expired reason
      const lang = document.documentElement.lang || "en";
      window.location.href = `/${lang}/auth/login?reason=session_expired`;
    }
  }

  /**
   * Reset session timers
   */
  function resetTimers(): void {
    if (isDestroyed) {
      return;
    }

    // Clear existing timers
    if (timeoutWarningTimer) {
      clearTimeout(timeoutWarningTimer);
    }
    if (sessionTimeoutTimer) {
      clearTimeout(sessionTimeoutTimer);
    }

    // Set new timers
    timeoutWarningTimer = window.setTimeout(() => {
      showTimeoutWarning();
    }, sessionTimeoutDuration - warningTimeDuration);

    sessionTimeoutTimer = window.setTimeout(() => {
      handleSessionExpired();
    }, sessionTimeoutDuration);
  }

  /**
   * Initialize the session timeout system
   */
  function initialize(): void {
    if (isDestroyed) {
      return;
    }

    // Add activity listeners
    activityEvents.forEach((event) => {
      document.addEventListener(event, onActivity, { passive: true });
    });

    // Initialize timers
    resetTimers();
  }

  /**
   * Destroy the timeout manager and clean up resources
   */
  function destroy(): void {
    isDestroyed = true;

    // Clear timers
    if (timeoutWarningTimer) {
      clearTimeout(timeoutWarningTimer);
      timeoutWarningTimer = null;
    }
    if (sessionTimeoutTimer) {
      clearTimeout(sessionTimeoutTimer);
      sessionTimeoutTimer = null;
    }

    // Remove activity listeners
    activityEvents.forEach((event) => {
      document.removeEventListener(event, onActivity);
    });

    // Clean up warning element
    if (warningElement) {
      // Call cleanup function if it exists
      if (warningElement._cleanup) {
        warningElement._cleanup();
      }

      if (warningElement.parentNode) {
        warningElement.parentNode.removeChild(warningElement);
      }
      warningElement = null;
    }
  }

  // Return the manager interface
  return {
    initialize,
    resetTimers,
    extendSession,
    destroy,
  };
}

/**
 * CSS styles for session timeout warning dialog
 * Should be included in global styles or component styles
 */
export const sessionTimeoutStyles = `
  .session-timeout-warning {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    display: none;
    background: transparent;
    pointer-events: none;
  }

  .session-timeout-warning--visible {
    display: block;
    pointer-events: all;
  }

  .session-timeout-warning__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-md, 1rem);
  }

  .session-timeout-warning__content {
    background: var(--bg-primary, #ffffff);
    color: var(--text-primary, #1a1a1a);
    border-radius: var(--border-radius-md, 8px);
    padding: var(--spacing-xl, 2rem);
    max-width: 500px;
    width: 100%;
    box-shadow: var(--shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.2));
    border: var(--border-width, 1px) solid var(--border-color, #e2e8f0);
  }

  .session-timeout-warning__title {
    margin: 0 0 var(--spacing-md, 1rem) 0;
    font-size: var(--text-xl, 1.25rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--text-error, #dc2626);
  }

  .session-timeout-warning__message {
    margin: 0 0 var(--spacing-lg, 1.5rem) 0;
    font-size: var(--text-base, 1rem);
    line-height: var(--line-height-relaxed, 1.6);
  }

  .session-timeout-warning__actions {
    display: flex;
    gap: var(--spacing-md, 1rem);
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .session-timeout-warning__btn {
    padding: var(--spacing-sm, 0.75rem) var(--spacing-lg, 1.5rem);
    border-radius: var(--border-radius, 6px);
    border: var(--border-width, 1px) solid transparent;
    font-size: var(--text-base, 1rem);
    font-weight: var(--font-weight-medium, 500);
    cursor: pointer;
    transition: all var(--transition-fast, 0.15s) ease;
    min-height: 44px;
    min-width: 44px;
  }

  .session-timeout-warning__btn--primary {
    background-color: var(--bg-primary-button, #7c3aed);
    color: var(--text-primary-button, #ffffff);
    border-color: var(--bg-primary-button, #7c3aed);
  }

  .session-timeout-warning__btn--primary:hover {
    background-color: var(--bg-primary-button-hover, #6d28d9);
    border-color: var(--bg-primary-button-hover, #6d28d9);
  }

  .session-timeout-warning__btn--primary:focus {
    outline: 2px solid var(--focus-color, #7c3aed);
    outline-offset: 2px;
    box-shadow: var(--focus-enhanced-shadow, 0 0 0 3px rgba(124, 58, 237, 0.2));
  }

  .session-timeout-warning__btn--secondary {
    background-color: var(--bg-secondary, #f8fafc);
    color: var(--text-secondary, #64748b);
    border-color: var(--border-color, #e2e8f0);
  }

  .session-timeout-warning__btn--secondary:hover {
    background-color: var(--bg-secondary-hover, #f1f5f9);
    color: var(--text-secondary-hover, #475569);
  }

  .session-timeout-warning__btn--secondary:focus {
    outline: 2px solid var(--focus-color, #7c3aed);
    outline-offset: 2px;
    box-shadow: var(--focus-enhanced-shadow, 0 0 0 3px rgba(124, 58, 237, 0.2));
  }

  /* Responsive design */
  @media (max-width: 640px) {
    .session-timeout-warning__content {
      padding: var(--spacing-lg, 1.5rem);
      margin: var(--spacing-md, 1rem);
    }
    
    .session-timeout-warning__actions {
      flex-direction: column;
    }
    
    .session-timeout-warning__btn {
      width: 100%;
      justify-content: center;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .session-timeout-warning__content {
      border: 2px solid var(--border-color, #000000);
    }
    
    .session-timeout-warning__btn {
      border-width: 2px;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .session-timeout-warning__btn {
      transition: none;
    }
  }
`;
