export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  trivia?: string;
}

export interface Album {
  coverSrc: string;
  artist: string;
  album: string;
  year: string;
  preview_link?: string;
  spotify_link?: string;
  deezer_link?: string;
  apple_music_link?: string;
  questions: {
    [key: string]: {
      [key: string]: any;
      question: string;
    }[];
  };
}

export interface GameState {
  score: number;
  correctAnswers: number;
  roundIndex: number;
  currentQuestion: Question | null;
}

export interface QuestionHandlers {
  handleAnswer: (
    option: string,
    correctAnswer: string,
    question: { trivia: string },
    album: Album,
  ) => void;
  updateJokerState?: () => void;
}

export interface QuestionElements {
  container: HTMLElement;
  question: HTMLElement;
  options: HTMLElement;
  spinner: HTMLElement;
}
