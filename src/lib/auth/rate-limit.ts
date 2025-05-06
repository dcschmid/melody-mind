// In-Memory-Speicher für Rate-Limiting
// In einer Produktionsumgebung sollte ein persistenter Speicher wie Redis verwendet werden
const loginAttempts: Record<string, { count: number; resetTime: number }> = {};

// Konstanten für Rate-Limiting-Einstellungen
const MAX_LOGIN_ATTEMPTS = 5; // Maximale Anzahl von Anmeldeversuchen
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 Minuten in Millisekunden
const IP_BLOCK_DURATION_MS = 60 * 60 * 1000; // 1 Stunde in Millisekunden

/**
 * Prüft, ob eine IP-Adresse das Rate-Limit überschritten hat
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Bereinige abgelaufene Einträge
  cleanupExpiredEntries();

  // Wenn die IP nicht im Speicher ist, ist sie nicht limitiert
  if (!loginAttempts[ip]) {
    return false;
  }

  // Wenn die Reset-Zeit in der Zukunft liegt und die maximale Anzahl von Versuchen erreicht ist,
  // ist die IP limitiert
  return (
    loginAttempts[ip].resetTime > now &&
    loginAttempts[ip].count >= MAX_LOGIN_ATTEMPTS
  );
}

/**
 * Registriert einen fehlgeschlagenen Anmeldeversuch für eine IP-Adresse
 */
export function recordFailedLoginAttempt(ip: string): void {
  const now = Date.now();

  // Wenn die IP nicht im Speicher ist oder die Reset-Zeit abgelaufen ist,
  // erstelle einen neuen Eintrag
  if (!loginAttempts[ip] || loginAttempts[ip].resetTime <= now) {
    loginAttempts[ip] = {
      count: 1,
      resetTime: now + LOGIN_WINDOW_MS,
    };
    return;
  }

  // Erhöhe die Anzahl der Versuche
  loginAttempts[ip].count += 1;

  // Wenn die maximale Anzahl von Versuchen erreicht ist, verlängere die Sperrzeit
  if (loginAttempts[ip].count >= MAX_LOGIN_ATTEMPTS) {
    loginAttempts[ip].resetTime = now + IP_BLOCK_DURATION_MS;
  }
}

/**
 * Setzt das Rate-Limit für eine IP-Adresse zurück (z.B. nach erfolgreicher Anmeldung)
 */
export function resetRateLimit(ip: string): void {
  delete loginAttempts[ip];
}

/**
 * Gibt die verbleibende Zeit bis zum Zurücksetzen des Rate-Limits zurück
 */
export function getRateLimitResetTime(ip: string): number {
  if (!loginAttempts[ip]) {
    return 0;
  }

  const now = Date.now();
  const resetTime = loginAttempts[ip].resetTime;

  return Math.max(0, resetTime - now);
}

/**
 * Gibt die Anzahl der verbleibenden Anmeldeversuche zurück
 */
export function getRemainingLoginAttempts(ip: string): number {
  if (!loginAttempts[ip]) {
    return MAX_LOGIN_ATTEMPTS;
  }

  return Math.max(0, MAX_LOGIN_ATTEMPTS - loginAttempts[ip].count);
}

/**
 * Bereinigt abgelaufene Einträge aus dem Speicher
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();

  Object.keys(loginAttempts).forEach((ip) => {
    if (loginAttempts[ip].resetTime <= now) {
      delete loginAttempts[ip];
    }
  });
}

/**
 * Middleware-Funktion für Rate-Limiting
 * Diese Funktion sollte in API-Routen für die Anmeldung verwendet werden
 */
export function rateLimitMiddleware(request: Request): {
  limited: boolean;
  resetTime?: number;
} {
  // In einer echten Anwendung würde die IP-Adresse aus dem Request extrahiert werden
  // Hier verwenden wir die IP aus dem X-Forwarded-For-Header oder die Remote-Adresse
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown-ip";

  if (isRateLimited(ip)) {
    return {
      limited: true,
      resetTime: getRateLimitResetTime(ip),
    };
  }

  return { limited: false };
}
