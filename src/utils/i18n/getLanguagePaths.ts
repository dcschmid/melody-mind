/**
 * Utility helpers to generate standardized getStaticPaths structures for language-based routes.
 * Centralizes logic so route files stay lean and consistent.
 */
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@constants/languages";

export interface LanguagePathParam {
  params: { lang: SupportedLanguage };
  /** Optional additional props to inject into the page at build time */
  props?: Record<string, unknown>;
}

/**
 * Returns a simple list of language param objects without additional props.
 * Typical usage inside a route's getStaticPaths():
 *   export const getStaticPaths = () => getLanguageParams();
 */
export function getLanguageParams(): LanguagePathParam[] {
  return SUPPORTED_LANGUAGES.map((lang) => ({ params: { lang } }));
}

/**
 * Generates paths by combining each language with a list of slugs/items.
 * @template T
 * @param {readonly T[]} items Array of input data items whose identifiers are used for path generation.
 * @param {(item: T) => string | { id: string; props?: Record<string, unknown> }} mapFn Function mapping an item to either an id string or an object with id and optional props.
 * @example
 * // Basic usage with simple strings
 * getLanguageItemParams(["a","b"], (s) => s);
 *
 * @example
 * // Usage with objects and extra props
 * getLanguageItemParams(posts, (post) => ({ id: post.slug, props: { title: post.title } }));
 */
export function getLanguageItemParams<T>(
  items: readonly T[],
  mapFn: (item: T) => string | { id: string; props?: Record<string, unknown> }
): LanguagePathParam[] {
  const paths: LanguagePathParam[] = [];
  for (const lang of SUPPORTED_LANGUAGES) {
    for (const item of items) {
      const mapped = mapFn(item);
      if (typeof mapped === "string") {
        paths.push({ params: { lang }, props: { lang } });
      } else {
        paths.push({ params: { lang }, props: { lang, ...(mapped.props || {}) } });
      }
    }
  }
  return paths;
}

/**
 * Builds language paths where each item provides its own param object (besides lang).
 * @template T
 * @param {readonly T[]} items Collection of items
 * @param {(item:T)=>{ params: Record<string,string>; props?: Record<string, unknown> }} mapFn Mapping to additional params (excluding lang)
 * @example
 * getLanguageKeyedParams(categories, c => ({ params: { category: c.slug }, props: { category: c } }))
 */
export function getLanguageKeyedParams<T>(
  items: readonly T[],
  mapFn: (item: T) => { params: Record<string, string>; props?: Record<string, unknown> }
): LanguagePathParam[] {
  const paths: LanguagePathParam[] = [];
  for (const lang of SUPPORTED_LANGUAGES) {
    for (const item of items) {
      const { params, props } = mapFn(item);
      paths.push({ params: { lang, ...params }, props: { lang, ...(props || {}) } });
    }
  }
  return paths;
}
