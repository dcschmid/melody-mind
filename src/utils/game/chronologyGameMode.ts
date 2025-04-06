import type { Album } from "./getRandomQuestion";
import { Difficulty } from "./jokerUtils";

/**
 * Chronology Game Mode: Benutzt für zeitlich korrekte Einordnung von Musik-Items
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
  displayText?: string; // Optionaler angezeigter Text (falls wir den echten Wert verstecken wollen)
}

/**
 * Generiert eine Chronologie-Frage aus einer Liste von Alben
 * 
 * @param albums - Liste von Alben aus der aktuellen Kategorie
 * @param difficulty - Schwierigkeitsgrad 
 * @returns ChronologyQuestion mit zufälligen Alben in zufälliger Reihenfolge
 */
export function generateChronologyQuestion(
  albums: Album[],
  difficulty: Difficulty
): ChronologyQuestion | null {
  if (!albums || albums.length < 3) {
    console.error("Not enough albums for chronology mode");
    return null;
  }

  // Anzahl der zu sortierenden Elemente je nach Schwierigkeitsgrad - jetzt fix auf 4
  const itemCount = 4;

  // Alben mit gültigem Jahr filtern
  const validAlbums = albums.filter(album => 
    album.year && !isNaN(parseInt(album.year))
  );
  
  if (validAlbums.length < itemCount) {
    console.error("Not enough albums with valid years");
    return null;
  }

  // Zufällige Auswahl von Alben
  const selectedAlbums = [...validAlbums]
    .sort(() => 0.5 - Math.random())
    .slice(0, itemCount);

  // Items erstellen und echte Reihenfolge merken
  const items: ChronologyItem[] = selectedAlbums.map((album, index) => ({
    id: index,
    artist: album.artist,
    title: album.album,
    year: parseInt(album.year),
    displayText: `${album.artist} - ${album.album}`
  }));

  // Korrekte Reihenfolge (aufsteigend nach Jahr)
  const correctOrder = [...items]
    .sort((a, b) => a.year - b.year)
    .map(item => item.id);

  // Items in zufälliger Reihenfolge zurückgeben
  return {
    type: "chronology",
    items: items.sort(() => 0.5 - Math.random()),
    correctOrder
  };
}

/**
 * Bewertet die vom Benutzer angegebene Reihenfolge
 * 
 * @param userOrder - Vom Benutzer gewählte Reihenfolge (Array von IDs)
 * @param correctOrder - Korrekte Reihenfolge (Array von IDs)
 * @returns Punkte basierend auf der Genauigkeit
 */
export function evaluateChronologyAnswer(
  userOrder: number[],
  correctOrder: number[]
): { score: number; correctItems: number; totalItems: number } {
  if (!userOrder || !correctOrder || userOrder.length !== correctOrder.length) {
    return { score: 0, correctItems: 0, totalItems: correctOrder.length };
  }

  let correctItems = 0;
  
  // Zählen korrekt platzierter Items
  for (let i = 0; i < correctOrder.length; i++) {
    if (userOrder[i] === correctOrder[i]) {
      correctItems++;
    }
  }

  // Punkteberechnung
  // Bei perfekter Antwort volle 100 Punkte, sonst anteilig
  const score = Math.floor((correctItems / correctOrder.length) * 100);
  
  return {
    score,
    correctItems,
    totalItems: correctOrder.length
  };
}