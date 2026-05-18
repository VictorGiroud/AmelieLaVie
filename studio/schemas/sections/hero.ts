import { defineArrayMember, defineField, defineType } from "sanity";
import { BlockContentIcon } from "@sanity/icons";

export const sectionHero = defineType({
  name: "section.hero",
  title: "Section : Hero (en-tête)",
  type: "object",
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Titre principal",
      type: "string",
      validation: (R) => R.required().min(3).max(140),
    }),
    defineField({
      name: "displayStyle",
      title: "Style d'affichage du titre",
      type: "string",
      initialValue: "default",
      options: {
        list: [
          { title: "Standard (h1 classique)", value: "default" },
          { title: "Citation (italique, guillemets, centrée)", value: "quote" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "subtitle",
      title: "Sous-titre / accroche",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "alerte",
      title: "Bandeau d'alerte (optionnel)",
      type: "string",
      description:
        "Petit bandeau visible au-dessus du titre. Ex: « Inscriptions rando 2026 ouvertes ! ».",
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
      subtitle: "Section Hero",
      media,
    }),
  },
});
