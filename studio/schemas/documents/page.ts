import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

const SECTION_TYPES = [
  "section.hero",
  "section.richText",
  "section.imageText",
  "section.blurbs",
  "section.gallery",
  "section.actualitesList",
  "section.agendaList",
  "section.partenairesGrid",
  "section.cta",
  "section.embed",
  "section.newsletter",
  "section.contactForm",
] as const;

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentsIcon,
  groups: [
    { name: "content", title: "Sections", default: true },
    { name: "meta", title: "URL & SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Nom du document",
      type: "string",
      group: "meta",
      description:
        "Sert uniquement à retrouver la page dans le Studio. Le titre visible par les visiteurs est défini dans la section « Hero » en haut de page.",
      validation: (R) => R.required().min(2).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "meta",
      description: "Exemple : « habitat-partage » donne /habitat-partage/.",
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      group: "content",
      description: "Glissez-déposez pour réordonner. Ajoutez n'importe quel type de section.",
      of: SECTION_TYPES.map((t) => defineArrayMember({ type: t })),
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "meta",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `/${subtitle}/` : "(slug manquant)",
      };
    },
  },
});
