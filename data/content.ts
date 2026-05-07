/**
 * Content layer — single source of truth for all Portfolio and Resume content.
 *
 * HOW IT WORKS
 * ─────────────
 * `content.json` holds the raw, CMS-shaped data (flat objects, string-typed fields).
 * This module validates and normalises that data into the typed shapes components need.
 * Items with missing required fields are silently dropped so the UI never crashes.
 *
 * CONNECTING A HEADLESS CMS (next step)
 * ──────────────────────────────────────
 * Replace the static JSON import below with a `fetch()` / SDK call to Contentful,
 * Sanity, or any other CMS.  The component interfaces (`PortfolioItem`, `ResumeSection`)
 * stay unchanged — only this file changes.
 */

import raw from "./content.json";

/* ────────────────────────────────────────────────────────────────────────────
   Raw JSON schema types
   (These mirror the exact shape of content.json — all fields optional so we
   handle incomplete CMS responses gracefully.)
──────────────────────────────────────────────────────────────────────────── */

export type RawPortfolioItem = {
  id?: string;
  title?: string;
  /** "image" | "video" | "social" */
  type?: string;
  /** Must match a value in portfolio.categories */
  category?: string;
  /** image → URL  |  video → video-platform ID  |  social → post ID */
  src?: string;
  /** "youtube" | "vimeo" | "instagram" | "tiktok" */
  provider?: string;
  /** Optional thumbnail override (video only) */
  thumbnail?: string;
  /** 1 = standard, 2 = wide, 3 = full-width  (tile grid only) */
  colSpan?: number;
};

export type RawResumeSectionItem = {
  id?: string;
  /** Main heading, e.g. school name, show title, award name */
  title?: string;
  /** Secondary line, e.g. credential, role + company, issuing org */
  subtitle?: string;
  /** Year or date range, e.g. "2022 — Present" */
  meta?: string;
  /** Optional multi-sentence detail */
  notes?: string;
};

export type RawResumeSection = {
  id?: string;
  heading?: string;
  items?: RawResumeSectionItem[];
};

/* ────────────────────────────────────────────────────────────────────────────
   Typed component interfaces
   (Consumed by Portfolio.tsx, MediaCard.tsx, ResumeWebView.tsx, etc.)
──────────────────────────────────────────────────────────────────────────── */

export type MediaImage = {
  type: "image";
  imageUrl: string;
};

export type MediaVideo = {
  type: "video";
  provider: "youtube" | "vimeo";
  /** YouTube 11-char ID or Vimeo numeric ID */
  videoId: string;
  /** Custom poster; YouTube auto-thumbnails are fetched from i.ytimg.com */
  thumbnailUrl?: string;
};

export type MediaSocial = {
  type: "social";
  provider: "instagram" | "tiktok";
  /**
   * Instagram: shortcode from instagram.com/p/{shortcode}/
   * TikTok:    video ID from tiktok.com/@user/video/{id}
   */
  postId: string;
};

export type MediaSpec = MediaImage | MediaVideo | MediaSocial;

/** A single portfolio card after normalisation */
export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  media: MediaSpec;
  colSpan?: 1 | 2 | 3;
};

/** A single resume section item after normalisation */
export type ResumeSectionItem = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  notes?: string;
};

/** A single resume section (Education, Performance, Awards, …) */
export type ResumeSection = {
  id: string;
  heading: string;
  items: ResumeSectionItem[];
};

/* ────────────────────────────────────────────────────────────────────────────
   Normalisers — convert raw JSON → typed interfaces, dropping invalid items
   Exported so sanity/lib/fetch.ts can reuse them for Sanity API responses.
──────────────────────────────────────────────────────────────────────────── */

export function normalisePortfolioItem(r: RawPortfolioItem): PortfolioItem | null {
  if (!r.id || !r.type || !r.src) return null;

  let media: MediaSpec;

  if (r.type === "image") {
    media = { type: "image", imageUrl: r.src };
  } else if (r.type === "video") {
    media = {
      type: "video",
      provider: r.provider === "vimeo" ? "vimeo" : "youtube",
      videoId: r.src,
      thumbnailUrl: r.thumbnail,
    };
  } else if (r.type === "social") {
    media = {
      type: "social",
      provider: r.provider === "tiktok" ? "tiktok" : "instagram",
      postId: r.src,
    };
  } else {
    return null;
  }

  const cs = r.colSpan;
  const colSpan: 1 | 2 | 3 | undefined =
    cs === 1 || cs === 2 || cs === 3 ? cs : undefined;

  return {
    id: r.id,
    title: r.title ?? "Untitled",
    category: r.category ?? "Uncategorized",
    media,
    colSpan,
  };
}

export function normaliseResumeSectionItem(r: RawResumeSectionItem): ResumeSectionItem | null {
  if (!r.id || !r.title) return null;
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle || undefined,
    meta: r.meta || undefined,
    notes: r.notes || undefined,
  };
}

export function normaliseResumeSection(r: RawResumeSection): ResumeSection | null {
  if (!r.id || !r.heading) return null;
  return {
    id: r.id,
    heading: r.heading,
    items: (r.items ?? [])
      .map(normaliseResumeSectionItem)
      .filter((x): x is ResumeSectionItem => x !== null),
  };
}

/* ────────────────────────────────────────────────────────────────────────────
   Public exports
──────────────────────────────────────────────────────────────────────────── */

/** Category labels for filter pills, in display order */
export const PORTFOLIO_CATEGORIES: string[] = raw.portfolio.categories ?? [];

/** Header copy for the portfolio section */
export const portfolioSection: { title: string; description: string } =
  raw.portfolio.section ?? { title: "Portfolio", description: "" };

/** Typed, normalised portfolio items — invalid items are excluded */
export const portfolioItems: PortfolioItem[] = (
  (raw.portfolio.items ?? []) as RawPortfolioItem[]
)
  .map(normalisePortfolioItem)
  .filter((x): x is PortfolioItem => x !== null);

/** Resume headline, e.g. "Dancer · Choreographer · Educator" */
export const resumeHeadline: string = raw.resume.headline ?? "";

/** Resume contact details — all fields may be absent */
export const resumeContact: {
  email?: string;
  phone?: string | null;
  location?: string | null;
  website?: string | null;
} = raw.resume.contact ?? {};

/** Typed, normalised resume sections (Education, Performance, Awards, …) */
export const resumeSections: ResumeSection[] = (
  (raw.resume.sections ?? []) as RawResumeSection[]
)
  .map(normaliseResumeSection)
  .filter((x): x is ResumeSection => x !== null);
