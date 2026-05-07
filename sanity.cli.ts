import { defineCliConfig } from "sanity/cli";

/**
 * Enables `npx sanity` commands (type gen, schema extraction, etc.)
 * from inside this Next.js project.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  },
});
