export const ALBUM_FAVORITES_VERSION = 1;

interface StoredAlbumFavorites {
  version: number;
  albumIds: unknown;
}

const dedupeAlbumIds = (albumIds: string[]): string[] => {
  const seen = new Set<string>();
  const deduped: string[] = [];

  albumIds.forEach((albumId) => {
    const trimmed = albumId.trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      deduped.push(trimmed);
    }
  });

  return deduped;
};

export const parseAlbumFavorites = (raw: string | null): string[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredAlbumFavorites>;
    if (parsed.version !== ALBUM_FAVORITES_VERSION || !Array.isArray(parsed.albumIds)) {
      return [];
    }

    return dedupeAlbumIds(
      parsed.albumIds.filter((albumId): albumId is string => typeof albumId === "string")
    );
  } catch {
    return [];
  }
};

export const toggleAlbumFavorite = (albumIds: string[], albumId: string): string[] =>
  albumIds.includes(albumId)
    ? albumIds.filter((existingAlbumId) => existingAlbumId !== albumId)
    : [...albumIds, albumId];

export const serializeAlbumFavorites = (albumIds: string[]): string =>
  JSON.stringify({ version: ALBUM_FAVORITES_VERSION, albumIds });
