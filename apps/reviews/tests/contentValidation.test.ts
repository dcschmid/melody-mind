import { describe, expect, it } from "vitest";

import { validateReviewRelationships } from "../src/utils/contentValidation";

const validReview = {
  format: "full-review" as const,
  currentAlbumOfTheWeek: false,
  album: { trackCount: 10 },
  reviewMap: [
    { target: "opening", trackNumber: 1 },
    { target: "middle", trackNumber: 5 },
    { target: "ending", trackNumber: 10 },
  ],
  sources: [{ id: "official" }, { id: "archive" }],
};

describe("validateReviewRelationships", () => {
  it("accepts a complete review map", () => {
    expect(validateReviewRelationships(validReview)).toEqual([]);
  });

  it("rejects duplicate targets, sources, and out-of-range tracks", () => {
    const issues = validateReviewRelationships({
      ...validReview,
      reviewMap: [
        { target: "opening", trackNumber: 1 },
        { target: "opening", trackNumber: 11 },
      ],
      sources: [{ id: "official" }, { id: "official" }],
    });
    expect(issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        "Review Map targets must be unique.",
        "Source IDs must be unique.",
        "Track 11 exceeds the album track count.",
      ])
    );
  });

  it("limits the current weekly flag to the weekly format", () => {
    const issues = validateReviewRelationships({
      ...validReview,
      currentAlbumOfTheWeek: true,
    });
    expect(issues[0]?.message).toBe("Only an Album of the Week entry can be current.");
  });
});
