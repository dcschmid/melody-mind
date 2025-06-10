#!/usr/bin/env node

/**
 * Script to add missing authentication accessibility keys to all locale files
 * Adds the required keys for AuthForm.astro error handling and accessibility
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const localesDir = "./src/i18n/locales";

const missingKeys = {
  fr: {
    "auth.accessibility.error_message_dismissed": "Message d'erreur fermé",
    "auth.accessibility.success_message_dismissed": "Message de succès fermé",
    "auth.form.init_error": "Échec de l'initialisation des éléments du formulaire",
  },
  it: {
    "auth.accessibility.error_message_dismissed": "Messaggio di errore chiuso",
    "auth.accessibility.success_message_dismissed": "Messaggio di successo chiuso",
    "auth.form.init_error": "Impossibile inizializzare gli elementi del modulo",
  },
  pt: {
    "auth.accessibility.error_message_dismissed": "Mensagem de erro dispensada",
    "auth.accessibility.success_message_dismissed": "Mensagem de sucesso dispensada",
    "auth.form.init_error": "Falha ao inicializar elementos do formulário",
  },
  nl: {
    "auth.accessibility.error_message_dismissed": "Foutmelding weggedrukt",
    "auth.accessibility.success_message_dismissed": "Succesbericht weggedrukt",
    "auth.form.init_error": "Kan formulierelementen niet initialiseren",
  },
  sv: {
    "auth.accessibility.error_message_dismissed": "Felmeddelande avvisat",
    "auth.accessibility.success_message_dismissed": "Framgångsmeddelande avvisat",
    "auth.form.init_error": "Misslyckades med att initiera formulärelement",
  },
  da: {
    "auth.accessibility.error_message_dismissed": "Fejlbesked afvist",
    "auth.accessibility.success_message_dismissed": "Succesbesked afvist",
    "auth.form.init_error": "Kunne ikke initialisere formularelementer",
  },
  fi: {
    "auth.accessibility.error_message_dismissed": "Virheilmoitus hylätty",
    "auth.accessibility.success_message_dismissed": "Onnistumisviesti hylätty",
    "auth.form.init_error": "Lomakeelementtien alustaminen epäonnistui",
  },
};

function addKeysToLocale(locale, keys) {
  const filePath = join(localesDir, `${locale}.ts`);
  const content = readFileSync(filePath, "utf8");

  // Find the position after login_form_active and register_form_active
  const insertAfter = '"auth.accessibility.register_form_active"';
  const insertIndex = content.indexOf(insertAfter);

  if (insertIndex === -1) {
    console.log(`Warning: Could not find insertion point in ${locale}.ts`);
    return;
  }

  // Find the end of that line
  const lineEnd = content.indexOf("\n", insertIndex);
  if (lineEnd === -1) {
    return;
  }

  // Check if keys already exist
  if (content.includes("auth.accessibility.error_message_dismissed")) {
    console.log(`Keys already exist in ${locale}.ts, skipping...`);
    return;
  }

  // Create the new keys string
  const newKeysString = `
  "auth.accessibility.error_message_dismissed": "${keys["auth.accessibility.error_message_dismissed"]}",
  "auth.accessibility.success_message_dismissed": "${keys["auth.accessibility.success_message_dismissed"]}",

  // Form Initialization
  "auth.form.init_error": "${keys["auth.form.init_error"]}",`;

  // Insert the new keys
  const newContent = content.slice(0, lineEnd + 1) + newKeysString + content.slice(lineEnd + 1);

  writeFileSync(filePath, newContent, "utf8");
  console.log(`Added missing keys to ${locale}.ts`);
}

// Process each locale
for (const [locale, keys] of Object.entries(missingKeys)) {
  try {
    addKeysToLocale(locale, keys);
  } catch (error) {
    console.error(`Error processing ${locale}.ts:`, error.message);
  }
}

console.log("Finished adding missing authentication accessibility keys");
