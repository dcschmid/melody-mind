import {
  DEFAULT_FOOTER_UI_TEXT,
  DEFAULT_SUPPORT_LINKS,
  type AppShellConfig,
} from "@shared-utils/utils/appShell";

export const knowledgeAppShellConfig: AppShellConfig = {
  siteName: "Melody Mind",
  siteDescription:
    "Music knowledge platform for genres, timelines, and guided listening.",
  lang: "en",
  rssTitle: "MelodyMind Knowledge RSS Feed",
  header: {
    navItems: [
      {
        href: "https://podcasts.melody-mind.de",
        label: "Podcast",
        icon: "headphones",
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
    brandText: "Melody Mind",
    brandMark: "MM",
    brandLogoAlt: "Melody Mind",
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
        href: "https://quiz.melody-mind.de",
        label: "Quiz",
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
      { href: "/imprint", label: "Legal Notice" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/ai-content", label: "AI Content" },
      { href: "/cookies", label: "Cookie Policy" },
    ],
    ...DEFAULT_FOOTER_UI_TEXT,
  },
};
