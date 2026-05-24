import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons";

export const ctaLink = defineType({
  name: "ctaLink",
  title: "Bouton / Lien",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Texte du bouton",
      type: "string",
      validation: (R) => R.required().min(2).max(40),
    }),
    defineField({
      name: "href",
      title: "URL ou chemin",
      type: "string",
      description: "Chemin interne (ex: /contact/) ou URL externe complète (https://...).",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "external",
      title: "Lien externe ?",
      type: "boolean",
      initialValue: false,
      description: "Si activé, ouvre dans un nouvel onglet et ajoute rel=noopener.",
    }),
    defineField({
      name: "variant",
      title: "Style",
      type: "string",
      initialValue: "primary",
      options: {
        list: [
          { title: "Principal (bouton plein)", value: "primary" },
          { title: "Secondaire (bouton outline)", value: "secondary" },
          { title: "Lien texte", value: "ghost" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
