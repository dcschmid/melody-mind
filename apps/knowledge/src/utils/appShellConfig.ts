/**
 * Knowledge app shell configuration.
 *
 * Thin wrapper around the shared factory in shared-utils.
 */

import {
  buildAppShellConfig,
  navFromKnowledge,
} from "@shared-utils/utils/appShellConfig";
import {
  MUSIC_SITE_URL,
  QUIZ_SITE_URL,
  PODCASTS_SITE_URL,
  buildExternalAppLink,
} from "@shared-utils/utils/appShell";

export const knowledgeAppShellConfig = buildAppShellConfig({
  rssTitle: "MelodyMind Knowledge RSS Feed",
  brandLogoAlt: "Melody Mind",
  brandAriaLabel: "Go to the Melody Mind homepage",
  navAriaLabel: "Primary navigation",
  headerNavItems: navFromKnowledge(),
  footerBrandText:
    "Curated guides and playlists to help you listen more closely and discover new sounds.",
  footerExploreLinks: [
    buildExternalAppLink({ href: QUIZ_SITE_URL, label: "Quiz" }),
    buildExternalAppLink({ href: PODCASTS_SITE_URL, label: "Podcasts" }),
    buildExternalAppLink({ href: MUSIC_SITE_URL, label: "Music" }),
  ],
});
