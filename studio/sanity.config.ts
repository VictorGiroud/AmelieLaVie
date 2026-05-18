import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { media } from "sanity-plugin-media";

import { schemaTypes, SINGLETON_TYPES, type SingletonType } from "./schemas";
import { structure } from "./structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL ?? "http://localhost:4321";

if (!projectId) {
  throw new Error(
    "SANITY_STUDIO_PROJECT_ID manquant. Crée un projet sur https://sanity.io/manage puis renseigne-le dans studio/.env.local",
  );
}

const isSingleton = (type: string): type is SingletonType =>
  (SINGLETON_TYPES as readonly string[]).includes(type);

export default defineConfig({
  name: "amelie-la-vie",
  title: "Amélie la Vie",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool(), media()],
  schema: {
    types: schemaTypes,
    // Cache les singletons dans le bouton global "Create new document"
    templates: (templates) => templates.filter(({ schemaType }) => !isSingleton(schemaType)),
  },
  document: {
    // Cache "Duplicate" et "Delete" pour les singletons (un seul doit exister)
    actions: (input, context) =>
      isSingleton(context.schemaType)
        ? input.filter(({ action }) => action && !["duplicate", "delete"].includes(action))
        : input,
    // URL de prévisualisation utilisée par le bouton "Open preview" du Studio
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
