import { defineArrayMember, defineField, defineType } from "sanity";
import { BlockContentIcon } from "@sanity/icons";

export const sectionHero = defineType({
  name: "section.hero",
  title: "En-tête de page (titre + alerte)",
  type: "object",
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Titre principal",
      type: "string",
      description: "Le grand titre visible en haut de la page.",
      validation: (R) => R.required().min(3).max(140),
    }),
    defineField({
      name: "displayStyle",
      title: "Style du titre",
      type: "string",
      initialValue: "default",
      description:
        "« Standard » : titre classique aligné à gauche. « Citation » : titre italique centré avec guillemets « … » — utile pour la phrase d'accroche de la page d'accueil.",
      options: {
        list: [
          { title: "Standard (titre classique)", value: "default" },
          { title: "Citation (italique, guillemets, centrée)", value: "quote" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "subtitle",
      title: "Sous-titre / accroche (optionnel)",
      type: "text",
      rows: 2,
      description: "Phrase courte affichée sous le titre principal.",
    }),
    defineField({
      name: "alerte",
      title: "Bandeau d'alerte (optionnel)",
      type: "string",
      description:
        "Petit bandeau orange visible au-dessus du titre. Idéal pour annoncer un événement à venir. Ex : « Rendez-vous le 29 mars 2026 pour notre randonnée pédestre ! »",
    }),
    defineField({
      name: "backgroundImage",
      title: "Image de fond",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texte alternatif",
          type: "string",
          description: "Laisser vide si l'image est purement décorative.",
        }),
      ],
    }),
    defineField({
      name: "ctas",
      title: "Boutons d'appel à l'action",
      type: "array",
      of: [defineArrayMember({ type: "ctaLink" })],
      validation: (R) => R.max(3),
    }),
  ],
  preview: {
    select: { title: "title", media: "backgroundImage" },
    prepare: ({ title, media }) => ({
      title: title ?? "Hero",
      subtitle: "En-tête de page",
      media,
    }),
  },
});
