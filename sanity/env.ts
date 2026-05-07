/**
 * Sanity environment variables.
 *
 * Copy .env.local.example → .env.local and fill in your project values.
 *
 * ⚠  We intentionally fall back to empty strings instead of throwing so the
 * build succeeds without env vars.  The actual client call is guarded by
 * `isSanityReady()` in sanity/lib/fetch.ts — it short-circuits to the
 * static content.json fallback when either value is absent.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/**
 * Pin to a date in YYYY-MM-DD format.  Pinning keeps the API stable across
 * Sanity releases.  Update to a newer date when you want new API features.
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-03-01";
