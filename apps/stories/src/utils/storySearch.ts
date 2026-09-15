import { normalizeSearchValue } from "@melodymind/archive-utils";

export const formatStoryLabel = (format: string) =>
  format
    .split("-")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");

export interface StorySearchRecord {
  id: string;
  url: string;
  title: string;
  dek: string;
  format: StoryFormat;
  topics: string[];
  publishedAt: string;
  imageSrc: string;
}

export const STORY_FORMATS = [
  "artist-portrait",
  "scene-report",
  "cover-story",
  "technology-story",
  "instrument-story",
] as const;

export type StoryFormat = (typeof STORY_FORMATS)[number];

export const filterStorySearchRecords = (
  records: StorySearchRecord[],
  query: string,
  format: string
) => {
  const normalizedQuery = normalizeSearchValue(query);
  const normalizedFormat = normalizeSearchValue(format);

  return records.filter((record) => {
    const matchesFormat =
      !normalizedFormat ||
      normalizeSearchValue(formatStoryLabel(record.format)) === normalizedFormat ||
      normalizeSearchValue(record.format) === normalizedFormat;
    const haystack = normalizeSearchValue(
      [
        record.title,
        record.dek,
        record.topics.join(" "),
        formatStoryLabel(record.format),
      ].join(" ")
    );
    return matchesFormat && (!normalizedQuery || haystack.includes(normalizedQuery));
  });
};
