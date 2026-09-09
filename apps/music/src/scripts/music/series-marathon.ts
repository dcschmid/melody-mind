import type {
  PlayerCommand,
  PlayerLoadDetail,
  PlayerState,
  SeriesPlayerIntermission,
  SeriesPlayerQueue,
} from "../../types/player";
import { isPlayerQueue } from "./player-queue-loader";
import {
  clearSeriesMarathonProgress,
  readSeriesMarathonProgress,
  type SeriesMarathonProgress,
} from "./series-marathon-storage";

const dispatchLoad = (detail: PlayerLoadDetail): void => {
  window.dispatchEvent(
    new CustomEvent<PlayerLoadDetail>("melodymind:player-load", { detail })
  );
};

const dispatchCommand = (command: PlayerCommand): void => {
  window.dispatchEvent(
    new CustomEvent<PlayerCommand>("melodymind:player-command", { detail: command })
  );
};

const resolveProgressIndex = (
  queue: SeriesPlayerQueue,
  progress: SeriesMarathonProgress
): number =>
  queue.tracks.findIndex(
    (track) =>
      track.album.id.toLocaleLowerCase("en") ===
        progress.albumId.toLocaleLowerCase("en") &&
      track.trackNumber === progress.trackNumber
  );

const getIntermission = (
  queue: SeriesPlayerQueue,
  progress: SeriesMarathonProgress,
  currentIndex: number
): SeriesPlayerIntermission | null => {
  if (progress.phase !== "intermission" || !progress.nextAlbumId) {
    return null;
  }
  const currentTrack = queue.tracks[currentIndex];
  const nextTrack = queue.tracks.find(
    (track, index) =>
      index > currentIndex &&
      track.album.id.toLocaleLowerCase("en") ===
        progress.nextAlbumId?.toLocaleLowerCase("en")
  );
  const transition = queue.transitions.find(
    (item) =>
      item.beforeAlbumId.toLocaleLowerCase("en") ===
      nextTrack?.album.id.toLocaleLowerCase("en")
  );
  if (!currentTrack || !nextTrack || !transition) {
    return null;
  }

  return {
    ...transition,
    fromPartNumber: currentTrack.partNumber,
    toPartNumber: nextTrack.partNumber,
  };
};

const getProgressPercent = (
  queue: SeriesPlayerQueue,
  trackIndex: number,
  currentTime: number,
  completed: boolean
): number | null => {
  const totalDuration = queue.series.totalDurationSeconds;
  if (!totalDuration) {
    return null;
  }
  if (completed) {
    return 100;
  }
  const completedDuration = queue.tracks
    .slice(0, trackIndex)
    .reduce((total, track) => total + (track.durationSeconds || 0), 0);
  const trackDuration = queue.tracks[trackIndex]?.durationSeconds || currentTime;
  const elapsed = completedDuration + Math.min(currentTime, trackDuration);
  return Math.min(100, Math.round((elapsed / totalDuration) * 100));
};

const bindSeriesMarathon = (): void => {
  const root = document.querySelector<HTMLElement>("[data-series-marathon]");
  if (!root || root.dataset.seriesMarathonBound === "true") {
    return;
  }
  root.dataset.seriesMarathonBound = "true";

  const seriesId = root.dataset.seriesId;
  const queueScriptId = root.dataset.queueScriptId;
  const queueScript = queueScriptId ? document.getElementById(queueScriptId) : null;
  if (!seriesId || !queueScript?.textContent) {
    return;
  }

  let parsedQueue: unknown;
  try {
    parsedQueue = JSON.parse(queueScript.textContent);
  } catch {
    return;
  }
  if (!isPlayerQueue(parsedQueue) || parsedQueue.kind !== "series") {
    return;
  }
  const queue = parsedQueue;
  const primary = root.querySelector<HTMLButtonElement>("[data-series-marathon-primary]");
  const primaryLabel = root.querySelector<HTMLElement>(
    "[data-series-marathon-primary-label]"
  );
  const reset = root.querySelector<HTMLButtonElement>("[data-series-marathon-reset]");
  const status = root.querySelector<HTMLElement>("[data-series-marathon-status]");
  const albumItems = Array.from(
    document.querySelectorAll<HTMLElement>("[data-series-album]")
  );
  const controller = new AbortController();
  const { signal } = controller;
  let playerState = window.__melodyMindPlayer?.getState() || null;

  const getActiveState = (): PlayerState | null =>
    playerState?.queue?.kind === "series" &&
    playerState.queue.series.id === queue.series.id
      ? playerState
      : null;

  const getSavedProgress = (): SeriesMarathonProgress | null => {
    const progress = readSeriesMarathonProgress(seriesId);
    if (!progress) {
      return null;
    }
    if (resolveProgressIndex(queue, progress) >= 0) {
      return progress;
    }
    clearSeriesMarathonProgress(seriesId);
    return null;
  };

  const loadFromProgress = (progress: SeriesMarathonProgress): void => {
    const startIndex = resolveProgressIndex(queue, progress);
    if (startIndex < 0) {
      clearSeriesMarathonProgress(seriesId);
      dispatchLoad({ queue, startIndex: 0, startTime: 0, autoplay: true });
      return;
    }
    const seriesIntermission = getIntermission(queue, progress, startIndex);
    dispatchLoad({
      queue,
      startIndex,
      startTime: progress.currentTime,
      autoplay: !seriesIntermission,
      seriesIntermission,
    });
  };

  const renderAlbums = (
    progress: SeriesMarathonProgress | null,
    active: PlayerState | null
  ): void => {
    const completed = progress?.phase === "completed";
    const progressIndex = active
      ? active.currentTrackIndex
      : progress
        ? resolveProgressIndex(queue, progress)
        : -1;
    const progressTrack = queue.tracks[progressIndex];
    const currentAlbumId =
      progress?.phase === "intermission" && progress.nextAlbumId
        ? progress.nextAlbumId
        : progressTrack?.album.id;
    const currentPart =
      queue.tracks.find((track) => track.album.id === currentAlbumId)?.partNumber || 0;

    albumItems.forEach((item) => {
      const albumId = item.dataset.seriesAlbumId;
      const partNumber =
        queue.tracks.find((track) => track.album.id === albumId)?.partNumber || 0;
      const stateLabel = item.querySelector<HTMLElement>("[data-series-album-state]");
      const link = item.querySelector<HTMLAnchorElement>(
        "[data-testid='series-album-card']"
      );
      const itemState = completed
        ? "completed"
        : currentPart > 0 && partNumber < currentPart
          ? "completed"
          : partNumber === currentPart
            ? "current"
            : "upcoming";
      item.dataset.marathonState = itemState;
      if (itemState === "current") {
        link?.setAttribute("aria-current", "step");
      } else {
        link?.removeAttribute("aria-current");
      }
      if (stateLabel) {
        stateLabel.hidden = itemState === "upcoming";
        stateLabel.textContent =
          itemState === "completed"
            ? "Completed"
            : progress?.phase === "intermission"
              ? "Up next"
              : active?.isPlaying
                ? "Now playing"
                : "Resume here";
      }
    });
  };

  const render = (): void => {
    const active = getActiveState();
    const saved = getSavedProgress();
    const currentProgress =
      active?.queue?.kind === "series"
        ? {
            seriesId,
            albumId: active.queue.tracks[active.currentTrackIndex]?.album.id || "",
            trackNumber: active.queue.tracks[active.currentTrackIndex]?.trackNumber || 1,
            currentTime: active.currentTime,
            phase:
              saved?.phase === "completed"
                ? ("completed" as const)
                : active.seriesIntermission
                  ? ("intermission" as const)
                  : ("listening" as const),
            ...(active.seriesIntermission
              ? { nextAlbumId: active.seriesIntermission.beforeAlbumId }
              : {}),
            updatedAt: active.updatedAt,
          }
        : saved;
    renderAlbums(currentProgress, active);

    if (!primary || !primaryLabel || !status) {
      return;
    }
    const progressIndex = currentProgress
      ? resolveProgressIndex(queue, currentProgress)
      : -1;
    const progressTrack = queue.tracks[progressIndex];
    const percent =
      progressIndex >= 0 && currentProgress
        ? getProgressPercent(
            queue,
            progressIndex,
            currentProgress.currentTime,
            currentProgress.phase === "completed"
          )
        : null;
    const progressSuffix = percent === null ? "" : ` · ${percent}%`;

    primary.disabled = Boolean(active?.isPlaying);
    reset?.toggleAttribute(
      "hidden",
      !currentProgress || currentProgress.phase === "completed"
    );

    if (active?.isPlaying && progressTrack) {
      primaryLabel.textContent = "Series playing";
      status.textContent = `Part ${progressTrack.partNumber}, ${progressTrack.title}${progressSuffix}`;
    } else if (active?.seriesIntermission && progressTrack) {
      const nextTrack = queue.tracks.find(
        (track) => track.album.id === active.seriesIntermission?.beforeAlbumId
      );
      primaryLabel.textContent = "Play next album";
      status.textContent = `Part ${progressTrack.partNumber} complete${nextTrack ? `. Up next: ${nextTrack.album.title}` : ""}${progressSuffix}`;
    } else if (currentProgress?.phase === "completed") {
      primaryLabel.textContent = "Play again";
      status.textContent = "Series completed · 100%";
    } else if (active && progressTrack) {
      primaryLabel.textContent = "Continue series";
      status.textContent = `Paused at Part ${progressTrack.partNumber}, ${progressTrack.title}${progressSuffix}`;
    } else if (currentProgress && progressTrack) {
      primaryLabel.textContent = "Resume series";
      status.textContent =
        currentProgress.phase === "intermission"
          ? `Part ${progressTrack.partNumber} complete. Resume with the next album${progressSuffix}`
          : `Saved at Part ${progressTrack.partNumber}, ${progressTrack.title}${progressSuffix}`;
    } else {
      primaryLabel.textContent = "Play full series";
      status.textContent = "Playback pauses between albums.";
    }
  };

  primary?.addEventListener(
    "click",
    () => {
      const active = getActiveState();
      const saved = getSavedProgress();
      if (active?.seriesIntermission) {
        dispatchCommand({ action: "continue-series" });
      } else if (active && saved?.phase !== "completed") {
        dispatchCommand({ action: "play" });
      } else if (saved?.phase === "completed" || !saved) {
        dispatchLoad({ queue, startIndex: 0, startTime: 0, autoplay: true });
      } else {
        loadFromProgress(saved);
      }
    },
    { signal }
  );

  reset?.addEventListener(
    "click",
    () => {
      clearSeriesMarathonProgress(seriesId);
      dispatchLoad({ queue, startIndex: 0, startTime: 0, autoplay: true });
    },
    { signal }
  );

  window.addEventListener(
    "melodymind:playback-state",
    (event) => {
      playerState = event.detail;
      render();
    },
    { signal }
  );
  document.addEventListener("astro:before-swap", () => controller.abort(), {
    once: true,
    signal,
  });

  render();
  window.requestAnimationFrame(() => {
    playerState = window.__melodyMindPlayer?.getState() || playerState;
    render();
  });
};

document.addEventListener("astro:page-load", bindSeriesMarathon);
bindSeriesMarathon();
