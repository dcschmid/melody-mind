import { describe, expect, it } from "vitest";

import { extractReviewHeadings } from "../scripts/validate-content.mjs";
import { validateReviewRelationships } from "../src/utils/contentValidation";

const validReview = {
  sources: [{ id: "official" }, { id: "archive" }],
};

describe("validateReviewRelationships", () => {
  it("accepts unique sources", () => {
    expect(validateReviewRelationships(validReview)).toEqual([]);
  });

  it("rejects duplicate sources", () => {
    const issues = validateReviewRelationships({
      ...validReview,
      sources: [{ id: "official" }, { id: "official" }],
    });
    expect(issues.map((issue) => issue.message)).toContain("Source IDs must be unique.");
  });
});

describe("extractReviewHeadings", () => {
  it("separates review sections from track examples", () => {
    expect(
      extractReviewHeadings(`
## The thesis
## Context and construction
## Track evidence
### Sweet Leaf: Weight begins in the pause
### Into the Void: The riff becomes an environment
## Strengths
## Limits
## Conclusion
`)
    ).toEqual({
      sections: [
        "The thesis",
        "Context and construction",
        "Track evidence",
        "Strengths",
        "Limits",
        "Conclusion",
      ],
      trackExamples: [
        "Sweet Leaf: Weight begins in the pause",
        "Into the Void: The riff becomes an environment",
      ],
    });
  });
});
