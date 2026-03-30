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
    if (player.dataset.audioPlayerBound === "true") {
      return;
    }
    player.dataset.audioPlayerBound = "true";

    const audio = player.querySelector<HTMLAudioElement>(".episode-player__audio");
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
    const progress = player.querySelector<HTMLInputElement>("[data-episode-progress]");
    const timeDisplay = player.querySelector<HTMLElement>(".episode-player__time");
    const status = player.querySelector<HTMLElement>(".episode-player__status");
    const playIcon = toggleButton?.querySelector<SVGElement>(
      ".episode-player__control-icon--play"
    );
    const pauseIcon = toggleButton?.querySelector<SVGElement>(
      ".episode-player__control-icon--pause"
    );

    if (
      !audio ||
      !toggleButton ||
      !rewindButton ||
      !forwardButton ||
      !retryButton ||
      !progress ||
      !timeDisplay ||
      !status
    ) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    const title = audio.dataset.title || "episode";
    const playerId = player.getAttribute("data-player-id") || "";
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
      status.textContent = message;
    };

    const updateToggleButton = () => {
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
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      progress.max = duration ? String(Math.floor(duration)) : "0";
      progress.value = String(Math.floor(currentTime));
      timeDisplay.textContent = `${formatTime(currentTime)} / ${duration ? formatTime(duration) : "0:00"}`;
      dispatchTimeEvent();
    };

    const handleToggle = () => {
      if (audio.paused || audio.ended) {
        audio.play().catch((error) => logError(error, "playback blocked"));
      } else {
        audio.pause();
      }
    };

    const skip = (amount: number) => {
      if (!Number.isFinite(audio.duration)) {
        audio.currentTime = Math.max(0, audio.currentTime + amount);
      } else {
        audio.currentTime = Math.min(
          Math.max(0, audio.currentTime + amount),
          audio.duration
        );
      }
      updateProgress();
    };

    toggleButton.addEventListener("click", handleToggle, { signal });
    rewindButton.addEventListener(
      "click",
      () => skip(-AUDIO_PLAYER_CONFIG.SKIP_SECONDS),
      {
        signal,
      }
    );
    forwardButton.addEventListener(
      "click",
      () => skip(AUDIO_PLAYER_CONFIG.SKIP_SECONDS),
      {
        signal,
      }
    );
    retryButton.addEventListener("click", handleToggle, { signal });
    progress.addEventListener(
      "input",
      () => {
        audio.currentTime = Number(progress.value);
        updateProgress();
      },
      { signal }
    );

    audio.addEventListener(
      "play",
      () => {
        isPlaying = true;
        updateToggleButton();
        setStatus(`Playing ${title}`);
      },
      { signal }
    );
    audio.addEventListener(
      "pause",
      () => {
        isPlaying = false;
        updateToggleButton();
        setStatus(`Paused ${title}`);
      },
      { signal }
    );
    audio.addEventListener(
      "ended",
      () => {
        isPlaying = false;
        updateToggleButton();
        setStatus(`Finished ${title}`);
      },
      { signal }
    );
    audio.addEventListener("timeupdate", updateProgress, { signal });
    audio.addEventListener("loadedmetadata", updateProgress, { signal });
    audio.addEventListener(
      "error",
      () => {
        retryButton.hidden = false;
        setStatus(`Could not load ${title}`);
      },
      { signal }
    );

    const transcriptSeekHandler = (event: Event) => {
      const customEvent = event as CustomEvent<{
        playerId?: string;
        time?: number;
        autoplay?: boolean;
      }>;
      if (
        customEvent.detail?.playerId !== playerId ||
        !Number.isFinite(customEvent.detail?.time)
      ) {
        return;
      }
      audio.currentTime = customEvent.detail.time ?? 0;
      updateProgress();
      if (customEvent.detail.autoplay) {
        audio
          .play()
          .catch((error) => logError(error, "transcript seek autoplay blocked"));
      }
    };

    window.addEventListener("transcript:seek", transcriptSeekHandler as EventListener, {
      signal,
    });

    updateToggleButton();
    updateProgress();
    cleanup.push(() => controller.abort());
  });

  return () => {
    cleanup.forEach((fn) => fn());
  };
};

export const setupAudioPlayers = createInitializer(
  "shared-ui-audio-player",
  initAudioPlayers
);

setupAudioPlayers();
