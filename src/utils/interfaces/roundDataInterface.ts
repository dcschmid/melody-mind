/**
 * An interface representing the data for a round.
 */
export interface RoundData {
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

  /**
   * The data for sorting the albums.
   */
  sortData: string;

  /**
   * The order of the sort data.
   */
  sortOrder: string;
}
