import type { SchemaTypeDefinition } from "sanity";

// Objets réutilisables
import { seo, ctaLink, altImage } from "./objects";

// Documents
import { tag, partenaire, actualite, evenement, page } from "./documents";

// Singletons
import { siteSettings, navigation, contactInfo, uiLabels, homePage } from "./singletons";

// Sections (page builder)
import {
  sectionHero,
  sectionRichText,
  sectionImageText,
  sectionBlurbs,
  sectionGallery,
  sectionActualitesList,
  sectionAgendaList,
  sectionPartenairesGrid,
  sectionCta,
  sectionEmbed,
  sectionNewsletter,
} from "./sections";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objets
  seo,
  ctaLink,
  altImage,
  // Documents
  tag,
  partenaire,
  actualite,
  evenement,
  page,
  // Singletons
  siteSettings,
  navigation,
  contactInfo,
  uiLabels,
  homePage,
  // Sections
  sectionHero,
  sectionRichText,
  sectionImageText,
  sectionBlurbs,
  sectionGallery,
  sectionActualitesList,
  sectionAgendaList,
  sectionPartenairesGrid,
  sectionCta,
  sectionEmbed,
  sectionNewsletter,
];

export { SINGLETON_TYPES } from "./singletons";
export type { SingletonType } from "./singletons";
