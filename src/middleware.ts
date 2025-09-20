import { isSupportedLanguage } from "@constants/languages";
import { defineMiddleware } from "astro:middleware";

import { defaultLang } from "./i18n/ui";

/**
 * Middleware for MelodyMind
 *
 * - Adds caching headers for static assets and HTML routes
 * - Redirects requests without language prefix to the default language
 * - Provides special handling for legal pages to fall back to English when needed
 *
 * The implementation is intentionally split into small helpers to keep the main
 * middleware function readable and to reduce cyclomatic complexity for linting.
 */

/**
 * List of file extensions that are considered static assets and eligible
 * for aggressive caching.
 */
const STATIC_ASSET_EXTENSIONS = [
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

/**
 * Return true if the given pathname looks like a static asset.
 */
function isStaticAssetPath(pathname: string): boolean {
  const lower = pathname.toLowerCase();
  return STATIC_ASSET_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/**
 * Apply caching and CORS headers for static assets. Mutates the response.
 */
function setStaticAssetHeaders(response: Response, pathname: string): void {
  // Aggressive caching for static assets (1 year, immutable)
  response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  response.headers.set("CDN-Cache-Control", "public, max-age=31536000");

  const lower = pathname.toLowerCase();
  // If this looks like a font, ensure cross-origin is allowed and set a sensible Content-Type if missing
  if (
    lower.endsWith(".woff2") ||
    lower.endsWith(".woff") ||
    lower.endsWith(".ttf") ||
    lower.endsWith(".otf") ||
    lower.endsWith(".eot")
  ) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    // Only set Content-Type for the common case of woff2 if it's not set already
    if (!response.headers.get("Content-Type") && lower.endsWith(".woff2")) {
      response.headers.set("Content-Type", "font/woff2");
    }
  }
}

/**
 * Return true when the route should be treated as HTML (short caching).
 * This considers trailing slash routes and routes without a file extension
 * that are not API endpoints.
 */
function isHtmlRoute(pathname: string): boolean {
  return pathname.endsWith("/") || (!pathname.includes(".") && !pathname.startsWith("/api/"));
}

/**
 * If a request targets a language-specific legal page but the requested
 * language does not have native translations, return a fallback target
 * (English) or null if no redirect is needed.
 */
function resolveLegalRedirect(pathname: string, lang: string | undefined): string | null {
  const nativeLanguages = ["en", "de"];
  if (!lang || nativeLanguages.includes(lang)) {
    return null;
  }

  // German "impressum" and "datenschutz" are canonical; redirect to English equivalents
  if (pathname.endsWith("/impressum") || pathname.endsWith("/datenschutz")) {
    const targetPage = pathname.endsWith("/impressum") ? "legal-notice" : "privacy-policy";
    return `/en/${targetPage}`;
  }

  // If someone requests the English routes but with a non-native language prefix,
  // keep the English page under /en/
  if (pathname.endsWith("/legal-notice") || pathname.endsWith("/privacy-policy")) {
    const targetPage = pathname.split("/").pop();
    return targetPage ? `/en/${targetPage}` : `/en`;
  }

  return null;
}

/**
 * Main middleware entry point
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect } = context;
  const pathname = url.pathname;

  try {
    // 1) Static assets: serve then attach long-lived caching headers
    if (isStaticAssetPath(pathname)) {
      const response = await next();
      try {
        setStaticAssetHeaders(response, pathname);
      } catch (e) {
        // Defensive: don't break the request on header-setting failures
        try {
          console.warn("[middleware] failed to set static asset headers:", e);
        } catch {
          void 0;
        }
      }
      return response;
    }

    // 2) HTML routes: short caching so content updates quickly
    if (isHtmlRoute(pathname)) {
      const response = await next();
      response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
      return response;
    }

    // 3) Redirect root to default language
    if (pathname === "/") {
      return redirect(`/${defaultLang}`);
    }

    // 4) API routes: bypass language logic
    if (pathname.startsWith("/api/")) {
      return next();
    }

    // 5) If no language prefix present or unknown, redirect to default language preserving path
  const [, lang] = pathname.split("/");
    if (!lang || !isSupportedLanguage(lang)) {
      return redirect(`/${defaultLang}${pathname}`);
    }

    // 6) Special handling for legal pages when language lacks native translations
    const legalRedirect = resolveLegalRedirect(pathname, lang);
    if (legalRedirect) {
      return redirect(legalRedirect, 302);
    }

    return next();
  } catch (err) {
    // Fail open: on unexpected errors, log and continue request pipeline.
    try {
      console.error("[middleware] unexpected error:", err);
    } catch {
      void 0;
    }
    return next();
  }
});
