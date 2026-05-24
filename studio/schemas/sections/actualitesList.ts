import { defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

export const sectionActualitesList = defineType({
  name: "section.actualitesList",
  title: "Aperçu des dernières actualités",
  type: "object",
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Titre de la section",
      type: "string",
      initialValue: "Actualités",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "limit",
      title: "Nombre d'articles à afficher",
      type: "number",
      initialValue: 3,
      validation: (R) => R.integer().min(1).max(20),
    }),
    defineField({
      name: "filterTag",
      title: "Filtrer par tag (optionnel)",
      type: "reference",
      to: [{ type: "tag" }],
    }),
    defineField({
      name: "showSeeAllLink",
      title: "Afficher un lien « Voir toutes les actualités »",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { heading: "heading", limit: "limit", tag: "filterTag.title" },
    prepare: ({ heading, limit, tag }) => ({
      title: heading ?? "Liste d'actualités",
      subtitle: `${limit ?? "?"} article(s)${tag ? ` · tag: ${tag}` : ""}`,
    }),
  },
});
