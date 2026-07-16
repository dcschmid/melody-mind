import { formatTime } from "@utils/time";
import { trackFathomEvent } from "./fathom-events";
import type {
  PlayerCommand,
  PlayerLoadDetail,
  PlayerQueue,
  PlayerState,
} from "../../types/player";

const STORAGE_KEY = "melodymind:music-player-state:v2";
const LEGACY_STORAGE_KEY = "melodymind:music-player-state:v1";
const SAVE_INTERVAL = 2_000;
const PRELOAD_THRESHOLD_SECONDS = 30;

interface NavigatorWithConnection extends Navigator {
  connection?: {
    saveData?: boolean;
  };
}

interface StoredPlayerState extends Omit<PlayerState, "isPlaying"> {
  version: 2;
}

const isPlayerQueue = (value: unknown): value is PlayerQueue => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const queue = value as Partial<PlayerQueue>;
  return (
    typeof queue.albumId === "string" &&
    typeof queue.albumTitle === "string" &&
    typeof queue.albumUrl === "string" &&
    Array.isArray(queue.tracks) &&
    queue.tracks.every(
      (track) =>
        track &&
        typeof track.title === "string" &&
        typeof track.audioUrl === "string" &&
        typeof track.trackNumber === "number"
    )
  );
};

const readStoredState = (): StoredPlayerState | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredPlayerState>;
      if (parsed.version === 2 && isPlayerQueue(parsed.queue)) {
        return {
          version: 2,
          queue: parsed.queue,
          currentTrackIndex: Math.max(0, Math.floor(parsed.currentTrackIndex || 0)),
          currentTime: Math.max(0, Number(parsed.currentTime) || 0),
          duration: Math.max(0, Number(parsed.duration) || 0),
          isMuted: parsed.isMuted === true,
          updatedAt: Number(parsed.updatedAt) || Date.now(),
        };
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
      version: 2,
      queue: {
        albumId: legacy.albumId,
        albumTitle: legacy.albumTitle,
        albumUrl: legacy.albumUrl,
        ...(typeof legacy.albumArtworkUrl === "string"
          ? { albumArtworkUrl: legacy.albumArtworkUrl }
          : {}),
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
      updatedAt: typeof legacy.updatedAt === "number" ? legacy.updatedAt : Date.now(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
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
  audio.dataset.globalPlayerAudio = "";
  root.append(audio);

  const artwork = root.querySelector<HTMLImageElement>("[data-global-player-artwork]");
  const albumLink = root.querySelector<HTMLAnchorElement>("[data-global-player-link]");
  const trackText = root.querySelector<HTMLElement>("[data-global-player-track]");
  const albumText = root.querySelector<HTMLElement>("[data-global-player-album]");
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
  const controller = new AbortController();
  const { signal } = controller;
  const restored = readStoredState();
  let state: PlayerState = {
    queue: restored?.queue || null,
    currentTrackIndex: restored?.currentTrackIndex || 0,
    currentTime: restored?.currentTime || 0,
    duration: restored?.duration || 0,
    isMuted: restored?.isMuted === true,
    isPlaying: false,
    updatedAt: restored?.updatedAt || Date.now(),
  };
  let pendingSeek = state.currentTime;
  let lastSave = 0;
  let preloadedUrl = "";
  const nextTrackPreloader = new Audio();
  nextTrackPreloader.preload = "metadata";

  const getTrack = () => state.queue?.tracks[state.currentTrackIndex];
  const getDuration = () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      return audio.duration;
    }
    return getTrack()?.durationSeconds || state.duration || 0;
  };

  const snapshot = (): PlayerState => ({
    ...state,
    queue: state.queue
      ? { ...state.queue, tracks: state.queue.tracks.map((track) => ({ ...track })) }
      : null,
  });

  const announce = (message: string) => {
    if (status) {
      status.textContent = message;
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
    const stored: StoredPlayerState = {
      version: 2,
      queue: state.queue,
      currentTrackIndex: state.currentTrackIndex,
      currentTime: Number.isFinite(audio.currentTime)
        ? Math.floor(audio.currentTime)
        : state.currentTime,
      duration: Math.floor(getDuration()),
      isMuted: audio.muted,
      updatedAt: now,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Playback remains available when storage is blocked.
    }
  };

  const dispatch = (forceSave = false) => {
    state = {
      ...state,
      currentTime: Number.isFinite(audio.currentTime)
        ? audio.currentTime
        : state.currentTime,
      duration: getDuration(),
      isMuted: audio.muted,
      isPlaying: !audio.paused && !audio.ended,
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
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: "MelodyMind",
      album: state.queue.albumTitle,
      ...(state.queue.albumArtworkUrl
        ? { artwork: [{ src: state.queue.albumArtworkUrl, sizes: "512x512" }] }
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

  const preloadNextTrack = () => {
    const duration = getDuration();
    const remaining = duration - audio.currentTime;
    const nextTrack = state.queue?.tracks[state.currentTrackIndex + 1];
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData;
    if (
      saveData === true ||
      !nextTrack ||
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
    root.dataset.playerState = state.isPlaying ? "playing" : "paused";
    root.dataset.playerMuted = state.isMuted ? "true" : "false";

    if (!queue || !track) {
      return;
    }
    if (trackText) {
      trackText.textContent = track.title;
    }
    if (albumText) {
      albumText.textContent = queue.albumTitle;
    }
    if (albumLink) {
      albumLink.href = `${queue.albumUrl}#track-${track.trackNumber}`;
    }
    if (artwork && queue.albumArtworkUrl) {
      artwork.src = queue.albumArtworkUrl;
      artwork.alt = `Cover art for the album ${queue.albumTitle}`;
    }
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(state.isPlaying));
      toggle.setAttribute(
        "aria-label",
        `${state.isPlaying ? "Pause" : "Play"} ${track.title}`
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
    updateMediaSession();
  };

  const setSource = (index: number, currentTime = 0) => {
    const track = state.queue?.tracks[index];
    if (!track) {
      return;
    }
    state.currentTrackIndex = index;
    releasePreloader();
    pendingSeek = currentTime;
    const nextUrl = new URL(track.audioUrl, window.location.href).href;
    if (audio.currentSrc !== nextUrl && audio.src !== nextUrl) {
      audio.src = nextUrl;
      audio.load();
    } else if (pendingSeek > 0) {
      audio.currentTime = pendingSeek;
      pendingSeek = 0;
    }
  };

  const play = () => {
    if (!getTrack()) {
      return;
    }
    if (!audio.src) {
      setSource(state.currentTrackIndex, state.currentTime);
    }
    audio.play().catch(() => announce(`Could not play ${getTrack()?.title || "track"}`));
  };

  const changeTrack = (index: number, autoplay = state.isPlaying) => {
    if (!state.queue?.tracks.length) {
      return;
    }
    const normalized = (index + state.queue.tracks.length) % state.queue.tracks.length;
    setSource(normalized);
    dispatch(true);
    if (autoplay) {
      play();
    }
  };

  const handleLoad = (detail: PlayerLoadDetail) => {
    if (!isPlayerQueue(detail.queue) || detail.queue.tracks.length === 0) {
      return;
    }
    const index = Math.min(
      Math.max(Math.floor(detail.startIndex || 0), 0),
      detail.queue.tracks.length - 1
    );
    const sameTrack =
      state.queue?.albumId === detail.queue.albumId &&
      state.currentTrackIndex === index &&
      getTrack()?.audioUrl === detail.queue.tracks[index]?.audioUrl;
    state.queue = detail.queue;
    if (!sameTrack) {
      setSource(index);
    }
    dispatch(true);
    announce(`${detail.autoplay === false ? "Ready" : "Playing"} ${getTrack()?.title}`);
    if (detail.autoplay !== false) {
      play();
    }
  };

  const handleCommand = (command: PlayerCommand) => {
    switch (command.action) {
      case "toggle":
        audio.paused ? play() : audio.pause();
        break;
      case "play":
        play();
        break;
      case "pause":
        audio.pause();
        break;
      case "previous":
        if (audio.currentTime > 3) {
          audio.currentTime = 0;
          dispatch(true);
        } else {
          changeTrack(state.currentTrackIndex - 1, !audio.paused);
        }
        break;
      case "next":
        changeTrack(state.currentTrackIndex + 1, !audio.paused);
        break;
      case "shuffle": {
        const length = state.queue?.tracks.length || 0;
        if (length > 1) {
          let next = state.currentTrackIndex;
          while (next === state.currentTrackIndex) {
            next = Math.floor(Math.random() * length);
          }
          changeTrack(next, true);
        }
        break;
      }
      case "mute":
        audio.muted = !audio.muted;
        dispatch(true);
        break;
      case "seek":
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
  progress?.addEventListener(
    "input",
    () => handleCommand({ action: "seek", value: Number(progress.value) }),
    { signal }
  );
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const trigger = target.closest<HTMLElement>("[data-player-load]");
      const queueId = trigger?.dataset.playerQueueId;
      if (!trigger || !queueId) {
        return;
      }
      const script = document.getElementById(queueId);
      if (!script?.textContent) {
        return;
      }
      try {
        const queue = JSON.parse(script.textContent) as PlayerQueue;
        handleLoad({
          queue,
          startIndex: Number(trigger.dataset.playerStartIndex) || 0,
          autoplay: true,
        });
      } catch {
        announce("Could not load this album");
      }
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
      dispatch(true);
      trackFathomEvent(`Listen: ${state.queue?.albumTitle || "Album"}`);
    },
    { signal }
  );
  audio.addEventListener("pause", () => dispatch(true), { signal });
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
      if (state.currentTrackIndex + 1 < (state.queue?.tracks.length || 0)) {
        changeTrack(state.currentTrackIndex + 1, true);
      } else {
        audio.currentTime = 0;
        dispatch(true);
        announce(`Finished ${state.queue?.albumTitle || "album"}`);
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
    setSource(state.currentTrackIndex, state.currentTime);
  }
  audio.muted = state.isMuted;
  updateUi();

  const notifyPage = () => dispatch();
  document.addEventListener("astro:page-load", notifyPage, { signal });

  window.__melodyMindPlayer = {
    getState: snapshot,
    destroy: () => {
      save(true);
      releasePreloader();
      controller.abort();
      delete window.__melodyMindPlayer;
    },
  };
};

initGlobalPlayer();
