# Amélie la Vie

[![Netlify Status](https://api.netlify.com/api/v1/badges/37c0461c-22b9-48de-a2a4-17e6f6bc6ee7/deploy-status)](https://app.netlify.com/sites/amelielavie/deploys)

Site officiel de l'association **Amélie la Vie**.

> **Refonte en cours (mai 2026)** — passage de **Gatsby 4 + Netlify CMS** à **Astro 5 + Sanity + Tailwind v4**.
> L'ancien code reste accessible dans [`legacy/`](./legacy/) le temps de la migration.
> Plan détaillé : `C:\Users\conta\.claude\plans\j-ai-ce-projet-que-jolly-pixel.md`.

---

## Stack

| Couche          | Outil                                      | Détails                                          |
| --------------- | ------------------------------------------ | ------------------------------------------------ |
| Framework       | [Astro 5](https://astro.build)             | SSG, zero-JS par défaut, islands React au besoin |
| Langage         | TypeScript strict                          | `noUncheckedIndexedAccess`, path aliases `@/*`   |
| Styles          | [Tailwind CSS v4](https://tailwindcss.com) | Config-as-CSS via `@tailwindcss/vite`            |
| CMS             | [Sanity 3](https://www.sanity.io)          | Studio dans `studio/`, free tier, Visual Editing |
| Polices         | Stack système                              | `-apple-system`, Segoe UI, Roboto… (zéro download) |
| Runtime         | Node 22 LTS                                | gérée via `.nvmrc`                               |
| Package manager | pnpm 10                                    | workspace : racine (Astro) + `studio` (Sanity)   |
| Hébergement     | Netlify                                    | Free tier, build statique                        |
| CI              | GitHub Actions                             | lint, type-check, build                          |

## Structure

```
.
├── astro.config.mjs        # Config Astro (intégrations, sitemap, trailingSlash)
├── tsconfig.json           # TS strict, path aliases @/, @components, @lib, @sanity
├── eslint.config.js        # ESLint 9 flat + jsx-a11y + plugin Astro
├── package.json            # App Astro + orchestration workspace
├── pnpm-workspace.yaml     # Liste : ['studio']
├── netlify.toml            # Build statique, Node 22
├── public/
│   ├── _redirects          # Normalisation trailing slash + redirects legacy
│   ├── _headers            # Sécurité (HSTS, CSP, etc.) + cache
│   ├── robots.txt
│   └── favicon.svg
├── src/
│   ├── pages/              # Routes Astro
│   ├── layouts/            # BaseLayout, PageLayout
│   ├── components/         # Composants Astro + islands React
│   ├── lib/                # Client Sanity, queries GROQ, helpers
│   └── styles/global.css   # Tokens Tailwind v4 + base styles
├── studio/                 # Sanity Studio (workspace pnpm)
│   ├── sanity.config.ts
│   ├── sanity.cli.ts
│   ├── structure.ts
│   └── schemas/
├── scripts/                # Migration markdown → Sanity (Phase 2)
├── .github/workflows/ci.yml
└── legacy/                 # ⚠️ ancien Gatsby — supprimé après cut-over (Phase 7)
```

## Démarrage local

### Prérequis

- Node ≥ 22 (`nvm use` lit `.nvmrc`)
- pnpm ≥ 10 (`npm install -g pnpm` ou `corepack enable`)
- Un compte Sanity ([sanity.io](https://www.sanity.io)) — gratuit jusqu'à 3 users / 10K docs

### Installation

```bash
pnpm install
cp .env.example .env.local
cp studio/.env.example studio/.env.local
```

Puis créer le projet Sanity (à faire une fois) :

```bash
pnpm --filter studio exec sanity init
# choisir : "Create new project", nom "Amélie la Vie", dataset "production"
```

Reporter le **Project ID** retourné dans `.env.local` (`PUBLIC_SANITY_PROJECT_ID=...`) et `studio/.env.local` (`SANITY_STUDIO_PROJECT_ID=...`).

### Lancer le site

```bash
pnpm dev              # Astro dev server  -> http://localhost:4321
pnpm studio:dev       # Sanity Studio     -> http://localhost:3333
```

### Scripts utiles

```bash
pnpm build            # Build statique → dist/
pnpm preview          # Serve dist/ localement
pnpm check            # astro check (type-check)
pnpm lint             # ESLint + Prettier
pnpm lint:fix         # auto-fix
pnpm studio:deploy    # déploie Studio sur amelielavie.sanity.studio
```

## Déploiement

### 1. Variables d'env Netlify

À configurer dans [Site settings → Environment](https://app.netlify.com/sites/amelielavie/settings/env) :

- `PUBLIC_SANITY_PROJECT_ID=zw89b09w`
- `PUBLIC_SANITY_DATASET=production`
- `PUBLIC_SANITY_API_VERSION=2025-01-01`
- `PUBLIC_SITE_URL=https://amelielavie.org`
- `PUBLIC_MAILCHIMP_ENDPOINT` (URL du form Mailchimp si on garde la newsletter)
- `NODE_OPTIONS=--use-system-ca` (uniquement si build derrière proxy d'entreprise)

### 2. Déployer le Studio Sanity

```powershell
pnpm studio:deploy
# choisir un sous-domaine (ex: amelielavie) → URL = amelielavie.sanity.studio
```

### 3. Webhook Sanity → rebuild Netlify automatique

Pour que le site rebuild dès qu'un admin clique "Publish" dans Studio :

**a. Côté Netlify** — [Site settings → Build hooks](https://app.netlify.com/sites/amelielavie/settings/deploys#build-hooks)

- "Add build hook" → Name: `Sanity publish` → branche `master` (ou la branche déployée)
- Copier l'URL générée (type `https://api.netlify.com/build_hooks/abc123`)

**b. Côté Sanity** — [sanity.io/manage/project/zw89b09w/api](https://www.sanity.io/manage/project/zw89b09w/api) → Webhooks

- "Create webhook" → Name: `Netlify rebuild` → URL: l'URL du Build Hook
- Dataset: `production` → Trigger on: `Create`, `Update`, `Delete`
- HTTP method: `POST` → Filter: laisser vide (tout)

Résultat : chaque publish déclenche un rebuild Netlify (~30-60s) puis le site est mis à jour automatiquement.

### 4. Formulaire de contact (Netlify Forms)

Le formulaire `<form data-netlify="true" name="contact">` dans [src/components/sections/ContactForm.astro](src/components/sections/ContactForm.astro) est automatiquement détecté par Netlify au build. Les soumissions arrivent dans Netlify → Forms et un email de notification peut être envoyé à l'adresse de l'asso.

À configurer après le 1er déploiement :

- [Site settings → Forms → Form notifications](https://app.netlify.com/sites/amelielavie/settings/forms) → ajouter l'email destinataire
- (Optionnel) reCAPTCHA v2 : "Enable reCAPTCHA" pour renforcer l'antispam (déjà honeypot par défaut)
- Limite free tier : 100 submissions/mois

## Édition par les admins

Une fois en prod :

1. **Le Studio est sur** `https://amelielavie.sanity.studio` (rien à installer côté admin)
2. **Inviter un admin** : [sanity.io/manage/project/zw89b09w/members](https://www.sanity.io/manage/project/zw89b09w/members) → Invite member → rôle "Editor"
3. **L'admin** se connecte (Google/email), édite, clique "Publish" → le site se rebuild seul

Guide bénévole détaillé : [`ONBOARDING.md`](./ONBOARDING.md) — à partager avec les nouveaux éditeurs.

### Visual Editing (preview à côté du formulaire)

Le Studio inclut **Presentation Tool** (panneau de gauche) :

- L'admin ouvre Presentation → voit le site en iframe à droite, le formulaire d'édition à gauche
- Navigue dans le site → les documents correspondants s'ouvrent automatiquement à gauche
- Édite → cliquer "Publish" → l'iframe se rafraîchit

## État de la refonte

- [x] **Phase 0** — Setup workspace, configs, squelette Astro/Sanity
- [x] **Phase 1** — Schemas Sanity complets (26 types)
- [x] **Phase 2** — Migration contenu (43 docs + assets)
- [x] **Phase 3** — Design system Astro
- [x] **Phase 4** — Templates de pages (42 pages générées)
- [x] **Phase 5** — Formulaire contact (Netlify Forms) + Presentation Tool Sanity
- [x] **Phase 6** — SEO enrichi (JSON-LD, RSS, OG/Twitter), sitemap, redirects 301 legacy
- [x] **Phase 7** — Refonte UI complète (Hero citation, sections resserrées, tuiles Soutenez, fix images PNG transparents, restructuration Habitat partagé)
- [ ] **Phase 8** — Cut-over Netlify : DNS, webhook Sanity, suppression `legacy/`
