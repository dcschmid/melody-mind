/**
 * Podcast RSS Feed Generation Service
 *
 * Generates RFC-compliant RSS 2.0 feeds for MelodyMind podcasts
 * with iTunes, Spotify, and Google Podcasts compatibility.
 *
 * @author Daniel Schmid <dcschmid@murena.io>
 * @version 1.0.0
 */

import type { PodcastData } from "../types/podcast";
import { useTranslations } from "../utils/i18n";

/**
 * RSS podcast item interface
 */
export interface RSSPodcastItem {
  title: string;
  description: string;
  link: string;
  guid: string;
  pubDate: string;
  audioUrl: string;
  audioLength?: number;
  duration?: string;
  imageUrl?: string;
  categories: string[];
  /** Optional rich HTML content for show notes */
  contentHtml?: string;
}

/**
 * RSS channel metadata interface
 */
export interface RSSChannelMeta {
  title: string;
  description: string;
  link: string;
  language: string;
  copyright: string;
  webMaster: string;
  managingEditor: string;
  imageUrl: string;
  category: string;
  explicit: "yes" | "no" | "clean";
  author: string;
  ownerName: string;
  ownerEmail: string;
}

/**
 * Podcast RSS Feed Generator
 */
export class PodcastRSSGenerator {
  private readonly baseUrl: string;
  private readonly contactEmail = "dcschmid@murena.io";
  private readonly podcastImageUrl = "/images/podcast-cover.jpg";

  /**
   * Creates a new RSS generator instance.
   *
   * @param {string} baseUrl - Absolute base URL used to build canonical links in the feed
   */
  constructor(baseUrl: string = "https://melody-mind.de") {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
  }

  /**
   * Generate complete RSS feed for a language
   */
  public generateFeed(lang: string, episodes: PodcastData[]): string {
    const channelMeta = this.generateChannelMeta(lang);
    const items = episodes
      .filter((episode) => episode.isAvailable)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .map((episode) => this.generateItem(episode, lang));

    return this.buildRSSXML(channelMeta, items);
  }

  /**
   * Generate channel metadata for a language
   */
  private generateChannelMeta(lang: string): RSSChannelMeta {
    const t = useTranslations(lang);

    const languageNames: Record<string, string> = {
      de: "Deutsch",
      en: "English",
      es: "Español",
      fr: "Français",
      it: "Italiano",
      pt: "Português",
      da: "Dansk",
      nl: "Nederlands",
      sv: "Svenska",
      fi: "Suomi",
      cn: "中文",
      ru: "Русский",
      jp: "日本語",
      uk: "Українська",
    };

    const languageName = languageNames[lang] || lang.toUpperCase();

    const channelTitleByLang: Record<string, string> = {
      de: "Der Melody Mind Podcast",
      en: "The Melody Mind Podcast",
    };

    return {
      title: channelTitleByLang[lang] || `MelodyMind Podcast - ${languageName}`,
      description:
        t("podcast.rss.description") ||
        "Discover the history of music through engaging podcast episodes covering different eras, genres, and musical movements.",
      link: `${this.baseUrl}/${lang}/podcasts`,
      language: lang,
      copyright: `© ${new Date().getFullYear()} MelodyMind`,
      webMaster: this.contactEmail,
      managingEditor: this.contactEmail,
      imageUrl: `${this.baseUrl}${this.podcastImageUrl}`,
      category: "Music",
      explicit: "clean",
      author: "MelodyMind",
      ownerName: "Daniel Schmid",
      ownerEmail: this.contactEmail,
    };
  }

  /**
   * Generate RSS item from podcast episode
   */
  private generateItem(episode: PodcastData, lang: string): RSSPodcastItem {
    const episodeLink = `${this.baseUrl}/${lang}/podcasts#${episode.id}`;
    const pubDate = this.formatRFC822Date(new Date(episode.publishedAt));

    return {
      title: this.escapeXML(episode.title),
      description: this.escapeXML(episode.description),
      link: episodeLink,
      guid: `melody-mind-${lang}-${episode.id}`,
      pubDate,
      audioUrl: episode.audioUrl,
      audioLength: this.getEstimatedAudioSize(),
      duration: this.getEstimatedDuration(),
      imageUrl: episode.imageUrl ? `${this.baseUrl}${episode.imageUrl}` : undefined,
      categories: ["Music", "Education", "History"],
      contentHtml: episode.showNotesHtml
        ? this.appendDefaultFooter(episode.showNotesHtml)
        : undefined,
    };
  }

  /**
   * Build complete RSS XML
   */
  private buildRSSXML(channelMeta: RSSChannelMeta, items: RSSPodcastItem[]): string {
    const lastBuildDate = this.formatRFC822Date(new Date());

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
     xmlns:spotify="https://developers.spotify.com/documentation/podcasts"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <!-- Basic Channel Info -->
    <title>${channelMeta.title}</title>
    <description>${channelMeta.description}</description>
    <link>${channelMeta.link}</link>
    <language>${channelMeta.language}</language>
    <copyright>${channelMeta.copyright}</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>MelodyMind RSS Generator v1.0.0</generator>
    <webMaster>${channelMeta.webMaster}</webMaster>
    <managingEditor>${channelMeta.managingEditor}</managingEditor>
    
    <!-- Atom Self-Reference -->
    <atom:link href="${this.baseUrl}/${channelMeta.language}/podcasts/rss.xml" rel="self" type="application/rss+xml"/>
    
    <!-- Channel Image -->
    <image>
      <url>${channelMeta.imageUrl}</url>
      <title>${channelMeta.title}</title>
      <link>${channelMeta.link}</link>
      <width>1400</width>
      <height>1400</height>
    </image>
    
    <!-- iTunes/Apple Podcasts -->
    <itunes:author>${channelMeta.author}</itunes:author>
    <itunes:summary>${channelMeta.description}</itunes:summary>
    <itunes:owner>
      <itunes:name>${channelMeta.ownerName}</itunes:name>
      <itunes:email>${channelMeta.ownerEmail}</itunes:email>
    </itunes:owner>
    <itunes:image href="${channelMeta.imageUrl}"/>
    <itunes:category text="${channelMeta.category}">
      <itunes:category text="History"/>
    </itunes:category>
    <itunes:explicit>${channelMeta.explicit}</itunes:explicit>
    <itunes:type>episodic</itunes:type>
    
    <!-- Spotify -->
    <spotify:limit>50</spotify:limit>
    <spotify:countryOfOrigin>DE</spotify:countryOfOrigin>
    
    <!-- Episodes -->
${items.map((item) => this.buildItemXML(item)).join("\n")}
  </channel>
</rss>`;
  }

  /**
   * Build RSS item XML
   */
  private buildItemXML(item: RSSPodcastItem): string {
    const imageTag = item.imageUrl ? `    <itunes:image href="${item.imageUrl}"/>` : "";
    const durationTag = item.duration
      ? `    <itunes:duration>${item.duration}</itunes:duration>`
      : "";
    const lengthAttr = item.audioLength ? ` length="${item.audioLength}"` : "";
    const contentEncoded = item.contentHtml
      ? `\n      <content:encoded><![CDATA[${item.contentHtml}]]></content:encoded>`
      : "";

    return `    <item>
      <title>${item.title}</title>
      <description>${item.description}</description>
      <itunes:subtitle>${item.title}</itunes:subtitle>
      <link>${item.link}</link>
      <guid isPermaLink="false">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <enclosure url="${item.audioUrl}" type="audio/mpeg"${lengthAttr}/>
      
      <!-- Categories -->
${item.categories.map((cat) => `      <category>${cat}</category>`).join("\n")}
      
      <!-- iTunes -->
      <itunes:title>${item.title}</itunes:title>
      <itunes:summary>${item.description}</itunes:summary>
${imageTag}
${durationTag}
      <itunes:explicit>clean</itunes:explicit>
      <itunes:episodeType>full</itunes:episodeType>
${contentEncoded}
    </item>`;
  }

  /**
   * Ensure a default footer attribution is present at the end of show notes.
   * Avoids duplication by checking for existing Transistor.fm references.
   */
  private appendDefaultFooter(html: string): string {
    const alreadyHasFooter = /transistor\.fm/i.test(html) && /how-to-start-a-podcast/i.test(html);
    if (alreadyHasFooter) {
      return html;
    }

    const footer =
      '<p><small>Podcast theme music by <a href="https://transistor.fm" target="_blank" rel="noopener">Transistor.fm</a>. Learn how to start a podcast <a href="https://transistor.fm/how-to-start-a-podcast/" target="_blank" rel="noopener">here</a>.</small></p>';

    // If HTML already ends with a closing tag, just append. Otherwise, add a separator newline.
    const needsNewline = !/>\s*$/.test(html);
    return `${html}${needsNewline ? "\n" : ""}${footer}`;
  }

  /**
   * Format date to RFC 822 format (required for RSS)
   */
  private formatRFC822Date(date: Date): string {
    return date.toUTCString();
  }

  /**
   * Escape XML special characters
   */
  private escapeXML(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Get estimated audio file size
   */
  private getEstimatedAudioSize(): number {
    // Estimated size based on typical podcast length (~25-30 min episode)
    return 25000000; // ~25MB
  }

  /**
   * Get estimated audio duration
   */
  private getEstimatedDuration(): string {
    // Estimated duration for typical episode
    return "26:30";
  }

  /**
   * Validate generated RSS XML
   */
  public validateRSSXML(xmlContent: string): boolean {
    try {
      // Basic validation - check if it's valid XML structure
      const hasRSSRoot = xmlContent.includes('<rss version="2.0"');
      const hasChannel = xmlContent.includes("<channel>") && xmlContent.includes("</channel>");
      const hasTitle = xmlContent.includes("<title>") && xmlContent.includes("</title>");
      const hasDescription =
        xmlContent.includes("<description>") && xmlContent.includes("</description>");

      return hasRSSRoot && hasChannel && hasTitle && hasDescription;
    } catch (error) {
      console.error("RSS XML validation failed:", error);
      return false;
    }
  }
}

/**
 * Helper function to generate RSS feed for a specific language
 */
export function generatePodcastRSSFeed(lang: string, episodes: PodcastData[]): string {
  const generator = new PodcastRSSGenerator();
  return generator.generateFeed(lang, episodes);
}

/**
 * Export default instance
 */
export default PodcastRSSGenerator;
