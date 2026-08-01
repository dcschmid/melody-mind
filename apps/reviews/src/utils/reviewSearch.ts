import { ARCHIVE_PAGE_SIZE } from "./archivePagination";

export interface ReviewSearchRecord {
  id: string;
  url: string;
  title: string;
  artist: string;
  genres: string[];
  thesis: string;
  publishedAt: string;
  cover: { mode: "typographic" } | { mode: "original"; src: string };
}

export const normalizeReviewSearchValue = (value: string) =>
  value
    .normalize("NFKD")
    .replaceAll(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en")
    .trim();

export const filterReviewSearchRecords = (
  records: ReviewSearchRecord[],
  query: string,
  genre: string
) => {
  const normalizedQuery = normalizeReviewSearchValue(query);
  const normalizedGenre = normalizeReviewSearchValue(genre);

  return records.filter((record) => {
    const matchesGenre =
      !normalizedGenre ||
      record.genres.some(
        (candidate) => normalizeReviewSearchValue(candidate) === normalizedGenre
      );
    const haystack = normalizeReviewSearchValue(
      [record.title, record.artist, record.genres.join(" "), record.thesis].join(" ")
    );
    return matchesGenre && (!normalizedQuery || haystack.includes(normalizedQuery));
  });
};

export const paginateReviewSearchRecords = <T>(records: T[], requestedPage: number) => {
  const lastPage = Math.max(1, Math.ceil(records.length / ARCHIVE_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Math.trunc(requestedPage) || 1), lastPage);
  const offset = (currentPage - 1) * ARCHIVE_PAGE_SIZE;
  const data = records.slice(offset, offset + ARCHIVE_PAGE_SIZE);

  return {
    currentPage,
    data,
    end: Math.min(offset + data.length, records.length),
    lastPage,
    start: data.length > 0 ? offset + 1 : 0,
    total: records.length,
  };
};
