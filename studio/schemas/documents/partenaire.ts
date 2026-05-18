import { defineField, defineType } from "sanity";
import { HeartFilledIcon } from "@sanity/icons";

export const partenaire = defineType({
  name: "partenaire",
  title: "Partenaire",
  type: "document",
  icon: HeartFilledIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (R) => R.required().min(2).max(80),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: false },
      fields: [
        defineField({
          name: "alt",
          title: "Texte alternatif",
          type: "string",
          description: "Par défaut : le nom du partenaire. À surcharger uniquement si nécessaire.",
        }),
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "url",
      title: "Site web",
      type: "url",
      validation: (R) =>
        R.uri({
          scheme: ["http", "https"],
          allowRelative: false,
        }),
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      description: "Plus le nombre est petit, plus le partenaire apparaît en premier.",
      initialValue: 100,
      validation: (R) => R.integer().min(0),
    }),
  ],
  orderings: [
    {
      title: "Ordre d'affichage",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Nom (A→Z)",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "url", media: "logo" },
  },
});
