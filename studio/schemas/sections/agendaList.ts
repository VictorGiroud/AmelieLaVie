import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export const sectionAgendaList = defineType({
  name: "section.agendaList",
  title: "Aperçu des prochains événements",
  type: "object",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Titre de la section",
      type: "string",
      initialValue: "Événements à venir",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "limit",
      title: "Nombre d'événements à afficher",
      type: "number",
      initialValue: 5,
      validation: (R) => R.integer().min(1).max(20),
    }),
    defineField({
      name: "showPast",
      title: "Inclure les événements passés",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "emptyState",
      title: "Message si aucun événement",
      type: "string",
      initialValue: "Aucun événement prévu pour le moment.",
    }),
  ],
  preview: {
    select: { heading: "heading", limit: "limit", past: "showPast" },
    prepare: ({ heading, limit, past }) => ({
      title: heading ?? "Liste d'événements",
      subtitle: `${limit ?? "?"} événement(s)${past ? " · inclus passés" : ""}`,
    }),
  },
});
