import { handleAudioError } from "../error/errorHandlingUtils";

/**
 * Audio Control System
 *
 * This module provides comprehensive audio management for the music quiz game.
 * It handles audio playback, volume control, error handling, and cleanup operations
 * through a standardized interface that ensures consistent behavior across the application.
 *
 * - Promise-based audio operations for proper async flow control
 * - Thorough error handling with informative messages
 * - Memory management with proper cleanup to prevent audio resource leaks
 * - Support for accessibility requirements including volume control
 * - Singleton pattern for consistent audio state management
 *
 * @module audioControls
 */

/**
 * Interface defining the audio control operations available throughout the application
 *
 * @interface AudioControl
 */
export interface AudioControl {
  /**
   * Stops the current audio playback and resets position to the beginning
   * @returns {Promise<void>} Promise that resolves when audio has stopped
   */
  stop: () => Promise<void>;

  /**
   * Starts or resumes audio playback
   * @param {string} [src] - Optional source URL for audio file
   * @returns {Promise<void>} Promise that resolves when playback begins
   * @throws {Error} If playback fails or audio element is not available
   */
  play: (src?: string) => Promise<void>;

  /**
   * Pauses the current audio playback without resetting position
   * @returns {Promise<void>} Promise that resolves when audio is paused
   */
  pause: () => Promise<void>;

  /**
   * Sets the volume level for audio playback
   * @param {number} volume - Volume level between 0 (mute) and 1 (max)
   * @throws {Error} If volume is outside valid range (0-1)
   */
  setVolume: (volume: number) => void;

  /**
   * Retrieves the current audio element for direct manipulation
   * @returns {HTMLAudioElement | null} The current audio element or null if unavailable
   */
  getAudioElement: () => HTMLAudioElement | null;

  /**
   * Checks if audio is currently playing
   * @returns {boolean} True if audio is playing, false otherwise
   */
  isPlaying: () => boolean;

  /**
   * Cleans up resources and event listeners
   * @returns {Promise<void>} Promise that resolves when cleanup is complete
   */
  cleanup: () => Promise<void>;
}

/**
 * Safely stops audio playback and resets playback position
 *
 * This function handles common error cases and ensures audio
 * playback is properly terminated.
 *
 * @param {HTMLAudioElement | null} [audioElement] - Target audio element
 * @returns {Promise<void>} Promise resolving when operation completes
 */
export async function stopAudio(audioElement?: HTMLAudioElement | null): Promise<void> {
  try {
    const audio = audioElement || (document.getElementById("audio-preview") as HTMLAudioElement);

    if (!audio) {
      return;
    }

    // Check if the audio element is actually playing before attempting to pause
    if (!audio.paused) {
      await new Promise<void>((resolve) => {
        // Handle one-time ended event to resolve on completion
        const onPause = () => {
          audio.removeEventListener("pause", onPause);
          resolve();
        };
        audio.addEventListener("pause", onPause);
        audio.pause();
      });
    }

    // Reset position
    audio.currentTime = 0;
  } catch (error) {
    handleAudioError(error, "audio stop");
    // Continue execution despite error - this is a best-effort operation
  }
}

/**
 * Audio Controller implementing the AudioControl interface
 *
 * This class provides robust audio management with error handling and
 * memory management for audio resources.
 *
 * @implements {AudioControl}
 */
export class AudioController implements AudioControl {
  private audioElement: HTMLAudioElement | null;
  private readonly defaultVolume = 0.8;
  private eventListeners: { type: string; listener: EventListener }[] = [];

  /**
   * Creates a new AudioController instance
   *
   * @param {string} audioElementId - ID of the HTML audio element to control (defaults to 'audio-preview')
   */
  constructor(audioElementId: string = "audio-preview") {
    this.audioElement = document.getElementById(audioElementId) as HTMLAudioElement;

    // Initialize audio element if found
    if (this.audioElement) {
      this.audioElement.volume = this.defaultVolume;
      this.registerEventListeners();
    } else {
    }
  }

  /**
   * Registers event listeners for error handling and state management
   * @private
   */
  private registerEventListeners(): void {
    if (!this.audioElement) {
      return;
    }

    // Handle errors during playback
    const errorHandler = (e: Event) => {
      handleAudioError(e, "audio playback");
    };

    this.audioElement.addEventListener("error", errorHandler);
    this.eventListeners.push({ type: "error", listener: errorHandler });

    // Additional event listeners can be added here
  }

  /**
   * Retrieves the current audio element
   * @returns {HTMLAudioElement | null} The audio element or null if unavailable
   */
  getAudioElement(): HTMLAudioElement | null {
    return this.audioElement;
  }

  /**
   * Checks if audio is currently playing
   * @returns {boolean} True if audio is playing, false otherwise
   */
  isPlaying(): boolean {
    if (!this.audioElement) {
      return false;
    }
    return !this.audioElement.paused;
  }

  /**
   * Stops current audio playback
   * @returns {Promise<void>} Promise resolving when audio is stopped
   */
  async stop(): Promise<void> {
    await stopAudio(this.audioElement);
  }

  /**
   * Starts or resumes audio playback
   *
   * @param {string} [src] - Optional new audio source URL
   * @returns {Promise<void>} Promise resolving when playback starts
   * @throws {Error} If playback fails or audio element is unavailable
   */
  async play(src?: string): Promise<void> {
    if (!this.audioElement) {
      throw new Error("Audio element not initialized");
    }

    try {
      // Set new source if provided
      if (src) {
        this.audioElement.src = src;

        // Wait for metadata to load before attempting to play
        if (this.audioElement.readyState < 2) {
          // HAVE_CURRENT_DATA
          await new Promise<void>((resolve, reject) => {
            const onLoadedMetadata = () => {
              this.audioElement?.removeEventListener("loadedmetadata", onLoadedMetadata);
              resolve();
            };

            const onError = (e: Event) => {
              this.audioElement?.removeEventListener("error", onError);
              reject(
                new Error(`Failed to load audio: ${(e as ErrorEvent).message || "Unknown error"}`)
              );
            };

            this.audioElement?.addEventListener("loadedmetadata", onLoadedMetadata);
            this.audioElement?.addEventListener("error", onError);
          });
        }
      }

      // Return a promise that resolves when playback starts
      await this.audioElement.play();
    } catch (error) {
      handleAudioError(error, "audio play");
      throw new Error(
        `Audio playback failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Pauses audio playback
   * @returns {Promise<void>} Promise resolving when audio is paused
   */
  async pause(): Promise<void> {
    if (!this.audioElement || this.audioElement.paused) {
      return;
    }

    try {
      await Promise.resolve(this.audioElement.pause());
    } catch (error) {
      handleAudioError(error, "audio pause");
    }
  }

  /**
   * Sets audio volume
   *
   * @param {number} volume - Volume level (0-1)
   * @throws {Error} If volume is out of valid range
   */
  setVolume(volume: number): void {
    if (volume < 0 || volume > 1) {
      throw new Error("Volume must be between 0 and 1");
    }

    if (this.audioElement) {
      this.audioElement.volume = volume;
    }
  }

  /**
   * Cleans up resources and event listeners
   * @returns {Promise<void>} Promise resolving when cleanup completes
   */
  async cleanup(): Promise<void> {
    try {
      // Stop any playing audio first
      await this.stop();

      // Remove all registered event listeners
      if (this.audioElement) {
        this.eventListeners.forEach(({ type, listener }) => {
          this.audioElement?.removeEventListener(type, listener);
        });
      }

      // Clear the event listeners array
      this.eventListeners = [];
    } catch (error) {
      handleAudioError(error, "audio cleanup");
    }
  }
}

/**
 * Singleton instance of AudioController for application-wide use
 *
 * Using a singleton ensures consistent audio state management throughout
 * the application and prevents multiple audio tracks from playing simultaneously.
 */
export const audioController = new AudioController();
