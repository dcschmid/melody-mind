import { defineMiddleware } from "astro:middleware";

import { languages, defaultLang } from "./i18n/ui";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect } = context;
  const pathname = url.pathname;

  // Add Cache-Control headers for static assets to optimize edge caching
  const staticAssetExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".avif",
    ".svg",
    ".ico",
    ".css",
    ".js",
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
    ".eot",
    ".pdf",
    ".zip",
    ".mp3",
    ".mp4",
    ".webm",
    ".ogg",
  ];

  const isStaticAsset = staticAssetExtensions.some((ext) => pathname.toLowerCase().endsWith(ext));

  if (isStaticAsset) {
    const response = await next();

    // Set aggressive caching for static assets (1 year)
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");

    // Add additional headers for better edge caching
    response.headers.set("CDN-Cache-Control", "public, max-age=31536000");

    return response;
  }

  // Set shorter cache for HTML pages (5 minutes with stale-while-revalidate)
  if (pathname.endsWith("/") || (!pathname.includes(".") && !pathname.startsWith("/api/"))) {
    const response = await next();
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
    return response;
  }

  // Redirect root to default language
  if (pathname === "/") {
    return redirect(`/${defaultLang}`);
  }

  // Skip language redirection for API routes
  if (pathname.startsWith("/api/")) {
    return next();
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
