import { verifyAccessToken } from "../lib/auth/jwt.js";
import type { JwtPayload } from "../lib/auth/jwt.js";

/**
 * Prüft, ob ein gültiger JWT-Token in den Cookies vorhanden ist
 * und leitet bei fehlendem Token zur Login-Seite um
 *
 * @param request - Die Astro-Request
 * @param redirectUrl - Die URL, zu der nach erfolgreicher Anmeldung zurückgeleitet werden soll
 * @returns Ein Objekt mit dem Authentifizierungsstatus und ggf. dem Benutzer
 */
export async function requireAuth(request: Request): Promise<{
  authenticated: boolean;
  user?: { id: string; email: string };
  redirectToLogin?: Response;
}> {
  // Cookie-Header aus der Anfrage extrahieren
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    // Kein Cookie vorhanden, zur Login-Seite umleiten
    return {
      authenticated: false,
      redirectToLogin: createLoginRedirect(request.url),
    };
  }

  // Access-Token aus den Cookies extrahieren
  const accessToken = extractCookieValue(cookieHeader, "access_token");

  if (!accessToken) {
    // Kein Access-Token vorhanden, zur Login-Seite umleiten
    return {
      authenticated: false,
      redirectToLogin: createLoginRedirect(request.url),
    };
  }

  // Token verifizieren
  const payload = verifyAccessToken(accessToken);

  if (!payload || !payload.userId) {
    // Ungültiges oder abgelaufenes Token, zur Login-Seite umleiten
    return {
      authenticated: false,
      redirectToLogin: createLoginRedirect(request.url),
    };
  }

  // Authentifizierung erfolgreich
  return {
    authenticated: true,
    user: {
      id: payload.userId,
      email: payload.email,
    },
  };
}

/**
 * Extrahiert den Wert eines bestimmten Cookies aus dem Cookie-Header
 */
function extractCookieValue(
  cookieHeader: string,
  cookieName: string,
): string | null {
  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === cookieName) {
      return value;
    }
  }

  return null;
}

/**
 * Erstellt eine Redirect-Response zur Login-Seite mit der aktuellen URL als Redirect-Parameter
 */
function createLoginRedirect(currentUrl: string): Response {
  const url = new URL(currentUrl);
  const lang = url.pathname.split("/")[1] || "de"; // Extrahiere die Sprache aus der URL oder verwende 'de' als Fallback
  const redirectParam = encodeURIComponent(url.pathname);

  return new Response(null, {
    status: 302,
    headers: {
      Location: `/${lang}/auth/login?redirect=${redirectParam}`,
    },
  });
}
