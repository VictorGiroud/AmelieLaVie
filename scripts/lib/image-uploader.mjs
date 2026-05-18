import { createReadStream, existsSync, statSync } from "node:fs";
import { basename, resolve } from "node:path";
import { createHash } from "node:crypto";
import { ROOT } from "./env.mjs";

/**
 * Cache : sha1 du fichier → assetId Sanity. Évite de réuploader la même image
 * plusieurs fois quand elle est référencée par plusieurs articles.
 */
const uploadCache = new Map();

function hashFile(absolutePath) {
  const stat = statSync(absolutePath);
  // Hash léger (path + mtime + size) suffit pour notre cas, pas besoin de hasher le contenu
  return createHash("sha1").update(`${absolutePath}|${stat.size}|${stat.mtimeMs}`).digest("hex");
}

/**
 * Convertit une URL legacy (/img/... ou /assets/...) vers un chemin de fichier
 * dans le repo, en cherchant successivement dans :
 *   1. legacy/src/img/
 *   2. legacy/static/img/
 *   3. legacy/static/<path>
 */
export function resolveLegacyAsset(url) {
  if (!url) return null;
  if (/^https?:\/\//.test(url)) return null; // URL externe : pas à uploader
  const clean = url.replace(/^\/+/, "");
  const candidates = [
    resolve(ROOT, "legacy", clean), // /img/x → legacy/img/x
    resolve(ROOT, "legacy", "src", clean), // /img/x → legacy/src/img/x
    resolve(ROOT, "legacy", "static", clean), // /img/x → legacy/static/img/x
  ];
  return candidates.find((p) => existsSync(p)) ?? null;
}

/**
 * Upload une image vers Sanity (ou retourne le cache).
 * @param {import("@sanity/client").SanityClient} client
 * @param {string} absolutePath
 * @returns {Promise<{_type: "image", asset: {_type: "reference", _ref: string}}>}
 */
export async function uploadImage(client, absolutePath) {
  if (!absolutePath || !existsSync(absolutePath)) {
    throw new Error(`Fichier introuvable: ${absolutePath}`);
  }
  const key = hashFile(absolutePath);
  if (uploadCache.has(key)) {
    return imageRef(uploadCache.get(key));
  }
  const asset = await client.assets.upload("image", createReadStream(absolutePath), {
    filename: basename(absolutePath),
  });
  uploadCache.set(key, asset._id);
  return imageRef(asset._id);
}

function imageRef(assetId) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
  };
}

/**
 * Variante avec champ alt (pour les schemas qui en exigent).
 */
export async function uploadImageWithAlt(client, absolutePath, alt) {
  const ref = await uploadImage(client, absolutePath);
  return { ...ref, alt };
}

/**
 * Stub pour le mode dry-run : ne contacte pas Sanity, renvoie un placeholder reconnaissable.
 */
export function fakeUpload(absolutePath) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: `image-DRY-RUN-${basename(absolutePath)}` },
  };
}
