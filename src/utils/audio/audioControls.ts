/**
 * Interface for audio control operations
 * Provides methods for basic audio playback control
 * @interface
 */
export interface AudioControl {
  stopAudio: (audioElement?: HTMLAudioElement | null) => void;
  play: (src?: string) => void;
  pause: () => void;
  setVolume: (volume: number) => void;
}

/**
 * Stops audio playback and resets to beginning
 * @param audioElement - Optional: Specific audio element to control. If not provided, looks for element with ID 'audio-preview'
 * @throws {Error} If audio element cannot be stopped or reset
 * @returns void
 */
export function stopAudio(audioElement?: HTMLAudioElement | null): void {
  const audio =
    audioElement ||
    (document.getElementById("audio-preview") as HTMLAudioElement);

  if (audio) {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (error) {
      console.warn("Audio konnte nicht gestoppt werden:", error);
    }
  }
}

/**
 * Audio Controller Class for extended audio functionality
 * Provides a comprehensive interface for managing audio playback
 * Implements AudioControl interface for standardized audio operations
 *
 * @class
 * @implements {AudioControl}
 */
export class AudioController {
  private audioElement: HTMLAudioElement | null;

  constructor(audioElementId: string = "audio-preview") {
    this.audioElement = document.getElementById(
      audioElementId,
    ) as HTMLAudioElement;
  }

  stop(): void {
    stopAudio(this.audioElement);
  }

  play(src?: string): void {
    if (this.audioElement) {
      if (src) {
        this.audioElement.src = src;
      }
      this.audioElement.play().catch((error) => {
        console.warn("Audio konnte nicht abgespielt werden:", error);
      });
    }
  }

  pause(): void {
    this.audioElement?.pause();
  }

  setVolume(volume: number): void {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

export const audioController = new AudioController();
