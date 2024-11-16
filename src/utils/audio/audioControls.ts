/**
 * Interface for audio control operations
 *
 * @interface AudioControl
 * @property {Function} stop - Stops and resets audio playback
 * @property {Function} play - Starts or resumes audio playback
 * @property {Function} pause - Pauses audio playback
 * @property {Function} setVolume - Sets audio volume (0-1)
 * @property {Function} getAudioElement - Returns the current audio element
 */
export interface AudioControl {
  stop: () => void;
  play: (src?: string) => Promise<void>;
  pause: () => void;
  setVolume: (volume: number) => void;
  getAudioElement: () => HTMLAudioElement | null;
}

/**
 * Utility function to safely stop audio playback
 *
 * @param {HTMLAudioElement | null} [audioElement] - Target audio element
 * @returns {Promise<void>}
 */
export async function stopAudio(
  audioElement?: HTMLAudioElement | null,
): Promise<void> {
  const audio =
    audioElement ||
    (document.getElementById("audio-preview") as HTMLAudioElement);

  if (!audio) return;

  try {
    await audio.pause();
    audio.currentTime = 0;
  } catch (error) {
    console.error("Failed to stop audio:", error);
  }
}

/**
 * Audio Controller implementation with enhanced error handling and type safety
 *
 * @class AudioController
 * @implements {AudioControl}
 */
export class AudioController implements AudioControl {
  private audioElement: HTMLAudioElement | null;
  private readonly defaultVolume = 1.0;

  constructor(audioElementId: string = "audio-preview") {
    this.audioElement = document.getElementById(
      audioElementId,
    ) as HTMLAudioElement;
    if (this.audioElement) {
      this.audioElement.volume = this.defaultVolume;
    }
  }

  /**
   * Returns the current audio element
   */
  getAudioElement(): HTMLAudioElement | null {
    return this.audioElement;
  }

  /**
   * Stops current audio playback
   */
  stop(): void {
    void stopAudio(this.audioElement);
  }

  /**
   * Starts or resumes audio playback
   *
   * @param {string} [src] - Optional new audio source URL
   * @returns {Promise<void>}
   * @throws {Error} If playback fails or audio element is not available
   */
  async play(src?: string): Promise<void> {
    if (!this.audioElement) {
      throw new Error("Audio element not initialized");
    }

    try {
      if (src) {
        this.audioElement.src = src;
      }
      await this.audioElement.play();
    } catch (error) {
      console.error("Failed to play audio:", error);
      throw error;
    }
  }

  /**
   * Pauses audio playback
   */
  pause(): void {
    if (this.audioElement?.played) {
      this.audioElement.pause();
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
}

/**
 * Singleton instance of AudioController
 */
export const audioController = new AudioController();
