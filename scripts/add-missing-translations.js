#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, "..", "src", "i18n", "locales");

// Missing translations for each language
const missingTranslations = {
  da: {
    "auth.password_reset.description":
      "Indtast din e-mail for at modtage et link til nulstilling af adgangskode",
    "auth.service.invalid_credentials":
      "Ugyldige loginoplysninger. Tjek venligst din e-mail og adgangskode.",
    "game.categories.empty.text": "Desværre blev der ikke fundet kategorier. Prøv igen senere.",
  },
  fi: {
    "auth.password_reset.description":
      "Syötä sähköpostiosoitteesi saadaksesi salasanan palautuslinkki",
    "auth.email_verification.description":
      "Vahvista sähköpostiosoitteesi Melody Mind -tiliäsi varten.",
    "auth.service.invalid_credentials":
      "Virheelliset kirjautumistiedot. Tarkista sähköpostiosoite ja salasana.",
    "auth.service.too_many_attempts":
      "Liian monta kirjautumisyritystä. Odota hetki ja yritä uudelleen.",
    "game.categories.empty.text":
      "Valitettavasti kategorioita ei löytynyt. Yritä myöhemmin uudelleen.",
    "knowledge.play.description":
      "Testaa tietämystäsi tästä musiikkigenrestä interaktiivisessa tietokilpailussa!",
    "podcast.language.availability":
      "Podcastimme ovat saatavilla yksinomaan saksaksi ja englanniksi.",
    "game.chronology.navigation.description":
      "Käytä näitä painikkeita valitun elementin siirtämiseen",
  },
  sv: {
    "auth.password_reset.description":
      "Ange din e-postadress för att få en länk för lösenordsåterställning",
    "auth.service.invalid_credentials":
      "Ogiltiga inloggningsuppgifter. Kontrollera din e-post och lösenord.",
    "game.chronology.navigation.description":
      "Använd dessa knappar för att flytta det valda elementet",
  },
};

function addMissingTranslations(lang, translations) {
  const filePath = path.join(localesDir, `${lang}.ts`);

  if (!fs.existsSync(filePath)) {
    console.log(`File ${filePath} does not exist`);
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  // Find the last entry before the closing brace
  const lines = content.split("\n");
  const closingBraceIndex = lines.findLastIndex((line) => line.trim() === "};");

  if (closingBraceIndex === -1) {
    console.log(`Could not find closing brace in ${filePath}`);
    return;
  }

  // Add missing translations before the closing brace
  const translationEntries = Object.entries(translations).map(
    ([key, value]) => `  "${key}": "${value}",`
  );

  // Insert a comment and the new translations
  lines.splice(
    closingBraceIndex,
    0,
    "",
    "  // Missing translations added automatically",
    ...translationEntries
  );

  fs.writeFileSync(filePath, lines.join("\n"));
  console.log(`Added ${Object.keys(translations).length} missing translations to ${lang}.ts`);
}

// Add translations for each language
Object.entries(missingTranslations).forEach(([lang, translations]) => {
  addMissingTranslations(lang, translations);
});

console.log("Missing translations addition completed!");
