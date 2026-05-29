export const getAlbumVisibleCountLabel = (count: number, genre = "") => {
  if (count === 0) {
    return genre ? `No albums match ${genre}.` : "No albums match the current filters.";
  }

  return `${count} ${count === 1 ? "album" : "albums"}`;
};
