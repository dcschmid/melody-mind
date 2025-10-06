/**
 * Normalize a raw image slug (typically derived from frontmatter or filenames)
 * into the canonical directory slug used by the optimized image variant
 * pipeline (see `scripts/optimize_images.py`). This MUST remain deterministic
 * because build-time variant discovery relies on stable folder names.
 *
 * Canonical Policy Steps (in order):
 * 1. Unicode normalize (NFKD) – this decomposes accented characters.
 * 2. Strip combining marks (removes diacritics, e.g. "Beyoncé" -> "Beyonce").
 * 3. Lowercase.
 * 4. Expand symbolic joiners:
 *    - `&` and `+` become the word `and` (surrounded by spaces to ensure proper hyphen separation later).
 *    - `@` becomes the word `at`.
 * 5. Temporarily allow `!` and `.` so we can trim trailing punctuation cleanly.
 * 6. Replace any sequence of characters not in `[a-z0-9!-]` with a single `-`.
 * 7. Remove trailing `!` or `.` characters.
 * 8. Replace any remaining disallowed characters (including stray punctuation) with `-`.
 * 9. Collapse multiple consecutive hyphens into one.
 * 10. Trim leading / trailing hyphens.
 *
 * Rationale:
 * - Human-friendly, stable directory naming.
 * - Removes accidental drift between historically generated folders and new ones.
 * - Ensures future additions with diacritics or symbols map consistently.
 *
 * Example Transformations:
 *   "Beyoncé & Friends" -> "beyonce-and-friends"
 *   "Drum&Bass+Chill" -> "drum-and-bass-and-chill"
 *   "Rock@Night" -> "rock-at-night"
 *   "Forró Party!" -> "forro-party"
 *   "Focus & Concentration" -> "focus-and-concentration"
 *
 * NOTE: Do NOT change this policy lightly—doing so could orphan previously
 * generated variant directories. If changes are required, implement a backward
 * compatibility layer via `buildSlugCandidates` instead of modifying this
 * function directly.
 *
 * @param {string} raw Raw user / content provided slug or filename stem.
 * @returns {string} Canonically normalized slug string (may be empty if input empty).
 */
export function normalizeImageSlug(raw: string): string {
  if (!raw) {
    return "";
  }
  let s = raw.normalize("NFKD");
  // Remove combining marks
  s = s.replace(/\p{M}+/gu, "");
  s = s.toLowerCase();
  s = s.replace(/[&+]/g, " and "); // expand logical joiners
  s = s.replace(/@/g, " at ");
  // Remove possessive-like artifacts (rare) - optional
  // Replace any disallowed chars with hyphen
  s = s.replace(/[^a-z0-9!-]+/g, "-");
  // Remove isolated exclamation marks or periods at end
  s = s.replace(/[!.]+$/g, "");
  // Replace leftover disallowed (now ! or .) with hyphen
  s = s.replace(/[^a-z0-9-]+/g, "-");
  // Collapse multiple hyphens
  s = s.replace(/-{2,}/g, "-");
  // Trim
  s = s.replace(/^-|-$/g, "");
  return s;
}

/**
 * Build a prioritized list of slug candidates for lookup. The first element is
 * always the current canonical normalization (`normalizeImageSlug`). Subsequent
 * candidates attempt to reflect legacy / previously generated variant folder
 * naming patterns that may differ due to historical normalization rules.
 *
 * Current Additional Candidate Heuristics:
 *  - "simple": earlier logic that replaced symbolic characters directly with
 *    hyphens and did not expand `&` / `+` into `and`.
 *  - Removal of the explicit `-and-` segment (covers older collapsed patterns).
 *  - A variant removing a trailing `and-` artifact in edge cases.
 *
 * The set is de-duplicated while preserving insertion order (canonical first).
 *
 * Extension Guidance:
 *  If new legacy patterns are discovered, append additional transformations
 *  here rather than mutating `normalizeImageSlug`.
 *
 * @param {string} raw Raw slug input from content.
 * @returns {string[]} Ordered array of distinct slug candidates.
 */
export function buildSlugCandidates(raw: string): string[] {
  const primary = normalizeImageSlug(raw);
  const set = new Set<string>([primary]);
  // Legacy variants observed:
  // 1. ampersand removed entirely (focus-&-concentration -> focus-concentration)
  // 2. ampersand kept as separator but without 'and' (focus-&- -> focus-concentration)
  // 3. diacritics stripped aggressively causing truncation (forró -> forro)
  // 4. removed interior words after symbols (party-on! -> party-on)
  const simple = raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "")
    .replace(/&/g, "-")
    .replace(/[+@]/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
  set.add(simple);
  // Variant without "and" expansion for & / +
  const noAnd = primary.replace(/-and-/g, "-");
  set.add(noAnd);
  // Variant with removed hyphens around and
  set.add(primary.replace(/and-/g, "")); // edge case
  return Array.from(set).filter(Boolean);
}
