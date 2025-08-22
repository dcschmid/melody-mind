import type { Album } from "./getRandomQuestion";
import { Difficulty } from "./jokerUtils";

/**
 * Chronology Game Mode: Used for arranging music items in correct chronological order
 */
export interface ChronologyQuestion {
  type: "chronology";
  items: ChronologyItem[];
  correctOrder: number[];
}

export interface ChronologyItem {
  id: number;
  artist: string;
  title: string;
  year: number;
  displayText?: string; // Optional displayed text (if we want to hide the real value)
}

/**
 * Generates a chronology question from a list of albums
 *
 * @param {Album[]} albums - List of albums from the current category
 * @param {Difficulty} difficulty - Difficulty level
 * @returns {ChronologyQuestion|null} ChronologyQuestion with random albums in random order
 */
export function generateChronologyQuestion(
  albums: Album[],
  _difficulty: Difficulty
): ChronologyQuestion | null {
  if (!albums || albums.length < 3) {
    console.error("Not enough albums for chronology mode");
    return null;
  }

  // Number of elements to sort based on difficulty - now fixed at 4
  const itemCount = 4;

  // Filter albums with valid year
  const validAlbums = albums.filter((album) => album.year && !isNaN(parseInt(album.year)));

  if (validAlbums.length < itemCount) {
    console.error("Not enough albums with valid years");
    return null;
  }

  // Random selection of albums
  const selectedAlbums = [...validAlbums].sort(() => 0.5 - Math.random()).slice(0, itemCount);

  // Create items and remember the correct order
  const items: ChronologyItem[] = selectedAlbums.map((album, index) => ({
    id: index,
    artist: album.artist,
    title: album.album,
    year: parseInt(album.year),
    displayText: `${album.artist} - ${album.album}`,
  }));

  // Correct order (ascending by year)
  const correctOrder = [...items].sort((a, b) => a.year - b.year).map((item) => item.id);

  // Return items in random order
  return {
    type: "chronology",
    items: items.sort(() => 0.5 - Math.random()),
    correctOrder,
  };
}

/**
 * Evaluates the user-specified order
 *
 * @param {number[]} userOrder - User-selected order (array of IDs)
 * @param {number[]} correctOrder - Correct order (array of IDs)
 * @returns {Object} Points based on accuracy
 */
export function evaluateChronologyAnswer(
  userOrder: number[],
  correctOrder: number[]
): { score: number; correctItems: number; totalItems: number } {
  if (!userOrder || !correctOrder || userOrder.length !== correctOrder.length) {
    return { score: 0, correctItems: 0, totalItems: correctOrder.length };
  }

  let correctItems = 0;

  // Count correctly placed items
  for (let i = 0; i < correctOrder.length; i++) {
    if (userOrder[i] === correctOrder[i]) {
      correctItems++;
    }
  }

  // Score calculation
  // Perfect answer: full 100 points, otherwise proportional
  const score = Math.floor((correctItems / correctOrder.length) * 100);

  return {
    score,
    correctItems,
    totalItems: correctOrder.length,
  };
}
