
/**
 * Dynamic RSS Feed Endpoint for MelodyMind Podcasts
 *
 * Generates language-specific RSS feeds for podcast episodes
 * URL: /[lang]/podcasts/rss.xml
 *
 * @author Daniel Schmid <dcschmid@murena.io>
 */

import type { APIRoute } from "astro";

import enPodcastsJson from "../../../data/podcasts/en.json";
import { generatePodcastRSSFeed } from "../../../services/podcastRssService";
import type { PodcastData } from "../../../types/podcast";
import { handleGameError } from "../../../utils/error/errorHandlingUtils";

// Import all podcast data

/**
 * Load podcast data for a specific language with fallback
 */
async function loadPodcastsForLanguage(language: string): Promise<PodcastData[]> {
  const podcastDataMap = {
    en: enPodcastsJson.podcasts,
  };

  const podcasts = podcastDataMap[language as keyof typeof podcastDataMap];
  return Array.isArray(podcasts) ? podcasts : [];
}

/**
 * Generate static paths for all supported languages
 */
export async function getStaticPaths(): Promise<{ params: { lang: string } }[]> {
  const supportedLanguages = ["en"];

  return supportedLanguages.map((lang) => ({
    params: { lang },
  }));
}

/**
 * RSS Feed API Route Handler
 */
export const GET: APIRoute = async ({ params, request }) => {
  try {
    const lang = params.lang as string;

    // Validate language parameter
    const supportedLanguages = ["en"];

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
      const titleByLang: Record<string, string> = {
        en: "The Melody Mind Podcast",
      };

      const emptyRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${titleByLang[lang] || `MelodyMind Podcast - ${lang.toUpperCase()}`}</title>
    <description>No episodes available yet</description>
    <link>https://melody-mind.de/${lang}/podcasts</link>
    <language>${lang}</language>
    <itunes:author>MelodyMind</itunes:author>
    <itunes:summary>No episodes available yet</itunes:summary>
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
