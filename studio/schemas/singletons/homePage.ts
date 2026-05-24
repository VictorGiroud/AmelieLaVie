import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

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

export const homePage = defineType({
  name: "homePage",
  title: "Page d'accueil",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "content", title: "Sections", default: true },
    { name: "meta", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "sections",
      title: "Sections de la page d'accueil",
      type: "array",
      group: "content",
      description: "Glissez-déposez pour réordonner. Hero conseillé en premier.",
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
    prepare: () => ({ title: "Page d'accueil" }),
  },
});
