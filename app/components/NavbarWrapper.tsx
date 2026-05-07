import { fetchSiteSettings } from "@/sanity/lib/fetch";
import { siteConfig } from "@/config/siteConfig";
import { Navbar } from "./Navbar";

/**
 * Thin Server Component wrapper that fetches CMS-managed site settings and
 * passes them as props to the client-side Navbar. Uses React cache() so
 * multiple pages rendering this in the same request share one fetch.
 */
export async function NavbarWrapper() {
  const { siteName } = await fetchSiteSettings();
  return <Navbar siteName={siteName} menuTriggerImageUrl={siteConfig.menuTriggerImageUrl} />;
}
