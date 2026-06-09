"use client";

/**
 * Sanity Studio configuration.
 *
 * `'use client'` is required — Sanity Studio is a client-side React application.
 * This file is imported by app/studio/[[...tool]]/page.tsx.
 */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singleton — only one document, fixed ID
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Site Settings"),
              ),
            S.divider(),
            S.listItem()
              .title("Portfolio Items")
              .schemaType("portfolioItem")
              .child(S.documentTypeList("portfolioItem").title("Portfolio Items")),
            S.listItem()
              .title("Resume PDF")
              .id("resumeDocument")
              .child(
                S.document()
                  .schemaType("resumeDocument")
                  .documentId("resumeDocument")
                  .title("Resume PDF"),
              ),
            S.listItem()
              .title("Resume Sections")
              .schemaType("resumeSection")
              .child(
                S.documentTypeList("resumeSection")
                  .title("Resume Sections")
                  .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
              ),
          ]),
    }),
  ],

  schema: { types: schemaTypes },
});
