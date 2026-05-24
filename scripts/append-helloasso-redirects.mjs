#!/usr/bin/env node
/**
 * Lit les URLs HelloAsso depuis Sanity (singleton contactInfo) et les
 * ajoute au `dist/_redirects` Netlify sous forme de redirects 302.
 *
 * Permet de centraliser les URLs HelloAsso dans le Studio Sanity :
 * - /adherer    → contactInfo.helloAssoAdhesionUrl
 * - /donner     → contactInfo.helloAssoDonUrl
 * - /reservation → contactInfo.helloAssoReservationUrl
 *
 * Quand l'admin met à jour ces URLs dans le Studio, le webhook Sanity
 * déclenche un rebuild Netlify qui exécute ce script et met à jour
 * les redirects. Une seule source de vérité.
 *
 * Exécuté en post-build via `pnpm build` dans package.json.
 */

import { createClient } from "@sanity/client";
import { appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const projectId =
  process.env.PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID;
const dataset =
  process.env.PUBLIC_SANITY_DATASET ?? process.env.SANITY_STUDIO_DATASET ?? "production";
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

if (!projectId) {
  console.warn(
    "[post-build] PUBLIC_SANITY_PROJECT_ID manquant — skip HelloAsso redirects.",
  );
  process.exit(0);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: "published",
  useCdn: false, // au build on veut la fresh version
});

const contactInfo = await client.fetch(
  `*[_type == "contactInfo"][0]{helloAssoAdhesionUrl, helloAssoDonUrl, helloAssoReservationUrl}`,
);

if (!contactInfo) {
  console.warn("[post-build] Aucun document contactInfo trouvé — skip.");
  process.exit(0);
}

const lines = [];
lines.push("");
lines.push("# ─── HelloAsso (généré au build depuis Sanity contactInfo) ───");
if (contactInfo.helloAssoAdhesionUrl) {
  lines.push(`/adherer       ${contactInfo.helloAssoAdhesionUrl}    302!`);
}
if (contactInfo.helloAssoDonUrl) {
  lines.push(`/donner        ${contactInfo.helloAssoDonUrl}    302!`);
}
if (contactInfo.helloAssoReservationUrl) {
  lines.push(`/reservation   ${contactInfo.helloAssoReservationUrl}    302!`);
}

if (lines.length === 1) {
  console.warn("[post-build] Aucune URL HelloAsso configurée dans Sanity.");
  process.exit(0);
}

const target = "dist/_redirects";
if (!existsSync(target)) {
  console.warn(`[post-build] ${target} introuvable — skip.`);
  process.exit(0);
}

await appendFile(target, lines.join("\n") + "\n");
console.log(`[post-build] ${lines.length - 1} redirects HelloAsso ajoutés à ${target}.`);
