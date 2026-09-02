import { ARCHIVE_PAGE_SIZE } from "./archivePagination";

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

export const normalizeStorySearchValue = (value: string) =>
  value
    .normalize("NFKD")
    .replaceAll(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en")
    .trim();

export const filterStorySearchRecords = (
  records: StorySearchRecord[],
  query: string,
  format: string
) => {
  const normalizedQuery = normalizeStorySearchValue(query);
  const normalizedFormat = normalizeStorySearchValue(format);

  return records.filter((record) => {
    const matchesFormat =
      !normalizedFormat ||
      normalizeStorySearchValue(formatStoryLabel(record.format)) === normalizedFormat ||
      normalizeStorySearchValue(record.format) === normalizedFormat;
    const haystack = normalizeStorySearchValue(
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

export const paginateStorySearchRecords = <T>(records: T[], requestedPage: number) => {
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
