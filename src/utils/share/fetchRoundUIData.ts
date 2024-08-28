import type { RoundData } from "../interfaces/roundDataInterface";

/**
 * Object containing the UI data for all rounds.
 */
const roundData: Record<string, RoundData> = {
  "round-one": {
    headline: "Runde 1 / 3",
    startOverlayText:
      "Erscheinungsjahr: vorne das neueste, hinten das älteste.",
    introSubline: "Sortieren Sie nach dem",
    sortToText: "Erscheinungsjahr!",
    upToLabel: "Älteste",
    downToLabel: "Neuste",
    sortData: "dataYear",
    sortOrder: "desc",
  },
  "round-two": {
    headline: "Runde 2 / 3",
    startOverlayText: "Verkaufszahlen: vorne das meiste, hinten das wenigste.",
    introSubline: "Sortieren Sie nach",
    sortToText: "Verkaufszahlen!",
    upToLabel: "Wenigste",
    downToLabel: "Meiste",
    sortData: "dataSales",
    sortOrder: "desc",
  },
  "round-three": {
    headline: "Runde 3 / 3",
    startOverlayText: "Gesamtlänge: vorne das längste, hinten das kürzeste.",
    introSubline: "Sortieren Sie nach",
    sortToText: "Gesamtlänge!",
    upToLabel: "Kürzeste",
    downToLabel: "Längste",
    sortData: "dataLength",
    sortOrder: "desc",
  },
};

/**
 * Returns a promise that resolves to the UI data for the given round slug.
 * @param roundSlug The slug of the round to get the data for.
 */
export function fetchRoundUIData(roundSlug: string): Promise<RoundData> {
  return Promise.resolve(roundData[roundSlug]);
}
