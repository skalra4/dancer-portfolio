import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  return [
    { url: `${base}/`, lastModified, changeFrequency: "monthly", priority: 1.0 },
    { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/portfolio`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/resume`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];
}
