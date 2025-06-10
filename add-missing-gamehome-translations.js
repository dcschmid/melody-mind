#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define the missing translations for each language
const translations = {
  'fr': {
    'game.categories.title': 'Catégories Musicales',
    'game.categories.loading': 'Chargement des catégories musicales...',
    'accessibility.skip.to.content': 'Aller au contenu principal'
  },
  'it': {
    'game.search.clear': 'Cancella ricerca',
    'game.search.help': 'Digita per filtrare i generi musicali per nome',
    'game.search.showing.all': 'Mostrando tutti i generi',
    'game.search.results': 'generi trovati',
    'game.search.no.results': 'Nessun genere trovato corrispondente alla tua ricerca',
    'game.genre.selection.description': 'Scegli tra diversi generi musicali tra cui rock, pop, jazz, classica e altro. Ogni categoria presenta domande accuratamente selezionate per testare la tua conoscenza musicale.',
    'game.categories.title': 'Categorie Musicali',
    'game.categories.loading': 'Caricamento categorie musicali...',
    'accessibility.skip.to.content': 'Vai al contenuto principale'
  },
  'pt': {
    'game.search.clear': 'Limpar pesquisa',
    'game.search.help': 'Digite para filtrar gêneros musicais por nome',
    'game.search.showing.all': 'Mostrando todos os gêneros',
    'game.search.results': 'gêneros encontrados',
    'game.search.no.results': 'Nenhum gênero encontrado correspondente à sua pesquisa',
    'game.genre.selection.description': 'Escolha entre múltiplos gêneros musicais incluindo rock, pop, jazz, clássica e mais. Cada categoria apresenta perguntas cuidadosamente selecionadas para testar seu conhecimento musical.',
    'game.categories.title': 'Categorias Musicais',
    'game.categories.loading': 'Carregando categorias musicais...',
    'accessibility.skip.to.content': 'Pular para o conteúdo principal'
  },
  'da': {
    'game.search.clear': 'Ryd søgning',
    'game.search.help': 'Skriv for at filtrere musikgenrer efter navn',
    'game.search.showing.all': 'Viser alle genrer',
    'game.search.results': 'genrer fundet',
    'game.search.no.results': 'Ingen genrer fundet, der matcher din søgning',
    'game.genre.selection.description': 'Vælg mellem flere musikgenrer inklusive rock, pop, jazz, klassisk og mere. Hver kategori indeholder nøje udvalgte spørgsmål for at teste din musikviden.',
    'game.categories.title': 'Musikategorier',
    'game.categories.loading': 'Indlæser musikategorier...',
    'accessibility.skip.to.content': 'Spring til hovedindhold'
  },
  'nl': {
    'game.search.clear': 'Zoekopdracht wissen',
    'game.search.help': 'Typ om muziekgenres op naam te filteren',
    'game.search.showing.all': 'Alle genres weergeven',
    'game.search.results': 'genres gevonden',
    'game.search.no.results': 'Geen genres gevonden die overeenkomen met uw zoekopdracht',
    'game.genre.selection.description': 'Kies uit meerdere muziekgenres inclusief rock, pop, jazz, klassiek en meer. Elke categorie bevat zorgvuldig geselecteerde vragen om uw muziekkennis te testen.',
    'game.categories.title': 'Muziekcategorieën',
    'game.categories.loading': 'Muziekcategorieën laden...',
    'accessibility.skip.to.content': 'Spring naar hoofdinhoud'
  },
  'sv': {
    'game.search.clear': 'Rensa sökning',
    'game.search.help': 'Skriv för att filtrera musikgenrer efter namn',
    'game.search.showing.all': 'Visar alla genrer',
    'game.search.results': 'genrer hittade',
    'game.search.no.results': 'Inga genrer hittades som matchar din sökning',
    'game.genre.selection.description': 'Välj mellan flera musikgenrer inklusive rock, pop, jazz, klassisk och mer. Varje kategori innehåller noggrant utvalda frågor för att testa din musikkunskap.',
    'game.categories.title': 'Musikkategorier',
    'game.categories.loading': 'Laddar musikkategorier...',
    'accessibility.skip.to.content': 'Hoppa till huvudinnehåll'
  },
  'fi': {
    'game.search.clear': 'Tyhjennä haku',
    'game.search.help': 'Kirjoita suodattaaksesi musiikkigenrejä nimen mukaan',
    'game.search.showing.all': 'Näytetään kaikki genret',
    'game.search.results': 'genreä löytyi',
    'game.search.no.results': 'Hakuasi vastaavia genrejä ei löytynyt',
    'game.genre.selection.description': 'Valitse useista musiikkigenreistä mukaan lukien rock, pop, jazz, klassinen ja muita. Jokainen kategoria sisältää huolellisesti valittuja kysymyksiä musiikkitietämyksesi testaamiseksi.',
    'game.categories.title': 'Musiikkikategoriat',
    'game.categories.loading': 'Ladataan musiikkikategorioita...',
    'accessibility.skip.to.content': 'Siirry pääsisältöön'
  }
};

// Function to add missing keys to a language file
function addMissingKeys(languageCode) {
  const filePath = path.join(__dirname, 'src', 'i18n', 'locales', `${languageCode}.ts`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const keysToAdd = translations[languageCode];
  
  if (!keysToAdd) {
    console.log(`❌ No translations defined for ${languageCode}`);
    return;
  }

  // Add missing search keys
  const searchKeys = ['game.search.clear', 'game.search.help', 'game.search.showing.all', 'game.search.results', 'game.search.no.results'];
  searchKeys.forEach(key => {
    if (keysToAdd[key] && !content.includes(`"${key}"`)) {
      // Find the position after game.search.description
      const searchPattern = /"game\.search\.description":[^,]+,/;
      const match = content.match(searchPattern);
      if (match) {
        const insertion = `\n  "${key}": "${keysToAdd[key]}",`;
        content = content.replace(match[0], match[0] + insertion);
        console.log(`✅ Added ${key} to ${languageCode}.ts`);
      }
    }
  });

  // Add genre.selection.description
  if (keysToAdd['game.genre.selection.description'] && !content.includes('"game.genre.selection.description"')) {
    const genreImagePattern = /"game\.genre\.image":[^,]+,/;
    const match = content.match(genreImagePattern);
    if (match) {
      const insertion = `\n  "game.genre.selection.description": "${keysToAdd['game.genre.selection.description']}",`;
      content = content.replace(match[0], match[0] + insertion);
      console.log(`✅ Added game.genre.selection.description to ${languageCode}.ts`);
    }
  }

  // Add categories keys
  const categoriesKeys = ['game.categories.title', 'game.categories.loading'];
  categoriesKeys.forEach(key => {
    if (keysToAdd[key] && !content.includes(`"${key}"`)) {
      const categoriesEmptyPattern = /"game\.categories\.empty\.headline"/;
      if (content.match(categoriesEmptyPattern)) {
        const insertion = `  "${key}": "${keysToAdd[key]}",\n  `;
        content = content.replace(categoriesEmptyPattern, `${insertion  }"game.categories.empty.headline"`);
        console.log(`✅ Added ${key} to ${languageCode}.ts`);
      }
    }
  });

  // Add accessibility key
  if (keysToAdd['accessibility.skip.to.content'] && !content.includes('"accessibility.skip.to.content"')) {
    const skipMainPattern = /"accessibility\.skip\.main":[^,]+,/;
    const match = content.match(skipMainPattern);
    if (match) {
      const insertion = `\n  "accessibility.skip.to.content": "${keysToAdd['accessibility.skip.to.content']}",`;
      content = content.replace(match[0], match[0] + insertion);
      console.log(`✅ Added accessibility.skip.to.content to ${languageCode}.ts`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Updated ${languageCode}.ts\n`);
}

// Process all languages
console.log('🔄 Adding missing gamehome translation keys...\n');

Object.keys(translations).forEach(lang => {
  console.log(`Processing ${lang.toUpperCase()}:`);
  addMissingKeys(lang);
});

console.log('✨ Translation validation complete!');
