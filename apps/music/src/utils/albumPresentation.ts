import type { ContentCardMetaItem } from "@shared-ui/components/cards/relatedContent";

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function buildAlbumMetaItems(
  publishedAt: string,
  totalDurationSeconds?: number
): ContentCardMetaItem[] {
  const items: ContentCardMetaItem[] = [];
  const date = new Date(publishedAt);
  items.push({
    iconName: "calendar",
    label: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  });
  if (totalDurationSeconds) {
    const mins = Math.round(totalDurationSeconds / 60);
    items.push({
      iconName: "clock",
      label: `${mins} min`,
    });
  }
  return items;
}
