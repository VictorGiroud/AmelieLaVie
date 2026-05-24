import { defineArrayMember, defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons";

export const sectionGallery = defineType({
  name: "section.gallery",
  title: "Galerie photos",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "title",
      title: "Titre (optionnel)",
      type: "string",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
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
      options: { layout: "grid" },
      validation: (R) => R.required().min(1).max(24),
    }),
    defineField({
      name: "layout",
      title: "Mise en page",
      type: "string",
      initialValue: "grid",
      options: {
        list: [
          { title: "Grille (3 colonnes)", value: "grid" },
          { title: "Mosaïque (tailles variables)", value: "masonry" },
          { title: "Carrousel", value: "carousel" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "title", images: "images" },
    prepare: ({ title, images }) => ({
      title: title ?? "Galerie",
      subtitle: `${images?.length ?? 0} image(s)`,
    }),
  },
});
