import { QueueManager } from "../queue/queueManager";

/** Interface defining options for error display configuration */
export interface ErrorOptions {
  duration?: number;
  autoHide?: boolean;
}

/** Collection of error messages used throughout the application */
const ERROR_MESSAGES = {
  DEFAULT: "Ein Fehler ist aufgetreten",
  NETWORK: "Bitte überprüfe deine Internetverbindung",
  TIMEOUT: "Die Anfrage hat zu lange gedauert. Bitte versuche es erneut",
  SAVE_GOLDEN_LP: "Fehler beim Speichern der Auszeichnung",
  SAVE_SCORE: "Fehler beim Speichern des Spielstands",
  OFFLINE_SYNC:
    "Deine Daten werden im Hintergrund gespeichert und automatisch synchronisiert, sobald die Verbindung wiederhergestellt ist.",
} satisfies Record<string, string>;

/** Default configuration for error display behavior */
const DEFAULT_ERROR_OPTIONS: Required<ErrorOptions> = {
  duration: 5000,
  autoHide: true,
};

/**
 * Handles application-wide error display and management
 */
export class ErrorHandler {
  /** Reference to the error message DOM element */
  private static errorElement: HTMLElement | null = null;
  /** ID of the current auto-hide timeout */
  private static timeoutId: number | null = null;

  /**
   * Initializes the error handler and sets up DOM event listeners
   */
  static initialize(): void {
    this.errorElement = document.querySelector(".errorMessage");

    // Event-Listener für den Close-Button
    const closeButton = this.errorElement?.querySelector(".closeButton");
    closeButton?.addEventListener("click", () => this.hideError());
  }

  /**
   * Displays an error message to the user
   * @param message - The error message to display
   * @param options - Configuration options for the error display
   */
  static showError(
    message: string,
    options: ErrorOptions = DEFAULT_ERROR_OPTIONS,
  ): void {
    if (!this.errorElement) return;

    const errorText = this.errorElement.querySelector(".errorText");
    if (errorText) {
      errorText.textContent = message;
    }

    this.errorElement.classList.remove("hidden");

    // Automatisches Ausblenden
    if (options.autoHide && options.duration) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = window.setTimeout(() => {
        this.hideError();
      }, options.duration);
    }

    // Verbesserte Zugänglichkeit
    this.errorElement.setAttribute("role", "alert");
    this.errorElement.setAttribute("aria-live", "assertive");
    this.errorElement.setAttribute("tabindex", "-1");
    this.errorElement.focus();
  }

  /**
   * Hides the currently displayed error message
   */
  static hideError(): void {
    if (!this.errorElement) return;

    this.errorElement.classList.add("hidden");
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Handles API errors by mapping them to user-friendly messages
   * @param error - The error object from the API
   */
  static handleApiError(error: Error): void {
    let message = ERROR_MESSAGES.DEFAULT;

    if (error.message.includes("network")) {
      message = ERROR_MESSAGES.NETWORK;
    } else if (error.message.includes("timeout")) {
      message = ERROR_MESSAGES.TIMEOUT;
    } else if (error.message.includes("saveUserGoldenLP")) {
      message = ERROR_MESSAGES.SAVE_GOLDEN_LP;
    } else if (error.message.includes("saveTotalUserPointsAndHighscore")) {
      message = ERROR_MESSAGES.SAVE_SCORE;
    }

    this.showError(message);
  }

  /**
   * Handles save errors during offline scenarios
   * @param _error - The original error object
   * @param type - The type of data being saved
   * @param data - The data that failed to save
   */
  static async handleSaveError(
    _error: Error,
    type: "score" | "goldenLP",
    data: unknown,
  ): Promise<void> {
    await QueueManager.addToQueue(type, data);
    this.showError(ERROR_MESSAGES.OFFLINE_SYNC, {
      autoHide: true,
      duration: 8000,
    });
  }
}
