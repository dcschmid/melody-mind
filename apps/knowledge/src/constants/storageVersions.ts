/**
 * Storage Constants
 *
 * Centralized constants for localStorage keys and versions.
 * Version numbers allow for schema migrations when data structure changes.
 */

/**
 * Current storage schema versions.
 * Increment when data structure changes to trigger migration/cleanup.
 */
const STORAGE_VERSIONS = {
  /** Recent reads list (mm_recent_reads) */
  RECENT_READS: 1,
  /** Reading progress per article (mm_read_progress) */
  READ_PROGRESS: 1,
} as const;

/**
 * Storage keys with version suffix for automatic migration.
 */
export const VERSIONED_KEYS = {
  RECENT_READS: `mm_recent_reads_v${STORAGE_VERSIONS.RECENT_READS}`,
  READ_PROGRESS: `mm_read_progress_v${STORAGE_VERSIONS.READ_PROGRESS}`,
} as const;
