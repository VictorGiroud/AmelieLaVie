import { defineArrayMember, defineField, defineType } from "sanity";
import { ThListIcon } from "@sanity/icons";

export const sectionBlurbs = defineType({
  name: "section.blurbs",
  title: "Section : Tuiles (image + texte)",
  type: "object",
  icon: ThListIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Titre de la section (optionnel)",
      type: "string",
    }),
    defineField({
      name: "subheading",
      title: "Sous-titre (optionnel)",
      type: "text",
      rows: 2,
      description: "Accroche ou résumé affiché sous le titre principal.",
    }),
    defineField({
      name: "items",
      title: "Tuiles",
      type: "array",
      of: [
        defineArrayMember({
          name: "blurb",
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image / icône",
              type: "image",
              fields: [
                defineField({
                  name: "alt",
                  title: "Texte alternatif",
                  type: "string",
                  description:
                    "Décrivez l'image en une phrase courte (lu par les lecteurs d'écran).",
                  validation: (R) => R.required(),
                }),
              ],
            }),
            defineField({
              name: "title",
              title: "Titre (optionnel)",
              type: "string",
              description: "Laissez vide si l'image et le texte se suffisent à eux-mêmes.",
              validation: (R) => R.max(60),
            }),
            defineField({
              name: "text",
              title: "Description courte",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "link",
              title: "Lien (optionnel)",
              type: "ctaLink",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "text", media: "image" },
          },
        }),
      ],
      validation: (R) => R.required().min(1).max(6),
    }),
    defineField({
      name: "footerNote",
      title: "Note de bas de section (optionnel)",
      type: "string",
      description:
        "Phrase courte affichée sous les tuiles (ex: « L'habitat a été inauguré en juin 2025 ! »).",
    }),
    defineField({
      name: "cta",
      title: "Bouton d'action (optionnel)",
      type: "ctaLink",
      description: "Affiché tout en bas de la section pour rediriger vers une page détaillée.",
    }),
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title ?? "Tuiles",
      subtitle: `${items?.length ?? 0} tuile(s)`,
    }),
  },
});
