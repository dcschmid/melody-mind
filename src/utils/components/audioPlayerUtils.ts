import { safeGetElementById } from "../dom/domUtils";

/**
 * Audio Player configuration interface
 */
interface AudioPlayerConfig {
  playButtonId?: string;
  pauseButtonId?: string;
  progressBarId?: string;
  timeDisplayId?: string;
  audioElementId?: string;
  rewindButtonId?: string;
  forwardButtonId?: string;
}

/**
 * Audio Player elements interface
 */
interface AudioPlayerElements {
  playButton: HTMLButtonElement | null;
  pauseButton: HTMLButtonElement | null;
  progressBar: HTMLProgressElement | null;
  timeDisplay: HTMLElement | null;
  audioElement: HTMLAudioElement | null;
  rewindButton: HTMLButtonElement | null;
  forwardButton: HTMLButtonElement | null;
}

/**
 * Audio Player utilities class
 */
export class AudioPlayerUtils {
  private config: AudioPlayerConfig;
  private elements: AudioPlayerElements;
  private isPlaying: boolean = false;
  // Use the audio element 'timeupdate' event instead of a setInterval for progress updates.
  // Store the bound handler so we can remove it during cleanup.
  // Typed to `void` return to avoid `any` usage while keeping the native event signature.
  private timeUpdateHandler: ((this: HTMLAudioElement, ev: Event) => void) | null = null;

  /**
   * Create and initialize a new AudioPlayerUtils instance.
   *
   * This constructor will cache DOM elements based on the provided configuration,
   * bind event handlers and attach a `timeupdate` listener on the audio element
   * to drive progress updates efficiently.
   *
   * @param {AudioPlayerConfig} config - Optional element id configuration used by the player.
   */
  constructor(config: AudioPlayerConfig) {
    this.config = config;
    this.elements = {
      playButton: null,
      pauseButton: null,
      progressBar: null,
      timeDisplay: null,
      audioElement: null,
      rewindButton: null,
      forwardButton: null,
    };
    this.init();
  }

  private init(): void {
    this.cacheElements();
    this.bindEvents();
    this.startUpdateInterval();
  }

  private cacheElements(): void {
    this.elements.playButton = safeGetElementById<HTMLButtonElement>(
      this.config.playButtonId || "play-button"
    );
    this.elements.pauseButton = safeGetElementById<HTMLButtonElement>(
      this.config.pauseButtonId || "pause-button"
    );
    this.elements.progressBar = safeGetElementById<HTMLProgressElement>(
      this.config.progressBarId || "progress-bar"
    );
    this.elements.timeDisplay = safeGetElementById<HTMLElement>(
      this.config.timeDisplayId || "time-display"
    );
    this.elements.audioElement = safeGetElementById<HTMLAudioElement>(
      this.config.audioElementId || "audio-player"
    );
    this.elements.rewindButton = safeGetElementById<HTMLButtonElement>(
      this.config.rewindButtonId || "rewind-button"
    );
    this.elements.forwardButton = safeGetElementById<HTMLButtonElement>(
      this.config.forwardButtonId || "forward-button"
    );
  }

  private bindEvents(): void {
    if (this.elements.playButton) {
      this.elements.playButton.addEventListener("click", () => {
        this.play();
      });
    }

    if (this.elements.pauseButton) {
      this.elements.pauseButton.addEventListener("click", () => {
        this.pause();
      });
    }

    if (this.elements.rewindButton) {
      this.elements.rewindButton.addEventListener("click", () => {
        this.rewind();
      });
    }

    if (this.elements.forwardButton) {
      this.elements.forwardButton.addEventListener("click", () => {
        this.forward();
      });
    }

    if (this.elements.progressBar) {
      this.elements.progressBar.addEventListener("click", (e) => {
        this.seek(e);
      });
    }

    if (this.elements.audioElement) {
      this.elements.audioElement.addEventListener("ended", () => {
        this.handleAudioEnd();
      });
    }
  }

  private startUpdateInterval(): void {
    // If there's no audio element available yet, do nothing.
    if (!this.elements.audioElement) {
      return;
    }

    // Remove any existing handler to avoid double-listening
    if (this.timeUpdateHandler) {
      this.elements.audioElement.removeEventListener(
        "timeupdate",
        this.timeUpdateHandler as EventListener
      );
      this.timeUpdateHandler = null;
    }

    // Bind a stable handler that calls updateProgress on each 'timeupdate' event.
    // The 'timeupdate' event is fired by the audio element at an efficient cadence
    // and avoids an always-running interval, improving performance and battery life.
    this.timeUpdateHandler = (_ev: Event): void => {
      this.updateProgress();
    };

    this.elements.audioElement.addEventListener(
      "timeupdate",
      this.timeUpdateHandler as EventListener
    );
  }

  /**
   * Play the configured audio element.
   *
   * Starts playback and updates the internal playing state and visible controls.
   */
  public play(): void {
    if (this.elements.audioElement) {
      void this.elements.audioElement.play();
      this.isPlaying = true;
      this.updatePlayPauseButtons();
    }
  }

  /**
   * Pause the configured audio element.
   *
   * Pauses playback and updates the internal playing state and visible controls.
   */
  public pause(): void {
    if (this.elements.audioElement) {
      this.elements.audioElement.pause();
      this.isPlaying = false;
      this.updatePlayPauseButtons();
    }
  }

  private rewind(): void {
    if (this.elements.audioElement) {
      this.elements.audioElement.currentTime = Math.max(
        0,
        this.elements.audioElement.currentTime - 10
      );
    }
  }

  private forward(): void {
    if (this.elements.audioElement) {
      if (this.elements.audioElement.duration) {
        this.elements.audioElement.currentTime = Math.min(
          this.elements.audioElement.duration,
          this.elements.audioElement.currentTime + 10
        );
      }
    }
  }

  private seek(event: MouseEvent): void {
    if (this.elements.audioElement && this.elements.progressBar) {
      const rect = this.elements.progressBar.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const width = rect.width;
      const seekTime = (clickX / width) * this.elements.audioElement.duration;
      this.elements.audioElement.currentTime = seekTime;
    }
  }

  private updateProgress(): void {
    if (this.elements.audioElement && this.elements.progressBar) {
      const currentTime = this.elements.audioElement.currentTime;
      const duration = this.elements.audioElement.duration;

      if (duration) {
        const progress = (currentTime / duration) * 100;
        this.elements.progressBar.value = progress;
      }
    }

    this.updateTimeDisplay();
  }

  private updateTimeDisplay(): void {
    if (this.elements.audioElement && this.elements.timeDisplay) {
      const currentTime = this.elements.audioElement.currentTime;
      const duration = this.elements.audioElement.duration;

      const currentTimeFormatted = this.formatTime(currentTime);
      const durationFormatted = duration ? this.formatTime(duration) : "0:00";

      this.elements.timeDisplay.textContent = `${currentTimeFormatted} / ${durationFormatted}`;
    }
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  private updatePlayPauseButtons(): void {
    if (this.elements.playButton) {
      this.elements.playButton.style.display = this.isPlaying ? "none" : "block";
    }

    if (this.elements.pauseButton) {
      this.elements.pauseButton.style.display = this.isPlaying ? "block" : "none";
    }
  }

  private handleAudioEnd(): void {
    this.isPlaying = false;
    this.updatePlayPauseButtons();

    if (this.elements.progressBar) {
      this.elements.progressBar.value = 0;
    }

    this.updateTimeDisplay();
  }

  /**
   * Clean up event listeners and timers.
   *
   * Removes the attached `timeupdate` listener from the audio element (if present)
   * to avoid memory leaks when the player is no longer needed.
   */
  public cleanup(): void {
    // Remove the 'timeupdate' listener if it was attached
    if (this.timeUpdateHandler && this.elements.audioElement) {
      this.elements.audioElement.removeEventListener(
        "timeupdate",
        this.timeUpdateHandler as EventListener
      );
      this.timeUpdateHandler = null;
    }
  }
}

/**
 * Initialize audio player with configuration
 */
export function initAudioPlayer(config: AudioPlayerConfig): AudioPlayerUtils {
  return new AudioPlayerUtils(config);
}

/**
 * Initialize audio player with default configuration
 */
export function initAudioPlayerAuto(): AudioPlayerUtils | null {
  return initAudioPlayer({
    playButtonId: "play-button",
    pauseButtonId: "pause-button",
    progressBarId: "progress-bar",
    timeDisplayId: "time-display",
    audioElementId: "audio-player",
    rewindButtonId: "rewind-button",
    forwardButtonId: "forward-button",
  });
}
