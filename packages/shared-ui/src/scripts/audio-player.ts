import { AUDIO_PLAYER_CONFIG } from "../constants/audio-player-config";
import { formatTime } from "@shared-utils/utils/time";
import { createInitializer } from "./utils/init";
import { logError } from "./utils/error";

const initAudioPlayers = (): (() => void) => {
  const players = document.querySelectorAll<HTMLDivElement>(".episode-player");
  if (!players.length) {
    return () => {};
  }

  const cleanup: (() => void)[] = [];

  players.forEach((player) => {
    const audio = player.querySelector<HTMLAudioElement>(".episode-player__audio");
    if (!audio) {
      return;
    }
    const controller = new AbortController();
    const signal = controller.signal;
    const playerId = player.getAttribute("data-player-id") || "";
    const toggleButton = player.querySelector<HTMLButtonElement>(
      '[data-action="toggle"]'
    );
    const rewindButton = player.querySelector<HTMLButtonElement>(
      '[data-action="rewind"]'
    );
    const forwardButton = player.querySelector<HTMLButtonElement>(
      '[data-action="forward"]'
    );
    const retryButton = player.querySelector<HTMLButtonElement>('[data-action="retry"]');
    const playIcon = toggleButton?.querySelector<SVGElement>(
      ".episode-player__control-icon--play"
    );
    const pauseIcon = toggleButton?.querySelector<SVGElement>(
      ".episode-player__control-icon--pause"
    );
    const progress = player.querySelector<HTMLElement>(".episode-player__progress");
    const progressFill = player.querySelector<HTMLElement>(
      ".episode-player__progress-fill"
    );
    const timeDisplay = player.querySelector<HTMLElement>(".episode-player__time");
    const status = player.querySelector<HTMLElement>(".episode-player__status");
    const hint = player.querySelector<HTMLElement>(".episode-player__shortcut-hint");
    const title = audio.dataset.title || "episode";
    let isPlaying = false;

    const dispatchTimeEvent = () => {
      if (!playerId) {
        return;
      }
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      window.dispatchEvent(
        new CustomEvent("audio:time", {
          detail: { playerId, currentTime: audio.currentTime, duration, isPlaying },
        })
      );
    };

    const setStatus = (message: string) => {
      if (status) {
        status.textContent = message;
      }
    };

    const updateToggleButton = () => {
      if (!toggleButton) {
        return;
      }
      toggleButton.dataset.state = isPlaying ? "playing" : "paused";
      toggleButton.setAttribute("aria-pressed", isPlaying ? "true" : "false");
      toggleButton.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} ${title}`);
      if (playIcon) {
        playIcon.style.display = isPlaying ? "none" : "block";
      }
      if (pauseIcon) {
        pauseIcon.style.display = isPlaying ? "block" : "none";
      }
    };

    const updateProgress = () => {
      if (!progress || !progressFill || !timeDisplay) {
        return;
      }
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      const progressValue = duration ? (currentTime / duration) * 100 : 0;
      progressFill.style.width = `${progressValue}%`;
      progress.setAttribute("aria-valuenow", Math.round(progressValue).toString());
      const currentFormatted = formatTime(currentTime);
      const durationFormatted = duration ? formatTime(duration) : "0:00";
      timeDisplay.textContent = `${currentFormatted} / ${durationFormatted}`;
      progress.setAttribute(
        "aria-valuetext",
        `${currentFormatted} of ${durationFormatted}`
      );
    };

    const applySeek = (seconds: number, autoplay: boolean) => {
      if (!Number.isFinite(seconds)) {
        return;
      }
      const duration = Number.isFinite(audio.duration) ? audio.duration : null;
      const clamp =
        duration === null
          ? Math.max(0, seconds)
          : Math.min(Math.max(0, seconds), duration);
      audio.currentTime = clamp;
      if (autoplay) {
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      }
      updateProgress();
      dispatchTimeEvent();
    };

    const seekToPosition = (clientX: number) => {
      if (!progress || !Number.isFinite(audio.duration)) {
        return;
      }
      const rect = progress.getBoundingClientRect();
      const percent = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      audio.currentTime = percent * audio.duration;
    };

    const handleToggle = () => {
      if (audio.paused || audio.ended) {
        audio.play().catch((error) => logError(error, "playback blocked"));
      } else {
        audio.pause();
      }
    };

    toggleButton?.addEventListener("click", handleToggle, { signal });

    const skip = (amount: number) => {
      if (!Number.isFinite(audio.duration)) {
        audio.currentTime = Math.max(0, audio.currentTime + amount);
      } else {
        const target = Math.min(Math.max(0, audio.currentTime + amount), audio.duration);
        audio.currentTime = target;
      }
      updateProgress();
      dispatchTimeEvent();
    };

    rewindButton?.addEventListener(
      "click",
      () => {
        skip(-AUDIO_PLAYER_CONFIG.SKIP_SECONDS);
      },
      { signal }
    );
    forwardButton?.addEventListener(
      "click",
      () => {
        skip(AUDIO_PLAYER_CONFIG.SKIP_SECONDS);
      },
      { signal }
    );

    progress?.addEventListener(
      "click",
      (event) => {
        if (event instanceof MouseEvent) {
          seekToPosition(event.clientX);
          updateProgress();
          dispatchTimeEvent();
        }
      },
      { signal }
    );

    progress?.addEventListener(
      "keydown",
      (event) => {
        if (!(event instanceof KeyboardEvent) || !Number.isFinite(audio.duration)) {
          return;
        }
        const keyActions: Record<string, () => void> = {
          ArrowLeft: () => skip(-AUDIO_PLAYER_CONFIG.SKIP_SECONDS),
          ArrowRight: () => skip(AUDIO_PLAYER_CONFIG.SKIP_SECONDS),
          Home: () => (audio.currentTime = 0),
          End: () => (audio.currentTime = audio.duration),
          PageUp: () => skip(AUDIO_PLAYER_CONFIG.SKIP_LARGE_SECONDS),
          PageDown: () => skip(-AUDIO_PLAYER_CONFIG.SKIP_LARGE_SECONDS),
        };
        if (keyActions[event.key]) {
          event.preventDefault();
          keyActions[event.key]();
          updateProgress();
          dispatchTimeEvent();
        }
      },
      { signal }
    );

    player.addEventListener(
      "keydown",
      (event) => {
        if (!(event instanceof KeyboardEvent)) {
          return;
        }
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        if (target.classList.contains("episode-player__progress")) {
          return;
        }
        if (["BUTTON", "A", "INPUT", "TEXTAREA"].includes(target.tagName)) {
          return;
        }
        const keyMap: Record<string, () => void> = {
          Space: () => toggleButton?.click(),
          ArrowLeft: () => rewindButton?.click(),
          ArrowRight: () => forwardButton?.click(),
        };
        if (event.code === "Space") {
          event.preventDefault();
          keyMap.Space?.();
        }
        if (keyMap[event.code]) {
          keyMap[event.code]?.();
        }
        if (event.key === "?") {
          event.preventDefault();
          hint?.classList.toggle("episode-player__shortcut-hint--hidden");
        }
      },
      { signal }
    );

    window.addEventListener(
      "transcript:seek",
      (event) => {
        if (!(event instanceof CustomEvent)) {
          return;
        }
        const detail = event.detail;
        if (!detail || detail.playerId !== playerId) {
          return;
        }
        applySeek(Number(detail.time), Boolean(detail.autoplay));
      },
      { signal }
    );

    audio.addEventListener(
      "loadedmetadata",
      () => {
        updateProgress();
        dispatchTimeEvent();
      },
      { signal }
    );

    let lastTimeUpdate = 0;
    audio.addEventListener(
      "timeupdate",
      () => {
        const now = performance.now();
        if (now - lastTimeUpdate < AUDIO_PLAYER_CONFIG.TIME_UPDATE_THROTTLE_MS) {
          return;
        }
        lastTimeUpdate = now;
        updateProgress();
        dispatchTimeEvent();
      },
      { signal }
    );

    audio.addEventListener("waiting", () => setStatus(`Buffering ${title}...`), {
      signal,
    });

    audio.addEventListener(
      "error",
      () => {
        const errorInfo = audio.error?.message ?? "Unknown error";
        setStatus(`Could not load ${title}. Click retry to try again.`);
        logError(errorInfo, `audio player: ${title}`);
        if (retryButton) {
          retryButton.hidden = false;
        }
      },
      { signal }
    );

    retryButton?.addEventListener(
      "click",
      () => {
        audio.load();
        retryButton.hidden = true;
        setStatus(`Loading ${title}...`);
      },
      { signal }
    );

    audio.addEventListener(
      "playing",
      () => {
        isPlaying = true;
        updateToggleButton();
        setStatus(`Now playing: ${title}`);
        dispatchTimeEvent();
      },
      { signal }
    );

    audio.addEventListener(
      "pause",
      () => {
        if (audio.ended) {
          return;
        }
        isPlaying = false;
        updateToggleButton();
        setStatus(`Paused: ${title}`);
        dispatchTimeEvent();
      },
      { signal }
    );

    audio.addEventListener(
      "ended",
      () => {
        isPlaying = false;
        updateToggleButton();
        if (progressFill) {
          progressFill.style.width = "0%";
        }
        updateProgress();
        setStatus(`Finished: ${title}`);
        dispatchTimeEvent();
      },
      { signal }
    );

    setStatus(`Paused: ${title}`);
    updateProgress();
    updateToggleButton();

    cleanup.push(() => controller.abort());
  });

  return () => cleanup.forEach((fn) => fn());
};

createInitializer("SharedAudioPlayer", () => {
  const cleanup = initAudioPlayers();
  return cleanup;
})();
