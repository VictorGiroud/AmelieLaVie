# `legacy/` — ancien site Gatsby

Ce dossier contient le code de l'ancien site **Gatsby 4 + Netlify CMS** conservé temporairement pendant la refonte.

## Pourquoi c'est ici

1. **Référence visuelle** : pendant la migration on compare le rendu Astro avec l'ancien pour ne rien casser.
2. **Source de contenu** : les 22 actualités, 4 événements et 8 pages markdown vivent dans `legacy/src/pages/**/*.md` et seront importés dans Sanity par les scripts en Phase 2 :
   - `scripts/migrate-md-to-sanity.mjs` lit `legacy/src/pages/`
   - `scripts/import-partenaires.mjs` lit `legacy/src/img/` pour les 16 logos partenaires (URLs extraites de `legacy/src/templates/index-page.js` lignes 155-205)
3. **Images** : tous les médias historiques sont dans `legacy/static/img/` et `legacy/src/img/`.

## ⚠️ Ce dossier sera supprimé en Phase 7

Une fois le cut-over fait (toutes les pages migrées, validation admin OK), ce dossier sera supprimé en un commit dédié. Voir le plan : `C:\Users\conta\.claude\plans\j-ai-ce-projet-que-jolly-pixel.md`.

## Ne pas développer ici

Aucune modification ne doit être faite dans `legacy/`. Le `.gitignore` racine ignore les artefacts de build (`legacy/public/`, `legacy/.cache/`). ESLint et TypeScript excluent ce dossier.
