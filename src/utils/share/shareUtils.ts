import { handleGameError } from "../error/errorHandlingUtils";
import { resolveAchievement } from "../game/achievements";

/**
 * Share Utils - Utility functions for sharing game results across different platforms
 *
 * This module provides functionality to share game scores and achievements to
 * various social media and messaging platforms with localized content.
 *
 * @module shareUtils
 */

/**
 * The available sharing platforms supported by the application
 */
export type SharingPlatform = "twitter" | "whatsapp" | "email" | string;

/**
 * Supported difficulty levels for the game
 */
export type GameDifficulty = "easy" | "medium" | "hard" | "mixed" | string;

/**
 * The data structure required for sharing game results
 *
 * @interface ShareData
 * @property {number} score - The player's achieved score
 * @property {string} category - The quiz category/genre name
 * @property {GameDifficulty} difficulty - The difficulty level that was played
 * @property {string} mode - The game mode (optional - "normal" or "chronology")
 */
export interface ShareData {
  score: number;
  category: string;
  difficulty: GameDifficulty;
  mode?: string;
}

/**
 * Supported languages for sharing text
 */
export type SupportedLanguage = keyof typeof shareTextTranslations;

/**
 * Interface defining the structure of localized share text components
 */
interface ShareTextTranslations {
  musicGenius: string;
  musicPro: string;
  musicEnthusiast: string;
  musicLover: string;
  musicExplorer: string;
  scoreText: string;
  chronologyScoreText: string;
  challenge: string;
}

/**
 * Translations for share text in all supported languages
 *
 * Contains localized text templates for different achievement levels and user prompts
 */
const shareTextTranslations: Record<string, ShareTextTranslations> = {
  de: {
    musicGenius: "🎵 Musikgenie! 🎵",
    musicPro: "🎧 Musikprofi! 🎧",
    musicEnthusiast: "🎸 Musikenthusiast! 🎸",
    musicLover: "🎹 Musikliebhaber! 🎹",
    musicExplorer: "🎼 Musikentdecker! 🎼",
    scoreText:
      "Ich habe {score} Punkte bei Melody Mind im {category} Quiz ({difficulty}) erreicht!",
    chronologyScoreText:
      "Ich habe {score} Punkte bei Melody Mind im {category} Chronologie-Spiel ({difficulty}) erreicht!",
    challenge: "Forderst du mich heraus? Spiele jetzt mit:",
  },
  en: {
    musicGenius: "🎵 Music Genius! 🎵",
    musicPro: "🎧 Music Pro! 🎧",
    musicEnthusiast: "🎸 Music Enthusiast! 🎸",
    musicLover: "🎹 Music Lover! 🎹",
    musicExplorer: "🎼 Music Explorer! 🎼",
    scoreText: "I scored {score} points in Melody Mind's {category} quiz ({difficulty})!",
    chronologyScoreText:
      "I scored {score} points in Melody Mind's {category} chronology game ({difficulty})!",
    challenge: "Think you can beat me? Play now at:",
  },
  es: {
    musicGenius: "🎵 ¡Genio musical! 🎵",
    musicPro: "🎧 ¡Profesional de la música! 🎧",
    musicEnthusiast: "🎸 ¡Entusiasta musical! 🎸",
    musicLover: "🎹 ¡Amante de la música! 🎹",
    musicExplorer: "🎼 ¡Explorador musical! 🎼",
    scoreText:
      "¡He conseguido {score} puntos en el quiz de {category} de Melody Mind ({difficulty})!",
    chronologyScoreText:
      "¡He conseguido {score} puntos en el juego de cronología de {category} de Melody Mind ({difficulty})!",
    challenge: "¿Crees que puedes superarme? Juega ahora en:",
  },
  fr: {
    musicGenius: "🎵 Génie musical ! 🎵",
    musicPro: "🎧 Pro de la musique ! 🎧",
    musicEnthusiast: "🎸 Passionné de musique ! 🎸",
    musicLover: "🎹 Amateur de musique ! 🎹",
    musicExplorer: "🎼 Explorateur musical ! 🎼",
    scoreText: "J'ai obtenu {score} points dans le quiz {category} de Melody Mind ({difficulty}) !",
    chronologyScoreText:
      "J'ai obtenu {score} points dans le jeu de chronologie {category} de Melody Mind ({difficulty}) !",
    challenge: "Tu penses pouvoir me battre ? Joue maintenant sur :",
  },
  it: {
    musicGenius: "🎵 Genio musicale! 🎵",
    musicPro: "🎧 Professionista della musica! 🎧",
    musicEnthusiast: "🎸 Appassionato di musica! 🎸",
    musicLover: "🎹 Amante della musica! 🎹",
    musicExplorer: "🎼 Esploratore musicale! 🎼",
    scoreText: "Ho ottenuto {score} punti nel quiz {category} di Melody Mind ({difficulty})!",
    chronologyScoreText:
      "Ho ottenuto {score} punti nel gioco di cronologia {category} di Melody Mind ({difficulty})!",
    challenge: "Pensi di potermi battere? Gioca ora su:",
  },
  pt: {
    musicGenius: "🎵 Gênio musical! 🎵",
    musicPro: "🎧 Profissional da música! 🎧",
    musicEnthusiast: "🎸 Entusiasta da música! 🎸",
    musicLover: "🎹 Amante da música! 🎹",
    musicExplorer: "🎼 Explorador musical! 🎼",
    scoreText: "Consegui {score} pontos no quiz de {category} do Melody Mind ({difficulty})!",
    chronologyScoreText:
      "Consegui {score} pontos no jogo de cronologia de {category} do Melody Mind ({difficulty})!",
    challenge: "Acha que consegue me superar? Jogue agora em:",
  },
  da: {
    musicGenius: "🎵 Musikgeni! 🎵",
    musicPro: "🎧 Musikprofessionel! 🎧",
    musicEnthusiast: "🎸 Musikentusiast! 🎸",
    musicLover: "🎹 Musikelsker! 🎹",
    musicExplorer: "🎼 Musikopdager! 🎼",
    scoreText: "Jeg opnåede {score} point i Melody Mind's {category} quiz ({difficulty})!",
    chronologyScoreText:
      "Jeg opnåede {score} point i Melody Mind's {category} kronologi-spil ({difficulty})!",
    challenge: "Tror du, du kan slå mig? Spil nu på:",
  },
  nl: {
    musicGenius: "🎵 Muziekgenie! 🎵",
    musicPro: "🎧 Muziekprofessional! 🎧",
    musicEnthusiast: "🎸 Muziekliefhebber! 🎸",
    musicLover: "🎹 Muziekminnaar! 🎹",
    musicExplorer: "🎼 Muziekontdekker! 🎼",
    scoreText: "Ik heb {score} punten gescoord in de Melody Mind {category} quiz ({difficulty})!",
    chronologyScoreText:
      "Ik heb {score} punten gescoord in het Melody Mind {category} chronologie-spel ({difficulty})!",
    challenge: "Denk je dat je me kunt verslaan? Speel nu op:",
  },
  sv: {
    musicGenius: "🎵 Musikgeni! 🎵",
    musicPro: "🎧 Musikproffs! 🎧",
    musicEnthusiast: "🎸 Musikentusiast! 🎸",
    musicLover: "🎹 Musikälskare! 🎹",
    musicExplorer: "🎼 Musikupptäckare! 🎼",
    scoreText: "Jag fick {score} poäng i Melody Minds {category} quiz ({difficulty})!",
    chronologyScoreText:
      "Jag fick {score} poäng i Melody Minds {category} kronologi-spel ({difficulty})!",
    challenge: "Tror du att du kan slå mig? Spela nu på:",
  },
  fi: {
    musicGenius: "🎵 Musiikkinero! 🎵",
    musicPro: "🎧 Musiikkiammattilainen! 🎧",
    musicEnthusiast: "🎸 Musiikkientusiasti! 🎸",
    musicLover: "🎹 Musiikinrakastaja! 🎹",
    musicExplorer: "🎼 Musiikintukija! 🎼",
    scoreText: "Sain {score} pistettä Melody Mindin {category} -visailussa ({difficulty})!",
    chronologyScoreText:
      "Sain {score} pistettä Melody Mindin {category} kronologia-pelissä ({difficulty})!",
    challenge: "Luuletko voittavasi minut? Pelaa nyt osoitteessa:",
  },
  cn: {
    musicGenius: "🎵 音乐天才！🎵",
    musicPro: "🎧 音乐专家！🎧",
    musicEnthusiast: "🎸 音乐爱好者！🎸",
    musicLover: "🎹 音乐迷！🎹",
    musicExplorer: "🎼 音乐探索者！🎼",
    scoreText: "我在 Melody Mind 的 {category} 测验中获得了 {score} 分 ({difficulty})！",
    chronologyScoreText:
      "我在 Melody Mind 的 {category} 年代记游戏中获得了 {score} 分 ({difficulty})！",
    challenge: "你认为你能击败我吗？现在就来挑战：",
  },
  jp: {
    musicGenius: "🎵 音楽の天才！🎵",
    musicPro: "🎧 音楽プロ！🎧",
    musicEnthusiast: "🎸 音楽愛好家！🎸",
    musicLover: "🎹 音楽愛好者！🎹",
    musicExplorer: "🎼 音楽探検家！🎼",
    scoreText: "Melody Mind の {category} クイズで {score} ポイント獲得しました ({difficulty})！",
    chronologyScoreText:
      "Melody Mind の {category} 年代記ゲームで {score} ポイント獲得しました ({difficulty})！",
    challenge: "私に勝てると思いますか？今すぐプレイ：",
  },
  ru: {
    musicGenius: "🎵 Музыкальный гений! 🎵",
    musicPro: "🎧 Музыкальный профи! 🎧",
    musicEnthusiast: "🎸 Музыкальный энтузиаст! 🎸",
    musicLover: "🎹 Любитель музыки! 🎹",
    musicExplorer: "🎼 Музыкальный исследователь! 🎼",
    scoreText: "Я набрал {score} очков в викторине {category} от Melody Mind ({difficulty})!",
    chronologyScoreText:
      "Я набрал {score} очков в хронологической игре {category} от Melody Mind ({difficulty})!",
    challenge: "Думаешь, сможешь меня победить? Играй сейчас:",
  },
  uk: {
    musicGenius: "🎵 Музичний геній! 🎵",
    musicPro: "🎧 Музичний професіонал! 🎧",
    musicEnthusiast: "🎸 Музичний ентузіаст! 🎸",
    musicLover: "🎹 Любитель музики! 🎹",
    musicExplorer: "🎼 Музичний дослідник! 🎼",
    scoreText: "Я набрав {score} очок у вікторині {category} від Melody Mind ({difficulty})!",
    chronologyScoreText:
      "Я набрав {score} очок у хронологічній грі {category} від Melody Mind ({difficulty})!",
    challenge: "Думаєш, зможеш мене перемогти? Грай зараз:",
  },
};

/**
 * Maps difficulty levels to visual emoji indicators
 */
const DIFFICULTY_EMOJIS: Record<string, string> = {
  easy: "🟢",
  medium: "🟡",
  hard: "🔴",
  default: "⚪️",
};

// Centralized score thresholds & achievement IDs now provided via resolveAchievement()

/**
 * Gets the current language from the HTML document
 *
 * @returns {string} The current language code or 'en' as default
 */
function getCurrentLanguage(): string {
  const lang = document.documentElement.lang;
  return isLanguageSupported(lang) ? lang : "en";
}

/**
 * Checks if a language is supported in our translations
 *
 * @param {string} language - Language code to check
 * @returns {boolean} True if language is supported
 */
function isLanguageSupported(language: string): boolean {
  return Boolean(language && shareTextTranslations[language]);
}

/**
 * Formats text by replacing placeholders with actual values
 *
 * @param {string} template - Text template with {placeholders}
 * @param {Record<string, string>} values - Values to replace placeholders
 * @returns {string} Formatted text with placeholders replaced
 */
function formatText(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, value),
    template
  );
}

/**
 * Gets the appropriate achievement text based on score
 *
 * @param {number} score - Player's score
 * @param {ShareTextTranslations} translations - Text translations to use
 * @returns {string} Achievement text
 */
function getAchievementText(score: number, translations: ShareTextTranslations): string {
  const tier = resolveAchievement(score);
  switch (tier.id) {
    case "genius":
      return translations.musicGenius;
    case "pro":
      return translations.musicPro;
    case "enthusiast":
      return translations.musicEnthusiast;
    case "lover":
      return translations.musicLover;
    default:
      return translations.musicExplorer; // explorer fallback
  }
}

/**
 * Gets the emoji for a difficulty level
 *
 * @param {GameDifficulty} difficulty - Difficulty level
 * @returns {string} Emoji representing the difficulty
 */
function getDifficultyEmoji(difficulty: GameDifficulty): string {
  return DIFFICULTY_EMOJIS[difficulty.toLowerCase()] || DIFFICULTY_EMOJIS.default;
}

/**
 * Generates an engaging share text based on player performance metrics
 * in the user's current language
 *
 * @param {ShareData} data - Player's score data
 * @returns {string} A formatted share text
 */
function generateShareText(data: ShareData): string {
  const lang = getCurrentLanguage();
  const translations = shareTextTranslations[lang];

  // Fallback to English if no translation is available
  if (!translations) {
    return generateShareTextWithTranslations(data, shareTextTranslations.en);
  }

  return generateShareTextWithTranslations(data, translations);
}

/**
 * Generates share text for a specific language
 *
 * @param {ShareData} data - Player's score data
 * @param {string} language - Language code (e.g., 'de', 'en', 'fr')
 * @returns {string} A formatted share text in the specified language
 */
export function generateShareTextForLanguage(data: ShareData, language: string): string {
  const translations = shareTextTranslations[language];

  // Fallback to English if no translation is available
  if (!translations) {
    return generateShareTextWithTranslations(data, shareTextTranslations.en);
  }

  return generateShareTextWithTranslations(data, translations);
}

/**
 * Generates share text using specific translations
 *
 * @param {ShareData} data - Player's score data
 * @param {ShareTextTranslations} translations - Translations to use
 * @returns {string} Formatted share text
 */
function generateShareTextWithTranslations(
  data: ShareData,
  translations: ShareTextTranslations
): string {
  // Get achievement text based on score
  const achievement = getAchievementText(data.score, translations);

  // Format difficulty with emoji
  const difficultyEmoji = getDifficultyEmoji(data.difficulty);
  const formattedDifficulty = `${difficultyEmoji} ${data.difficulty}`;

  // Choose the appropriate score text based on game mode
  const isChronologyMode = data.mode === "chronology";
  const scoreTextTemplate = isChronologyMode
    ? translations.chronologyScoreText
    : translations.scoreText;

  // Format score text
  const scoreText = formatText(scoreTextTemplate, {
    score: data.score.toString(),
    category: data.category,
    difficulty: formattedDifficulty,
  });

  // Combine all text components
  return `${achievement}\n\n${scoreText}\n\n${translations.challenge}`;
}

/**
 * Shares the game score to different platforms
 *
 * @param {SharingPlatform} platform - The platform to share to (twitter, whatsapp, email)
 * @param {ShareData} data - The game data to share
 * @throws {Error} Throws if platform is unsupported or sharing fails
 * @returns {Promise<boolean>} Promise resolving to true if sharing was successful
 */
export async function shareScore(platform: SharingPlatform, data: ShareData): Promise<boolean> {
  try {
    const shareText = generateShareText(data);
    const shareUrl = window.location.href;

    switch (platform) {
      case "twitter": {
        return openShareWindow(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        );
      }

      case "whatsapp": {
        return openShareWindow(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
        );
      }

      case "email": {
        const subject = encodeURIComponent("Melody Mind Score!");
        return openShareWindow(
          `mailto:?subject=${subject}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
        );
      }

      default:
        return false;
    }
  } catch (error) {
    handleGameError(error, `sharing to ${platform}`);
    return false;
  }
}

/**
 * Opens a share URL in a new window
 *
 * @param {string} url - URL to open
 * @returns {boolean} True if window was opened successfully
 */
function openShareWindow(url: string): boolean {
  try {
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  } catch (error) {
    handleGameError(error, "share window opening");
    return false;
  }
}
