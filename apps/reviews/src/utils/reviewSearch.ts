import { normalizeSearchValue } from "@melodymind/archive-utils";

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

export const getReviewMainGenres = (genres: string[]): ReviewMainGenre[] => {
  const normalizedGenres = genres.map(normalizeSearchValue);

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
  const normalizedQuery = normalizeSearchValue(query);
  const normalizedMainGenre = normalizeSearchValue(mainGenre);

  return records.filter((record) => {
    const recordMainGenres = record.mainGenres ?? getReviewMainGenres(record.genres);
    const matchesMainGenre =
      !normalizedMainGenre ||
      recordMainGenres.some(
        (candidate) => normalizeSearchValue(candidate) === normalizedMainGenre
      );
    const haystack = normalizeSearchValue(
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
