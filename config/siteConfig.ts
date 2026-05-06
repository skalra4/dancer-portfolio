/**
 * Central site content — edit this file to update copy, images, and portfolio items.
 *
 * Future CMS (Sanity, Contentful, etc.): replace static imports with data fetched at
 * build time (`getStaticProps`-style) or runtime, using the same shape (`SiteConfig`)
 * so components stay unchanged. The dancer can then upload media and edit text in a UI.
 */

export const PORTFOLIO_CATEGORIES = [
  "Dance",
  "Choreography",
  "Teaching",
  "Headshots",
] as const;

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export type PortfolioItem = {
  id: string;
  title: string;
  category: PortfolioCategory;
  imageUrl: string;
};

export type SocialLinks = {
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
};

export type SiteConfig = {
  siteName: string;
  /** Used in browser tab / SEO when no page-specific title is set */
  siteTagline: string;
  seoDescription: string;
  /**
   * Optional PNG/SVG in `public/` (e.g. `/menu-silhouette.png`) or absolute URL.
   * When set, the nav menu button uses this instead of the default icon (add the host to
   * `next.config.ts` `images.remotePatterns` if it is not already allowed).
   * The image is styled for a dark header (inverted/light); adjust `Navbar` if your asset
   * is already light-on-transparent.
   */
  menuTriggerImageUrl?: string | null;
  /** Path under `public/` for the downloadable PDF resume (e.g. "/resume.pdf") */
  resumePdfPath: string;
  hero: {
    backgroundImageUrl: string;
    /** Small caps line above the main headline (e.g. role) */
    roleTagline: string;
    /** Main hero title — often the same as siteName */
    headline: string;
    subtitle: string;
    ctaLabel: string;
    /** e.g. "/#portfolio" */
    ctaHref: string;
  };
  /**
   * Full bio for the About page. Use blank lines between paragraphs (\n\n).
   */
  bio: string;
  /** Short teaser on the home About section */
  bioTeaser: string;
  social: SocialLinks;
  portfolio: PortfolioItem[];
  /** Intro copy above the portfolio grid */
  portfolioSection: {
    title: string;
    description: string;
  };
  /** Home page section copy (non-About) */
  homeSections: {
    aboutTitle: string;
    aboutCtaLabel: string;
    resumeTitle: string;
    resumeDescription: string;
    resumeCtaLabel: string;
    contactTitle: string;
    contactDescription: string;
  };
};

export const siteConfig: SiteConfig = {
  siteName: "Zamora",
  siteTagline: "Dancer & Artist",
  seoDescription:
    "Professional portfolio — dance, performance, and artistic work.",
  /** Set to e.g. "/menu-silhouette.png" after adding the asset to `public/` */
  menuTriggerImageUrl: null,

  /**
   * Path to the PDF resume inside `public/`.
   * Place your file at `public/resume.pdf` and this will power the download
   * button and Document View embed on the Resume page.
   */
  resumePdfPath: "/resume.pdf",

  hero: {
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2400&auto=format&fit=crop",
    roleTagline: "Dancer · Artist",
    headline: "Zamora",
    subtitle:
      "Movement, expression, and performance crafted for stage and screen.",
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

  portfolioSection: {
    title: "Portfolio",
    description: "Selected performances, choreography, and teaching.",
  },

  portfolio: [
    {
      id: "1",
      title: "Spring Gala — Principal",
      category: "Dance",
      imageUrl:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "2",
      title: "Contemporary Solo",
      category: "Dance",
      imageUrl:
        "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "3",
      title: "Ensemble — New Works",
      category: "Choreography",
      imageUrl:
        "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "4",
      title: "Music Video — Movement Direction",
      category: "Choreography",
      imageUrl:
        "https://images.unsplash.com/photo-1504609773099-104ff2c73ba4?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "5",
      title: "Youth Intensive Workshop",
      category: "Teaching",
      imageUrl:
        "https://images.unsplash.com/photo-1518834107812-67b0b7c58444?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "6",
      title: "Open Studio — Masterclass",
      category: "Teaching",
      imageUrl:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "7",
      title: "Press Headshot 2024",
      category: "Headshots",
      imageUrl:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "8",
      title: "Studio Portrait Series",
      category: "Headshots",
      imageUrl:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "9",
      title: "On Stage — Character",
      category: "Headshots",
      imageUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  homeSections: {
    aboutTitle: "About",
    aboutCtaLabel: "Read more →",
    resumeTitle: "Resume",
    resumeDescription: "Education, performance credits, and awards.",
    resumeCtaLabel: "View full resume →",
    contactTitle: "Contact",
    contactDescription: "Booking and inquiries — add a form or email here.",
  },
};
