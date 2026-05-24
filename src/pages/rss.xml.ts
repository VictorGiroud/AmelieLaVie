import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getActualites, getSiteSettings } from "@lib/sanity/queries";

export async function GET(context: APIContext) {
  const [articles, siteSettings] = await Promise.all([getActualites(50), getSiteSettings()]);

  const site =
    context.site ?? new URL(import.meta.env.PUBLIC_SITE_URL ?? "https://amelielavie.com");

  return rss({
    title: siteSettings?.title ? `Actualités — ${siteSettings.title}` : "Actualités",
    description: siteSettings?.shortDescription ?? "Les actualités de l'association Amélie la Vie.",
    site,
    items: articles.map((a) => ({
      title: a.title,
      pubDate: new Date(a.publishedAt),
      description: a.description,
      link: `/actualites/${a.slug.current}/`,
      categories: a.tags?.map((t) => t.title),
    })),
    customData: `<language>fr-FR</language>`,
    stylesheet: "/rss-styles.xsl",
  });
}
