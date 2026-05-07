import { portfolioItemType } from "./portfolioItemType";
import { resumeSectionType } from "./resumeSectionType";
import { siteSettingsType } from "./siteSettingsType";

/**
 * All Sanity document types registered in this project.
 * Imported by sanity.config.ts → schema.types.
 */
export const schemaTypes = [siteSettingsType, portfolioItemType, resumeSectionType];
