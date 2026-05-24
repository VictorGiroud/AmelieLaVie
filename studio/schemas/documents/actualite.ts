import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const actualite = defineType({
  name: "actualite",
  title: "Actualité",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Contenu", default: true },
    { name: "media", title: "Médias" },
    { name: "meta", title: "Méta & SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      group: "content",
      validation: (R) => R.required().min(3).max(140),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "meta",
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "Résumé (chapeau)",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "Affiché dans la liste des actualités et utilisé comme description SEO par défaut.",
      validation: (R) => R.required().min(20).max(300),
    }),
    defineField({
      name: "featuredImage",
      title: "Image principale",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texte alternatif",
          type: "string",
          validation: (R) => R.required().min(2),
        }),
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "body",
      title: "Article",
      type: "array",
      group: "content",
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
      name: "tags",
      title: "Tags",
      type: "array",
      group: "meta",
      of: [defineArrayMember({ type: "reference", to: [{ type: "tag" }] })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "published",
      title: "Publié sur le site",
      type: "boolean",
      group: "meta",
      initialValue: true,
      description: "Désactiver pour masquer l'article publiquement sans le supprimer.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "meta",
    }),
  ],
  orderings: [
    {
      title: "Date (récent → ancien)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "featuredImage",
      published: "published",
    },
    prepare({ title, subtitle, media, published }) {
      const date = subtitle ? new Date(subtitle).toLocaleDateString("fr-FR") : "—";
      return {
        title: `${published ? "" : "🚫 "}${title}`,
        subtitle: date,
        media,
      };
    },
  },
});
