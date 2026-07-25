import { formatTime } from "@utils/time";
import type {
  PlayerAlbumContext,
  PlayerCommand,
  PlayerLoadDetail,
  PlayerQueue,
  PlayerState,
  RadioPlayerTrack,
} from "../../types/player";
import type { RadioEventDetail } from "../../types/radio";
import { isPlayerQueue, loadPlayerQueue } from "./player-queue-loader";
import { writeSeriesMarathonProgress } from "./series-marathon-storage";

const STORAGE_KEY = "melodymind:music-player-state:v4";
const V3_STORAGE_KEY = "melodymind:music-player-state:v3";
const V2_STORAGE_KEY = "melodymind:music-player-state:v2";
const LEGACY_STORAGE_KEY = "melodymind:music-player-state:v1";
const SAVE_INTERVAL = 2_000;
const PRELOAD_THRESHOLD_SECONDS = 30;
const DUCKED_VOLUME = 0.2;

interface NavigatorWithConnection extends Navigator {
  connection?: {
    saveData?: boolean;
  };
}

interface StoredPlayerState extends Omit<
  PlayerState,
  "isPlaying" | "playbackPhase" | "errorMessage"
> {
  version: 4;
}

const dispatchRadioEvent = (detail: RadioEventDetail): void => {
  window.dispatchEvent(
    new CustomEvent<RadioEventDetail>("melodymind:radio-event", { detail })
  );
};

const getTrackAlbum = (
  queue: PlayerQueue,
  trackIndex: number
): PlayerAlbumContext | null => {
  if (queue.kind === "album") {
    return queue.album;
  }

  return queue.tracks[trackIndex]?.album || null;
};

const localizeArtworkUrl = (artworkUrl?: string): string | undefined => {
  if (!artworkUrl) {
    return undefined;
  }

  try {
    const url = new URL(artworkUrl, window.location.href);
    if (
      ["melody-mind.de", "www.melody-mind.de"].includes(url.hostname) &&
      url.pathname.startsWith("/assets/")
    ) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return artworkUrl;
  }

  return artworkUrl;
};

const localizeQueueArtwork = (queue: PlayerQueue): PlayerQueue => {
  if (queue.kind === "album") {
    const artworkUrl = localizeArtworkUrl(queue.album.artworkUrl);
    return {
      ...queue,
      album: {
        ...queue.album,
        ...(artworkUrl ? { artworkUrl } : {}),
      },
    };
  }

  if (queue.kind === "radio") {
    return {
      ...queue,
      tracks: queue.tracks.map((track) => {
        const artworkUrl = localizeArtworkUrl(track.album.artworkUrl);
        return {
          ...track,
          album: {
            ...track.album,
            ...(artworkUrl ? { artworkUrl } : {}),
          },
        };
      }),
    };
  }

  return {
    ...queue,
    tracks: queue.tracks.map((track) => {
      const artworkUrl = localizeArtworkUrl(track.album.artworkUrl);
      return {
        ...track,
        album: {
          ...track.album,
          ...(artworkUrl ? { artworkUrl } : {}),
        },
      };
    }),
  };
};

const readStoredState = (): StoredPlayerState | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredPlayerState>;
      if (parsed.version === 4 && isPlayerQueue(parsed.queue)) {
        return {
          version: 4,
          queue: localizeQueueArtwork(parsed.queue),
          currentTrackIndex: Math.max(0, Math.floor(parsed.currentTrackIndex || 0)),
          currentTime: Math.max(0, Number(parsed.currentTime) || 0),
          duration: Math.max(0, Number(parsed.duration) || 0),
          isMuted: parsed.isMuted === true,
          seriesIntermission: parsed.seriesIntermission || null,
          updatedAt: Number(parsed.updatedAt) || Date.now(),
        };
      }
    }

    const v3Raw = window.localStorage.getItem(V3_STORAGE_KEY);
    if (v3Raw) {
      const v3 = JSON.parse(v3Raw) as Partial<PlayerState> & { version?: number };
      if (v3.version === 3 && isPlayerQueue(v3.queue)) {
        const migrated: StoredPlayerState = {
          version: 4,
          queue: localizeQueueArtwork(v3.queue),
          currentTrackIndex: Math.max(0, Math.floor(v3.currentTrackIndex || 0)),
          currentTime: Math.max(0, Number(v3.currentTime) || 0),
          duration: Math.max(0, Number(v3.duration) || 0),
          isMuted: v3.isMuted === true,
          seriesIntermission: null,
          updatedAt: Number(v3.updatedAt) || Date.now(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        window.localStorage.removeItem(V3_STORAGE_KEY);
        return migrated;
      }
    }

    const v2Raw = window.localStorage.getItem(V2_STORAGE_KEY);
    if (v2Raw) {
      const v2 = JSON.parse(v2Raw) as Record<string, unknown>;
      const legacyQueue =
        v2.queue && typeof v2.queue === "object"
          ? (v2.queue as Record<string, unknown>)
          : null;
      const legacyTracks = Array.isArray(legacyQueue?.tracks) ? legacyQueue.tracks : [];
      if (
        legacyQueue &&
        typeof legacyQueue.albumId === "string" &&
        typeof legacyQueue.albumTitle === "string" &&
        typeof legacyQueue.albumUrl === "string" &&
        legacyTracks.length > 0
      ) {
        const queue: PlayerQueue = {
          kind: "album",
          queueId: `album:${legacyQueue.albumId}`,
          title: legacyQueue.albumTitle,
          url: legacyQueue.albumUrl,
          album: {
            id: legacyQueue.albumId,
            title: legacyQueue.albumTitle,
            url: legacyQueue.albumUrl,
            ...(typeof legacyQueue.albumArtworkUrl === "string"
              ? { artworkUrl: legacyQueue.albumArtworkUrl }
              : {}),
          },
          tracks: legacyTracks as PlayerQueue["tracks"],
        };
        const migrated: StoredPlayerState = {
          version: 4,
          queue: localizeQueueArtwork(queue),
          currentTrackIndex: Math.max(0, Math.floor(Number(v2.currentTrackIndex) || 0)),
          currentTime: Math.max(0, Number(v2.currentTime) || 0),
          duration: Math.max(0, Number(v2.duration) || 0),
          isMuted: v2.isMuted === true,
          seriesIntermission: null,
          updatedAt: Number(v2.updatedAt) || Date.now(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        window.localStorage.removeItem(V2_STORAGE_KEY);
        return migrated;
      }
    }

    const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacyRaw) {
      return null;
    }

    const legacy = JSON.parse(legacyRaw) as Record<string, unknown>;
    if (
      typeof legacy.albumId !== "string" ||
      typeof legacy.albumTitle !== "string" ||
      typeof legacy.albumUrl !== "string" ||
      typeof legacy.trackTitle !== "string" ||
      typeof legacy.trackUrl !== "string"
    ) {
      return null;
    }

    const migrated: StoredPlayerState = {
      version: 4,
      queue: {
        kind: "album",
        queueId: `album:${legacy.albumId}`,
        title: legacy.albumTitle,
        url: legacy.albumUrl,
        album: {
          id: legacy.albumId,
          title: legacy.albumTitle,
          url: legacy.albumUrl,
          ...(typeof legacy.albumArtworkUrl === "string"
            ? {
                artworkUrl:
                  localizeArtworkUrl(legacy.albumArtworkUrl) || legacy.albumArtworkUrl,
              }
            : {}),
        },
        tracks: [
          {
            trackNumber:
              typeof legacy.trackIndex === "number" ? legacy.trackIndex + 1 : 1,
            title: legacy.trackTitle,
            audioUrl: legacy.trackUrl,
            ...(typeof legacy.duration === "number"
              ? { durationSeconds: legacy.duration }
              : {}),
          },
        ],
      },
      currentTrackIndex: 0,
      currentTime: typeof legacy.currentTime === "number" ? legacy.currentTime : 0,
      duration: typeof legacy.duration === "number" ? legacy.duration : 0,
      isMuted: legacy.isMuted === true,
      seriesIntermission: null,
      updatedAt: typeof legacy.updatedAt === "number" ? legacy.updatedAt : Date.now(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    window.localStorage.removeItem(V2_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    return migrated;
  } catch {
    return null;
  }
};

const initGlobalPlayer = (): void => {
  if (window.__melodyMindPlayer) {
    return;
  }

  const root = document.querySelector<HTMLElement>("[data-global-player]");
  if (!root) {
    return;
  }
  const audio = document.createElement("audio");
  audio.preload = "metadata";
  audio.crossOrigin = "anonymous";
  audio.dataset.globalPlayerAudio = "";
  root.append(audio);
  let audioContext: AudioContext | null = null;
  let mediaElementSource: MediaElementAudioSourceNode | null = null;
  let analyser: AnalyserNode | null = null;
  let analyserData: Uint8Array<ArrayBuffer> | null = null;
  let volumeBeforeDucking = 1;
  let isDucked = false;

  const artwork = root.querySelector<HTMLImageElement>("[data-global-player-artwork]");
  const albumLink = root.querySelector<HTMLAnchorElement>("[data-global-player-link]");
  const trackText = root.querySelector<HTMLElement>("[data-global-player-track]");
  const albumText = root.querySelector<HTMLElement>("[data-global-player-album]");
  const messageText = root.querySelector<HTMLElement>("[data-global-player-message]");
  const seriesMeta = root.querySelector<HTMLElement>("[data-global-player-series-meta]");
  const intermission = root.querySelector<HTMLElement>("[data-series-intermission]");
  const intermissionPart = root.querySelector<HTMLElement>(
    "[data-series-intermission-part]"
  );
  const intermissionTitle = root.querySelector<HTMLElement>(
    "[data-series-intermission-title]"
  );
  const intermissionSummary = root.querySelector<HTMLElement>(
    "[data-series-intermission-summary]"
  );
  const intermissionArtwork = root.querySelector<HTMLImageElement>(
    "[data-series-intermission-artwork]"
  );
  const intermissionLink = root.querySelector<HTMLAnchorElement>(
    "[data-series-intermission-link]"
  );
  const currentText = root.querySelector<HTMLElement>("[data-global-player-current]");
  const remainingText = root.querySelector<HTMLElement>("[data-global-player-remaining]");
  const progress = root.querySelector<HTMLInputElement>("[data-global-player-progress]");
  const status = root.querySelector<HTMLElement>("[data-global-player-status]");
  const toggle = root.querySelector<HTMLButtonElement>(
    '[data-global-player-action="toggle"]'
  );
  const mute = root.querySelector<HTMLButtonElement>(
    '[data-global-player-action="mute"]'
  );
  const driveLink = root.querySelector<HTMLAnchorElement>("[data-global-player-drive]");
  const controller = new AbortController();
  const { signal } = controller;
  const playerResizeObserver =
    typeof ResizeObserver === "function"
      ? new ResizeObserver(() => {
          document.body.style.setProperty(
            "--global-player-offset",
            `${root.offsetHeight}px`
          );
        })
      : null;
  playerResizeObserver?.observe(root);
  const restored = readStoredState();
  let state: PlayerState = {
    queue: restored?.queue || null,
    currentTrackIndex: restored?.currentTrackIndex || 0,
    currentTime: restored?.currentTime || 0,
    duration: restored?.duration || 0,
    isMuted: restored?.isMuted === true,
    isPlaying: false,
    playbackPhase: restored?.queue ? "paused" : "idle",
    errorMessage: null,
    seriesIntermission: restored?.seriesIntermission || null,
    updatedAt: restored?.updatedAt || Date.now(),
  };
  let pendingSeek = state.currentTime;
  let lastSave = 0;
  let preloadedUrl = "";
  let playerView: "expanded" | "compact" = "expanded";
  let hasFinished = false;
  let pendingTrackReason: Extract<RadioEventDetail, { type: "track_started" }>["reason"] =
    "resume";
  let lastStartedRadioTrack = "";
  let radioSession: {
    stationId: string;
    queueId: string;
    listenedMilliseconds: number;
    playingSince: number | null;
    tracksStarted: number;
    skips: number;
  } | null = null;
  const nextTrackPreloader = new Audio();
  nextTrackPreloader.preload = "metadata";

  const getTrack = () => state.queue?.tracks[state.currentTrackIndex];
  const getDuration = () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      return audio.duration;
    }
    return getTrack()?.durationSeconds || state.duration || 0;
  };

  const derivePlaybackPhase = (isPlaying: boolean): PlayerState["playbackPhase"] => {
    if (state.errorMessage) {
      return "error";
    }
    if (state.seriesIntermission) {
      return "intermission";
    }
    if (hasFinished) {
      return "finished";
    }
    if (!state.queue) {
      return "idle";
    }
    if (
      state.playbackPhase === "loading" &&
      audio.readyState < HTMLMediaElement.HAVE_METADATA
    ) {
      return "loading";
    }
    if (
      state.playbackPhase === "buffering" &&
      !audio.paused &&
      audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA
    ) {
      return "buffering";
    }
    return isPlaying ? "playing" : "paused";
  };

  const snapshot = (): PlayerState => {
    const queue = state.queue;
    const clonedQueue: PlayerQueue | null = queue
      ? queue.kind === "album"
        ? {
            ...queue,
            album: { ...queue.album },
            tracks: queue.tracks.map((track) => ({ ...track })),
          }
        : queue.kind === "radio"
          ? {
              ...queue,
              tracks: queue.tracks.map((track) => ({
                ...track,
                album: { ...track.album },
              })),
            }
          : {
              ...queue,
              series: { ...queue.series },
              transitions: queue.transitions.map((transition) => ({ ...transition })),
              tracks: queue.tracks.map((track) => ({
                ...track,
                album: { ...track.album },
              })),
            }
      : null;
    return {
      ...state,
      queue: clonedQueue,
      seriesIntermission: state.seriesIntermission
        ? { ...state.seriesIntermission }
        : null,
    };
  };

  const announce = (message: string) => {
    if (status) {
      status.textContent = message;
    }
  };

  const updateRadioListeningTime = (): void => {
    if (!radioSession?.playingSince) {
      return;
    }
    radioSession.listenedMilliseconds += performance.now() - radioSession.playingSince;
    radioSession.playingSince = null;
  };

  const startRadioSession = (restoredSession: boolean): void => {
    if (state.queue?.kind !== "radio") {
      return;
    }
    radioSession = {
      stationId: state.queue.stationId,
      queueId: state.queue.queueId,
      listenedMilliseconds: 0,
      playingSince: null,
      tracksStarted: 0,
      skips: 0,
    };
    dispatchRadioEvent({
      type: "session_started",
      stationId: state.queue.stationId,
      queueId: state.queue.queueId,
      queueLength: state.queue.tracks.length,
      restored: restoredSession,
      timestamp: Date.now(),
    });
  };

  const endRadioSession = (
    reason: Extract<RadioEventDetail, { type: "session_ended" }>["reason"]
  ): void => {
    if (!radioSession) {
      return;
    }
    updateRadioListeningTime();
    dispatchRadioEvent({
      type: "session_ended",
      stationId: radioSession.stationId,
      queueId: radioSession.queueId,
      reason,
      listenedSeconds: Math.round(radioSession.listenedMilliseconds / 1000),
      tracksStarted: radioSession.tracksStarted,
      skips: radioSession.skips,
      timestamp: Date.now(),
    });
    radioSession = null;
    lastStartedRadioTrack = "";
  };

  const getAudioErrorMessage = (): string => {
    switch (audio.error?.code) {
      case MediaError.MEDIA_ERR_NETWORK:
        return "Network error. Press Play.";
      case MediaError.MEDIA_ERR_DECODE:
        return "Decode error. Press Play.";
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        return "Format error. Press Play.";
      default:
        return "Playback failed. Press Play.";
    }
  };

  const save = (force = false) => {
    if (!state.queue) {
      return;
    }
    const now = Date.now();
    if (!force && now - lastSave < SAVE_INTERVAL) {
      return;
    }
    lastSave = now;
    const savedTime = Number.isFinite(audio.currentTime)
      ? Math.floor(audio.currentTime)
      : state.currentTime;
    const stored: StoredPlayerState = {
      version: 4,
      queue: state.queue,
      currentTrackIndex: state.currentTrackIndex,
      currentTime: savedTime,
      duration: Math.floor(getDuration()),
      isMuted: audio.muted,
      seriesIntermission: state.seriesIntermission,
      updatedAt: now,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Playback remains available when storage is blocked.
    }

    if (state.queue.kind === "series") {
      const track = state.queue.tracks[state.currentTrackIndex];
      if (track) {
        writeSeriesMarathonProgress({
          seriesId: state.queue.series.id,
          albumId: track.album.id,
          trackNumber: track.trackNumber,
          currentTime: savedTime,
          phase: hasFinished
            ? "completed"
            : state.seriesIntermission
              ? "intermission"
              : "listening",
          ...(state.seriesIntermission
            ? { nextAlbumId: state.seriesIntermission.beforeAlbumId }
            : {}),
          updatedAt: now,
        });
      }
    }
  };

  const dispatch = (forceSave = false) => {
    const isPlaying = !audio.paused && !audio.ended;
    state = {
      ...state,
      currentTime: Number.isFinite(audio.currentTime)
        ? audio.currentTime
        : state.currentTime,
      duration: getDuration(),
      isMuted: audio.muted,
      isPlaying,
      playbackPhase: derivePlaybackPhase(isPlaying),
      updatedAt: Date.now(),
    };
    updateUi();
    save(forceSave);
    window.dispatchEvent(
      new CustomEvent<PlayerState>("melodymind:playback-state", {
        detail: snapshot(),
      })
    );
  };

  const updateMediaSession = () => {
    if (
      !("mediaSession" in navigator) ||
      typeof window.MediaMetadata !== "function" ||
      !state.queue ||
      !getTrack()
    ) {
      return;
    }
    const track = getTrack();
    if (!track) {
      return;
    }
    const album = getTrackAlbum(state.queue, state.currentTrackIndex);
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: "MelodyMind",
      album: album?.title || state.queue.title,
      ...(album?.artworkUrl
        ? { artwork: [{ src: album.artworkUrl, sizes: "512x512" }] }
        : {}),
    });
    navigator.mediaSession.playbackState = state.isPlaying ? "playing" : "paused";
    const duration = getDuration();
    if (duration > 0 && state.currentTime >= 0 && state.currentTime <= duration) {
      try {
        navigator.mediaSession.setPositionState({
          duration,
          playbackRate: audio.playbackRate,
          position: Math.min(state.currentTime, duration),
        });
      } catch {
        // Position state support varies by browser and media readiness.
      }
    }
  };

  const releasePreloader = () => {
    if (!preloadedUrl) {
      return;
    }
    nextTrackPreloader.removeAttribute("src");
    nextTrackPreloader.load();
    preloadedUrl = "";
  };

  const clearMediaSession = () => {
    if (!("mediaSession" in navigator)) {
      return;
    }
    navigator.mediaSession.metadata = null;
    navigator.mediaSession.playbackState = "none";
    try {
      navigator.mediaSession.setPositionState();
    } catch {
      // Position state support varies by browser.
    }
  };

  const clearPlayer = () => {
    endRadioSession("cleared");
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    releasePreloader();
    pendingSeek = 0;
    state = {
      queue: null,
      currentTrackIndex: 0,
      currentTime: 0,
      duration: 0,
      isMuted: false,
      isPlaying: false,
      playbackPhase: "idle",
      errorMessage: null,
      seriesIntermission: null,
      updatedAt: Date.now(),
    };
    audio.muted = false;
    playerView = "expanded";
    hasFinished = false;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(V3_STORAGE_KEY);
      window.localStorage.removeItem(V2_STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Closing still resets playback when storage is blocked.
    }
    clearMediaSession();
    dispatch();
    announce("Playback cleared");
  };

  const preloadNextTrack = () => {
    const duration = getDuration();
    const remaining = duration - audio.currentTime;
    const currentSeriesTrack =
      state.queue?.kind === "series" ? state.queue.tracks[state.currentTrackIndex] : null;
    const nextTrack = state.queue?.tracks[state.currentTrackIndex + 1];
    const nextSeriesTrack =
      state.queue?.kind === "series"
        ? state.queue.tracks[state.currentTrackIndex + 1]
        : null;
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData;
    if (
      saveData === true ||
      !nextTrack ||
      (currentSeriesTrack &&
        nextSeriesTrack &&
        currentSeriesTrack.album.id !== nextSeriesTrack.album.id) ||
      duration <= 0 ||
      remaining > PRELOAD_THRESHOLD_SECONDS
    ) {
      return;
    }

    const nextUrl = new URL(nextTrack.audioUrl, window.location.href).href;
    if (nextUrl === preloadedUrl) {
      return;
    }
    releasePreloader();
    preloadedUrl = nextUrl;
    nextTrackPreloader.src = nextUrl;
    nextTrackPreloader.load();
  };

  const updateUi = () => {
    const queue = state.queue;
    const track = getTrack();
    const hasTrack = Boolean(queue && track);
    root.hidden = !hasTrack;
    document.body.dataset.globalPlayerVisible = String(hasTrack);
    document.body.dataset.globalPlayerView = playerView;
    document.body.dataset.globalPlayerIntermission = state.seriesIntermission
      ? "true"
      : "false";
    root.dataset.playerView = playerView;
    root.dataset.playerQueueKind = queue?.kind || "none";
    root.dataset.playerIntermission = state.seriesIntermission ? "true" : "false";
    root.dataset.playerState = state.playbackPhase;
    root.dataset.playerMuted = state.isMuted ? "true" : "false";

    if (!queue || !track) {
      return;
    }
    const album = getTrackAlbum(queue, state.currentTrackIndex);
    const seriesQueue = queue.kind === "series" ? queue : null;
    const seriesTrack = seriesQueue?.tracks[state.currentTrackIndex];
    if (trackText) {
      trackText.textContent = track.title;
    }
    if (albumText) {
      albumText.textContent = album?.title || queue.title;
      albumText.hidden = Boolean(state.errorMessage || hasFinished);
    }
    if (messageText) {
      messageText.textContent = state.errorMessage
        ? state.errorMessage
        : hasFinished
          ? queue.kind === "radio"
            ? "Station finished"
            : queue.kind === "series"
              ? "Series complete"
              : "Album finished"
          : "";
      messageText.hidden = !state.errorMessage && !hasFinished;
    }
    if (albumLink && album) {
      albumLink.href = seriesQueue
        ? `${seriesQueue.series.url}#series-album-${album.id}`
        : `${album.url}#track-${track.trackNumber}`;
    }
    if (artwork && album?.artworkUrl) {
      artwork.src = album.artworkUrl;
      artwork.alt = `Cover art for the album ${album.title}`;
    }
    if (toggle) {
      const nextSeriesTrack =
        seriesQueue && state.seriesIntermission
          ? seriesQueue.tracks.find(
              (seriesTrack) =>
                seriesTrack.album.id === state.seriesIntermission?.beforeAlbumId
            )
          : null;
      toggle.setAttribute("aria-pressed", String(state.isPlaying));
      toggle.setAttribute(
        "aria-label",
        state.errorMessage
          ? `Retry ${track.title}`
          : nextSeriesTrack
            ? `Play next album ${nextSeriesTrack.album.title}`
            : hasFinished
              ? queue.kind === "radio"
                ? `Replay station ${queue.title}`
                : queue.kind === "series"
                  ? `Replay series ${queue.series.title}`
                  : `Replay album ${queue.album.title}`
              : `${state.isPlaying ? "Pause" : "Play"} ${track.title}`
      );
    }
    if (mute) {
      mute.setAttribute("aria-pressed", String(state.isMuted));
      mute.setAttribute("aria-label", state.isMuted ? "Unmute" : "Mute");
    }

    const duration = getDuration();
    const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    const remaining = Math.max(duration - current, 0);
    if (currentText) {
      currentText.textContent = formatTime(current);
    }
    if (remainingText) {
      remainingText.textContent = `-${formatTime(remaining)}`;
    }
    if (progress) {
      progress.max = String(Math.floor(duration));
      progress.value = String(Math.floor(current));
      progress.setAttribute(
        "aria-valuetext",
        `${formatTime(current)} elapsed, ${formatTime(remaining)} remaining`
      );
    }
    if (seriesMeta) {
      if (seriesQueue && seriesTrack) {
        const knownDuration = seriesQueue.series.totalDurationSeconds;
        const completedDuration = seriesQueue.tracks
          .slice(0, state.currentTrackIndex)
          .reduce((total, queueTrack) => total + (queueTrack.durationSeconds || 0), 0);
        const elapsed = hasFinished
          ? knownDuration || 0
          : completedDuration + Math.min(current, track.durationSeconds || current);
        const percent =
          knownDuration && knownDuration > 0
            ? Math.min(100, Math.round((elapsed / knownDuration) * 100))
            : null;
        seriesMeta.textContent = `Part ${seriesTrack.partNumber} of ${seriesQueue.series.albumCount} · Track ${state.currentTrackIndex + 1} of ${seriesQueue.tracks.length}${percent === null ? "" : ` · ${percent}%`}`;
        seriesMeta.hidden = false;
      } else {
        seriesMeta.hidden = true;
        seriesMeta.textContent = "";
      }
    }

    if (intermission) {
      const intermissionState = seriesQueue ? state.seriesIntermission : null;
      const nextTrack = intermissionState
        ? seriesQueue?.tracks.find(
            (queueTrack) => queueTrack.album.id === intermissionState.beforeAlbumId
          )
        : null;
      intermission.hidden = !intermissionState || !nextTrack;
      if (intermissionState && nextTrack) {
        if (intermissionPart) {
          intermissionPart.textContent = `Part ${intermissionState.fromPartNumber} complete · Part ${intermissionState.toPartNumber} of ${seriesQueue?.series.albumCount}`;
        }
        if (intermissionTitle) {
          intermissionTitle.textContent = `Up next: ${nextTrack.album.title}`;
        }
        if (intermissionSummary) {
          intermissionSummary.textContent = intermissionState.transitionText;
        }
        if (intermissionArtwork) {
          intermissionArtwork.hidden = !nextTrack.album.artworkUrl;
          if (nextTrack.album.artworkUrl) {
            intermissionArtwork.src = nextTrack.album.artworkUrl;
            intermissionArtwork.alt = `Cover art for the album ${nextTrack.album.title}`;
          }
        }
        if (intermissionLink) {
          intermissionLink.href = seriesQueue?.series.url || "/series/";
        }
      }
    }
    updateMediaSession();
  };

  const setSource = (index: number, currentTime = 0) => {
    const track = state.queue?.tracks[index];
    if (!track) {
      return;
    }
    state.currentTrackIndex = index;
    state.errorMessage = null;
    state.seriesIntermission = null;
    state.playbackPhase = "loading";
    hasFinished = false;
    releasePreloader();
    pendingSeek = currentTime;
    const nextUrl = new URL(track.audioUrl, window.location.href).href;
    if (audio.currentSrc !== nextUrl && audio.src !== nextUrl) {
      audio.src = nextUrl;
      audio.load();
    } else if (Number.isFinite(audio.duration)) {
      audio.currentTime = Math.min(pendingSeek, audio.duration || pendingSeek);
      pendingSeek = 0;
    }
  };

  const play = () => {
    const requestedTrackUrl = getTrack()?.audioUrl;
    if (!requestedTrackUrl) {
      return;
    }
    if (!audio.src) {
      setSource(state.currentTrackIndex, state.currentTime);
    } else if (state.errorMessage) {
      pendingSeek = Number.isFinite(audio.currentTime)
        ? audio.currentTime
        : state.currentTime;
      state.errorMessage = null;
      audio.load();
      updateUi();
    }
    audio.play().catch(() => {
      if (!state.queue || getTrack()?.audioUrl !== requestedTrackUrl) {
        return;
      }
      state.errorMessage = "Start failed. Press Play.";
      dispatch(true);
      announce(state.errorMessage);
    });
  };

  const changeTrack = (
    index: number,
    autoplay = state.isPlaying,
    reason: Extract<RadioEventDetail, { type: "track_started" }>["reason"] = "auto"
  ) => {
    if (!state.queue?.tracks.length) {
      return;
    }
    const normalized = (index + state.queue.tracks.length) % state.queue.tracks.length;
    pendingTrackReason = reason;
    setSource(normalized);
    dispatch(true);
    if (autoplay) {
      play();
    }
  };

  const enterSeriesIntermission = (): boolean => {
    if (state.queue?.kind !== "series") {
      return false;
    }
    const currentTrack = state.queue.tracks[state.currentTrackIndex];
    const nextTrack = state.queue.tracks[state.currentTrackIndex + 1];
    if (!currentTrack || !nextTrack || currentTrack.album.id === nextTrack.album.id) {
      return false;
    }

    const transition = state.queue.transitions.find(
      (item) => item.beforeAlbumId === nextTrack.album.id
    );
    if (!transition) {
      return false;
    }

    state.seriesIntermission = {
      ...transition,
      fromPartNumber: currentTrack.partNumber,
      toPartNumber: nextTrack.partNumber,
    };
    playerView = "expanded";
    audio.pause();
    dispatch(true);
    announce(
      `Part ${currentTrack.partNumber} complete. Up next: ${nextTrack.album.title}`
    );
    return true;
  };

  const continueSeries = (): void => {
    if (state.queue?.kind !== "series" || !state.seriesIntermission) {
      return;
    }
    const nextIndex = state.queue.tracks.findIndex(
      (track, index) =>
        index > state.currentTrackIndex &&
        track.album.id === state.seriesIntermission?.beforeAlbumId
    );
    if (nextIndex < 0) {
      return;
    }
    const nextTitle = state.queue.tracks[nextIndex]?.album.title || "next album";
    changeTrack(nextIndex, true, "auto");
    announce(`Playing ${nextTitle}`);
  };

  const finishQueue = (): void => {
    hasFinished = true;
    state.seriesIntermission = null;
    state.playbackPhase = "finished";
    audio.currentTime = 0;
    dispatch(true);
    if (state.queue?.kind === "radio") {
      endRadioSession("finished");
    }
    announce(`Finished ${state.queue?.title || "album"}`);
  };

  const handleLoad = (detail: PlayerLoadDetail) => {
    if (!isPlayerQueue(detail.queue) || detail.queue.tracks.length === 0) {
      return;
    }
    const index = Math.min(
      Math.max(Math.floor(detail.startIndex || 0), 0),
      detail.queue.tracks.length - 1
    );
    const startTime = Math.max(0, Number(detail.startTime) || 0);
    playerView = "expanded";
    hasFinished = false;
    const previousQueue = state.queue;
    const sameTrack =
      state.queue?.queueId === detail.queue.queueId &&
      state.currentTrackIndex === index &&
      getTrack()?.audioUrl === detail.queue.tracks[index]?.audioUrl;
    if (previousQueue?.queueId !== detail.queue.queueId) {
      if (previousQueue?.kind === "radio") {
        const isStationSwitch =
          detail.queue.kind === "radio" &&
          previousQueue.stationId !== detail.queue.stationId;
        endRadioSession(isStationSwitch ? "switched" : "replaced");
        if (isStationSwitch && detail.queue.kind === "radio") {
          dispatchRadioEvent({
            type: "station_switched",
            fromStationId: previousQueue.stationId,
            toStationId: detail.queue.stationId,
            timestamp: Date.now(),
          });
        }
      }
      lastStartedRadioTrack = "";
    }
    state.queue = detail.queue;
    state.playbackPhase = "loading";
    if (!sameTrack || detail.startTime !== undefined) {
      pendingTrackReason = "initial";
      setSource(index, startTime);
    }
    state.seriesIntermission =
      detail.queue.kind === "series" ? detail.seriesIntermission || null : null;
    if (
      detail.queue.kind === "radio" &&
      previousQueue?.queueId !== detail.queue.queueId
    ) {
      startRadioSession(false);
    }
    dispatch(true);
    const shouldAutoplay = detail.autoplay !== false && !state.seriesIntermission;
    announce(`${shouldAutoplay ? "Playing" : "Ready"} ${getTrack()?.title}`);
    if (shouldAutoplay) {
      play();
    }
  };

  const handleCommand = (command: PlayerCommand) => {
    switch (command.action) {
      case "toggle":
        if (state.seriesIntermission) {
          continueSeries();
        } else if (hasFinished) {
          changeTrack(0, true, "initial");
        } else {
          audio.paused ? play() : audio.pause();
        }
        break;
      case "play":
        if (state.seriesIntermission) {
          continueSeries();
        } else if (hasFinished) {
          changeTrack(0, true, "initial");
        } else {
          play();
        }
        break;
      case "pause":
        audio.pause();
        break;
      case "previous":
        if (state.seriesIntermission) {
          changeTrack(state.currentTrackIndex, true, "previous");
        } else if (audio.currentTime > 3 || state.currentTrackIndex === 0) {
          audio.currentTime = 0;
          dispatch(true);
        } else {
          changeTrack(state.currentTrackIndex - 1, !audio.paused, "previous");
        }
        break;
      case "next": {
        if (state.seriesIntermission) {
          continueSeries();
          break;
        }
        if (state.queue?.kind === "radio") {
          const track = state.queue.tracks[state.currentTrackIndex];
          if (track) {
            if (radioSession) {
              radioSession.skips += 1;
            }
            dispatchRadioEvent({
              type: "track_skipped",
              stationId: state.queue.stationId,
              queueId: state.queue.queueId,
              albumId: track.album.id,
              trackNumber: track.trackNumber,
              elapsedSeconds: Math.round(audio.currentTime || state.currentTime),
              timestamp: Date.now(),
            });
          }
        }
        if (state.queue?.kind === "series") {
          if (state.currentTrackIndex + 1 >= state.queue.tracks.length) {
            finishQueue();
            break;
          }
          if (enterSeriesIntermission()) {
            break;
          }
        }
        changeTrack(state.currentTrackIndex + 1, !audio.paused, "skip");
        break;
      }
      case "shuffle": {
        const length = state.queue?.tracks.length || 0;
        if (length > 1) {
          let next = state.currentTrackIndex;
          while (next === state.currentTrackIndex) {
            next = Math.floor(Math.random() * length);
          }
          changeTrack(next, true, "skip");
        }
        break;
      }
      case "mute":
        audio.muted = !audio.muted;
        dispatch(true);
        break;
      case "continue-series":
        continueSeries();
        break;
      case "minimize":
        playerView = "compact";
        updateUi();
        announce("Player minimized");
        break;
      case "expand":
        playerView = "expanded";
        updateUi();
        announce("Player expanded");
        break;
      case "clear":
        clearPlayer();
        break;
      case "seek":
        hasFinished = false;
        state.seriesIntermission = null;
        audio.currentTime = Math.min(Math.max(command.value, 0), getDuration());
        dispatch(true);
        break;
    }
  };

  root
    .querySelectorAll<HTMLButtonElement>("[data-global-player-action]")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () =>
          handleCommand({
            action: button.dataset.globalPlayerAction as PlayerCommand["action"],
          } as PlayerCommand),
        { signal }
      );
    });
  driveLink?.addEventListener(
    "click",
    () => {
      if (state.queue && !state.isPlaying && !state.seriesIntermission) {
        handleCommand({ action: "play" });
      }
    },
    { signal }
  );
  progress?.addEventListener(
    "input",
    () => handleCommand({ action: "seek", value: Number(progress.value) }),
    { signal }
  );
  albumLink?.addEventListener(
    "click",
    () => {
      if (state.queue?.kind !== "radio") {
        return;
      }
      const track = state.queue.tracks[state.currentTrackIndex];
      if (!track) {
        return;
      }
      dispatchRadioEvent({
        type: "album_opened",
        stationId: state.queue.stationId,
        queueId: state.queue.queueId,
        albumId: track.album.id,
        trackNumber: track.trackNumber,
        timestamp: Date.now(),
      });
    },
    { signal }
  );

  const loadFromTrigger = async (trigger: HTMLElement): Promise<void> => {
    const startIndex = Number(trigger.dataset.playerStartIndex) || 0;
    const queueId = trigger.dataset.playerQueueId;
    if (queueId) {
      const script = document.getElementById(queueId);
      if (!script?.textContent) {
        announce("Could not load this album");
        return;
      }

      try {
        const queue: unknown = JSON.parse(script.textContent);
        if (!isPlayerQueue(queue)) {
          throw new Error("Invalid inline player queue");
        }
        handleLoad({ queue, startIndex, autoplay: true });
      } catch {
        announce("Could not load this album");
      }
      return;
    }

    const albumId = trigger.dataset.playerAlbumId;
    const queueUrl = trigger.dataset.playerQueueUrl;
    if (!albumId || !queueUrl) {
      announce("Could not load this album");
      return;
    }

    const button = trigger instanceof HTMLButtonElement ? trigger : null;
    const wasDisabled = button?.disabled === true;
    trigger.setAttribute("aria-busy", "true");
    if (button) {
      button.disabled = true;
    }
    announce(`Loading ${trigger.dataset.playerAlbumTitle || "album"}`);

    try {
      const queue = await loadPlayerQueue(queueUrl, albumId);
      handleLoad({ queue, startIndex, autoplay: true });
    } catch {
      announce("Could not load this album. Try again.");
    } finally {
      trigger.removeAttribute("aria-busy");
      if (button) {
        button.disabled = wasDisabled;
      }
    }
  };

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const trigger = target.closest<HTMLElement>("[data-player-load]");
      if (!trigger) {
        return;
      }
      void loadFromTrigger(trigger);
    },
    { signal }
  );
  window.addEventListener("melodymind:player-load", (event) => handleLoad(event.detail), {
    signal,
  });
  window.addEventListener(
    "melodymind:player-command",
    (event) => handleCommand(event.detail),
    { signal }
  );
  audio.addEventListener(
    "play",
    () => {
      state.errorMessage = null;
      hasFinished = false;
      if (state.queue?.kind === "radio") {
        if (!radioSession || radioSession.queueId !== state.queue.queueId) {
          startRadioSession(state.queue.queueId === restored?.queue?.queueId);
        }
        if (radioSession && radioSession.playingSince === null) {
          radioSession.playingSince = performance.now();
        }
        const track = state.queue.tracks[state.currentTrackIndex] as
          | RadioPlayerTrack
          | undefined;
        const trackKey = `${state.queue.queueId}:${state.currentTrackIndex}`;
        if (track && trackKey !== lastStartedRadioTrack) {
          lastStartedRadioTrack = trackKey;
          if (radioSession) {
            radioSession.tracksStarted += 1;
          }
          dispatchRadioEvent({
            type: "track_started",
            stationId: state.queue.stationId,
            queueId: state.queue.queueId,
            albumId: track.album.id,
            trackNumber: track.trackNumber,
            reason: pendingTrackReason,
            timestamp: Date.now(),
          });
        }
      }
      dispatch(true);
      announce(`Playing ${getTrack()?.title || "track"}`);
    },
    { signal }
  );
  audio.addEventListener(
    "loadstart",
    () => {
      if (!state.queue) {
        return;
      }
      state.playbackPhase = "loading";
      dispatch();
    },
    { signal }
  );
  audio.addEventListener(
    "waiting",
    () => {
      if (!state.queue || audio.paused) {
        return;
      }
      state.playbackPhase = "buffering";
      dispatch();
      announce(`Buffering ${getTrack()?.title || "track"}`);
    },
    { signal }
  );
  audio.addEventListener(
    "stalled",
    () => {
      if (!state.queue || audio.paused) {
        return;
      }
      state.playbackPhase = "buffering";
      dispatch();
    },
    { signal }
  );
  audio.addEventListener(
    "playing",
    () => {
      state.playbackPhase = "playing";
      dispatch();
    },
    { signal }
  );
  audio.addEventListener(
    "canplay",
    () => {
      if (!state.queue) {
        return;
      }
      state.playbackPhase = audio.paused ? "paused" : "playing";
      dispatch();
    },
    { signal }
  );
  audio.addEventListener(
    "pause",
    () => {
      updateRadioListeningTime();
      dispatch(true);
    },
    { signal }
  );
  audio.addEventListener(
    "error",
    () => {
      if (!state.queue) {
        return;
      }
      hasFinished = false;
      state.errorMessage = getAudioErrorMessage();
      dispatch(true);
      announce(state.errorMessage);
    },
    { signal }
  );
  audio.addEventListener(
    "timeupdate",
    () => {
      dispatch();
      preloadNextTrack();
    },
    { signal }
  );
  audio.addEventListener(
    "loadedmetadata",
    () => {
      if (pendingSeek > 0) {
        audio.currentTime = Math.min(pendingSeek, getDuration());
        pendingSeek = 0;
      }
      dispatch();
    },
    { signal }
  );
  audio.addEventListener(
    "ended",
    () => {
      updateRadioListeningTime();
      if (state.currentTrackIndex + 1 < (state.queue?.tracks.length || 0)) {
        if (!enterSeriesIntermission()) {
          changeTrack(state.currentTrackIndex + 1, true, "auto");
        }
      } else {
        finishQueue();
      }
    },
    { signal }
  );

  if ("mediaSession" in navigator) {
    const handlers: Partial<Record<MediaSessionAction, MediaSessionActionHandler>> = {
      play: () => handleCommand({ action: "play" }),
      pause: () => handleCommand({ action: "pause" }),
      previoustrack: () => handleCommand({ action: "previous" }),
      nexttrack: () => handleCommand({ action: "next" }),
      seekbackward: (details) =>
        handleCommand({
          action: "seek",
          value: audio.currentTime - (details.seekOffset || 10),
        }),
      seekforward: (details) =>
        handleCommand({
          action: "seek",
          value: audio.currentTime + (details.seekOffset || 10),
        }),
      seekto: (details) =>
        handleCommand({ action: "seek", value: details.seekTime || 0 }),
    };
    Object.entries(handlers).forEach(([action, handler]) => {
      try {
        navigator.mediaSession.setActionHandler(
          action as MediaSessionAction,
          handler || null
        );
      } catch {
        // Media Session actions vary by browser.
      }
    });
  }

  if (state.queue && getTrack()) {
    const restoredIntermission = state.seriesIntermission;
    setSource(state.currentTrackIndex, state.currentTime);
    state.seriesIntermission = restoredIntermission;
  }
  audio.muted = state.isMuted;
  updateUi();

  const notifyPage = () => dispatch();
  document.addEventListener("astro:page-load", notifyPage, { signal });

  window.__melodyMindPlayer = {
    getState: snapshot,
    setDucked: (ducked) => {
      if (ducked === isDucked) {
        return;
      }
      isDucked = ducked;
      if (ducked) {
        volumeBeforeDucking = audio.volume;
        audio.volume = Math.min(audio.volume, DUCKED_VOLUME);
      } else {
        audio.volume = volumeBeforeDucking;
      }
    },
    enableAnalyser: async () => {
      const AudioContextConstructor =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;
      if (!AudioContextConstructor) {
        return false;
      }

      try {
        if (!audioContext) {
          audioContext = new AudioContextConstructor();
        }
        if (!mediaElementSource) {
          mediaElementSource = audioContext.createMediaElementSource(audio);
        }
        if (!analyser) {
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 128;
          analyser.smoothingTimeConstant = 0.84;
          mediaElementSource.connect(analyser);
          analyser.connect(audioContext.destination);
          analyserData = new Uint8Array(analyser.frequencyBinCount);
        }
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }
        return true;
      } catch {
        return false;
      }
    },
    readAnalyserFrame: (buffer) => {
      if (!analyser || !analyserData || buffer.length === 0) {
        return false;
      }
      analyser.getByteFrequencyData(analyserData);
      const bands = Math.min(buffer.length, 24);
      for (let band = 0; band < bands; band += 1) {
        const start = Math.floor(Math.pow(band / bands, 1.7) * analyserData.length);
        const end = Math.max(
          start + 1,
          Math.floor(Math.pow((band + 1) / bands, 1.7) * analyserData.length)
        );
        let total = 0;
        for (let index = start; index < end; index += 1) {
          total += analyserData[index] || 0;
        }
        buffer[band] = Math.round(total / Math.max(1, end - start));
      }
      return true;
    },
    destroy: () => {
      if (isDucked) {
        audio.volume = volumeBeforeDucking;
      }
      save(true);
      releasePreloader();
      playerResizeObserver?.disconnect();
      document.body.style.removeProperty("--global-player-offset");
      controller.abort();
      analyser?.disconnect();
      mediaElementSource?.disconnect();
      void audioContext?.close();
      delete window.__melodyMindPlayer;
    },
  };
};

initGlobalPlayer();
