import { defineMiddleware } from "astro:middleware";

import { languages, defaultLang } from "./i18n/ui";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect } = context;
  const pathname = url.pathname;

  // Redirect root to default language
  if (pathname === "/") {
    return redirect(`/${defaultLang}`);
  }

  // Handle missing language prefix
  const [, lang] = pathname.split("/");
  if (!lang || !(lang in languages)) {
    return redirect(`/${defaultLang}${pathname}`);
  }

  // Legal pages fallback handling
  // Languages that have native legal page translations
  const nativeLanguages = ["en", "de"];

  // If accessing legal pages in a non-native language, redirect to English
  if (!nativeLanguages.includes(lang)) {
    if (pathname.endsWith("/impressum") || pathname.endsWith("/datenschutz")) {
      const targetPage = pathname.endsWith("/impressum") ? "legal-notice" : "privacy-policy";
      return redirect(`/en/${targetPage}`, 302);
    }

    if (pathname.endsWith("/legal-notice") || pathname.endsWith("/privacy-policy")) {
      const targetPage = pathname.split("/").pop();
      return redirect(`/en/${targetPage}`, 302);
    }
  }

  return next();
});
