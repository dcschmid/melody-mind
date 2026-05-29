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

export const musicAppShellConfig = buildAppShellConfig({
  siteName: "MelodyMind Music",
  siteDescription:
    "AI-generated music albums from MelodyMind. Listen to original compositions spanning genres from ambient to pop.",
  rssTitle: "MelodyMind Music",
  brandLogoAlt: "MelodyMind Music",
  brandAriaLabel: "Go to the MelodyMind Music homepage",
  navAriaLabel: "Music navigation",
  headerNavItems: [],
  footerBrandText:
    "Original AI-generated music spanning genres from ambient soundscapes to pop productions.",
  footerExploreLinks: [
    {
      href: "/#latest",
      label: "Latest Releases",
    },
    {
      href: "/#albums",
      label: "Albums",
    },
    {
      href: "/search",
      label: "Search",
    },
  ],
});
