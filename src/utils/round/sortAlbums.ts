import type { Album } from "../interfaces/albumInterface";
import { shuffleArray } from "@utils/share/shuffleArray";

/**
 * Converts a sales string to a number.
 * @param sales The sales string.
 * @returns The number value of the sales string.
 */
const parseSales = (sales: string): number => {
  sales = sales.trim(); // Remove any whitespace
  if (sales.endsWith("Mio.")) {
    return parseFloat(sales.slice(0, -4).replace(",", ".")) * 1e6;
  } else if (sales.endsWith("Tsd.")) {
    return parseFloat(sales.slice(0, -4).replace(",", ".")) * 1e3;
  } else {
    const cleaned = sales.replace(/[^0-9.,]/g, "");
    const number = parseFloat(cleaned.replace(",", "."));
    return isNaN(number) ? 0 : number;
  }
};

/**
 * Converts a length string to a number.
 * @param length The length string.
 * @returns The number value of the length string.
 */
const parseLength = (length: string): number => {
  const parts = length.split(":").map(Number);
  if (parts.length === 2) {
    // MM:SS
    return parts[0] + parts[1] / 60;
  } else if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 60 + parts[1] + parts[2] / 60;
  }
  return 0;
};

/**
 * Sorts an array of albums by a given criteria.
 * @param albums The array of albums.
 * @param sortBy The criteria to sort by.
 * @param order The order of the sorting.
 * @returns The sorted array of albums.
 */
function sortAlbums(albums: Album[], sortBy: string, order: string): Album[] {
  return [...albums]
    .sort((a, b) => {
      let compareA: number;
      let compareB: number;

      switch (sortBy) {
        case "dataYear":
          compareA = parseInt(a.dataYear, 10);
          compareB = parseInt(b.dataYear, 10);
          break;
        case "dataSales":
          compareA = parseSales(a.dataSales);
          compareB = parseSales(b.dataSales);
          break;
        case "dataLength":
          compareA = parseLength(a.dataLength);
          compareB = parseLength(b.dataLength);
          break;
        default:
          throw new Error(`Invalid sortBy value: ${sortBy}`);
      }

      if (compareA === compareB) {
        return 0; // ignore equal values
      }

      if (order === "asc") {
        return compareA - compareB;
      } else {
        return compareB - compareA;
      }
    })
    .filter((album, index, self) => {
      return (
        index ===
        self.findIndex((a) => {
          switch (sortBy) {
            case "dataYear":
              return a.dataYear === album.dataYear;
            case "dataSales":
              return a.dataSales === album.dataSales;
            case "dataLength":
              return a.dataLength === album.dataLength;
            default:
              throw new Error(`Invalid sortBy value: ${sortBy}`);
          }
        })
      );
    });
}

/**
 * Retrieves a list of albums sorted by a specific field and category.
 *
 * @param {string} sortBy - The field to sort the albums by. Can be one of "dataYear", "dataSales", or "dataLength".
 * @param {string} order - The order of the sorting (asc/desc).
 * @param {Album[]} albums - The albums to filter by.
 * @return {Album[]} A list of sorted albums.
 */
export async function getAlbumsSortedBySpecificFieldAndCatgory(sortBy: string, order: string, albums: Album[]) {

  // Filter the albums by category
  const randomAlbums = shuffleArray(albums).slice(0, 4);

  // Sort the filtered albums by the specified field and order
  const sortedAlbums = sortAlbums(randomAlbums, sortBy, order);

  const solutionArray = sortedAlbums.map((album) => album.band);

  // Return the sorted albums
  return {
    randomAlbums,
    sortedAlbums,
    solutionArray,
  };
}
