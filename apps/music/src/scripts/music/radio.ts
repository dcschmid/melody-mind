import type {
  PlayerAlbumContext,
  PlayerCommand,
  PlayerLoadDetail,
  RadioPlayerQueue,
  RadioPlayerTrack,
} from "../../types/player";
import type {
  RadioAlbumSource,
  RadioCatalogPayload,
  RadioEventDetail,
  RadioLane,
  RadioStation,
} from "../../types/radio";

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

interface RadioStationSummary {
  id: string;
  title: string;
  description: string;
  selectionSummary: string;
  albumCount: number;
  trackCount: number;
  durationSeconds: number;
  previewAlbum: PlayerAlbumContext;
}

const randomUnit = (): number => {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return (values[0] || 0) / 0x1_0000_0000;
};

const shuffle = <T>(values: T[]): T[] => {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(randomUnit() * (index + 1));
    [shuffled[index], shuffled[nextIndex]] = [shuffled[nextIndex]!, shuffled[index]!];
  }
  return shuffled;
};

const createQueueId = (stationId: string): string => {
  const values = new Uint32Array(2);
  crypto.getRandomValues(values);
  return `radio:${stationId}:${Date.now().toString(36)}:${[...values]
    .map((value) => value.toString(36))
    .join("")}`;
};

const dispatchPlayerCommand = (command: PlayerCommand): void => {
  window.dispatchEvent(
    new CustomEvent<PlayerCommand>("melodymind:player-command", { detail: command })
  );
};

const dispatchRadioEvent = (detail: RadioEventDetail): void => {
  window.dispatchEvent(
    new CustomEvent<RadioEventDetail>("melodymind:radio-event", { detail })
  );
};

const buildLaneSequence = (
  lane: RadioLane,
  station: RadioStation
): RadioPlayerTrack[] => {
  const albums = shuffle(
    lane.albums.map((source) => ({
      source,
      tracks: shuffle(source.tracks),
    }))
  );
  const sequence: RadioPlayerTrack[] = [];
  let previousAlbumId = "";

  while (albums.some((album) => album.tracks.length > 0)) {
    const candidates = albums
      .filter(
        (album) => album.tracks.length > 0 && album.source.album.id !== previousAlbumId
      )
      .sort(
        (a, b) =>
          b.tracks.length - a.tracks.length ||
          a.source.album.title.localeCompare(b.source.album.title, "en")
      );
    if (candidates.length === 0) {
      break;
    }
    const largestRemaining = candidates[0]?.tracks.length || 0;
    const balancedCandidates = candidates.filter(
      (candidate) => candidate.tracks.length === largestRemaining
    );
    const selected =
      balancedCandidates[Math.floor(randomUnit() * balancedCandidates.length)] ||
      candidates[0];
    const track = selected?.tracks.shift();
    if (!selected || !track) {
      break;
    }
    const source: RadioAlbumSource = selected.source;
    const artworkUrl = localizeArtworkUrl(source.album.artworkUrl);
    sequence.push({
      ...track,
      album: {
        ...source.album,
        ...(artworkUrl ? { artworkUrl } : {}),
      },
      transitionText: source.radioIntro || station.fallbackTransition,
      laneId: lane.id,
    });
    previousAlbumId = source.album.id;
  }

  return sequence;
};

const buildStationQueue = (station: RadioStation): RadioPlayerQueue => {
  const laneSequences = new Map(
    station.lanes.map((lane) => [lane.id, buildLaneSequence(lane, station)])
  );
  let tracks: RadioPlayerTrack[];

  if (station.rotation.kind === "alternating-pools") {
    const [firstLaneId, secondLaneId] = station.rotation.laneIds;
    const first = laneSequences.get(firstLaneId) || [];
    const second = laneSequences.get(secondLaneId) || [];
    const targetLength = Math.min(first.length, second.length);
    tracks = Array.from({ length: targetLength }, (_, index) => [
      first[index],
      second[index],
    ])
      .flat()
      .filter((track): track is RadioPlayerTrack => Boolean(track));
  } else {
    tracks = laneSequences.get(station.rotation.laneId) || [];
  }

  if (tracks.length === 0) {
    throw new Error(`Station ${station.id} has no playable tracks.`);
  }

  return {
    kind: "radio",
    queueId: createQueueId(station.id),
    title: station.title,
    url: "/radio/",
    stationId: station.id,
    tracks,
  };
};

const formatStationDuration = (seconds: number): string => {
  const hours = Math.max(1, Math.round(seconds / 3600));
  return `${hours}+ ${hours === 1 ? "hour" : "hours"}`;
};

const bindRadioPage = (): void => {
  const root = document.querySelector<HTMLElement>("[data-radio-root]");
  if (!root || root.dataset.radioBound === "true") {
    return;
  }
  root.dataset.radioBound = "true";

  const summaryScript = root.querySelector<HTMLScriptElement>(
    "[data-radio-station-summaries]"
  );
  if (!summaryScript?.textContent) {
    return;
  }

  let summaries: RadioStationSummary[];
  try {
    summaries = JSON.parse(summaryScript.textContent) as RadioStationSummary[];
  } catch {
    return;
  }

  const summariesById = new Map(summaries.map((summary) => [summary.id, summary]));
  const stationButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-radio-station]")
  );
  const stationTitle = root.querySelector<HTMLElement>("[data-radio-station-title]");
  const stationDescription = root.querySelector<HTMLElement>(
    "[data-radio-station-description]"
  );
  const stationRule = root.querySelector<HTMLElement>("[data-radio-station-rule]");
  const stationMeta = root.querySelector<HTMLElement>("[data-radio-station-meta]");
  const currentArtwork = root.querySelector<HTMLImageElement>(
    "[data-radio-current-artwork]"
  );
  const currentTrack = root.querySelector<HTMLElement>("[data-radio-current-track]");
  const currentAlbum = root.querySelector<HTMLElement>("[data-radio-current-album]");
  const stateLabel = root.querySelector<HTMLElement>("[data-radio-state-label]");
  const startButton = root.querySelector<HTMLButtonElement>("[data-radio-start]");
  const startLabel = root.querySelector<HTMLElement>("[data-radio-start-label]");
  const skipButton = root.querySelector<HTMLButtonElement>("[data-radio-skip]");
  const albumLink = root.querySelector<HTMLAnchorElement>("[data-radio-album-link]");
  const transition = root.querySelector<HTMLElement>("[data-radio-transition]");
  const playbackNotice = root.querySelector<HTMLElement>("[data-radio-playback-notice]");
  const status = root.querySelector<HTMLElement>("[data-radio-status]");
  const upNextItems = Array.from(
    root.querySelectorAll<HTMLElement>("[data-radio-up-next-item]")
  );
  const controller = new AbortController();
  const { signal } = controller;
  const endpoint = root.dataset.radioEndpoint || "/radio-stations.json";
  let catalogPromise: Promise<RadioCatalogPayload> | null = null;
  let selectedStationId =
    root.dataset.initialStation || summaries[0]?.id || "midnight-metal";
  const initialPlayer = window.__melodyMindPlayer;
  let playerState = initialPlayer?.getState() || null;
  let shouldAdoptFirstPlayerState = !initialPlayer;

  const getSelectedSummary = (): RadioStationSummary | undefined =>
    summariesById.get(selectedStationId);
  const getActiveRadioQueue = (): RadioPlayerQueue | null =>
    playerState?.queue?.kind === "radio" ? playerState.queue : null;
  const isSelectedStationActive = (): boolean =>
    getActiveRadioQueue()?.stationId === selectedStationId;

  const loadCatalog = (): Promise<RadioCatalogPayload> => {
    catalogPromise ??= fetch(endpoint, {
      headers: { Accept: "application/json" },
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Radio catalog failed with HTTP ${response.status}.`);
      }
      return (await response.json()) as RadioCatalogPayload;
    });
    catalogPromise.catch(() => {
      catalogPromise = null;
    });
    return catalogPromise;
  };

  const setStatus = (message: string): void => {
    if (status) {
      status.textContent = message;
    }
  };

  const renderStationSelection = (): void => {
    stationButtons.forEach((button) => {
      const selected = button.dataset.radioStation === selectedStationId;
      button.dataset.selected = String(selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  };

  const renderPreview = (): void => {
    const summary = getSelectedSummary();
    if (!summary) {
      return;
    }
    if (stationTitle) {
      stationTitle.textContent = summary.title;
    }
    if (stationDescription) {
      stationDescription.textContent = summary.description;
    }
    if (stationRule) {
      stationRule.textContent = summary.selectionSummary;
    }
    if (stationMeta) {
      stationMeta.textContent = `${summary.albumCount} albums · ${summary.trackCount} tracks · ${formatStationDuration(summary.durationSeconds)}`;
    }
    if (!isSelectedStationActive()) {
      if (currentArtwork) {
        currentArtwork.src = summary.previewAlbum.artworkUrl || "";
        currentArtwork.alt = `Cover art for ${summary.previewAlbum.title}, a record in ${summary.title}`;
      }
      if (currentTrack) {
        currentTrack.textContent = summary.title;
      }
      if (currentAlbum) {
        currentAlbum.textContent = "Ready for a fresh rotation";
      }
      if (stateLabel) {
        stateLabel.textContent = "Station preview";
      }
      if (transition) {
        transition.hidden = true;
        transition.textContent = "";
      }
      upNextItems.forEach((item) => {
        item.hidden = true;
      });
    }
  };

  const renderPlayback = (): void => {
    const activeQueue = getActiveRadioQueue();
    const activeSelected = activeQueue?.stationId === selectedStationId;
    const activeTrack = activeSelected
      ? activeQueue.tracks[playerState?.currentTrackIndex || 0]
      : undefined;
    const summary = getSelectedSummary();

    root.dataset.radioActive = String(Boolean(activeSelected));
    root.dataset.radioPlaying = String(Boolean(activeSelected && playerState?.isPlaying));
    if (playbackNotice) {
      const otherQueueActive = Boolean(playerState?.queue && !activeSelected);
      playbackNotice.hidden = !otherQueueActive;
      playbackNotice.textContent =
        playerState?.queue?.kind === "radio"
          ? `${playerState.queue.title} remains active. Switch only when you are ready to replace it.`
          : playerState?.queue
            ? `${playerState.queue.title} keeps playing below. Starting this station will replace the album queue.`
            : "";
    }
    if (startButton && startLabel) {
      startButton.disabled = false;
      startButton.removeAttribute("aria-busy");
      if (activeSelected) {
        const playing = playerState?.isPlaying === true;
        startButton.setAttribute("aria-pressed", String(playing));
        startLabel.textContent = playing ? "Pause station" : "Resume station";
      } else {
        startButton.setAttribute("aria-pressed", "false");
        startLabel.textContent = playerState?.queue ? "Switch station" : "Start station";
      }
    }
    if (skipButton) {
      skipButton.disabled = !activeSelected || !activeTrack;
    }
    if (albumLink) {
      albumLink.hidden = !activeTrack;
      if (activeTrack) {
        albumLink.href = `${activeTrack.album.url}#track-${activeTrack.trackNumber}`;
        albumLink.dataset.albumId = activeTrack.album.id;
        albumLink.dataset.trackNumber = String(activeTrack.trackNumber);
      }
    }

    if (!activeSelected || !activeQueue || !activeTrack) {
      renderPreview();
      return;
    }

    if (currentArtwork) {
      currentArtwork.src = activeTrack.album.artworkUrl || "";
      currentArtwork.alt = `Cover art for the album ${activeTrack.album.title}`;
    }
    if (currentTrack) {
      currentTrack.textContent = activeTrack.title;
    }
    if (currentAlbum) {
      currentAlbum.textContent = activeTrack.album.title;
    }
    if (stateLabel) {
      stateLabel.textContent = playerState?.errorMessage
        ? "Playback problem"
        : playerState?.isPlaying
          ? "Now playing"
          : "Station paused";
    }
    if (stationMeta && summary) {
      stationMeta.textContent = `${summary.albumCount} albums · ${activeQueue.tracks.length} tracks in this mix`;
    }
    const currentIndex = playerState?.currentTrackIndex || 0;
    if (transition) {
      const previousTrack = activeQueue.tracks[currentIndex - 1];
      if (previousTrack) {
        transition.textContent = `You just heard ${previousTrack.album.title}. ${activeTrack.transitionText}`;
        transition.hidden = false;
      } else {
        transition.hidden = true;
        transition.textContent = "";
      }
    }
    upNextItems.forEach((item, index) => {
      const track = activeQueue.tracks[currentIndex + index + 1];
      item.hidden = !track;
      if (!track) {
        return;
      }
      const image = item.querySelector<HTMLImageElement>("[data-radio-up-next-artwork]");
      const title = item.querySelector<HTMLElement>("[data-radio-up-next-title]");
      const album = item.querySelector<HTMLAnchorElement>("[data-radio-up-next-album]");
      if (image) {
        image.src = track.album.artworkUrl || "";
        image.alt = "";
      }
      if (title) {
        title.textContent = track.title;
      }
      if (album) {
        album.textContent = track.album.title;
        album.href = `${track.album.url}#track-${track.trackNumber}`;
        album.dataset.albumId = track.album.id;
        album.dataset.trackNumber = String(track.trackNumber);
      }
    });
  };

  const selectStation = (stationId: string): void => {
    if (!summariesById.has(stationId)) {
      return;
    }
    selectedStationId = stationId;
    renderStationSelection();
    renderPreview();
    renderPlayback();
  };

  stationButtons.forEach((button) => {
    button.addEventListener(
      "click",
      () => selectStation(button.dataset.radioStation || ""),
      { signal }
    );
  });

  startButton?.addEventListener(
    "click",
    async () => {
      if (isSelectedStationActive()) {
        dispatchPlayerCommand({ action: "toggle" });
        return;
      }
      startButton.disabled = true;
      startButton.setAttribute("aria-busy", "true");
      if (startLabel) {
        startLabel.textContent = "Loading station";
      }
      setStatus(`Loading ${getSelectedSummary()?.title || "station"}`);
      try {
        const catalog = await loadCatalog();
        const station = catalog.stations.find(
          (candidate) => candidate.id === selectedStationId
        );
        if (!station) {
          throw new Error(`Station ${selectedStationId} is unavailable.`);
        }
        const queue = buildStationQueue(station);
        window.dispatchEvent(
          new CustomEvent<PlayerLoadDetail>("melodymind:player-load", {
            detail: { queue, startIndex: 0, autoplay: true },
          })
        );
        setStatus(`Playing ${station.title}`);
      } catch {
        startButton.disabled = false;
        startButton.removeAttribute("aria-busy");
        if (startLabel) {
          startLabel.textContent = "Try station again";
        }
        setStatus("We couldn't load this station. Try again.");
      }
    },
    { signal }
  );

  skipButton?.addEventListener("click", () => dispatchPlayerCommand({ action: "next" }), {
    signal,
  });

  root.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const link = target.closest<HTMLAnchorElement>("[data-radio-album-link]");
      const queue = getActiveRadioQueue();
      if (!link || !queue) {
        return;
      }
      const albumId = link.dataset.albumId;
      const trackNumber = Number(link.dataset.trackNumber);
      if (!albumId || !Number.isFinite(trackNumber)) {
        return;
      }
      dispatchRadioEvent({
        type: "album_opened",
        stationId: queue.stationId,
        queueId: queue.queueId,
        albumId,
        trackNumber,
        timestamp: Date.now(),
      });
    },
    { signal }
  );

  window.addEventListener(
    "melodymind:playback-state",
    (event) => {
      playerState = event.detail;
      if (shouldAdoptFirstPlayerState && event.detail.queue?.kind === "radio") {
        selectedStationId = event.detail.queue.stationId;
      }
      shouldAdoptFirstPlayerState = false;
      renderStationSelection();
      renderPlayback();
    },
    { signal }
  );

  document.addEventListener("astro:before-swap", () => controller.abort(), {
    once: true,
    signal,
  });

  if (playerState?.queue?.kind === "radio") {
    selectedStationId = playerState.queue.stationId;
  }
  renderStationSelection();
  renderPreview();
  renderPlayback();
};

document.addEventListener("astro:page-load", bindRadioPage);
bindRadioPage();
