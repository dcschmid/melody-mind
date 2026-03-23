import {
  DEFAULT_FOOTER_UI_TEXT,
  DEFAULT_SUPPORT_LINKS,
  type AppShellConfig,
} from "@shared-utils/utils/appShell";

export const quizAppShellConfig: AppShellConfig = {
  siteName: "Melody Mind",
  siteDescription:
    "Music knowledge platform for genres, timelines, and guided listening.",
  lang: "en",
  rssTitle: "MelodyMind Quiz RSS Feed",
  header: {
    navItems: [
      {
        href: "https://www.melody-mind.de",
        label: "Knowledge",
        icon: "book-open",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        href: "https://podcasts.melody-mind.de",
        label: "Podcast",
        icon: "headphones",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        href: "/search",
        label: "Search",
        icon: "search",
      },
    ],
    brandHref: "/",
    brandText: "Melody Mind",
    brandLogoAlt: "Melody Mind Quiz",
    brandLogoWidth: 150,
    brandLogoHeight: 100,
    brandAriaLabel: "Go to the Melody Mind homepage",
    menuOpenLabel: "Open main menu",
    menuCloseLabel: "Close main menu",
    menuText: "Menu",
    navAriaLabel: "Primary navigation",
  },
  footer: {
    brandTitle: "Melody Mind",
    brandText:
      "Curated guides and playlists to help you listen more closely and discover new sounds.",
    exploreLinks: [
      {
        href: "https://melody-mind.de",
        label: "Knowledge",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        href: "https://podcasts.melody-mind.de",
        label: "Podcasts",
        target: "_blank",
        rel: "noopener noreferrer",
      },
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
        label: "Cookie Policy",
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
    ...DEFAULT_FOOTER_UI_TEXT,
  },
};
