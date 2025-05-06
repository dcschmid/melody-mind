import type { APIRoute } from "astro";
import { authService } from "../../../../lib/auth/auth-service.js";
import { getLangFromUrl, useTranslations } from "../../../../utils/i18n.js";

// Anforderung eines Passwort-Resets
export const POST: APIRoute = async ({ request, params }) => {
  // Extrahiere die Sprache aus den URL-Parametern
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Extrahiere die E-Mail-Adresse aus dem Request-Body
    const body = await request.json();
    const { email } = body;

    // Validiere die Eingabe
    if (!email) {
      return new Response(
        JSON.stringify({
          success: false,
          error: t("auth.form.required"),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Fordere einen Passwort-Reset an
    const success = await authService.requestPasswordReset(email);

    // Gib immer eine erfolgreiche Antwort zurück, um keine Informationen über existierende
    // E-Mail-Adressen preiszugeben (Sicherheitsmaßnahme)
    return new Response(
      JSON.stringify({
        success: true,
        message: t("auth.password_reset.success"),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Fehler bei der Passwort-Reset-Anforderung:", error);

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

// Durchführung eines Passwort-Resets
export const PUT: APIRoute = async ({ request, params }) => {
  // Extrahiere die Sprache aus den URL-Parametern
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Extrahiere den Token und das neue Passwort aus dem Request-Body
    const body = await request.json();
    const { token, newPassword } = body;

    // Validiere die Eingaben
    if (!token || !newPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          error: t("auth.form.required"),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Setze das Passwort zurück
    const result = await authService.resetUserPassword(token, newPassword);

    if (!result.success) {
      // Bei Validierungsfehlern einen 400-Status zurückgeben
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error,
          validationErrors: result.validationErrors,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Erfolgreiche Passwort-Zurücksetzung
    return new Response(
      JSON.stringify({
        success: true,
        message: t("auth.password_reset_confirm.success"),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Fehler beim Zurücksetzen des Passworts:", error);

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
