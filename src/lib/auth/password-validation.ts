// Liste häufig verwendeter Passwörter (gekürzt für dieses Beispiel)
// In einer echten Anwendung sollte eine umfangreichere Liste verwendet werden
const COMMON_PASSWORDS = [
  "password",
  "password123",
  "123456",
  "12345678",
  "qwerty",
  "admin",
  "welcome",
  "letmein",
  "monkey",
  "abc123",
  "football",
  "iloveyou",
  "trustno1",
  "sunshine",
  "master",
  "welcome1",
  "shadow",
  "ashley",
  "baseball",
  "access",
  "michael",
  "superman",
  "batman",
  "starwars",
];

// Konstanten für Passwortanforderungen
const MIN_PASSWORD_LENGTH = 8;
const REQUIRE_UPPERCASE = true;
const REQUIRE_LOWERCASE = true;
const REQUIRE_NUMBER = true;
const REQUIRE_SPECIAL_CHAR = true;

// Typ für Validierungsergebnisse
export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

/**
 * Validiert ein Passwort anhand verschiedener Kriterien
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  // Prüfe die Mindestlänge
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`auth.password.min_length_error`);
  }

  // Prüfe auf Großbuchstaben
  if (REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push("auth.password.uppercase_error");
  }

  // Prüfe auf Kleinbuchstaben
  if (REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push("auth.password.lowercase_error");
  }

  // Prüfe auf Zahlen
  if (REQUIRE_NUMBER && !/[0-9]/.test(password)) {
    errors.push("auth.password.number_error");
  }

  // Prüfe auf Sonderzeichen
  if (REQUIRE_SPECIAL_CHAR && !/[^A-Za-z0-9]/.test(password)) {
    errors.push("auth.password.special_char_error");
  }

  // Prüfe auf häufig verwendete Passwörter
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push("auth.password.common_password");
  }

  // Prüfe auf Wiederholungen
  if (/(.)\1{2,}/.test(password)) {
    errors.push("auth.password.repeats_error");
  }

  // Prüfe auf Sequenzen
  const sequences = ["123456", "abcdef", "qwerty", "asdfgh"];
  for (const seq of sequences) {
    for (let i = 0; i < seq.length - 2; i++) {
      const subSeq = seq.substring(i, i + 3);
      if (password.toLowerCase().includes(subSeq)) {
        errors.push("auth.password.sequence_error");
        break;
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generiert ein zufälliges sicheres Passwort
 */
export function generateSecurePassword(length = 16): string {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

  // Stelle sicher, dass das Passwort mindestens einen Zeichen jeder Kategorie enthält
  let password = "";
  password += uppercaseChars.charAt(
    Math.floor(Math.random() * uppercaseChars.length),
  );
  password += lowercaseChars.charAt(
    Math.floor(Math.random() * lowercaseChars.length),
  );
  password += numberChars.charAt(
    Math.floor(Math.random() * numberChars.length),
  );
  password += specialChars.charAt(
    Math.floor(Math.random() * specialChars.length),
  );

  // Fülle den Rest des Passworts mit zufälligen Zeichen auf
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Mische die Zeichen
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}

/**
 * Berechnet die Stärke eines Passworts (0-100)
 */
export function calculatePasswordStrength(password: string): number {
  let strength = 0;

  // Länge
  strength += Math.min(password.length * 4, 40);

  // Komplexität
  if (/[A-Z]/.test(password)) strength += 10;
  if (/[a-z]/.test(password)) strength += 10;
  if (/[0-9]/.test(password)) strength += 10;
  if (/[^A-Za-z0-9]/.test(password)) strength += 10;

  // Abzüge für häufig verwendete Passwörter
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) strength -= 30;

  // Abzüge für Wiederholungen
  if (/(.)\1{2,}/.test(password)) strength -= 10;

  // Abzüge für Sequenzen
  const sequences = ["123456", "abcdef", "qwerty", "asdfgh"];
  for (const seq of sequences) {
    for (let i = 0; i < seq.length - 2; i++) {
      const subSeq = seq.substring(i, i + 3);
      if (password.toLowerCase().includes(subSeq)) {
        strength -= 10;
        break;
      }
    }
  }

  // Begrenze die Stärke auf 0-100
  return Math.max(0, Math.min(100, strength));
}
