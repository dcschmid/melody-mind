/**
 * Breadcrumb helper utilities.
 * Provides a localized basic breadcrumb trail builder.
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Build basic breadcrumbs: Home -> Tail
 * @param {string} baseUrl Site base (no trailing slash)
 * @param {string} lang Current language code
 * @param {BreadcrumbItem} tail Last breadcrumb item (name + url)
 * @param {string} [homeLabel] Override label for the home link (default: Home)
 */
export function buildBasicBreadcrumbs(
  baseUrl: string,
  lang: string,
  tail: BreadcrumbItem,
  homeLabel = "Home"
): BreadcrumbItem[] {
  return [{ name: homeLabel, url: `${baseUrl}/${lang}` }, tail];
}
