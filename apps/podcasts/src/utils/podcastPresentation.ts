import type { ContentCardMetaItem } from "@shared-ui/components/cards/relatedContent";
import { formatDate } from "@shared-utils/utils/format";

export const normalizeWhitespace = (value: string): string => {
  return value.replace(/\s+/g, " ").trim();
};

export const normalizeSearchText = (value: string): string => {
  return normalizeWhitespace(value.toLowerCase());
};

const formatEpisodeDurationLabel = (durationSeconds?: number): string | undefined => {
  if (!durationSeconds || durationSeconds <= 0) {
    return undefined;
  }

  return `${Math.floor(durationSeconds / 60)} min`;
};

export const buildEpisodeMetaItems = (
  publishedAt: string,
  durationSeconds?: number
): ContentCardMetaItem[] => {
  const durationLabel = formatEpisodeDurationLabel(durationSeconds);
  const items: ContentCardMetaItem[] = [
    {
      iconName: "calendar",
      label: formatDate(publishedAt),
      datetime: publishedAt,
    },
  ];

  if (durationLabel) {
    items.push({
      iconName: "headphones",
      label: durationLabel,
    });
  }

  return items;
};

export const toIsoDuration = (durationSeconds?: number): string | undefined => {
  if (!durationSeconds || durationSeconds <= 0) {
    return undefined;
  }

  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = Math.floor(durationSeconds % 60);

  return `PT${hours > 0 ? `${hours}H` : ""}${minutes > 0 ? `${minutes}M` : ""}${seconds || (!hours && !minutes) ? `${seconds}S` : ""}`;
};
