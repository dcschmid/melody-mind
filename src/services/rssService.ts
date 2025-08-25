/**
 * RSS News Service
 * Aggregates music news from multiple RSS feeds with caching
 */

import { RSS_FEED_SOURCES, FALLBACK_FEEDS, type FeedSource } from "../utils/rss/feedSources.ts";

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  language: string;
  imageUrl?: string; // Optional image URL from RSS feed
}

export interface NewsResponse {
  items: NewsItem[];
  lastUpdated: string;
  totalSources: number;
  language: string;
}

/**
 * Simple in-memory cache without Redis
 * Cache duration: 5 minutes
 */
class NewsCache {
  private cache = new Map<string, { data: NewsResponse; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  get(key: string): NewsResponse | null {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  set(key: string, data: NewsResponse): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

const newsCache = new NewsCache();

/**
 * Extract image URL from RSS item XML
 */
function extractImageFromRssItem(itemXml: string, description: string): string | undefined {
  // Priority order for image extraction
  const extractionMethods = [
    // 1. RSS enclosure tag (highest priority for RSS feeds)
    () => {
      const enclosureMatch = itemXml.match(
        /<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["'][^"']*image[^"']*["'][^>]*>/i
      );
      if (enclosureMatch) {
        return enclosureMatch[1];
      }

      // Try enclosure with any type if it's an image URL
      const anyEnclosureMatch = itemXml.match(
        /<enclosure[^>]+url=["']([^"']+\.(jpg|jpeg|png|gif|webp|svg))["'][^>]*>/i
      );
      if (anyEnclosureMatch) {
        return anyEnclosureMatch[1];
      }

      return null;
    },

    // 2. Media RSS namespace
    () => {
      const mediaContentMatch = itemXml.match(/<media:content[^>]+url=["']([^"']+)["'][^>]*>/i);
      if (mediaContentMatch) {
        return mediaContentMatch[1];
      }

      const mediaThumbnailMatch = itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["'][^>]*>/i);
      if (mediaThumbnailMatch) {
        return mediaThumbnailMatch[1];
      }

      return null;
    },

    // 3. OpenGraph and Twitter meta tags
    () => {
      const ogImageMatch = itemXml.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i
      );
      if (ogImageMatch) {
        return ogImageMatch[1];
      }

      const twitterImageMatch = itemXml.match(
        /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i
      );
      if (twitterImageMatch) {
        return twitterImageMatch[1];
      }

      return null;
    },

    // 4. Extract from description/content
    () => extractImageFromDescription(description),

    // 5. Look for img tags in the item content
    () => {
      const imgMatch = itemXml.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
      if (imgMatch) {
        return imgMatch[1];
      }

      return null;
    },

    // 6. iTunes image (for podcast feeds)
    () => {
      const itunesImageMatch = itemXml.match(/<itunes:image[^>]+href=["']([^"']+)["'][^>]*>/i);
      if (itunesImageMatch) {
        return itunesImageMatch[1];
      }

      return null;
    },

    // 7. Look for any image URL in the entire content
    () => {
      const urlMatch = itemXml.match(
        /https?:\/\/[^"'\s<>]+\.(jpg|jpeg|png|gif|webp|svg)(\?[^"'\s<>]*)?["']?/i
      );
      if (urlMatch) {
        return urlMatch[0].replace(/["']$/, "");
      }

      return null;
    },
  ];

  // Try extraction methods in priority order
  for (let i = 0; i < extractionMethods.length; i++) {
    try {
      const result = extractionMethods[i]();
      if (result && result.trim() && isValidImageUrl(result.trim())) {
        const cleanedUrl = cleanImageUrl(result.trim());
        return cleanedUrl;
      }
    } catch (error) {}
  }

  return undefined;
}

/**
 * Validate if URL looks like a valid image URL
 */
function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Must be HTTP or HTTPS
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }

    // Check for image file extensions
    const path = parsed.pathname.toLowerCase();
    const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(path);

    // Check for common image hosting patterns
    const isImageHost =
      /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(url) ||
      url.includes("image") ||
      url.includes("photo") ||
      url.includes("picture") ||
      url.includes("thumbnail") ||
      url.includes("avatar");

    return hasImageExtension || isImageHost;
  } catch {
    return false;
  }
}

/**
 * Clean and normalize image URL
 */
function cleanImageUrl(url: string): string {
  // Remove common tracking parameters
  const cleanUrl = url.replace(/[?&](utm_[^&]*|fbclid|gclid|_ga|_gl)/g, "");

  // Remove trailing query parameters that are just ?
  return cleanUrl.replace(/\?$/, "");
}

/**
 * Parse single RSS item into NewsItem
 */
function parseRssItem(
  itemXml: string,
  feedSource: FeedSource,
  feedImage?: string
): NewsItem | null {
  try {
    const title = extractXmlContent(itemXml, "title") || "";
    const description = extractXmlContent(itemXml, "description") || "";
    const link = extractXmlContent(itemXml, "link") || "";
    const pubDate = extractXmlContent(itemXml, "pubDate") || new Date().toISOString();

    if (!title || !link) {
      return null;
    }

    const imageUrl = extractImageFromRssItem(itemXml, description) || feedImage;

    return {
      id: generateItemId(link, title),
      title: cleanText(title),
      description: cleanText(description),
      link,
      pubDate: standardizePubDate(pubDate),
      source: feedSource.name,
      language: feedSource.language,
      imageUrl,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Extract feed-level image (fallback for items without images)
 */
function extractFeedImage(xmlText: string): string | undefined {
  // Try to find feed-level image
  const imageMatch = xmlText.match(/<image[^>]*>[\s\S]*?<url[^>]*>([^<]+)<\/url>/i);
  if (imageMatch) {
    return imageMatch[1].trim();
  }

  // Try other feed image formats
  const ogImageMatch = xmlText.match(/<og:image[^>]*>([^<]+)<\/og:image>/i);
  if (ogImageMatch) {
    return ogImageMatch[1].trim();
  }

  return undefined;
}

// Removed generatePlaceholderImage - using client-side fallback system instead

/**
 * Parse RSS feed and extract news items
 */
async function parseFeed(feedSource: FeedSource): Promise<NewsItem[]> {
  try {
    const response = await fetch(feedSource.url, {
      headers: {
        "User-Agent": "MelodyMind Music Quiz App (https://melody-mind.de)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      // Add timeout for better error handling
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      return [];
    }

    const xmlText = await response.text();

    // Check if we got valid XML content
    if (!xmlText || xmlText.length < 100) {
      return [];
    }

    const feedImage = extractFeedImage(xmlText);
    const itemMatches = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];

    return itemMatches
      .map((itemXml) => parseRssItem(itemXml, feedSource, feedImage))
      .filter((item): item is NewsItem => item !== null);
  } catch (error) {
    return [];
  }
}

/**
 * Extract content from XML tags
 */
function extractXmlContent(xml: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = xml.match(regex);
  if (!match) {
    return null;
  }

  // Remove CDATA and decode HTML entities
  let content = match[1];
  content = content.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  content = decodeHtmlEntities(content);

  // For enclosure tags, extract URL attribute
  if (tagName === "enclosure") {
    const urlMatch = content.match(/url=["']([^"']+)["']/i);
    if (urlMatch) {
      return urlMatch[1];
    }
  }

  content = content.replace(/<[^>]*>/g, ""); // Remove HTML tags

  return content.trim();
}

/**
 * Comprehensive HTML entity decoder
 */
function decodeHtmlEntities(text: string): string {
  // Common HTML entities mapping
  const htmlEntities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'",
    "&#39;": "'",
    "&#x27;": "'",
    "&#8217;": "'", // Right single quotation mark
    "&#8216;": "'", // Left single quotation mark
    "&#8220;": '"', // Left double quotation mark
    "&#8221;": '"', // Right double quotation mark
    "&#8211;": "–", // En dash
    "&#8212;": "—", // Em dash
    "&#8230;": "…", // Horizontal ellipsis
    "&#8482;": "™", // Trade mark sign
    "&#169;": "©", // Copyright sign
    "&#174;": "®", // Registered sign
    "&#8364;": "€", // Euro sign
    "&#163;": "£", // Pound sign
    "&#165;": "¥", // Yen sign
    "&#8804;": "≤", // Less-than or equal to
    "&#8805;": "≥", // Greater-than or equal to
    "&#8800;": "≠", // Not equal to
    "&#8734;": "∞", // Infinity
    "&#8594;": "→", // Rightwards arrow
    "&#8592;": "←", // Leftwards arrow
    "&nbsp;": " ", // Non-breaking space
    "&hellip;": "…",
    "&mdash;": "—",
    "&ndash;": "–",
    "&lsquo;": "'",
    "&rsquo;": "'",
    "&ldquo;": '"',
    "&rdquo;": '"',
    "&trade;": "™",
    "&copy;": "©",
    "&reg;": "®",
    "&euro;": "€",
    "&pound;": "£",
    "&yen;": "¥",
  };

  // Replace common entities first
  let decoded = text;
  for (const [entity, replacement] of Object.entries(htmlEntities)) {
    decoded = decoded.replace(new RegExp(entity, "g"), replacement);
  }

  // Handle numeric character references (&#123; and &#xAB;)
  decoded = decoded.replace(/&#(\d+);/g, (match, code) => {
    try {
      const charCode = parseInt(code, 10);
      if (charCode > 0 && charCode < 1114112) {
        // Valid Unicode range
        return String.fromCharCode(charCode);
      }
    } catch {}
    return match; // Return original if conversion fails
  });

  // Handle hexadecimal character references (&#xAB;)
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, code) => {
    try {
      const charCode = parseInt(code, 16);
      if (charCode > 0 && charCode < 1114112) {
        // Valid Unicode range
        return String.fromCharCode(charCode);
      }
    } catch {}
    return match; // Return original if conversion fails
  });

  return decoded;
}

// Removed relevance score calculation for development

/**
 * Generate unique ID for news item
 */
function generateItemId(link: string, title: string): string {
  const combinedText = link + title;
  let hash = 0;
  for (let i = 0; i < combinedText.length; i++) {
    const char = combinedText.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Extract image URL from HTML description content
 */
function extractImageFromDescription(description: string): string | undefined {
  if (!description) {
    return undefined;
  }

  // Decode HTML entities in description first
  const decodedDescription = decodeHtmlEntities(description);

  const extractionMethods = [
    // 1. IMG tags with src attribute
    () => {
      const imgMatches = decodedDescription.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
      if (imgMatches) {
        // Find the largest image (likely to be main content image)
        for (const match of imgMatches) {
          const srcMatch = match.match(/src=["']([^"']+)["']/i);
          if (srcMatch && isValidImageUrl(srcMatch[1])) {
            return srcMatch[1];
          }
        }
      }
      return null;
    },

    // 2. Background images in style attributes
    () => {
      const bgMatch = decodedDescription.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
      if (bgMatch && isValidImageUrl(bgMatch[1])) {
        return bgMatch[1];
      }
      return null;
    },

    // 3. Figure/picture elements
    () => {
      const figureMatch = decodedDescription.match(
        /<figure[^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["'][^>]*>[\s\S]*?<\/figure>/i
      );
      if (figureMatch && isValidImageUrl(figureMatch[1])) {
        return figureMatch[1];
      }
      return null;
    },

    // 4. Data attributes (data-src, data-lazy-src, etc.)
    () => {
      const dataSrcMatch = decodedDescription.match(
        /<img[^>]+data-(?:src|lazy-src|original)=["']([^"']+)["'][^>]*>/i
      );
      if (dataSrcMatch && isValidImageUrl(dataSrcMatch[1])) {
        return dataSrcMatch[1];
      }
      return null;
    },

    // 5. Any direct image URLs in text
    () => {
      const urlMatches = decodedDescription.match(
        /https?:\/\/[^"'\s<>]+\.(jpg|jpeg|png|gif|webp|svg)(\?[^"'\s<>]*)?/gi
      );
      if (urlMatches) {
        for (const url of urlMatches) {
          const cleanUrl = url.replace(/["'\s<>].*$/, "");
          if (isValidImageUrl(cleanUrl)) {
            return cleanUrl;
          }
        }
      }
      return null;
    },
  ];

  // Try extraction methods in priority order
  for (const method of extractionMethods) {
    try {
      const result = method();
      if (result) {
        return cleanImageUrl(result);
      }
    } catch (error) {}
  }

  return undefined;
}

/**
 * Clean and normalize text content
 */
function cleanText(text: string): string {
  if (!text) {
    return "";
  }

  // First decode HTML entities
  let cleaned = decodeHtmlEntities(text);

  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, " ");

  // Remove extra whitespace and normalize
  cleaned = cleaned
    .replace(/\s+/g, " ")
    .replace(/[\r\n\t]/g, " ")
    .trim();

  // Remove common unwanted phrases
  cleaned = cleaned
    .replace(/^(Read more|Continue reading|Click here|More info)[:\s]*/i, "")
    .replace(/\[…\]$/, "…")
    .replace(/\s*\.\.\.\s*$/, "…");

  // Limit length but try to break at word boundaries
  if (cleaned.length > 500) {
    const truncated = cleaned.substring(0, 500);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 400) {
      cleaned = `${truncated.substring(0, lastSpace)}…`;
    } else {
      cleaned = `${truncated}…`;
    }
  }

  return cleaned;
}

/**
 * Standardize publication date format
 */
function standardizePubDate(pubDate: string): string {
  try {
    const date = new Date(pubDate);
    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Get news for a specific language
 */
export async function getNewsForLanguage(language: string): Promise<NewsResponse> {
  // Check cache first
  const cacheKey = `news_${language}`;
  const cached = newsCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const feeds = RSS_FEED_SOURCES[language] || [];
  const sources = feeds.length > 0 ? feeds : FALLBACK_FEEDS;

  // Fetch from multiple sources in parallel
  const promises = sources.map((source) => parseFeed(source));
  const results = await Promise.all(promises);

  // Combine and sort results
  const allItems = results.flat();

  // If no items found, try fallback to English feeds
  if (allItems.length === 0 && language !== "en") {
    const englishFeeds = RSS_FEED_SOURCES["en"] || [];
    const englishPromises = englishFeeds.map((source) => parseFeed(source));
    const englishResults = await Promise.all(englishPromises);
    const englishItems = englishResults.flat();

    allItems.push(...englishItems);
  }

  // Sort by publication date (newer is better)
  allItems.sort((a, b) => {
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  // Limit to top 50 most relevant items
  const topItems = allItems.slice(0, 50);

  const newsResponse: NewsResponse = {
    items: topItems,
    lastUpdated: new Date().toISOString(),
    totalSources: sources.length,
    language,
  };

  // Cache the result
  newsCache.set(cacheKey, newsResponse);

  return newsResponse;
}

/**
 * Get trending topics from recent news
 */
export async function getTrendingTopics(language: string): Promise<string[]> {
  const news = await getNewsForLanguage(language);
  const words = new Map<string, number>();

  // Extract words from titles
  for (const item of news.items.slice(0, 10)) {
    // Only from top 10 items
    const titleWords = item.title
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3); // Only words longer than 3 characters

    for (const word of titleWords) {
      words.set(word, (words.get(word) || 0) + 1);
    }
  }

  // Return top 5 trending words
  return Array.from(words.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

/**
 * Search news items by query
 */
export async function searchNews(language: string, query: string): Promise<NewsItem[]> {
  const news = await getNewsForLanguage(language);
  const searchTerms = query.toLowerCase().split(/\s+/);

  return news.items.filter((item) => {
    const searchText = `${item.title} ${item.description}`.toLowerCase();
    return searchTerms.some((term) => searchText.includes(term));
  });
}

/**
 * Clear news cache (useful for testing or manual refresh)
 */
export function clearNewsCache(): void {
  newsCache.clear();
}
