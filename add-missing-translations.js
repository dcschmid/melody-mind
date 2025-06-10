#!/usr/bin/env node

/**
 * Add missing translation keys to all locale files for PasswordResetForm component
 */

import fs from "fs";
import path from "path";

// Base translations in different languages
const translations = {
  en: {
    "auth.form.email_invalid_format":
      "Please enter a valid email address in the format: user@example.com",
    "auth.form.password_length_error": "Password must be at least 8 characters long",
    "auth.form.password_uppercase_error":
      "Password must contain at least one uppercase letter (A-Z)",
    "auth.form.password_lowercase_error":
      "Password must contain at least one lowercase letter (a-z)",
    "auth.form.password_number_error": "Password must contain at least one number (0-9)",
    "auth.form.password_special_error":
      "Password must contain at least one special character (!@#$%^&*)",
    "auth.form.password_common_error": "Please choose a less common password",
    "auth.form.password_repeats_error":
      "Password cannot contain more than 2 consecutive identical characters",
    "auth.form.password_sequences_error":
      "Password cannot contain common sequences like '123' or 'abc'",
    "auth.form.instructions.title": "How to complete this form",
    "auth.form.instructions.request.step1": "Enter your email address in the field below",
    "auth.form.instructions.request.step2":
      "Click 'Send Reset Link' to receive password reset instructions",
    "auth.form.instructions.request.step3":
      "Check your email for the reset link and follow the instructions",
    "auth.form.instructions.confirm.step1": "Create a strong password that meets all requirements",
    "auth.form.instructions.confirm.step2": "Confirm your password by typing it again",
    "auth.form.instructions.confirm.step3": "Click 'Reset Password' to complete the process",
    "auth.form.help.password_button": "Get help with creating a strong password",
    "auth.form.help.password_title": "Password Creation Tips",
    "auth.form.help.password_suggestions":
      "Try using a combination of words, numbers, and symbols. Avoid common passwords like 'password123'.",
    "auth.form.help.tip1": "Use a mix of uppercase and lowercase letters",
    "auth.form.help.tip2": "Include numbers and special characters",
    "auth.form.help.tip3": "Avoid common words and sequences",
    "auth.form.help.tip4": "Consider using a passphrase",
  },
  it: {
    "auth.form.email_invalid_format":
      "Inserisci un indirizzo email valido nel formato: utente@esempio.it",
    "auth.form.password_length_error": "La password deve essere lunga almeno 8 caratteri",
    "auth.form.password_uppercase_error":
      "La password deve contenere almeno una lettera maiuscola (A-Z)",
    "auth.form.password_lowercase_error":
      "La password deve contenere almeno una lettera minuscola (a-z)",
    "auth.form.password_number_error": "La password deve contenere almeno un numero (0-9)",
    "auth.form.password_special_error":
      "La password deve contenere almeno un carattere speciale (!@#$%^&*)",
    "auth.form.password_common_error": "Scegli una password meno comune",
    "auth.form.password_repeats_error":
      "La password non può contenere più di 2 caratteri identici consecutivi",
    "auth.form.password_sequences_error":
      "La password non può contenere sequenze comuni come '123' o 'abc'",
    "auth.form.instructions.title": "Come completare questo modulo",
    "auth.form.instructions.request.step1":
      "Inserisci il tuo indirizzo email nel campo sottostante",
    "auth.form.instructions.request.step2":
      "Clicca su 'Invia link di reset' per ricevere le istruzioni per il reset della password",
    "auth.form.instructions.request.step3":
      "Controlla la tua email per il link di reset e segui le istruzioni",
    "auth.form.instructions.confirm.step1":
      "Crea una password forte che soddisfi tutti i requisiti",
    "auth.form.instructions.confirm.step2": "Conferma la tua password digitandola di nuovo",
    "auth.form.instructions.confirm.step3":
      "Clicca su 'Reimposta password' per completare il processo",
    "auth.form.help.password_button": "Ottieni aiuto per creare una password forte",
    "auth.form.help.password_title": "Consigli per la creazione di password",
    "auth.form.help.password_suggestions":
      "Prova a usare una combinazione di parole, numeri e simboli. Evita password comuni come 'password123'.",
    "auth.form.help.tip1": "Usa un mix di lettere maiuscole e minuscole",
    "auth.form.help.tip2": "Includi numeri e caratteri speciali",
    "auth.form.help.tip3": "Evita parole comuni e sequenze",
    "auth.form.help.tip4": "Considera l'uso di una passphrase",
  },
  pt: {
    "auth.form.email_invalid_format":
      "Por favor, insira um endereço de email válido no formato: usuario@exemplo.pt",
    "auth.form.password_length_error": "A senha deve ter pelo menos 8 caracteres",
    "auth.form.password_uppercase_error":
      "A senha deve conter pelo menos uma letra maiúscula (A-Z)",
    "auth.form.password_lowercase_error":
      "A senha deve conter pelo menos uma letra minúscula (a-z)",
    "auth.form.password_number_error": "A senha deve conter pelo menos um número (0-9)",
    "auth.form.password_special_error":
      "A senha deve conter pelo menos um caractere especial (!@#$%^&*)",
    "auth.form.password_common_error": "Por favor, escolha uma senha menos comum",
    "auth.form.password_repeats_error":
      "A senha não pode conter mais de 2 caracteres idênticos consecutivos",
    "auth.form.password_sequences_error":
      "A senha não pode conter sequências comuns como '123' ou 'abc'",
    "auth.form.instructions.title": "Como preencher este formulário",
    "auth.form.instructions.request.step1": "Digite seu endereço de email no campo abaixo",
    "auth.form.instructions.request.step2":
      "Clique em 'Enviar link de redefinição' para receber instruções de redefinição de senha",
    "auth.form.instructions.request.step3":
      "Verifique seu email para o link de redefinição e siga as instruções",
    "auth.form.instructions.confirm.step1": "Crie uma senha forte que atenda a todos os requisitos",
    "auth.form.instructions.confirm.step2": "Confirme sua senha digitando-a novamente",
    "auth.form.instructions.confirm.step3": "Clique em 'Redefinir senha' para completar o processo",
    "auth.form.help.password_button": "Obter ajuda para criar uma senha forte",
    "auth.form.help.password_title": "Dicas de criação de senha",
    "auth.form.help.password_suggestions":
      "Tente usar uma combinação de palavras, números e símbolos. Evite senhas comuns como 'senha123'.",
    "auth.form.help.tip1": "Use uma mistura de letras maiúsculas e minúsculas",
    "auth.form.help.tip2": "Inclua números e caracteres especiais",
    "auth.form.help.tip3": "Evite palavras comuns e sequências",
    "auth.form.help.tip4": "Considere usar uma frase-senha",
  },
  da: {
    "auth.form.email_invalid_format":
      "Indtast venligst en gyldig emailadresse i formatet: bruger@eksempel.dk",
    "auth.form.password_length_error": "Adgangskoden skal være mindst 8 tegn lang",
    "auth.form.password_uppercase_error":
      "Adgangskoden skal indeholde mindst ét stort bogstav (A-Z)",
    "auth.form.password_lowercase_error":
      "Adgangskoden skal indeholde mindst ét lille bogstav (a-z)",
    "auth.form.password_number_error": "Adgangskoden skal indeholde mindst ét tal (0-9)",
    "auth.form.password_special_error":
      "Adgangskoden skal indeholde mindst ét specialtegn (!@#$%^&*)",
    "auth.form.password_common_error": "Vælg venligst en mindre almindelig adgangskode",
    "auth.form.password_repeats_error":
      "Adgangskoden må ikke indeholde mere end 2 identiske tegn i træk",
    "auth.form.password_sequences_error":
      "Adgangskoden må ikke indeholde almindelige sekvenser som '123' eller 'abc'",
    "auth.form.instructions.title": "Sådan udfylder du denne formular",
    "auth.form.instructions.request.step1": "Indtast din emailadresse i feltet nedenfor",
    "auth.form.instructions.request.step2":
      "Klik på 'Send nulstillingslink' for at modtage instruktioner til nulstilling af adgangskode",
    "auth.form.instructions.request.step3":
      "Tjek din email for nulstillingslinket og følg instruktionerne",
    "auth.form.instructions.confirm.step1": "Opret en stærk adgangskode der opfylder alle krav",
    "auth.form.instructions.confirm.step2": "Bekræft din adgangskode ved at skrive den igen",
    "auth.form.instructions.confirm.step3":
      "Klik på 'Nulstil adgangskode' for at fuldføre processen",
    "auth.form.help.password_button": "Få hjælp til at oprette en stærk adgangskode",
    "auth.form.help.password_title": "Tips til oprettelse af adgangskode",
    "auth.form.help.password_suggestions":
      "Prøv at bruge en kombination af ord, tal og symboler. Undgå almindelige adgangskoder som 'adgangskode123'.",
    "auth.form.help.tip1": "Brug en blanding af store og små bogstaver",
    "auth.form.help.tip2": "Inkluder tal og specialtegn",
    "auth.form.help.tip3": "Undgå almindelige ord og sekvenser",
    "auth.form.help.tip4": "Overvej at bruge en passphrase",
  },
  nl: {
    "auth.form.email_invalid_format":
      "Voer een geldig e-mailadres in het formaat in: gebruiker@voorbeeld.nl",
    "auth.form.password_length_error": "Wachtwoord moet minstens 8 tekens lang zijn",
    "auth.form.password_uppercase_error": "Wachtwoord moet minstens één hoofdletter bevatten (A-Z)",
    "auth.form.password_lowercase_error":
      "Wachtwoord moet minstens één kleine letter bevatten (a-z)",
    "auth.form.password_number_error": "Wachtwoord moet minstens één cijfer bevatten (0-9)",
    "auth.form.password_special_error":
      "Wachtwoord moet minstens één speciaal teken bevatten (!@#$%^&*)",
    "auth.form.password_common_error": "Kies een minder gangbaar wachtwoord",
    "auth.form.password_repeats_error":
      "Wachtwoord mag niet meer dan 2 opeenvolgende identieke tekens bevatten",
    "auth.form.password_sequences_error":
      "Wachtwoord mag geen gangbare reeksen bevatten zoals '123' of 'abc'",
    "auth.form.instructions.title": "Hoe dit formulier in te vullen",
    "auth.form.instructions.request.step1": "Voer je e-mailadres in het onderstaande veld in",
    "auth.form.instructions.request.step2":
      "Klik op 'Verstuur reset-link' om wachtwoord reset instructies te ontvangen",
    "auth.form.instructions.request.step3":
      "Controleer je e-mail voor de reset-link en volg de instructies",
    "auth.form.instructions.confirm.step1": "Maak een sterk wachtwoord dat aan alle eisen voldoet",
    "auth.form.instructions.confirm.step2": "Bevestig je wachtwoord door het opnieuw in te typen",
    "auth.form.instructions.confirm.step3":
      "Klik op 'Wachtwoord resetten' om het proces te voltooien",
    "auth.form.help.password_button": "Krijg hulp bij het maken van een sterk wachtwoord",
    "auth.form.help.password_title": "Tips voor wachtwoord aanmaken",
    "auth.form.help.password_suggestions":
      "Probeer een combinatie van woorden, cijfers en symbolen te gebruiken. Vermijd gangbare wachtwoorden zoals 'wachtwoord123'.",
    "auth.form.help.tip1": "Gebruik een mix van hoofdletters en kleine letters",
    "auth.form.help.tip2": "Voeg cijfers en speciale tekens toe",
    "auth.form.help.tip3": "Vermijd gangbare woorden en reeksen",
    "auth.form.help.tip4": "Overweeg het gebruik van een wachtwoordzin",
  },
  sv: {
    "auth.form.email_invalid_format":
      "Ange en giltig e-postadress i formatet: användare@exempel.se",
    "auth.form.password_length_error": "Lösenordet måste vara minst 8 tecken långt",
    "auth.form.password_uppercase_error": "Lösenordet måste innehålla minst en versal (A-Z)",
    "auth.form.password_lowercase_error": "Lösenordet måste innehålla minst en gemen (a-z)",
    "auth.form.password_number_error": "Lösenordet måste innehålla minst en siffra (0-9)",
    "auth.form.password_special_error":
      "Lösenordet måste innehålla minst ett specialtecken (!@#$%^&*)",
    "auth.form.password_common_error": "Välj ett mindre vanligt lösenord",
    "auth.form.password_repeats_error":
      "Lösenordet får inte innehålla mer än 2 identiska tecken i följd",
    "auth.form.password_sequences_error":
      "Lösenordet får inte innehålla vanliga sekvenser som '123' eller 'abc'",
    "auth.form.instructions.title": "Hur man fyller i detta formulär",
    "auth.form.instructions.request.step1": "Ange din e-postadress i fältet nedan",
    "auth.form.instructions.request.step2":
      "Klicka på 'Skicka återställningslänk' för att få instruktioner för lösenordsåterställning",
    "auth.form.instructions.request.step3":
      "Kontrollera din e-post för återställningslänken och följ instruktionerna",
    "auth.form.instructions.confirm.step1": "Skapa ett starkt lösenord som uppfyller alla krav",
    "auth.form.instructions.confirm.step2": "Bekräfta ditt lösenord genom att skriva det igen",
    "auth.form.instructions.confirm.step3":
      "Klicka på 'Återställ lösenord' för att slutföra processen",
    "auth.form.help.password_button": "Få hjälp med att skapa ett starkt lösenord",
    "auth.form.help.password_title": "Tips för lösenordsskapande",
    "auth.form.help.password_suggestions":
      "Försök använda en kombination av ord, siffror och symboler. Undvik vanliga lösenord som 'lösenord123'.",
    "auth.form.help.tip1": "Använd en blandning av versaler och gemener",
    "auth.form.help.tip2": "Inkludera siffror och specialtecken",
    "auth.form.help.tip3": "Undvik vanliga ord och sekvenser",
    "auth.form.help.tip4": "Överväg att använda en lösenordsfras",
  },
  fi: {
    "auth.form.email_invalid_format":
      "Anna kelvollinen sähköpostiosoite muodossa: käyttäjä@esimerkki.fi",
    "auth.form.password_length_error": "Salasanan on oltava vähintään 8 merkkiä pitkä",
    "auth.form.password_uppercase_error": "Salasanassa on oltava vähintään yksi iso kirjain (A-Z)",
    "auth.form.password_lowercase_error":
      "Salasanassa on oltava vähintään yksi pieni kirjain (a-z)",
    "auth.form.password_number_error": "Salasanassa on oltava vähintään yksi numero (0-9)",
    "auth.form.password_special_error":
      "Salasanassa on oltava vähintään yksi erikoismerkki (!@#$%^&*)",
    "auth.form.password_common_error": "Valitse vähemmän yleinen salasana",
    "auth.form.password_repeats_error":
      "Salasana ei saa sisältää yli 2 peräkkäistä identtistä merkkiä",
    "auth.form.password_sequences_error":
      "Salasana ei saa sisältää yleisiä sarjoja kuten '123' tai 'abc'",
    "auth.form.instructions.title": "Kuinka täyttää tämä lomake",
    "auth.form.instructions.request.step1": "Anna sähköpostiosoitteesi alla olevaan kenttään",
    "auth.form.instructions.request.step2":
      "Napsauta 'Lähetä palautuslinkkiä' saadaksesi salasanan palautusohjeet",
    "auth.form.instructions.request.step3":
      "Tarkista sähköpostisi palautuslinkin varalta ja seuraa ohjeita",
    "auth.form.instructions.confirm.step1": "Luo vahva salasana, joka täyttää kaikki vaatimukset",
    "auth.form.instructions.confirm.step2": "Vahvista salasanasi kirjoittamalla se uudelleen",
    "auth.form.instructions.confirm.step3":
      "Napsauta 'Nollaa salasana' viimeistelläksesi prosessin",
    "auth.form.help.password_button": "Hanki apua vahvan salasanan luomiseen",
    "auth.form.help.password_title": "Salasanan luomisvinkkejä",
    "auth.form.help.password_suggestions":
      "Kokeile sanojen, numeroiden ja symbolien yhdistelmää. Vältä yleisiä salasanoja kuten 'salasana123'.",
    "auth.form.help.tip1": "Käytä sekoitusta isoja ja pieniä kirjaimia",
    "auth.form.help.tip2": "Sisällytä numeroita ja erikoismerkkejä",
    "auth.form.help.tip3": "Vältä yleisiä sanoja ja sarjoja",
    "auth.form.help.tip4": "Harkitse salasanalauseen käyttöä",
  },
};

const localesDir = "/home/daniel/projects/melody-mind/src/i18n/locales";
const localeFiles = ["it.ts", "pt.ts", "da.ts", "nl.ts", "sv.ts", "fi.ts"];

console.log("Adding missing translation keys to locale files...\n");

localeFiles.forEach((file) => {
  const filePath = path.join(localesDir, file);
  const locale = file.replace(".ts", "");

  if (!translations[locale]) {
    console.log(`❌ No translations defined for ${locale}`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");

  // Find insertion point after existing form validation
  const insertionPoint = content.indexOf('"auth.form.min_length"');
  if (insertionPoint === -1) {
    console.log(`❌ Could not find insertion point in ${locale}`);
    return;
  }

  // Build the new translations block
  const newTranslations = Object.entries(translations[locale])
    .map(([key, value]) => `  "${key}": "${value}",`)
    .join("\n");

  const insertionText = `${newTranslations}
  "auth.form.min_length"`;

  // Replace the insertion point
  content = content.replace('"auth.form.min_length"', insertionText);

  // Write back to file
  fs.writeFileSync(filePath, content, "utf8");

  console.log(
    `✅ Updated ${locale.toUpperCase()}: Added ${Object.keys(translations[locale]).length} keys`
  );
});

console.log("\n✅ All locale files updated successfully!");
