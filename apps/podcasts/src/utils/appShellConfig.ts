import {
  DEFAULT_APP_SHELL_FOOTER,
  DEFAULT_APP_SHELL_HEADER,
  DEFAULT_APP_SHELL_LANG,
  KNOWLEDGE_SITE_URL,
  PODCAST_APP_SHELL_FOOTER_BRAND_TEXT,
  QUIZ_SITE_URL,
  SEARCH_NAV_ITEM,
  buildExternalAppLink,
  buildAppShellLegalLinks,
  type AppShellConfig,
} from "@shared-utils/utils/appShell";
import { PODCAST_FEED_PATH } from "../constants/podcastLinks";

export const podcastAppShellConfig: AppShellConfig = {
  siteName: "MelodyMind Podcasts",
  siteDescription:
    "Music history podcast about the stories, scenes, and artists that shaped each era.",
  lang: DEFAULT_APP_SHELL_LANG,
  rssTitle: "RSS Feed - English",
  header: {
    ...DEFAULT_APP_SHELL_HEADER,
    navItems: [
      buildExternalAppLink({
        href: KNOWLEDGE_SITE_URL,
        label: "Knowledge",
        icon: "book-open",
      }),
      buildExternalAppLink({
        href: QUIZ_SITE_URL,
        label: "Quiz",
        icon: "help-circle",
      }),
      SEARCH_NAV_ITEM,
    ],
    brandText: "MelodyMind Podcasts",
    brandLogoAlt: "MelodyMind Podcasts",
    brandAriaLabel: "Go to the MelodyMind Podcasts homepage",
    navAriaLabel: "Podcast navigation",
  },
  footer: {
    ...DEFAULT_APP_SHELL_FOOTER,
    brandText: PODCAST_APP_SHELL_FOOTER_BRAND_TEXT,
    exploreLinks: [
      buildExternalAppLink({ href: QUIZ_SITE_URL, label: "Quiz" }),
      buildExternalAppLink({ href: KNOWLEDGE_SITE_URL, label: "Knowledge" }),
      { href: PODCAST_FEED_PATH, label: "RSS" },
    ],
    legalLinks: buildAppShellLegalLinks({ baseUrl: KNOWLEDGE_SITE_URL }),
  },
};
