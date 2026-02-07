const STORAGE_KEY = "mm_ab_variants";

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
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as StoredVariants) : {};
  } catch {
    return {};
  }
};

const writeStoredVariants = (next: StoredVariants): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Keep experience running when storage is unavailable.
  }
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
