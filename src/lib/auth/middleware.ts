import { verifyAccessToken } from "./jwt.js";
import type { JwtPayload } from "./jwt.js";
import { getUserByEmail } from "./db.js";
import { csrfProtection } from "./csrf.js";
import { rateLimitMiddleware } from "./rate-limit.js";

// Typ für den Authentifizierungskontext
export type AuthContext = {
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
  };
  error?: string;
};

/**
 * Middleware zur Authentifizierung von Anfragen
 * Diese Funktion extrahiert und verifiziert das JWT-Token aus dem Authorization-Header
 */
export async function authenticateRequest(
  request: Request,
): Promise<AuthContext> {
  // Extrahiere das Token aus dem Authorization-Header
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      authenticated: false,
      error: "Kein Authentifizierungstoken vorhanden",
    };
  }

  const token = authHeader.substring(7); // Entferne "Bearer " vom Header

  // Verifiziere das Token
  const payload = verifyAccessToken(token);
  if (!payload) {
    return {
      authenticated: false,
      error: "Ungültiges oder abgelaufenes Token",
    };
  }

  // Optional: Hole zusätzliche Benutzerinformationen aus der Datenbank
  // In einer echten Anwendung könnten hier z.B. Benutzerrollen geladen werden
  const user = await getUserByEmail(payload.email);
  if (!user) {
    return { authenticated: false, error: "Benutzer nicht gefunden" };
  }

  return {
    authenticated: true,
    user: {
      id: payload.userId,
      email: payload.email,
    },
  };
}

/**
 * Middleware zum Schutz von Routen, die eine Authentifizierung erfordern
 */
export async function requireAuth(
  request: Request,
): Promise<{ authorized: boolean; context?: AuthContext; error?: string }> {
  const authContext = await authenticateRequest(request);

  if (!authContext.authenticated) {
    return {
      authorized: false,
      error: authContext.error || "Nicht authentifiziert",
    };
  }

  return {
    authorized: true,
    context: authContext,
  };
}

/**
 * Kombinierte Middleware für Authentifizierung, CSRF-Schutz und Rate-Limiting
 * Diese Funktion sollte für alle POST/PUT/DELETE-Anfragen verwendet werden
 */
export async function protectRoute(
  request: Request,
): Promise<{
  authorized: boolean;
  context?: AuthContext;
  error?: string;
  rateLimited?: boolean;
  resetTime?: number;
}> {
  // Prüfe Rate-Limiting für Login-Routen
  if (request.url.includes("/api/auth/login")) {
    const rateLimitResult = rateLimitMiddleware(request);
    if (rateLimitResult.limited) {
      return {
        authorized: false,
        error: "Zu viele Anmeldeversuche. Bitte versuche es später erneut.",
        rateLimited: true,
        resetTime: rateLimitResult.resetTime,
      };
    }
  }

  // Prüfe CSRF-Schutz für Mutationen (POST, PUT, DELETE)
  const method = request.method.toUpperCase();
  if (["POST", "PUT", "DELETE"].includes(method)) {
    const csrfValid = csrfProtection(request);
    if (!csrfValid) {
      return {
        authorized: false,
        error: "Ungültiges oder fehlendes CSRF-Token",
      };
    }
  }

  // Prüfe Authentifizierung
  return requireAuth(request);
}

/**
 * Hilfsfunktion zum Extrahieren der Client-IP-Adresse aus einer Anfrage
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown-ip"
  );
}
