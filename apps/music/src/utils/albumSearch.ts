/** Compact record served by /album-search-index.json and rendered by the client. */
export interface AlbumSearchRecord {
  id: string;
  url: string;
  title: string;
  description: string;
  genre: string | undefined;
  trackCount: number;
  seriesTitle: string | undefined;
  /** Pre-normalized (diacritic/case-insensitive) searchable haystack. */
  searchText: string;
  imageSrc: string;
}

export const normalizeAlbumSearchValue = (value: string): string =>
  value
    .normalize("NFKD")
    .replaceAll(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en")
    .trim();

export const filterAlbumSearchRecords = (
  records: AlbumSearchRecord[],
  query: string
): AlbumSearchRecord[] => {
  const normalizedQuery = normalizeAlbumSearchValue(query);
  if (!normalizedQuery) {
    return [];
  }
  return records.filter((record) => record.searchText.includes(normalizedQuery));
};

export const paginateAlbumSearchRecords = <T>(
  records: T[],
  requestedPage: number,
  pageSize: number
) => {
  const lastPage = Math.max(1, Math.ceil(records.length / pageSize));
  const currentPage = Math.min(Math.max(1, Math.trunc(requestedPage) || 1), lastPage);
  const offset = (currentPage - 1) * pageSize;
  const data = records.slice(offset, offset + pageSize);

  return {
    currentPage,
    data,
    end: Math.min(offset + data.length, records.length),
    lastPage,
    start: data.length > 0 ? offset + 1 : 0,
    total: records.length,
  };
};
