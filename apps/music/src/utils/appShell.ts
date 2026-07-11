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
  brandLogoLoading?: "eager" | "lazy";
  brandLogoFetchPriority?: "high" | "low" | "auto";
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
  "AI-generated music albums from MelodyMind.";
export const DEFAULT_APP_SHELL_LANG = "en";
export const MUSIC_SITE_URL = "https://melody-mind.de";
export const DEFAULT_APP_SHELL_COPYRIGHT_YEAR = 2026;

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
  "brandTitle" | "supportLinks" | "themeStatusPrefix" | "showSettings"
> = {
  brandTitle: DEFAULT_APP_SHELL_SITE_NAME,
  supportLinks: DEFAULT_SUPPORT_LINKS,
  showSettings: true,
  ...DEFAULT_FOOTER_SETTINGS_TEXT,
};

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

export function buildDefaultCopyrightText(year: number, brand = "MelodyMind"): string {
  return `© ${year} ${brand}. All rights reserved.`;
}
