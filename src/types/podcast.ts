/**
 * Podcast Types Module
 *
 * This module contains TypeScript definitions for podcast-related types used throughout the application.
 * Includes interfaces for podcast data and segments.
 */

/**
 * Individual podcast segment with speaker and timing information
 */
export interface PodcastSegment {
  /** The speaker's name (e.g., "daniel", "annabelle") */
  speaker: string;
  /** The text content of this segment */
  text: string;
  /** Start time in seconds */
  start_time: number;
  /** End time in seconds */
  end_time: number;
  /** Duration of the segment in seconds */
  duration: number;
}

/**
 * Metadata about the podcast
 */
export interface PodcastInfo {
  /** The title of the podcast episode */
  title: string;
  /** Language code of the podcast */
  language: string;
  /** Total duration in seconds */
  total_duration: number;
  /** Timestamp when the transcript was generated */
  generated_at: string;
}

/**
 * Complete podcast transcript structure
 */
export interface PodcastTranscript {
  /** Metadata about the podcast */
  podcast_info: PodcastInfo;
  /** Array of transcript segments */
  segments: PodcastSegment[];
}

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
  /** Optional rich HTML show notes for the episode */
  showNotesHtml?: string;
  /** URL to the audio file */
  audioUrl: string;
  /** Optional duration in seconds (if known / precomputed) */
  durationSeconds?: number;
  /** URL to the VTT subtitle file */
  subtitleUrl?: string;
  /** Cover image URL */
  imageUrl: string;
  /** Optional intrinsic cover image width in pixels (for precise OG/Twitter metadata) */
  imageWidth?: number;
  /** Optional intrinsic cover image height in pixels */
  imageHeight?: number;
  /** Publication date */
  publishedAt: string;
  /** Language of the podcast */
  language: string;
  /** Whether the podcast is available */
  isAvailable: boolean;
  /** Optional series name (podcast show) for structured data & SEO */
  seriesName?: string;
}
