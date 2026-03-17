/**
 * Simplified A/B testing for quiz app
 */

export type ExperimentVariant = "control" | "treatment";

export function getOrAssignVariant(_experimentId: string): ExperimentVariant {
  return "control";
}
