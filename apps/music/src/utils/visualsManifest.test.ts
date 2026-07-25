import { describe, expect, it } from "vitest";
import {
  buildVisualAlbumManifest,
  normalizeVisualsLanguage,
  readCoverAmbientColor,
} from "./visualsManifest";

describe("visual album manifests", () => {
  it("normalizes catalog language names to language tags", () => {
    expect(normalizeVisualsLanguage("English")).toBe("en");
    expect(normalizeVisualsLanguage("Español")).toBe("español");
    expect(normalizeVisualsLanguage()).toBe("en");
  });

  it("returns the Room Night fallback when cover analysis fails", async () => {
    await expect(readCoverAmbientColor("missing-cover.webp")).resolves.toBe(
      "rgb(5 13 27)"
    );
  });

  it("sorts tracks and keeps visual data out of the player queue model", async () => {
    const manifest = await buildVisualAlbumManifest({
      id: "test-album",
      data: {
        title: "Test Album",
        coverImage: "missing-cover.webp",
        language: "English",
        songs: [
          {
            trackNumber: 2,
            title: "Second",
            audioUrl: "/second.mp3",
            isInstrumental: true,
          },
          {
            trackNumber: 1,
            title: "First",
            audioUrl: "/first.mp3",
            lyricsUrl: "/first.txt",
          },
        ],
      },
    } as never);

    expect(manifest.albumId).toBe("test-album");
    expect(manifest.language).toBe("en");
    expect(manifest.tracks.map((track) => track.trackNumber)).toEqual([1, 2]);
    expect(manifest.tracks[0]?.lyricsUrl).toBe("/first.txt");
    expect(manifest.tracks[1]?.isInstrumental).toBe(true);
  });
});
