import type { DrivePreferences } from "../types/drive";
import type { PlayerAlbumContext, PlayerQueue } from "../types/player";

export const DRIVE_PREFERENCES_KEY = "melodymind:drive-preferences:v1";

export const DEFAULT_DRIVE_PREFERENCES: DrivePreferences = {
  announcementsEnabled: false,
};

export const parseDrivePreferences = (value: string | null): DrivePreferences => {
  if (!value) {
    return DEFAULT_DRIVE_PREFERENCES;
  }

  try {
    const parsed = JSON.parse(value) as Partial<DrivePreferences>;
    return {
      announcementsEnabled: parsed.announcementsEnabled === true,
    };
  } catch {
    return DEFAULT_DRIVE_PREFERENCES;
  }
};

export const getDriveAlbumContext = (
  queue: PlayerQueue,
  trackIndex: number
): PlayerAlbumContext | null => {
  if (queue.kind === "album") {
    return queue.album;
  }

  return queue.tracks[trackIndex]?.album || null;
};

export const getDriveTrackKey = (queue: PlayerQueue, trackIndex: number): string =>
  `${queue.queueId}:${trackIndex}`;

export const getDriveAnnouncement = (
  queue: PlayerQueue,
  trackIndex: number
): string | null => {
  const track = queue.tracks[trackIndex];
  const album = getDriveAlbumContext(queue, trackIndex);
  if (!track || !album) {
    return null;
  }

  return `Album ${album.title}. Track ${track.title}.`;
};
