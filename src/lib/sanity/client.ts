import { createClient, type ClientConfig } from "@sanity/client";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

if (!projectId) {
  throw new Error("PUBLIC_SANITY_PROJECT_ID manquant. Vérifie .env.local à la racine du repo.");
}

const baseConfig: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  perspective: "published",
  useCdn: true,
};

/**
 * Client read-only utilisé au build (SSG). Pas d'auth nécessaire — le dataset
 * est public et on ne fetch que les documents publiés via la CDN Sanity.
 */
export const sanity = createClient(baseConfig);

/**
 * Client preview — bypass la CDN, lit aussi les drafts. À utiliser uniquement
 * en mode preview (cookie/header), jamais sur les pages production.
 */
export function previewClient(token: string) {
  return createClient({
    ...baseConfig,
    perspective: "previewDrafts",
    useCdn: false,
    token,
    ignoreBrowserTokenWarning: true,
  });
}

export const sanityConfig = { projectId, dataset, apiVersion };
