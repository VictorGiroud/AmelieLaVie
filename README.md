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
| Polices         | `@fontsource-variable/lora`                | Self-hosted (plus de Google Fonts bloquant)      |
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

Netlify build à partir de `dist/`. Les variables d'environnement doivent être configurées dans [Site settings → Environment](https://app.netlify.com/sites/amelielavie/settings/env) :

- `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SANITY_API_VERSION`
- `PUBLIC_SITE_URL=https://amelielavie.org`
- `PUBLIC_RECAPTCHA_KEY`, `PUBLIC_MAILCHIMP_ENDPOINT`
- `SANITY_API_READ_TOKEN` (rôle Viewer, pour les previews)

Le rebuild est déclenché par un webhook Sanity (à configurer dans Studio → API → Webhooks) qui pointe vers un Netlify Build Hook.

## État de la refonte

- [x] **Phase 0** — Setup workspace, configs, squelette Astro/Sanity ← _en cours_
- [ ] **Phase 1** — Schemas Sanity complets
- [ ] **Phase 2** — Migration contenu (`legacy/src/pages/**/*.md` → Sanity)
- [ ] **Phase 3** — Design system Astro
- [ ] **Phase 4** — Templates de pages
- [ ] **Phase 5** — Visual Editing + intégrations (Mailchimp / reCAPTCHA / HelloAsso)
- [ ] **Phase 6** — A11y / Perf / SEO (Lighthouse > 95, axe zero violation)
- [ ] **Phase 7** — Cut-over (suppression `legacy/`, bascule `master`)
