import { sanity } from "./client";
import type {
  Actualite,
  ContactInfo,
  Evenement,
  HomePage,
  Navigation,
  Page,
  Partenaire,
  SiteSettings,
  Tag,
  UiLabels,
} from "./types";

// Fragments GROQ réutilisables (concaténation manuelle, pas de DSL).
const IMAGE_FRAGMENT = `{
  _type, alt, caption,
  asset->{ _id, url, metadata { lqip, dimensions } }
}`;

const CTA_LINK_FRAGMENT = `{ _type, label, href, external, variant }`;
const NAV_LINK_FRAGMENT = `{ _key, _type, label, href, external }`;

const PORTABLE_TEXT_FRAGMENT = `body[]{
  ...,
  _type == "image" => ${IMAGE_FRAGMENT},
  _type == "block" => {
    ...,
    children[]{
      _key, _type, text, marks
    },
    markDefs[]{
      _key, _type, href, external
    }
  }
}`;

const SECTIONS_FRAGMENT = `sections[]{
  _key, _type,
  // hero
  _type == "section.hero" => {
    title, subtitle, alerte,
    backgroundImage ${IMAGE_FRAGMENT},
    ctas[] ${CTA_LINK_FRAGMENT}
  },
  // richText
  _type == "section.richText" => {
    heading, background,
    ${PORTABLE_TEXT_FRAGMENT}
  },
  // imageText
  _type == "section.imageText" => {
    title, imagePosition,
    image ${IMAGE_FRAGMENT},
    ${PORTABLE_TEXT_FRAGMENT},
    ctas[] ${CTA_LINK_FRAGMENT}
  },
  // blurbs
  _type == "section.blurbs" => {
    heading,
    items[]{
      _key, title, text,
      image ${IMAGE_FRAGMENT},
      link ${CTA_LINK_FRAGMENT}
    }
  },
  // gallery
  _type == "section.gallery" => {
    title, layout,
    images[] ${IMAGE_FRAGMENT}
  },
  // actualitesList
  _type == "section.actualitesList" => {
    heading, limit, showSeeAllLink,
    filterTag->{ _id, title, "slug": slug.current }
  },
  // agendaList
  _type == "section.agendaList" => {
    heading, limit, showPast, emptyState
  },
  // partenairesGrid
  _type == "section.partenairesGrid" => {
    heading,
    partenaires[]->{
      _id, name, url, order,
      logo ${IMAGE_FRAGMENT}
    }
  },
  // cta
  _type == "section.cta" => {
    heading, body, illustration, background,
    primaryCta ${CTA_LINK_FRAGMENT},
    secondaryCta ${CTA_LINK_FRAGMENT}
  },
  // embed
  _type == "section.embed" => {
    title, provider, url, height
  },
  // newsletter
  _type == "section.newsletter" => {
    heading, description, emailLabel, ctaLabel,
    successMessage, errorMessage, privacyNote
  }
}`;

// ─── Singletons ──────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanity.fetch(
    `*[_type == "siteSettings"][0]{
      _type, title, shortDescription, longDescription,
      logo ${IMAGE_FRAGMENT},
      defaultOgImage ${IMAGE_FRAGMENT},
      favicon ${IMAGE_FRAGMENT}
    }`,
  );
}

export async function getNavigation(): Promise<Navigation | null> {
  return sanity.fetch(
    `*[_type == "navigation"][0]{
      _type,
      headerLinks[] ${NAV_LINK_FRAGMENT},
      footerColumns[]{
        _key, _type, heading,
        links[] ${NAV_LINK_FRAGMENT}
      },
      footerLegalNote,
      social[]{ _key, _type, platform, url, label }
    }`,
  );
}

export async function getContactInfo(): Promise<ContactInfo | null> {
  return sanity.fetch(`*[_type == "contactInfo"][0]`);
}

export async function getUiLabels(): Promise<UiLabels | null> {
  return sanity.fetch(`*[_type == "uiLabels"][0]`);
}

export async function getHomePage(): Promise<HomePage | null> {
  return sanity.fetch(`*[_type == "homePage"][0]{ _type, ${SECTIONS_FRAGMENT} }`);
}

// ─── Pages ───────────────────────────────────────────────────────────────────

export async function getAllPageSlugs(): Promise<{ slug: string }[]> {
  return sanity.fetch(`*[_type == "page" && defined(slug.current)]{ "slug": slug.current }`);
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  return sanity.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      _id, _type, title, slug,
      ${SECTIONS_FRAGMENT},
      seo{ metaTitle, metaDescription, noIndex, ogImage ${IMAGE_FRAGMENT} }
    }`,
    { slug },
  );
}

// ─── Actualités ──────────────────────────────────────────────────────────────

export async function getAllActualitesSlugs(): Promise<{ slug: string }[]> {
  return sanity.fetch(
    `*[_type == "actualite" && published == true && defined(slug.current)]{ "slug": slug.current }`,
  );
}

export async function getActualites(limit = 100, tagSlug?: string): Promise<Actualite[]> {
  const filter = tagSlug ? `&& count(tags[@->slug.current == $tagSlug]) > 0` : "";
  return sanity.fetch(
    `*[_type == "actualite" && published == true ${filter}] | order(publishedAt desc)[0...$limit]{
      _id, _type, title, slug, publishedAt, description, published,
      featuredImage ${IMAGE_FRAGMENT},
      tags[]->{ _id, title, "slug": slug.current }
    }`,
    { limit, tagSlug },
  );
}

export async function getActualiteBySlug(slug: string): Promise<Actualite | null> {
  return sanity.fetch(
    `*[_type == "actualite" && slug.current == $slug][0]{
      _id, _type, title, slug, publishedAt, description, published,
      featuredImage ${IMAGE_FRAGMENT},
      ${PORTABLE_TEXT_FRAGMENT},
      tags[]->{ _id, title, "slug": slug.current },
      seo{ metaTitle, metaDescription, noIndex, ogImage ${IMAGE_FRAGMENT} }
    }`,
    { slug },
  );
}

// ─── Événements ──────────────────────────────────────────────────────────────

export async function getAllEvenementsSlugs(): Promise<{ slug: string }[]> {
  return sanity.fetch(
    `*[_type == "evenement" && display == true && defined(slug.current)]{ "slug": slug.current }`,
  );
}

export async function getEvenements(limit = 100, showPast = false): Promise<Evenement[]> {
  const now = new Date().toISOString();
  const futureFilter = showPast ? "" : `&& startDate >= "${now}"`;
  return sanity.fetch(
    `*[_type == "evenement" && display == true ${futureFilter}] | order(startDate ${
      showPast ? "desc" : "asc"
    })[0...$limit]{
      _id, _type, title, slug, startDate, endDate, address, resume, display,
      image ${IMAGE_FRAGMENT}
    }`,
    { limit },
  );
}

export async function getEvenementBySlug(slug: string): Promise<Evenement | null> {
  return sanity.fetch(
    `*[_type == "evenement" && slug.current == $slug][0]{
      _id, _type, title, slug, startDate, endDate, address, locationCoords, resume, display,
      image ${IMAGE_FRAGMENT},
      ${PORTABLE_TEXT_FRAGMENT},
      seo{ metaTitle, metaDescription, noIndex, ogImage ${IMAGE_FRAGMENT} }
    }`,
    { slug },
  );
}

// ─── Tags ────────────────────────────────────────────────────────────────────

export async function getAllTags(): Promise<Tag[]> {
  return sanity.fetch(
    `*[_type == "tag"] | order(title asc){ _id, _type, title, slug, description }`,
  );
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  return sanity.fetch(
    `*[_type == "tag" && slug.current == $slug][0]{
      _id, _type, title, slug, description
    }`,
    { slug },
  );
}

// ─── Partenaires ─────────────────────────────────────────────────────────────

export async function getAllPartenaires(): Promise<Partenaire[]> {
  return sanity.fetch(
    `*[_type == "partenaire"] | order(order asc){
      _id, _type, name, url, order,
      logo ${IMAGE_FRAGMENT}
    }`,
  );
}
