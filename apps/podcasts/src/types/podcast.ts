/**
 * Complete podcast data including file references
 */
export interface PodcastData {
  /** Unique identifier for the podcast */
  id: string;
  /** Display title for the podcast */
  title: string;
  /** Brief description of the podcast content */
  description: string;
  /** Optional rich HTML show notes for the episode (rendered from body) */
  showNotesHtml?: string | undefined;
  /** Optional raw Markdown show notes from MDX body */
  showNotesMarkdown?: string | undefined;
  /** Optional shorter meta description for SEO snippets */
  metaDescription?: string | undefined;
  /** URL to the audio file */
  audioUrl: string;
  /** Optional duration in seconds (if known / precomputed) */
  durationSeconds?: number | undefined;
  /** Optional precise audio file size in bytes (for <enclosure length="...">) */
  fileSizeBytes?: number | undefined;
  /** URL to the VTT subtitle file */
  subtitleUrl?: string | undefined;
  /** Cover image URL */
  imageUrl: string;
  /** Optional intrinsic cover image width in pixels (for precise OG/Twitter metadata) */
  imageWidth?: number | undefined;
  /** Optional intrinsic cover image height in pixels */
  imageHeight?: number | undefined;
  /** Publication date */
  publishedAt: string;
  /** Language of the podcast */
  language: string;
  /** Whether the podcast is available */
  isAvailable: boolean;
  /** Optional series name (podcast show) for structured data & SEO */
  seriesName?: string | undefined;
  /** Optional explicit episode number (overrides auto numbering if present) */
  episodeNumber?: number | undefined;
  /** Optional URL to related knowledge article */
  knowledgeUrl?: string | undefined;
}
