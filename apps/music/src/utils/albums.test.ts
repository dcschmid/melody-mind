import { describe, expect, it, vi } from "vitest";

interface AlbumEntry {
  id: string;
  data: Record<string, unknown>;
  body: string;
}

const state = vi.hoisted(() => ({
  albums: [] as AlbumEntry[],
  shouldThrow: false,
}));

vi.mock("astro:content", () => ({
  getCollection: (
    _name: string,
    filter?: (entry: { data: { isAvailable?: boolean } }) => boolean
  ) => {
    if (state.shouldThrow) {
      return Promise.reject(new Error("collection unavailable"));
    }
    const result = filter ? state.albums.filter((entry) => filter(entry)) : state.albums;
    return Promise.resolve(result);
  },
}));

const makeEntry = (id: string, isAvailable: boolean): AlbumEntry => ({
  id,
  data: { title: `Album ${id}`, isAvailable },
  body: `Body of ${id}`,
});

describe("getAvailableAlbums", () => {
  it("returns only available albums merged with their entry id and body", async () => {
    state.shouldThrow = false;
    state.albums = [
      makeEntry("one", true),
      makeEntry("two", false),
      makeEntry("three", true),
    ];

    const { getAvailableAlbums } = await import("./albums");
    const albums = await getAvailableAlbums();

    expect(albums.map((album) => album.id)).toEqual(["one", "three"]);
    expect(albums[0]).toMatchObject({
      id: "one",
      title: "Album one",
      isAvailable: true,
      body: "Body of one",
    });
  });

  it("returns an empty list and warns when the collection fails", async () => {
    state.shouldThrow = true;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { getAvailableAlbums } = await import("./albums");
    const albums = await getAvailableAlbums();

    expect(albums).toEqual([]);
    expect(warn).toHaveBeenCalledWith(
      "Failed to load albums",
      expect.objectContaining({ error: "collection unavailable" })
    );

    warn.mockRestore();
    state.shouldThrow = false;
  });
});
