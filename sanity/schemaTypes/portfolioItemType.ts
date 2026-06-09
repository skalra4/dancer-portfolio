import { defineField, defineType } from "sanity";

/**
 * portfolioItem document
 *
 * Represents one card in the portfolio grid.  The `mediaType` field drives
 * which sub-fields are visible in the Studio via the `hidden` option, so
 * editors only see the fields relevant to their chosen media type.
 *
 * GROQ projection in sanity/lib/queries.ts maps this to the flat
 * `RawPortfolioItem` shape consumed by `data/content.ts`.
 */
export const portfolioItemType = defineType({
  name: "portfolioItem",
  title: "Portfolio Item",
  type: "document",

  fields: [
    // ── Core ──────────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Display title shown below the card.",
      validation: (r) => r.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Filter category shown in the portfolio filter pills.",
      options: {
        list: [
          { title: "Dance", value: "Dance" },
          { title: "Choreography", value: "Choreography" },
          { title: "Teaching", value: "Teaching" },
          { title: "Visual Portfolio", value: "Visual Portfolio" },
        ],
        layout: "dropdown",
      },
      validation: (r) => r.required(),
    }),

    defineField({
      name: "mediaType",
      title: "Media Type",
      type: "string",
      description: "Choose the kind of content this card displays.",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video (YouTube / Vimeo)", value: "video" },
          { title: "Social Post (Instagram / TikTok)", value: "social" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      validation: (r) => r.required(),
    }),

    // ── Image fields (visible when mediaType === "image") ─────────────────
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Upload the portfolio image. Hotspot is enabled for cropping.",
      options: { hotspot: true },
      hidden: ({ document }) => document?.mediaType !== "image",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the image for screen readers.",
        }),
      ],
    }),

    // ── Video fields (visible when mediaType === "video") ─────────────────
    defineField({
      name: "videoProvider",
      title: "Video Platform",
      type: "string",
      options: {
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Vimeo", value: "vimeo" },
        ],
        layout: "radio",
      },
      initialValue: "youtube",
      hidden: ({ document }) => document?.mediaType !== "video",
    }),

    defineField({
      name: "videoId",
      title: "Video ID",
      type: "string",
      description:
        "YouTube: 11-char ID from youtube.com/watch?v={ID}  |  Vimeo: numeric ID from vimeo.com/{ID}",
      hidden: ({ document }) => document?.mediaType !== "video",
    }),

    defineField({
      name: "thumbnail",
      title: "Custom Thumbnail",
      type: "image",
      description:
        "Optional poster image. YouTube thumbnails are fetched automatically; this field overrides them or provides a poster for Vimeo.",
      options: { hotspot: true },
      hidden: ({ document }) => document?.mediaType !== "video",
    }),

    // ── Social fields (visible when mediaType === "social") ───────────────
    defineField({
      name: "socialProvider",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "TikTok", value: "tiktok" },
        ],
        layout: "radio",
      },
      initialValue: "instagram",
      hidden: ({ document }) => document?.mediaType !== "social",
    }),

    defineField({
      name: "postId",
      title: "Post ID / Shortcode",
      type: "string",
      description:
        "Instagram: shortcode from instagram.com/p/{shortcode}/  |  TikTok: video ID from tiktok.com/@user/video/{id}",
      hidden: ({ document }) => document?.mediaType !== "social",
    }),

    // ── Grid layout ───────────────────────────────────────────────────────
    defineField({
      name: "colSpan",
      title: "Grid Width",
      type: "number",
      description:
        "Controls how many columns this card spans in the filtered tile grid. Has no effect in the masonry 'All' view.",
      options: {
        list: [
          { title: "Standard — 1/3 width", value: 1 },
          { title: "Wide — 1/2 width", value: 2 },
          { title: "Featured — full width", value: 3 },
        ],
        layout: "radio",
      },
      initialValue: 1,
    }),

    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Items with lower numbers appear first. Leave blank to append.",
    }),
  ],

  // ── Studio list preview ────────────────────────────────────────────────
  preview: {
    select: {
      title: "title",
      category: "category",
      mediaType: "mediaType",
      media: "image",
    },
    prepare({ title, category, mediaType, media }) {
      const typeLabel =
        mediaType === "image" ? "🖼 Image" : mediaType === "video" ? "▶ Video" : "📱 Social";
      return {
        title: title ?? "Untitled",
        subtitle: `${category ?? "—"} · ${typeLabel}`,
        media,
      };
    },
  },
});
