/**
 * Dynamic RSS Feed Endpoint for MelodyMind Podcasts
 *
 * Generates language-specific RSS feeds for podcast episodes
 * URL: /[lang]/podcasts/rss.xml
 *
 * @author Daniel Schmid <dcschmid@murena.io>
 */

import { FALLBACK_LANGUAGE, normalizeLanguage } from "@constants/i18n";
import type { APIRoute } from "astro";

import enPodcastsJson from "../../../data/podcasts/en.json";
import { languages } from "../../../i18n/ui"; // All supported UI languages
import { generatePodcastRSSFeed, getPodcastChannelMetadata } from "../../../services/podcastRssService";
import type { PodcastData } from "../../../types/podcast";
import { handleGameError } from "../../../utils/error/errorHandlingUtils";
import { useTranslations } from "../../../utils/i18n";

// Import all podcast data

/**
 * Load podcast data for a specific language with fallback.
 *
 * Currently only English podcast JSON is available. For other supported UI languages
 * we intentionally return an empty array so the route produces a valid but empty
 * language-specific RSS feed (with translated metadata strings). This preserves
 * predictable URLs (/de/podcasts/rss.xml, /es/podcasts/rss.xml, etc.) and allows
 * future localization to start returning episodes without additional routing changes.
 *
 * If in the future localized podcast data sets become available, extend the
 * podcastDataMap below with additional imports keyed by their language codes.
 */
async function loadPodcastsForLanguage(language: string): Promise<PodcastData[]> {
  const podcastDataMap = {
    [FALLBACK_LANGUAGE]: enPodcastsJson.podcasts,
  } as const;

  const langKey =
    language in podcastDataMap ? (language as keyof typeof podcastDataMap) : FALLBACK_LANGUAGE;
  const podcasts = podcastDataMap[langKey];
  return Array.isArray(podcasts) ? (podcasts as PodcastData[]) : [];
}

/**
 * Generate static paths for all supported languages
 */
export async function getStaticPaths(): Promise<{ params: { lang: string } }[]> {
  // Derive supported languages from central i18n source (ui.ts)
  const supportedLanguages = Object.keys(languages);

  return supportedLanguages.map((lang) => ({ params: { lang } }));
}

/**
 * RSS Feed API Route Handler
 */
export const GET: APIRoute = async ({ params, request }) => {
  try {
    const langParam = params.lang as string;
    const lang = normalizeLanguage(langParam);

    // Validate language parameter (derived from i18n configuration)
    const supportedLanguages = Object.keys(languages);
    if (!supportedLanguages.includes(lang)) {
      return new Response("Language not supported", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Load podcast episodes for the language
    const episodes = await loadPodcastsForLanguage(lang);

    if (episodes.length === 0) {
      // Return empty but valid RSS feed if no episodes
      const t = useTranslations(lang);
      const { title } = getPodcastChannelMetadata(lang);
      const description = t("podcast.rss.empty.description") || "No episodes available yet";

      const emptyRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <description>${description}</description>
    <link>https://melody-mind.de/${lang}/podcasts</link>
    <language>${lang}</language>
    <itunes:author>MelodyMind</itunes:author>
    <itunes:summary>${description}</itunes:summary>
    <itunes:owner>
      <itunes:name>Daniel Schmid</itunes:name>
      <itunes:email>dcschmid@murena.io</itunes:email>
    </itunes:owner>
    <itunes:image href="https://melody-mind.de/the-melody-mind-podcast.png"/>
    <itunes:category text="Music">
      <itunes:category text="Music History"/>
    </itunes:category>
    <itunes:explicit>no</itunes:explicit>
    <itunes:type>episodic</itunes:type>
    <atom:link href="https://melody-mind.de/${lang}/podcasts/rss.xml" rel="self" type="application/rss+xml"/>
  </channel>
</rss>`;

      return new Response(emptyRSS, {
        status: 200,
        headers: {
          "Content-Type": "application/rss+xml; charset=utf-8",
          "Cache-Control": "public, max-age=1800, s-maxage=3600", // 30min cache, 1h CDN
          "X-Episode-Count": "0",
        },
      });
    }

    // Generate RSS feed (async)
    const rssXML = await generatePodcastRSSFeed(lang, episodes);

    // Get base URL from request
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Replace placeholder baseUrl if needed
    const finalRSS = rssXML.replace(/https:\/\/melody-mind\.de/g, baseUrl);

    return new Response(finalRSS, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=1800, s-maxage=3600", // 30min browser, 1h CDN
        "X-Episode-Count": episodes.filter((ep) => ep.isAvailable).length.toString(),
        "X-Language": lang,
        "X-Generated-At": new Date().toISOString(),
        // CORS headers for cross-origin requests
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    handleGameError(error, `RSS feed generation for language ${params.lang}`);

    // Return error as valid RSS feed
    const errorRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>MelodyMind Podcast - Error</title>
    <description>RSS feed temporarily unavailable</description>
    <link>https://melody-mind.de/${params.lang}/podcasts</link>
    <language>${params.lang}</language>
    <item>
      <title>Service Temporarily Unavailable</title>
      <description>Please try again later</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>
  </channel>
</rss>`;

    return new Response(errorRSS, {
      status: 500,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=300", // Short cache for errors
      },
    });
  }
};

// Enable static generation for better performance
export const prerender = true;
