import {
  DEFAULT_APP_SHELL_FOOTER,
  DEFAULT_APP_SHELL_FOOTER_BRAND_TEXT,
  DEFAULT_APP_SHELL_HEADER,
  DEFAULT_APP_SHELL_LANG,
  DEFAULT_APP_SHELL_SITE_DESCRIPTION,
  DEFAULT_APP_SHELL_SITE_NAME,
  PODCASTS_SITE_URL,
  QUIZ_SITE_URL,
  SEARCH_NAV_ITEM,
  buildExternalAppLink,
  buildAppShellLegalLinks,
  type AppShellConfig,
} from "@shared-utils/utils/appShell";

export const knowledgeAppShellConfig: AppShellConfig = {
  siteName: DEFAULT_APP_SHELL_SITE_NAME,
  siteDescription: DEFAULT_APP_SHELL_SITE_DESCRIPTION,
  lang: DEFAULT_APP_SHELL_LANG,
  rssTitle: "MelodyMind Knowledge RSS Feed",
  header: {
    ...DEFAULT_APP_SHELL_HEADER,
    navItems: [
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
    ],
    brandLogoAlt: "Melody Mind",
    brandAriaLabel: "Go to the Melody Mind homepage",
    navAriaLabel: "Primary navigation",
  },
  footer: {
    ...DEFAULT_APP_SHELL_FOOTER,
    brandText: DEFAULT_APP_SHELL_FOOTER_BRAND_TEXT,
    exploreLinks: [
      buildExternalAppLink({ href: QUIZ_SITE_URL, label: "Quiz" }),
      buildExternalAppLink({ href: PODCASTS_SITE_URL, label: "Podcasts" }),
    ],
    legalLinks: buildAppShellLegalLinks(),
  },
};
