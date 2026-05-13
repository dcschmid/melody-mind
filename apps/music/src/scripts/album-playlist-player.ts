import { formatTime } from "@shared-utils/utils/time";
import { trackFathomEvent } from "./fathom-events";

interface PlaylistTrack {
  title: string;
  url: string;
  duration?: number;
  trackNumber: number;
  element: HTMLLIElement;
}

const PROGRESS_UPDATE_INTERVAL = 250;
const MEDIA_SESSION_SEEK_STEP = 10;
const INIT_FLAG_PREFIX = "__mm";
const LOG_PREFIX = "[music]";
const PLAYBACK_STATE_STORAGE_KEY = "melodymind:music-player-state:v1";
const PLAYBACK_STATE_SAVE_INTERVAL = 2_000;

interface SavedPlaybackState {
  albumId: string;
  albumTitle: string;
  albumUrl: string;
  albumArtworkUrl?: string;
  trackIndex: number;
  trackTitle: string;
  trackUrl: string;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  updatedAt: number;
}

const createInitializer = (name: string, init: () => void): (() => void) => {
  const flagName = `${INIT_FLAG_PREFIX}${name}Initialized`;

  return () => {
    const globalFlags = window as unknown as Record<string, unknown>;

    if (globalFlags[flagName]) {
      return;
    }

    globalFlags[flagName] = true;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
      return;
    }

    init();
  };
};

const logError = (error: unknown, context?: string): void => {
  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : "Unknown error";
  const contextSuffix = context ? ` (${context})` : "";

  console.error(`${LOG_PREFIX}${contextSuffix}: ${message}`);
};

const readSavedPlaybackState = (): SavedPlaybackState | null => {
  try {
    const rawState = window.localStorage.getItem(PLAYBACK_STATE_STORAGE_KEY);
    if (!rawState) {
      return null;
    }

    const parsedState = JSON.parse(rawState) as Partial<SavedPlaybackState>;
    if (
      typeof parsedState.albumId !== "string" ||
      typeof parsedState.albumTitle !== "string" ||
      typeof parsedState.albumUrl !== "string" ||
      typeof parsedState.trackIndex !== "number" ||
      typeof parsedState.trackTitle !== "string" ||
      typeof parsedState.trackUrl !== "string"
    ) {
      return null;
    }

    return {
      albumId: parsedState.albumId,
      albumTitle: parsedState.albumTitle,
      albumUrl: parsedState.albumUrl,
      ...(typeof parsedState.albumArtworkUrl === "string"
        ? { albumArtworkUrl: parsedState.albumArtworkUrl }
        : {}),
      trackIndex: Math.max(0, Math.floor(parsedState.trackIndex)),
      trackTitle: parsedState.trackTitle,
      trackUrl: parsedState.trackUrl,
      currentTime:
        typeof parsedState.currentTime === "number" && parsedState.currentTime > 0
          ? parsedState.currentTime
          : 0,
      duration:
        typeof parsedState.duration === "number" && parsedState.duration > 0
          ? parsedState.duration
          : 0,
      isMuted: parsedState.isMuted === true,
      updatedAt:
        typeof parsedState.updatedAt === "number" ? parsedState.updatedAt : Date.now(),
    };
  } catch (error) {
    logError(error, "playback state unavailable");
    return null;
  }
};

const writeSavedPlaybackState = (state: SavedPlaybackState): void => {
  try {
    window.localStorage.setItem(PLAYBACK_STATE_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("melodymind:playback-state", { detail: state }));
  } catch (error) {
    logError(error, "playback state save failed");
  }
};

const initPlaylistPlayers = (): (() => void) => {
  const players = document.querySelectorAll<HTMLDivElement>(
    "[data-album-playlist-player]"
  );
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
    const shuffleButton = player.querySelector<HTMLButtonElement>(
      '[data-action="shuffle"]'
    );
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
    const trackItems = player.querySelectorAll<HTMLLIElement>(
      ".album-playlist-player__track"
    );
    const trackButtons =
      player.querySelectorAll<HTMLButtonElement>("[data-track-button]");

    if (!audio || !toggleButton || !prevButton || !nextButton || !progress) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    const albumTitle = player.dataset.albumTitle || "playlist";
    const albumId = player.dataset.albumId || player.dataset.playerId || albumTitle;
    const albumUrl = player.dataset.albumUrl || window.location.pathname;
    const albumArtworkUrl = player.dataset.albumArtworkUrl || "";
    const nextTrackPreloader = new Audio();
    const savedPlaybackState = readSavedPlaybackState();

    let currentTrackIndex = 0;
    let isPlaying = false;
    let isMuted = savedPlaybackState?.isMuted === true;
    let lastHighlightedIndex = -1;
    let titleTransitionTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastProgressUpdate = 0;
    let lastPlaybackStateSave = 0;
    let isChangingTrackSource = false;
    let pendingInitialSeek =
      savedPlaybackState?.albumId === albumId ? savedPlaybackState.currentTime : 0;
    let preloadedTrackIndex = -1;
    const reducedMotionQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    const tracks: PlaylistTrack[] = [];
    // Keyboard-generated clicks have detail 0; keep them motion-free.
    const shouldAnimateClick = (event: MouseEvent): boolean => event.detail !== 0;

    trackItems.forEach((item) => {
      const index = Number(item.dataset.trackIndex);
      const title = item.dataset.trackTitle || "";
      const url = item.dataset.trackUrl || "";
      const duration = item.dataset.trackDuration
        ? Number(item.dataset.trackDuration)
        : undefined;
      const trackNumber = Number(item.dataset.trackNumber) || index + 1;

      tracks.push({
        title,
        url,
        ...(duration === undefined ? {} : { duration }),
        trackNumber,
        element: item,
      });

      trackButtons[index]?.addEventListener(
        "click",
        (event) => {
          trackFathomEvent("Music: Track Select");
          playTrack(index, {
            autoplay: true,
            triggerPop: shouldAnimateClick(event),
            transition: shouldAnimateClick(event),
          });
        },
        { signal }
      );
    });

    const setStatus = (message: string) => {
      if (status) {
        status.textContent = message;
      }
    };

    const savePlaybackState = (force = false) => {
      const now = Date.now();
      if (!force && now - lastPlaybackStateSave < PLAYBACK_STATE_SAVE_INTERVAL) {
        return;
      }

      const track = tracks[currentTrackIndex];
      if (!track) {
        return;
      }

      lastPlaybackStateSave = now;
      writeSavedPlaybackState({
        albumId,
        albumTitle,
        albumUrl,
        ...(albumArtworkUrl ? { albumArtworkUrl } : {}),
        trackIndex: currentTrackIndex,
        trackTitle: track.title,
        trackUrl: track.url,
        currentTime: Number.isFinite(audio.currentTime)
          ? Math.floor(audio.currentTime)
          : 0,
        duration: Math.floor(getDuration()),
        isMuted,
        updatedAt: now,
      });
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

    const getNextTrackIndex = () =>
      tracks.length ? (currentTrackIndex + 1) % tracks.length : -1;

    const shouldPreloadAudio = (): boolean => {
      const connection = (
        navigator as Navigator & {
          connection?: { effectiveType?: string; saveData?: boolean };
        }
      ).connection;

      if (connection?.saveData) {
        return false;
      }

      return !["slow-2g", "2g"].includes(connection?.effectiveType || "");
    };

    const preloadTrack = (index: number): void => {
      if (!shouldPreloadAudio()) {
        return;
      }

      const track = tracks[index];
      if (!track || index === preloadedTrackIndex) {
        return;
      }

      const source = normalizeTrackUrl(track.url);
      if (!source || getAudioSource() === source) {
        return;
      }

      try {
        nextTrackPreloader.preload = "auto";
        nextTrackPreloader.src = source;
        nextTrackPreloader.load();
        preloadedTrackIndex = index;
      } catch (error) {
        logError(error, "next track preload failed");
      }
    };

    const preloadNextTrack = (): void => {
      if (tracks.length < 2) {
        return;
      }

      preloadTrack(getNextTrackIndex());
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
        ...(albumArtworkUrl
          ? {
              artwork: [
                {
                  src: albumArtworkUrl,
                  sizes: "512x512",
                },
              ],
            }
          : {}),
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

    const updateMutedState = ({ persist = true }: { persist?: boolean } = {}) => {
      audio.muted = isMuted;
      player.dataset.playerMuted = isMuted ? "true" : "false";
      if (volumeButton) {
        volumeButton.setAttribute("aria-label", isMuted ? "Unmute" : "Mute");
        volumeButton.setAttribute("aria-pressed", isMuted ? "true" : "false");
      }
      if (persist) {
        savePlaybackState(true);
      }
    };

    const updateToggleButton = () => {
      toggleButton.dataset.state = isPlaying ? "playing" : "paused";
      toggleButton.setAttribute("aria-pressed", isPlaying ? "true" : "false");
      toggleButton.setAttribute(
        "aria-label",
        `${isPlaying ? "Pause" : "Play"} ${tracks[currentTrackIndex]?.title || albumTitle}`
      );
      player.dataset.playerState = isPlaying ? "playing" : "paused";
      updateMediaSessionPlaybackState();
    };

    const updateTrackHighlight = () => {
      if (!trackItems.length || !tracks[currentTrackIndex]) {
        return;
      }

      const lastTrackItem = trackItems[lastHighlightedIndex];
      const currentTrackItem = trackItems[currentTrackIndex];

      if (lastTrackItem) {
        lastTrackItem.dataset.isPlaying = "false";
        lastTrackItem.dataset.isCurrent = "false";
        trackButtons[lastHighlightedIndex]?.removeAttribute("aria-current");
      }

      if (!currentTrackItem) {
        return;
      }

      currentTrackItem.dataset.isCurrent = "true";
      currentTrackItem.dataset.isPlaying = isPlaying ? "true" : "false";
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
      const remaining =
        Number.isFinite(duration) && Number.isFinite(currentTime)
          ? Math.max(duration - currentTime, 0)
          : 0;
      progress.max = duration ? String(Math.floor(duration)) : "0";
      progress.value = String(Math.floor(currentTime));
      progress.setAttribute(
        "aria-valuetext",
        `${formatTime(currentTime)} elapsed, ${formatTime(remaining)} remaining`
      );
      if (currentTimeDisplay) {
        currentTimeDisplay.textContent = formatTime(currentTime);
      }
      if (remainingTimeDisplay) {
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
      if (!track) {
        return;
      }
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
      preloadNextTrack();
      savePlaybackState(true);

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
      savePlaybackState(true);
    };

    const seekBy = (offset: number) => {
      const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      seekTo(currentTime + offset);
    };

    const playNext = (options: { animate?: boolean } = {}) => {
      if (!tracks.length) {
        return;
      }

      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      playTrack(nextIndex, {
        autoplay: isPlaying,
        triggerPop: isPlaying && options.animate !== false,
        transition: options.animate !== false,
      });
    };

    const playPrev = (options: { animate?: boolean } = {}) => {
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
      playTrack(prevIndex, {
        autoplay: isPlaying,
        triggerPop: isPlaying && options.animate !== false,
        transition: options.animate !== false,
      });
    };

    const playRandom = (options: { animate?: boolean } = {}) => {
      if (!tracks.length) {
        return;
      }

      const availableIndexes = tracks
        .map((_, index) => index)
        .filter((index) => tracks.length === 1 || index !== currentTrackIndex);
      const nextIndex =
        availableIndexes[Math.floor(Math.random() * availableIndexes.length)] ?? 0;

      playTrack(nextIndex, {
        autoplay: true,
        triggerPop: options.animate !== false,
        transition: options.animate !== false,
      });
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
            preloadNextTrack();
          }
          audio.play().catch((error) => logError(error, "media session play blocked"));
        },
        pause: () => audio.pause(),
        previoustrack: () => playPrev({ animate: false }),
        nexttrack: () => playNext({ animate: false }),
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

    const handleToggle = (options: { animate?: boolean } = {}) => {
      if (!tracks.length) {
        return;
      }

      if (options.animate !== false) {
        triggerPop(toggleButton);
      }

      if (audio.paused || audio.ended) {
        const track = tracks[currentTrackIndex];
        if (!track) {
          return;
        }
        setAudioSource(track);
        preloadNextTrack();
        audio.play().catch((error) => logError(error, "playback blocked"));
      } else {
        audio.pause();
      }
    };

    toggleButton.addEventListener(
      "click",
      (event) => handleToggle({ animate: shouldAnimateClick(event) }),
      { signal }
    );
    prevButton.addEventListener(
      "click",
      (event) => playPrev({ animate: shouldAnimateClick(event) }),
      { signal }
    );
    nextButton.addEventListener(
      "click",
      (event) => playNext({ animate: shouldAnimateClick(event) }),
      { signal }
    );
    shuffleButton?.addEventListener(
      "click",
      (event) => playRandom({ animate: shouldAnimateClick(event) }),
      { signal }
    );

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
        trackFathomEvent("Music: Play");
        audio.preload = shouldPreloadAudio() ? "auto" : "metadata";
        updateToggleButton();
        updateTrackHighlight();
        preloadNextTrack();
        setStatus(`Playing ${tracks[currentTrackIndex]?.title}`);
        savePlaybackState(true);
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
        savePlaybackState(true);
      },
      { signal }
    );

    audio.addEventListener(
      "ended",
      () => {
        if (!tracks.length) {
          return;
        }

        audio.currentTime = 0;
        updateProgress(true);

        const nextIndex = getNextTrackIndex();
        const isLastTrack = nextIndex === 0;

        if (isLastTrack) {
          isPlaying = false;
          updateToggleButton();
          updateTrackHighlight();
          player.dataset.playerCelebrating = "true";
          setTimeout(() => {
            player.dataset.playerCelebrating = "false";
          }, 800);
          setStatus(`Finished ${albumTitle}`);
          savePlaybackState(true);
          return;
        }

        setStatus(`Playing next track after ${tracks[currentTrackIndex]?.title}`);
        playTrack(nextIndex, { autoplay: true, transition: false });
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

    audio.addEventListener(
      "timeupdate",
      () => {
        updateProgress();
        savePlaybackState();
      },
      { signal }
    );
    audio.addEventListener(
      "loadedmetadata",
      () => {
        if (pendingInitialSeek > 0) {
          seekTo(pendingInitialSeek);
          pendingInitialSeek = 0;
        }
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
          handleToggle({ animate: false });
          break;
        case "ArrowLeft":
          event.preventDefault();
          playPrev({ animate: false });
          break;
        case "ArrowRight":
          event.preventDefault();
          playNext({ animate: false });
          break;
        case "m":
        case "M":
          event.preventDefault();
          handleVolume();
          break;
      }
    };

    player.addEventListener("keydown", handleKeydown, { signal });

    if (
      savedPlaybackState?.albumId === albumId &&
      savedPlaybackState.trackIndex >= 0 &&
      savedPlaybackState.trackIndex < tracks.length
    ) {
      currentTrackIndex = savedPlaybackState.trackIndex;
    }

    const initialTrack = tracks[currentTrackIndex] ?? tracks[0];
    if (initialTrack) {
      setAudioSource(initialTrack);
    }
    updateToggleButton();
    updateTrackInfo();
    updateTrackHighlight();
    updateMutedState({ persist: false });
    updateMediaSessionMetadata();
    setupMediaSessionActions();
    updateProgress(true);
    preloadNextTrack();

    cleanup.push(() => {
      controller.abort();
      nextTrackPreloader.removeAttribute("src");
      nextTrackPreloader.load();
    });
  });

  return () => {
    cleanup.forEach((fn) => fn());
  };
};

const setupPlaylistPlayers = createInitializer(
  "music-album-playlist-player",
  initPlaylistPlayers
);

setupPlaylistPlayers();
