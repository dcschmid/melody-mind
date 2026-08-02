import { describe, expect, it } from "vitest";

import {
  filterReviewSearchRecords,
  getReviewMainGenres,
  paginateReviewSearchRecords,
  type ReviewSearchRecord,
} from "../src/utils/reviewSearch";

const makeReview = (index: number, genre = "Heavy Metal"): ReviewSearchRecord => ({
  id: `review-${index}`,
  url: `/reviews/review-${index}/`,
  title: index === 1 ? "Motörhead Archive" : `Album ${index}`,
  artist: index === 2 ? "PJ Harvey" : `Artist ${index}`,
  genres: [genre],
  mainGenres: getReviewMainGenres([genre]),
  thesis: index === 3 ? "A detailed rhythmic argument." : `Thesis ${index}`,
  publishedAt: new Date(2026, 0, index).toISOString(),
  cover: { mode: "typographic" },
});

describe("Review archive search", () => {
  const reviews = [
    makeReview(1),
    makeReview(2, "Alternative Rock"),
    makeReview(3, "Alternative Rock"),
  ];

  it("groups detailed genres into the main archive filters", () => {
    expect(getReviewMainGenres(["Alternative metal", "Art rock"])).toEqual([
      "Metal",
      "Rock",
    ]);
    expect(getReviewMainGenres(["Hardcore punk", "Grunge"])).toEqual(["Punk", "Rock"]);
  });

  it("matches diacritics, artists, genres, and thesis text", () => {
    expect(
      filterReviewSearchRecords(reviews, "motorhead", "").map(({ id }) => id)
    ).toEqual(["review-1"]);
    expect(filterReviewSearchRecords(reviews, "PJ Harvey", "")).toHaveLength(1);
    expect(filterReviewSearchRecords(reviews, "rhythmic", "Rock")).toHaveLength(1);
  });

  it("combines query and genre instead of widening the result", () => {
    expect(filterReviewSearchRecords(reviews, "Album", "Metal")).toEqual([]);
  });

  it("keeps filtered results in groups of thirty", () => {
    const records = Array.from({ length: 61 }, (_, index) => makeReview(index + 1));
    expect(paginateReviewSearchRecords(records, 1)).toMatchObject({
      start: 1,
      end: 30,
      lastPage: 3,
    });
    expect(paginateReviewSearchRecords(records, 3)).toMatchObject({
      start: 61,
      end: 61,
      lastPage: 3,
    });
  });
});
