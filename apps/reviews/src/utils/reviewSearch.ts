import { ARCHIVE_PAGE_SIZE } from "./archivePagination";

export interface ReviewSearchRecord {
  id: string;
  url: string;
  title: string;
  artist: string;
  genres: string[];
  mainGenres: ReviewMainGenre[];
  thesis: string;
  publishedAt: string;
  cover: { mode: "typographic" } | { mode: "original"; src: string };
}

export const REVIEW_MAIN_GENRES = ["Metal", "Punk", "Rock"] as const;

export type ReviewMainGenre = (typeof REVIEW_MAIN_GENRES)[number];

const REVIEW_MAIN_GENRE_TERMS: Record<ReviewMainGenre, string[]> = {
  Metal: ["metal"],
  Punk: ["punk"],
  Rock: ["rock", "grunge"],
};

export const normalizeReviewSearchValue = (value: string) =>
  value
    .normalize("NFKD")
    .replaceAll(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en")
    .trim();

export const getReviewMainGenres = (genres: string[]): ReviewMainGenre[] => {
  const normalizedGenres = genres.map(normalizeReviewSearchValue);

  return REVIEW_MAIN_GENRES.filter((mainGenre) =>
    REVIEW_MAIN_GENRE_TERMS[mainGenre].some((term) =>
      normalizedGenres.some((genre) => genre.includes(term))
    )
  );
};

export const filterReviewSearchRecords = (
  records: ReviewSearchRecord[],
  query: string,
  mainGenre: string
) => {
  const normalizedQuery = normalizeReviewSearchValue(query);
  const normalizedMainGenre = normalizeReviewSearchValue(mainGenre);

  return records.filter((record) => {
    const recordMainGenres = record.mainGenres ?? getReviewMainGenres(record.genres);
    const matchesMainGenre =
      !normalizedMainGenre ||
      recordMainGenres.some(
        (candidate) => normalizeReviewSearchValue(candidate) === normalizedMainGenre
      );
    const haystack = normalizeReviewSearchValue(
      [
        record.title,
        record.artist,
        record.genres.join(" "),
        recordMainGenres.join(" "),
        record.thesis,
      ].join(" ")
    );
    return matchesMainGenre && (!normalizedQuery || haystack.includes(normalizedQuery));
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
