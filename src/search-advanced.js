/**
 * Advanced Search Functionality for Playlists
 *
 * This module implements sophisticated search algorithms that are loaded only when needed:
 * - Fuzzy matching using Levenshtein distance
 * - Token-based search with relevance scoring
 * - Optimized algorithms for large datasets
 */

// Configuration values
const FUZZY_MATCH_THRESHOLD = 0.6; // Threshold for fuzzy matching (0-1)

/**
 * Calculates the Levenshtein distance between two strings
 * for fuzzy matching purposes
 *
 * @param {string} a - First string to compare
 * @param {string} b - Second string to compare
 * @returns {number} - The calculated Levenshtein distance
 */
function levenshteinDistance(a, b) {
  if (a.length === 0) {
    return b.length;
  }
  if (b.length === 0) {
    return a.length;
  }

  const matrix = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Delete
        matrix[i][j - 1] + 1, // Insert
        matrix[i - 1][j - 1] + cost // Replace
      );
    }
  }

  return matrix[a.length][b.length];
}

/**
 * Calculates the similarity between two strings (0-1)
 *
 * @param {string} a - First string to compare
 * @param {string} b - Second string to compare
 * @returns {number} - Similarity score between 0 (no similarity) and 1 (identical)
 */
function stringSimilarity(a, b) {
  if (!a || !b) {
    return 0;
  }
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) {
    return 1;
  }
  const distance = levenshteinDistance(a, b);
  return 1 - distance / maxLength;
}

/**
 * Checks if a string contains another using fuzzy matching
 *
 * @param {string} text - The text to search in
 * @param {string} query - The query to search for
 * @param {number} threshold - Minimum similarity threshold (default: FUZZY_MATCH_THRESHOLD)
 * @returns {boolean} - True if the text contains the query according to fuzzy matching
 */
function fuzzyIncludes(text, query, threshold = FUZZY_MATCH_THRESHOLD) {
  if (!query) {
    return true;
  }
  if (!text) {
    return false;
  }

  // Exact match takes priority
  if (text.includes(query)) {
    return true;
  }

  // For short queries, we check token by token
  if (query.length <= 3) {
    const tokens = text.split(/\s+/);
    return tokens.some((token) => stringSimilarity(token, query) >= threshold);
  }

  // For longer queries, we check substrings
  for (let i = 0; i <= text.length - query.length; i++) {
    const substring = text.substr(i, query.length + 2); // A bit more for fuzzy matching
    if (stringSimilarity(substring, query) >= threshold) {
      return true;
    }
  }

  return false;
}

/**
 * Calculates a relevance score for search results
 *
 * @param {Object} item - The item to calculate relevance for
 * @param {string} searchTerm - The search term to match against
 * @returns {number} - Relevance score (0-2), where higher values indicate better matches
 */
function calculateRelevance(item, searchTerm) {
  if (!searchTerm) {
    return 1;
  }

  // Exact match has highest priority
  if (item.searchable.includes(searchTerm)) {
    return 2;
  }

  // Tokenize the search text for better matching
  const tokens = item.searchable.split(/\s+/).filter((token) => token.length > 1);

  // Check token matches
  const tokenMatches = tokens.filter((token) => fuzzyIncludes(token, searchTerm)).length;

  if (tokenMatches > 0) {
    return 1 + tokenMatches / tokens.length;
  }

  // Fuzzy matching as fallback
  return fuzzyIncludes(item.searchable, searchTerm) ? 0.7 : 0;
}

/**
 * Performs an advanced search with fuzzy matching
 *
 * @param {Array} searchIndex - The search index containing items to search through
 * @param {string} searchTerm - The search term to match against
 * @returns {Array} - Filtered and relevance-sorted items
 */
export function advancedSearch(searchIndex, searchTerm) {
  // Filter and sort by relevance
  return searchIndex
    .map((item) => {
      const relevance = calculateRelevance(item, searchTerm);
      return { item, relevance };
    })
    .filter(({ relevance }) => relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .map(({ item }) => item);
}
