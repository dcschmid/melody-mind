import crypto from "crypto";

// Konstanten für CSRF-Einstellungen
const CSRF_SECRET = process.env.CSRF_SECRET || "melody-mind-csrf-secret"; // In Produktion sollte dies eine sichere Umgebungsvariable sein
const CSRF_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 Stunden in Millisekunden

// Typ für CSRF-Token
export type CsrfToken = {
  token: string;
  expires: number;
};

/**
 * Generiert ein CSRF-Token
 */
export function generateCsrfToken(): CsrfToken {
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + CSRF_TOKEN_EXPIRY;

  // Erstelle einen HMAC mit dem Secret und dem Ablaufdatum
  const hmac = crypto.createHmac("sha256", CSRF_SECRET);
  hmac.update(`${randomBytes}:${expires}`);
  const signature = hmac.digest("hex");

  // Das Token besteht aus den zufälligen Bytes, dem Ablaufdatum und der Signatur
  const token = `${randomBytes}:${expires}:${signature}`;

  return {
    token,
    expires,
  };
}

/**
 * Verifiziert ein CSRF-Token
 */
export function verifyCsrfToken(token: string): boolean {
  try {
    // Teile das Token in seine Bestandteile auf
    const [randomBytes, expiresStr, receivedSignature] = token.split(":");
    const expires = parseInt(expiresStr, 10);

    // Prüfe, ob das Token abgelaufen ist
    if (Date.now() > expires) {
      return false;
    }

    // Berechne die erwartete Signatur
    const hmac = crypto.createHmac("sha256", CSRF_SECRET);
    hmac.update(`${randomBytes}:${expires}`);
    const expectedSignature = hmac.digest("hex");

    // Vergleiche die Signaturen mit einer sicheren Methode
    // Da timingSafeEqual Buffer-Probleme haben kann, verwenden wir eine einfachere aber sichere Methode
    const receivedBuffer = Buffer.from(receivedSignature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    // Vergleiche die Länge und dann jeden Byte einzeln mit konstanter Zeit
    if (receivedBuffer.length !== expectedBuffer.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < receivedBuffer.length; i++) {
      // XOR-Operation, die 0 ergibt, wenn die Bytes gleich sind
      result |= receivedBuffer[i] ^ expectedBuffer[i];
    }

    return result === 0;
  } catch (error) {
    return false;
  }
}

/**
 * Erstellt ein CSRF-Cookie und gibt den Token zurück
 */
export function createCsrfCookie(): CsrfToken {
  const csrfToken = generateCsrfToken();

  // In einer echten Anwendung würde hier ein Cookie gesetzt werden
  // Da Astro serverseitig läuft, würde dies in einem API-Endpunkt oder Middleware erfolgen

  return csrfToken;
}

/**
 * Middleware-Funktion zum Schutz vor CSRF-Angriffen
 * Diese Funktion sollte in API-Routen verwendet werden, die Daten ändern (POST, PUT, DELETE)
 */
export function csrfProtection(request: Request): boolean {
  // Hole das CSRF-Token aus dem Header
  const csrfToken = request.headers.get("x-csrf-token");

  // Wenn kein Token vorhanden ist, ist die Anfrage ungültig
  if (!csrfToken) {
    return false;
  }

  // Verifiziere das Token
  return verifyCsrfToken(csrfToken);
}
