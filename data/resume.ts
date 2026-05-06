/**
 * Resume content — edit this file to update the public resume page.
 * All fields are plain strings for easy copy-paste from a CV.
 */

export type EducationEntry = {
  id: string;
  institution: string;
  credential: string;
  /** e.g. city or program note */
  location?: string;
  year: string;
  details?: string;
};

export type PerformanceEntry = {
  id: string;
  role: string;
  work: string;
  /** Company, venue, or organization */
  organization?: string;
  location?: string;
  year: string;
  notes?: string;
};

export type AwardEntry = {
  id: string;
  title: string;
  issuer?: string;
  year: string;
  description?: string;
};

export type ResumeData = {
  /** Shown under the name (display name lives in config/siteConfig.ts — siteName) */
  headline: string;
  contact: {
    email: string;
    phone?: string;
    location?: string;
    website?: string;
  };
  education: EducationEntry[];
  performanceExperience: PerformanceEntry[];
  awards: AwardEntry[];
};

export const resumeData: ResumeData = {
  headline: "Dancer · Choreographer · Educator",
  contact: {
    email: "hello@example.com",
    location: "New York, NY",
    website: "zamora.example.com",
  },
  education: [
    {
      id: "edu-1",
      institution: "School of American Ballet",
      credential: "Professional Division",
      location: "New York, NY",
      year: "2018 — 2020",
      details: "Full-time conservatory training with focus on classical and contemporary repertoire.",
    },
    {
      id: "edu-2",
      institution: "Tisch School of the Arts, NYU",
      credential: "B.F.A. in Dance",
      location: "New York, NY",
      year: "2014 — 2018",
      details: "Concentration in performance and choreography; Dean’s List.",
    },
  ],
  performanceExperience: [
    {
      id: "perf-1",
      role: "Corps de Ballet",
      work: "The Nutcracker",
      organization: "Regional Ballet Company",
      location: "Northeast U.S.",
      year: "2022 — Present",
      notes: "Repertory seasons and national tour.",
    },
    {
      id: "perf-2",
      role: "Featured Soloist",
      work: "New Voices",
      organization: "Contemporary Dance Festival",
      location: "Brooklyn, NY",
      year: "2021",
    },
    {
      id: "perf-3",
      role: "Dancer",
      work: "Independent Projects",
      organization: "Various choreographers",
      year: "2019 — 2021",
      notes: "Workshops, site-specific pieces, and film.",
    },
  ],
  awards: [
    {
      id: "aw-1",
      title: "Young Artist Grant",
      issuer: "Arts Foundation",
      year: "2020",
      description: "Support for original choreographic work.",
    },
    {
      id: "aw-2",
      title: "Excellence in Performance",
      issuer: "NYU Tisch",
      year: "2017",
    },
  ],
};
