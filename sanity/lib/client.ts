import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Lazy Sanity client singleton.
 *
 * `createClient` validates `projectId` at construction time, so we defer
 * instantiation until the first actual fetch call.  `isSanityReady()` in
 * fetch.ts guards every call site, so this function is never reached when
 * env vars are absent (build without .env.local, CI, etc.).
 *
 * `useCdn: false` — every fetch hits Sanity's live API. We pair this with
 * Next.js on-demand revalidation (`/api/revalidate` route + Sanity webhook),
 * so editors get instant updates after publishing without the ~60s CDN lag.
 * Pages are statically prerendered and only refetched when the webhook fires.
 */
let _client: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  if (!_client) {
    _client = createClient({ projectId, dataset, apiVersion, useCdn: false });
  }
  return _client;
}
