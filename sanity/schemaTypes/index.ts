import { portfolioItemType } from "./portfolioItemType";
import { resumeDocumentType } from "./resumeDocumentType";
import { resumeSectionType } from "./resumeSectionType";
import { siteSettingsType } from "./siteSettingsType";

/**
 * All Sanity document types registered in this project.
 * Imported by sanity.config.ts → schema.types.
 */
export const schemaTypes = [
  siteSettingsType,
  resumeDocumentType,
  portfolioItemType,
  resumeSectionType,
];
