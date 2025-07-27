/**
 * Dynamic RSS Feed Endpoint for MelodyMind Podcasts
 * 
 * Generates language-specific RSS feeds for podcast episodes
 * URL: /[lang]/podcasts/rss.xml
 * 
 * @author Daniel Schmid <dcschmid@murena.io>
 */

import type { APIRoute } from 'astro';
import { generatePodcastRSSFeed } from '../../../services/podcastRssService';
import type { PodcastData } from '../../../types/podcast';

// Import all podcast data
import dePodcastsJson from '../../../data/podcasts/de.json';
import enPodcastsJson from '../../../data/podcasts/en.json';
import frPodcastsJson from '../../../data/podcasts/fr.json';
import itPodcastsJson from '../../../data/podcasts/it.json';
import esPodcastsJson from '../../../data/podcasts/es.json';
import ptPodcastsJson from '../../../data/podcasts/pt.json';
import daPodcastsJson from '../../../data/podcasts/da.json';
import nlPodcastsJson from '../../../data/podcasts/nl.json';
import svPodcastsJson from '../../../data/podcasts/sv.json';
import fiPodcastsJson from '../../../data/podcasts/fi.json';
import cnPodcastsJson from '../../../data/podcasts/cn.json';
import ruPodcastsJson from '../../../data/podcasts/ru.json';
import jpPodcastsJson from '../../../data/podcasts/jp.json';
import ukPodcastsJson from '../../../data/podcasts/uk.json';

/**
 * Load podcast data for a specific language with fallback
 */
async function loadPodcastsForLanguage(language: string): Promise<PodcastData[]> {
  const podcastDataMap = {
    en: enPodcastsJson.podcasts,
    de: dePodcastsJson.podcasts,
    fr: frPodcastsJson.podcasts,
    it: itPodcastsJson.podcasts,
    es: esPodcastsJson.podcasts,
    pt: ptPodcastsJson.podcasts,
    da: daPodcastsJson.podcasts,
    nl: nlPodcastsJson.podcasts,
    sv: svPodcastsJson.podcasts,
    fi: fiPodcastsJson.podcasts,
    cn: cnPodcastsJson.podcasts,
    ru: ruPodcastsJson.podcasts,
    jp: jpPodcastsJson.podcasts,
    uk: ukPodcastsJson.podcasts,
  };

  const podcasts = podcastDataMap[language as keyof typeof podcastDataMap];
  return Array.isArray(podcasts) ? podcasts : [];
}

/**
 * Generate static paths for all supported languages
 */
export async function getStaticPaths() {
  const supportedLanguages = [
    'de', 'en', 'es', 'fr', 'it', 'pt', 
    'da', 'nl', 'sv', 'fi', 'cn', 'ru', 'jp', 'uk'
  ];

  return supportedLanguages.map(lang => ({
    params: { lang }
  }));
}

/**
 * RSS Feed API Route Handler
 */
export const GET: APIRoute = async ({ params, request }) => {
  try {
    const lang = params.lang as string;
    
    // Validate language parameter
    const supportedLanguages = [
      'de', 'en', 'es', 'fr', 'it', 'pt', 
      'da', 'nl', 'sv', 'fi', 'cn', 'ru', 'jp', 'uk'
    ];
    
    if (!supportedLanguages.includes(lang)) {
      return new Response('Language not supported', { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Load podcast episodes for the language
    const episodes = await loadPodcastsForLanguage(lang);
    
    if (episodes.length === 0) {
      // Return empty but valid RSS feed if no episodes
      const emptyRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>MelodyMind Podcast - ${lang.toUpperCase()}</title>
    <description>No episodes available yet</description>
    <link>https://melody-mind.de/${lang}/podcasts</link>
    <language>${lang}</language>
  </channel>
</rss>`;
      
      return new Response(emptyRSS, {
        status: 200,
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=1800, s-maxage=3600', // 30min cache, 1h CDN
          'X-Episode-Count': '0'
        }
      });
    }

    // Generate RSS feed
    const rssXML = generatePodcastRSSFeed(lang, episodes);
    
    // Get base URL from request
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    
    // Replace placeholder baseUrl if needed
    const finalRSS = rssXML.replace(/https:\/\/melody-mind\.de/g, baseUrl);

    return new Response(finalRSS, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=3600', // 30min browser, 1h CDN
        'X-Episode-Count': episodes.filter(ep => ep.isAvailable).length.toString(),
        'X-Language': lang,
        'X-Generated-At': new Date().toISOString(),
        // CORS headers for cross-origin requests
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error(`RSS Feed generation failed for language ${params.lang}:`, error);
    
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
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Short cache for errors
      }
    });
  }
};

// Enable static generation for better performance
export const prerender = true;