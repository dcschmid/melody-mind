/**
 * Shared factory for building per-app shell configurations.
 *
 * Each app (knowledge, quiz, podcasts) defines a thin config that calls
 * `buildAppShellConfig()` with its own header/footer/nav overrides.
 * This eliminates the previous triple-copy of nearly identical files.
 */

import {
  DEFAULT_APP_SHELL_FOOTER,
  DEFAULT_APP_SHELL_HEADER,
  DEFAULT_APP_SHELL_LANG,
  DEFAULT_APP_SHELL_SITE_DESCRIPTION,
  DEFAULT_APP_SHELL_SITE_NAME,
  KNOWLEDGE_SITE_URL,
  KNOWLEDGE_SITE_URL_WWW,
  PODCASTS_SITE_URL,
  QUIZ_SITE_URL,
  SEARCH_NAV_ITEM,
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
    },
  };
}

/** Convenience: nav items pointing to Knowledge + Podcasts from an external app. */
export const navToKnowledgeAndPodcasts = (): AppShellNavItem[] => [
  buildExternalAppLink({
    href: KNOWLEDGE_SITE_URL_WWW,
    label: "Knowledge",
    icon: "book-open",
  }),
  buildExternalAppLink({
    href: PODCASTS_SITE_URL,
    label: "Podcast",
    icon: "headphones",
  }),
  SEARCH_NAV_ITEM,
];

/** Convenience: nav items from Knowledge → Quiz + Podcasts. */
export const navFromKnowledge = (): AppShellNavItem[] => [
  buildExternalAppLink({
    href: PODCASTS_SITE_URL,
    label: "Podcast",
    icon: "headphones",
  }),
  buildExternalAppLink({
    href: QUIZ_SITE_URL,
    label: "Quiz",
    icon: "help-circle",
  }),
  SEARCH_NAV_ITEM,
];

/** Convenience: nav items from Quiz → Knowledge + Podcasts. */
export const navFromQuiz = (): AppShellNavItem[] => [
  buildExternalAppLink({
    href: KNOWLEDGE_SITE_URL,
    label: "Knowledge",
    icon: "book-open",
  }),
  buildExternalAppLink({
    href: PODCASTS_SITE_URL,
    label: "Podcast",
    icon: "headphones",
  }),
  SEARCH_NAV_ITEM,
];
