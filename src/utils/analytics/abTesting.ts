import { SESSION_KEYS } from "@constants/storage";
import { safeLocalStorage } from "@utils/storage/safeStorage";

const STORAGE_KEY = SESSION_KEYS.AB_TESTS;

export type ExperimentVariant = {
  id: string;
  weight: number;
};

type StoredVariants = Record<string, string>;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

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

const readStoredVariants = (): StoredVariants => {
  return safeLocalStorage.get<StoredVariants>(STORAGE_KEY, {});
};

const writeStoredVariants = (next: StoredVariants): void => {
  safeLocalStorage.set(STORAGE_KEY, next);
};

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

export function getOrAssignVariant(
  experimentId: string,
  variants: ExperimentVariant[]
): string {
  if (typeof window === "undefined" || !isNonEmptyString(experimentId)) {
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
