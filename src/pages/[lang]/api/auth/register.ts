import type { APIRoute } from "astro";
import { authService } from "../../../../lib/auth/auth-service.js";
import { getLangFromUrl, useTranslations } from "../../../../utils/i18n.js";

export const POST: APIRoute = async ({ request, params }) => {
  // Extrahiere die Sprache aus den URL-Parametern
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Extrahiere die Registrierungsdaten aus dem Request-Body
    const body = await request.json();
    const { email, password, username } = body;

    // Validiere die Eingaben
    if (!email || !password) {
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

    // Führe die Registrierung durch
    const result = await authService.register({
      email,
      password,
      username,
    });

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

    // Erfolgreiche Registrierung
    return new Response(
      JSON.stringify({
        success: true,
        user: result.user,
        message: t("auth.register.success"),
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);

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
