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
                  validation: (R) => R.required(),
                }),
              ],
            }),
            defineField({
              name: "title",
              title: "Titre",
              type: "string",
              validation: (R) => R.required().max(60),
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
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title ?? "Tuiles",
      subtitle: `${items?.length ?? 0} tuile(s)`,
    }),
  },
});
