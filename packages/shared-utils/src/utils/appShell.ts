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

export const DEFAULT_SUPPORT_LINKS: AppShellLink[] = [
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

export const DEFAULT_FOOTER_SETTINGS_TEXT = {
  themeStatusPrefix: "Theme",
} as const;

export function mapOgLocale(locale: string): string {
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
