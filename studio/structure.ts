import type { StructureResolver } from "sanity/structure";
import {
  CogIcon,
  ControlsIcon,
  HomeIcon,
  EarthGlobeIcon,
  MenuIcon,
  UserIcon,
  DocumentTextIcon,
  CalendarIcon,
  HeartFilledIcon,
  TagIcon,
  InfoOutlineIcon,
  BlockContentIcon,
  EnvelopeIcon,
  DocumentIcon,
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

/**
 * Raccourci vers un document `page` spécifique (par son `_id` fixe), affiché
 * directement dans la sidebar pour éviter aux bénévoles de passer par la liste
 * complète des pages. Les pages principales du site (association, habitat,
 * contact, soutenir, mentions) ont un ID stable créé lors de la migration
 * Phase 2 et qu'on suppose pérenne.
 */
const pageShortcut = (
  S: Parameters<StructureResolver>[0],
  docId: string,
  title: string,
  icon?: typeof CogIcon,
) =>
  S.listItem()
    .id(docId)
    .title(title)
    .icon(icon)
    .child(S.document().schemaType("page").documentId(docId).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenu")
    .items([
      // ═══ Pages principales (accès rapide) ═══
      singleton(S, "homePage", "Accueil", HomeIcon),
      pageShortcut(S, "page-association", "L'association", InfoOutlineIcon),
      pageShortcut(S, "page-habitat-partage", "Habitat partagé", BlockContentIcon),
      pageShortcut(S, "page-nous-soutenir", "Nous soutenir", HeartFilledIcon),
      pageShortcut(S, "page-contact", "Contact", EnvelopeIcon),
      pageShortcut(S, "page-mentions-legales", "Mentions légales", DocumentIcon),

      S.divider(),

      // ═══ Contenu éditorial ═══
      S.documentTypeListItem("actualite").title("Actualités").icon(DocumentTextIcon),
      S.documentTypeListItem("evenement").title("Agenda").icon(CalendarIcon),

      S.divider(),

      // ═══ Référentiels ═══
      S.documentTypeListItem("partenaire").title("Partenaires").icon(HeartFilledIcon),
      S.documentTypeListItem("tag").title("Tags d'articles").icon(TagIcon),

      S.divider(),

      // ═══ Autres pages (rarement modifiées) ═══
      S.documentTypeListItem("page").title("Autres pages").icon(EarthGlobeIcon),

      S.divider(),

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
              singleton(S, "uiLabels", "Libellés d'interface", ControlsIcon),
            ]),
        ),
    ]);
