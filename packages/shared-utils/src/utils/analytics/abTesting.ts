/**
 * Lightweight client-side experiment assignment helper.
 *
 * This module is responsible for:
 * - validating and normalizing variant definitions,
 * - deterministically reusing an already assigned variant for the same experiment,
 * - assigning a new variant with simple weighted random selection when needed,
 * - and persisting the resulting assignment in browser storage.
 *
 * Scope and limitations:
 * - there is no server-side bucketing or user identity,
 * - assignments are browser-local only,
 * - and weighting is intentionally simple rather than statistically advanced.
 *
 * Persistence is intentionally session-scoped: assignments live in `sessionStorage`
 * for the lifetime of the current tab and are discarded when that tab is closed.
 */
import { SESSION_KEYS } from "../../constants/storage";
import { safeSessionStorage } from "../storage/safeStorage";
import { isServer } from "../environment";

/** Canonical storage entry used to persist experiment-to-variant assignments. */
const STORAGE_KEY = SESSION_KEYS.AB_TESTS;

/**
 * Public variant definition accepted by the assignment API.
 *
 * - `id` is the variant identifier returned to callers.
 * - `weight` controls relative selection probability for first-time assignment.
 */
export type ExperimentVariant = {
  id: string;
  weight: number;
};

/** Serialized map of `{ experimentId: assignedVariantId }` stored in the browser. */
type StoredVariants = Record<string, string>;

/** Narrows arbitrary input to a usable non-empty string. */
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

/**
 * Normalizes raw variant input into a safe weighted candidate list.
 *
 * Behavior:
 * - discards variants with empty ids,
 * - discards non-finite weights,
 * - trims ids,
 * - clamps negative weights to zero,
 * - removes zero-weight entries,
 * - and falls back to a single `control` variant when nothing valid remains.
 */
const normalizeVariants = (variants: ExperimentVariant[]): ExperimentVariant[] => {
  const filtered = variants
    .filter((variant) => isNonEmptyString(variant.id) && Number.isFinite(variant.weight))
    .map((variant) => ({
      id: variant.id.trim(),
      weight: Math.max(0, variant.weight),
    }))
    .filter((variant) => variant.weight > 0);

  return filtered.length ? filtered : [{ id: "control", weight: 1 }];
};

/** Reads the complete stored assignment map from browser storage. */
const readStoredVariants = (): StoredVariants => {
  return safeSessionStorage.get<StoredVariants>(STORAGE_KEY, {});
};

/** Persists the complete assignment map back to browser storage. */
const writeStoredVariants = (next: StoredVariants): void => {
  safeSessionStorage.set(STORAGE_KEY, next);
};

/**
 * Picks one variant using a simple weighted random draw.
 *
 * The probability of a variant being chosen is proportional to its `weight`
 * relative to the sum of all normalized weights.
 */
const pickWeightedVariant = (variants: ExperimentVariant[]): string => {
  const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0);
  const draw = Math.random() * totalWeight;
  let cursor = 0;

  for (const variant of variants) {
    cursor += variant.weight;
    if (draw <= cursor) {
      return variant.id;
    }
  }

  return variants[variants.length - 1]?.id || "control";
};

/**
 * Returns the previously assigned variant for an experiment, or assigns one now.
 *
 * Behavior:
 * 1. invalid experiment ids or server execution fall back to `"control"`,
 * 2. variant input is normalized before any comparison,
 * 3. an existing stored assignment is reused when it is still valid,
 * 4. otherwise a new weighted assignment is generated and persisted.
 *
 * This makes experiment assignment stable per browser/storage state while still
 * allowing callers to update the available variant list over time.
 */
export function getOrAssignVariant(
  experimentId: string,
  variants: ExperimentVariant[]
): string {
  if (isServer || !isNonEmptyString(experimentId)) {
    return "control";
  }

  const normalizedExperimentId = experimentId.trim();
  const normalizedVariants = normalizeVariants(variants);
  const storedVariants = readStoredVariants();
  const existing = storedVariants[normalizedExperimentId];

  if (
    isNonEmptyString(existing) &&
    normalizedVariants.some((variant) => variant.id === existing)
  ) {
    return existing;
  }

  const assigned = pickWeightedVariant(normalizedVariants);
  storedVariants[normalizedExperimentId] = assigned;
  writeStoredVariants(storedVariants);
  return assigned;
}
