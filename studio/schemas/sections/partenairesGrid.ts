import { defineArrayMember, defineField, defineType } from "sanity";
import { HeartFilledIcon } from "@sanity/icons";

export const sectionPartenairesGrid = defineType({
  name: "section.partenairesGrid",
  title: "Section : Grille de partenaires",
  type: "object",
  icon: HeartFilledIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Titre de la section",
      type: "string",
      initialValue: "Amélie la Vie est soutenu par :",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "partenaires",
      title: "Partenaires à afficher",
      type: "array",
      description:
        "Si vide, tous les partenaires sont affichés triés par leur ordre. Sinon, seuls ceux listés ici apparaissent (dans l'ordre choisi).",
      of: [defineArrayMember({ type: "reference", to: [{ type: "partenaire" }] })],
    }),
  ],
  preview: {
    select: { heading: "heading", partenaires: "partenaires" },
    prepare: ({ heading, partenaires }) => ({
      title: heading ?? "Grille partenaires",
      subtitle: partenaires?.length
        ? `${partenaires.length} partenaire(s) sélectionné(s)`
        : "Tous les partenaires",
    }),
  },
});
