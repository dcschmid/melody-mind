/**
 * SEO Basic Helper Utilities
 * Centralizes small recurring patterns: baseUrl resolution, timestamps, breadcrumbs.
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Resolve a normalized base URL from Astro.site or fallback.
 * @deprecated Kept for legacy usage; consider consolidating into buildPageSeo caller context.
 */
export function resolveBaseUrl(
  site: string | URL | undefined,
  fallback = "https://melody-mind.de"
): string {
  if (!site) {
    return fallback;
  }
  const s = site.toString();
  return s.endsWith("/") ? s.slice(0, -1) : s;
}

/**
 * Provide standard publish/modified date objects (override allowed).
 * @deprecated Use derivePublishModified in content/date utils.
 */
export function buildTimestamps(
  publish?: Date,
  modified?: Date
): { publishDate: Date; modifiedDate: Date } {
  const publishDate = publish || new Date("2024-01-01");
  const modifiedDate = modified || new Date();
  return { publishDate, modifiedDate };
}

/**
 * Simple breadcrumb builder ensuring structure.
 * @deprecated Prefer explicit breadcrumb arrays + buildPageSeo augmentation.
 */
export function buildBreadcrumbs(items: BreadcrumbItem[]): BreadcrumbItem[] {
  return items.filter((i) => i && i.name && i.url);
}

/**
 * Build JSON-LD breadcrumb schema.
 * @deprecated buildPageSeo auto-injects breadcrumbs into structuredData.
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
