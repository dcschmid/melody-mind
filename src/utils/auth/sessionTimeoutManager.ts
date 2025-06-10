/**
 * Session Timeout Manager Utility
 *
 * Provides centralized session timeout management for WCAG AAA compliance.
 * This utility handles session timeout warnings, extensions, and cleanup
 * across different components and pages.
 *
 * @file /src/utils/auth/sessionTimeoutManager.ts
 */

export interface SessionTimeoutConfig {
  warningTime: number; // Time in seconds before timeout to show warning
  totalTime: number; // Total session time in seconds
  enabled: boolean;
}

export interface SessionTimeoutCallbacks {
  onWarning?: (remainingSeconds: number) => void;
  onExtend?: () => void;
  onTimeout?: () => void;
}

/**
 * Default session timeout configuration for WCAG AAA compliance
 */
const DEFAULT_CONFIG: SessionTimeoutConfig = {
  warningTime: 120, // 2 minutes warning (WCAG AAA requirement)
  totalTime: 1200, // 20 minutes total session time
  enabled: typeof window !== "undefined" && window.location.hostname !== "localhost",
};

/**
 * Session Timeout Manager Class
 * Handles session timeout monitoring and user warnings
 */
export class SessionTimeoutManager {
  private config: SessionTimeoutConfig;
  private callbacks: SessionTimeoutCallbacks;
  private sessionWarningId: number | null = null;
  private sessionTimeoutId: number | null = null;
  private isActive: boolean = false;

  /**
   *
   */
  constructor(config: Partial<SessionTimeoutConfig> = {}, callbacks: SessionTimeoutCallbacks = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.callbacks = callbacks;
  }

  /**
   * Starts the session timeout monitoring
   */
  start(): void {
    if (!this.config.enabled || this.isActive) {
      return;
    }

    this.isActive = true;
    this.clearTimers();

    // Set warning timer (2 minutes before session expires)
    const warningTime = (this.config.totalTime - this.config.warningTime) * 1000;
    this.sessionWarningId = window.setTimeout(() => {
      this.showWarning(this.config.warningTime);

      // Set final warning at 30 seconds
      this.sessionTimeoutId = window.setTimeout(
        () => {
          this.showWarning(30);

          // Set final timeout
          this.sessionTimeoutId = window.setTimeout(() => {
            this.handleTimeout();
          }, 30 * 1000);
        },
        (this.config.warningTime - 30) * 1000
      );
    }, warningTime);
  }

  /**
   * Extends the session timeout
   */
  extend(): void {
    if (!this.config.enabled) {
      return;
    }

    this.clearTimers();
    this.start();

    if (this.callbacks.onExtend) {
      this.callbacks.onExtend();
    }

    this.announceExtension();
  }

  /**
   * Stops the session timeout monitoring
   */
  stop(): void {
    this.isActive = false;
    this.clearTimers();
  }

  /**
   * Shows a session timeout warning
   */
  private showWarning(remainingSeconds: number): void {
    if (this.callbacks.onWarning) {
      this.callbacks.onWarning(remainingSeconds);
    }

    this.announceWarning(remainingSeconds);
  }

  /**
   * Handles session timeout
   */
  private handleTimeout(): void {
    this.isActive = false;

    if (this.callbacks.onTimeout) {
      this.callbacks.onTimeout();
    }
  }

  /**
   * Announces session timeout warning to screen readers
   */
  private announceWarning(remainingSeconds: number): void {
    const warningMessage = `Your session will expire in ${remainingSeconds} seconds.`;
    this.announceToScreenReader(warningMessage, "assertive");
  }

  /**
   * Announces session extension to screen readers
   */
  private announceExtension(): void {
    const extensionMessage = "Session extended successfully";
    this.announceToScreenReader(extensionMessage, "polite");
  }

  /**
   * Announces messages to screen readers
   */
  private announceToScreenReader(
    message: string,
    priority: "polite" | "assertive" = "polite"
  ): void {
    let announcer = document.getElementById("session-timeout-announcer");
    if (!announcer) {
      announcer = document.createElement("div");
      announcer.id = "session-timeout-announcer";
      announcer.className = "sr-only";
      announcer.setAttribute("aria-live", priority);
      announcer.setAttribute("aria-atomic", "true");
      announcer.setAttribute("role", priority === "assertive" ? "alert" : "status");
      document.body.appendChild(announcer);
    } else {
      // Update aria-live priority if needed
      announcer.setAttribute("aria-live", priority);
      announcer.setAttribute("role", priority === "assertive" ? "alert" : "status");
    }

    announcer.textContent = message;
  }

  /**
   * Clears all active timers
   */
  private clearTimers(): void {
    if (this.sessionWarningId) {
      clearTimeout(this.sessionWarningId);
      this.sessionWarningId = null;
    }
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
      this.sessionTimeoutId = null;
    }
  }

  /**
   * Cleanup method to be called on component unmount
   */
  cleanup(): void {
    this.stop();
  }
}

/**
 * Global session timeout manager instance
 * Can be shared across components
 */
let globalSessionManager: SessionTimeoutManager | null = null;

/**
 * Gets or creates the global session timeout manager
 */
export function getGlobalSessionManager(
  config?: Partial<SessionTimeoutConfig>,
  callbacks?: SessionTimeoutCallbacks
): SessionTimeoutManager {
  if (!globalSessionManager) {
    globalSessionManager = new SessionTimeoutManager(config, callbacks);
  }
  return globalSessionManager;
}

/**
 * Destroys the global session timeout manager
 */
export function destroyGlobalSessionManager(): void {
  if (globalSessionManager) {
    globalSessionManager.cleanup();
    globalSessionManager = null;
  }
}
