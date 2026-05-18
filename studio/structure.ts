import type { StructureResolver } from "sanity/structure";
import {
  CogIcon,
  HomeIcon,
  EarthGlobeIcon,
  MenuIcon,
  UserIcon,
  DocumentTextIcon,
  CalendarIcon,
  HeartFilledIcon,
  TagIcon,
} from "@sanity/icons";

import type { SingletonType } from "./schemas";

const singleton = (
  S: Parameters<StructureResolver>[0],
  type: SingletonType,
  title: string,
  icon?: typeof CogIcon,
) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenu")
    .items([
      // ═══ Réglages ═══
      S.listItem()
        .title("Réglages")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Réglages du site")
            .items([
              singleton(S, "siteSettings", "Identité du site", CogIcon),
              singleton(S, "navigation", "Navigation (header & footer)", MenuIcon),
              singleton(S, "contactInfo", "Coordonnées & intégrations", UserIcon),
            ]),
        ),

      S.divider(),

      // ═══ Pages ═══
      singleton(S, "homePage", "Page d'accueil", HomeIcon),
      S.documentTypeListItem("page").title("Pages").icon(EarthGlobeIcon),

      S.divider(),

      // ═══ Contenu éditorial ═══
      S.documentTypeListItem("actualite").title("Actualités").icon(DocumentTextIcon),
      S.documentTypeListItem("evenement").title("Agenda").icon(CalendarIcon),

      S.divider(),

      // ═══ Référentiels ═══
      S.documentTypeListItem("partenaire").title("Partenaires").icon(HeartFilledIcon),
      S.documentTypeListItem("tag").title("Tags").icon(TagIcon),
    ]);
