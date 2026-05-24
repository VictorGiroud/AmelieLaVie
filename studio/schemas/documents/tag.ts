import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Nom",
      type: "string",
      validation: (R) => R.required().min(2).max(30),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 40 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "Description (optionnelle)",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
