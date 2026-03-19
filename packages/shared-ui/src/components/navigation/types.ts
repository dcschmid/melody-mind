export type BookmarkBadgeType = "bookmarkCount";

export interface NavItem {
  href: string;
  label: string;
  icon?: string;
  badgeType?: BookmarkBadgeType;
  badgeBaseLabel?: string;
}
