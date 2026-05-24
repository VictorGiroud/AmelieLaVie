import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export const sectionNewsletter = defineType({
  name: "section.newsletter",
  title: "Formulaire d'inscription newsletter",
  type: "object",
  icon: EnvelopeIcon,
  description: "L'endpoint Mailchimp est défini dans « Coordonnées & intégrations ».",
  fields: [
    defineField({
      name: "heading",
      title: "Titre",
      type: "string",
      initialValue: "Restez informé",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      initialValue: "Recevez nos actualités et événements directement par email.",
    }),
    defineField({
      name: "emailLabel",
      title: "Libellé du champ email",
      type: "string",
      initialValue: "Votre adresse email",
    }),
    defineField({
      name: "ctaLabel",
      title: "Libellé du bouton",
      type: "string",
      initialValue: "S'inscrire",
      validation: (R) => R.required().max(30),
    }),
    defineField({
      name: "successMessage",
      title: "Message de succès",
      type: "string",
      initialValue: "Merci ! Vous recevrez bientôt nos prochaines actualités.",
    }),
    defineField({
      name: "errorMessage",
      title: "Message d'erreur",
      type: "string",
      initialValue: "Une erreur est survenue. Merci de réessayer dans quelques instants.",
    }),
    defineField({
      name: "privacyNote",
      title: "Mention RGPD",
      type: "string",
      initialValue:
        "Vous pouvez vous désinscrire à tout moment via le lien présent dans nos emails.",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: title ?? "Newsletter",
      subtitle: "Inscription newsletter",
    }),
  },
});
