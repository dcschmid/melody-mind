import { formatTime } from "@utils/time";
import {
  getAvailableVisualsModes,
  mapTrackProgressToScroll,
  parseVisualsPreferences,
  splitLyricsPages,
  VISUALIZER_BAND_COUNT,
  VISUALS_PREFERENCES_KEY,
} from "@utils/visuals";
import type {
  PlayerCommand,
  PlayerLoadDetail,
  PlayerQueue,
  PlayerState,
} from "../../types/player";
import type {
  VisualAlbumManifest,
  VisualTrackMeta,
  VisualsMode,
  VisualsMotionPreference,
  VisualsPreferences,
} from "../../types/visuals";

const manifestCache = new Map<string, Promise<VisualAlbumManifest>>();
const lyricsCache = new Map<string, Promise<string>>();

const dispatchCommand = (command: PlayerCommand): void => {
  window.dispatchEvent(
    new CustomEvent<PlayerCommand>("melodymind:player-command", { detail: command })
  );
};

const dispatchLoad = (detail: PlayerLoadDetail): void => {
  window.dispatchEvent(
    new CustomEvent<PlayerLoadDetail>("melodymind:player-load", { detail })
  );
};

const getAlbumId = (state: PlayerState): string | null => {
  const { queue } = state;
  if (!queue) {
    return null;
  }
  if (queue.kind === "album") {
    return queue.album.id;
  }
  return queue.tracks[state.currentTrackIndex]?.album.id || null;
};

const getAlbumContext = (state: PlayerState) => {
  const { queue } = state;
  if (!queue) {
    return null;
  }
  if (queue.kind === "album") {
    return queue.album;
  }
  return queue.tracks[state.currentTrackIndex]?.album || null;
};

const loadManifest = (albumId: string): Promise<VisualAlbumManifest> => {
  const cached = manifestCache.get(albumId);
  if (cached) {
    return cached;
  }
  const promise = fetch(`/visuals-data/${encodeURIComponent(albumId)}.json`).then(
    async (response) => {
      if (!response.ok) {
        throw new Error(`Manifest request failed with HTTP ${response.status}`);
      }
      return (await response.json()) as VisualAlbumManifest;
    }
  );
  manifestCache.set(albumId, promise);
  void promise.catch(() => {
    if (manifestCache.get(albumId) === promise) {
      manifestCache.delete(albumId);
    }
  });
  return promise;
};

const loadLyrics = (url: string): Promise<string> => {
  const cached = lyricsCache.get(url);
  if (cached) {
    return cached;
  }
  const promise = fetch(url, { credentials: "omit" }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Lyrics request failed with HTTP ${response.status}`);
    }
    return response.text();
  });
  lyricsCache.set(url, promise);
  void promise.catch(() => {
    if (lyricsCache.get(url) === promise) {
      lyricsCache.delete(url);
    }
  });
  return promise;
};

const initVisuals = (): void => {
  const root = document.querySelector<HTMLElement>("[data-visuals]");
  if (!root || root.dataset.visualsBound === "true") {
    return;
  }
  root.dataset.visualsBound = "true";

  const controller = new AbortController();
  const { signal } = controller;
  const systemReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const artwork = root.querySelector<HTMLImageElement>("[data-visuals-artwork]");
  const trackTitle = root.querySelector<HTMLElement>("[data-visuals-track]");
  const albumTitle = root.querySelector<HTMLElement>("[data-visuals-album]");
  const contextText = root.querySelector<HTMLElement>("[data-visuals-context]");
  const roomLabel = root.querySelector<HTMLElement>("[data-visuals-room-label]");
  const currentText = root.querySelector<HTMLElement>("[data-visuals-current]");
  const remainingText = root.querySelector<HTMLElement>("[data-visuals-remaining]");
  const progress = root.querySelector<HTMLInputElement>("[data-visuals-progress]");
  const toggle = root.querySelector<HTMLButtonElement>('[data-visuals-command="toggle"]');
  const exit = root.querySelector<HTMLAnchorElement>("[data-visuals-exit]");
  const fullscreen = root.querySelector<HTMLButtonElement>("[data-visuals-fullscreen]");
  const motionSelect = root.querySelector<HTMLSelectElement>("[data-visuals-motion]");
  const status = root.querySelector<HTMLElement>("[data-visuals-status]");
  const lyricsScroll = root.querySelector<HTMLElement>("[data-visuals-lyrics-scroll]");
  const lyricsText = root.querySelector<HTMLElement>("[data-visuals-lyrics-text]");
  const lyricsStatus = root.querySelector<HTMLElement>("[data-visuals-lyrics-status]");
  const followButton = root.querySelector<HTMLButtonElement>("[data-visuals-follow]");
  const lyricsPagination = root.querySelector<HTMLElement>(
    "[data-visuals-lyrics-pagination]"
  );
  const lyricsPageText = root.querySelector<HTMLElement>("[data-visuals-lyrics-page]");
  const timeline = root.querySelector<HTMLOListElement>("[data-visuals-timeline]");
  const timelineSummary = root.querySelector<HTMLElement>(
    "[data-visuals-timeline-summary]"
  );
  const visualizerNote = root.querySelector<HTMLElement>(
    "[data-visuals-visualizer-note]"
  );
  const visualizerBands = Array.from(
    root.querySelectorAll<HTMLElement>("[data-visuals-band]")
  );
  const stateLayer = root.querySelector<HTMLElement>("[data-visuals-state-layer]");
  const stateEyebrow = root.querySelector<HTMLElement>("[data-visuals-state-eyebrow]");
  const stateTitle = root.querySelector<HTMLElement>("[data-visuals-state-title]");
  const stateDetail = root.querySelector<HTMLElement>("[data-visuals-state-detail]");
  const stateAction = root.querySelector<HTMLButtonElement>(
    "[data-visuals-state-action]"
  );
  const modeButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-visuals-mode]")
  );
  const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-visuals-panel]"));
  const originalGlobalPlayer =
    document.querySelector<HTMLElement>("[data-global-player]");
  originalGlobalPlayer?.setAttribute("aria-hidden", "true");
  if (originalGlobalPlayer) {
    originalGlobalPlayer.inert = true;
  }

  let preferences: VisualsPreferences = parseVisualsPreferences(
    window.localStorage.getItem(VISUALS_PREFERENCES_KEY)
  );
  let state = window.__melodyMindPlayer?.getState() || null;
  let manifestRequestId = 0;
  let currentMeta: VisualTrackMeta | null = null;
  let currentLyricsKey = "";
  let lyricsPages: string[] = [];
  let lyricsPage = 0;
  let followTrack = true;
  let controlsTimer = 0;
  let wakeLock: WakeLockSentinel | null = null;
  let analyserAvailable = true;
  let analyserEnabled = false;
  let analyserFrame = 0;
  let lastAnalyserPaint = 0;
  const analyserBuffer = new Uint8Array(VISUALIZER_BAND_COUNT);

  const isReducedMotion = (): boolean =>
    preferences.motion === "reduced" ||
    (preferences.motion === "system" && systemReducedMotion.matches);

  const announce = (message: string): void => {
    if (status) {
      status.textContent = message;
    }
  };

  const savePreferences = (): void => {
    try {
      window.localStorage.setItem(VISUALS_PREFERENCES_KEY, JSON.stringify(preferences));
    } catch {
      // Visuals remains usable when local storage is blocked.
    }
  };

  const releaseWakeLock = async (): Promise<void> => {
    const activeLock = wakeLock;
    wakeLock = null;
    if (activeLock && !activeLock.released) {
      try {
        await activeLock.release();
      } catch {
        // Wake lock is progressive enhancement.
      }
    }
  };

  const syncWakeLock = async (): Promise<void> => {
    if (!state?.isPlaying || document.visibilityState !== "visible") {
      await releaseWakeLock();
      return;
    }
    const wakeLockApi = navigator.wakeLock;
    if (!wakeLockApi || wakeLock) {
      return;
    }
    try {
      wakeLock = await wakeLockApi.request("screen");
      wakeLock.addEventListener(
        "release",
        () => {
          wakeLock = null;
        },
        { once: true }
      );
    } catch {
      wakeLock = null;
    }
  };

  const showControls = (): void => {
    root.dataset.controlsHidden = "false";
    window.clearTimeout(controlsTimer);
    if (isReducedMotion()) {
      return;
    }
    controlsTimer = window.setTimeout(() => {
      if (!root.matches(":focus-within")) {
        root.dataset.controlsHidden = "true";
      }
    }, 6_000);
  };

  const updateMotion = (): void => {
    const reduced = isReducedMotion();
    root.dataset.motionReduced = String(reduced);
    if (motionSelect) {
      motionSelect.value = preferences.motion;
    }
    if (reduced) {
      root.dataset.controlsHidden = "false";
      window.clearTimeout(controlsTimer);
    } else {
      showControls();
    }
    renderLyricsPage();
    renderStaticVisualizer();
  };

  const setMode = async (mode: VisualsMode, userInitiated = false): Promise<void> => {
    const available = getAvailableVisualsModes(state?.queue || null, currentMeta, true);
    let nextMode = available.includes(mode) ? mode : "cover";

    if (nextMode === "visualizer" && userInitiated && !analyserEnabled) {
      analyserAvailable = (await window.__melodyMindPlayer?.enableAnalyser()) === true;
      analyserEnabled = analyserAvailable;
      if (!analyserAvailable) {
        nextMode = "cover";
        announce("Audio visualization is not available in this browser.");
      }
    }

    preferences = { ...preferences, mode: nextMode };
    savePreferences();
    root.dataset.mode = nextMode;
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.visualsPanel !== nextMode;
    });
    modeButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.visualsMode === nextMode)
      );
    });

    if (nextMode === "lyrics") {
      await ensureLyrics();
    }
    if (nextMode === "visualizer") {
      startVisualizer();
    } else {
      window.cancelAnimationFrame(analyserFrame);
    }
    announce(`${nextMode[0]?.toUpperCase()}${nextMode.slice(1)} mode`);
    showControls();
  };

  const renderLyricsPage = (): void => {
    if (!lyricsText || !lyricsPagination || !lyricsPageText) {
      return;
    }
    const reduced = isReducedMotion();
    lyricsPagination.hidden = !reduced || lyricsPages.length <= 1;
    if (!reduced || lyricsPages.length === 0) {
      return;
    }
    lyricsPage = Math.min(Math.max(lyricsPage, 0), lyricsPages.length - 1);
    lyricsText.textContent = lyricsPages[lyricsPage] || "";
    lyricsPageText.textContent = `${lyricsPage + 1} of ${lyricsPages.length}`;
    lyricsScroll?.scrollTo({ top: 0 });
  };

  const ensureLyrics = async (): Promise<void> => {
    if (!currentMeta?.lyricsUrl || !lyricsText || !lyricsStatus) {
      if (lyricsStatus) {
        lyricsStatus.hidden = false;
        lyricsStatus.textContent = currentMeta?.isInstrumental
          ? "This track is instrumental."
          : "Lyrics are not available for this track.";
      }
      lyricsText?.setAttribute("hidden", "");
      return;
    }
    const lyricsKey = currentMeta.lyricsUrl;
    if (currentLyricsKey === lyricsKey && lyricsText.textContent) {
      return;
    }
    currentLyricsKey = lyricsKey;
    lyricsStatus.hidden = false;
    lyricsStatus.textContent = "Loading lyrics…";
    lyricsText.hidden = true;
    try {
      const text = await loadLyrics(lyricsKey);
      if (currentLyricsKey !== lyricsKey) {
        return;
      }
      lyricsPages = splitLyricsPages(text);
      lyricsPage = 0;
      lyricsText.textContent = isReducedMotion() ? lyricsPages[0] || text : text;
      lyricsText.hidden = false;
      lyricsStatus.hidden = true;
      followTrack = true;
      if (followButton) {
        followButton.hidden = true;
      }
      renderLyricsPage();
    } catch {
      lyricsStatus.hidden = false;
      lyricsStatus.textContent = "Lyrics could not be loaded.";
      announce("Lyrics could not be loaded.");
    }
  };

  const renderTimeline = (queue: PlayerQueue, currentIndex: number): void => {
    if (!timeline || !timelineSummary) {
      return;
    }
    timeline.replaceChildren();
    timelineSummary.textContent = `${currentIndex + 1} of ${queue.tracks.length} tracks`;
    let lastAlbumId = "";

    queue.tracks.forEach((track, index) => {
      const seriesTrack = queue.kind === "series" ? queue.tracks[index] : null;
      const album =
        queue.kind === "album"
          ? queue.album
          : queue.tracks[index] && "album" in queue.tracks[index]
            ? queue.tracks[index].album
            : null;
      const albumId = album?.id || "";
      if (queue.kind === "series" && album && albumId !== lastAlbumId) {
        const heading = document.createElement("li");
        heading.className = "visuals-track-list__album";
        heading.textContent = `Part ${seriesTrack?.partNumber || 1}: ${album.title}`;
        timeline.append(heading);
        lastAlbumId = albumId;
      }

      const item = document.createElement("li");
      item.className = "visuals-track-list__item";
      const button = document.createElement("button");
      button.className = "visuals-track-list__button";
      button.type = "button";
      button.dataset.current = String(index === currentIndex);
      if (index === currentIndex) {
        button.setAttribute("aria-current", "true");
      }
      const number = document.createElement("span");
      number.className = "visuals-track-list__number";
      number.textContent = String(track.trackNumber).padStart(2, "0");
      const title = document.createElement("span");
      title.textContent = track.title;
      button.append(number, title);
      button.addEventListener(
        "click",
        () => dispatchLoad({ queue, startIndex: index, autoplay: true }),
        { signal }
      );
      item.append(button);
      timeline.append(item);
    });
  };

  const renderStaticVisualizer = (): void => {
    if (!isReducedMotion()) {
      return;
    }
    const progressValue =
      state && state.duration > 0 ? Math.min(1, state.currentTime / state.duration) : 0;
    visualizerBands.forEach((band, index) => {
      const wave = 0.14 + Math.abs(Math.sin((index + 1) * 0.72)) * 0.48;
      const active = index / visualizerBands.length <= progressValue ? 1 : 0.48;
      band.style.setProperty("--visuals-band-scale", String(wave * active));
    });
    if (visualizerNote) {
      visualizerNote.textContent = "Static frequency shape for Reduced Motion.";
    }
  };

  const startVisualizer = (): void => {
    window.cancelAnimationFrame(analyserFrame);
    if (isReducedMotion()) {
      renderStaticVisualizer();
      return;
    }
    if (!analyserEnabled) {
      if (visualizerNote) {
        visualizerNote.textContent = "Select Visualizer again to enable audio analysis.";
      }
      return;
    }
    if (visualizerNote) {
      visualizerNote.textContent = "";
    }

    const paint = (time: number): void => {
      if (root.dataset.mode !== "visualizer") {
        return;
      }
      if (
        state?.isPlaying &&
        time - lastAnalyserPaint >= 50 &&
        window.__melodyMindPlayer?.readAnalyserFrame(analyserBuffer)
      ) {
        lastAnalyserPaint = time;
        visualizerBands.forEach((band, index) => {
          const value = analyserBuffer[index] || 0;
          band.style.setProperty(
            "--visuals-band-scale",
            String(Math.max(0.06, value / 255))
          );
        });
      }
      analyserFrame = window.requestAnimationFrame(paint);
    };
    analyserFrame = window.requestAnimationFrame(paint);
  };

  const setStateLayer = (
    eyebrow: string,
    title: string,
    detail: string,
    action?: { label: string; command: PlayerCommand }
  ): void => {
    if (!stateLayer || !stateEyebrow || !stateTitle || !stateDetail || !stateAction) {
      return;
    }
    stateLayer.hidden = false;
    stateEyebrow.textContent = eyebrow;
    stateTitle.textContent = title;
    stateDetail.textContent = detail;
    stateAction.hidden = !action;
    stateAction.textContent = action?.label || "";
    stateAction.onclick = action ? () => dispatchCommand(action.command) : null;
  };

  const renderStateLayer = (nextState: PlayerState): void => {
    if (!stateLayer) {
      return;
    }
    const queue = nextState.queue;
    const track = queue?.tracks[nextState.currentTrackIndex];
    switch (nextState.playbackPhase) {
      case "idle":
        setStateLayer(
          "Visuals",
          "Nothing queued",
          "Start an album, station, or series in MelodyMind, then return here."
        );
        break;
      case "loading":
        setStateLayer(
          "Loading",
          track?.title || "Preparing the track",
          "The queue is ready. Playback will only begin after you press Play."
        );
        break;
      case "buffering":
        setStateLayer(
          "Buffering",
          track?.title || "Holding the room",
          "Playback will continue when enough audio is available."
        );
        break;
      case "intermission":
        {
          const nextAlbum =
            queue?.kind === "series"
              ? queue.tracks.find(
                  (queueTrack) =>
                    queueTrack.album.id === nextState.seriesIntermission?.beforeAlbumId
                )?.album
              : null;
          setStateLayer(
            `Part ${nextState.seriesIntermission?.fromPartNumber || ""} complete`,
            nextAlbum ? `Up next: ${nextAlbum.title}` : "The next album is ready",
            nextState.seriesIntermission?.transitionText ||
              "Continue when you are ready for the next album.",
            { label: "Continue series", command: { action: "continue-series" } }
          );
        }
        break;
      case "finished":
        setStateLayer(
          "Queue complete",
          queue?.title || "Listening complete",
          "The full queue has finished.",
          { label: "Play again", command: { action: "play" } }
        );
        break;
      case "error":
        setStateLayer(
          "Playback error",
          track?.title || "The track could not play",
          nextState.errorMessage || "Try the track again.",
          { label: "Retry", command: { action: "play" } }
        );
        break;
      default:
        stateLayer.hidden = true;
    }
  };

  const renderManifest = async (nextState: PlayerState): Promise<void> => {
    const albumId = getAlbumId(nextState);
    if (!albumId) {
      currentMeta = null;
      return;
    }
    const requestId = ++manifestRequestId;
    try {
      const nextManifest = await loadManifest(albumId);
      if (requestId !== manifestRequestId) {
        return;
      }
      const track = nextState.queue?.tracks[nextState.currentTrackIndex];
      currentMeta =
        nextManifest.tracks.find(
          (manifestTrack) => manifestTrack.trackNumber === track?.trackNumber
        ) || null;
      root.style.setProperty("--visuals-ambient-color", nextManifest.ambientColor);
      root.style.setProperty(
        "--visuals-backdrop",
        `url("${nextManifest.artworkUrl.replaceAll('"', '\\"')}")`
      );
      if (artwork) {
        artwork.src = nextManifest.artworkUrl;
        artwork.alt = `Cover art for ${nextManifest.title}`;
      }
      if (lyricsScroll) {
        lyricsScroll.lang = nextManifest.language;
      }
      currentLyricsKey = "";
      lyricsPages = [];
      if (preferences.mode === "lyrics") {
        await ensureLyrics();
      }
      updateModeAvailability(nextState);
      await setMode(preferences.mode);
    } catch {
      currentMeta = null;
      announce("Visual album data could not be loaded.");
      updateModeAvailability(nextState);
    }
  };

  const updateModeAvailability = (nextState: PlayerState): void => {
    const available = getAvailableVisualsModes(
      nextState.queue,
      currentMeta,
      analyserAvailable
    );
    modeButtons.forEach((button) => {
      const mode = button.dataset.visualsMode as VisualsMode;
      button.disabled = !available.includes(mode);
      if (mode === "timeline" && nextState.queue?.kind === "radio") {
        button.hidden = true;
      } else {
        button.hidden = false;
      }
    });
    if (!available.includes(preferences.mode)) {
      void setMode("cover");
    }
  };

  const render = (nextState: PlayerState): void => {
    const previousAlbumId = state ? getAlbumId(state) : null;
    const previousTrackIndex = state?.currentTrackIndex;
    state = nextState;
    const queue = nextState.queue;
    const track = queue?.tracks[nextState.currentTrackIndex];
    const album = getAlbumContext(nextState);
    root.dataset.playing = String(nextState.isPlaying);

    if (trackTitle) {
      trackTitle.textContent = track?.title || "Nothing queued";
    }
    if (albumTitle) {
      albumTitle.textContent =
        album?.title || "Start an album, station, or series in MelodyMind.";
    }
    if (roomLabel) {
      roomLabel.textContent = queue?.title || "Listening room";
    }
    if (contextText) {
      if (!queue) {
        contextText.textContent = "Waiting for a queue";
      } else if (queue.kind === "series") {
        const seriesTrack = queue.tracks[nextState.currentTrackIndex];
        contextText.textContent = `Series · Part ${seriesTrack?.partNumber || 1} of ${queue.series.albumCount} · Track ${nextState.currentTrackIndex + 1} of ${queue.tracks.length}`;
      } else if (queue.kind === "radio") {
        contextText.textContent = `Radio · ${queue.title} · Track ${nextState.currentTrackIndex + 1}`;
      } else {
        contextText.textContent = `Album · Track ${nextState.currentTrackIndex + 1} of ${queue.tracks.length}`;
      }
    }
    if (exit) {
      exit.href =
        queue?.kind === "series"
          ? queue.series.url
          : queue?.kind === "radio"
            ? "/radio/"
            : album?.url || "/";
    }
    const duration = Math.max(0, nextState.duration || track?.durationSeconds || 0);
    const current = Math.min(Math.max(0, nextState.currentTime), duration || Infinity);
    if (currentText) {
      currentText.textContent = formatTime(current);
    }
    if (remainingText) {
      remainingText.textContent = `-${formatTime(Math.max(0, duration - current))}`;
    }
    if (progress) {
      progress.max = String(Math.floor(duration));
      progress.value = String(Math.floor(current));
      progress.setAttribute(
        "aria-valuetext",
        `${formatTime(current)} elapsed, ${formatTime(Math.max(0, duration - current))} remaining`
      );
    }
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(nextState.isPlaying));
      toggle.setAttribute(
        "aria-label",
        `${nextState.isPlaying ? "Pause" : "Play"} ${track?.title || "track"}`
      );
    }

    if (queue) {
      renderTimeline(queue, nextState.currentTrackIndex);
    } else {
      timeline?.replaceChildren();
    }
    renderStateLayer(nextState);

    const nextAlbumId = getAlbumId(nextState);
    if (
      nextAlbumId !== previousAlbumId ||
      nextState.currentTrackIndex !== previousTrackIndex
    ) {
      void renderManifest(nextState);
    } else {
      updateModeAvailability(nextState);
    }

    if (
      preferences.mode === "lyrics" &&
      followTrack &&
      !isReducedMotion() &&
      lyricsScroll
    ) {
      const target = mapTrackProgressToScroll(
        current,
        duration,
        lyricsScroll.scrollHeight,
        lyricsScroll.clientHeight
      );
      lyricsScroll.scrollTo({ top: target, behavior: "smooth" });
    }
    if (preferences.mode === "visualizer" && isReducedMotion()) {
      renderStaticVisualizer();
    }
    void syncWakeLock();
  };

  modeButtons.forEach((button) => {
    button.addEventListener(
      "click",
      () => void setMode(button.dataset.visualsMode as VisualsMode, true),
      { signal }
    );
  });
  root.querySelectorAll<HTMLButtonElement>("[data-visuals-command]").forEach((button) => {
    button.addEventListener(
      "click",
      () =>
        dispatchCommand({
          action: button.dataset.visualsCommand as PlayerCommand["action"],
        } as PlayerCommand),
      { signal }
    );
  });
  progress?.addEventListener(
    "input",
    () => dispatchCommand({ action: "seek", value: Number(progress.value) }),
    { signal }
  );
  motionSelect?.addEventListener(
    "change",
    () => {
      preferences = {
        ...preferences,
        motion: motionSelect.value as VisualsMotionPreference,
      };
      savePreferences();
      updateMotion();
    },
    { signal }
  );
  fullscreen?.addEventListener(
    "click",
    async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else {
          await document.documentElement.requestFullscreen();
        }
      } catch {
        announce("Fullscreen is not available in this browser.");
      }
    },
    { signal }
  );
  document.addEventListener(
    "fullscreenchange",
    () => {
      const active = Boolean(document.fullscreenElement);
      root.dataset.fullscreen = String(active);
      fullscreen?.setAttribute(
        "aria-label",
        active ? "Exit fullscreen" : "Enter fullscreen"
      );
    },
    { signal }
  );
  const stopFollowing = (): void => {
    if (isReducedMotion()) {
      return;
    }
    followTrack = false;
    if (followButton) {
      followButton.hidden = false;
    }
  };
  lyricsScroll?.addEventListener("wheel", stopFollowing, { signal, passive: true });
  lyricsScroll?.addEventListener("touchstart", stopFollowing, {
    signal,
    passive: true,
  });
  lyricsScroll?.addEventListener(
    "keydown",
    (event) => {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(
          event.key
        )
      ) {
        stopFollowing();
      }
    },
    { signal }
  );
  followButton?.addEventListener(
    "click",
    () => {
      followTrack = true;
      followButton.hidden = true;
      if (state) {
        render(state);
      }
    },
    { signal }
  );
  root
    .querySelector<HTMLButtonElement>("[data-visuals-lyrics-previous]")
    ?.addEventListener(
      "click",
      () => {
        lyricsPage -= 1;
        renderLyricsPage();
      },
      { signal }
    );
  root.querySelector<HTMLButtonElement>("[data-visuals-lyrics-next]")?.addEventListener(
    "click",
    () => {
      lyricsPage += 1;
      renderLyricsPage();
    },
    { signal }
  );
  ["pointermove", "pointerdown", "touchstart", "keydown", "focusin"].forEach(
    (eventName) => {
      root.addEventListener(eventName, showControls, {
        signal,
        passive: eventName !== "keydown",
      });
    }
  );
  document.addEventListener(
    "visibilitychange",
    () => {
      void syncWakeLock();
    },
    { signal }
  );
  systemReducedMotion.addEventListener("change", updateMotion, { signal });
  window.addEventListener("melodymind:playback-state", (event) => render(event.detail), {
    signal,
  });
  exit?.addEventListener(
    "click",
    () => {
      void releaseWakeLock();
    },
    { signal }
  );
  document.addEventListener(
    "astro:before-swap",
    () => {
      window.clearTimeout(controlsTimer);
      window.cancelAnimationFrame(analyserFrame);
      void releaseWakeLock();
      if (originalGlobalPlayer) {
        originalGlobalPlayer.inert = false;
        originalGlobalPlayer.removeAttribute("aria-hidden");
      }
      controller.abort();
    },
    { signal, once: true }
  );

  if (motionSelect) {
    motionSelect.value = preferences.motion;
  }
  updateMotion();
  if (state) {
    render(state);
    void renderManifest(state);
  } else {
    render({
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
    });
  }
  showControls();
};

document.addEventListener("astro:page-load", initVisuals);
initVisuals();
