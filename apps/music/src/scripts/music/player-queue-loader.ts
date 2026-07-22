import type { PlayerQueue } from "../../types/player";

const queueCache = new Map<string, Promise<Record<string, unknown>>>();

export const isPlayerQueue = (value: unknown): value is PlayerQueue => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const queue = value as Partial<PlayerQueue>;
  return (
    typeof queue.albumId === "string" &&
    typeof queue.albumTitle === "string" &&
    typeof queue.albumUrl === "string" &&
    Array.isArray(queue.tracks) &&
    queue.tracks.length > 0 &&
    queue.tracks.every(
      (track) =>
        track &&
        typeof track.trackNumber === "number" &&
        typeof track.title === "string" &&
        typeof track.audioUrl === "string"
    )
  );
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
