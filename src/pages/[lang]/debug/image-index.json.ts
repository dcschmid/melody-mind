import { __debugGetVariantIndexSnapshot } from "../../../utils/images/optimizedImageVariants";

export const prerender = false; // SSR only

/**
 * getStaticPaths provides all supported locales so the debug endpoint is available
 * under /{lang}/debug/image-index.json. Diagnostic only.
 */
export function getStaticPaths(): { params: { lang: string } }[] {
  const locales = ["cn","da","de","en","es","fi","fr","it","jp","nl","pt","ru","sv","uk"];
  return locales.map((lang) => ({ params: { lang } }));
}

/**
 * Returns a JSON snapshot of the optimized image variant index (first 20 keys).
 * NOTE: Diagnostic endpoint – remove or guard before production deployment.
 */
export async function GET(): Promise<Response> {
  const snapshot = __debugGetVariantIndexSnapshot();
  return new Response(JSON.stringify({
    note: "Diagnostic – remove before production deploy",
    timestamp: new Date().toISOString(),
    ...snapshot,
  }, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
