import { __debugGetVariantIndexSnapshot } from "../../utils/images/optimizedImageVariants";

export const prerender = false; // ensure SSR so we see runtime behavior

/**
 * Returns a JSON snapshot of the internal optimized image variant index.
 * Diagnostic endpoint only – do NOT expose in production deployments unless guarded.
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
