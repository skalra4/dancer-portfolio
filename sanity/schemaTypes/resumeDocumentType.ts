import { defineField, defineType } from "sanity";

/**
 * Singleton for the downloadable / embeddable resume PDF.
 *
 * Only one document should exist (fixed ID "resumeDocument" in sanity.config.ts).
 * The artist uploads a new PDF here whenever their resume changes.
 */
export const resumeDocumentType = defineType({
  name: "resumeDocument",
  title: "Resume PDF",
  type: "document",

  fields: [
    defineField({
      name: "pdf",
      title: "Resume PDF File",
      type: "file",
      options: { accept: ".pdf" },
      description:
        "Upload the full resume PDF. It powers the Document View tab and the Download button on the Resume page.",
    }),
  ],

  preview: {
    prepare: () => ({ title: "Resume PDF" }),
  },
});
