import { formatTime } from "@utils/time";

interface EmbedTrack {
  trackNumber: number;
  title: string;
  audioUrl: string;
  durationSeconds?: number;
}

interface EmbedPlayerData {
  album: {
    id: string;
    title: string;
    url: string;
    artworkUrl: string;
  };
  tracks: EmbedTrack[];
}

const parsePlayerData = (root: HTMLElement): EmbedPlayerData | null => {
  const data = root.querySelector<HTMLScriptElement>("[data-embed-player-data]");
  if (!data?.textContent) {
    return null;
  }

  try {
    const parsed = JSON.parse(data.textContent) as EmbedPlayerData;
    return parsed.tracks.length > 0 ? parsed : null;
  } catch {
    return null;
  }
};

const getInitialTrackIndex = (tracks: EmbedTrack[]): number => {
  const rawTrackNumber = new URLSearchParams(window.location.search).get("track");
  const trackNumber = rawTrackNumber ? Number.parseInt(rawTrackNumber, 10) : NaN;
  const index = tracks.findIndex((track) => track.trackNumber === trackNumber);
  return index >= 0 ? index : 0;
};

const getCoverVisibility = (): boolean =>
  new URLSearchParams(window.location.search).get("cover") !== "0";

const bindEmbedPlayer = (root: HTMLElement): void => {
  if (root.dataset.embedPlayerBound === "true") {
    return;
  }

  const playerData = parsePlayerData(root);
  const audio = root.querySelector<HTMLAudioElement>("[data-embed-audio]");
  if (!playerData || !audio) {
    return;
  }

  root.dataset.embedPlayerBound = "true";
  const coverVisible = getCoverVisibility();
  root.dataset.coverVisible = String(coverVisible);

  const artwork = root.querySelector<HTMLImageElement>("[data-embed-artwork]");
  const toggle = root.querySelector<HTMLButtonElement>('[data-embed-action="toggle"]');
  const previous = root.querySelector<HTMLButtonElement>(
    '[data-embed-action="previous"]'
  );
  const next = root.querySelector<HTMLButtonElement>('[data-embed-action="next"]');
  const mute = root.querySelector<HTMLButtonElement>('[data-embed-action="mute"]');
  const progress = root.querySelector<HTMLInputElement>("[data-embed-progress]");
  const currentTime = root.querySelector<HTMLElement>("[data-embed-current-time]");
  const duration = root.querySelector<HTMLElement>("[data-embed-duration]");
  const trackNumber = root.querySelector<HTMLElement>("[data-embed-track-number]");
  const trackTitle = root.querySelector<HTMLElement>("[data-embed-track-title]");
  const status = root.querySelector<HTMLElement>("[data-embed-status]");
  const visibleStatus = root.querySelector<HTMLElement>("[data-embed-visible-status]");
  const controller = new AbortController();
  const { signal } = controller;

  if (coverVisible && artwork?.dataset.artworkSrc) {
    artwork.src = artwork.dataset.artworkSrc;
  }

  let currentIndex = getInitialTrackIndex(playerData.tracks);
  let hasLoadedTrack = false;
  let lastStatus = "";

  const getTrack = (): EmbedTrack => playerData.tracks[currentIndex]!;

  const setStatus = (message: string, isError = false): void => {
    if (message !== lastStatus) {
      lastStatus = message;
      if (status) {
        status.textContent = message;
      }
    }
    if (visibleStatus) {
      visibleStatus.textContent = message;
    }
    root.dataset.error = String(isError);
  };

  const renderTrack = (): void => {
    const track = getTrack();
    const knownDuration = track.durationSeconds || 0;

    if (trackNumber) {
      trackNumber.textContent = `${track.trackNumber}.`;
    }
    if (trackTitle) {
      trackTitle.textContent = track.title;
    }
    if (currentTime) {
      currentTime.textContent = "0:00";
    }
    if (duration) {
      duration.textContent = formatTime(knownDuration);
    }
    if (progress) {
      progress.value = "0";
      progress.max = String(Math.floor(knownDuration));
      progress.disabled = !hasLoadedTrack;
      progress.setAttribute(
        "aria-valuetext",
        `0:00 elapsed, ${formatTime(knownDuration)} total`
      );
    }
    if (toggle) {
      toggle.setAttribute("aria-label", `Play ${track.title}`);
      toggle.setAttribute("aria-pressed", "false");
    }
    previous?.toggleAttribute("disabled", currentIndex === 0);
    next?.toggleAttribute("disabled", currentIndex === playerData.tracks.length - 1);
    root.dataset.playing = "false";
  };

  const playCurrentTrack = async (forceReload = false): Promise<void> => {
    const track = getTrack();
    if (
      forceReload ||
      !hasLoadedTrack ||
      audio.dataset.trackIndex !== String(currentIndex)
    ) {
      audio.src = track.audioUrl;
      audio.dataset.trackIndex = String(currentIndex);
      audio.load();
      hasLoadedTrack = true;
      if (progress) {
        progress.disabled = false;
      }
    }

    try {
      await audio.play();
    } catch {
      root.dataset.playing = "false";
      setStatus("Playback failed. Press play to retry.", true);
    }
  };

  const selectTrack = (index: number, continuePlaying: boolean): void => {
    if (index < 0 || index >= playerData.tracks.length || index === currentIndex) {
      return;
    }

    audio.pause();
    audio.removeAttribute("src");
    audio.removeAttribute("data-track-index");
    audio.load();
    currentIndex = index;
    hasLoadedTrack = false;
    renderTrack();
    setStatus(`Selected ${getTrack().title}.`);

    if (continuePlaying) {
      void playCurrentTrack();
    }
  };

  toggle?.addEventListener(
    "click",
    () => {
      if (!audio.paused && !audio.ended) {
        audio.pause();
        return;
      }
      void playCurrentTrack(Boolean(audio.error));
    },
    { signal }
  );

  previous?.addEventListener(
    "click",
    () => {
      selectTrack(currentIndex - 1, !audio.paused && !audio.ended);
    },
    { signal }
  );

  next?.addEventListener(
    "click",
    () => {
      selectTrack(currentIndex + 1, !audio.paused && !audio.ended);
    },
    { signal }
  );

  mute?.addEventListener(
    "click",
    () => {
      audio.muted = !audio.muted;
      root.dataset.muted = String(audio.muted);
      mute.setAttribute("aria-pressed", String(audio.muted));
      mute.setAttribute("aria-label", audio.muted ? "Unmute" : "Mute");
      setStatus(audio.muted ? "Muted." : "Unmuted.");
    },
    { signal }
  );

  progress?.addEventListener(
    "input",
    () => {
      if (hasLoadedTrack) {
        audio.currentTime = Number(progress.value);
      }
    },
    { signal }
  );

  audio.addEventListener(
    "play",
    () => {
      const track = getTrack();
      root.dataset.playing = "true";
      root.dataset.error = "false";
      toggle?.setAttribute("aria-pressed", "true");
      toggle?.setAttribute("aria-label", `Pause ${track.title}`);
      setStatus(`Playing ${track.title}.`);
    },
    { signal }
  );

  audio.addEventListener(
    "pause",
    () => {
      if (audio.ended) {
        return;
      }
      root.dataset.playing = "false";
      toggle?.setAttribute("aria-pressed", "false");
      toggle?.setAttribute("aria-label", `Play ${getTrack().title}`);
      if (hasLoadedTrack) {
        setStatus(`Paused ${getTrack().title}.`);
      }
    },
    { signal }
  );

  audio.addEventListener(
    "loadedmetadata",
    () => {
      const resolvedDuration =
        Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : getTrack().durationSeconds || 0;
      if (duration) {
        duration.textContent = formatTime(resolvedDuration);
      }
      if (progress) {
        progress.max = String(Math.floor(resolvedDuration));
      }
    },
    { signal }
  );

  audio.addEventListener(
    "timeupdate",
    () => {
      const resolvedDuration =
        Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : getTrack().durationSeconds || 0;
      if (currentTime) {
        currentTime.textContent = formatTime(audio.currentTime);
      }
      if (progress) {
        progress.value = String(Math.floor(audio.currentTime));
        progress.setAttribute(
          "aria-valuetext",
          `${formatTime(audio.currentTime)} elapsed, ${formatTime(
            Math.max(resolvedDuration - audio.currentTime, 0)
          )} remaining`
        );
      }
    },
    { signal }
  );

  audio.addEventListener(
    "ended",
    () => {
      if (currentIndex < playerData.tracks.length - 1) {
        selectTrack(currentIndex + 1, true);
        return;
      }

      root.dataset.playing = "false";
      toggle?.setAttribute("aria-pressed", "false");
      toggle?.setAttribute("aria-label", `Play ${getTrack().title}`);
      setStatus(`${playerData.album.title} complete.`);
    },
    { signal }
  );

  audio.addEventListener(
    "error",
    () => {
      root.dataset.playing = "false";
      setStatus("Playback failed. Press play to retry.", true);
    },
    { signal }
  );

  renderTrack();
  setStatus(`Ready to play ${getTrack().title}.`);
  document.addEventListener("astro:before-swap", () => controller.abort(), {
    once: true,
    signal,
  });
};

const initEmbedPlayers = (): void => {
  document
    .querySelectorAll<HTMLElement>("[data-embed-album-player]")
    .forEach(bindEmbedPlayer);
};

initEmbedPlayers();
document.addEventListener("astro:page-load", initEmbedPlayers);
