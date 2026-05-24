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
      name: "helloAssoLink",
      title: "Lien HelloAsso à utiliser",
      type: "string",
      initialValue: "adhesion",
      hidden: ({ parent }) => parent?.provider !== "helloasso",
      description:
        "Choisissez « Adhésion » ou « Don » pour utiliser automatiquement les URLs centralisées (Réglages → Coordonnées & intégrations). Choisissez « URL personnalisée » pour saisir une URL HelloAsso différente dans le champ ci-dessous.",
      options: {
        list: [
          { title: "Adhésion (URL centrale, change chaque année)", value: "adhesion" },
          { title: "Don (URL centrale, pérenne)", value: "don" },
          { title: "Réservation rando (URL centrale)", value: "reservation" },
          { title: "URL personnalisée", value: "custom" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "url",
      title: "URL à intégrer",
      type: "url",
      description:
        "Lien YouTube (youtube.com/watch?v=... ou youtu.be/...) ou URL HelloAsso personnalisée. Pour les liens HelloAsso standards, préférez le sélecteur ci-dessus.",
      hidden: ({ parent }) =>
        parent?.provider === "helloasso" && parent?.helloAssoLink !== "custom",
      validation: (R) =>
        R.custom((url, ctx) => {
          const parent = ctx.parent as
            | { provider?: string; helloAssoLink?: string }
            | undefined;
          const isYoutube = parent?.provider === "youtube";
          const isCustomHelloAsso =
            parent?.provider === "helloasso" && parent?.helloAssoLink === "custom";
          if (!isYoutube && !isCustomHelloAsso) return true; // URL non requise
          if (!url) return "URL requise pour ce mode";
          if (!url.startsWith("https://")) return "URL doit commencer par https://";
          if (isYoutube && !/youtube\.com|youtu\.be/.test(url)) {
            return "L'URL doit être un lien youtube.com ou youtu.be";
          }
          if (isCustomHelloAsso && !url.includes("helloasso.com")) {
            return "L'URL doit être un lien helloasso.com";
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
    select: { title: "title", provider: "provider", helloAssoLink: "helloAssoLink", url: "url" },
    prepare: ({ title, provider, helloAssoLink, url }) => {
      const label = ALLOWED_PROVIDERS.includes(provider as (typeof ALLOWED_PROVIDERS)[number])
        ? provider.toUpperCase()
        : "Embed";
      const subtitle =
        provider === "helloasso" && helloAssoLink && helloAssoLink !== "custom"
          ? `→ ${helloAssoLink}`
          : url;
      return {
        title: title ?? `Intégration ${label}`,
        subtitle,
      };
    },
  },
});
