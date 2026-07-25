import { describe, expect, it } from "vitest";
import type { AlbumPlayerQueue, SeriesPlayerQueue } from "../types/player";
import {
  DEFAULT_DRIVE_PREFERENCES,
  getDriveAlbumContext,
  getDriveAnnouncement,
  getDriveTrackKey,
  parseDrivePreferences,
} from "./drive";

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
  tracks: [
    {
      trackNumber: 1,
      title: "Opening Track",
      audioUrl: "/audio/opening.mp3",
    },
  ],
};

const seriesQueue: SeriesPlayerQueue = {
  kind: "series",
  queueId: "series:test",
  title: "Test Series",
  url: "/series/test/",
  series: {
    id: "test",
    title: "Test Series",
    url: "/series/test/",
    albumCount: 2,
  },
  transitions: [],
  tracks: [
    {
      trackNumber: 1,
      title: "Second Opening",
      audioUrl: "/audio/second.mp3",
      album: {
        id: "second",
        title: "Second Album",
        url: "/second/",
      },
      partNumber: 2,
      albumTrackCount: 1,
    },
  ],
};

describe("drive preferences", () => {
  it("defaults announcements to off", () => {
    expect(parseDrivePreferences(null)).toEqual(DEFAULT_DRIVE_PREFERENCES);
    expect(parseDrivePreferences("not json")).toEqual(DEFAULT_DRIVE_PREFERENCES);
  });

  it("only enables announcements for an explicit true value", () => {
    expect(parseDrivePreferences('{"announcementsEnabled":true}')).toEqual({
      announcementsEnabled: true,
    });
    expect(parseDrivePreferences('{"announcementsEnabled":"true"}')).toEqual({
      announcementsEnabled: false,
    });
  });
});

describe("drive queue presentation", () => {
  it("resolves album and series track context", () => {
    expect(getDriveAlbumContext(albumQueue, 0)?.title).toBe("Test Album");
    expect(getDriveAlbumContext(seriesQueue, 0)?.title).toBe("Second Album");
  });

  it("builds stable track keys and concise announcements", () => {
    expect(getDriveTrackKey(albumQueue, 0)).toBe("album:test:0");
    expect(getDriveAnnouncement(albumQueue, 0)).toBe(
      "Album Test Album. Track Opening Track."
    );
    expect(getDriveAnnouncement(seriesQueue, 0)).toBe(
      "Album Second Album. Track Second Opening."
    );
  });
});
