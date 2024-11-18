/**
 * Interface for sharing game results on social media
 * @interface ShareData
 * @property {number} score - The player's achieved score
 * @property {string} category - The quiz category/genre
 * @property {string} difficulty - The difficulty level played
 */
interface ShareData {
  score: number;
  category: string;
  difficulty: string;
}

/**
 * Shares the game score on selected social media platform
 * @param {string} platform - The social media platform to share on
 * @param {ShareData} data - The game data to be shared
 * @returns {void}
 *
 * @example
 * shareScore('facebook', {
 *   score: 750,
 *   category: 'Rock',
 *   difficulty: 'hard'
 * });
 */
export function shareScore(platform: string, data: ShareData): void {
  const message = generateShareMessage(data);
  const url = window.location.origin;

  // Define sharing URLs for different platforms
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(message)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(message + " " + url)}`,
  };

  const shareUrl = shareUrls[platform as keyof typeof shareUrls];

  if (shareUrl) {
    openShareWindow(shareUrl);
  }
}

/**
 * Generates a formatted share message including score, category, and difficulty
 * @param {ShareData} data - The game data to generate the message from
 * @returns {string} Formatted message with emojis
 * @private
 */
function generateShareMessage(data: ShareData): string {
  const emoji = getScoreEmoji(data.score);
  return `${emoji} Ich habe gerade ${data.score} Punkte im ${data.category}-Quiz (${data.difficulty}) bei MelodyMind erreicht! Kannst du das toppen? ${emoji}`;
}

/**
 * Determines the appropriate emoji based on the score
 * @param {number} score - The player's score
 * @returns {string} An emoji representing the achievement level
 * @private
 *
 * @example
 * getScoreEmoji(950) // returns "🏆"
 * getScoreEmoji(600) // returns "🎵"
 */
function getScoreEmoji(score: number): string {
  if (score >= 900) return "🏆"; // Trophy for excellent scores
  if (score >= 700) return "🌟"; // Star for great scores
  if (score >= 500) return "🎵"; // Musical note for good scores
  return "🎮";                   // Game controller for other scores
}

/**
 * Opens a centered popup window for social media sharing
 * @param {string} url - The sharing URL to open
 * @returns {void}
 * @private
 *
 * @description
 * Opens a centered popup window with the following dimensions:
 * - Width: 600px
 * - Height: 400px
 * - Centered on screen
 * - No toolbar, location bar, or status bar
 */
function openShareWindow(url: string): void {
  const width = 600;
  const height = 400;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  window.open(
    url,
    "share-dialog",
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no`,
  );
}
