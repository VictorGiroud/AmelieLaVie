/**
 * Convertit du Markdown (string) en Portable Text (array de blocks Sanity).
 *
 * Utilise `marked.lexer()` pour obtenir l'AST de tokens, puis mappe chaque
 * token vers un block Portable Text compatible avec nos schemas (block
 * `body` des `actualite`, `evenement`, sections `richText`).
 *
 * Limitations volontaires :
 * - Pas de tableaux (non utilisés dans le contenu legacy).
 * - Pas de code blocks (non utilisés).
 * - Les images sont extraites des paragraphes pour devenir des blocks image dédiés.
 */
import { marked } from "marked";
import { randomBytes } from "node:crypto";

const key = () => randomBytes(6).toString("hex");

/**
 * @param {string} markdown
 * @param {object} opts
 * @param {(legacyUrl: string) => Promise<{_type:'image', asset:{_ref:string}}>} [opts.resolveImage]
 *   Si fourni, appelé pour chaque image legacy rencontrée. Le retour remplace le _ref.
 *   Si absent : on garde l'URL legacy dans le champ `legacyUrl` du block image (pour patch ultérieur).
 * @returns {Promise<Array>}
 */
export async function markdownToPortableText(markdown, opts = {}) {
  if (!markdown || !markdown.trim()) return [];
  const tokens = marked.lexer(markdown);
  const blocks = [];
  for (const t of tokens) {
    const out = await convertToken(t, opts);
    if (Array.isArray(out)) blocks.push(...out);
    else if (out) blocks.push(out);
  }
  return blocks;
}

async function convertToken(token, opts) {
  switch (token.type) {
    case "heading": {
      const style = token.depth >= 4 ? "h3" : token.depth === 1 ? "h2" : `h${token.depth}`;
      return makeBlock(
        style,
        await inlineChildren(token.tokens ?? [{ type: "text", text: token.text }], opts),
      );
    }

    case "paragraph": {
      // Cas spécial : paragraphe ne contenant qu'une seule image → bloc image dédié
      const standaloneImage = extractStandaloneImage(token);
      if (standaloneImage) {
        return await makeImageBlock(standaloneImage, opts);
      }
      return makeBlock("normal", await inlineChildren(token.tokens ?? [], opts));
    }

    case "blockquote": {
      const inner = (token.tokens ?? []).flatMap((t) => t.tokens ?? [t]);
      return makeBlock("blockquote", await inlineChildren(inner, opts));
    }

    case "list": {
      const out = [];
      const listItem = token.ordered ? "number" : "bullet";
      for (const item of token.items ?? []) {
        const itemTokens = item.tokens ?? [];
        const inline = [];
        for (const it of itemTokens) {
          if (it.type === "text") inline.push(...(it.tokens ?? [{ type: "text", text: it.text }]));
          else if (it.type === "paragraph") inline.push(...(it.tokens ?? []));
        }
        const children = await inlineChildren(inline, opts);
        if (children.length > 0) {
          out.push({
            _type: "block",
            _key: key(),
            style: "normal",
            listItem,
            level: 1,
            markDefs: [],
            children,
          });
        }
      }
      return out;
    }

    case "space":
    case "hr":
      return null;

    case "image": {
      return await makeImageBlock(token, opts);
    }

    case "html":
      // Ignoré : on ne traduit pas le HTML brut (rare dans le contenu legacy)
      return null;

    default:
      // Fallback : on essaie de récupérer le texte brut
      if (token.text) {
        return makeBlock("normal", [span(token.text)]);
      }
      return null;
  }
}

function extractStandaloneImage(paragraphToken) {
  const tokens = paragraphToken.tokens ?? [];
  if (tokens.length === 1 && tokens[0].type === "image") return tokens[0];
  // Cas avec espace + image
  const meaningful = tokens.filter((t) => !(t.type === "text" && /^\s*$/.test(t.text ?? "")));
  if (meaningful.length === 1 && meaningful[0].type === "image") return meaningful[0];
  return null;
}

async function makeImageBlock(imageToken, opts) {
  const legacyUrl = imageToken.href ?? "";
  const alt = imageToken.text ?? imageToken.title ?? "";
  if (opts.resolveImage) {
    try {
      const ref = await opts.resolveImage(legacyUrl);
      if (ref) {
        return {
          _key: key(),
          ...ref,
          alt,
          ...(imageToken.title ? { caption: imageToken.title } : {}),
        };
      }
    } catch (err) {
      console.warn(`⚠️  Image non résolue: ${legacyUrl} — ${err.message}`);
    }
  }
  // Fallback : on garde l'URL legacy pour patch manuel ultérieur
  return {
    _key: key(),
    _type: "image",
    legacyUrl,
    alt,
    ...(imageToken.title ? { caption: imageToken.title } : {}),
  };
}

function makeBlock(style, children) {
  // Extraire les markDefs des spans (déduplication)
  const markDefs = [];
  for (const child of children) {
    if (child._markDefs) {
      for (const def of child._markDefs) {
        if (!markDefs.find((d) => d._key === def._key)) markDefs.push(def);
      }
      delete child._markDefs;
    }
  }
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs,
    children,
  };
}

async function inlineChildren(tokens, opts, activeMarks = []) {
  const spans = [];
  for (const t of tokens) {
    spans.push(...(await inlineToken(t, opts, activeMarks)));
  }
  return spans;
}

async function inlineToken(t, opts, activeMarks) {
  switch (t.type) {
    case "text": {
      // Si text a des sous-tokens (cas marked v9+), on les déroule
      if (t.tokens && t.tokens.length > 0) {
        return await inlineChildren(t.tokens, opts, activeMarks);
      }
      return [span(decodeHtmlEntities(t.text ?? t.raw ?? ""), activeMarks)];
    }
    case "strong":
      return await inlineChildren(t.tokens ?? [{ type: "text", text: t.text }], opts, [
        ...activeMarks,
        "strong",
      ]);
    case "em":
      return await inlineChildren(t.tokens ?? [{ type: "text", text: t.text }], opts, [
        ...activeMarks,
        "em",
      ]);
    case "codespan":
      return [span(t.text, [...activeMarks, "code"])];
    case "link": {
      const markKey = key();
      const isExternal = /^https?:\/\//.test(t.href ?? "");
      const markDef = {
        _key: markKey,
        _type: "link",
        href: t.href ?? "#",
        external: isExternal,
      };
      const innerSpans = await inlineChildren(t.tokens ?? [{ type: "text", text: t.text }], opts, [
        ...activeMarks,
        markKey,
      ]);
      // Attacher la markDef au premier span (sera collectée par makeBlock)
      if (innerSpans.length > 0) {
        innerSpans[0]._markDefs = (innerSpans[0]._markDefs ?? []).concat(markDef);
      }
      return innerSpans;
    }
    case "image":
      // Image inline → on perd l'image (Portable Text n'autorise pas les images dans les spans).
      // Cas extrêmement rare dans notre contenu legacy ; on log un warning.
      console.warn(`⚠️  Image inline ignorée: ${t.href}. Mets-la sur sa propre ligne.`);
      return [span(t.text ?? "", activeMarks)];
    case "br":
      return [span("\n", activeMarks)];
    case "html":
      return []; // Ignoré
    default:
      if (t.text) return [span(t.text, activeMarks)];
      return [];
  }
}

function span(text, marks = []) {
  return {
    _type: "span",
    _key: key(),
    text,
    marks: [...new Set(marks)],
  };
}

function decodeHtmlEntities(s) {
  return String(s)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}
