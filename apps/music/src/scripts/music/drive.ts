import { formatTime } from "@utils/time";
import {
  DRIVE_PREFERENCES_KEY,
  getDriveAlbumContext,
  getDriveAnnouncement,
  getDriveTrackKey,
  parseDrivePreferences,
} from "@utils/drive";
import type { PlayerCommand, PlayerState } from "../../types/player";

const dispatchCommand = (command: PlayerCommand): void => {
  window.dispatchEvent(
    new CustomEvent<PlayerCommand>("melodymind:player-command", { detail: command })
  );
};

const initDrive = (): void => {
  const root = document.querySelector<HTMLElement>("[data-drive]");
  if (!root || root.dataset.driveBound === "true") {
    return;
  }
  root.dataset.driveBound = "true";

  const controller = new AbortController();
  const { signal } = controller;
  const artworkFrame = root.querySelector<HTMLElement>("[data-drive-artwork-frame]");
  const artwork = root.querySelector<HTMLImageElement>("[data-drive-artwork]");
  const context = root.querySelector<HTMLElement>("[data-drive-context]");
  const trackTitle = root.querySelector<HTMLElement>("[data-drive-track]");
  const albumTitle = root.querySelector<HTMLElement>("[data-drive-album]");
  const currentTime = root.querySelector<HTMLElement>("[data-drive-current]");
  const remainingTime = root.querySelector<HTMLElement>("[data-drive-remaining]");
  const progress = root.querySelector<HTMLProgressElement>("[data-drive-progress]");
  const toggle = root.querySelector<HTMLButtonElement>('[data-drive-command="toggle"]');
  const transportButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-drive-command]")
  );
  const announcements = root.querySelector<HTMLButtonElement>(
    "[data-drive-announcements]"
  );
  const announcementsLabel = root.querySelector<HTMLElement>(
    "[data-drive-announcements-label]"
  );
  const statePanel = root.querySelector<HTMLElement>("[data-drive-state]");
  const stateEyebrow = root.querySelector<HTMLElement>("[data-drive-state-eyebrow]");
  const stateTitle = root.querySelector<HTMLElement>("[data-drive-state-title]");
  const stateDetail = root.querySelector<HTMLElement>("[data-drive-state-detail]");
  const stateAction = root.querySelector<HTMLButtonElement>("[data-drive-state-action]");
  const stateLink = root.querySelector<HTMLAnchorElement>("[data-drive-state-link]");
  const status = root.querySelector<HTMLElement>("[data-drive-status]");
  const exit = root.querySelector<HTMLAnchorElement>("[data-drive-exit]");
  const originalGlobalPlayer =
    document.querySelector<HTMLElement>("[data-global-player]");
  originalGlobalPlayer?.setAttribute("aria-hidden", "true");
  if (originalGlobalPlayer) {
    originalGlobalPlayer.inert = true;
  }

  const supportsSpeech =
    "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
  let preferences = (() => {
    try {
      return parseDrivePreferences(window.localStorage.getItem(DRIVE_PREFERENCES_KEY));
    } catch {
      return parseDrivePreferences(null);
    }
  })();
  let state = window.__melodyMindPlayer?.getState() || null;
  let lastSpokenTrackKey = "";
  let speechRequestId = 0;

  const announce = (message: string): void => {
    if (status) {
      status.textContent = message;
    }
  };

  const savePreferences = (): void => {
    try {
      window.localStorage.setItem(DRIVE_PREFERENCES_KEY, JSON.stringify(preferences));
    } catch {
      // Drive remains usable when local storage is blocked.
    }
  };

  const stopSpeech = (): void => {
    speechRequestId += 1;
    if (supportsSpeech) {
      window.speechSynthesis.cancel();
    }
    window.__melodyMindPlayer?.setDucked(false);
  };

  const updateAnnouncementControl = (): void => {
    if (!announcements || !announcementsLabel) {
      return;
    }
    if (!supportsSpeech) {
      announcements.disabled = true;
      announcements.setAttribute("aria-label", "Voice announcements unavailable");
      announcementsLabel.textContent = "Voice unavailable";
      return;
    }

    announcements.disabled = false;
    announcements.setAttribute("aria-pressed", String(preferences.announcementsEnabled));
    announcements.setAttribute(
      "aria-label",
      preferences.announcementsEnabled
        ? "Turn voice announcements off"
        : "Turn voice announcements on"
    );
    announcementsLabel.textContent = preferences.announcementsEnabled
      ? "Voice on"
      : "Voice off";
  };

  const speakCurrent = (nextState: PlayerState, force = false): void => {
    if (!supportsSpeech || !preferences.announcementsEnabled || !nextState.queue) {
      return;
    }
    if (!force && !nextState.isPlaying) {
      return;
    }

    const trackKey = getDriveTrackKey(nextState.queue, nextState.currentTrackIndex);
    if (!force && trackKey === lastSpokenTrackKey) {
      return;
    }
    const message = getDriveAnnouncement(nextState.queue, nextState.currentTrackIndex);
    if (!message) {
      return;
    }

    stopSpeech();
    const requestId = ++speechRequestId;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = document.documentElement.lang || "en";
    const finish = (): void => {
      if (requestId === speechRequestId) {
        window.__melodyMindPlayer?.setDucked(false);
      }
    };
    utterance.addEventListener("end", finish, { once: true });
    utterance.addEventListener("error", finish, { once: true });
    lastSpokenTrackKey = trackKey;
    window.__melodyMindPlayer?.setDucked(true);
    window.speechSynthesis.speak(utterance);
  };

  const setStatePanel = (
    eyebrow: string,
    title: string,
    detail: string,
    action?: { label: string; command: PlayerCommand },
    link?: { label: string; href: string }
  ): void => {
    if (
      !statePanel ||
      !stateEyebrow ||
      !stateTitle ||
      !stateDetail ||
      !stateAction ||
      !stateLink
    ) {
      return;
    }
    statePanel.hidden = false;
    stateEyebrow.textContent = eyebrow;
    stateTitle.textContent = title;
    stateDetail.textContent = detail;
    stateAction.hidden = !action;
    stateAction.textContent = action?.label || "";
    stateAction.onclick = action ? () => dispatchCommand(action.command) : null;
    stateLink.hidden = !link;
    stateLink.textContent = link?.label || "";
    stateLink.href = link?.href || "/";
  };

  const renderStatePanel = (nextState: PlayerState): void => {
    if (!statePanel) {
      return;
    }
    const queue = nextState.queue;
    const track = queue?.tracks[nextState.currentTrackIndex];

    switch (nextState.playbackPhase) {
      case "idle":
        setStatePanel(
          "Drive",
          "Nothing queued",
          "Choose an album or series before setting off.",
          undefined,
          { label: "Browse music", href: "/" }
        );
        break;
      case "loading":
        setStatePanel(
          "Loading",
          track?.title || "Preparing the track",
          "Playback will be ready in a moment."
        );
        break;
      case "buffering":
        setStatePanel(
          "Buffering",
          track?.title || "Waiting for audio",
          "Playback will continue automatically."
        );
        break;
      case "intermission": {
        const nextTrack =
          queue?.kind === "series"
            ? queue.tracks.find(
                (queueTrack) =>
                  queueTrack.album.id === nextState.seriesIntermission?.beforeAlbumId
              )
            : null;
        setStatePanel(
          `Part ${nextState.seriesIntermission?.fromPartNumber || ""} complete`,
          nextTrack ? `Up next: ${nextTrack.album.title}` : "Next album ready",
          `Part ${nextState.seriesIntermission?.toPartNumber || ""} is ready.`,
          {
            label: "Continue series",
            command: { action: "continue-series" },
          }
        );
        break;
      }
      case "finished":
        setStatePanel(
          "Queue complete",
          queue?.title || "Listening complete",
          "The full queue has finished.",
          { label: "Play again", command: { action: "play" } }
        );
        break;
      case "error":
        setStatePanel(
          "Playback error",
          track?.title || "The track could not play",
          nextState.errorMessage || "Try the track again.",
          { label: "Retry", command: { action: "play" } }
        );
        break;
      default:
        statePanel.hidden = true;
    }
  };

  const render = (nextState: PlayerState): void => {
    state = nextState;
    const queue = nextState.queue;
    const track = queue?.tracks[nextState.currentTrackIndex];
    const album = queue ? getDriveAlbumContext(queue, nextState.currentTrackIndex) : null;
    root.dataset.playing = String(nextState.isPlaying);
    root.dataset.playerState = nextState.playbackPhase;

    if (trackTitle) {
      trackTitle.textContent = track?.title || "Nothing queued";
    }
    if (albumTitle) {
      albumTitle.textContent = album?.title || "Choose your music before setting off.";
    }
    if (context) {
      if (!queue) {
        context.textContent = "Waiting for a queue";
      } else if (queue.kind === "series") {
        const seriesTrack = queue.tracks[nextState.currentTrackIndex];
        context.textContent = `Series · Part ${seriesTrack?.partNumber || 1} of ${queue.series.albumCount} · Track ${nextState.currentTrackIndex + 1} of ${queue.tracks.length}`;
      } else if (queue.kind === "radio") {
        context.textContent = `Radio · Track ${nextState.currentTrackIndex + 1} of ${queue.tracks.length}`;
      } else {
        context.textContent = `Album · Track ${nextState.currentTrackIndex + 1} of ${queue.tracks.length}`;
      }
    }
    if (artwork && artworkFrame) {
      const artworkUrl = album?.artworkUrl;
      artwork.hidden = !artworkUrl;
      artworkFrame.dataset.empty = String(!artworkUrl);
      if (artworkUrl) {
        artwork.src = artworkUrl;
        artwork.alt = `Cover art for ${album.title}`;
      } else {
        artwork.removeAttribute("src");
        artwork.alt = "";
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
    const remaining = Math.max(0, duration - current);
    if (currentTime) {
      currentTime.textContent = formatTime(current);
    }
    if (remainingTime) {
      remainingTime.textContent = `-${formatTime(remaining)}`;
    }
    if (progress) {
      progress.max = Math.max(1, Math.floor(duration));
      progress.value = Math.floor(current);
      progress.setAttribute(
        "aria-valuetext",
        `${formatTime(current)} elapsed, ${formatTime(remaining)} remaining`
      );
    }
    transportButtons.forEach((button) => {
      button.disabled = !queue;
    });
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(nextState.isPlaying));
      toggle.setAttribute(
        "aria-label",
        nextState.seriesIntermission
          ? "Continue series"
          : nextState.errorMessage
            ? `Retry ${track?.title || "track"}`
            : nextState.playbackPhase === "finished"
              ? `Play ${queue?.title || "queue"} again`
              : `${nextState.isPlaying ? "Pause" : "Play"} ${track?.title || "track"}`
      );
    }
    renderStatePanel(nextState);
  };

  transportButtons.forEach((button) => {
    button.addEventListener(
      "click",
      () =>
        dispatchCommand({
          action: button.dataset.driveCommand as PlayerCommand["action"],
        } as PlayerCommand),
      { signal }
    );
  });
  announcements?.addEventListener(
    "click",
    () => {
      preferences = {
        announcementsEnabled: !preferences.announcementsEnabled,
      };
      savePreferences();
      updateAnnouncementControl();
      if (preferences.announcementsEnabled && state) {
        speakCurrent(state, true);
        announce("Voice announcements on.");
      } else {
        stopSpeech();
        announce("Voice announcements off.");
      }
    },
    { signal }
  );
  window.addEventListener(
    "melodymind:playback-state",
    (event) => {
      render(event.detail);
      speakCurrent(event.detail);
    },
    { signal }
  );
  exit?.addEventListener("click", stopSpeech, { signal });
  document.addEventListener(
    "astro:before-swap",
    () => {
      stopSpeech();
      if (originalGlobalPlayer) {
        originalGlobalPlayer.inert = false;
        originalGlobalPlayer.removeAttribute("aria-hidden");
      }
      controller.abort();
    },
    { signal, once: true }
  );

  updateAnnouncementControl();
  if (!supportsSpeech) {
    announce("Voice announcements are unavailable in this browser.");
  }
  if (state) {
    render(state);
    speakCurrent(state);
  }
};

document.addEventListener("astro:page-load", initDrive);
initDrive();
