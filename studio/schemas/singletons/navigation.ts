import { defineArrayMember, defineField, defineType } from "sanity";
import { MenuIcon } from "@sanity/icons";

const navLink = {
  name: "navLink",
  title: "Lien",
  type: "object" as const,
  fields: [
    defineField({
      name: "label",
      title: "Libellé",
      type: "string",
      validation: (R) => R.required().min(2).max(40),
    }),
    defineField({
      name: "href",
      title: "URL ou chemin",
      type: "string",
      description: "Chemin interne (/contact/) ou URL externe (https://...).",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "external",
      title: "Lien externe",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
};

export const navigation = defineType({
  name: "navigation",
  title: "Navigation (header & footer)",
  type: "document",
  icon: MenuIcon,
  groups: [
    { name: "header", title: "En-tête (menu haut)", default: true },
    { name: "footer", title: "Pied de page" },
    { name: "social", title: "Réseaux sociaux" },
  ],
  fields: [
    defineField({
      name: "headerLinks",
      title: "Liens du menu principal",
      type: "array",
      group: "header",
      description: "Glissez-déposez pour réordonner.",
      of: [defineArrayMember(navLink)],
      validation: (R) => R.required().min(1).max(8),
    }),
    defineField({
      name: "footerColumns",
      title: "Colonnes du pied de page",
      type: "array",
      group: "footer",
      of: [
        defineArrayMember({
          name: "footerColumn",
          type: "object",
          fields: [
            defineField({
              name: "heading",
              title: "Titre de la colonne",
              type: "string",
              validation: (R) => R.required().min(2).max(30),
            }),
            defineField({
              name: "links",
              title: "Liens",
              type: "array",
              of: [defineArrayMember(navLink)],
            }),
          ],
          preview: {
            select: { title: "heading", subtitle: "links.length" },
            prepare: ({ title, subtitle }) => ({
              title,
              subtitle: subtitle ? `${subtitle} lien(s)` : "0 lien",
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "footerLegalNote",
      title: "Mention légale en bas de page",
      type: "string",
      group: "footer",
      description:
        "Ex: « © 2026 Amélie la Vie — Tous droits réservés ». Le copyright année est dynamique.",
    }),
    defineField({
      name: "social",
      title: "Réseaux sociaux",
      type: "array",
      group: "social",
      of: [
        defineArrayMember({
          name: "socialLink",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Plateforme",
              type: "string",
              options: {
                list: [
                  { title: "Facebook", value: "facebook" },
                  { title: "YouTube", value: "youtube" },
                  { title: "Instagram", value: "instagram" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "X / Twitter", value: "x" },
                ],
              },
              validation: (R) => R.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (R) => R.required().uri({ scheme: ["https"] }),
            }),
            defineField({
              name: "label",
              title: "Texte accessible",
              type: "string",
              description: "Ex: « Amélie la Vie sur Facebook ». Utilisé par les lecteurs d'écran.",
              validation: (R) => R.required(),
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Navigation" }),
  },
});
