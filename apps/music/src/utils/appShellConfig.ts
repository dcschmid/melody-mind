/**
 * Music app shell configuration.
 */

import {
  DEFAULT_APP_SHELL_FOOTER,
  DEFAULT_APP_SHELL_COPYRIGHT_YEAR,
  DEFAULT_APP_SHELL_HEADER,
  DEFAULT_APP_SHELL_LANG,
  DEFAULT_APP_SHELL_SITE_DESCRIPTION,
  DEFAULT_APP_SHELL_SITE_NAME,
  buildDefaultCopyrightText,
  buildAppShellLegalLinks,
  type AppShellConfig,
  type AppShellNavItem,
} from "@utils/appShell";

interface BuildAppShellConfigOptions {
  siteName?: string;
  siteDescription?: string;
  rssTitle: string;
  brandLogoAlt: string;
  brandAriaLabel: string;
  navAriaLabel: string;
  headerNavItems: AppShellNavItem[];
  footerBrandText: string;
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
  copyrightBrand = "MelodyMind",
  copyrightYear = DEFAULT_APP_SHELL_COPYRIGHT_YEAR,
}: BuildAppShellConfigOptions): AppShellConfig {
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
      exploreTitle: "Explore",
      exploreLinks: [
        { href: "/", label: "Albums" },
        { href: "/radio/", label: "Radio" },
        { href: "/mood/", label: "Mood Navigator" },
        { href: "/genre/", label: "Genres" },
        { href: "/series/", label: "Album Series" },
        { href: "/about/", label: "About" },
        { href: "/about/#ai-transparency", label: "AI Transparency" },
        { href: "https://quiz.melody-mind.de/", label: "Music Quiz" },
        { href: "https://stories.melody-mind.de/", label: "Music Stories" },
        { href: "https://reviews.melody-mind.de/", label: "Album Reviews" },
        { href: "https://knowledge.melody-mind.de/", label: "Music Knowledge" },
      ],
      legalLinks: buildAppShellLegalLinks(),
      copyrightText: buildDefaultCopyrightText(copyrightYear, copyrightBrand),
    },
  };
}

export const musicAppShellConfig = buildAppShellConfig({
  siteName: "MelodyMind Music",
  siteDescription:
    "AI-generated music albums from MelodyMind. Listen to original compositions spanning genres from ambient to pop.",
  rssTitle: "MelodyMind Music",
  brandLogoAlt: "MelodyMind Music",
  brandAriaLabel: "Go to the MelodyMind Music homepage",
  navAriaLabel: "Music navigation",
  headerNavItems: [
    {
      href: "https://quiz.melody-mind.de/",
      label: "Quiz",
      icon: "help-circle",
    },
    {
      href: "https://stories.melody-mind.de/",
      label: "Stories",
      icon: "book-open",
    },
    {
      href: "https://reviews.melody-mind.de/",
      label: "Reviews",
      icon: "book-open",
    },
    {
      href: "https://knowledge.melody-mind.de/",
      label: "Knowledge",
      icon: "book-open",
    },
  ],
  footerBrandText:
    "Original AI-generated music spanning genres from ambient soundscapes to pop productions.",
});
