/**
 * Breadcrumb helper utilities.
 * Provides a localized basic breadcrumb trail builder.
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Build basic breadcrumb array (Home -> tail). Types via signature.
 */
export function buildBasicBreadcrumbs(
  baseUrl: string,
  lang: string,
  tail: BreadcrumbItem,
  homeLabel = "Home"
): BreadcrumbItem[] {
  return [{ name: homeLabel, url: `${baseUrl}/${lang}` }, tail];
}
