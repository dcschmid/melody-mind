import { describe, expect, it } from "vitest";
import {
  ALBUM_FAVORITES_VERSION,
  parseAlbumFavorites,
  serializeAlbumFavorites,
  toggleAlbumFavorite,
} from "./albumFavorites";

describe("parseAlbumFavorites", () => {
  it("returns an empty list for missing or malformed payloads", () => {
    expect(parseAlbumFavorites(null)).toEqual([]);
    expect(parseAlbumFavorites("")).toEqual([]);
    expect(parseAlbumFavorites("not json")).toEqual([]);
    expect(parseAlbumFavorites('["album-a"]')).toEqual([]);
    expect(parseAlbumFavorites('{"version":1}')).toEqual([]);
  });

  it("rejects payloads with an unknown version", () => {
    expect(
      parseAlbumFavorites(
        `{"version":${ALBUM_FAVORITES_VERSION + 1},"albumIds":["album-a"]}`
      )
    ).toEqual([]);
  });

  it("drops non-string and duplicate album ids", () => {
    expect(
      parseAlbumFavorites(
        '{"version":1,"albumIds":["album-a",42,"album-b","album-a"," "]}'
      )
    ).toEqual(["album-a", "album-b"]);
  });

  it("keeps the stored favorite order", () => {
    expect(parseAlbumFavorites('{"version":1,"albumIds":["album-b","album-a"]}')).toEqual(
      ["album-b", "album-a"]
    );
  });
});

describe("toggleAlbumFavorite", () => {
  it("adds an album that is not favorited yet", () => {
    expect(toggleAlbumFavorite(["album-a"], "album-b")).toEqual(["album-a", "album-b"]);
  });

  it("removes an album that is already favorited", () => {
    expect(toggleAlbumFavorite(["album-a", "album-b"], "album-a")).toEqual(["album-b"]);
  });
});

describe("serializeAlbumFavorites", () => {
  it("writes a versioned payload that round-trips through the parser", () => {
    const serialized = serializeAlbumFavorites(["album-a", "album-b"]);

    expect(JSON.parse(serialized)).toEqual({
      version: ALBUM_FAVORITES_VERSION,
      albumIds: ["album-a", "album-b"],
    });
    expect(parseAlbumFavorites(serialized)).toEqual(["album-a", "album-b"]);
  });
});
