/**
 * Message Display Utilities for MelodyMind Components
 *
 * Provides consistent message display functionality across auth components
 * with proper accessibility support and CSS variable integration.
 *
 * @author MelodyMind Team
 * @since 2025-05-30
 */

/**
 * Message types supported by the display system
 */
export type MessageType = "error" | "success" | "warning" | "info";

/**
 * Configuration for displaying a message
 */
export interface MessageConfig {
  /** The message text to display */
  message: string;
  /** Type of message for styling */
  type: MessageType;
  /** Time in milliseconds before auto-hiding (0 = no auto-hide) */
  autoHideAfter?: number;
  /** Whether to announce the message to screen readers */
  announceToScreenReader?: boolean;
}

/**
 * Display a message in a specified container element
 *
 * @param {string} containerId - ID of the container element to display the message in
 * @param {MessageConfig} config - Message configuration
 *
 * @example
 * ```typescript
 * showMessage('formError', {
 *   message: 'Invalid credentials',
 *   type: 'error',
 *   autoHideAfter: 5000
 * });
 * ```
 */
export function showMessage(containerId: string, config: MessageConfig): void {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Message container with ID '${containerId}' not found`);
    return;
  }

  // Clear any existing auto-hide timeout
  const existingTimeoutId = container.dataset.autoHideTimeout;
  if (existingTimeoutId) {
    clearTimeout(parseInt(existingTimeoutId, 10));
    delete container.dataset.autoHideTimeout;
  }

  // Set message content and show container
  container.textContent = config.message;
  container.style.display = "block";

  // Update CSS classes for proper styling
  container.className = container.className
    .replace(/auth-form__message--(error|success|warning|info)/g, "")
    .trim();
  container.classList.add(`auth-form__message--${config.type}`);

  // Announce to screen readers if requested
  if (config.announceToScreenReader !== false) {
    announceMessageToScreenReader(config.message);
  }

  // Set up auto-hide if specified
  if (config.autoHideAfter && config.autoHideAfter > 0) {
    const timeoutId = setTimeout(() => {
      hideMessage(containerId);
    }, config.autoHideAfter);

    container.dataset.autoHideTimeout = timeoutId.toString();
  }
}

/**
 * Hide a message in the specified container
 *
 * @param {string} containerId - ID of the container element to hide
 */
export function hideMessage(containerId: string): void {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  // Clear any existing auto-hide timeout
  const existingTimeoutId = container.dataset.autoHideTimeout;
  if (existingTimeoutId) {
    clearTimeout(parseInt(existingTimeoutId, 10));
    delete container.dataset.autoHideTimeout;
  }

  // Hide container and clear content
  container.style.display = "none";
  container.textContent = "";
}

/**
 * Clear all messages in specified containers
 *
 * @param {string[]} containerIds - Array of container IDs to clear
 */
export function clearAllMessages(containerIds: string[]): void {
  containerIds.forEach((containerId) => hideMessage(containerId));
}

/**
 * Announce a message to screen readers using a live region
 *
 * @param {string} message - Message to announce
 */
function announceMessageToScreenReader(message: string): void {
  // Create a temporary live region for screen reader announcements
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "assertive");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after screen reader has processed the announcement
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}

/**
 * Show an error message with default settings
 *
 * @param {string} containerId - Container ID
 * @param {string} message - Error message
 * @param {number} autoHideAfter - Auto-hide timeout (default: 5000ms)
 */
export function showError(containerId: string, message: string, autoHideAfter = 5000): void {
  showMessage(containerId, {
    message,
    type: "error",
    autoHideAfter,
  });
}

/**
 * Show a success message with default settings
 *
 * @param {string} containerId - Container ID
 * @param {string} message - Success message
 * @param {number} autoHideAfter - Auto-hide timeout (default: 3000ms)
 */
export function showSuccess(containerId: string, message: string, autoHideAfter = 3000): void {
  showMessage(containerId, {
    message,
    type: "success",
    autoHideAfter,
  });
}
