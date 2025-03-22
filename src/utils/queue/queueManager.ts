/**
 * Queue Management System
 * 
 * A persistent queue system for handling deferred data saving operations,
 * particularly useful for offline scenarios. This module implements retry logic,
 * background processing, and handles failed save attempts gracefully.
 * 
 * Features:
 * - Offline-first approach with automatic retry
 * - Local storage persistence to survive page reloads
 * - Configurable retry strategy with exponential backoff
 * - Cleanup and resource management
 * 
 * @module queueManager
 */

/**
 * Represents a queue item with all necessary metadata for processing and retry
 * 
 * @interface QueueItem
 */
interface QueueItem {
  /** Unique identifier for the queue item */
  id: string;
  
  /** Type of data being saved */
  type: "score" | "goldenLP";
  
  /** The payload to be saved to the server */
  data: any;
  
  /** Number of failed attempts to save this item */
  retryCount: number;
  
  /** Timestamp of the last save attempt */
  lastAttempt: number;
}

/**
 * Options for configuring queue behavior
 * 
 * @interface QueueOptions
 */
interface QueueOptions {
  /** Maximum number of retry attempts before giving up */
  maxRetries?: number;
  
  /** Base delay between retry attempts in milliseconds */
  retryDelay?: number;
  
  /** Storage key used for persisting the queue */
  storageKey?: string;
}

/**
 * Manages a persistent queue for saving game data with built-in retry logic
 * for handling offline scenarios and network failures.
 * 
 * @class QueueManager
 */
export class QueueManager {
  /** Storage key for the queue in localStorage */
  private static readonly STORAGE_KEY = "game_save_queue";
  
  /** Maximum number of retry attempts before abandoning a save operation */
  private static readonly MAX_RETRIES = 3;
  
  /** Delay between retry attempts in milliseconds (increases with each retry) */
  private static readonly RETRY_DELAY = 5000;
  
  /** Flag indicating if queue processing is active */
  private static isProcessing = false;
  
  /** Timer reference for periodic queue processing */
  private static _interval: NodeJS.Timeout | undefined;

  /**
   * Adds a new item to the saving queue and starts queue processing
   * 
   * This method is the primary entry point for adding data to be saved.
   * It creates a queue item with appropriate metadata and triggers processing.
   * 
   * @param {string} type - Type of the queue item ("score" or "goldenLP")
   * @param {any} data - Data to be saved to the server
   * @returns {Promise<void>} A promise that resolves when the item is added to the queue
   */
  static async addToQueue(
    type: "score" | "goldenLP",
    data: any,
  ): Promise<void> {
    try {
      const queue = this.getQueue();
      
      // Create a new queue item with a unique ID
      const item: QueueItem = {
        id: crypto.randomUUID(),
        type,
        data,
        retryCount: 0,
        lastAttempt: Date.now(),
      };

      // Add to queue and save to persistent storage
      queue.push(item);
      this.saveQueue(queue);
      
      // Start processing the queue
      await this.processQueue();
      
      console.debug(`Added item to ${type} save queue with ID: ${item.id}`);
    } catch (error) {
      console.error("Error adding item to queue:", error);
      // We don't rethrow here as we want addToQueue to be resilient
      // The item will be retried on next queue processing cycle
    }
  }

  /**
   * Processes all items in the queue with retry logic
   * 
   * This method attempts to save each item in the queue, handling
   * retries for failed items and removing successfully processed ones.
   * 
   * @returns {Promise<void>} A promise that resolves when queue processing completes
   */
  static async processQueue(): Promise<void> {
    // Prevent concurrent processing of the queue
    if (this.isProcessing) return;

    try {
      this.isProcessing = true;
      const queue = this.getQueue();
      
      if (queue.length === 0) {
        return;
      }

      console.debug(`Processing queue with ${queue.length} items`);

      // Process each item in the queue
      for (const item of queue) {
        // Skip items that have exceeded max retry attempts
        if (item.retryCount >= this.MAX_RETRIES) {
          console.warn(`Item ${item.id} exceeded max retries and will be removed`);
          this.removeFromQueue(item.id);
          continue;
        }

        // Apply exponential backoff for retries
        const backoffDelay = this.RETRY_DELAY * Math.pow(1.5, item.retryCount);
        if (Date.now() - item.lastAttempt < backoffDelay) {
          continue; // Not enough time has passed since last attempt
        }

        try {
          // Process based on item type
          if (item.type === "score") {
            await this.saveScore(item.data);
          } else if (item.type === "goldenLP") {
            await this.saveGoldenLP(item.data);
          }

          // If save succeeds, remove from queue
          console.debug(`Successfully processed item ${item.id}`);
          this.removeFromQueue(item.id);
        } catch (error) {
          // Update retry count and last attempt time
          item.retryCount++;
          item.lastAttempt = Date.now();
          this.saveQueue(queue);

          console.warn(
            `Error saving data (attempt ${item.retryCount}):`,
            error,
          );
        }
      }
    } catch (error) {
      console.error("Error processing queue:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Saves score data to the backend API
   * 
   * @param {any} data - Score data to be saved
   * @throws {Error} If the save operation fails
   * @returns {Promise<void>}
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
          `Error saving score: ${response.status} - ${errorText}`,
        );
      }
    } catch (error) {
      console.error("[QueueManager] Score save error:", error);
      throw error; // Rethrow to trigger retry mechanism
    }
  }

  /**
   * Saves golden LP achievement data to the backend API
   * 
   * @param {any} data - Golden LP data to be saved
   * @throws {Error} If the save operation fails
   * @returns {Promise<void>}
   * @private
   */
  private static async saveGoldenLP(data: any): Promise<void> {
    try {
      const response = await fetch("/api/saveUserGoldenLP", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error saving golden LP: ${response.status} - ${errorText}`
        );
      }
    } catch (error) {
      console.error("[QueueManager] Golden LP save error:", error);
      throw error; // Rethrow to trigger retry mechanism
    }
  }

  /**
   * Retrieves the current queue from local storage
   * 
   * @returns {QueueItem[]} Array of queue items
   * @private
   */
  private static getQueue(): QueueItem[] {
    try {
      const queueData = localStorage.getItem(this.STORAGE_KEY);
      return queueData ? JSON.parse(queueData) : [];
    } catch (error) {
      console.error("Error retrieving queue from storage:", error);
      return [];
    }
  }

  /**
   * Saves the current queue to local storage for persistence
   * 
   * @param {QueueItem[]} queue - Array of queue items to save
   * @private
   */
  private static saveQueue(queue: QueueItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error("Error saving queue to storage:", error);
    }
  }

  /**
   * Removes an item from the queue by its ID
   * 
   * @param {string} id - ID of the item to remove
   * @private
   */
  private static removeFromQueue(id: string): void {
    try {
      const queue = this.getQueue();
      const newQueue = queue.filter((item) => item.id !== id);
      this.saveQueue(newQueue);
    } catch (error) {
      console.error(`Error removing item ${id} from queue:`, error);
    }
  }

  /**
   * Checks if there are any unsaved items in the queue
   * 
   * Useful for warning users before they leave the page if data might be lost.
   * 
   * @returns {boolean} True if there are unsaved items, false otherwise
   */
  static hasUnsavedData(): boolean {
    return this.getQueue().length > 0;
  }

  /**
   * Starts background processing of the queue at regular intervals
   * 
   * This ensures that any queued items will be attempted periodically,
   * which is especially useful when coming back online after being offline.
   */
  static startProcessing(): void {
    // Clear any existing interval to prevent duplicates
    if (this._interval) {
      clearInterval(this._interval);
    }
    
    // Set up periodic processing
    this._interval = setInterval(() => this.processQueue(), this.RETRY_DELAY);
    
    // Process once immediately
    this.processQueue().catch(error => 
      console.error("Error during initial queue processing:", error)
    );
  }

  /**
   * Stops background processing of the queue
   * 
   * Call this when cleaning up to prevent memory leaks.
   */
  static stopProcessing(): void {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    }
  }
  
  /**
   * Clears all items from the queue
   * 
   * This is useful for testing or when a user logs out.
   * 
   * @returns {number} The number of items that were cleared
   */
  static clearQueue(): number {
    try {
      const queue = this.getQueue();
      const count = queue.length;
      localStorage.removeItem(this.STORAGE_KEY);
      return count;
    } catch (error) {
      console.error("Error clearing queue:", error);
      return 0;
    }
  }
}
