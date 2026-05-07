import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * resumeSection document
 *
 * A top-level section on the resume page, e.g. "Education",
 * "Performance Experience", or "Awards & Recognition".
 *
 * Each section holds an ordered array of `entry` objects whose generic
 * title / subtitle / meta / notes fields map directly to the
 * `ResumeSectionItem` type in `data/content.ts`, keeping the component
 * layer stable regardless of how many sections or entries exist.
 *
 * GROQ projection: sanity/lib/queries.ts → RESUME_SECTIONS_QUERY
 */
export const resumeSectionType = defineType({
  name: "resumeSection",
  title: "Resume Section",
  type: "document",

  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      description:
        'Displayed as the section title on the resume page, e.g. "Education" or "Awards & Recognition".',
      validation: (r) => r.required(),
    }),

    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description:
        "Controls the order sections appear on the resume. Lower numbers appear first. E.g. Education = 1, Performance = 2, Awards = 3.",
    }),

    defineField({
      name: "items",
      title: "Entries",
      type: "array",
      description:
        "Add one entry per role, production, school, or award. Drag to reorder.",
      of: [
        defineArrayMember({
          type: "object",
          name: "entry",
          title: "Entry",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              description:
                "Main heading for this entry — school name, production title, or award name.",
              validation: (r) => r.required(),
            }),

            defineField({
              name: "subtitle",
              title: "Role / Credential / Organisation",
              type: "string",
              description:
                'Secondary line. Combine role, company, and location here separated by \" · \".' +
                ' e.g. "Corps de Ballet · Regional Ballet Company · New York, NY"',
            }),

            defineField({
              name: "meta",
              title: "Year / Date Range",
              type: "string",
              description: 'e.g. "2022 — Present" or "2018"',
            }),

            defineField({
              name: "notes",
              title: "Notes / Description",
              type: "text",
              rows: 3,
              description:
                "Optional additional detail — shown in a smaller paragraph below the entry.",
            }),
          ],

          preview: {
            select: {
              title: "title",
              subtitle: "subtitle",
              meta: "meta",
            },
            prepare({ title, subtitle, meta }) {
              return {
                title: title ?? "Untitled entry",
                subtitle: [subtitle, meta].filter(Boolean).join(" · "),
              };
            },
          },
        }),
      ],
    }),
  ],

  // ── Studio list preview ────────────────────────────────────────────────
  preview: {
    select: {
      title: "heading",
      items: "items",
    },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return {
        title: title ?? "Untitled section",
        subtitle: `${count} entr${count === 1 ? "y" : "ies"}`,
      };
    },
  },
});
