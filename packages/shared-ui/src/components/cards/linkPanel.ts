export interface LinkPanelItem {
  href: string;
  label: string;
  icon?: string;
  variant?: "primary" | "secondary";
  ariaLabel?: string;
  analyticsPodcastTarget?: "episode" | "series";
}
