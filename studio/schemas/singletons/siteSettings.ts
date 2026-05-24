import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Identité du site",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "title",
      title: "Nom du site",
      type: "string",
      initialValue: "Amélie la Vie",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Description courte",
      type: "string",
      description: "Phrase courte qui décrit l'association (~10 mots). Utilisée comme baseline.",
      validation: (R) => R.required().max(120),
    }),
    defineField({
      name: "longDescription",
      title: "Description longue (SEO)",
      type: "text",
      rows: 3,
      description:
        "~160 caractères. Sert de description SEO par défaut pour les pages sans SEO custom.",
      validation: (R) => R.required().max(200),
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
          initialValue: "Amélie la Vie",
        }),
      ],
    }),
    defineField({
      name: "defaultOgImage",
      title: "Image de partage par défaut",
      type: "image",
      description:
        "Affichée quand une page est partagée sur les réseaux sociaux sans image custom.",
      options: { hotspot: true },
    }),
    defineField({
      name: "favicon",
      title: "Favicon (SVG ou PNG)",
      type: "image",
      description: "Carré, idéalement SVG.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Identité du site" }),
  },
});
