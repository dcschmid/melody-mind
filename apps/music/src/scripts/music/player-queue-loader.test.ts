import { afterEach, describe, expect, it, vi } from "vitest";

import type { AlbumPlayerQueue } from "../../types/player";
import { loadPlayerQueue } from "./player-queue-loader";

const albumQueue: AlbumPlayerQueue = {
  kind: "album",
  queueId: "album:test-album",
  title: "Test Album",
  url: "/test-album/",
  album: {
    id: "test-album",
    title: "Test Album",
    url: "/test-album/",
    artworkUrl: "/test-album.webp",
  },
  tracks: [
    {
      trackNumber: 1,
      title: "Opening Track",
      audioUrl: "/opening-track.mp3",
    },
  ],
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("loadPlayerQueue", () => {
  it("loads and validates one album queue", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(albumQueue), {
        headers: { "Content-Type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      loadPlayerQueue("/player-queues/test-album.json", "test-album")
    ).resolves.toEqual(albumQueue);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("does not accept the removed queue catalog shape", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ "test-album": albumQueue }), {
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    await expect(
      loadPlayerQueue("/player-queues/catalog-shape.json", "test-album")
    ).rejects.toThrow("Player queue response is invalid");
  });

  it("retries after a failed request", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network unavailable"))
      .mockResolvedValueOnce(new Response(JSON.stringify(albumQueue)));
    vi.stubGlobal("fetch", fetchMock);

    const url = "/player-queues/retry-test.json";
    await expect(loadPlayerQueue(url, "test-album")).rejects.toThrow(
      "Network unavailable"
    );
    await expect(loadPlayerQueue(url, "test-album")).resolves.toEqual(albumQueue);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
