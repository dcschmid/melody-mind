/**
 * An album object containing information about the album.
 */
export interface Album {
  /**
   * The category of the album.
   */
  category: string;
  /**
   * The band name of the album.
   */
  band: string;
  /**
   * The album title of the album.
   */
  album: string;
  /**
   * The release year of the album.
   */
  dataYear: string;
  /**
   * The length of the album in minutes.
   */
  dataLength: string;
  /**
   * The sales of the album.
   */
  dataSales: string;
  /**
   * The URL of the album cover image.
   */
  coverSrc: string;
  /**
   * The URL of the album audio file.
   */
  audioSrc: string;
  /**
   * The text of the joker question.
   */
  jokerText: string;
  /**
   * The text of the trivia question.
   */
  triviaQuestion: string;
  /**
   * The answer of the trivia question.
   */
  triviaAnswer: string;
}
