/**
 * Async data fetching layer.
 *
 * Every function tries Sanity first (when env vars are present), then
 * falls back to the static data/content.json so the site works locally
 * without a Sanity project configured.
 *
 * Components should always call these functions rather than importing
 * from data/content.ts directly, so swapping the data source is
 * a one-file change.
 */

import { cache } from "react";
import { getSanityClient } from "./client";
import { PORTFOLIO_QUERY, RESUME_SECTIONS_QUERY, SITE_SETTINGS_QUERY } from "./queries";
import {
  normalisePortfolioItem,
  normaliseResumeSection,
  portfolioItems as jsonPortfolioItems,
  portfolioSection as jsonPortfolioSection,
  PORTFOLIO_CATEGORIES as jsonCategories,
  resumeSections as jsonResumeSections,
  resumeHeadline as jsonResumeHeadline,
  resumeContact as jsonResumeContact,
  type RawPortfolioItem,
  type RawResumeSection,
  type PortfolioItem,
  type ResumeSection,
} from "@/data/content";

// ── Sanity availability check ───────────────────────────────────────────────

/**
 * Returns true only when BOTH required env vars are non-empty strings.
 * Called at runtime so switching from JSON → Sanity requires only adding
 * the env vars — no code changes.
 */
function isSanityReady(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() &&
      process.env.NEXT_PUBLIC_SANITY_DATASET?.trim(),
  );
}

// ── Public fetch helpers ────────────────────────────────────────────────────

export type PortfolioContent = {
  items: PortfolioItem[];
  categories: string[];
  section: { title: string; description: string };
};

/**
 * Build the filter-pill list from the actual published portfolio items so the
 * UI auto-updates whenever the dancer adds, removes, or recategorises items in
 * the Studio — no schema or code changes required.
 *
 * Categories appear in the order of first occurrence (which is itself sorted
 * by `sortOrder` in the GROQ query). If no items are present, falls back to
 * the categories list in content.json.
 */
function deriveCategories(items: PortfolioItem[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const item of items) {
    const cat = item.category?.trim();
    if (cat && !seen.has(cat)) {
      seen.add(cat);
      ordered.push(cat);
    }
  }
  return ordered.length > 0 ? ordered : jsonCategories;
}

/**
 * Fetch all portfolio items plus the section metadata (title, description)
 * and the list of filter categories.
 *
 * Items come from Sanity when configured, otherwise from content.json.
 * Filter categories are derived from the items themselves so they always match
 * what's actually published.
 */
export async function fetchPortfolioContent(): Promise<PortfolioContent> {
  if (!isSanityReady()) {
    return {
      items: jsonPortfolioItems,
      categories: deriveCategories(jsonPortfolioItems),
      section: jsonPortfolioSection,
    };
  }

  try {
    const raw = await getSanityClient().fetch<RawPortfolioItem[]>(PORTFOLIO_QUERY);
    const items = raw
      .map(normalisePortfolioItem)
      .filter((x): x is PortfolioItem => x !== null);

    return {
      items,
      categories: deriveCategories(items),
      section: jsonPortfolioSection,
    };
  } catch (err) {
    console.error("[Sanity] fetchPortfolioContent failed, using JSON fallback:", err);
    return {
      items: jsonPortfolioItems,
      categories: deriveCategories(jsonPortfolioItems),
      section: jsonPortfolioSection,
    };
  }
}

export type ResumeHeader = {
  headline: string;
  contact: {
    email?: string;
    phone?: string | null;
    location?: string | null;
    website?: string | null;
  };
};

/**
 * Fetch the resume headline and contact line.
 *
 * Currently sourced from content.json only.
 * To manage it in Sanity, create a `resumeSettings` singleton document
 * and add a GROQ query here.
 */
export async function fetchResumeHeader(): Promise<ResumeHeader> {
  return { headline: jsonResumeHeadline, contact: jsonResumeContact };
}

/**
 * Fetch all resume sections (Education, Performance, Awards, …) in sort order.
 *
 * Sections come from Sanity when configured, otherwise from content.json.
 */
export async function fetchResumeSections(): Promise<ResumeSection[]> {
  if (!isSanityReady()) {
    return jsonResumeSections;
  }

  try {
    const raw = await getSanityClient().fetch<RawResumeSection[]>(RESUME_SECTIONS_QUERY);
    return raw
      .map(normaliseResumeSection)
      .filter((x): x is ResumeSection => x !== null);
  } catch (err) {
    console.error("[Sanity] fetchResumeSections failed, using JSON fallback:", err);
    return jsonResumeSections;
  }
}

// ── Site settings ────────────────────────────────────────────────────────────

export type CmsImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type SiteSettings = {
  siteName: string;
  siteTagline: string;
  seoDescription: string;
  hero: {
    backgroundImageUrl: string;
    roleTagline: string;
    headline: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
  };
  bio: string;
  bioTeaser: string;
  social: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  about: {
    image: CmsImage;
  };
  contactTitle: string;
  contactDescription: string;
  contactEmail: string;
  contactPhone: string;
  contact: {
    image: CmsImage;
  };
};

/** Hard-coded defaults — used when Sanity is not configured or returns nothing. */
const SETTINGS_FALLBACK: SiteSettings = {
  siteName: "Zamora",
  siteTagline: "Dancer & Artist",
  seoDescription: "Professional portfolio — dance, performance, and artistic work.",
  hero: {
    backgroundImageUrl: "/herobackground.jpeg",
    roleTagline: "Dancer · Artist",
    headline: "Zamora Tamminga",
    subtitle: "Movement, expression, and performance crafted for stage and screen.",
    ctaLabel: "View Portfolio",
    ctaHref: "/portfolio",
  },
  bio: `Zamora is a performer and educator working across concert dance, commercial projects, and the classroom. Training roots in classical technique meet a contemporary eye for storytelling and collaboration.

Recent work includes ensemble and solo roles with regional companies, choreography for stage and screen, and teaching young artists through intensives and open classes.

Based in New York, available for performance, rehearsal direction, and guest teaching.`,
  bioTeaser:
    "Performer, choreographer, and educator — bringing classical training and contemporary voice to stage, screen, and studio.",
  social: {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  },
  about: {
    image: { url: "", alt: "", width: 0, height: 0 },
  },
  contactTitle: "Contact",
  contactDescription: "Booking and inquiries — reach out via email or the form below.",
  contactEmail: "",
  contactPhone: "",
  contact: {
    image: { url: "", alt: "", width: 0, height: 0 },
  },
};

type RawSiteSettings = {
  siteName?: string | null;
  siteTagline?: string | null;
  seoDescription?: string | null;
  heroImageUrl?: string | null;
  heroRoleTagline?: string | null;
  heroHeadline?: string | null;
  heroSubtitle?: string | null;
  heroCtaLabel?: string | null;
  heroCtaHref?: string | null;
  bio?: string | null;
  bioTeaser?: string | null;
  socialInstagram?: string | null;
  socialYoutube?: string | null;
  socialTiktok?: string | null;
  socialTwitter?: string | null;
  socialFacebook?: string | null;
  socialLinkedin?: string | null;
  contactTitle?: string | null;
  contactDescription?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  aboutImageUrl?: string | null;
  aboutImageAlt?: string | null;
  aboutImageWidth?: number | null;
  aboutImageHeight?: number | null;
  contactImageUrl?: string | null;
  contactImageAlt?: string | null;
  contactImageWidth?: number | null;
  contactImageHeight?: number | null;
};

function normaliseSiteSettings(raw: RawSiteSettings | null): SiteSettings {
  const fb = SETTINGS_FALLBACK;
  if (!raw) return fb;
  return {
    siteName: raw.siteName?.trim() || fb.siteName,
    siteTagline: raw.siteTagline?.trim() || fb.siteTagline,
    seoDescription: raw.seoDescription?.trim() || fb.seoDescription,
    hero: {
      backgroundImageUrl: raw.heroImageUrl?.trim() || fb.hero.backgroundImageUrl,
      roleTagline: raw.heroRoleTagline?.trim() || fb.hero.roleTagline,
      headline: raw.heroHeadline?.trim() || fb.hero.headline,
      subtitle: raw.heroSubtitle?.trim() || fb.hero.subtitle,
      ctaLabel: raw.heroCtaLabel?.trim() || fb.hero.ctaLabel,
      ctaHref: raw.heroCtaHref?.trim() || fb.hero.ctaHref,
    },
    bio: raw.bio?.trim() || fb.bio,
    bioTeaser: raw.bioTeaser?.trim() || fb.bioTeaser,
    social: {
      instagram: raw.socialInstagram?.trim() || undefined,
      youtube: raw.socialYoutube?.trim() || undefined,
      tiktok: raw.socialTiktok?.trim() || undefined,
      twitter: raw.socialTwitter?.trim() || undefined,
      facebook: raw.socialFacebook?.trim() || undefined,
      linkedin: raw.socialLinkedin?.trim() || undefined,
    },
    about: {
      image: {
        url: raw.aboutImageUrl?.trim() || "",
        alt: raw.aboutImageAlt?.trim() || "",
        width: raw.aboutImageWidth ?? 0,
        height: raw.aboutImageHeight ?? 0,
      },
    },
    contactTitle: raw.contactTitle?.trim() || fb.contactTitle,
    contactDescription: raw.contactDescription?.trim() || fb.contactDescription,
    contactEmail: raw.contactEmail?.trim() || fb.contactEmail,
    contactPhone: raw.contactPhone?.trim() || fb.contactPhone,
    contact: {
      image: {
        url: raw.contactImageUrl?.trim() || "",
        alt: raw.contactImageAlt?.trim() || "",
        width: raw.contactImageWidth ?? 0,
        height: raw.contactImageHeight ?? 0,
      },
    },
  };
}

/**
 * Fetch site-wide settings (identity, hero, bio, social links, contact copy).
 *
 * Wrapped in React `cache()` so multiple Server Components calling this
 * within the same request share one fetch — no waterfalls.
 */
export const fetchSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSanityReady()) {
    return SETTINGS_FALLBACK;
  }

  try {
    const raw = await getSanityClient().fetch<RawSiteSettings | null>(SITE_SETTINGS_QUERY);
    return normaliseSiteSettings(raw);
  } catch (err) {
    console.error("[Sanity] fetchSiteSettings failed, using defaults:", err);
    return SETTINGS_FALLBACK;
  }
});
