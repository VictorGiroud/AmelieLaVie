#!/usr/bin/env node
/**
 * Import des 16 partenaires hardcodés depuis legacy/src/templates/index-page.js
 * vers Sanity (documents de type `partenaire`).
 *
 * Source : scripts/fixtures/partenaires.json
 *
 * Usage :
 *   pnpm migrate:partenaires           # dry-run (par défaut)
 *   pnpm migrate:partenaires --commit  # écrit vraiment dans Sanity
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

import { loadDotenvLocal, ROOT } from "./lib/env.mjs";
import { getWriteClient, config } from "./lib/sanity-client.mjs";
import { uploadImage, fakeUpload } from "./lib/image-uploader.mjs";
import { deterministicId } from "./lib/slug.mjs";

loadDotenvLocal();

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE = resolve(__dirname, "fixtures", "partenaires.json");

const COMMIT = process.argv.includes("--commit");

async function main() {
  const fixture = JSON.parse(readFileSync(FIXTURE, "utf8"));
  console.log(`📦 ${fixture.length} partenaires à importer (dataset: ${config.dataset})`);
  console.log(COMMIT ? "🚀 MODE COMMIT — écriture réelle dans Sanity" : "👀 MODE DRY-RUN");
  console.log();

  const client = COMMIT ? getWriteClient() : null;
  const tx = COMMIT ? client.transaction() : null;
  let ok = 0;
  let skipped = 0;

  for (const p of fixture) {
    const logoPath = resolve(ROOT, p.logo);
    if (!existsSync(logoPath)) {
      console.warn(`⚠️  Logo introuvable pour ${p.name} : ${p.logo}`);
      skipped++;
      continue;
    }

    const _id = deterministicId("partenaire", `${String(p.order).padStart(3, "0")}-${p.name}`);
    let logoRef;
    if (COMMIT) {
      const uploaded = await uploadImage(client, logoPath);
      logoRef = { ...uploaded, alt: p.name };
    } else {
      logoRef = { ...fakeUpload(logoPath), alt: p.name };
    }

    const doc = {
      _id,
      _type: "partenaire",
      name: p.name,
      logo: logoRef,
      url: p.url,
      order: p.order,
    };

    console.log(`  • ${p.name.padEnd(30)} → ${_id}`);
    if (COMMIT) tx.createOrReplace(doc);
    ok++;
  }

  if (COMMIT) {
    console.log();
    console.log(`💾 Commit transaction (${ok} doc(s))...`);
    await tx.commit();
    console.log("✅ Terminé.");
  } else {
    console.log();
    console.log(`✅ Dry-run OK : ${ok} partenaires prêts à importer (${skipped} skip).`);
    console.log("   Relance avec --commit pour écrire dans Sanity.");
  }
}

main().catch((err) => {
  console.error("❌ Erreur:", err);
  process.exit(1);
});
