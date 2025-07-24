/**
 * Daily Music History Facts Service
 * Provides daily music facts with fallback to external sources
 */

export interface MusicFact {
  id: string;
  date: string; // Format: "MM-DD"
  title: string;
  description: string;
  category: 'birth' | 'death' | 'release' | 'event' | 'milestone' | 'formation' | 'breakthrough';
  year?: number;
  artist?: string;
  album?: string;
  genre?: string;
  source?: string;
}

export interface DailyFactsData {
  [key: string]: MusicFact; // Key format: "MM-DD"
}

/**
 * Get day of year in MM-DD format
 */
function getDayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}`;
}

/**
 * Get daily music fact for a specific language and date
 */
export async function getDailyMusicFact(
  lang: string = 'de',
  date: Date = new Date()
): Promise<MusicFact | null> {
  try {
    const dayKey = getDayKey(date);
    
    // Try to load language-specific facts
    const facts = await loadDailyFacts(lang);
    
    // Get fact for specific day
    let fact = facts[dayKey];
    
    // Fallback to German if not found in requested language
    if (!fact && lang !== 'de') {
      const germanFacts = await loadDailyFacts('de');
      fact = germanFacts[dayKey];
    }
    
    // If still no fact, get a random fact from available ones
    if (!fact) {
      const availableKeys = Object.keys(facts);
      if (availableKeys.length > 0) {
        const randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
        fact = facts[randomKey];
      }
    }
    
    return fact || null;
  } catch (error) {
    console.error('Error loading daily music fact:', error);
    return null;
  }
}

/**
 * Load daily facts for a specific language
 */
async function loadDailyFacts(lang: string): Promise<DailyFactsData> {
  try {
    // Import the JSON file for the specific language
    const factsModule = await import(`../data/daily-facts/${lang}.json`);
    return (factsModule.default || factsModule) as DailyFactsData;
  } catch (error) {
    console.warn(`Failed to load daily facts for language ${lang}:`, error);
    
    // Fallback to German
    if (lang !== 'de') {
      try {
        const factsModule = await import(`../data/daily-facts/de.json`);
        return (factsModule.default || factsModule) as DailyFactsData;
      } catch (fallbackError) {
        console.error('Failed to load fallback German daily facts:', fallbackError);
        return {};
      }
    }
    
    return {};
  }
}

/**
 * Get facts for a specific month (1-12)
 */
export async function getFactsForMonth(
  month: number,
  lang: string = 'de'
): Promise<MusicFact[]> {
  const facts = await loadDailyFacts(lang);
  const monthStr = String(month).padStart(2, '0');
  
  return Object.entries(facts)
    .filter(([key]) => key.startsWith(monthStr))
    .map(([, fact]) => fact)
    .sort((a, b) => {
      const dayA = parseInt(a.date.split('-')[1]);
      const dayB = parseInt(b.date.split('-')[1]);
      return dayA - dayB;
    });
}

/**
 * Get all facts
 */
export async function getAllFacts(lang: string = 'de'): Promise<MusicFact[]> {
  const facts = await loadDailyFacts(lang);
  
  return Object.values(facts)
    .sort((a, b) => {
      // Sort by date (month-day)
      const [monthA, dayA] = a.date.split('-').map(Number);
      const [monthB, dayB] = b.date.split('-').map(Number);
      
      if (monthA !== monthB) return monthA - monthB;
      return dayA - dayB;
    });
}

/**
 * Get facts by category
 */
export async function getFactsByCategory(
  category: MusicFact['category'],
  lang: string = 'de'
): Promise<MusicFact[]> {
  const facts = await loadDailyFacts(lang);
  
  return Object.values(facts)
    .filter(fact => fact.category === category)
    .sort((a, b) => {
      // Sort by date (month-day)
      const [monthA, dayA] = a.date.split('-').map(Number);
      const [monthB, dayB] = b.date.split('-').map(Number);
      
      if (monthA !== monthB) return monthA - monthB;
      return dayA - dayB;
    });
}

/**
 * Search facts by text
 */
export async function searchFacts(
  query: string,
  lang: string = 'de'
): Promise<MusicFact[]> {
  const facts = await loadDailyFacts(lang);
  const lowerQuery = query.toLowerCase();
  
  return Object.values(facts)
    .filter(fact => 
      fact.title.toLowerCase().includes(lowerQuery) ||
      fact.description.toLowerCase().includes(lowerQuery) ||
      fact.artist?.toLowerCase().includes(lowerQuery) ||
      fact.album?.toLowerCase().includes(lowerQuery) ||
      fact.genre?.toLowerCase().includes(lowerQuery)
    )
    .sort((a, b) => {
      // Sort by relevance (title matches first, then description matches)
      const titleMatchA = a.title.toLowerCase().includes(lowerQuery);
      const titleMatchB = b.title.toLowerCase().includes(lowerQuery);
      
      if (titleMatchA && !titleMatchB) return -1;
      if (!titleMatchA && titleMatchB) return 1;
      
      return a.title.localeCompare(b.title);
    });
}

/**
 * Get random fact
 */
export async function getRandomMusicFact(lang: string = 'de'): Promise<MusicFact | null> {
  const facts = await loadDailyFacts(lang);
  const factKeys = Object.keys(facts);
  
  if (factKeys.length === 0) return null;
  
  const randomKey = factKeys[Math.floor(Math.random() * factKeys.length)];
  return facts[randomKey];
}

/**
 * Check if we have a fact for a specific date
 */
export async function hasFactForDate(
  date: Date,
  lang: string = 'de'
): Promise<boolean> {
  const facts = await loadDailyFacts(lang);
  const dayKey = getDayKey(date);
  return dayKey in facts;
}

/**
 * Get fact statistics
 */
export async function getFactStats(lang: string = 'de'): Promise<{
  total: number;
  byCategory: Record<MusicFact['category'], number>;
  daysWithFacts: number;
}> {
  const facts = await loadDailyFacts(lang);
  const factArray = Object.values(facts);
  
  const byCategory = factArray.reduce((acc, fact) => {
    acc[fact.category] = (acc[fact.category] || 0) + 1;
    return acc;
  }, {} as Record<MusicFact['category'], number>);
  
  return {
    total: factArray.length,
    byCategory,
    daysWithFacts: Object.keys(facts).length
  };
}