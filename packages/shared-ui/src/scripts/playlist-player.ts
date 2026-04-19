import { formatTime } from "@shared-utils/utils/time";
import { createInitializer } from "./utils/init";
import { logError } from "./utils/error";

const initPlaylistPlayers = (): (() => void) => {
  const players = document.querySelectorAll<HTMLDivElement>("[data-playlist-player]");
  if (!players.length) {
    return () => {};
  }

  const cleanup: (() => void)[] = [];

  players.forEach((player) => {
    if (player.dataset.playlistPlayerBound === "true") {
      return;
    }
    player.dataset.playlistPlayerBound = "true";

    const audio = player.querySelector<HTMLAudioElement>("[data-playlist-audio]");
    const toggleButton = player.querySelector<HTMLButtonElement>(
      '[data-action="toggle"]'
    );
    const prevButton = player.querySelector<HTMLButtonElement>('[data-action="prev"]');
    const nextButton = player.querySelector<HTMLButtonElement>('[data-action="next"]');
    const volumeButton = player.querySelector<HTMLButtonElement>(
      '[data-action="volume"]'
    );
    const shuffleButton = player.querySelector<HTMLButtonElement>(
      '[data-action="shuffle"]'
    );
    const repeatButton = player.querySelector<HTMLButtonElement>(
      '[data-action="repeat"]'
    );
    const progress = player.querySelector<HTMLInputElement>("[data-playlist-progress]");
    const currentTimeDisplay = player.querySelector<HTMLElement>("[data-current-time]");
    const remainingTimeDisplay = player.querySelector<HTMLElement>(
      "[data-remaining-time]"
    );
    const trackTitleDisplay = player.querySelector<HTMLElement>(
      "[data-current-track-title]"
    );
    const status = player.querySelector<HTMLElement>("[data-playlist-status]");
    const playIcon = toggleButton?.querySelector<SVGElement>(
      ".playlist-player__control-icon--play"
    );
    const pauseIcon = toggleButton?.querySelector<SVGElement>(
      ".playlist-player__control-icon--pause"
    );
    const trackItems = player.querySelectorAll<HTMLLIElement>(".playlist-player__track");

    if (!audio || !toggleButton || !prevButton || !nextButton || !progress) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    const albumTitle = player.dataset.albumTitle || "playlist";

    let currentTrackIndex = 0;
    let isPlaying = false;
    let isMuted = false;
    let isShuffled = false;
    let repeatMode: "off" | "all" | "one" = "off";
    let shuffledIndices: number[] = [];
    let currentShuffleIndex = 0;
    let lastHighlightedIndex = -1;
    let titleTransitionTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastProgressUpdate = 0;
    const PROGRESS_UPDATE_INTERVAL = 250;
    const tracks: Array<{
      title: string;
      url: string;
      duration?: number;
      lyricsUrl?: string;
      element: HTMLLIElement;
    }> = [];

    trackItems.forEach((item) => {
      const index = Number(item.dataset.trackIndex);
      const title = item.dataset.trackTitle || "";
      const url = item.dataset.trackUrl || "";
      const duration = item.dataset.trackDuration
        ? Number(item.dataset.trackDuration)
        : undefined;
      const lyricsUrl = item.dataset.trackLyrics || undefined;

      tracks.push({ title, url, duration, lyricsUrl, element: item });

      item.addEventListener("click", () => playTrack(index, { triggerPop: true }), {
        signal,
      });
      item.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            playTrack(index, { triggerPop: true });
          }
        },
        { signal }
      );
    });

    if (tracks.length > 0 && audio.src !== tracks[0].url) {
      audio.src = tracks[0].url;
    }

    const updateToggleButton = () => {
      toggleButton.dataset.state = isPlaying ? "playing" : "paused";
      toggleButton.setAttribute("aria-pressed", isPlaying ? "true" : "false");
      toggleButton.setAttribute(
        "aria-label",
        `${isPlaying ? "Pause" : "Play"} ${tracks[currentTrackIndex]?.title || albumTitle}`
      );
      if (playIcon) {
        playIcon.style.display = isPlaying ? "none" : "block";
      }
      if (pauseIcon) {
        pauseIcon.style.display = isPlaying ? "block" : "none";
      }
      player.dataset.playerState = isPlaying ? "playing" : "paused";
    };

    const updateTrackHighlight = () => {
      if (lastHighlightedIndex !== -1 && lastHighlightedIndex < trackItems.length) {
        trackItems[lastHighlightedIndex].dataset.isPlaying = "false";
      }
      trackItems[currentTrackIndex].dataset.isPlaying = isPlaying ? "true" : "false";
      lastHighlightedIndex = currentTrackIndex;
    };

    const updateTrackInfo = () => {
      const track = tracks[currentTrackIndex];
      if (trackTitleDisplay) {
        trackTitleDisplay.textContent = track?.title || "Click play to start";
      }
    };

    const updateProgress = () => {
      const now = performance.now();
      if (now - lastProgressUpdate < PROGRESS_UPDATE_INTERVAL) {
        return;
      }
      lastProgressUpdate = now;
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      progress.max = duration ? String(Math.floor(duration)) : "0";
      progress.value = String(Math.floor(currentTime));
      if (currentTimeDisplay) {
        currentTimeDisplay.textContent = formatTime(currentTime);
      }
      if (remainingTimeDisplay) {
        const remaining =
          Number.isFinite(duration) && Number.isFinite(currentTime)
            ? Math.max(duration - currentTime, 0)
            : 0;
        remainingTimeDisplay.textContent =
          remaining > 0 ? `-${formatTime(remaining)}` : "-0:00";
      }
    };

    const playTrack = (
      index: number,
      options: {
        autoplay?: boolean;
        triggerPop?: boolean;
        transition?: boolean;
      } = {}
    ) => {
      if (index < 0 || index >= tracks.length) {
        return;
      }

      if (options.triggerPop) {
        triggerPop(toggleButton);
      }

      currentTrackIndex = index;
      const track = tracks[index];
      const shouldAutoplay = options.autoplay ?? isPlaying;

      if (titleTransitionTimeout !== null) {
        clearTimeout(titleTransitionTimeout);
        titleTransitionTimeout = null;
      }

      if (trackTitleDisplay && options.transition !== false) {
        trackTitleDisplay.dataset.transitioning = "true";
        titleTransitionTimeout = setTimeout(() => {
          if (trackTitleDisplay) {
            trackTitleDisplay.textContent = track?.title || "Click play to start";
            trackTitleDisplay.dataset.transitioning = "false";
          }
          titleTransitionTimeout = null;
        }, 200);
      } else {
        updateTrackInfo();
      }

      if (
        track.url &&
        (track.url.startsWith("http://") || track.url.startsWith("https://"))
      ) {
        audio.src = track.url;
      }
      updateTrackHighlight();

      if (shouldAutoplay) {
        audio.play().catch((error) => logError(error, "playback blocked"));
      }
    };

    const playNext = () => {
      if (isShuffled && tracks.length > 1) {
        currentShuffleIndex = (currentShuffleIndex + 1) % shuffledIndices.length;
        playTrack(shuffledIndices[currentShuffleIndex], {
          autoplay: isPlaying,
          triggerPop: isPlaying,
        });
      } else {
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        playTrack(nextIndex, { autoplay: isPlaying, triggerPop: isPlaying });
      }
    };

    const playPrev = () => {
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        updateProgress();
        return;
      }
      if (isShuffled && tracks.length > 1) {
        currentShuffleIndex =
          (currentShuffleIndex - 1 + shuffledIndices.length) % shuffledIndices.length;
        playTrack(shuffledIndices[currentShuffleIndex], {
          autoplay: isPlaying,
          triggerPop: isPlaying,
        });
      } else {
        const prevIndex =
          currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
        playTrack(prevIndex, { autoplay: isPlaying, triggerPop: isPlaying });
      }
    };

    const triggerPop = (button: HTMLButtonElement) => {
      button.dataset.pop = "true";
      setTimeout(() => {
        button.dataset.pop = "false";
      }, 250);
    };

    const handleToggle = () => {
      if (!tracks.length) {
        return;
      }

      triggerPop(toggleButton);

      if (audio.paused || audio.ended) {
        if (audio.src !== tracks[currentTrackIndex].url) {
          audio.src = tracks[currentTrackIndex].url;
        }
        audio.play().catch((error) => logError(error, "playback blocked"));
      } else {
        audio.pause();
      }
    };

    toggleButton.addEventListener("click", handleToggle, { signal });
    prevButton.addEventListener("click", playPrev, { signal });
    nextButton.addEventListener("click", playNext, { signal });

    const handleVolume = () => {
      isMuted = !isMuted;
      audio.muted = isMuted;
      player.dataset.playerMuted = isMuted ? "true" : "false";
      if (volumeButton) {
        volumeButton.setAttribute("aria-label", isMuted ? "Unmute" : "Mute");
      }
    };

    volumeButton?.addEventListener("click", handleVolume, { signal });

    const handleShuffle = () => {
      isShuffled = !isShuffled;
      player.dataset.playerShuffle = isShuffled ? "true" : "false";
      if (shuffleButton) {
        shuffleButton.setAttribute("aria-pressed", isShuffled ? "true" : "false");
      }
      if (isShuffled) {
        const indices = tracks.map((_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        shuffledIndices = indices;
        currentShuffleIndex = shuffledIndices.indexOf(currentTrackIndex);
        if (currentShuffleIndex === -1) {
          currentShuffleIndex = 0;
        }
      }
    };

    const handleRepeat = () => {
      const modes: Array<"off" | "all" | "one"> = ["off", "all", "one"];
      const currentIdx = modes.indexOf(repeatMode);
      repeatMode = modes[(currentIdx + 1) % modes.length];
      player.dataset.playerRepeat = repeatMode;
      if (repeatButton) {
        repeatButton.setAttribute("aria-label", `Repeat: ${repeatMode}`);
        repeatButton.setAttribute(
          "aria-pressed",
          repeatMode !== "off" ? "true" : "false"
        );
      }
    };

    shuffleButton?.addEventListener("click", handleShuffle, { signal });
    repeatButton?.addEventListener("click", handleRepeat, { signal });

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
        updateTrackHighlight();
        if (status) {
          status.textContent = `Playing ${tracks[currentTrackIndex]?.title}`;
        }
      },
      { signal }
    );

    audio.addEventListener(
      "pause",
      () => {
        isPlaying = false;
        updateToggleButton();
        updateTrackHighlight();
        if (status) {
          status.textContent = `Paused ${tracks[currentTrackIndex]?.title}`;
        }
      },
      { signal }
    );

    audio.addEventListener(
      "ended",
      () => {
        isPlaying = false;
        updateToggleButton();
        updateTrackHighlight();
        if (status) {
          status.textContent = `Finished ${tracks[currentTrackIndex]?.title}`;
        }

        if (repeatMode === "one") {
          audio.currentTime = 0;
          audio.play().catch((error) => logError(error, "playback blocked"));
          return;
        }

        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        const isLastTrack = nextIndex === 0 && !isShuffled && repeatMode === "off";

        if (isLastTrack) {
          player.dataset.playerCelebrating = "true";
          setTimeout(() => {
            player.dataset.playerCelebrating = "false";
          }, 800);
        }

        if (!isShuffled) {
          playTrack(nextIndex, { autoplay: true });
        } else {
          currentShuffleIndex = (currentShuffleIndex + 1) % shuffledIndices.length;
          playTrack(shuffledIndices[currentShuffleIndex], { autoplay: true });
        }
      },
      { signal }
    );

    audio.addEventListener(
      "error",
      () => {
        if (status) {
          status.textContent = `Could not load ${tracks[currentTrackIndex]?.title}`;
        }
        logError(
          new Error(`Failed to load track: ${tracks[currentTrackIndex]?.url}`),
          "audio error"
        );
      },
      { signal }
    );

    audio.addEventListener("timeupdate", updateProgress, { signal });
    audio.addEventListener("loadedmetadata", updateProgress, { signal });

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.target !== player && !player.contains(event.target as Node)) {
        return;
      }
      switch (event.key) {
        case " ":
        case "k":
          event.preventDefault();
          handleToggle();
          break;
        case "ArrowLeft":
          event.preventDefault();
          playPrev();
          break;
        case "ArrowRight":
          event.preventDefault();
          playNext();
          break;
        case "s":
        case "S":
          event.preventDefault();
          handleShuffle();
          break;
        case "r":
        case "R":
          event.preventDefault();
          handleRepeat();
          break;
        case "m":
        case "M":
          event.preventDefault();
          handleVolume();
          break;
      }
    };

    player.addEventListener("keydown", handleKeydown, { signal });

    updateToggleButton();
    updateTrackInfo();
    updateTrackHighlight();
    player.dataset.playerMuted = "false";
    player.dataset.playerShuffle = "false";
    player.dataset.playerRepeat = "off";
    if (tracks.length > 0) {
      audio.src = tracks[0].url;
    }

    cleanup.push(() => controller.abort());
  });

  return () => {
    cleanup.forEach((fn) => fn());
  };
};

const setupPlaylistPlayers = createInitializer(
  "shared-ui-playlist-player",
  initPlaylistPlayers
);

setupPlaylistPlayers();
