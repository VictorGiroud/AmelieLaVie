import { defineField, defineType } from "sanity";
import { CodeIcon } from "@sanity/icons";

const ALLOWED_PROVIDERS = ["helloasso", "youtube"] as const;

export const sectionEmbed = defineType({
  name: "section.embed",
  title: "Section : Intégration externe",
  type: "object",
  icon: CodeIcon,
  description: "Intègre un formulaire HelloAsso (dons / adhésions) ou une vidéo YouTube.",
  fields: [
    defineField({
      name: "title",
      title: "Titre (optionnel)",
      type: "string",
    }),
    defineField({
      name: "provider",
      title: "Source",
      type: "string",
      initialValue: "helloasso",
      options: {
        list: [
          { title: "HelloAsso (formulaire dons / adhésion)", value: "helloasso" },
          { title: "YouTube (vidéo)", value: "youtube" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "url",
      title: "URL à intégrer",
      type: "url",
      description:
        "Lien HelloAsso (helloasso.com/...) ou lien YouTube (youtube.com/watch?v=... ou youtu.be/...).",
      validation: (R) =>
        R.required()
          .uri({ scheme: ["https"] })
          .custom((url, ctx) => {
            if (!url) return true;
            const provider = (ctx.parent as { provider?: string } | undefined)?.provider;
            if (provider === "helloasso" && !url.includes("helloasso.com")) {
              return "L'URL doit être un lien helloasso.com";
            }
            if (provider === "youtube" && !/youtube\.com|youtu\.be/.test(url)) {
              return "L'URL doit être un lien youtube.com ou youtu.be";
            }
            return true;
          }),
    }),
    defineField({
      name: "height",
      title: "Hauteur (en pixels)",
      type: "number",
      initialValue: 720,
      validation: (R) => R.integer().min(200).max(2000),
    }),
  ],
  preview: {
    select: { title: "title", provider: "provider", url: "url" },
    prepare: ({ title, provider, url }) => {
      const label = ALLOWED_PROVIDERS.includes(provider as (typeof ALLOWED_PROVIDERS)[number])
        ? provider.toUpperCase()
        : "Embed";
      return {
        title: title ?? `Intégration ${label}`,
        subtitle: url,
      };
    },
  },
});
