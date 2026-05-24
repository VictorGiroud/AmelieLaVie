import { defineArrayMember, defineField, defineType } from "sanity";
import { TextIcon } from "@sanity/icons";

export const sectionRichText = defineType({
  name: "section.richText",
  title: "Section : Texte enrichi",
  type: "object",
  icon: TextIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Titre (optionnel)",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Contenu",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraphe", value: "normal" },
            { title: "Titre H2", value: "h2" },
            { title: "Titre H3", value: "h3" },
            { title: "Citation", value: "blockquote" },
          ],
          lists: [
            { title: "Liste à puces", value: "bullet" },
            { title: "Liste numérotée", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Lien",
                type: "object",
                fields: [
                  defineField({ name: "href", title: "URL", type: "url" }),
                  defineField({
                    name: "external",
                    title: "Externe ?",
                    type: "boolean",
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texte alternatif",
              type: "string",
              validation: (R) => R.required(),
            }),
            defineField({ name: "caption", title: "Légende", type: "string" }),
          ],
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: "background",
      title: "Fond",
      type: "string",
      initialValue: "white",
      options: {
        list: [
          { title: "Blanc", value: "white" },
          { title: "Beige clair", value: "alt" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title ?? "Texte enrichi", subtitle: "Section texte" }),
  },
});
