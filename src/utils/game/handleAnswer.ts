import { stopAudio } from "@utils/audio/audioControls";
import { updateScoreDisplay } from "./scoreUtils";
import { getRandomQuestion } from "./getRandomQuestion";
import { loadQuestion, type Question } from "./loadQuestion";
import type { MediaElements } from "./mediaUtils";
import { updateMedia } from "./mediaUtils";

interface HandleAnswerConfig {
  feedbackElement: HTMLParagraphElement;
  scoreElement: HTMLParagraphElement;
  overlayCover: HTMLImageElement;
  mediaElements: MediaElements | null;
  roundElement: HTMLParagraphElement;
  currentQuestion: Question | null;
  roundIndex: number;
  totalRounds: number;
  score: number;
  difficulty: string | null;
  albums: any[];
  questionConfig: any;
  endGame: () => void;
}

export function createHandleAnswer(config: HandleAnswerConfig) {
  return function handleAnswer(
    option: string,
    correctAnswer: string,
    currentQuestion: { trivia: string },
    album: { coverSrc: string; artist: string; album: string; year: string },
  ) {
    const startTime = Date.now();
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
    let totalPoints = 0;
    let bonusPoints = 0;

    if (option === correctAnswer) {
      bonusPoints = timeTaken <= 10 ? 50 : timeTaken <= 15 ? 25 : 0;
      totalPoints = 50 + bonusPoints;
      config.feedbackElement.classList.add("correct");
      config.feedbackElement.textContent = `Richtig! 50 Punkte + ${bonusPoints} Bonuspunkte`;
    } else {
      config.feedbackElement.classList.add("incorrect");
      config.feedbackElement.textContent = `Falsch! Die richtige Antwort war: ${correctAnswer}`;
    }

    config.feedbackElement.classList.add("show");

    setTimeout(() => {
      config.feedbackElement.classList.remove("show", "correct", "incorrect");
    }, 5000);

    config.score += totalPoints;
    updateScoreDisplay(config.score, config.scoreElement);

    config.overlayCover.src = album.coverSrc || "";
    document.getElementById("overlay-artist")!.textContent = album.artist || "";
    document.getElementById("overlay-album")!.textContent = album.album || "";
    document.getElementById("overlay-funfact")!.textContent =
      currentQuestion.trivia || "";
    document.getElementById("overlay-year")!.textContent = album.year || "";

    if (config.mediaElements) {
      updateMedia(album, config.mediaElements);
    }

    const overlay = document.getElementById("overlay") as HTMLDivElement;
    overlay.classList.remove("hidden");

    const nextRoundButton = document.getElementById(
      "next-round-button",
    ) as HTMLButtonElement;

    nextRoundButton.onclick = function () {
      stopAudio();
      overlay.classList.add("hidden");
      if (config.roundIndex < config.totalRounds - 1) {
        config.roundIndex++;
        config.roundElement.textContent = `${config.roundIndex + 1}/${config.totalRounds}`;

        const newQuestion = getRandomQuestion(
          config.albums,
          config.difficulty || "easy",
          config.totalRounds,
        );
        if (newQuestion) {
          config.currentQuestion = loadQuestion(
            newQuestion.randomQuestion,
            newQuestion.randomAlbum,
            config.questionConfig,
          );
        }
      } else {
        config.endGame();
      }
    };
  };
}
