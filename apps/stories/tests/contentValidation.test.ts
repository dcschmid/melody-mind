import { describe, expect, it } from "vitest";

import {
  validateBodySourceReferences,
  validateFrontmatterRelationships,
} from "../scripts/validate-content.mjs";
import { validateStoryRelationships } from "../src/utils/contentValidation";

const validStory = {
  format: "cover-story" as const,
  hero: { id: "cover-front" },
  figures: [{ id: "cover-back" }],
  sources: [{ id: "museum" }, { id: "archive" }, { id: "university" }],
  artifact: {
    type: "annotated-artifact" as const,
    imageId: "cover-front",
    markers: [
      { id: "one", sourceRefs: ["museum"], x: 50, y: 20 },
      { id: "two", sourceRefs: ["archive"], x: 50, y: 35 },
      { id: "three", sourceRefs: ["university"], x: 50, y: 50 },
      { id: "four", sourceRefs: ["museum"], x: 50, y: 65 },
      { id: "five", sourceRefs: ["archive"], x: 50, y: 80 },
    ],
  },
};

describe("validateStoryRelationships", () => {
  it("accepts a complete annotated cover story", () => {
    expect(validateStoryRelationships(validStory)).toEqual([]);
  });

  it("rejects duplicate IDs and unknown annotation references", () => {
    const issues = validateStoryRelationships({
      ...validStory,
      sources: [{ id: "museum" }, { id: "museum" }, { id: "university" }],
      artifact: {
        ...validStory.artifact,
        imageId: "missing-image",
        markers: validStory.artifact.markers.map((marker, index) => ({
          ...marker,
          id: index === 1 ? "one" : marker.id,
          sourceRefs: index === 2 ? ["missing-source"] : marker.sourceRefs,
        })),
      },
    });

    expect(issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        "Source IDs must be unique within a story.",
        "The annotated artifact must reference a hero or figure image ID.",
        "Annotation marker IDs must be unique.",
        'Annotation references unknown source ID "missing-source".',
      ])
    );
  });

  it("rejects annotated artifacts outside cover stories", () => {
    const issues = validateStoryRelationships({
      ...validStory,
      format: "scene-report",
    });

    expect(issues[0]?.message).toBe(
      "Annotated artifacts are only valid for cover stories."
    );
  });

  it("accepts technology stories without annotated artifacts", () => {
    expect(
      validateStoryRelationships({
        ...validStory,
        format: "technology-story",
        artifact: undefined,
      })
    ).toEqual([]);
  });

  it("rejects annotated artifacts on technology stories", () => {
    const issues = validateStoryRelationships({
      ...validStory,
      format: "technology-story",
    });

    expect(issues[0]?.message).toBe(
      "Annotated artifacts are only valid for cover stories."
    );
  });
});

describe("content validator", () => {
  it("accepts technology-story frontmatter without an artifact", () => {
    expect(
      validateFrontmatterRelationships({
        format: "technology-story",
        hero: {
          id: "pedal",
          image: "pedal.jpg",
          alt: "alt",
          caption: "caption",
          creator: "creator",
          sourceName: "source",
          sourceUrl: "https://example.com/image",
          license: "CC0",
          licenseUrl: "https://example.com/license",
          alterations: "none",
        },
        figures: [],
        sources: [{ id: "manual", url: "https://example.com/manual" }],
      })
    ).toEqual([]);
  });

  it("rejects missing and unknown body source references", () => {
    expect(
      validateBodySourceReferences("[1](#source-missing)", {
        sources: [{ id: "manual" }],
      })
    ).toEqual(['body references unknown source "missing"']);
  });
});
