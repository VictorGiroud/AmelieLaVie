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
    // ── URLs HelloAsso (centralisées ici, utilisées partout sur le site) ─
    // - Le bouton d'adhésion sur /nous-soutenir/ utilise helloAssoAdhesionUrl
    // - Le bouton de don sur /nous-soutenir/ utilise helloAssoDonUrl
    // - Les URLs courtes amelielavie.com/adherer, /donner, /reservation
    //   redirigent vers ces URLs. Mise à jour annuelle ici uniquement.
    defineField({
      name: "helloAssoAdhesionUrl",
      title: "URL HelloAsso — Adhésion",
      type: "url",
      group: "integrations",
      description:
        "Lien d'adhésion de l'année en cours (ex: …/adhesions/adherer-a-l-association-pour-2027). À mettre à jour à chaque nouvelle campagne. Utilisé par le bouton sur la page « Nous soutenir » et par l'URL courte amelielavie.com/adherer.",
      validation: (R) =>
        R.uri({ scheme: ["https"] }).custom((url) => {
          if (!url) return true;
          return url.includes("helloasso.com") || "Doit être une URL helloasso.com";
        }),
    }),
    defineField({
      name: "helloAssoDonUrl",
      title: "URL HelloAsso — Don pérenne",
      type: "url",
      group: "integrations",
      description:
        "Lien du formulaire de don (pérenne, ne change pas chaque année). Utilisé par le bouton sur la page « Nous soutenir » et par l'URL courte amelielavie.com/donner.",
      validation: (R) =>
        R.uri({ scheme: ["https"] }).custom((url) => {
          if (!url) return true;
          return url.includes("helloasso.com") || "Doit être une URL helloasso.com";
        }),
    }),
    defineField({
      name: "helloAssoReservationUrl",
      title: "URL HelloAsso — Réservation rando (optionnel)",
      type: "url",
      group: "integrations",
      description:
        "Boutique de réservation pour la randonnée annuelle. Utilisé par l'URL courte amelielavie.com/reservation.",
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
