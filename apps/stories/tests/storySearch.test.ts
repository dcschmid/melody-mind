import { describe, expect, it } from "vitest";

import {
  filterStorySearchRecords,
  type StoryFormat,
  type StorySearchRecord,
} from "../src/utils/storySearch";

const makeStory = (
  index: number,
  format: StoryFormat = "scene-report"
): StorySearchRecord => ({
  id: `story-${index}`,
  title: index === 1 ? "Björk's Electronic Rooms" : `Article ${index}`,
  url: `/story-${index}/`,
  dek: index === 2 ? "A portrait of the Icelandic singer." : `Dek ${index}`,
  format,
  topics: index === 3 ? ["Reykjavík", "synthesizers"] : [`Topic ${index}`],
  publishedAt: new Date(2026, 0, index).toISOString(),
  imageSrc: `/images/story-${index}.jpg`,
});

describe("Story archive search", () => {
  const stories = [
    makeStory(1),
    makeStory(2, "artist-portrait"),
    makeStory(3, "technology-story"),
  ];

  it("matches diacritics in either direction", () => {
    expect(filterStorySearchRecords(stories, "Bjork", "").map(({ id }) => id)).toEqual([
      "story-1",
    ]);
    expect(filterStorySearchRecords(stories, "Björk", "").map(({ id }) => id)).toEqual([
      "story-1",
    ]);
  });

  it("searches titles, deks, topics, and the formatted story label", () => {
    expect(filterStorySearchRecords(stories, "Icelandic", "")).toHaveLength(1);
    expect(filterStorySearchRecords(stories, "Reykjavík", "")).toHaveLength(1);
    expect(filterStorySearchRecords(stories, "Technology Story", "")).toHaveLength(1);
  });

  it("combines query and format instead of widening the result", () => {
    expect(
      filterStorySearchRecords(stories, "Icelandic", "artist-portrait")
    ).toHaveLength(1);
    expect(
      filterStorySearchRecords(stories, "", "artist-portrait").map(({ id }) => id)
    ).toEqual(["story-2"]);
  });
});
