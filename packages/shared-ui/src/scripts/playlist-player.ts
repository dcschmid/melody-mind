import { formatTime } from "@shared-utils/utils/time";
import { safeLocalStorage } from "@shared-utils/utils/storage/safeStorage";
import { createInitializer } from "./utils/init";
import { logError } from "./utils/error";

type RepeatMode = "off" | "all" | "one";

interface PlaylistPlayerState {
  trackIndex: number;
  trackUrl: string;
  currentTime: number;
  duration: number;
  muted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  updatedAt: string;
}

interface PlaylistTrack {
  title: string;
  url: string;
  duration?: number;
  element: HTMLLIElement;
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const STORAGE_KEY_PREFIX = "mm_playlist_player_v1";
const STATE_WRITE_INTERVAL = 2000;
const RESUME_MIN_TIME = 3;
const RESUME_MIN_REMAINING = 5;
const PROGRESS_UPDATE_INTERVAL = 250;
const VISUALIZER_BIN_COUNT = 5;
const MEDIA_SESSION_SEEK_STEP = 10;

const getPlayerStorageKey = (playerId: string): string =>
  `${STORAGE_KEY_PREFIX}:${playerId || "playlist"}`;

const isRepeatMode = (value: unknown): value is RepeatMode =>
  value === "off" || value === "all" || value === "one";

const sanitizePlayerState = (
  value: unknown,
  tracks: PlaylistTrack[]
): PlaylistPlayerState | null => {
  if (!value || typeof value !== "object" || !tracks.length) {
    return null;
  }

  const candidate = value as Partial<PlaylistPlayerState>;
  const trackIndex = Number(candidate.trackIndex);
  if (
    !Number.isInteger(trackIndex) ||
    trackIndex < 0 ||
    trackIndex >= tracks.length ||
    !tracks[trackIndex]
  ) {
    return null;
  }

  const trackUrl = typeof candidate.trackUrl === "string" ? candidate.trackUrl : "";
  if (trackUrl && trackUrl !== tracks[trackIndex].url) {
    return null;
  }

  const currentTime = Number(candidate.currentTime);
  const duration = Number(candidate.duration);
  const repeat = isRepeatMode(candidate.repeat) ? candidate.repeat : "off";

  return {
    trackIndex,
    trackUrl: tracks[trackIndex].url,
    currentTime: Number.isFinite(currentTime) ? Math.max(0, currentTime) : 0,
    duration: Number.isFinite(duration) ? Math.max(0, duration) : 0,
    muted: candidate.muted === true,
    shuffle: candidate.shuffle === true,
    repeat,
    updatedAt:
      typeof candidate.updatedAt === "string" && candidate.updatedAt.trim()
        ? candidate.updatedAt
        : new Date(0).toISOString(),
  };
};

const loadPlayerState = (
  storageKey: string,
  tracks: PlaylistTrack[]
): PlaylistPlayerState | null =>
  sanitizePlayerState(safeLocalStorage.get<unknown>(storageKey, null), tracks);

const savePlayerState = (storageKey: string, state: PlaylistPlayerState): boolean =>
  safeLocalStorage.set(storageKey, state);

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
    const trackButtons =
      player.querySelectorAll<HTMLButtonElement>("[data-track-button]");

    if (!audio || !toggleButton || !prevButton || !nextButton || !progress) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    const albumTitle = player.dataset.albumTitle || "playlist";
    const albumArtworkUrl = player.dataset.albumArtworkUrl || "";
    const playerId = player.dataset.playerId || albumTitle;
    const storageKey = getPlayerStorageKey(playerId);

    let currentTrackIndex = 0;
    let isPlaying = false;
    let isMuted = false;
    let isShuffled = false;
    let repeatMode: RepeatMode = "off";
    let shuffledIndices: number[] = [];
    let currentShuffleIndex = 0;
    let lastHighlightedIndex = -1;
    let titleTransitionTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastProgressUpdate = 0;
    let lastStateWrite = 0;
    let pendingResumeTime: number | null = null;
    let resumeApplied = false;
    let visualizerFrame = 0;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let frequencyData: Uint8Array | null = null;
    let audioGraphReady = false;
    let audioGraphUnavailable = false;
    const visualizerBars = Array.from(
      player.querySelectorAll<HTMLElement>(".playlist-player__visualizer > span")
    );
    const tracks: PlaylistTrack[] = [];

    trackItems.forEach((item) => {
      const index = Number(item.dataset.trackIndex);
      const title = item.dataset.trackTitle || "";
      const url = item.dataset.trackUrl || "";
      const duration = item.dataset.trackDuration
        ? Number(item.dataset.trackDuration)
        : undefined;

      tracks.push({ title, url, duration, element: item });

      trackButtons[index]?.addEventListener(
        "click",
        () => playTrack(index, { triggerPop: true }),
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

    const resetVisualizer = () => {
      if (visualizerFrame) {
        cancelAnimationFrame(visualizerFrame);
        visualizerFrame = 0;
      }

      visualizerBars.forEach((bar) => {
        bar.style.removeProperty("--playlist-bar-scale");
      });
    };

    const initAudioGraph = async () => {
      if (audioGraphReady || audioGraphUnavailable || !visualizerBars.length) {
        return audioGraphReady;
      }

      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextConstructor) {
        audioGraphUnavailable = true;
        return false;
      }

      try {
        audioContext = new AudioContextConstructor();
        const source = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.78;
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
        audioGraphReady = true;
        player.dataset.playerVisualizer = "audio";
        return true;
      } catch (error) {
        audioGraphUnavailable = true;
        logError(error, "playlist visualizer unavailable");
        return false;
      }
    };

    const renderVisualizer = () => {
      if (!isPlaying || !analyser || !frequencyData || !visualizerBars.length) {
        resetVisualizer();
        return;
      }

      analyser.getByteFrequencyData(frequencyData);
      const bandSize = Math.max(
        1,
        Math.floor(frequencyData.length / VISUALIZER_BIN_COUNT)
      );

      visualizerBars.forEach((bar, index) => {
        const start = index * bandSize;
        const end = Math.min(start + bandSize, frequencyData?.length ?? 0);
        let total = 0;

        for (let i = start; i < end; i += 1) {
          total += frequencyData[i] ?? 0;
        }

        const average = end > start ? total / (end - start) : 0;
        const scale = 0.25 + (average / 255) * 0.95;
        bar.style.setProperty("--playlist-bar-scale", scale.toFixed(3));
      });

      visualizerFrame = requestAnimationFrame(renderVisualizer);
    };

    const startVisualizer = async () => {
      const ready = await initAudioGraph();
      if (!ready || !audioContext) {
        return;
      }

      if (audioContext.state === "suspended") {
        await audioContext.resume().catch((error) => {
          logError(error, "playlist visualizer resume blocked");
        });
      }

      if (!visualizerFrame) {
        visualizerFrame = requestAnimationFrame(renderVisualizer);
      }
    };

    const updateShuffleState = () => {
      player.dataset.playerShuffle = isShuffled ? "true" : "false";
      if (shuffleButton) {
        shuffleButton.setAttribute("aria-pressed", isShuffled ? "true" : "false");
      }
    };

    const rebuildShuffleQueue = () => {
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
    };

    const updateRepeatState = () => {
      player.dataset.playerRepeat = repeatMode;
      if (repeatButton) {
        repeatButton.setAttribute("aria-label", `Repeat: ${repeatMode}`);
        repeatButton.setAttribute(
          "aria-pressed",
          repeatMode !== "off" ? "true" : "false"
        );
      }
    };

    const updateMutedState = () => {
      audio.muted = isMuted;
      player.dataset.playerMuted = isMuted ? "true" : "false";
      if (volumeButton) {
        volumeButton.setAttribute("aria-label", isMuted ? "Unmute" : "Mute");
        volumeButton.setAttribute("aria-pressed", isMuted ? "true" : "false");
      }
    };

    const getPersistedCurrentTime = () => {
      const duration = getDuration();
      const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;

      if (
        currentTime >= RESUME_MIN_TIME &&
        (!duration || duration - currentTime >= RESUME_MIN_REMAINING)
      ) {
        return currentTime;
      }

      return 0;
    };

    const persistState = (force = false) => {
      const now = Date.now();
      if (!force && now - lastStateWrite < STATE_WRITE_INTERVAL) {
        return;
      }

      const track = tracks[currentTrackIndex];
      if (!track) {
        return;
      }

      lastStateWrite = now;
      savePlayerState(storageKey, {
        trackIndex: currentTrackIndex,
        trackUrl: track.url,
        currentTime: getPersistedCurrentTime(),
        duration: getDuration(),
        muted: isMuted,
        shuffle: isShuffled,
        repeat: repeatMode,
        updatedAt: new Date().toISOString(),
      });
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
      persistState();
    };

    const applyResumeTime = () => {
      if (resumeApplied || pendingResumeTime === null) {
        return;
      }

      const duration = getDuration();
      const safeTime = duration
        ? Math.min(pendingResumeTime, Math.max(duration - RESUME_MIN_REMAINING, 0))
        : pendingResumeTime;

      if (safeTime >= RESUME_MIN_TIME) {
        audio.currentTime = safeTime;
        setStatus(
          `Ready to resume ${tracks[currentTrackIndex]?.title || albumTitle} at ${formatTime(safeTime)}`
        );
      }

      pendingResumeTime = null;
      resumeApplied = true;
      updateProgress(true);
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
      pendingResumeTime = null;
      resumeApplied = true;
      updateTrackHighlight();
      updateProgress(true);
      updateMediaSessionMetadata();
      persistState(true);

      if (shouldAutoplay) {
        audio.play().catch((error) => logError(error, "playback blocked"));
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
      persistState(true);
    };

    const seekBy = (offset: number) => {
      const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      seekTo(currentTime + offset);
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
        updateProgress(true);
        persistState(true);
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

    const setupMediaSessionActions = () => {
      if (!("mediaSession" in navigator)) {
        return;
      }

      const setActionHandler = navigator.mediaSession.setActionHandler.bind(
        navigator.mediaSession
      );
      const actions: Partial<Record<MediaSessionAction, MediaSessionActionHandler>> = {
        play: () => {
          startVisualizer();
          if (audio.src !== tracks[currentTrackIndex]?.url) {
            audio.src = tracks[currentTrackIndex]?.url || "";
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
        startVisualizer();
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
      updateMutedState();
      persistState(true);
    };

    volumeButton?.addEventListener("click", handleVolume, { signal });

    const handleShuffle = () => {
      isShuffled = !isShuffled;
      updateShuffleState();
      if (isShuffled) {
        rebuildShuffleQueue();
      }
      persistState(true);
    };

    const handleRepeat = () => {
      const modes: RepeatMode[] = ["off", "all", "one"];
      const currentIdx = modes.indexOf(repeatMode);
      repeatMode = modes[(currentIdx + 1) % modes.length];
      updateRepeatState();
      persistState(true);
    };

    shuffleButton?.addEventListener("click", handleShuffle, { signal });
    repeatButton?.addEventListener("click", handleRepeat, { signal });

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
        startVisualizer();
        setStatus(`Playing ${tracks[currentTrackIndex]?.title}`);
        persistState(true);
      },
      { signal }
    );

    audio.addEventListener(
      "pause",
      () => {
        isPlaying = false;
        updateToggleButton();
        updateTrackHighlight();
        resetVisualizer();
        setStatus(`Paused ${tracks[currentTrackIndex]?.title}`);
        persistState(true);
      },
      { signal }
    );

    audio.addEventListener(
      "ended",
      () => {
        isPlaying = false;
        updateToggleButton();
        updateTrackHighlight();
        resetVisualizer();
        setStatus(`Finished ${tracks[currentTrackIndex]?.title}`);
        audio.currentTime = 0;
        updateProgress(true);
        persistState(true);

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
          setStatus(`Finished ${albumTitle}`);
          return;
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
        applyResumeTime();
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

    const savedState = loadPlayerState(storageKey, tracks);
    if (savedState) {
      currentTrackIndex = savedState.trackIndex;
      isMuted = savedState.muted;
      isShuffled = savedState.shuffle;
      repeatMode = savedState.repeat;
      pendingResumeTime =
        savedState.currentTime >= RESUME_MIN_TIME ? savedState.currentTime : null;
      if (isShuffled) {
        rebuildShuffleQueue();
      }
    }

    if (tracks.length > 0) {
      audio.src = tracks[currentTrackIndex]?.url || tracks[0].url;
    }
    updateToggleButton();
    updateTrackInfo();
    updateTrackHighlight();
    updateMutedState();
    updateShuffleState();
    updateRepeatState();
    updateMediaSessionMetadata();
    setupMediaSessionActions();
    updateProgress(true);
    if (savedState && pendingResumeTime !== null) {
      setStatus(
        `Ready to resume ${tracks[currentTrackIndex]?.title || albumTitle} at ${formatTime(pendingResumeTime)}`
      );
    }

    cleanup.push(() => {
      resetVisualizer();
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close().catch((error) => {
          logError(error, "playlist visualizer close failed");
        });
      }
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
