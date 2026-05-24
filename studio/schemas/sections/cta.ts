import { defineField, defineType } from "sanity";
import { RocketIcon } from "@sanity/icons";

export const sectionCta = defineType({
  name: "section.cta",
  title: "Boutons d'action (Soutenir, Contacter…)",
  type: "object",
  icon: RocketIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Titre",
      type: "string",
      validation: (R) => R.required().min(3).max(120),
    }),
    defineField({
      name: "body",
      title: "Texte d'accroche",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "primaryCta",
      title: "Bouton principal",
      type: "ctaLink",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "secondaryCta",
      title: "Bouton secondaire (optionnel)",
      type: "ctaLink",
    }),
    defineField({
      name: "illustration",
      title: "Icône du bouton principal",
      type: "string",
      initialValue: "heart",
      description:
        "L'icône est automatiquement déduite du libellé du bouton si laissée par défaut (« Cœur » sur « Soutenir », « Téléphone » sur « Contacter »…).",
      options: {
        list: [
          { title: "❤️ Cœur (don, soutien)", value: "heart" },
          { title: "📞 Téléphone (contact)", value: "phone" },
          { title: "🤝 Mains jointes (adhésion)", value: "hands" },
          { title: "📣 Mégaphone (annonce)", value: "megaphone" },
          { title: "Aucune", value: "none" },
        ],
      },
    }),
    defineField({
      name: "background",
      title: "Fond",
      type: "string",
      initialValue: "brand",
      options: {
        list: [
          { title: "Couleur de marque", value: "brand" },
          { title: "Beige clair", value: "alt" },
          { title: "Blanc", value: "white" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "primaryCta.label" },
    prepare: ({ title, subtitle }) => ({
      title: title ?? "Appel à l'action",
      subtitle: subtitle ? `→ ${subtitle}` : undefined,
    }),
  },
});
