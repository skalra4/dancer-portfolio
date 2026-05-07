import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Studio + revalidation API are operational endpoints — no SEO value.
        disallow: ["/studio", "/studio/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
