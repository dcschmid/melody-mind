import {
  DEFAULT_FOOTER_SETTINGS_TEXT,
  DEFAULT_SUPPORT_LINKS,
  type AppShellConfig,
} from "@shared-utils/utils/appShell";
import { PODCAST_FEED_PATH } from "../constants/podcastLinks";

export const podcastAppShellConfig: AppShellConfig = {
  siteName: "MelodyMind Podcasts",
  siteDescription:
    "Music history podcast about the stories, scenes, and artists that shaped each era.",
  lang: "en",
  rssTitle: "RSS Feed - English",
  header: {
    navItems: [
      {
        href: "https://melody-mind.de",
        label: "Knowledge",
        icon: "book-open",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        href: "https://quiz.melody-mind.de",
        label: "Quiz",
        icon: "help-circle",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        href: "/search",
        label: "Search",
        icon: "search",
      },
    ],
    showBrand: false,
    brandHref: "/",
    brandText: "MelodyMind Podcasts",
    brandLogoAlt: "MelodyMind Podcasts",
    brandLogoWidth: 150,
    brandLogoHeight: 100,
    brandAriaLabel: "Go to the MelodyMind Podcasts homepage",
    menuOpenLabel: "Open main menu",
    menuCloseLabel: "Close main menu",
    menuText: "Menu",
    navAriaLabel: "Podcast navigation",
  },
  footer: {
    brandTitle: "Melody Mind",
    brandText:
      "Curated stories, timelines, and playlists to help you listen more closely and discover new sounds.",
    exploreLinks: [
      {
        href: "https://quiz.melody-mind.de",
        label: "Quiz",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        href: "https://melody-mind.de",
        label: "Knowledge",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      { href: PODCAST_FEED_PATH, label: "RSS" },
    ],
    supportLinks: DEFAULT_SUPPORT_LINKS,
    legalLinks: [
      {
        href: "https://melody-mind.de/imprint",
        label: "Legal Notice",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        href: "https://melody-mind.de/privacy",
        label: "Privacy Policy",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        href: "https://melody-mind.de/cookies",
        label: "Storage Policy",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        href: "https://melody-mind.de/ai-content",
        label: "AI Content",
        target: "_blank",
        rel: "noopener noreferrer",
      },
    ],
    ...DEFAULT_FOOTER_SETTINGS_TEXT,
  },
};
