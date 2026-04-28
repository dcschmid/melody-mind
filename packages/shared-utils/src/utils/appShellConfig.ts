/**
 * Shared factory for building per-app shell configurations.
 *
 * Each app (knowledge, quiz, music) defines a thin config that calls
 * `buildAppShellConfig()` with its own header/footer/nav overrides.
 * This eliminates the previous triple-copy of nearly identical files.
 */

import {
  DEFAULT_APP_SHELL_FOOTER,
  DEFAULT_APP_SHELL_COPYRIGHT_YEAR,
  DEFAULT_APP_SHELL_HEADER,
  DEFAULT_APP_SHELL_LANG,
  DEFAULT_APP_SHELL_SITE_DESCRIPTION,
  DEFAULT_APP_SHELL_SITE_NAME,
  KNOWLEDGE_SITE_URL,
  KNOWLEDGE_SITE_URL_WWW,
  MUSIC_SITE_URL,
  QUIZ_SITE_URL,
  SEARCH_NAV_ITEM,
  buildDefaultCopyrightText,
  buildExternalAppLink,
  buildAppShellLegalLinks,
  type AppShellConfig,
  type AppShellNavItem,
} from "@shared-utils/utils/appShell";

interface BuildAppShellConfigOptions {
  siteName?: string;
  siteDescription?: string;
  rssTitle: string;
  brandLogoAlt: string;
  brandAriaLabel: string;
  navAriaLabel: string;
  headerNavItems: AppShellNavItem[];
  footerBrandText: string;
  footerExploreLinks: AppShellNavItem[];
  footerRssLink?: AppShellNavItem;
  copyrightBrand?: string;
  copyrightYear?: number;
}

export function buildAppShellConfig({
  siteName = DEFAULT_APP_SHELL_SITE_NAME,
  siteDescription = DEFAULT_APP_SHELL_SITE_DESCRIPTION,
  rssTitle,
  brandLogoAlt,
  brandAriaLabel,
  navAriaLabel,
  headerNavItems,
  footerBrandText,
  footerExploreLinks,
  footerRssLink,
  copyrightBrand = "MelodyMind",
  copyrightYear = DEFAULT_APP_SHELL_COPYRIGHT_YEAR,
}: BuildAppShellConfigOptions): AppShellConfig {
  const exploreLinks = [...footerExploreLinks, ...(footerRssLink ? [footerRssLink] : [])];

  return {
    siteName,
    siteDescription,
    lang: DEFAULT_APP_SHELL_LANG,
    rssTitle,
    header: {
      ...DEFAULT_APP_SHELL_HEADER,
      navItems: headerNavItems,
      brandLogoAlt,
      brandAriaLabel,
      navAriaLabel,
    },
    footer: {
      ...DEFAULT_APP_SHELL_FOOTER,
      brandText: footerBrandText,
      exploreLinks,
      legalLinks: buildAppShellLegalLinks(),
      copyrightText: buildDefaultCopyrightText(copyrightYear, copyrightBrand),
    },
  };
}

/** Convenience: nav items pointing to Knowledge + Music from an external app. */
export const navToKnowledgeAndMusic = (): AppShellNavItem[] => [
  buildExternalAppLink({
    href: KNOWLEDGE_SITE_URL_WWW,
    label: "Knowledge",
    icon: "book-open",
  }),
  buildExternalAppLink({
    href: MUSIC_SITE_URL,
    label: "Music",
    icon: "music",
  }),
  SEARCH_NAV_ITEM,
];

/** Convenience: nav items from Knowledge → Quiz + Music. */
export const navFromKnowledge = (): AppShellNavItem[] => [
  buildExternalAppLink({
    href: MUSIC_SITE_URL,
    label: "Music",
    icon: "music",
  }),
  buildExternalAppLink({
    href: QUIZ_SITE_URL,
    label: "Quiz",
    icon: "help-circle",
  }),
  SEARCH_NAV_ITEM,
];

/** Convenience: nav items from Quiz → Knowledge + Music. */
export const navFromQuiz = (): AppShellNavItem[] => [
  buildExternalAppLink({
    href: KNOWLEDGE_SITE_URL,
    label: "Knowledge",
    icon: "book-open",
  }),
  buildExternalAppLink({
    href: MUSIC_SITE_URL,
    label: "Music",
    icon: "music",
  }),
  SEARCH_NAV_ITEM,
];
