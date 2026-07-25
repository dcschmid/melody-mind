import { describe, expect, it } from "vitest";
import type { AlbumPlayerQueue, RadioPlayerQueue } from "../types/player";
import {
  getAvailableVisualsModes,
  mapTrackProgressToScroll,
  mixAmbientColor,
  parseVisualsPreferences,
  splitLyricsPages,
} from "./visuals";

const albumQueue: AlbumPlayerQueue = {
  kind: "album",
  queueId: "album:test",
  title: "Test Album",
  url: "/test/",
  album: {
    id: "test",
    title: "Test Album",
    url: "/test/",
  },
  tracks: [{ trackNumber: 1, title: "First", audioUrl: "/first.mp3" }],
};

const radioQueue: RadioPlayerQueue = {
  kind: "radio",
  queueId: "radio:test",
  title: "Test Radio",
  url: "/radio/",
  stationId: "test",
  tracks: [
    {
      trackNumber: 1,
      title: "First",
      audioUrl: "/first.mp3",
      album: { id: "test", title: "Test Album", url: "/test/" },
      transitionText: "First track",
    },
  ],
};

describe("visuals preferences", () => {
  it("accepts supported values and rejects unknown values", () => {
    expect(parseVisualsPreferences('{"mode":"lyrics","motion":"reduced"}')).toEqual({
      mode: "lyrics",
      motion: "reduced",
    });
    expect(parseVisualsPreferences('{"mode":"unknown","motion":"fast"}')).toEqual({
      mode: "cover",
      motion: "system",
    });
    expect(parseVisualsPreferences("not json")).toEqual({
      mode: "cover",
      motion: "system",
    });
  });
});

describe("visual mode availability", () => {
  it("offers lyrics only for a lyrical track and hides radio timelines", () => {
    expect(
      getAvailableVisualsModes(albumQueue, {
        lyricsUrl: "https://example.com/lyrics.txt",
      })
    ).toContain("lyrics");
    expect(getAvailableVisualsModes(albumQueue, { isInstrumental: true })).not.toContain(
      "lyrics"
    );
    expect(getAvailableVisualsModes(radioQueue, null)).not.toContain("timeline");
  });

  it("removes the visualizer when Web Audio is unavailable", () => {
    expect(getAvailableVisualsModes(albumQueue, null, false)).not.toContain("visualizer");
  });
});

describe("lyrics presentation", () => {
  it("splits Reduced Motion lyrics at stanza boundaries", () => {
    const stanza = "A line\nAnother line";
    const pages = splitLyricsPages(Array.from({ length: 14 }, () => stanza).join("\n\n"));
    expect(pages.length).toBeGreaterThan(1);
    expect(pages.join("\n\n")).toContain("Another line");
  });

  it("maps track progress across the available scroll range", () => {
    expect(mapTrackProgressToScroll(50, 100, 1_000, 200)).toBe(400);
    expect(mapTrackProgressToScroll(500, 100, 1_000, 200)).toBe(800);
    expect(mapTrackProgressToScroll(50, 0, 1_000, 200)).toBe(0);
  });
});

describe("ambient color", () => {
  it("uses Room Night as a stable fallback", () => {
    expect(mixAmbientColor(null)).toBe("rgb(5 13 27)");
  });

  it("keeps the cover contribution muted", () => {
    expect(mixAmbientColor({ r: 255, g: 0, b: 0 })).toBe("rgb(75 9 19)");
  });
});
