import { defineField, defineType } from "sanity";

/**
 * Singleton document that controls all site-wide text and images:
 * identity, hero section, bio, social links, and contact page copy.
 *
 * Only one document of this type should ever exist (enforced via the
 * fixed documentId "siteSettings" in sanity.config.ts's structure builder).
 */
export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",

  fields: [
    // ── Identity ────────────────────────────────────────────────────────────
    defineField({
      name: "siteName",
      title: "Site / Artist Name",
      type: "string",
      description: "Displayed in the navigation bar and page titles.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "siteTagline",
      title: "Tagline",
      type: "string",
      description: 'Short descriptor used in browser tabs, e.g. "Dancer & Artist".',
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      description: "Used in search-engine meta tags (keep under 160 characters).",
    }),

    // ── Hero ────────────────────────────────────────────────────────────────
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
      description: "Full-bleed background image displayed on the home page.",
    }),
    defineField({
      name: "heroRoleTagline",
      title: "Role Tagline (above headline)",
      type: "string",
      description: 'Small caps text above the main name, e.g. "Dancer · Artist".',
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      description: "Large centred name or title on the hero.",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "string",
      description: "One-line description beneath the headline.",
    }),
    defineField({
      name: "heroCtaLabel",
      title: "CTA Button Label",
      type: "string",
      description: 'Text on the call-to-action button, e.g. "View Portfolio".',
    }),
    defineField({
      name: "heroCtaHref",
      title: "CTA Button URL",
      type: "string",
      description: 'Destination URL for the CTA button, e.g. "/portfolio".',
    }),

    // ── Bio ─────────────────────────────────────────────────────────────────
    defineField({
      name: "bio",
      title: "Full Bio",
      type: "text",
      rows: 8,
      description: "Displayed on the About page. Separate paragraphs with a blank line.",
    }),
    defineField({
      name: "bioTeaser",
      title: "Short Bio Teaser",
      type: "string",
      description: "One-sentence summary used in compact / preview contexts.",
    }),

    // ── Social Links ────────────────────────────────────────────────────────
    defineField({
      name: "socialInstagram",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "socialYoutube",
      title: "YouTube URL",
      type: "url",
    }),
    defineField({
      name: "socialTiktok",
      title: "TikTok URL",
      type: "url",
    }),
    defineField({
      name: "socialTwitter",
      title: "X / Twitter URL",
      type: "url",
    }),
    defineField({
      name: "socialFacebook",
      title: "Facebook URL",
      type: "url",
    }),
    defineField({
      name: "socialLinkedin",
      title: "LinkedIn URL",
      type: "url",
    }),

    // ── Contact page ────────────────────────────────────────────────────────
    defineField({
      name: "contactTitle",
      title: "Contact Page Title",
      type: "string",
    }),
    defineField({
      name: "contactDescription",
      title: "Contact Page Description",
      type: "text",
      rows: 3,
      description: "Displayed beneath the title on the Contact page.",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email Address",
      type: "string",
      description: "Your booking / inquiry email. Shown on the Contact page and used as the form destination.",
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone Number",
      type: "string",
      description: "Optional phone number displayed on the Contact page (e.g. +1 555 000 0000).",
    }),
  ],

  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
