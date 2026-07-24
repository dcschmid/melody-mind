import type {
  AlbumPlayerQueue,
  PlayerAlbumContext,
  PlayerQueue,
  PlayerTrack,
  RadioPlayerQueue,
  RadioPlayerTrack,
  SeriesPlayerQueue,
  SeriesPlayerTrack,
  SeriesPlayerTransition,
} from "../../types/player";

const queueCache = new Map<string, Promise<Record<string, unknown>>>();

const isTrack = (value: unknown): value is PlayerTrack =>
  Boolean(
    value &&
    typeof value === "object" &&
    typeof (value as Partial<PlayerTrack>).trackNumber === "number" &&
    typeof (value as Partial<PlayerTrack>).title === "string" &&
    typeof (value as Partial<PlayerTrack>).audioUrl === "string"
  );

const isAlbumContext = (value: unknown): value is PlayerAlbumContext =>
  Boolean(
    value &&
    typeof value === "object" &&
    typeof (value as Partial<PlayerAlbumContext>).id === "string" &&
    typeof (value as Partial<PlayerAlbumContext>).title === "string" &&
    typeof (value as Partial<PlayerAlbumContext>).url === "string"
  );

const hasQueueBase = (
  queue: Partial<AlbumPlayerQueue | RadioPlayerQueue | SeriesPlayerQueue>
): boolean =>
  typeof queue.queueId === "string" &&
  typeof queue.title === "string" &&
  typeof queue.url === "string" &&
  Array.isArray(queue.tracks) &&
  queue.tracks.length > 0;

const isSeriesTrack = (value: unknown): value is SeriesPlayerTrack =>
  isTrack(value) &&
  isAlbumContext((value as Partial<SeriesPlayerTrack>).album) &&
  typeof (value as Partial<SeriesPlayerTrack>).partNumber === "number" &&
  typeof (value as Partial<SeriesPlayerTrack>).albumTrackCount === "number";

const isSeriesTransition = (value: unknown): value is SeriesPlayerTransition =>
  Boolean(
    value &&
    typeof value === "object" &&
    typeof (value as Partial<SeriesPlayerTransition>).beforeAlbumId === "string" &&
    typeof (value as Partial<SeriesPlayerTransition>).transitionText === "string"
  );

export const isPlayerQueue = (value: unknown): value is PlayerQueue => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const queue = value as Partial<AlbumPlayerQueue | RadioPlayerQueue | SeriesPlayerQueue>;
  if (!hasQueueBase(queue)) {
    return false;
  }

  if (queue.kind === "album") {
    return (
      isAlbumContext(queue.album) &&
      (queue.tracks as unknown[]).every((track) => isTrack(track))
    );
  }

  if (queue.kind === "radio") {
    return (
      typeof queue.stationId === "string" &&
      (queue.tracks as unknown[]).every(
        (track) =>
          isTrack(track) &&
          isAlbumContext((track as Partial<RadioPlayerTrack>).album) &&
          typeof (track as Partial<RadioPlayerTrack>).transitionText === "string"
      )
    );
  }

  if (queue.kind === "series") {
    return Boolean(
      queue.series &&
      typeof queue.series.id === "string" &&
      typeof queue.series.title === "string" &&
      typeof queue.series.url === "string" &&
      typeof queue.series.albumCount === "number" &&
      (queue.series.totalDurationSeconds === undefined ||
        typeof queue.series.totalDurationSeconds === "number") &&
      Array.isArray(queue.transitions) &&
      queue.transitions.every((transition) => isSeriesTransition(transition)) &&
      (queue.tracks as unknown[]).every((track) => isSeriesTrack(track))
    );
  }

  return false;
};

const loadPlayerQueues = (url: string): Promise<Record<string, unknown>> => {
  const cached = queueCache.get(url);
  if (cached) {
    return cached;
  }

  const promise = (async () => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Player queue request failed with HTTP ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("Player queue response is invalid");
    }

    return payload as Record<string, unknown>;
  })();

  queueCache.set(url, promise);
  void promise.catch(() => {
    if (queueCache.get(url) === promise) {
      queueCache.delete(url);
    }
  });
  return promise;
};

export const loadPlayerQueue = async (
  url: string,
  albumId: string
): Promise<PlayerQueue> => {
  const queues = await loadPlayerQueues(url);
  const queue = queues[albumId];
  if (!isPlayerQueue(queue)) {
    throw new Error(`Player queue is unavailable for album ${albumId}`);
  }

  return queue;
};
