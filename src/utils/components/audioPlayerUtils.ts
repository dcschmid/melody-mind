import { safeGetElementById } from "../dom/domUtils";
import { handleGameError } from "../error/errorHandlingUtils";

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
  // Track whether we've already emitted a 'first play' event for analytics
  private hasEmittedFirstPlayEvent: boolean = false;
  // Use the audio element 'timeupdate' event instead of a setInterval for progress updates.
  // Store the bound handler so we can remove it during cleanup.
  // Typed to `void` return to avoid `any` usage while keeping the native event signature.
  private timeUpdateHandler: ((this: HTMLAudioElement, ev: Event) => void) | null = null;
  private keydownHandler: ((ev: KeyboardEvent) => void) | null = null;
  private progressPointerDown: boolean = false;
  private pointerMoveHandler: ((ev: PointerEvent) => void) | null = null;
  private pointerUpHandler: ((ev: PointerEvent) => void) | null = null;

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
    // Basic control bindings
    if (this.elements.playButton) {
      this.elements.playButton.addEventListener("click", () => this.play());
    }
    if (this.elements.pauseButton) {
      this.elements.pauseButton.addEventListener("click", () => this.pause());
    }
    if (this.elements.rewindButton) {
      this.elements.rewindButton.addEventListener("click", () => this.rewind());
    }
    if (this.elements.forwardButton) {
      this.elements.forwardButton.addEventListener("click", () => this.forward());
    }
    if (this.elements.progressBar) {
      this.elements.progressBar.addEventListener("click", (e) => this.seek(e as MouseEvent));
    }

    // extended bindings
    this.bindAudioElementEvents();
    this.bindInteractionEvents();
  }

  private bindAudioElementEvents(): void {
    if (!this.elements.audioElement) {
      return;
    }
    this.elements.audioElement.addEventListener("ended", () => this.handleAudioEnd());
    this.elements.audioElement.addEventListener("waiting", () => {
      const buf = safeGetElementById<HTMLElement>("buffer-indicator");
      if (buf) {
        buf.classList.remove("opacity-0", "scale-95", "pointer-events-none");
        buf.classList.add("opacity-100", "scale-100");
      }
    });
    this.elements.audioElement.addEventListener("playing", () => {
      const buf = safeGetElementById<HTMLElement>("buffer-indicator");
      if (buf) {
        buf.classList.remove("opacity-100", "scale-100");
        buf.classList.add("opacity-0", "scale-95", "pointer-events-none");
      }
    });
  }

  private bindInteractionEvents(): void {
    // Keyboard controls
    this.keydownHandler = (ev: KeyboardEvent): void => {
      const active = document.activeElement;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
        return;
      }
      if (ev.code === "Space") {
        ev.preventDefault();
        if (this.isPlaying) {
          this.pause();
        } else {
          this.play();
        }
      } else if (ev.code === "ArrowLeft") {
        this.rewind();
      } else if (ev.code === "ArrowRight") {
        this.forward();
      }
    };
    document.addEventListener("keydown", this.keydownHandler);

    // Pointer drag/seek
    const progressEl = safeGetElementById<HTMLElement>("progress-bar");
    const progressFill = safeGetElementById<HTMLElement>("progress-fill");
    if (progressEl && progressFill && this.elements.audioElement) {
      this.pointerMoveHandler = (ev: PointerEvent): void => {
        if (!this.progressPointerDown) {
          return;
        }
        const rect = progressEl.getBoundingClientRect();
        let x = ev.clientX - rect.left;
        x = Math.max(0, Math.min(rect.width, x));
        const pct = x / rect.width;
        progressFill.style.width = `${pct * 100}%`;
        const seekTime = pct * (this.elements.audioElement!.duration || 0);
        if (!Number.isNaN(seekTime) && this.elements.audioElement) {
          this.elements.audioElement.currentTime = seekTime;
        }
      };

      this.pointerUpHandler = (): void => {
        this.progressPointerDown = false;
        document.removeEventListener("pointermove", this.pointerMoveHandler as EventListener);
        document.removeEventListener("pointerup", this.pointerUpHandler as EventListener);
      };

      progressEl.addEventListener("pointerdown", (ev: PointerEvent) => {
        this.progressPointerDown = true;
        document.addEventListener("pointermove", this.pointerMoveHandler as EventListener);
        document.addEventListener("pointerup", this.pointerUpHandler as EventListener);
        ev.preventDefault();
      });
    }

    // Volume & Mute
    const volSlider = safeGetElementById<HTMLInputElement>("volume-slider");
    const muteBtn = safeGetElementById<HTMLButtonElement>("mute-button");
    if (volSlider && this.elements.audioElement) {
      volSlider.addEventListener("input", () => {
        const v = parseFloat(volSlider.value);
        this.elements.audioElement!.volume = v;
      });
    }
    if (muteBtn && this.elements.audioElement) {
      muteBtn.addEventListener("click", () => {
        const unmutedIcon = muteBtn.querySelector(".icon-unmuted");
        const mutedIcon = muteBtn.querySelector(".icon-muted");
        if (unmutedIcon && mutedIcon) {
          if (this.elements.audioElement!.muted) {
            this.elements.audioElement!.muted = false;
            (unmutedIcon as HTMLElement).classList.remove("hidden");
            (mutedIcon as HTMLElement).classList.add("hidden");
            muteBtn.setAttribute("aria-pressed", "false");
          } else {
            this.elements.audioElement!.muted = true;
            (unmutedIcon as HTMLElement).classList.add("hidden");
            (mutedIcon as HTMLElement).classList.remove("hidden");
            muteBtn.setAttribute("aria-pressed", "true");
          }
        } else {
          // Fallback for older markup that uses emoji textContent
          if (this.elements.audioElement!.muted) {
            this.elements.audioElement!.muted = false;
            muteBtn.textContent = "🔊";
            muteBtn.setAttribute("aria-pressed", "false");
          } else {
            this.elements.audioElement!.muted = true;
            muteBtn.textContent = "🔇";
            muteBtn.setAttribute("aria-pressed", "true");
          }
        }
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
      try {
        this.emitPlayAnalytics();
      } catch {
        // analytics must not break playback
      }
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
        // update both progress element (if present) and custom fill
        try {
          this.elements.progressBar.value = progress;
        } catch (e) {
          // ignore assignment errors for non-progress elements
          console.warn(e);
        }
        const fill = safeGetElementById<HTMLElement>("progress-fill");
        if (fill) {
          fill.style.width = `${progress}%`;
        }
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
    // keep in sync with our custom time-display element if present
    const td = safeGetElementById<HTMLElement>("time-display");
    if (td && this.elements.audioElement) {
      const cur = this.formatTime(this.elements.audioElement.currentTime);
      const dur = this.elements.audioElement.duration
        ? this.formatTime(this.elements.audioElement.duration)
        : "0:00";
      td.textContent = `${cur} / ${dur}`;
    }
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  private updatePlayPauseButtons(): void {
    if (this.elements.playButton) {
      if (this.isPlaying) {
        this.elements.playButton.classList.add("hidden");
        this.elements.playButton.classList.remove("flex");
      } else {
        this.elements.playButton.classList.remove("hidden");
        this.elements.playButton.classList.add("flex");
      }
    }

    if (this.elements.pauseButton) {
      if (this.isPlaying) {
        this.elements.pauseButton.classList.remove("hidden");
        this.elements.pauseButton.classList.add("flex");
      } else {
        this.elements.pauseButton.classList.add("hidden");
        this.elements.pauseButton.classList.remove("flex");
      }
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
   * Emit analytics events for play/resume actions using Fathom if available.
   * - Sends `podcast_play` on the first play for this page load.
   * - Sends `podcast_resume` for subsequent plays.
   */
  private emitPlayAnalytics(): void {
    try {
      const fathom = (globalThis as unknown as { fathom?: { trackEvent?: (n: string) => void } })
        .fathom;
      if (!fathom || typeof fathom.trackEvent !== "function") {
        return;
      }

      const audioEl = this.elements.audioElement;
      if (!audioEl) {
        return;
      }

      const podcastId = (audioEl.dataset && audioEl.dataset.podcastId) || null;
      const podcastTitle = (audioEl.dataset && audioEl.dataset.podcastTitle) || null;

      if (!this.hasEmittedFirstPlayEvent) {
        // first play
        const eventName = podcastId ? `podcast_play_${podcastId}` : "podcast_play";
        fathom.trackEvent(eventName);
        if (podcastTitle) {
          // additional context event
          fathom.trackEvent(`podcast_play_title_${podcastTitle.replace(/[^a-zA-Z0-9_]/g, "_")}`);
        }
        this.hasEmittedFirstPlayEvent = true;
      } else {
        // resume
        const eventName = podcastId ? `podcast_resume_${podcastId}` : "podcast_resume";
        fathom.trackEvent(eventName);
      }
    } catch (error) {
      // keep analytics non-fatal
      try {
        handleGameError(error, "audio analytics");
      } catch {
        // swallow
      }
    }
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
    if (this.keydownHandler) {
      document.removeEventListener("keydown", this.keydownHandler);
      this.keydownHandler = null;
    }
    if (this.pointerMoveHandler) {
      document.removeEventListener("pointermove", this.pointerMoveHandler as EventListener);
      this.pointerMoveHandler = null;
    }
    if (this.pointerUpHandler) {
      document.removeEventListener("pointerup", this.pointerUpHandler as EventListener);
      this.pointerUpHandler = null;
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
