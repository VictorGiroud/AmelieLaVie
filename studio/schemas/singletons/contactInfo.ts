import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export const contactInfo = defineType({
  name: "contactInfo",
  title: "Coordonnées & intégrations",
  type: "document",
  icon: UserIcon,
  groups: [
    { name: "coords", title: "Coordonnées", default: true },
    { name: "integrations", title: "Intégrations" },
  ],
  fields: [
    defineField({
      name: "email",
      title: "Email de contact",
      type: "string",
      group: "coords",
      validation: (R) => R.email(),
    }),
    defineField({
      name: "phone",
      title: "Téléphone",
      type: "string",
      group: "coords",
      description: "Format libre, ex: « 06 12 34 56 78 ».",
    }),
    defineField({
      name: "address",
      title: "Adresse postale",
      type: "text",
      rows: 3,
      group: "coords",
    }),
    defineField({
      name: "helloAssoUrl",
      title: "URL HelloAsso (page de dons)",
      type: "url",
      group: "integrations",
      description: "URL d'embed du formulaire HelloAsso (https://www.helloasso.com/...).",
      validation: (R) =>
        R.uri({ scheme: ["https"] }).custom((url) => {
          if (!url) return true;
          return url.includes("helloasso.com") || "Doit être une URL helloasso.com";
        }),
    }),
    defineField({
      name: "mailchimpEndpoint",
      title: "Endpoint Mailchimp (newsletter)",
      type: "url",
      group: "integrations",
      description:
        "URL d'action du formulaire d'inscription Mailchimp (https://....list-manage.com/subscribe/post?u=...&id=...).",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Coordonnées & intégrations" }),
  },
});
