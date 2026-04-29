import { formatTime } from "@shared-utils/utils/time";
import { createInitializer } from "./utils/init";
import { logError } from "./utils/error";

interface PlaylistTrack {
  title: string;
  url: string;
  duration?: number;
  trackNumber: number;
  element: HTMLLIElement;
}

const PROGRESS_UPDATE_INTERVAL = 250;
const MEDIA_SESSION_SEEK_STEP = 10;

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
    const trackButtons =
      player.querySelectorAll<HTMLButtonElement>("[data-track-button]");

    if (!audio || !toggleButton || !prevButton || !nextButton || !progress) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    const albumTitle = player.dataset.albumTitle || "playlist";
    const albumArtworkUrl = player.dataset.albumArtworkUrl || "";

    let currentTrackIndex = 0;
    let isPlaying = false;
    let isMuted = false;
    let lastHighlightedIndex = -1;
    let titleTransitionTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastProgressUpdate = 0;
    let isChangingTrackSource = false;
    const reducedMotionQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    const tracks: PlaylistTrack[] = [];

    trackItems.forEach((item) => {
      const index = Number(item.dataset.trackIndex);
      const title = item.dataset.trackTitle || "";
      const url = item.dataset.trackUrl || "";
      const duration = item.dataset.trackDuration
        ? Number(item.dataset.trackDuration)
        : undefined;
      const trackNumber = Number(item.dataset.trackNumber) || index + 1;

      tracks.push({ title, url, duration, trackNumber, element: item });

      trackButtons[index]?.addEventListener(
        "click",
        () => playTrack(index, { autoplay: true, triggerPop: true }),
        { signal }
      );
    });

    const setStatus = (message: string) => {
      if (status) {
        status.textContent = message;
      }
    };

    const getDuration = () => {
      if (Number.isFinite(audio.duration)) {
        return audio.duration;
      }

      return tracks[currentTrackIndex]?.duration ?? 0;
    };

    const normalizeTrackUrl = (url: string): string => {
      try {
        return new URL(url, window.location.href).href;
      } catch {
        return url;
      }
    };

    const getAudioSource = (): string => audio.currentSrc || audio.src;

    const setAudioSource = (track: PlaylistTrack): boolean => {
      const nextSource = normalizeTrackUrl(track.url);
      if (!nextSource || getAudioSource() === nextSource) {
        return false;
      }

      audio.src = nextSource;
      audio.load();
      return true;
    };

    const hasMediaSession = () =>
      "mediaSession" in navigator && typeof window.MediaMetadata === "function";

    const updateMediaSessionPlaybackState = () => {
      if (!("mediaSession" in navigator)) {
        return;
      }

      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    };

    const updateMediaSessionMetadata = () => {
      if (!hasMediaSession()) {
        return;
      }

      const track = tracks[currentTrackIndex];
      if (!track) {
        return;
      }

      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: "MelodyMind",
        album: albumTitle,
        artwork: albumArtworkUrl
          ? [
              {
                src: albumArtworkUrl,
                sizes: "512x512",
              },
            ]
          : undefined,
      });
    };

    const updateMediaSessionPosition = () => {
      if (!("mediaSession" in navigator) || !navigator.mediaSession.setPositionState) {
        return;
      }

      const duration = getDuration();
      const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;

      if (!Number.isFinite(duration) || duration <= 0) {
        return;
      }

      try {
        navigator.mediaSession.setPositionState({
          duration,
          playbackRate: audio.playbackRate || 1,
          position: Math.min(Math.max(currentTime, 0), duration),
        });
      } catch (error) {
        logError(error, "playlist media session position unavailable");
      }
    };

    const prefersReducedMotion = (): boolean => reducedMotionQuery?.matches === true;

    const updateMutedState = () => {
      audio.muted = isMuted;
      player.dataset.playerMuted = isMuted ? "true" : "false";
      if (volumeButton) {
        volumeButton.setAttribute("aria-label", isMuted ? "Unmute" : "Mute");
        volumeButton.setAttribute("aria-pressed", isMuted ? "true" : "false");
      }
    };

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
      updateMediaSessionPlaybackState();
    };

    const updateTrackHighlight = () => {
      if (!trackItems.length || !tracks[currentTrackIndex]) {
        return;
      }

      if (lastHighlightedIndex !== -1 && lastHighlightedIndex < trackItems.length) {
        trackItems[lastHighlightedIndex].dataset.isPlaying = "false";
        trackItems[lastHighlightedIndex].dataset.isCurrent = "false";
        trackButtons[lastHighlightedIndex]?.removeAttribute("aria-current");
      }
      trackItems[currentTrackIndex].dataset.isCurrent = "true";
      trackItems[currentTrackIndex].dataset.isPlaying = isPlaying ? "true" : "false";
      trackButtons[currentTrackIndex]?.setAttribute("aria-current", "true");
      lastHighlightedIndex = currentTrackIndex;
    };

    const updateTrackInfo = () => {
      const track = tracks[currentTrackIndex];
      if (trackTitleDisplay) {
        trackTitleDisplay.textContent = track?.title || "Click play to start";
      }
    };

    const updateProgress = (force = false) => {
      const now = performance.now();
      if (!force && now - lastProgressUpdate < PROGRESS_UPDATE_INTERVAL) {
        return;
      }
      lastProgressUpdate = now;
      const duration = getDuration();
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
      updateMediaSessionPosition();
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

      if (trackTitleDisplay && options.transition !== false && !prefersReducedMotion()) {
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

      if (shouldAutoplay) {
        isChangingTrackSource = true;
      }
      const sourceChanged = setAudioSource(track);
      if (!sourceChanged) {
        isChangingTrackSource = false;
      }
      updateTrackHighlight();
      updateProgress(true);
      updateMediaSessionMetadata();

      if (shouldAutoplay) {
        audio
          .play()
          .catch((error) => {
            isPlaying = false;
            updateToggleButton();
            updateTrackHighlight();
            logError(error, "playback blocked");
          })
          .finally(() => {
            isChangingTrackSource = false;
          });
      }
    };

    const seekTo = (time: number) => {
      const duration = getDuration();
      const upperBound = duration > 0 ? duration : Number.MAX_SAFE_INTEGER;
      const nextTime = Math.min(Math.max(time, 0), upperBound);

      if (typeof audio.fastSeek === "function") {
        audio.fastSeek(nextTime);
      } else {
        audio.currentTime = nextTime;
      }

      updateProgress(true);
    };

    const seekBy = (offset: number) => {
      const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      seekTo(currentTime + offset);
    };

    const playNext = () => {
      if (!tracks.length) {
        return;
      }

      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      playTrack(nextIndex, { autoplay: isPlaying, triggerPop: isPlaying });
    };

    const playPrev = () => {
      if (!tracks.length) {
        return;
      }

      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        updateProgress(true);
        return;
      }
      const prevIndex =
        currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
      playTrack(prevIndex, { autoplay: isPlaying, triggerPop: isPlaying });
    };

    const setupMediaSessionActions = () => {
      if (!("mediaSession" in navigator) || !tracks.length) {
        return;
      }

      const setActionHandler = navigator.mediaSession.setActionHandler.bind(
        navigator.mediaSession
      );
      const actions: Partial<Record<MediaSessionAction, MediaSessionActionHandler>> = {
        play: () => {
          const track = tracks[currentTrackIndex];
          if (track) {
            setAudioSource(track);
          }
          audio.play().catch((error) => logError(error, "media session play blocked"));
        },
        pause: () => audio.pause(),
        previoustrack: playPrev,
        nexttrack: playNext,
        seekbackward: (details) =>
          seekBy(-(details.seekOffset || MEDIA_SESSION_SEEK_STEP)),
        seekforward: (details) => seekBy(details.seekOffset || MEDIA_SESSION_SEEK_STEP),
        seekto: (details) => {
          if (Number.isFinite(details.seekTime)) {
            seekTo(details.seekTime || 0);
          }
        },
      };

      Object.entries(actions).forEach(([action, handler]) => {
        try {
          setActionHandler(action as MediaSessionAction, handler || null);
        } catch {
          // Browsers expose different Media Session action sets.
        }
      });
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
        setAudioSource(tracks[currentTrackIndex]);
        audio.play().catch((error) => logError(error, "playback blocked"));
      } else {
        audio.pause();
      }
    };

    toggleButton.addEventListener("click", handleToggle, { signal });
    prevButton.addEventListener("click", playPrev, { signal });
    nextButton.addEventListener("click", playNext, { signal });

    const handleVolume = () => {
      if (!tracks.length) {
        return;
      }

      isMuted = !isMuted;
      updateMutedState();
    };

    volumeButton?.addEventListener("click", handleVolume, { signal });

    progress.addEventListener(
      "input",
      () => {
        seekTo(Number(progress.value));
      },
      { signal }
    );

    audio.addEventListener(
      "play",
      () => {
        isPlaying = true;
        updateToggleButton();
        updateTrackHighlight();
        setStatus(`Playing ${tracks[currentTrackIndex]?.title}`);
      },
      { signal }
    );

    audio.addEventListener(
      "pause",
      () => {
        if (isChangingTrackSource) {
          return;
        }

        isPlaying = false;
        updateToggleButton();
        updateTrackHighlight();
        setStatus(`Paused ${tracks[currentTrackIndex]?.title}`);
      },
      { signal }
    );

    audio.addEventListener(
      "ended",
      () => {
        if (!tracks.length) {
          return;
        }

        isPlaying = false;
        updateToggleButton();
        updateTrackHighlight();
        setStatus(`Finished ${tracks[currentTrackIndex]?.title}`);
        audio.currentTime = 0;
        updateProgress(true);

        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        const isLastTrack = nextIndex === 0;

        if (isLastTrack) {
          player.dataset.playerCelebrating = "true";
          setTimeout(() => {
            player.dataset.playerCelebrating = "false";
          }, 800);
          setStatus(`Finished ${albumTitle}`);
          return;
        }

        playTrack(nextIndex, { autoplay: true });
      },
      { signal }
    );

    audio.addEventListener(
      "error",
      () => {
        setStatus(`Could not load ${tracks[currentTrackIndex]?.title}`);
        logError(
          new Error(`Failed to load track: ${tracks[currentTrackIndex]?.url}`),
          "audio error"
        );
      },
      { signal }
    );

    audio.addEventListener("timeupdate", () => updateProgress(), { signal });
    audio.addEventListener(
      "loadedmetadata",
      () => {
        updateProgress(true);
      },
      { signal }
    );

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.target !== player && !player.contains(event.target as Node)) {
        return;
      }
      if (
        event.target instanceof HTMLButtonElement ||
        event.target instanceof HTMLAnchorElement ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLSelectElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
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
        case "m":
        case "M":
          event.preventDefault();
          handleVolume();
          break;
      }
    };

    player.addEventListener("keydown", handleKeydown, { signal });

    if (tracks.length > 0) {
      setAudioSource(tracks[currentTrackIndex] || tracks[0]);
    }
    updateToggleButton();
    updateTrackInfo();
    updateTrackHighlight();
    updateMutedState();
    updateMediaSessionMetadata();
    setupMediaSessionActions();
    updateProgress(true);

    cleanup.push(() => {
      controller.abort();
    });
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
