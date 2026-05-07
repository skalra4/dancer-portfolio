import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

/**
 * Embeds Sanity Studio at /studio.
 *
 * `force-static` renders the Studio shell as a static HTML page; the
 * Studio itself loads and runs entirely client-side after the shell hydrates.
 * This gives the fastest initial load without any per-request server work.
 */
export const dynamic = "force-dynamic";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
