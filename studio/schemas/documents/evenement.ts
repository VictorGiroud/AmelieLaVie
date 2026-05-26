import { defineArrayMember, defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export const evenement = defineType({
  name: "evenement",
  title: "Événement (agenda)",
  type: "document",
  icon: CalendarIcon,
  groups: [
    { name: "content", title: "Contenu", default: true },
    { name: "location", title: "Lieu & dates" },
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
      name: "startDate",
      title: "Date de l'événement (début)",
      type: "datetime",
      group: "location",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "endDate",
      title: "Date de fin (optionnel)",
      type: "datetime",
      group: "location",
      description: "À renseigner uniquement si l'événement dure plusieurs jours.",
    }),
    defineField({
      name: "address",
      title: "Adresse / lieu",
      type: "string",
      group: "location",
      description: "Ex: Centre social, 12 rue X, 69001 Lyon",
    }),
    defineField({
      name: "locationCoords",
      title: "Coordonnées GPS (optionnel)",
      type: "geopoint",
      group: "location",
      description: "Pour afficher une carte. Optionnel.",
    }),
    defineField({
      name: "image",
      title: "Image (optionnelle)",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texte alternatif",
          type: "string",
          validation: (R) => R.required(),
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Description détaillée",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraphe", value: "normal" },
            { title: "Titre H2", value: "h2" },
            { title: "Titre H3", value: "h3" },
          ],
          lists: [
            { title: "Liste à puces", value: "bullet" },
            { title: "Liste numérotée", value: "number" },
          ],
        }),
      ],
    }),
    defineField({
      name: "display",
      title: "Afficher sur le site",
      type: "boolean",
      group: "meta",
      initialValue: true,
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
      title: "Date (à venir → passé)",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
    {
      title: "Date (récent → ancien)",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "startDate",
      media: "image",
      display: "display",
    },
    prepare({ title, subtitle, media, display }) {
      const date = subtitle
        ? new Date(subtitle).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })
        : "—";
      return {
        title: `${display ? "" : "🚫 "}${title}`,
        subtitle: date,
        media,
      };
    },
  },
});
