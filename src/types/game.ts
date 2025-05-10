/**
 * Represents a single music trivia question with multiple choice options
 */
export interface Question {
  /** The text of the question */
  question: string;
  /** Array of possible answer options */
  options: string[];
  /** The correct answer among the options */
  correctAnswer: string;
  /** Optional additional information shown after answering */
  trivia?: string;
}

/**
 * Represents a music album with associated questions and metadata
 */
export interface Album {
  /** Path to the album cover image */
  coverSrc: string;
  /** Name of the artist/band */
  artist: string;
  /** Title of the album */
  album: string;
  /** Release year of the album */
  year: string;
  /** Optional link to audio preview */
  preview_link?: string;
  /** Optional link to Spotify */
  spotify_link?: string;
  /** Optional link to Deezer */
  deezer_link?: string;
  /** Optional link to Apple Music */
  apple_music_link?: string;
  /**
   * Questions associated with this album, organized by categories
   * The outer key represents the category, inner array contains questions
   */
  questions: {
    [key: string]: {
      [key: string]: any;
      question: string;
    }[];
  };
}

/**
 * Represents the current state of a game session
 */
export interface GameState {
  /** Current player score */
  score: number;
  /** Number of correctly answered questions */
  correctAnswers: number;
  /** Current round/question index */
  roundIndex: number;
  /** The current active question or null if no question is active */
  currentQuestion: Question | null;

  // Extended properties for achievement tracking

  /**
   * For genre_explorer achievement: Category/genre of the current game
   */
  category?: {
    /** Unique identifier of the category */
    id: string;
    /** Display name of the category */
    name: string;
  };

  /**
   * For quick_answer achievement: Response time in milliseconds
   */
  lastAnswerTime?: number;

  /**
   * For quick_answer achievement: Whether the last answer was correct
   */
  lastAnswerCorrect?: boolean;

  /**
   * For seasonal_event achievement: ID of the current seasonal event
   */
  eventId?: string;

  /**
   * For game_series achievement: Whether the game session is ending
   * (returning to main menu)
   */
  endOfSession?: boolean;

  /**
   * Debug flag to test achievement functionality
   */
  debugAchievements?: boolean;
}

/**
 * Interface for handling question-related events
 */
export interface QuestionHandlers {
  /**
   * Handles user selection of an answer option
   * @param option The selected answer option
   * @param correctAnswer The correct answer for comparison
   * @param question The question object containing trivia information
   * @param album The album associated with the current question
   */
  handleAnswer: (
    option: string,
    correctAnswer: string,
    question: { trivia: string },
    album: Album,
  ) => void;

  /**
   * Optional method to update the state of the 50:50 joker
   */
  updateJokerState?: () => void;
}

/**
 * Interface for DOM elements related to question display
 */
export interface QuestionElements {
  /** Main container element for the question */
  container: HTMLElement;
  /** Element displaying the question text */
  question: HTMLElement;
  /** Element containing the answer options */
  options: HTMLElement;
  /** Loading spinner element */
  spinner: HTMLElement;
}
