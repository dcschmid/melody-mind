/**
 * Interface representing a queue item
 * @interface QueueItem
 */
interface QueueItem {
  id: string;
  type: "score" | "goldenLP";
  data: any;
  retryCount: number;
  lastAttempt: number;
}

/**
 * Manages a persistent queue for saving game data
 * Implements retry logic and handles failed save attempts
 * @class QueueManager
 */
export class QueueManager {
  private static readonly STORAGE_KEY = "game_save_queue";
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 5000;
  private static isProcessing = false;
  private static _interval: NodeJS.Timeout | undefined;

  /**
   * Adds a new item to the queue and starts processing
   * @param type - Type of the queue item ("score" or "goldenLP")
   * @param data - Data to be saved (ScoreData or GoldenLPData)
   * @returns Promise<void>
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
   * Processes all items in the queue
   * Implements retry logic and removes successfully processed items
   * @returns Promise<void>
   */
  static async processQueue(): Promise<void> {
    if (this.isProcessing) return;

    try {
      this.isProcessing = true;
      const queue = this.getQueue();
      if (queue.length === 0) return;

      for (const item of queue) {
        if (item.retryCount >= this.MAX_RETRIES) {
          this.removeFromQueue(item.id);
          continue;
        }

        if (Date.now() - item.lastAttempt < this.RETRY_DELAY) {
          continue;
        }

        try {
          if (item.type === "score") {
            await this.saveScore(item.data);
          } else if (item.type === "goldenLP") {
            await this.saveGoldenLP(item.data);
          }

          this.removeFromQueue(item.id);
        } catch (error) {
          item.retryCount++;
          item.lastAttempt = Date.now();
          this.saveQueue(queue);

          console.error(
            `Fehler beim Speichern (Versuch ${item.retryCount}):`,
            error,
          );
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Saves score data to the backend
   * @param data - Score data to be saved
   * @throws Error if the save operation fails
   * @returns Promise<void>
   * @private
   */
  private static async saveScore(data: any): Promise<void> {
    try {
      const response = await fetch("/api/saveTotalUserPointsAndHighscore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Fehler beim Speichern des Scores: ${response.status} - ${errorText}`,
        );
      }
    } catch (error) {
      console.error("[QueueManager] Score-Speicherfehler:", error);
      throw error;
    }
  }

  /**
   * Saves golden LP data to the backend
   * @param data - Golden LP data to be saved
   * @throws Error if the save operation fails
   * @returns Promise<void>
   * @private
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
   * Retrieves the current queue from local storage
   * @returns Array of QueueItems
   * @private
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
   * Saves the current queue to local storage
   * @param queue - Array of queue items to save
   * @private
   */
  private static saveQueue(queue: QueueItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error("Fehler beim Speichern der Queue:", error);
    }
  }

  /**
   * Removes an item from the queue by its ID
   * @param id - ID of the item to remove
   * @private
   */
  private static removeFromQueue(id: string): void {
    const queue = this.getQueue();
    const newQueue = queue.filter((item) => item.id !== id);
    this.saveQueue(newQueue);
  }

  /**
   * Checks if there are any unsaved items in the queue
   */
  static hasUnsavedData(): boolean {
    return this.getQueue().length > 0;
  }

  /**
   * Starts processing the queue
   */
  static startProcessing(): void {
    if (this._interval) {
      clearInterval(this._interval);
    }
    this._interval = setInterval(() => this.processQueue(), this.RETRY_DELAY);

    this.processQueue().catch(console.error);
  }

  static stopProcessing(): void {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    }
  }
}
