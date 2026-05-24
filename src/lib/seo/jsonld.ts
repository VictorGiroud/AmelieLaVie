/**
 * Helpers JSON-LD pour les rich results Google.
 * Spec : https://schema.org/
 * Test : https://search.google.com/test/rich-results
 */
import type {
  Actualite,
  ContactInfo,
  Evenement,
  Navigation,
  SiteSettings,
} from "@lib/sanity/types";
import { imageUrl } from "@lib/sanity/image";

interface JsonLd {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}

export function organizationJsonLd({
  siteSettings,
  contactInfo,
  navigation,
  siteUrl,
}: {
  siteSettings: SiteSettings | null;
  contactInfo: ContactInfo | null;
  navigation: Navigation | null;
  siteUrl: string;
}): JsonLd {
  const logo = siteSettings?.logo ? imageUrl(siteSettings.logo, 600) : undefined;
  const sameAs = navigation?.social?.map((s) => s.url).filter(Boolean) ?? [];

  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: siteSettings?.title ?? "Amélie la Vie",
    description: siteSettings?.longDescription ?? siteSettings?.shortDescription,
    url: siteUrl,
    ...(logo ? { logo } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(contactInfo?.email || contactInfo?.phone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            ...(contactInfo.email ? { email: contactInfo.email } : {}),
            ...(contactInfo.phone ? { telephone: contactInfo.phone } : {}),
            ...(contactInfo.address ? { address: contactInfo.address } : {}),
            availableLanguage: "French",
          },
        }
      : {}),
  };
}

export function articleJsonLd({
  article,
  siteSettings,
  siteUrl,
  canonicalUrl,
}: {
  article: Actualite;
  siteSettings: SiteSettings | null;
  siteUrl: string;
  canonicalUrl: string;
}): JsonLd {
  const image = article.featuredImage?.asset ? imageUrl(article.featuredImage, 1200) : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    ...(image ? { image: [image] } : {}),
    inLanguage: "fr-FR",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    publisher: {
      "@type": "NGO",
      name: siteSettings?.title ?? "Amélie la Vie",
      url: siteUrl,
      ...(siteSettings?.logo
        ? { logo: { "@type": "ImageObject", url: imageUrl(siteSettings.logo, 600) } }
        : {}),
    },
    ...(article.tags && article.tags.length > 0
      ? { keywords: article.tags.map((t) => t.title).join(", ") }
      : {}),
  };
}

export function eventJsonLd({
  event,
  siteSettings,
  canonicalUrl,
}: {
  event: Evenement;
  siteSettings: SiteSettings | null;
  canonicalUrl: string;
}): JsonLd {
  const image = event.image?.asset ? imageUrl(event.image, 1200) : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.resume ?? event.title,
    startDate: event.startDate,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: "fr-FR",
    url: canonicalUrl,
    ...(image ? { image: [image] } : {}),
    ...(event.address
      ? {
          location: {
            "@type": "Place",
            name: event.address,
            address: { "@type": "PostalAddress", streetAddress: event.address },
          },
        }
      : {}),
    organizer: {
      "@type": "NGO",
      name: siteSettings?.title ?? "Amélie la Vie",
    },
  };
}

// Regex construites via String.fromCharCode pour éviter d'avoir des caractères
// U+2028 / U+2029 littéraux dans le source (qui casserait le parser).
const LINE_SEP = new RegExp(String.fromCharCode(0x2028), "g");
const PARA_SEP = new RegExp(String.fromCharCode(0x2029), "g");

/**
 * Sérialise un objet en JSON safe pour injection dans <script type="application/ld+json">.
 * Échappe < > & et U+2028 / U+2029 (line/paragraph separators) qui sont valides en JSON
 * mais invalides dans un littéral string JavaScript.
 */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data, null, 0)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(LINE_SEP, "\\u2028")
    .replace(PARA_SEP, "\\u2029");
}
