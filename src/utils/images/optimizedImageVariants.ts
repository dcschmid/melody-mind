/**
 * Generic Optimized Image Variants Utility
 *
 * Discovers pre-generated variants for any configured group (category, podcast, ...)
 * produced by `scripts/optimize-images.cjs`.
 *
 * Directory layout:
 *   src/assets/<group>/<slug>/<slug>-<width>.{webp,avif}
 *   src/assets/<group>/<slug>/<slug>.webp (canonical)
 */

export interface VariantEntry { width: number; src: string }
export interface OptimizedImageVariants { group: string; slug: string; avif: VariantEntry[]; webp: VariantEntry[]; fallback: string | null }

// Glob über beliebige Gruppen (ein Verzeichnislevel unter assets) statt fester Liste.
// Struktur: src/assets/<group>/<slug>/<files>
// Achtung: Wir laden nur webp/avif Varianten; Fallback JPG wird später dynamisch bestimmt.
const loaders = import.meta.glob('../../assets/*/*/*.{webp,avif}');

import { buildSlugCandidates, normalizeImageSlug } from './slugNormalization';

interface ParsedPath { group: string | null; slug: string | null; width: number | null; format: string; isCanonical: boolean }

function parsePath(p: string): ParsedPath {
  // Matches assets/<group>/<slug>/<file>
  const m = p.match(/assets\/([^/]+)\/([^/]+)\/([^/]+)$/);
  if (!m) {
    return { group: null, slug: null, width: null, format: '', isCanonical: false };
  }
  const [, group, slug, file] = m;
  if (file === `${slug}.webp`) {
    return { group, slug, width: null, format: 'webp', isCanonical: true };
  }
  const m2 = file.match(new RegExp(`^${slug}-(\\d+)\\.(webp|avif)$`));
  if (!m2) {
    return { group, slug, width: null, format: '', isCanonical: false };
  }
  return { group, slug, width: Number(m2[1]), format: m2[2], isCanonical: false };
}

function extractSrc(mod: unknown): string | undefined {
  if (mod && typeof mod === 'object' && 'default' in mod) {
    const v = (mod as Record<string, unknown>).default;
    if (typeof v === 'string') {
      return v;
    }
  }
  return undefined;
}

function sortAndFallback(avif: VariantEntry[], webp: VariantEntry[], canonical: string | null): { avif: VariantEntry[]; webp: VariantEntry[]; fallback: string | null } {
  avif.sort((a, b) => a.width - b.width);
  webp.sort((a, b) => a.width - b.width);
  const fallback = canonical || webp.at(-1)?.src || avif.at(-1)?.src || null;
  return { avif, webp, fallback };
}

async function collectEntries(entries: [string, () => Promise<unknown>][], gNorm: string, sNorm: string): Promise<{ avif: VariantEntry[]; webp: VariantEntry[]; fallback: string | null }> {
  const avif: VariantEntry[] = [];
  const webp: VariantEntry[] = [];
  let canonical: string | null = null;
  for (const [p, loader] of entries) {
    const meta = parsePath(p);
    if (meta.group !== gNorm || meta.slug !== sNorm) {
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
      if (meta.format === 'avif' && meta.width) {
        avif.push({ width: meta.width, src });
      } else if (meta.format === 'webp' && meta.width) {
        webp.push({ width: meta.width, src });
      }
    } catch {
      // ignore individual failure
    }
  }
  return sortAndFallback(avif, webp, canonical);
}

/**
 * Retrieve optimized image variants for a group/slug pair.
 * Returns null if no variants (directory) exist.
 */
export async function getOptimizedImageVariants(group: string, slug: string): Promise<OptimizedImageVariants | null> {
  if (!group || !slug) {
    return null;
  }
  const gNorm = normalizeImageSlug(group);
  const slugCandidates = buildSlugCandidates(slug);
  // Pre-filter loaders by group only once for performance
  const groupEntries = Object.entries(loaders).filter(([p]) => p.includes(`/${gNorm}/`));
  if (groupEntries.length === 0) {
    return null;
  }

  for (const sNorm of slugCandidates) {
    const entries = groupEntries.filter(([p]) => p.includes(`/${sNorm}/`));
    if (entries.length === 0) {
      continue;
    }
    const { avif, webp, fallback } = await collectEntries(entries, gNorm, sNorm);
    if (avif.length || webp.length || fallback) {
      return { group: gNorm, slug: sNorm, avif, webp, fallback };
    }
  }
  return null;
}
