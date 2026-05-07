/**
 * Structural site configuration — settings that control file paths and local
 * assets rather than content.
 *
 * All content (site name, tagline, hero copy/image, bio, social links, contact
 * copy) is managed in the Sanity "Site Settings" singleton and fetched via
 * `fetchSiteSettings()` in `sanity/lib/fetch.ts`.
 */

export type SiteConfig = {
  /**
   * Optional PNG/SVG in `public/` (e.g. `/menu-silhouette.png`) or absolute URL.
   * When set, the nav menu button uses this image instead of the hamburger icon.
   * Add the host to `next.config.ts` `images.remotePatterns` if it is external.
   */
  menuTriggerImageUrl?: string | null;
  /** Path under `public/` for the downloadable PDF resume (e.g. "/resume.pdf") */
  resumePdfPath: string;
};

export const siteConfig: SiteConfig = {
  menuTriggerImageUrl: null,
  resumePdfPath: "/resume.pdf",
};
