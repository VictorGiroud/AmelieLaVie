import type { PortableTextContent } from "@lib/sanity/types";

/**
 * Estimation du temps de lecture en minutes à partir d'un corps Portable Text.
 * Hypothèse : 220 mots/minute (vitesse de lecture moyenne adulte FR sur écran).
 * Retourne au minimum 1 minute pour éviter "0 min".
 */
export function readingTimeMinutes(body: PortableTextContent | null | undefined): number {
  if (!body) return 1;
  let text = "";
  for (const block of body) {
    if (block._type !== "block") continue;
    for (const span of block.children ?? []) {
      if (span._type === "span" && span.text) text += " " + span.text;
    }
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
