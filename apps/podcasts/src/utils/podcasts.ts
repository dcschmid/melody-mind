import { getCollection, type CollectionEntry } from 'astro:content';
import type { PodcastData } from '../types/podcast';

type PodcastEntry = CollectionEntry<'podcasts'>;

const markdownCache = new Map<string, string>();

type PodcastEntryWithBody = PodcastEntry & {
  body?: string;
};

function getEntryBody(entry: PodcastEntry): string {
  const entryWithBody = entry as PodcastEntryWithBody;
  return entryWithBody.body || '';
}

const markdownToHtml = (markdown: string): string => {
  const cached = markdownCache.get(markdown);
  if (cached !== undefined) {
    return cached;
  }

  const html = markdown
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .split('\n\n')
    .map((block) => {
      block = block.trim();
      if (!block) {
        return '';
      }
      if (block.startsWith('<h') || block.startsWith('<ul')) {
        return block;
      }
      return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');

  markdownCache.set(markdown, html);
  return html;
};

/**
 * Transforms a content collection entry to PodcastData format.
 * Maps the schema fields to the expected PodcastData interface.
 * Uses body content (Markdown) for show notes.
 */
const entryToPodcastData = (entry: PodcastEntry): PodcastData => {
  // The glob loader provides the raw body content (Markdown after frontmatter)
  const rawBody = getEntryBody(entry);

  // Convert Markdown body to HTML for display
  const showNotesHtml = rawBody ? markdownToHtml(rawBody) : undefined;

  return {
    id: entry.data.id,
    title: entry.data.title,
    description: entry.data.description,
    audioUrl: entry.data.audioUrl,
    imageUrl: entry.data.imageUrl,
    publishedAt: entry.data.publishedAt.toISOString(),
    language: entry.data.language,
    isAvailable: entry.data.isAvailable,
    durationSeconds: entry.data.durationSeconds,
    episodeNumber: entry.data.episodeNumber,
    knowledgeUrl: entry.data.knowledgeUrl,
    subtitleUrl: entry.data.subtitleUrl,
    showNotesHtml,
    showNotesMarkdown: rawBody || undefined,
    metaDescription: entry.data.metaDescription,
    seriesName: entry.data.seriesName,
    fileSizeBytes: entry.data.fileSizeBytes,
    imageWidth: entry.data.imageWidth,
    imageHeight: entry.data.imageHeight,
  };
};

/**
 * Loads all podcast entries from the Astro content collection.
 */
export const getPodcastList = async (): Promise<PodcastData[]> => {
  const entries = await getCollection('podcasts');
  return entries.map(entryToPodcastData);
};

/**
 * Returns only episodes marked as available.
 */
export const getAvailablePodcasts = async (): Promise<PodcastData[]> => {
  const entries = await getCollection('podcasts', ({ data }) => data.isAvailable);
  return entries.map(entryToPodcastData);
};

/**
 * Looks up a single episode by id, optionally reusing a preloaded list.
 */
export const getPodcastById = async (
  id: string,
  podcasts?: PodcastData[],
): Promise<PodcastData | undefined> => {
  const list = podcasts ?? (await getPodcastList());
  return list.find((podcast) => podcast.id === id);
};
