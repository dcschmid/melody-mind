import {
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@shared-utils/utils/seo/seoSchema";
import type { PageSeoResult, StructuredData } from "@shared-utils/utils/seo/buildPageSeo";

export interface AppShellLink {
  href: string;
  label: string;
  target?: "_blank" | "_self";
  rel?: string;
}

export interface AppShellNavItem extends AppShellLink {
  icon?: string;
}

export interface AppShellHeaderConfig {
  navItems: AppShellNavItem[];
  showIcons?: boolean;
  showBrand?: boolean;
  brandHref: string;
  brandText: string;
  brandMark?: string;
  brandLogoAlt: string;
  brandLogoWidth: number;
  brandLogoHeight: number;
  brandAriaLabel: string;
  menuOpenLabel: string;
  menuCloseLabel: string;
  menuText: string;
  navAriaLabel: string;
}

export interface AppShellFooterConfig {
  brandTitle: string;
  brandText: string;
  exploreTitle?: string;
  exploreLinks: AppShellLink[];
  supportTitle?: string;
  supportLinks: AppShellLink[];
  legalTitle?: string;
  legalLinks: AppShellLink[];
  settingsTitle?: string;
  showSettings?: boolean;
  themeStatusPrefix: string;
  copyrightText?: string;
}

export interface AppShellConfig {
  siteName: string;
  siteDescription: string;
  lang: string;
  rssTitle: string;
  header: AppShellHeaderConfig;
  footer: AppShellFooterConfig;
}

interface BuildAppShellLegalLinksParams {
  baseUrl?: string;
  includeAiContent?: boolean;
}

interface BuildExternalAppLinkParams {
  href: string;
  label: string;
  icon?: string;
}

interface BuildAppShellSeoContextParams {
  pageSeo: PageSeoResult;
  siteUrl: string;
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  fallbackImageUrl: string;
  locale: string;
  searchPathTemplate?: string;
}

const DEFAULT_SUPPORT_LINKS: AppShellLink[] = [
  {
    href: "https://www.paypal.me/dcschmid",
    label: "PayPal",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    href: "https://www.buymeacoffee.com/dcschmid",
    label: "Buy Me a Coffee",
    target: "_blank",
    rel: "noopener noreferrer",
  },
];

const DEFAULT_FOOTER_SETTINGS_TEXT = {
  themeStatusPrefix: "Theme",
} as const;

export const DEFAULT_APP_SHELL_SITE_NAME = "Melody Mind";
export const DEFAULT_APP_SHELL_SITE_DESCRIPTION =
  "Music knowledge platform for genres, timelines, and guided listening.";
export const DEFAULT_APP_SHELL_LANG = "en";
export const KNOWLEDGE_SITE_URL = "https://melody-mind.de";
export const KNOWLEDGE_SITE_URL_WWW = "https://www.melody-mind.de";
export const QUIZ_SITE_URL = "https://quiz.melody-mind.de";
export const PODCASTS_SITE_URL = "https://podcasts.melody-mind.de";
export const DEFAULT_APP_SHELL_FOOTER_BRAND_TEXT =
  "Curated guides and playlists to help you listen more closely and discover new sounds.";
export const PODCAST_APP_SHELL_FOOTER_BRAND_TEXT =
  "Curated stories, timelines, and playlists to help you listen more closely and discover new sounds.";
export const SEARCH_NAV_ITEM: AppShellNavItem = {
  href: "/search",
  label: "Search",
  icon: "search",
};

export const DEFAULT_APP_SHELL_HEADER: Omit<
  AppShellHeaderConfig,
  "navItems" | "brandLogoAlt" | "brandAriaLabel" | "navAriaLabel"
> = {
  showBrand: false,
  brandHref: "/",
  brandText: DEFAULT_APP_SHELL_SITE_NAME,
  brandMark: "MM",
  brandLogoWidth: 150,
  brandLogoHeight: 100,
  menuOpenLabel: "Open main menu",
  menuCloseLabel: "Close main menu",
  menuText: "Menu",
};

export const DEFAULT_APP_SHELL_FOOTER: Pick<
  AppShellFooterConfig,
  "brandTitle" | "supportLinks" | "themeStatusPrefix"
> = {
  brandTitle: DEFAULT_APP_SHELL_SITE_NAME,
  supportLinks: DEFAULT_SUPPORT_LINKS,
  ...DEFAULT_FOOTER_SETTINGS_TEXT,
};

export function buildExternalAppLink({
  href,
  label,
  icon,
}: BuildExternalAppLinkParams): AppShellNavItem {
  return {
    href,
    label,
    ...(icon ? { icon } : {}),
    target: "_blank",
    rel: "noopener noreferrer",
  };
}

export function buildAppShellLegalLinks({
  baseUrl,
  includeAiContent = true,
}: BuildAppShellLegalLinksParams = {}): AppShellLink[] {
  const normalizeHref = (path: string): string => {
    if (!baseUrl) {
      return path;
    }

    const normalizedBase = baseUrl.replace(/\/+$/, "");
    return `${normalizedBase}${path}`;
  };

  const externalLinkProps = baseUrl
    ? {
        target: "_blank" as const,
        rel: "noopener noreferrer",
      }
    : {};

  const legalLinks: AppShellLink[] = [
    {
      href: normalizeHref("/imprint"),
      label: "Legal Notice",
      ...externalLinkProps,
    },
    {
      href: normalizeHref("/privacy"),
      label: "Privacy Policy",
      ...externalLinkProps,
    },
    {
      href: normalizeHref("/cookies"),
      label: "Storage Policy",
      ...externalLinkProps,
    },
  ];

  if (includeAiContent) {
    legalLinks.push({
      href: normalizeHref("/ai-content"),
      label: "AI Content",
      ...externalLinkProps,
    });
  }

  return legalLinks;
}

function mapOgLocale(locale: string): string {
  if (!locale) {
    return "en_US";
  }

  const base = locale.toLowerCase();
  switch (base) {
    case "en":
      return "en_US";
    case "de":
      return "de_DE";
    case "fr":
      return "fr_FR";
    case "es":
      return "es_ES";
    default:
      return base.replace(/-.+$/, "").concat("_", base.toUpperCase().slice(-2) || "US");
  }
}

export function buildDefaultCopyrightText(year: number, brand = "MelodyMind"): string {
  return `© ${year} ${brand}. All rights reserved.`;
}

export function buildAppShellSeoContext({
  pageSeo,
  siteUrl,
  siteName,
  siteDescription,
  logoUrl,
  fallbackImageUrl,
  locale,
  searchPathTemplate,
}: BuildAppShellSeoContextParams): {
  mergedImage: string;
  finalStructuredData: StructuredData[];
  autoOgLocale: string;
} {
  const globalStructuredData: StructuredData[] = [];

  if (!pageSeo.structuredData.some((entry) => entry["@type"] === "Organization")) {
    globalStructuredData.push(
      buildOrganizationSchema({
        siteUrl,
        siteName,
        description: siteDescription,
        logoUrl,
      })
    );
  }

  if (!pageSeo.structuredData.some((entry) => entry["@type"] === "WebSite")) {
    globalStructuredData.push(
      buildWebSiteSchema({
        siteUrl,
        siteName,
        description: siteDescription,
        ...(searchPathTemplate ? { searchPathTemplate } : {}),
      })
    );
  }

  return {
    mergedImage: pageSeo.image || fallbackImageUrl,
    finalStructuredData: [...globalStructuredData, ...pageSeo.structuredData],
    autoOgLocale: mapOgLocale(locale),
  };
}
