import { defineArrayMember, defineField, defineType } from "sanity";
import { TextIcon } from "@sanity/icons";

export const sectionRichText = defineType({
  name: "section.richText",
  title: "Bloc de texte (paragraphes, titres, liens)",
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
                  defineField({
                    name: "href",
                    title: "URL ou chemin",
                    type: "url",
                    description: "Chemin interne (ex: /contact/) ou URL externe (https://…).",
                    validation: (R) =>
                      R.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
                  }),
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
    select: { heading: "heading", body: "body" },
    prepare: ({ heading, body }) => {
      const snippet = Array.isArray(body)
        ? body
            .filter((b: any) => b?._type === "block")
            .map((b: any) =>
              (b.children ?? [])
                .filter((c: any) => c?._type === "span" && typeof c.text === "string")
                .map((c: any) => c.text)
                .join(""),
            )
            .join(" ")
            .trim()
        : "";
      const title = heading?.trim() || (snippet ? snippet.slice(0, 80) + (snippet.length > 80 ? "…" : "") : "(à compléter)");
      return { title, subtitle: "Texte libre" };
    },
  },
});
