/**
 * Normalise un slug : enlève les accents, met en kebab-case, garde uniquement
 * a-z 0-9 et tirets. Conserve l'unicité d'origine si déjà propre.
 */
export function normalizeSlug(input) {
  return String(input)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Helper pour construire un objet slug Sanity. */
export function sanitySlug(input) {
  return { _type: "slug", current: normalizeSlug(input) };
}

/** ID déterministe pour un document — permet l'idempotence des imports. */
export function deterministicId(type, slug) {
  return `${type}-${normalizeSlug(slug)}`;
}
