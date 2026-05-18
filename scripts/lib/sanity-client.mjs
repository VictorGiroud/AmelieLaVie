import { createClient } from "@sanity/client";
import { loadDotenvLocal, requireEnv } from "./env.mjs";

loadDotenvLocal();

const projectId = requireEnv("PUBLIC_SANITY_PROJECT_ID");
const dataset = process.env.PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

/**
 * Client read-only — utilisable même sans token (datasets publics).
 */
export const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

/**
 * Client write — requiert SANITY_API_WRITE_TOKEN dans .env.local.
 * À n'utiliser que pour les scripts de migration (jamais en prod web).
 */
export function getWriteClient() {
  const token = requireEnv("SANITY_API_WRITE_TOKEN");
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}

export const config = { projectId, dataset, apiVersion };
