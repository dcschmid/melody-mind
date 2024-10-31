import { QueueManager } from "../queue/queueManager";

export interface ErrorOptions {
  duration?: number;
  autoHide?: boolean;
}

export class ErrorHandler {
  private static errorElement: HTMLElement | null = null;
  private static timeoutId: number | null = null;

  static initialize(): void {
    this.errorElement = document.querySelector(".errorMessage");

    // Event-Listener für den Close-Button
    const closeButton = this.errorElement?.querySelector(".closeButton");
    closeButton?.addEventListener("click", () => this.hideError());
  }

  static showError(
    message: string,
    options: ErrorOptions = { duration: 5000, autoHide: true },
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

    // Zugänglichkeit: Fokus auf die Fehlermeldung setzen
    this.errorElement.setAttribute("tabindex", "-1");
    this.errorElement.focus();
  }

  static hideError(): void {
    if (!this.errorElement) return;

    this.errorElement.classList.add("hidden");
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  static handleApiError(error: Error): void {
    let message = "Ein Fehler ist aufgetreten";

    // Spezifische Fehlermeldungen
    if (error.message.includes("network")) {
      message = "Bitte überprüfe deine Internetverbindung";
    } else if (error.message.includes("timeout")) {
      message = "Die Anfrage hat zu lange gedauert. Bitte versuche es erneut";
    } else if (error.message.includes("saveUserGoldenLP")) {
      message = "Fehler beim Speichern der Auszeichnung";
    } else if (error.message.includes("saveTotalUserPointsAndHighscore")) {
      message = "Fehler beim Speichern des Spielstands";
    }

    this.showError(message);
  }

  static async handleSaveError(
    error: Error,
    type: "score" | "goldenLP",
    data: any,
  ): Promise<void> {
    // Füge die Daten zur Queue hinzu
    await QueueManager.addToQueue(type, data);

    // Zeige eine informative Nachricht
    this.showError(
      "Deine Daten werden im Hintergrund gespeichert und automatisch synchronisiert, " +
        "sobald die Verbindung wiederhergestellt ist.",
      { autoHide: true, duration: 8000 },
    );
  }
}
