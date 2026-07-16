import { formatTime } from "@utils/time";
import type {
  PlayerCommand,
  PlayerLoadDetail,
  PlayerQueue,
  PlayerState,
} from "../../types/player";

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

const getExtension = (url: string): string => {
  try {
    const match = new URL(url, window.location.href).pathname.match(/\.([a-z0-9]+)$/i);
    return match?.[1] ? `.${match[1].toLowerCase()}` : ".mp3";
  } catch {
    return ".mp3";
  }
};

const downloadTrack = async (button: HTMLButtonElement): Promise<void> => {
  const url = button.dataset.downloadUrl;
  const baseName = button.dataset.downloadFilename || "track";
  if (!url || button.dataset.downloading === "true") {
    return;
  }

  button.dataset.downloading = "true";
  button.setAttribute("aria-busy", "true");
  const filename = `${baseName}${getExtension(url)}`;

  try {
    const response = await fetch(url, { credentials: "omit" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const blobUrl = URL.createObjectURL(await response.blob());
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = filename;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  } catch {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } finally {
    button.dataset.downloading = "false";
    button.removeAttribute("aria-busy");
  }
};

const parseQueue = (player: HTMLElement): PlayerQueue | null => {
  const script = player.querySelector<HTMLScriptElement>("[data-player-queue]");
  if (!script?.textContent) {
    return null;
  }

  try {
    return JSON.parse(script.textContent) as PlayerQueue;
  } catch {
    return null;
  }
};

const bindPlayer = (player: HTMLElement): void => {
  if (player.dataset.playlistPlayerBound === "true") {
    return;
  }

  const queue = parseQueue(player);
  if (!queue?.tracks.length) {
    return;
  }

  player.dataset.playlistPlayerBound = "true";
  const controller = new AbortController();
  const { signal } = controller;
  const toggle = player.querySelector<HTMLButtonElement>('[data-action="toggle"]');
  const progress = player.querySelector<HTMLInputElement>("[data-playlist-progress]");
  const currentTime = player.querySelector<HTMLElement>("[data-current-time]");
  const remainingTime = player.querySelector<HTMLElement>("[data-remaining-time]");
  const currentTitle = player.querySelector<HTMLElement>("[data-current-track-title]");
  const status = player.querySelector<HTMLElement>("[data-playlist-status]");
  const volume = player.querySelector<HTMLButtonElement>('[data-action="volume"]');
  const trackItems = Array.from(
    player.querySelectorAll<HTMLElement>("[data-track-index]")
  );
  const trackButtons = Array.from(
    player.querySelectorAll<HTMLButtonElement>("[data-track-button]")
  );

  let latestState = window.__melodyMindPlayer?.getState() || null;
  let lastStatusKey = "";
  const isThisAlbum = (state: PlayerState | null): state is PlayerState =>
    state?.queue?.albumId === queue.albumId;

  const render = (state: PlayerState | null): void => {
    latestState = state;
    const active = isThisAlbum(state);
    const index = active ? state.currentTrackIndex : -1;
    const track = active ? state.queue?.tracks[index] : queue.tracks[0];
    const duration = active ? state.duration : track?.durationSeconds || 0;
    const elapsed = active ? state.currentTime : 0;
    const remaining = Math.max(duration - elapsed, 0);

    player.dataset.playerState = active && state.isPlaying ? "playing" : "paused";
    player.dataset.playerMuted = active && state.isMuted ? "true" : "false";
    if (currentTitle) {
      currentTitle.textContent = track?.title || "Cue the first track";
    }
    if (currentTime) {
      currentTime.textContent = formatTime(elapsed);
    }
    if (remainingTime) {
      remainingTime.textContent = `-${formatTime(remaining)}`;
    }
    if (progress) {
      progress.max = String(Math.floor(duration));
      progress.value = String(Math.floor(elapsed));
      progress.setAttribute(
        "aria-valuetext",
        `${formatTime(elapsed)} elapsed, ${formatTime(remaining)} remaining`
      );
    }
    if (toggle) {
      const playing = active && state.isPlaying;
      toggle.setAttribute("aria-pressed", String(playing));
      toggle.setAttribute(
        "aria-label",
        `${playing ? "Pause" : "Play"} ${track?.title || queue.albumTitle}`
      );
    }
    if (volume) {
      volume.setAttribute("aria-pressed", String(active && state.isMuted));
      volume.setAttribute("aria-label", active && state.isMuted ? "Unmute" : "Mute");
    }

    trackItems.forEach((item, itemIndex) => {
      const current = itemIndex === index;
      item.dataset.isCurrent = String(current);
      item.dataset.isPlaying = String(current && Boolean(state?.isPlaying));
      if (current) {
        trackButtons[itemIndex]?.setAttribute("aria-current", "true");
      } else {
        trackButtons[itemIndex]?.removeAttribute("aria-current");
      }
    });
  };

  const loadOrCommand = (command: PlayerCommand, startIndex = 0): void => {
    if (isThisAlbum(latestState)) {
      dispatchCommand(command);
    } else {
      dispatchLoad({ queue, startIndex, autoplay: true });
    }
  };

  toggle?.addEventListener("click", () => loadOrCommand({ action: "toggle" }), {
    signal,
  });
  player
    .querySelector<HTMLButtonElement>('[data-action="prev"]')
    ?.addEventListener("click", () => loadOrCommand({ action: "previous" }), { signal });
  player
    .querySelector<HTMLButtonElement>('[data-action="next"]')
    ?.addEventListener("click", () => loadOrCommand({ action: "next" }), { signal });
  player
    .querySelector<HTMLButtonElement>('[data-action="shuffle"]')
    ?.addEventListener("click", () => loadOrCommand({ action: "shuffle" }), { signal });
  volume?.addEventListener("click", () => loadOrCommand({ action: "mute" }), {
    signal,
  });
  progress?.addEventListener(
    "input",
    () => {
      if (isThisAlbum(latestState)) {
        dispatchCommand({ action: "seek", value: Number(progress.value) });
      }
    },
    { signal }
  );
  trackButtons.forEach((button, index) => {
    button.addEventListener(
      "click",
      () => dispatchLoad({ queue, startIndex: index, autoplay: true }),
      { signal }
    );
  });
  document
    .querySelectorAll<HTMLButtonElement>(
      `[data-album-hero-play="${CSS.escape(queue.albumId)}"]`
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => dispatchLoad({ queue, startIndex: 0, autoplay: true }),
        { signal }
      );
    });
  player
    .querySelectorAll<HTMLButtonElement>("[data-track-download]")
    .forEach((button) => {
      button.addEventListener("click", () => void downloadTrack(button), { signal });
    });
  player.addEventListener(
    "keydown",
    (event) => {
      if (
        event.target instanceof HTMLButtonElement ||
        event.target instanceof HTMLAnchorElement ||
        event.target instanceof HTMLInputElement
      ) {
        return;
      }
      if (event.key === " " || event.key.toLowerCase() === "k") {
        event.preventDefault();
        loadOrCommand({ action: "toggle" });
      }
    },
    { signal }
  );
  window.addEventListener(
    "melodymind:playback-state",
    (event) => {
      render(event.detail);
      if (status && isThisAlbum(event.detail)) {
        const track = event.detail.queue?.tracks[event.detail.currentTrackIndex];
        const statusKey = `${event.detail.currentTrackIndex}:${event.detail.isPlaying}`;
        if (statusKey !== lastStatusKey) {
          lastStatusKey = statusKey;
          status.textContent = `${event.detail.isPlaying ? "Playing" : "Paused"} ${track?.title || queue.albumTitle}`;
        }
      }
    },
    { signal }
  );
  document.addEventListener("astro:before-swap", () => controller.abort(), {
    once: true,
    signal,
  });

  render(latestState);
};

const initPlaylistPlayers = (): void => {
  document
    .querySelectorAll<HTMLElement>("[data-album-playlist-player]")
    .forEach(bindPlayer);
};

document.addEventListener("astro:page-load", initPlaylistPlayers);
initPlaylistPlayers();
