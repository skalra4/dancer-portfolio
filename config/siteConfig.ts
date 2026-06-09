/**
 * Structural site configuration — settings that control local assets rather
 * than content.
 *
 * All content (site name, tagline, hero copy/image, bio, social links, contact
 * copy, resume PDF, writing sample PDF) is managed in the Sanity "Site
 * Settings" singleton and fetched via `fetchSiteSettings()` in
 * `sanity/lib/fetch.ts`.
 */

export type SiteConfig = {
  /**
   * Optional PNG/SVG in `public/` (e.g. `/menu-silhouette.png`) or absolute URL.
   * When set, the nav menu button uses this image instead of the hamburger icon.
   * Add the host to `next.config.ts` `images.remotePatterns` if it is external.
   */
  menuTriggerImageUrl?: string | null;
};

export const siteConfig: SiteConfig = {
  menuTriggerImageUrl: null,
};
