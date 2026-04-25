/**
 * Quiz app shell configuration.
 *
 * Thin wrapper around the shared factory in shared-utils.
 */

import { buildAppShellConfig, navFromQuiz } from "@shared-utils/utils/appShellConfig";
import {
  KNOWLEDGE_SITE_URL,
  MUSIC_SITE_URL,
  buildExternalAppLink,
} from "@shared-utils/utils/appShell";

export const quizAppShellConfig = buildAppShellConfig({
  rssTitle: "MelodyMind Quiz RSS Feed",
  brandLogoAlt: "Melody Mind Quiz",
  brandAriaLabel: "Go to the Melody Mind homepage",
  navAriaLabel: "Primary navigation",
  headerNavItems: navFromQuiz(),
  footerBrandText:
    "Curated guides and playlists to help you listen more closely and discover new sounds.",
  footerExploreLinks: [
    buildExternalAppLink({ href: KNOWLEDGE_SITE_URL, label: "Knowledge" }),
    buildExternalAppLink({ href: MUSIC_SITE_URL, label: "Music" }),
  ],
});
