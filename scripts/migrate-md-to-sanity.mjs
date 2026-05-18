#!/usr/bin/env node
/**
 * Migration du contenu Markdown legacy vers Sanity.
 *
 * Sources :
 *   - legacy/src/pages/actualites/*.md → documents `actualite`
 *   - legacy/src/pages/agenda/*.md     → documents `evenement`
 *   - legacy/src/pages/index.md        → singleton `homePage`
 *   - legacy/src/pages/{association,habitat-partage,contact,nous-soutenir,mentions-legales}/index.md
 *                                       → documents `page`
 *
 * Usage :
 *   pnpm migrate:content             # dry-run
 *   pnpm migrate:content --commit    # écrit dans Sanity
 *   pnpm migrate:content --commit --only=actualites,agenda
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, basename, extname } from "node:path";
import { randomBytes } from "node:crypto";
import matter from "gray-matter";

import { loadDotenvLocal, ROOT } from "./lib/env.mjs";
import { getWriteClient, config } from "./lib/sanity-client.mjs";
import { uploadImageWithAlt, fakeUpload, resolveLegacyAsset } from "./lib/image-uploader.mjs";
import { markdownToPortableText } from "./lib/markdown-to-portable-text.mjs";
import { deterministicId, sanitySlug, normalizeSlug } from "./lib/slug.mjs";

loadDotenvLocal();

const key = () => randomBytes(6).toString("hex");

// ─── CLI ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const COMMIT = args.includes("--commit");
const onlyArg = args.find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? onlyArg.slice("--only=".length).split(",") : null;
const include = (kind) => !ONLY || ONLY.includes(kind);

const LEGACY_PAGES = resolve(ROOT, "legacy", "src", "pages");

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Liste les fichiers .md d'un dossier. */
function listMd(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => resolve(dir, f));
}

/** Capitalise la première lettre, garde le reste (pour normaliser les tags). */
function capitalize(s) {
  const str = String(s ?? "").trim();
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

/** Génère un excerpt (~160 caractères) à partir de markdown, pour fallback SEO. */
function excerpt(markdown, max = 160) {
  if (!markdown) return "";
  const txt = String(markdown)
    .replace(/!\[.*?\]\(.*?\)/g, "") // strip images
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // unlink → keep label
    .replace(/[*_`>#]/g, "") // strip md syntax
    .replace(/\s+/g, " ")
    .trim();
  if (txt.length <= max) return txt;
  return txt.slice(0, max - 1).trimEnd() + "…";
}

/** Charge une fixture JSON depuis scripts/fixtures/. */
function loadFixture(name) {
  return JSON.parse(readFileSync(resolve(ROOT, "scripts", "fixtures", name), "utf8"));
}

const FALLBACK_IMAGE = resolve(ROOT, "legacy", "src", "img", "amelielavie.png");

/** Wrapper image upload qui gère DRY-RUN + résolution d'URL legacy. */
function makeImageUploader(client) {
  return async (legacyUrl, alt, { fallback = false } = {}) => {
    if (!legacyUrl || !String(legacyUrl).trim()) {
      if (fallback) return await fromFallback(client, alt);
      return null;
    }
    const absolute = resolveLegacyAsset(legacyUrl);
    if (!absolute) {
      console.warn(`    ⚠️  Asset introuvable: ${legacyUrl}`);
      if (fallback) return await fromFallback(client, alt);
      return null;
    }
    if (COMMIT && client) {
      return await uploadImageWithAlt(client, absolute, alt ?? "");
    }
    return { ...fakeUpload(absolute), alt: alt ?? "" };
  };
}

async function fromFallback(client, alt) {
  if (!existsSync(FALLBACK_IMAGE)) return null;
  if (COMMIT && client) {
    return await uploadImageWithAlt(client, FALLBACK_IMAGE, alt ?? "Amélie la Vie");
  }
  return { ...fakeUpload(FALLBACK_IMAGE), alt: alt ?? "Amélie la Vie" };
}

/** Wrapper pour le markdown-converter : passe la fonction resolveImage. */
function makeMdConverter(client) {
  const uploader = makeImageUploader(client);
  return async (markdown) =>
    markdownToPortableText(markdown, {
      resolveImage: async (legacyUrl) => {
        const ref = await uploader(legacyUrl, "");
        if (!ref) return null;
        // On strip le `alt` du retour car la signature attend juste {_type, asset}
        return { _type: ref._type, asset: ref.asset };
      },
    });
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

async function mapActualite(filePath, client) {
  const { data, content } = matter(readFileSync(filePath, "utf8"));
  const slugBase = basename(filePath, extname(filePath));
  const slug = normalizeSlug(slugBase);
  const uploadImg = makeImageUploader(client);
  const toPT = makeMdConverter(client);

  // featuredImage est `required` côté schema : on retombe sur le logo de l'asso
  // pour les rares articles dont le frontmatter est mal renseigné.
  const featuredImage = await uploadImg(data.featuredimage, data.title ?? slug, {
    fallback: true,
  });

  // Description : frontmatter sinon excerpt du body (pour SEO).
  const description =
    (data.description && String(data.description).trim()) || excerpt(content, 200);

  // SEO enrichi : metaDescription dérivée, ogImage = featuredImage par défaut
  const seo = {
    _type: "seo",
    metaDescription: description.slice(0, 175),
  };
  if (featuredImage?.asset) {
    seo.ogImage = { _type: "image", asset: featuredImage.asset };
  }

  return {
    _id: deterministicId("actualite", slug),
    _type: "actualite",
    title: data.title ?? slugBase,
    slug: sanitySlug(slug),
    publishedAt: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    description,
    featuredImage,
    body: await toPT(content),
    tags: [], // résolus en 2e passe (cf. main())
    _rawTags: Array.isArray(data.tags) ? data.tags : [],
    published: data.published !== false,
    seo,
  };
}

async function mapEvenement(filePath, client) {
  const { data, content } = matter(readFileSync(filePath, "utf8"));
  const slugBase = basename(filePath, extname(filePath));
  const slug = normalizeSlug(slugBase);
  const toPT = makeMdConverter(client);

  const doc = {
    _id: deterministicId("evenement", slug),
    _type: "evenement",
    title: data.title ?? slugBase,
    slug: sanitySlug(slug),
    startDate: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    body: content.trim() ? await toPT(content) : [],
    display: data.display !== false,
  };
  if (data.address) doc.address = String(data.address);
  if (data.resume) doc.resume = String(data.resume);

  // SEO : utilise le résumé si présent
  if (doc.resume) {
    doc.seo = {
      _type: "seo",
      metaDescription: doc.resume.slice(0, 175),
    };
  }
  return doc;
}

async function mapTag(rawTitle) {
  // Normalisation : capitalise pour cohérence ("site internet" → "Site internet").
  const title = capitalize(String(rawTitle).trim());
  const slug = normalizeSlug(title);
  return {
    _id: deterministicId("tag", slug),
    _type: "tag",
    title,
    slug: sanitySlug(slug),
  };
}

async function mapHomePage(filePath, client) {
  const { data } = matter(readFileSync(filePath, "utf8"));
  const uploadImg = makeImageUploader(client);
  const sections = [];

  // 1. Section Hero (alerte + heading + title)
  sections.push({
    _key: key(),
    _type: "section.hero",
    title: data.heading ?? data.title ?? "Amélie la Vie",
    subtitle: data.title && data.title !== data.heading ? data.title : undefined,
    alerte: data.alerte ?? undefined,
  });

  // 2. Section ImageText (presentation : image + title + description)
  if (data.presentation) {
    const pres = data.presentation;
    const image = pres.image ? await uploadImg(pres.image, pres.title ?? "") : null;
    if (image) {
      sections.push({
        _key: key(),
        _type: "section.imageText",
        image,
        imagePosition: "left",
        title: pres.title ?? "Notre histoire",
        body: await markdownToPortableText(pres.description ?? "", {
          resolveImage: async () => null,
        }),
      });
    }
  }

  // 3. Section Blurbs (intro.heading + blurbs[])
  if (data.intro?.blurbs?.length) {
    const items = [];
    for (const b of data.intro.blurbs) {
      const image = b.image ? await uploadImg(b.image, "") : null;
      items.push({
        _key: key(),
        image,
        title: "", // pas de title dans legacy blurbs
        text: b.text ?? "",
      });
    }
    sections.push({
      _key: key(),
      _type: "section.blurbs",
      heading: data.intro.heading ?? undefined,
      items,
    });
    if (data.intro.description) {
      sections.push({
        _key: key(),
        _type: "section.richText",
        body: await markdownToPortableText(data.intro.description, {
          resolveImage: async () => null,
        }),
        background: "white",
      });
    }
  }

  // 4. Sections "structurelles" qui étaient hardcodées (à éditer après dans Studio)
  sections.push(
    {
      _key: key(),
      _type: "section.actualitesList",
      heading: "Actualités",
      limit: 3,
      showSeeAllLink: true,
    },
    {
      _key: key(),
      _type: "section.agendaList",
      heading: "Événements à venir",
      limit: 5,
      showPast: false,
      emptyState: "Aucun événement prévu pour le moment.",
    },
    {
      _key: key(),
      _type: "section.partenairesGrid",
      heading: "Amélie la Vie est soutenu par :",
    },
    {
      _key: key(),
      _type: "section.cta",
      heading: "Soutenez Amélie la Vie",
      body: "Adhérez, faites un don, ou venez nous rencontrer.",
      primaryCta: {
        _type: "ctaLink",
        label: "Nous soutenir",
        href: "/nous-soutenir/",
        external: false,
        variant: "primary",
      },
      secondaryCta: {
        _type: "ctaLink",
        label: "Nous contacter",
        href: "/contact/",
        external: false,
        variant: "secondary",
      },
      illustration: "heart",
      background: "alt",
    },
    {
      _key: key(),
      _type: "section.newsletter",
      heading: "Restez informé",
      description: "Recevez nos actualités et événements directement par email.",
      ctaLabel: "S'inscrire",
    },
  );

  return {
    _id: "homePage",
    _type: "homePage",
    sections,
  };
}

async function mapPage(filePath, client) {
  const { data, content } = matter(readFileSync(filePath, "utf8"));
  const slugBase = basename(resolve(filePath, ".."));
  const slug = normalizeSlug(slugBase);
  const uploadImg = makeImageUploader(client);
  const toPT = makeMdConverter(client);

  const sections = [];

  // Hero : title + subtitle + image
  const heroImage = data.image ? await uploadImg(data.image, data.title ?? slug) : null;
  sections.push({
    _key: key(),
    _type: "section.hero",
    title: data.title ?? slugBase,
    subtitle: data.subtitle ?? undefined,
    backgroundImage: heroImage ?? undefined,
  });

  // Pour la page Contact : on garde le body comme richText. Le formulaire de contact
  // sera ajouté manuellement (composant Astro dédié, pas une section CMS).
  if (content.trim()) {
    sections.push({
      _key: key(),
      _type: "section.richText",
      body: await toPT(content),
      background: "white",
    });
  }

  // Cas particulier "nous-soutenir" : adhesion + tips frontmatter → 2 CTA blocks
  if (data.adhesion || data.tips) {
    if (data.adhesion) {
      sections.push({
        _key: key(),
        _type: "section.richText",
        body: await markdownToPortableText(`### Adhérer\n\n${data.adhesion}`, {
          resolveImage: async () => null,
        }),
        background: "alt",
      });
    }
    if (data.tips) {
      sections.push({
        _key: key(),
        _type: "section.richText",
        body: await markdownToPortableText(`### Faire un don\n\n${data.tips}`, {
          resolveImage: async () => null,
        }),
        background: "white",
      });
    }
  }

  const seo = { _type: "seo" };
  if (data.description) seo.metaDescription = String(data.description);
  if (heroImage?.asset) seo.ogImage = { _type: "image", asset: heroImage.asset };

  return {
    _id: deterministicId("page", slug),
    _type: "page",
    title: data.title ?? slugBase,
    slug: sanitySlug(slug),
    sections,
    seo,
  };
}

// ─── Singletons globaux (Navbar, Footer, settings hardcodés legacy) ──────────

async function mapSiteSettings(client) {
  const fixture = loadFixture("site-settings.json");
  const uploadImg = makeImageUploader(client);
  const logo = fixture.logo ? await uploadImg(fixture.logo, "Amélie la Vie") : null;
  const og = fixture.defaultOgImage
    ? await uploadImg(fixture.defaultOgImage, "Amélie la Vie")
    : null;

  const doc = {
    _id: "siteSettings",
    _type: "siteSettings",
    title: fixture.title,
    shortDescription: fixture.shortDescription,
    longDescription: fixture.longDescription,
  };
  if (logo) doc.logo = { ...logo, alt: "Amélie la Vie" };
  if (og) doc.defaultOgImage = og;
  return doc;
}

function mapNavigation() {
  const fixture = loadFixture("navigation.json");
  return {
    _id: "navigation",
    _type: "navigation",
    headerLinks: fixture.headerLinks.map((l) => ({ _key: key(), _type: "navLink", ...l })),
    footerColumns: fixture.footerColumns.map((c) => ({
      _key: key(),
      _type: "footerColumn",
      heading: c.heading,
      links: c.links.map((l) => ({ _key: key(), _type: "navLink", ...l })),
    })),
    footerLegalNote: fixture.footerLegalNote,
    social: fixture.social.map((s) => ({ _key: key(), _type: "socialLink", ...s })),
  };
}

function mapContactInfo() {
  const fixture = loadFixture("contact-info.json");
  const doc = {
    _id: "contactInfo",
    _type: "contactInfo",
  };
  if (fixture.email) doc.email = fixture.email;
  if (fixture.phone) doc.phone = fixture.phone;
  if (fixture.address) doc.address = fixture.address;
  if (fixture.helloAssoUrl) doc.helloAssoUrl = fixture.helloAssoUrl;
  if (fixture.mailchimpEndpoint) doc.mailchimpEndpoint = fixture.mailchimpEndpoint;
  return doc;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("📦 Migration du contenu legacy → Sanity");
  console.log(`   Dataset : ${config.dataset}`);
  console.log(`   Mode    : ${COMMIT ? "🚀 COMMIT" : "👀 DRY-RUN"}`);
  if (ONLY) console.log(`   Filtre  : --only=${ONLY.join(",")}`);
  console.log();

  const client = COMMIT ? getWriteClient() : null;
  const tx = COMMIT ? client.transaction() : null;
  const stats = { actualite: 0, evenement: 0, page: 0, tag: 0, homePage: 0, settings: 0 };

  // ─── Settings globaux (siteSettings, navigation, contactInfo) ──
  if (include("settings")) {
    console.log("⚙️  Settings globaux");
    const siteSettings = await mapSiteSettings(client);
    const navigation = mapNavigation();
    const contactInfo = mapContactInfo();
    console.log(`  • siteSettings — ${siteSettings.title}`);
    console.log(
      `  • navigation   — ${navigation.headerLinks.length} liens header, ${navigation.footerColumns.length} colonnes footer, ${navigation.social.length} réseaux sociaux`,
    );
    console.log(`  • contactInfo  — ${contactInfo.email ?? "(pas d'email)"}`);
    if (COMMIT) {
      tx.createOrReplace(siteSettings);
      tx.createOrReplace(navigation);
      tx.createOrReplace(contactInfo);
    }
    stats.settings = 3;
    console.log();
  }

  // ─── Actualités ────────────────────────────────────
  if (include("actualites")) {
    console.log("📰 Actualités");
    const files = listMd(resolve(LEGACY_PAGES, "actualites"));
    const tagSet = new Map(); // slug → doc
    const articles = [];

    for (const f of files) {
      const doc = await mapActualite(f, client);
      articles.push(doc);
      for (const rawTag of doc._rawTags ?? []) {
        if (typeof rawTag !== "string") continue;
        const tagDoc = await mapTag(rawTag);
        if (!tagSet.has(tagDoc._id)) tagSet.set(tagDoc._id, tagDoc);
      }
      console.log(`  • ${doc.title.slice(0, 60).padEnd(60)} → ${doc._id}`);
      stats.actualite++;
    }

    // Tags
    for (const tagDoc of tagSet.values()) {
      console.log(`  🏷  ${tagDoc.title.padEnd(60)} → ${tagDoc._id}`);
      if (COMMIT) tx.createOrReplace(tagDoc);
      stats.tag++;
    }

    // Lier tags aux articles + écrire articles
    for (const a of articles) {
      const rawTags = a._rawTags ?? [];
      delete a._rawTags;
      a.tags = rawTags.map((t) => ({
        _key: key(),
        _type: "reference",
        _ref: deterministicId("tag", normalizeSlug(t)),
      }));
      if (COMMIT) tx.createOrReplace(a);
    }
  }

  // ─── Agenda ────────────────────────────────────────
  if (include("agenda")) {
    console.log();
    console.log("📅 Agenda");
    for (const f of listMd(resolve(LEGACY_PAGES, "agenda"))) {
      const doc = await mapEvenement(f, client);
      console.log(`  • ${doc.title.slice(0, 60).padEnd(60)} → ${doc._id}`);
      if (COMMIT) tx.createOrReplace(doc);
      stats.evenement++;
    }
  }

  // ─── HomePage ──────────────────────────────────────
  if (include("homepage")) {
    console.log();
    console.log("🏠 Page d'accueil");
    const indexMd = resolve(LEGACY_PAGES, "index.md");
    if (existsSync(indexMd)) {
      const doc = await mapHomePage(indexMd, client);
      console.log(`  • homePage (${doc.sections.length} sections)`);
      if (COMMIT) tx.createOrReplace(doc);
      stats.homePage++;
    }
  }

  // ─── Pages legacy ──────────────────────────────────
  if (include("pages")) {
    console.log();
    console.log("📄 Pages");
    const folders = [
      "association",
      "habitat-partage",
      "contact",
      "nous-soutenir",
      "mentions-legales",
    ];
    for (const folder of folders) {
      const f = resolve(LEGACY_PAGES, folder, "index.md");
      if (!existsSync(f)) {
        console.warn(`  ⚠️  Manquant: ${folder}/index.md`);
        continue;
      }
      const doc = await mapPage(f, client);
      console.log(`  • ${folder.padEnd(20)} → ${doc._id} (${doc.sections.length} sections)`);
      if (COMMIT) tx.createOrReplace(doc);
      stats.page++;
    }
  }

  console.log();
  console.log("─".repeat(70));
  console.log(
    `📊 Résumé : ${stats.settings} settings · ${stats.actualite} actualités · ${stats.tag} tags · ${stats.evenement} événements · ${stats.page} pages · ${stats.homePage} homePage`,
  );

  if (COMMIT) {
    console.log();
    console.log("💾 Commit transaction...");
    await tx.commit();
    console.log("✅ Migration terminée.");
  } else {
    console.log("👀 Dry-run OK. Relance avec --commit pour écrire dans Sanity.");
  }
}

main().catch((err) => {
  console.error("❌ Erreur:", err);
  process.exit(1);
});
