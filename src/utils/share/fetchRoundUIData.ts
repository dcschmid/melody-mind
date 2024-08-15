/**
 * Data type for the UI data of a round.
 */
interface RoundData {
  /**
   * The headline of the round.
   */
  headline: string;
  /**
   * The text to display in the start overlay.
   */
  startOverlayText: string;
  /**
   * The subline of the intro text.
   */
  introSubline: string;
  /**
   * The text to display as the sort-to text.
   */
  sortToText: string;
  /**
   * The label for the "up to" button.
   */
  upToLabel: string;
  /**
   * The label for the "down to" button.
   */
  downToLabel: string;
}

/**
 * Object containing the UI data for all rounds.
 */
const roundData: Record<string, RoundData> = {
  "round-one": {
    headline: "Runde 1 / 3",
    startOverlayText: "Erscheinungsjahr: vorne das neueste, hinten das älteste.",
    introSubline: "Sortieren Sie nach dem",
    sortToText: "Erscheinungsjahr!",
    upToLabel: "Älteste",
    downToLabel: "Neuste",
  },
  "round-two": {
    headline: "Runde 2 / 3",
    startOverlayText: "Verkaufszahlen: vorne das meiste, hinten das wenigste.",
    introSubline: "Sortieren Sie nach",
    sortToText: "Verkaufszahlen!",
    upToLabel: "Wenigste",
    downToLabel: "Meiste",
  },
  "round-three": {
    headline: "Runde 3 / 3",
    startOverlayText: "Gesamtlänge: vorne das längste, hinten das kürzeste.",
    introSubline: "Sortieren Sie nach",
    sortToText: "Gesamtlänge!",
    upToLabel: "Kürzeste",
    downToLabel: "Längste",
  },
};

/**
 * Returns a promise that resolves to the UI data for the given round slug.
 * @param roundSlug The slug of the round to get the data for.
 */
export function fetchRoundUIData(roundSlug: string): Promise<RoundData> {
  return Promise.resolve(roundData[roundSlug]);
}
