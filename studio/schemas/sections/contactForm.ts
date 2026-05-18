import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

/**
 * Marqueur de section : insère le formulaire de contact à cet endroit.
 * Les libellés (Nom / Email / Message / bouton / messages) vivent dans
 * le singleton `uiLabels`. L'email de destination est celui de `contactInfo`.
 */
export const sectionContactForm = defineType({
  name: "section.contactForm",
  title: "Section : Formulaire de contact",
  type: "object",
  icon: EnvelopeIcon,
  description:
    "Insère le formulaire de contact à cet endroit. Les libellés sont dans Réglages → Libellés d'interface.",
  fields: [
    defineField({
      name: "introText",
      title: "Texte d'introduction (optionnel)",
      type: "text",
      rows: 2,
      description:
        "Court paragraphe affiché au-dessus du formulaire. Si vide, le formulaire s'affiche seul.",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Formulaire de contact",
      subtitle: "Configuré dans Réglages → Libellés d'interface + Coordonnées",
    }),
  },
});
