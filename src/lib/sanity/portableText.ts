import type { PortableTextContent } from "@lib/sanity/types";

/**
 * Concatène le texte brut d'un Portable Text (sans markup, sans images).
 * Utilisé pour générer une meta description / un extrait de fallback.
 */
export function portableTextToPlainText(
  body: PortableTextContent | null | undefined,
  maxChars = 240,
): string {
  if (!body) return "";
  const parts: string[] = [];
  for (const block of body) {
    if (block._type !== "block") continue;
    let line = "";
    for (const span of block.children ?? []) {
      if (span._type === "span" && typeof span.text === "string") line += span.text;
    }
    if (line.trim()) parts.push(line.trim());
    if (parts.join(" ").length >= maxChars) break;
  }
  const full = parts.join(" ").replace(/\s+/g, " ").trim();
  if (full.length <= maxChars) return full;
  return full.slice(0, maxChars - 1).trimEnd() + "…";
}
