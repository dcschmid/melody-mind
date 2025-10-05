# Image Optimization Pipeline

MelodyMind uses a robust, pre-generated responsive image pipeline to ensure fast loading, high
quality, and SEO-friendly images across all content domains (categories, podcasts, playlists,
homecategories, knowledge articles).

- **All images are optimized and converted to modern formats (WebP, optional AVIF) at build time.**
- **Canonical JPGs are retained for OpenGraph/SEO and legacy fallback.**
- **Slug normalization ensures consistent lookup and prevents broken images due to special
  characters.**

---

## Pipeline Steps

1. **Staging Originals**

- Place source JPGs in `staging/<group>/` (e.g., `staging/category/`, `staging/podcast/`).
- Filenames must match the intended slug (see normalization policy below).

2. **Run Optimizer**

- Use `scripts/optimize_images.py` to generate variants:
  - `--group <group>` for a single group
  - `--all` for all groups
  - `--force` to overwrite existing variants
  - `--cleanup` to remove orphaned variants
- Output: `src/assets/<group>/<slug>/` with multiple sizes and formats.

3. **Variant Discovery**

- The loader (`optimizedImageVariants.ts`) dynamically discovers all variants for a given
  group/slug, using a prioritized list of normalized slug candidates.
- The `<OptimizedImage>` component renders a `<picture>` element with all available sources and a
  JPG fallback.

4. **Content Usage**

- All image references in content (frontmatter, JSON, etc.) should use the slug (not a static path).
- For knowledge articles, the `image` field should be `/category/<slug>.jpg` (no separate group
  needed).

---

## 2. Directory Layout (Generated Assets)

```text
src/assets/<group>/<slug>/
  <slug>-240.{jpg,webp,avif?}
  <slug>-480.*
  <slug>-720.*
  <slug>-960.*
  <slug>.jpg      (canonical bounded original)
  <slug>.webp     (canonical modern)
  <slug>.avif     (canonical, if AVIF supported)
```

Source (raw) images are placed under:

```text
staging/<group>/*.jpg|*.jpeg|*.png
```

Public legacy / canonical originals (e.g. for RSS feeds) may still live under `public/<group>/`.
These are **not** mutated by the pipeline.

## 3. Generation Script

File: `scripts/optimize_images.py`

Key features:

- Dynamic group discovery (`--all`) from subdirectories of `staging/`.
- Multiple target widths: 240, 480, 720, 960 + canonical (max 1200px by default).
- Skips re-render if variants are younger than 7 days (freshness window) unless `--force`.
- Optional cleanup of source originals after success (`--cleanup`).
- Optional dry run (`--dry-run`) with counts only.
- Parallel execution via thread pool (`--workers`).
- Optional AVIF generation if `pillow-avif-plugin` installed.

Example commands:

```bash
python scripts/optimize_images.py --group category
python scripts/optimize_images.py --group podcast --force --cleanup
python scripts/optimize_images.py --all --dry-run
python scripts/optimize_images.py --all --force --cleanup --workers 8
```

A consolidated report is written to `tmp/image-optimization-python.json`.

### 3.1 Prerequisites

```bash
pip install Pillow
# Optional AVIF
pip install pillow-avif-plugin
```

## Slug Normalization Policy

To ensure consistent directory naming and robust lookups, all slugs are normalized as follows:

- Lowercase
- Unicode NFKD normalization (removes diacritics)
- Replace `&` and `+` with `and`
- Replace `@` with `at`
- Replace any sequence of characters not in `[a-z0-9-]` with `-`
- Collapse multiple `-`
- Trim leading/trailing `-`
- Remove trailing `!` or `.`

**Example Transformations:**

- `Beyoncé & Friends` → `beyonce-and-friends`
- `Drum&Bass+Chill` → `drum-and-bass-and-chill`
- `Rock@Night` → `rock-at-night`
- `Forró Party!` → `forro-party`
- `Focus & Concentration` → `focus-and-concentration`

> **Note:** The loader attempts legacy normalization variants for backward compatibility. See
> `slugNormalization.ts` for details.

---

## ASCII Filename Policy (Diacritics & Special Characters)

While content strings (titles, frontmatter `image` references, etc.) may contain full Unicode, all
physical source image filenames placed in `staging/<group>/` must use ASCII-only characters. This
prevents subtle cross-platform issues (e.g. macOS HFS+ storing decomposed forms of é while Linux
keeps precomposed bytes) and ensures deterministic slug → directory mapping.

Rationale:

- Avoids mixed Unicode normalization forms (NFC vs NFD) causing duplicate-looking filenames.
- Simplifies CI and container builds (no locale/charset surprises in scripts or globbing).
- Aligns with existing slug normalization which strips diacritics anyway.

Practical Guidelines:

1. Remove diacritics in filenames: `forró.jpg` → `forro.jpg`, `Beyoncé.jpg` → `beyonce.jpg`.
2. Replace `&`, `+`, `@` directly with ASCII words (`and`, `and`, `at`) rather than symbols.
3. Use only: `[a-z0-9-]` plus the `.jpg` extension for staged originals.
4. Keep filenames lowercase; rely on the optimization script for size/format variants.
5. If a contributor adds a non-ASCII filename, rename it before running the optimizer and update any
   pending references in content (or rely on slug normalization to resolve if already merged).

Detection Script: Run the helper script to list any non-ASCII or policy-violating filenames before
committing:

```bash
node scripts/check-non-ascii-filenames.cjs
```

It will output recommended canonical forms. After renaming, re-run the optimizer.

Edge Cases:

- Different visually similar characters (e.g. `ı` vs `i`) are normalized; prefer the common Latin
  base.
- Accented characters removed could create collisions (rare). If collision risk exists, add a
  descriptive ASCII qualifier (e.g. `cafe-paris.jpg` vs `cafe-rio.jpg`).

Policy Enforcement Strategy:

- Manual pre-commit check today (script + code review).
- Optionally future CI step can fail when violations are detected (not yet enabled).

---

## 5. Runtime Consumption

Component: `src/components/OptimizedImage.astro` Utility:
`src/utils/images/optimizedImageVariants.ts`

The loader:

1. Uses a dynamic Vite glob: `import.meta.glob('../../assets/*/*/*.{webp,avif}')`.
2. Filters by group + slug candidates.
3. Collects width-specific and canonical variants.
4. Sorts ascending by width.
5. Determines a fallback (canonical WebP → largest WebP → largest AVIF → null).

Rendering strategy (simplified):

```astro
<picture>
  <source type="image/avif" srcset="..." />
  <source type="image/webp" srcset="..." />
  <img src="/category/<slug>.jpg" alt="..." loading="lazy" />
</picture>
```

The `<img>` tag references a stable public JPG (or canonical variant) to ensure maximum
compatibility (OG parsers, older browsers).

## 6. Adding a New Group

1. Create `staging/<newgroup>/` and drop raw images inside.
2. Run: `python scripts/optimize_images.py --group <newgroup>`.
3. Use `<OptimizedImage group="<newgroup>" slug="<slug>" ... />` in components.
4. (Optional) Add any public canonical JPGs to `public/<newgroup>/` if external feeds require direct
   static paths.

No code changes are required as long as the pattern follows the established directory structure.

## 7. Updating / Regenerating Variants

- Minor additions: run for that single group with `--group`.
- Bulk refresh (e.g. quality tweak): `--all --force`.
- After a quality policy change: perform a forced regeneration and, if safe, cleanup old staged
  sources using `--cleanup`.

## 8. Open Graph (OG) & Social Sharing

We continue serving canonical JPGs for OG / Twitter cards. Modern crawlers increasingly support
WebP, but JPG is universally reliable and avoids edge cases. Do not replace OG images with WebP
unless verified compatibility matrix is updated.

## 9. Handling Special / Problem Slugs

If an image does not resolve:

1. Confirm original file exists under `staging/<group>/` (or already generated under `src/assets`).
2. Run the optimizer for that group (maybe with `--force`).
3. Check normalized slug output (use node REPL importing `normalizeImageSlug`).
4. Inspect `src/assets/<group>/` for close variants (grep by partial slug root).
5. If only a legacy folder exists, the candidate search should still resolve it. If not, manually
   rename the directory to the canonical slug (optional cleanup step—see Section 11).

## Troubleshooting

- **Image not found?**
  - Check that the original is staged with the correct slug (see normalization rules).
  - Run the optimizer with `--force` to regenerate variants.
  - If the slug contains special characters, verify normalization matches the variant directory.
  - The loader will try legacy normalization candidates automatically.

- **Duplicate variant directories?**
  - If you see multiple directories for the same logical slug (e.g., `female-rb-divas` and
    `female-randb-divas`), prefer the canonical form. Clean up after verifying all references.

- **OG image not updating?**
  - OG always uses the canonical JPG. Make sure the original is present in `public/<group>/`.

---

## (Optional) Duplicate Directory Cleanup

After adopting the unified slug normalization, you may discover pairs like:

```text
focus-concentration/
focus-and-concentration/
```

Recommended process:

1. Verify which one is canonical via `normalizeImageSlug('Focus & Concentration')`.
2. Update any hard-coded references (should be rare—most now use the raw content string → loader).
3. Move or merge assets if needed (keep the canonical folder). Example:

```bash
mv src/assets/category/focus-concentration/* src/assets/category/focus-and-concentration/
rm -rf src/assets/category/focus-concentration
```

1. (Optional) Re-run optimizer with `--group category --force` to ensure consistent quality.

Do NOT perform destructive cleanup without a fresh build + manual spot check.

---

## 12. Extensibility / Future Work

Planned / potential enhancements:

- Add AVIF to the `<picture>` markup once widely generated (flags already present in script).
- Integrate width descriptors (`srcset="... 240w, ... 480w"`) for finer browser selection.
- Add automated script to flag duplicate slug directories before build.
- Provide `imageSlug` frontmatter key to avoid parsing paths like `/category/<slug>.jpg`.
- Introduce a quality regression diff (compare file sizes / SSIM) during CI.

## 13. API Summary

| Function / Script                        | Purpose                           |
| ---------------------------------------- | --------------------------------- |
| `scripts/optimize_images.py`             | Generate responsive variants      |
| `normalizeImageSlug(raw)`                | Deterministic canonical slug      |
| `buildSlugCandidates(raw)`               | Legacy-aware candidate list       |
| `getOptimizedImageVariants(group, slug)` | Runtime variant metadata lookup   |
| `<OptimizedImage />`                     | Render `<picture>` with fallbacks |

## 14. Maintenance Checklist

Before committing image pipeline changes:

- [ ] Lint & build pass (`yarn lint:check` / `yarn build`).
- [ ] No orphaned duplicate slug folders unless intentionally pending cleanup.
- [ ] Docs updated if slug logic or widths change.
- [ ] OG JPGs still present where externally referenced (RSS, social cards).
- [ ] Staging filenames are ASCII-only (run `node scripts/check-non-ascii-filenames.cjs`).

---

## References

- `scripts/optimize_images.py` – Variant generator
- `src/utils/images/optimizedImageVariants.ts` – Loader logic
- `src/utils/images/slugNormalization.ts` – Normalization policy & candidate logic
- `src/components/OptimizedImage.astro` – Rendering component

---

Last updated: 2025-10-05
