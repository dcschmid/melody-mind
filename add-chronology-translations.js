#!/usr/bin/env node

import fs from "fs";
import path from "path";

const localesDir = "/home/daniel/projects/melody-mind/src/i18n/locales";

// Translations to add to each locale file
const translations = {
  es: {
    "game.chronology.incorrect": "¡Incorrecto! 😔",
    "game.chronology.correct_order": "Orden correcto:",
    "general.close": "Cerrar",
  },
  fr: {
    "game.chronology.incorrect": "Incorrect ! 😔",
    "game.chronology.correct_order": "Ordre correct :",
    "general.close": "Fermer",
  },
  it: {
    "game.chronology.incorrect": "Sbagliato! 😔",
    "game.chronology.correct_order": "Ordine corretto:",
    "general.close": "Chiudi",
  },
  pt: {
    "game.chronology.incorrect": "Incorreto! 😔",
    "game.chronology.correct_order": "Ordem correta:",
    "general.close": "Fechar",
  },
  da: {
    "game.chronology.incorrect": "Forkert! 😔",
    "game.chronology.correct_order": "Korrekt rækkefølge:",
    "general.close": "Luk",
  },
  nl: {
    "game.chronology.incorrect": "Onjuist! 😔",
    "game.chronology.correct_order": "Juiste volgorde:",
    "general.close": "Sluiten",
  },
  sv: {
    "game.chronology.incorrect": "Fel! 😔",
    "game.chronology.correct_order": "Rätt ordning:",
    "general.close": "Stäng",
  },
  fi: {
    "game.chronology.incorrect": "Väärin! 😔",
    "game.chronology.correct_order": "Oikea järjestys:",
    "general.close": "Sulje",
  },
};

function addTranslationsToFile(filePath, lang) {
  const fileContent = fs.readFileSync(filePath, "utf8");

  // Find the correct insertion point for each translation
  let updatedContent = fileContent;

  // Check if translations already exist
  const keysToAdd = translations[lang];

  for (const [key, value] of Object.entries(keysToAdd)) {
    if (!fileContent.includes(`"${key}"`)) {
      console.log(`Adding ${key} to ${lang}`);

      if (key === "game.chronology.incorrect") {
        // Replace the existing correct entry to include incorrect
        const correctPattern = /("game\.chronology\.correct":\s*"[^"]*"[^,]*),/;
        const match = updatedContent.match(correctPattern);
        if (match) {
          const replacement = `${match[1]},\n  "${key}": "${value}",`;
          updatedContent = updatedContent.replace(correctPattern, replacement);
        }
      } else if (key === "game.chronology.correct_order") {
        // Add after incorrect if it exists, otherwise after correct
        const insertAfterPattern = /("game\.chronology\.incorrect":\s*"[^"]*"[^,]*),/;
        const match = updatedContent.match(insertAfterPattern);
        if (match) {
          const replacement = `${match[1]},\n  "${key}": "${value}",`;
          updatedContent = updatedContent.replace(insertAfterPattern, replacement);
        }
      } else if (key === "general.close") {
        // Add before the final closing brace
        const beforeClosingPattern = /(\n\s*};?\s*)$/;
        updatedContent = updatedContent.replace(
          beforeClosingPattern,
          `,\n  "${key}": "${value}"$1`
        );
      }
    }
  }

  fs.writeFileSync(filePath, updatedContent, "utf8");
  console.log(`Updated ${filePath}`);
}

// Process each locale file
Object.keys(translations).forEach((lang) => {
  const filePath = path.join(localesDir, `${lang}.ts`);
  if (fs.existsSync(filePath)) {
    addTranslationsToFile(filePath, lang);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log("Translation updates completed!");
