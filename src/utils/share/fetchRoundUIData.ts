import type { RoundData } from "../interfaces/roundDataInterface";

/**
 * Object containing the UI data for all rounds.
 */
const roundData: Record<string, RoundData> = {
  "round-one": {
    headline: "Runde 1 / 3",
  },
  "round-two": {
    headline: "Runde 2 / 3",
  },
  "round-three": {
    headline: "Runde 3 / 3",
  },
};

/**
 * Returns a promise that resolves to the UI data for the given round slug.
 * @param roundSlug The slug of the round to get the data for.
 */
export function fetchRoundUIData(roundSlug: string): Promise<RoundData> {
  return Promise.resolve(roundData[roundSlug]);
}
