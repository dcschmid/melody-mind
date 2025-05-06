import type { APIRoute } from "astro";
import { authService } from "../../../../lib/auth/auth-service.js";
import { getClientIp } from "../../../../lib/auth/middleware.js";
import { getLangFromUrl, useTranslations } from "../../../../utils/i18n.js";

export const POST: APIRoute = async ({ request, params }) => {
  // Extrahiere die Sprache aus den URL-Parametern
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Extrahiere die Anmeldedaten aus dem Request-Body
    const body = await request.json();
    const { email, password } = body;

    // Validiere die Eingaben
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: t("auth.login.error"),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Extrahiere die IP-Adresse für Rate-Limiting
    const ip = getClientIp(request);

    // Führe die Anmeldung durch
    const result = await authService.login(email, password, ip);

    if (!result.success) {
      // Bei Rate-Limiting einen 429-Status zurückgeben
      if (result.rateLimited) {
        return new Response(
          JSON.stringify({
            success: false,
            error: result.error,
            rateLimited: true,
            resetTime: result.resetTime,
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": Math.ceil(
                (result.resetTime || 0) / 1000,
              ).toString(),
            },
          },
        );
      }

      // Bei anderen Fehlern einen 401-Status zurückgeben
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error,
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Setze Cookies für Tokens
    const accessTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Stunden
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Tage

    // Erfolgreiche Anmeldung
    return new Response(
      JSON.stringify({
        success: true,
        user: result.user,
        csrfToken: result.csrfToken?.token,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `access_token=${result.tokens?.accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${accessTokenExpiry.toUTCString()}`,
        },
      },
    );
  } catch (error) {
    console.error("Fehler bei der Anmeldung:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: t("auth.form.error"),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
