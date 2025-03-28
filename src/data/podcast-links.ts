/**
 * Podcast links for German and English versions.
 * Organized by language (de, en) and platform (apple, spotify, deezer, jellypod)
 */
export type PodcastPlatform = "apple" | "spotify" | "deezer" | "jellypod";
export type PodcastLanguage = "de" | "en";

export const podcastLinks: Record<
  PodcastLanguage,
  Record<PodcastPlatform, string>
> = {
  de: {
    apple: "https://podcasts.apple.com/de/podcast/melody-mind/id1805122311",
    spotify: "https://open.spotify.com/show/3rwxwM8Yh4NcnEWmITFf0x",
    deezer: "https://www.deezer.com/de/show/1001758541",
    jellypod: "https://melody-mind.jellypod.ai/",
  },
  en: {
    apple: "https://podcasts.apple.com/de/podcast/melody-mind-en/id1805155921",
    spotify: "https://open.spotify.com/show/3Lxwc4ciAYXAMJdyWUqs45",
    deezer: "https://www.deezer.com/de/show/1001758791", // Hinweis: Der Link scheint identisch mit Spotify zu sein
    jellypod: "https://melody-mind-en.jellypod.ai/",
  },
};

/**
 * Get podcast link for specific language and platform
 * @param language Language code ('de' or 'en')
 * @param platform Platform name ('apple', 'spotify', 'deezer', or 'jellypod')
 * @returns URL as string
 */
export function getPodcastLink(
  language: PodcastLanguage,
  platform: PodcastPlatform,
): string {
  // Fallback to 'en' if language not available
  const lang = language in podcastLinks ? language : "en";
  return podcastLinks[lang][platform];
}

/**
 * Get all podcast links for a specific language
 * @param language Language code ('de' or 'en')
 * @returns Object with platform links
 */
export function getPodcastLinks(
  language: PodcastLanguage,
): Record<PodcastPlatform, string> {
  // Fallback to 'en' if language not available
  const lang = language in podcastLinks ? language : "en";
  return podcastLinks[lang];
}
