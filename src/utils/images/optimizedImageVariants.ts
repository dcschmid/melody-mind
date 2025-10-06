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

export interface VariantEntry {
  width: number;
  src: string;
}
export interface OptimizedImageVariants {
  group: string;
  slug: string;
  avif: VariantEntry[];
  webp: VariantEntry[];
  fallback: string | null;
}

// Glob über beliebige Gruppen (ein Verzeichnislevel unter assets) statt fester Liste.
// Struktur: src/assets/<group>/<slug>/<files>
// Jetzt: webp, avif UND jpg/jpeg laden, damit wir eine echte kanonische Fallback-Datei referenzieren können.
// Wir laden EAGER, damit während des SSG bereits alle Pfade + URLs verfügbar sind und keine async Race Conditions
// entstehen (bisher schien der lazy Import im Build nicht zu feuern, wodurch Varianten fehlten).
// Das Datenvolumen ist überschaubar (nur Referenzen auf statische optimierte Assets).
// Primärer Glob relativ zu diesem Utility (liegt unter src/utils/images)
let loaders = import.meta.glob("../../assets/*/*/*.{webp,avif,jpg,jpeg}", { eager: true });
// Fallback: falls aus irgendeinem Build-Grund (Pfadauflösung) nichts gefunden wurde, alternative Muster versuchen
if (Object.keys(loaders).length === 0) {
  // Variante mit führendem ./
  loaders = import.meta.glob("./../../assets/*/*/*.{webp,avif,jpg,jpeg}", { eager: true });
}
if (Object.keys(loaders).length === 0) {
  // Variante relativ von src/ aus gedacht
  loaders = import.meta.glob("/src/assets/*/*/*.{webp,avif,jpg,jpeg}", { eager: true });
}

// Interner Index für schnellen Lookup: Map<groupSlugKey, { avif: VariantEntry[]; webp: VariantEntry[]; fallback: string | null }>
// Wird einmal beim Module-Load aufgebaut.
interface IndexedVariants {
  avif: VariantEntry[];
  webp: VariantEntry[];
  fallback: string | null; // kanonische Einzeldatei oder größtes Format
}

const VARIANT_INDEX: Map<string, IndexedVariants> = new Map();

// Build des Index beim ersten Import.
for (const [p, mod] of Object.entries(loaders)) {
  const meta = parsePath(p);
  if (!meta.group || !meta.slug) {
    continue;
  }
  const key = `${meta.group}::${meta.slug}`;
  let bucket = VARIANT_INDEX.get(key);
  if (!bucket) {
    bucket = { avif: [], webp: [], fallback: null };
    VARIANT_INDEX.set(key, bucket);
  }
  const src = extractSrc(mod);
  if (!src) {
    continue;
  }
  if (meta.isCanonical) {
    // Kanonische Datei bevorzugt als Fallback speichern (webp > jpg). Wenn bereits gesetzt und neues ist jpg, nicht überschreiben.
    if (!bucket.fallback || (bucket.fallback && meta.format === "webp")) {
      bucket.fallback = src;
    }
    continue;
  }
  if (meta.format === "avif" && meta.width) {
    bucket.avif.push({ width: meta.width, src });
  } else if (meta.format === "webp" && meta.width) {
    bucket.webp.push({ width: meta.width, src });
  }
}

// Sortierung + sekundäre Fallback-Ableitung (falls keine kanonische Datei vorhanden war)
for (const bucket of VARIANT_INDEX.values()) {
  bucket.avif.sort((a, b) => a.width - b.width);
  bucket.webp.sort((a, b) => a.width - b.width);
  if (!bucket.fallback) {
    bucket.fallback = bucket.webp.at(-1)?.src || bucket.avif.at(-1)?.src || null;
  }
}

// Debug-Ausgabe (nur einmal beim Build – ist SSG, daher unkritisch). Hilft zu verifizieren, dass Varianten erkannt werden.
// Bei Bedarf später entfernen.
if (import.meta.env?.MODE === 'development' || typeof process !== 'undefined') {
  try {
    const total = VARIANT_INDEX.size;
    const sampleKeys = Array.from(VARIANT_INDEX.keys()).slice(0, 5);
    // Zähle wie viele Keys mindestens eine WebP-Variante haben
    let withWebp = 0;
    for (const k of VARIANT_INDEX.keys()) {
      const b = VARIANT_INDEX.get(k)!;
      if (b.webp.length) {
        withWebp++;
      }
    }
    // eslint-disable-next-line no-console
    console.log(`[optimizedImageVariants] index built: keys=${total}, withWebpVariants=${withWebp}, sampleKeys=${sampleKeys.join(', ')}`);
  } catch {
    // ignore
  }
}

import { buildSlugCandidates, normalizeImageSlug } from "./slugNormalization";

interface ParsedPath {
  group: string | null;
  slug: string | null;
  width: number | null;
  format: string;
  isCanonical: boolean;
}

// Augment global scope for debug flag
declare global {
  var __MM_OPTIMG_DEBUG_LOGGED: boolean | undefined; // debug flag
}

function parsePath(p: string): ParsedPath {
  // Normalize path (remove any leading ../ segments introduced by import.meta.glob relative pattern)
  // We only care about the trailing portion assets/<group>/<slug>/<file>
  // Examples of incoming p keys (Vite): ../../assets/playlist/thrash-metal/thrash-metal-240.webp
  const normalized = p.replace(/^[./]+/, "");
  // Matches assets/<group>/<slug>/<file>
  const m = normalized.match(/assets\/([^/]+)\/([^/]+)\/([^/]+)$/);
  if (!m) {
    return { group: null, slug: null, width: null, format: "", isCanonical: false };
  }
  const [, group, slug, file] = m;
  // Canonical preference order: webp > jpg/jpeg (keep existing semantics, but allow jpg canonical if webp absent)
  if (file === `${slug}.webp`) {
    return { group, slug, width: null, format: "webp", isCanonical: true };
  }
  if (file === `${slug}.jpg` || file === `${slug}.jpeg`) {
    return { group, slug, width: null, format: "jpg", isCanonical: true };
  }
  const m2 = file.match(new RegExp(`^${slug}-(\\d+)\\.(webp|avif|jpg|jpeg)$`));
  if (!m2) {
    return { group, slug, width: null, format: "", isCanonical: false };
  }
  return { group, slug, width: Number(m2[1]), format: m2[2], isCanonical: false };
}

function extractSrc(mod: unknown): string | undefined {
  if (mod && typeof mod === "object" && "default" in mod) {
    const v = (mod as Record<string, unknown>).default;
    if (typeof v === "string") {
      return v;
    }
  }
  return undefined;
}

// (Legacy helper removed – Index übernimmt Sortierung & Fallback)

// collectEntries entfällt – Index existiert bereits.

/**
 * Retrieve optimized image variants for a group/slug pair.
 * Returns null if no variants (directory) exist.
 */
export async function getOptimizedImageVariants(
  group: string,
  slug: string
): Promise<OptimizedImageVariants | null> {
  if (!group || !slug) {
    return null;
  }
  // Laufzeit-Debug: einmalig loggen, wie groß der Index ist, wenn erste Abfrage erfolgt
  if (globalThis.__MM_OPTIMG_DEBUG_LOGGED !== true) {
    globalThis.__MM_OPTIMG_DEBUG_LOGGED = true;
    try {
      // eslint-disable-next-line no-console
      console.log('[OptimizedImage] Variant index status', {
        indexSize: VARIANT_INDEX.size,
        sample: Array.from(VARIANT_INDEX.keys()).slice(0, 10),
        loaderKeys: Object.keys(loaders).slice(0, 5),
        loadersTotal: Object.keys(loaders).length,
      });
    } catch {
      /* ignore */
    }
  }
  const gNorm = normalizeImageSlug(group);
  const slugCandidates = buildSlugCandidates(slug);
  for (const sNorm of slugCandidates) {
    const key = `${gNorm}::${sNorm}`;
    const bucket = VARIANT_INDEX.get(key);
    if (bucket && (bucket.avif.length || bucket.webp.length || bucket.fallback)) {
      return {
        group: gNorm,
        slug: sNorm,
        avif: bucket.avif,
        webp: bucket.webp,
        fallback: bucket.fallback,
      };
    }
  }
  return null;
}

// Nur für Diagnosezwecke exportieren – nicht produktiv verwenden.
/**
 * Debug helper: returns a lightweight snapshot of the internal variant index.
 * DO NOT rely on this in production logic; only for temporary diagnostics.
 */
export function __debugGetVariantIndexSnapshot(): { size: number; keys: string[] } {
  return { size: VARIANT_INDEX.size, keys: Array.from(VARIANT_INDEX.keys()).slice(0, 20) };
}
