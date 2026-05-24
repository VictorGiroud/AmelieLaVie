import { defineArrayMember, defineField, defineType } from "sanity";
import { SplitVerticalIcon } from "@sanity/icons";

export const sectionImageText = defineType({
  name: "section.imageText",
  title: "Section : Image + Texte",
  type: "object",
  icon: SplitVerticalIcon,
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texte alternatif",
          type: "string",
          validation: (R) => R.required(),
        }),
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "imagePosition",
      title: "Position de l'image",
      type: "string",
      initialValue: "left",
      options: {
        list: [
          { title: "À gauche", value: "left" },
          { title: "À droite", value: "right" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "body",
      title: "Texte",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Paragraphe", value: "normal" }],
          lists: [{ title: "Liste à puces", value: "bullet" }],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                fields: [defineField({ name: "href", title: "URL", type: "url" })],
              },
            ],
          },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: "ctas",
      title: "Boutons (optionnel)",
      type: "array",
      of: [defineArrayMember({ type: "ctaLink" })],
      validation: (R) => R.max(2),
    }),
  ],
  preview: {
    select: { title: "title", media: "image" },
    prepare: ({ title, media }) => ({
      title: title ?? "Image + Texte",
      subtitle: "Section image+texte",
      media,
    }),
  },
});
