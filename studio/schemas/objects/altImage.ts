import { defineField, defineType } from "sanity";

/**
 * Image avec champ alt **obligatoire** pour l'accessibilité.
 * À utiliser partout sauf pour les images purement décoratives
 * (auquel cas utiliser le type image standard avec alt vide explicite).
 */
export const altImage = defineType({
  name: "altImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Texte alternatif",
      type: "string",
      description:
        "Décrit l'image pour les lecteurs d'écran et le SEO. Obligatoire sauf si l'image est purement décorative.",
      validation: (R) =>
        R.custom((alt, ctx) => {
          const parent = ctx.parent as { decorative?: boolean } | undefined;
          if (parent?.decorative) return true;
          if (!alt || alt.trim().length < 2)
            return "Le texte alternatif est requis (min 2 caractères).";
          return true;
        }),
    }),
    defineField({
      name: "decorative",
      title: "Image purement décorative",
      type: "boolean",
      initialValue: false,
      description:
        "Cocher si l'image n'apporte aucune information (sera ignorée par les lecteurs d'écran).",
    }),
    defineField({
      name: "caption",
      title: "Légende (optionnel)",
      type: "string",
    }),
  ],
});
