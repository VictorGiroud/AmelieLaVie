/**
 * Types TypeScript pour les documents Sanity.
 * Reflètent les schemas définis dans `studio/schemas/`.
 *
 * Note : pas générés automatiquement (volontairement minimaliste pour Phase 3).
 * On pourra basculer plus tard sur `sanity typegen` si le projet grossit.
 */

export interface SanityImage {
  _type: "image";
  asset?: {
    _id?: string;
    _ref?: string;
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width: number; height: number; aspectRatio: number };
    };
  };
  alt?: string;
  caption?: string;
}

export interface CtaLink {
  _type: "ctaLink";
  label: string;
  href: string;
  external?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}

export interface NavLink {
  _type: "navLink";
  _key?: string;
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  _type: "socialLink";
  _key?: string;
  platform: "facebook" | "youtube" | "instagram" | "linkedin" | "x";
  url: string;
  label: string;
}

export interface FooterColumn {
  _type: "footerColumn";
  _key?: string;
  heading: string;
  links?: NavLink[];
}

export interface Seo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
  noIndex?: boolean;
}

export interface PortableTextSpan {
  _type: "span";
  _key: string;
  text: string;
  marks?: string[];
}

export interface PortableTextMarkDef {
  _type: "link";
  _key: string;
  href: string;
  external?: boolean;
}

export interface PortableTextBlock {
  _type: "block";
  _key: string;
  style: "normal" | "h2" | "h3" | "h4" | "blockquote";
  listItem?: "bullet" | "number";
  level?: number;
  markDefs?: PortableTextMarkDef[];
  children: PortableTextSpan[];
}

export interface PortableTextImage extends SanityImage {
  _key: string;
}

export type PortableTextContent = (PortableTextBlock | PortableTextImage)[];

// ─── Documents ───────────────────────────────────────────────────────────────

export interface SiteSettings {
  _type: "siteSettings";
  title: string;
  shortDescription: string;
  longDescription: string;
  logo?: SanityImage;
  defaultOgImage?: SanityImage;
  favicon?: SanityImage;
}

export interface Navigation {
  _type: "navigation";
  headerLinks: NavLink[];
  footerColumns: FooterColumn[];
  footerLegalNote?: string;
  social: SocialLink[];
}

export interface ContactInfo {
  _type: "contactInfo";
  email?: string;
  phone?: string;
  address?: string;
  /** Lien HelloAsso d'adhésion (année en cours). */
  helloAssoAdhesionUrl?: string;
  /** Lien HelloAsso du formulaire de don pérenne. */
  helloAssoDonUrl?: string;
  /** Lien HelloAsso de la boutique réservation rando. */
  helloAssoReservationUrl?: string;
  mailchimpEndpoint?: string;
}

export interface UiLabels {
  _type: "uiLabels";
  notFoundTitle: string;
  notFoundMessage?: string;
  notFoundCtaLabel: string;
  notFoundCtaHref: string;
  actualitesHeading: string;
  actualitesDescription?: string;
  actualitesEmptyState?: string;
  actualitesReadMoreLabel: string;
  agendaHeading: string;
  agendaDescription?: string;
  agendaEmptyState?: string;
  agendaPastSeparator?: string;
  contactFormHeading: string;
  contactFormNameLabel: string;
  contactFormEmailLabel: string;
  contactFormMessageLabel: string;
  contactFormSubmitLabel: string;
  contactFormSuccessMessage?: string;
  contactFormErrorMessage?: string;
  contactFormPrivacyNote?: string;
}

export interface Tag {
  _type: "tag";
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
}

export interface Partenaire {
  _type: "partenaire";
  _id: string;
  name: string;
  logo: SanityImage;
  url?: string;
  order: number;
}

export interface Actualite {
  _type: "actualite";
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  description: string;
  featuredImage: SanityImage;
  body: PortableTextContent;
  tags?: Tag[];
  published: boolean;
  seo?: Seo;
}

export interface Evenement {
  _type: "evenement";
  _id: string;
  title: string;
  slug: { current: string };
  startDate: string;
  endDate?: string;
  address?: string;
  locationCoords?: { lat: number; lng: number };
  resume?: string;
  image?: SanityImage;
  body?: PortableTextContent;
  display: boolean;
  seo?: Seo;
}

// ─── Sections (page builder) ─────────────────────────────────────────────────

export interface SectionHero {
  _type: "section.hero";
  _key: string;
  title: string;
  displayStyle?: "default" | "quote";
  subtitle?: string;
  alerte?: string;
  backgroundImage?: SanityImage;
  ctas?: CtaLink[];
}

export interface SectionRichText {
  _type: "section.richText";
  _key: string;
  heading?: string;
  body: PortableTextContent;
  background?: "white" | "alt";
}

export interface SectionImageText {
  _type: "section.imageText";
  _key: string;
  image: SanityImage;
  imagePosition?: "left" | "right";
  title: string;
  body: PortableTextContent;
  ctas?: CtaLink[];
}

export interface SectionBlurbs {
  _type: "section.blurbs";
  _key: string;
  heading?: string;
  subheading?: string;
  items: {
    _key: string;
    image?: SanityImage;
    title?: string;
    text?: string;
    link?: CtaLink;
  }[];
  footerNote?: string;
  cta?: CtaLink;
}

export interface SectionGallery {
  _type: "section.gallery";
  _key: string;
  title?: string;
  images: SanityImage[];
  layout?: "grid" | "masonry" | "carousel";
}

export interface SectionActualitesList {
  _type: "section.actualitesList";
  _key: string;
  heading: string;
  limit?: number;
  filterTag?: Tag;
  showSeeAllLink?: boolean;
}

export interface SectionAgendaList {
  _type: "section.agendaList";
  _key: string;
  heading: string;
  limit?: number;
  showPast?: boolean;
  emptyState?: string;
}

export interface SectionPartenairesGrid {
  _type: "section.partenairesGrid";
  _key: string;
  heading: string;
  partenaires?: Partenaire[];
}

export interface SectionCta {
  _type: "section.cta";
  _key: string;
  heading: string;
  body?: string;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
  illustration?: "heart" | "megaphone" | "phone" | "hands" | "none";
  background?: "brand" | "alt" | "white";
}

export interface SectionEmbed {
  _type: "section.embed";
  _key: string;
  title?: string;
  provider: "helloasso" | "youtube";
  /** Pour HelloAsso : utiliser une URL centrale (adhésion / don / réservation)
   *  plutôt que d'en saisir une à la main. */
  helloAssoLink?: "adhesion" | "don" | "reservation" | "custom";
  /** URL utilisée pour YouTube ou HelloAsso en mode `custom`. */
  url?: string;
  height?: number;
}

export interface SectionNewsletter {
  _type: "section.newsletter";
  _key: string;
  heading: string;
  description?: string;
  emailLabel?: string;
  ctaLabel: string;
  successMessage?: string;
  errorMessage?: string;
  privacyNote?: string;
}

export interface SectionContactForm {
  _type: "section.contactForm";
  _key: string;
  introText?: string;
}

export type Section =
  | SectionHero
  | SectionRichText
  | SectionImageText
  | SectionBlurbs
  | SectionGallery
  | SectionActualitesList
  | SectionAgendaList
  | SectionPartenairesGrid
  | SectionCta
  | SectionEmbed
  | SectionNewsletter
  | SectionContactForm;

export interface HomePage {
  _type: "homePage";
  sections: Section[];
}

export interface Page {
  _type: "page";
  _id: string;
  title: string;
  slug: { current: string };
  sections: Section[];
  seo?: Seo;
}
