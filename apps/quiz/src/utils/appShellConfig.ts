import {
  DEFAULT_APP_SHELL_FOOTER,
  DEFAULT_APP_SHELL_FOOTER_BRAND_TEXT,
  DEFAULT_APP_SHELL_HEADER,
  DEFAULT_APP_SHELL_LANG,
  DEFAULT_APP_SHELL_SITE_DESCRIPTION,
  DEFAULT_APP_SHELL_SITE_NAME,
  KNOWLEDGE_SITE_URL,
  KNOWLEDGE_SITE_URL_WWW,
  PODCASTS_SITE_URL,
  SEARCH_NAV_ITEM,
  buildExternalAppLink,
  buildAppShellLegalLinks,
  type AppShellConfig,
} from "@shared-utils/utils/appShell";

export const quizAppShellConfig: AppShellConfig = {
  siteName: DEFAULT_APP_SHELL_SITE_NAME,
  siteDescription: DEFAULT_APP_SHELL_SITE_DESCRIPTION,
  lang: DEFAULT_APP_SHELL_LANG,
  rssTitle: "MelodyMind Quiz RSS Feed",
  header: {
    ...DEFAULT_APP_SHELL_HEADER,
    navItems: [
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
    ],
    brandLogoAlt: "Melody Mind Quiz",
    brandAriaLabel: "Go to the Melody Mind homepage",
    navAriaLabel: "Primary navigation",
  },
  footer: {
    ...DEFAULT_APP_SHELL_FOOTER,
    brandText: DEFAULT_APP_SHELL_FOOTER_BRAND_TEXT,
    exploreLinks: [
      buildExternalAppLink({ href: KNOWLEDGE_SITE_URL, label: "Knowledge" }),
      buildExternalAppLink({ href: PODCASTS_SITE_URL, label: "Podcasts" }),
    ],
    legalLinks: buildAppShellLegalLinks({ baseUrl: KNOWLEDGE_SITE_URL }),
  },
};
