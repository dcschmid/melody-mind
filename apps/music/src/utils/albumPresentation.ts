export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function buildAlbumMetaItems(
  publishedAt: string,
  totalDurationSeconds?: number
): Array<{ iconName: string; label: string }> {
  const items: Array<{ iconName: string; label: string }> = [];
  const date = new Date(publishedAt);
  items.push({
    iconName: "tabler:calendar",
    label: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  });
  if (totalDurationSeconds) {
    const mins = Math.round(totalDurationSeconds / 60);
    items.push({
      iconName: "tabler:clock",
      label: `${mins} min`,
    });
  }
  return items;
}
