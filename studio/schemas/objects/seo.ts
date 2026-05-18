import { defineField, defineType } from "sanity";
import { SearchIcon } from "@sanity/icons";

export const seo = defineType({
  name: "seo",
  title: "Référencement (SEO)",
  type: "object",
  icon: SearchIcon,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Titre SEO",
      type: "string",
      description: "Optionnel. Si vide, le titre de la page est utilisé. Max ~60 caractères.",
      validation: (R) => R.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "Description SEO",
      type: "text",
      rows: 3,
      description: "Optionnel. Affiché par Google sous le titre. Max ~160 caractères.",
      validation: (R) => R.max(180),
    }),
    defineField({
      name: "ogImage",
      title: "Image de partage (Open Graph)",
      type: "image",
      description: "Image affichée quand la page est partagée sur Facebook, LinkedIn, etc.",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Ne pas indexer cette page",
      type: "boolean",
      initialValue: false,
      description: "À activer pour les pages techniques ou en brouillon.",
    }),
  ],
});
