import type { RoundData } from "../interfaces/roundDataInterface";

/**
 * Available round slugs as const enum for type safety
 * @readonly
 */
export const ROUND_SLUGS = {
  ROUND_ONE: "round-one",
  ROUND_TWO: "round-two",
  ROUND_THREE: "round-three",
} as const;

/**
 * Type representing valid round slugs
 */
export type RoundSlug = (typeof ROUND_SLUGS)[keyof typeof ROUND_SLUGS];

/**
 * Object containing the UI data for all rounds.
 * Each round contains specific UI information like headlines
 * @type {Record<RoundSlug, RoundData>}
 */
const roundData: Record<RoundSlug, RoundData> = {
  [ROUND_SLUGS.ROUND_ONE]: {
    headline: "Runde 1 / 3",
  },
  [ROUND_SLUGS.ROUND_TWO]: {
    headline: "Runde 2 / 3",
  },
  [ROUND_SLUGS.ROUND_THREE]: {
    headline: "Runde 3 / 3",
  },
};

/**
 * Fetches the UI data for the specified round
 *
 * @param {RoundSlug} roundSlug - The slug of the round to fetch data for
 * @throws {Error} When an invalid round slug is provided
 * @returns {Promise<RoundData>} Promise containing the UI data for the round
 */
export function fetchRoundUIData(roundSlug: RoundSlug): Promise<RoundData> {
  if (!(roundSlug in roundData)) {
    return Promise.reject(new Error(`Ungültiger Round-Slug: ${roundSlug}`));
  }

  return Promise.resolve(roundData[roundSlug]);
}
