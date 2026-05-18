import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanity } from "./client";

const builder = imageUrlBuilder(sanity);

/** Retourne un builder image Sanity (chain `.width()`, `.format()`, etc.). */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}

/** Génère une URL CDN avec largeur et format optimisé. */
export function imageUrl(source: SanityImageSource, width = 1200, quality = 80): string {
  return urlFor(source).width(width).quality(quality).url();
}

/** Récupère le placeholder LQIP (Low Quality Image Placeholder) si disponible. */
export function lqip(source: { asset?: { metadata?: { lqip?: string } } } | null): string | null {
  return source?.asset?.metadata?.lqip ?? null;
}

/** Récupère l'aspect ratio depuis les métadonnées Sanity. */
export function aspectRatio(
  source: { asset?: { metadata?: { dimensions?: { aspectRatio?: number } } } } | null,
): number | null {
  return source?.asset?.metadata?.dimensions?.aspectRatio ?? null;
}
