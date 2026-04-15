/**
 * Podcasts app shell configuration.
 *
 * Thin wrapper around the shared factory in shared-utils.
 */

import {
  buildAppShellConfig,
  navToKnowledgeAndPodcasts,
} from "@shared-utils/utils/appShellConfig";
import {
  KNOWLEDGE_SITE_URL,
  MUSIC_SITE_URL,
  QUIZ_SITE_URL,
  buildExternalAppLink,
} from "@shared-utils/utils/appShell";
import { PODCAST_FEED_PATH } from "../constants/podcastLinks";

export const podcastAppShellConfig = buildAppShellConfig({
  siteName: "MelodyMind Podcasts",
  siteDescription:
    "Music history podcast about the stories, scenes, and artists that shaped each era.",
  rssTitle: "RSS Feed - English",
  brandLogoAlt: "MelodyMind Podcasts",
  brandAriaLabel: "Go to the MelodyMind Podcasts homepage",
  navAriaLabel: "Podcast navigation",
  headerNavItems: navToKnowledgeAndPodcasts(),
  footerBrandText:
    "Curated stories, timelines, and playlists to help you listen more closely and discover new sounds.",
  footerExploreLinks: [
    buildExternalAppLink({ href: QUIZ_SITE_URL, label: "Quiz" }),
    buildExternalAppLink({ href: KNOWLEDGE_SITE_URL, label: "Knowledge" }),
    buildExternalAppLink({ href: MUSIC_SITE_URL, label: "Music" }),
  ],
  footerRssLink: { href: PODCAST_FEED_PATH, label: "RSS" },
});
