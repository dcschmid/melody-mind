interface QueueItem {
  id: string;
  type: "score" | "goldenLP";
  data: any;
  retryCount: number;
  lastAttempt: number;
}

export class QueueManager {
  private static readonly STORAGE_KEY = "game_save_queue";
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 5000; // 5 Sekunden

  /**
   * Fügt ein Element zur Queue hinzu
   */
  static async addToQueue(
    type: "score" | "goldenLP",
    data: any,
  ): Promise<void> {
    const queue = this.getQueue();
    const item: QueueItem = {
      id: crypto.randomUUID(),
      type,
      data,
      retryCount: 0,
      lastAttempt: Date.now(),
    };

    queue.push(item);
    this.saveQueue(queue);
    await this.processQueue();
  }

  /**
   * Verarbeitet die Queue
   */
  static async processQueue(): Promise<void> {
    const queue = this.getQueue();
    if (queue.length === 0) return;

    for (const item of queue) {
      if (item.retryCount >= this.MAX_RETRIES) {
        // Element nach zu vielen Versuchen entfernen
        this.removeFromQueue(item.id);
        continue;
      }

      // Prüfe, ob genug Zeit seit dem letzten Versuch vergangen ist
      if (Date.now() - item.lastAttempt < this.RETRY_DELAY) {
        continue;
      }

      try {
        if (item.type === "score") {
          await this.saveScore(item.data);
        } else if (item.type === "goldenLP") {
          await this.saveGoldenLP(item.data);
        }

        // Bei Erfolg aus der Queue entfernen
        this.removeFromQueue(item.id);
      } catch (error) {
        // Retry-Counter erhöhen und Zeitstempel aktualisieren
        item.retryCount++;
        item.lastAttempt = Date.now();
        this.saveQueue(queue);

        console.error(
          `Fehler beim Speichern (Versuch ${item.retryCount}):`,
          error,
        );
      }
    }
  }

  /**
   * Speichert einen Score
   */
  private static async saveScore(data: any): Promise<void> {
    const response = await fetch("/api/saveTotalUserPointsAndHighscore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Fehler beim Speichern des Scores");
    }
  }

  /**
   * Speichert eine goldene LP
   */
  private static async saveGoldenLP(data: any): Promise<void> {
    const response = await fetch("/api/saveUserGoldenLP", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Fehler beim Speichern der goldenen LP");
    }
  }

  /**
   * Holt die aktuelle Queue aus dem Storage
   */
  private static getQueue(): QueueItem[] {
    try {
      const queueData = localStorage.getItem(this.STORAGE_KEY);
      return queueData ? JSON.parse(queueData) : [];
    } catch {
      return [];
    }
  }

  /**
   * Speichert die Queue im Storage
   */
  private static saveQueue(queue: QueueItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error("Fehler beim Speichern der Queue:", error);
    }
  }

  /**
   * Entfernt ein Element aus der Queue
   */
  private static removeFromQueue(id: string): void {
    const queue = this.getQueue();
    const newQueue = queue.filter((item) => item.id !== id);
    this.saveQueue(newQueue);
  }

  /**
   * Prüft ob es ungespeicherte Daten gibt
   */
  static hasUnsavedData(): boolean {
    return this.getQueue().length > 0;
  }

  /**
   * Startet die Verarbeitung der Queue
   */
  static startProcessing(): void {
    // Regelmäßig die Queue überprüfen und verarbeiten
    setInterval(() => this.processQueue(), this.RETRY_DELAY);
  }
}
