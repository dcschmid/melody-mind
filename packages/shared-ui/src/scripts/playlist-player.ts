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

      item.addEventListener("click", () => playTrack(index), { signal });
      item.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            playTrack(index);
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
      trackItems.forEach((item, i) => {
        item.dataset.isPlaying = i === currentTrackIndex && isPlaying ? "true" : "false";
      });
    };

    const updateTrackInfo = () => {
      const track = tracks[currentTrackIndex];
      if (trackTitleDisplay) {
        trackTitleDisplay.textContent = track?.title || "Click play to start";
      }
    };

    const updateProgress = () => {
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      progress.max = duration ? String(Math.floor(duration)) : "0";
      progress.value = String(Math.floor(currentTime));
      if (currentTimeDisplay) {
        currentTimeDisplay.textContent = formatTime(currentTime);
      }
      if (remainingTimeDisplay) {
        remainingTimeDisplay.textContent = `-${duration ? formatTime(Math.max(duration - currentTime, 0)) : "0:00"}`;
      }
    };

    const playTrack = (
      index: number,
      options: {
        autoplay?: boolean;
      } = {}
    ) => {
      if (index < 0 || index >= tracks.length) {
        return;
      }

      currentTrackIndex = index;
      const track = tracks[index];
      const shouldAutoplay = options.autoplay ?? isPlaying;

      audio.src = track.url;
      updateTrackInfo();
      updateTrackHighlight();

      if (shouldAutoplay) {
        audio.play().catch((error) => logError(error, "playback blocked"));
      }
    };

    const playNext = () => {
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      playTrack(nextIndex, { autoplay: isPlaying });
    };

    const playPrev = () => {
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        updateProgress();
        return;
      }
      const prevIndex =
        currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
      playTrack(prevIndex, { autoplay: isPlaying });
    };

    const handleToggle = () => {
      if (!tracks.length) {
        return;
      }

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
        const shouldAutoplayNextTrack = true;
        isPlaying = false;
        updateToggleButton();
        updateTrackHighlight();
        if (status) {
          status.textContent = `Finished ${tracks[currentTrackIndex]?.title}`;
        }
        playTrack((currentTrackIndex + 1) % tracks.length, {
          autoplay: shouldAutoplayNextTrack,
        });
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
      }
    };

    player.addEventListener("keydown", handleKeydown, { signal });

    updateToggleButton();
    updateTrackInfo();
    updateTrackHighlight();
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
