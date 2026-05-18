import type { StructureResolver } from "sanity/structure";
import { CogIcon, HomeIcon, EarthGlobeIcon, MenuIcon, UserIcon } from "@sanity/icons";

type SingletonType = "siteSettings" | "navigation" | "contactInfo" | "homePage";

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
      singleton(S, "homePage", "Page d’accueil", HomeIcon),
      S.documentTypeListItem("page").title("Pages").icon(EarthGlobeIcon),
      S.divider(),
      S.documentTypeListItem("actualite").title("Actualités"),
      S.documentTypeListItem("evenement").title("Agenda"),
      S.divider(),
      S.documentTypeListItem("partenaire").title("Partenaires"),
      S.documentTypeListItem("tag").title("Tags"),
    ]);
