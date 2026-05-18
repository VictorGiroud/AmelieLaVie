import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { media } from "sanity-plugin-media";

import { schemaTypes } from "./schemas";
import { structure } from "./structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL ?? "http://localhost:4321";

if (!projectId) {
  throw new Error(
    "SANITY_STUDIO_PROJECT_ID manquant. Crée un projet sur https://sanity.io/manage puis renseigne-le dans studio/.env.local",
  );
}

export default defineConfig({
  name: "amelie-la-vie",
  title: "Amélie la Vie",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool(), media()],
  schema: {
    types: schemaTypes,
  },
  document: {
    productionUrl: async (prev, context) => {
      const { document } = context;
      const slug = (document.slug as { current?: string } | undefined)?.current;
      if (document._type === "page" && slug) return `${previewUrl}/${slug}/`;
      if (document._type === "actualite" && slug) return `${previewUrl}/actualites/${slug}/`;
      if (document._type === "evenement" && slug) return `${previewUrl}/agenda/${slug}/`;
      if (document._type === "homePage") return `${previewUrl}/`;
      return prev;
    },
  },
});
