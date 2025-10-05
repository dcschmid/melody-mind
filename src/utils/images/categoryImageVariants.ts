/**
 * Category Image Variants Utility
 *
 * Aggregates pre-generated AVIF & WebP responsive variants produced by the
 * optimization script under `src/assets/category/<slug>/`.
 *
 * Each directory can contain:
 *  - <slug>-240.avif|webp
 *  - <slug>-480.avif|webp
 *  - <slug>-720.avif|webp
 *  - <slug>-960.avif|webp
 *  - <slug>.webp (canonical fallback)
 *
 * This utility avoids re-encoding in Astro by serving already optimized
 * assets directly inside a handcrafted <picture> element.
 */

export interface VariantEntry {
  width: number;
  src: string; // final URL (default export of the imported module)
}

export interface CategoryImageVariants {
  slug: string;
  avif: VariantEntry[];
  webp: VariantEntry[];
  /** Canonical fallback webp (if present) or largest available variant */
  fallback: string | null;
}

// Non-eager glob to keep initial graph smaller; we dynamically import on demand.
// NOTE path depth: this file is in src/utils/images, assets in src/assets/category
const variantLoaders = import.meta.glob('../../assets/category/*/*.{webp,avif}');

/** Extract slug + width info from a relative module path */
function parsePath(p: string): { slug: string | null; width: number | null; format: string; isCanonical: boolean } {
  const match = p.match(/category\/([^/]+)\/([^/]+)$/);
  if (!match) {
    return { slug: null, width: null, format: '', isCanonical: false };
  }
  const slug = match[1];
  const file = match[2];
  if (file === `${slug}.webp`) {
    return { slug, width: null, format: 'webp', isCanonical: true };
  }
  const m2 = file.match(new RegExp(`^${slug}-(\\d+)\\.(webp|avif)$`));
  if (!m2) {
    return { slug, width: null, format: '', isCanonical: false };
  }
  return { slug, width: Number(m2[1]), format: m2[2], isCanonical: false };
}

function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Load all variants for a given slug.
 * Returns null if nothing found.
 */
function pushVariant(collection: VariantEntry[], width: number | null, src: string | undefined): void {
  if (!width) {
    return;
  }
  if (!src) {
    return;
  }
  collection.push({ width, src });
}

function extractSrc(mod: unknown): string | undefined {
  if (mod && typeof mod === 'object' && 'default' in mod) {
    const val = (mod as Record<string, unknown>).default;
    if (typeof val === 'string') {
      return val;
    }
  }
  return undefined;
}

function finalize(avif: VariantEntry[], webp: VariantEntry[], canonical: string | null): { avif: VariantEntry[]; webp: VariantEntry[]; fallback: string | null } {
  avif.sort((a, b) => a.width - b.width);
  webp.sort((a, b) => a.width - b.width);
  const fallback = canonical || webp.at(-1)?.src || avif.at(-1)?.src || null;
  return { avif, webp, fallback };
}

/**
 * Load all prepared responsive variants for a slug.
 * Complexity kept low by extracting helpers.
 */
export async function getCategoryImageVariants(slug: string): Promise<CategoryImageVariants | null> {
  if (!slug) {
    return null;
  }
  const normalized = normalizeSlug(slug);
  const avif: VariantEntry[] = [];
  const webp: VariantEntry[] = [];
  let canonical: string | null = null;
  const candidateEntries = Object.entries(variantLoaders).filter(([p]) => p.includes(`/${normalized}/`));
  if (candidateEntries.length === 0) {
    return null;
  }
  for (const [modPath, loader] of candidateEntries) {
    const meta = parsePath(modPath);
    if (meta.slug !== normalized) {
      continue;
    }
    try {
      const imported = await loader();
      const src = extractSrc(imported);
      if (!src) {
        continue;
      }
      if (meta.isCanonical) {
        canonical = src;
        continue;
      }
      if (meta.format === 'avif') {
        pushVariant(avif, meta.width, src);
      } else if (meta.format === 'webp') {
        pushVariant(webp, meta.width, src);
      }
    } catch {
      // ignore individual failure
    }
  }
  const { avif: a2, webp: w2, fallback } = finalize(avif, webp, canonical);
  return { slug: normalized, avif: a2, webp: w2, fallback };
}
