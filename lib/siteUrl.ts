/**
 * Resolve the site's base URL across local dev, preview deployments, and prod.
 *
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL  — set explicitly in Vercel for production
 *   2. VERCEL_URL            — auto-set by Vercel on each deployment (no protocol)
 *   3. http://localhost:3000 — local fallback
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.startsWith("http") ? explicit : `https://${explicit}`;
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
