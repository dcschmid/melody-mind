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
  private updateInterval: number | null = null;

  /**
   *
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
    this.updateInterval = window.setInterval(() => {
      this.updateProgress();
    }, 100);
  }

  /**
   *
   */
  public play(): void {
    if (this.elements.audioElement) {
      this.elements.audioElement.play();
      this.isPlaying = true;
      this.updatePlayPauseButtons();
    }
  }

  /**
   *
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
   *
   */
  public cleanup(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
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
