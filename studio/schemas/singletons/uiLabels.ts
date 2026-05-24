import { defineField, defineType } from "sanity";
import { ControlsIcon } from "@sanity/icons";

/**
 * Singleton qui centralise les labels d'UI qui ne tiennent dans aucun autre
 * document : page 404, en-têtes des listes d'actus/agenda, formulaire de
 * contact. Objectif : zéro string FR hardcodé côté front Astro.
 */
export const uiLabels = defineType({
  name: "uiLabels",
  title: "Libellés d'interface",
  type: "document",
  icon: ControlsIcon,
  groups: [
    { name: "errors", title: "Erreurs (404)", default: true },
    { name: "actualites", title: "Liste des actualités" },
    { name: "agenda", title: "Liste de l'agenda" },
    { name: "contact", title: "Formulaire de contact" },
  ],
  fields: [
    // ─── 404 ──────────────────────────────────────────────
    defineField({
      name: "notFoundTitle",
      title: "Titre de la page 404",
      type: "string",
      group: "errors",
      initialValue: "Page introuvable",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "notFoundMessage",
      title: "Message",
      type: "text",
      rows: 3,
      group: "errors",
      initialValue:
        "La page que vous cherchez n'existe pas ou plus. Elle a peut-être été déplacée.",
    }),
    defineField({
      name: "notFoundCtaLabel",
      title: "Texte du bouton de retour",
      type: "string",
      group: "errors",
      initialValue: "Retour à l'accueil",
    }),
    defineField({
      name: "notFoundCtaHref",
      title: "URL du bouton de retour",
      type: "string",
      group: "errors",
      initialValue: "/",
    }),

    // ─── Actualités index ─────────────────────────────────
    defineField({
      name: "actualitesHeading",
      title: "Titre de la liste des actualités",
      type: "string",
      group: "actualites",
      initialValue: "Actualités",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "actualitesDescription",
      title: "Description / intro",
      type: "text",
      rows: 2,
      group: "actualites",
      initialValue:
        "Retrouvez ici toutes nos actualités : projets en cours, rencontres, évolutions de l'association.",
    }),
    defineField({
      name: "actualitesEmptyState",
      title: "Message si aucune actualité",
      type: "string",
      group: "actualites",
      initialValue: "Aucune actualité pour le moment. Revenez bientôt !",
    }),
    defineField({
      name: "actualitesReadMoreLabel",
      title: "Libellé « Lire la suite »",
      type: "string",
      group: "actualites",
      initialValue: "Lire la suite",
    }),

    // ─── Agenda index ─────────────────────────────────────
    defineField({
      name: "agendaHeading",
      title: "Titre de la liste de l'agenda",
      type: "string",
      group: "agenda",
      initialValue: "Agenda",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "agendaDescription",
      title: "Description / intro",
      type: "text",
      rows: 2,
      group: "agenda",
      initialValue:
        "Tous les événements à venir et passés : randonnées, marchés de Noël, assemblées générales.",
    }),
    defineField({
      name: "agendaEmptyState",
      title: "Message si aucun événement",
      type: "string",
      group: "agenda",
      initialValue: "Aucun événement prévu pour le moment.",
    }),
    defineField({
      name: "agendaPastSeparator",
      title: "Séparateur événements passés",
      type: "string",
      group: "agenda",
      initialValue: "Événements passés",
    }),

    // ─── Formulaire de contact ────────────────────────────
    defineField({
      name: "contactFormHeading",
      title: "Titre du formulaire",
      type: "string",
      group: "contact",
      initialValue: "Nous écrire",
    }),
    defineField({
      name: "contactFormNameLabel",
      title: "Libellé champ « Nom »",
      type: "string",
      group: "contact",
      initialValue: "Votre nom",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "contactFormEmailLabel",
      title: "Libellé champ « Email »",
      type: "string",
      group: "contact",
      initialValue: "Votre email",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "contactFormMessageLabel",
      title: "Libellé champ « Message »",
      type: "string",
      group: "contact",
      initialValue: "Votre message",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "contactFormSubmitLabel",
      title: "Texte du bouton d'envoi",
      type: "string",
      group: "contact",
      initialValue: "Envoyer",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "contactFormSuccessMessage",
      title: "Message de succès",
      type: "text",
      rows: 2,
      group: "contact",
      initialValue: "Merci pour votre message ! Nous reviendrons vers vous rapidement.",
    }),
    defineField({
      name: "contactFormErrorMessage",
      title: "Message d'erreur",
      type: "text",
      rows: 2,
      group: "contact",
      initialValue:
        "Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous contacter directement par email.",
    }),
    defineField({
      name: "contactFormPrivacyNote",
      title: "Mention RGPD",
      type: "text",
      rows: 2,
      group: "contact",
      initialValue:
        "Vos données ne sont utilisées que pour répondre à votre message. Elles ne seront ni partagées ni stockées au-delà du nécessaire.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Libellés d'interface" }),
  },
});
