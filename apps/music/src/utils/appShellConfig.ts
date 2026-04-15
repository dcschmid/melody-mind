/**
 * Music app shell configuration.
 */

import { buildAppShellConfig } from "@shared-utils/utils/appShellConfig";
import {
  KNOWLEDGE_SITE_URL,
  PODCASTS_SITE_URL,
  QUIZ_SITE_URL,
  buildExternalAppLink,
} from "@shared-utils/utils/appShell";

export const musicAppShellConfig = buildAppShellConfig({
  siteName: "MelodyMind Music",
  siteDescription:
    "AI-generated music albums from MelodyMind. Listen to original compositions spanning genres from ambient to pop.",
  rssTitle: "MelodyMind Music",
  brandLogoAlt: "MelodyMind Music",
  brandAriaLabel: "Go to the MelodyMind Music homepage",
  navAriaLabel: "Music navigation",
  headerNavItems: [
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
    buildExternalAppLink({ href: QUIZ_SITE_URL, label: "Quiz", icon: "help-circle" }),
  ],
  footerBrandText:
    "Original AI-generated music spanning genres from ambient soundscapes to pop productions.",
  footerExploreLinks: [
    buildExternalAppLink({ href: KNOWLEDGE_SITE_URL, label: "Knowledge" }),
    buildExternalAppLink({ href: PODCASTS_SITE_URL, label: "Podcast" }),
    buildExternalAppLink({ href: QUIZ_SITE_URL, label: "Quiz" }),
  ],
});
