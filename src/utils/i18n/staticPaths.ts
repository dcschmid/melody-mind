/**
 * i18n Static Path Utilities
 *
 * Provides small helpers to keep dynamic route `getStaticPaths()` implementations DRY
 * and guaranteed in sync with the canonical `SUPPORTED_LANGUAGES` list.
 *
 * Pure + side-effect free: safe to import in any environment.
 */
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@constants/languages";

/**
 * Return the canonical list of supported UI language codes.
 * Returned as a readonly array to discourage mutation.
 */
export function getSupportedLanguages(): readonly SupportedLanguage[] {
  return SUPPORTED_LANGUAGES;
}

/**
 * Build a simple `{ params: { lang } }[]` array for Astro `getStaticPaths()`.
 * Useful for pages that only need the language segment without extra props.
 */
export function buildLangStaticPaths(): { params: { lang: SupportedLanguage } }[] {
  return SUPPORTED_LANGUAGES.map((lang) => ({ params: { lang } }));
}

/**
 * Build language static paths while attaching a uniform props object per language.
 * Helpful when each localized page needs pre-attached data (e.g. playlists, metadata).
 *
 * @template TProps
 * @param { (lang: SupportedLanguage) => Promise<TProps> | TProps } buildProps Function invoked per language to compute props (can be async)
 * @returns { Promise<Array<{ params: { lang: SupportedLanguage }; props: TProps }>> } Array of localized path objects with props
 */
export async function buildLangStaticPathsWithProps<TProps>(
  buildProps: (lang: SupportedLanguage) => Promise<TProps> | TProps
): Promise<Array<{ params: { lang: SupportedLanguage }; props: TProps }>> {
  const results: Array<{ params: { lang: SupportedLanguage }; props: TProps }> = [];
  for (const lang of SUPPORTED_LANGUAGES) {
    const props = await buildProps(lang);
    results.push({ params: { lang }, props });
  }
  return results;
}

/**
 * Build combined language + category static paths.
 *
 * @template TCategory
 * @param { (lang: SupportedLanguage) => Promise<TCategory[]> | TCategory[] } loadCategories loader per language (already handles fallback)
 * @param { (category: TCategory) => string } getSlug function to derive a URL slug from a category object
 * @param { boolean } includeProps whether to attach the raw category as a prop (default true)
 * @returns { Promise<Array<{ params: { lang: SupportedLanguage; category: string }; props?: { categoryData: TCategory; lang: SupportedLanguage } }>> }
 */
export async function buildLangCategoryPaths<TCategory>(
  loadCategories: (lang: SupportedLanguage) => Promise<TCategory[]> | TCategory[],
  getSlug: (category: TCategory) => string,
  includeProps: boolean = true
): Promise<
  Array<{
    params: { lang: SupportedLanguage; category: string };
    props?: { categoryData: TCategory; lang: SupportedLanguage };
  }>
> {
  const paths: Array<{
    params: { lang: SupportedLanguage; category: string };
    props?: { categoryData: TCategory; lang: SupportedLanguage };
  }> = [];

  for (const lang of SUPPORTED_LANGUAGES) {
    const categories = await loadCategories(lang);
    for (const cat of categories) {
      try {
        const slug = getSlug(cat);
        if (!slug) {
          continue;
        }
        const base: {
          params: { lang: SupportedLanguage; category: string };
          props?: { categoryData: TCategory; lang: SupportedLanguage };
        } = { params: { lang, category: slug } };
        if (includeProps) {
          base.props = { categoryData: cat, lang };
        }
        paths.push(base);
      } catch {
        // skip malformed category
      }
    }
  }
  return paths;
}
