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
      // Navigation the header already covers (primary nav + More menu) is
      // deliberately not repeated here; the footer keeps only destinations
      // that are absent from the header.
      exploreTitle: "About",
      exploreLinks: [
        { href: "/about/", label: "About MelodyMind" },
        { href: "/about/#ai-transparency", label: "AI Transparency" },
      ],
      legalLinks: buildAppShellLegalLinks(),
      copyrightText: buildDefaultCopyrightText(copyrightYear, copyrightBrand),
    },
  };
}

export const musicAppShellConfig = buildAppShellConfig({
  siteName: "MelodyMind Music",
  siteDescription:
    "AI-assisted music albums from MelodyMind. Listen to original compositions spanning genres from ambient to pop.",
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
  ],
  footerBrandText:
    "Original AI-assisted music spanning genres from ambient soundscapes to pop productions.",
});
