# Guide bénévole — Éditer le site Amélie la Vie

Ce guide explique comment **modifier le contenu du site** sans toucher au code. Il s'adresse aux bénévoles qui rejoignent l'équipe de gestion.

> Temps de prise en main : **15–20 minutes**.
> Si tu bloques, contacte Victor (`contact@amelielavie.com`).

---

## 1. Accéder au Studio

Le site est piloté depuis **Sanity Studio**, un éditeur en ligne qui ressemble à Notion.

1. Ouvre [`https://amelielavie.sanity.studio`](https://amelielavie.sanity.studio)
2. Connecte-toi avec l'adresse email que Victor a invitée (Google ou GitHub)
3. Tu arrives sur le panneau d'édition

Tu peux aussi cliquer sur **« Admin »** en bas à droite du site, ça mène au même endroit.

---

## 2. La structure du site

Sur la gauche du Studio, plusieurs sections :

| Section | À quoi ça sert |
|---------|----------------|
| **Page d'accueil** | Éditer la home (sections, hero, blocs) |
| **Pages** | Éditer L'association, Habitat partagé, Contact, Nous soutenir, Mentions légales |
| **Actualités** | Publier / modifier les articles de blog |
| **Événements** | Gérer l'agenda (rando, marchés, AG...) |
| **Tags** | Catégoriser les actualités (#randonnée, #habitat…) |
| **Partenaires** | Logos des soutiens financiers |
| **Réglages** | Site settings, navigation, infos contact, libellés UI |

> Tout ce qui est éditable est éditable ici. **Pas besoin de demander à Victor** pour ajouter une actu ou un événement.

---

## 3. Publier une actualité

1. **Actualités** → bouton **+ Create**
2. Remplis :
   - **Titre** (max 120 caractères, court et clair)
   - **Slug** : se génère automatiquement (laisse tel quel sauf besoin spécifique)
   - **Date de publication** : par défaut aujourd'hui
   - **Description** : 1–2 phrases qui s'affichent sur la liste + en aperçu réseaux sociaux
   - **Image principale** : 16/9 conseillé, 1200×675 minimum, **avec un texte alternatif** (description courte pour les lecteurs d'écran)
   - **Tags** : optionnel, choisir parmi les tags existants ou en créer un
   - **Contenu** : la grosse zone de texte
3. Coche **« Publié »** (case en haut)
4. Clique **Publish** (bouton en bas)
5. Le site se met à jour automatiquement en **30–60 secondes** (un robot reconstruit la page)

### Astuces de rédaction

- **Titres** : utilise les styles **H2** / **H3** pour structurer (pas H1, il est déjà pris)
- **Liens** : sélectionne du texte, clique sur l'icône lien, colle l'URL. Pour les liens externes (autre site), coche **Externe** — ça ouvre dans un nouvel onglet et ajoute une petite flèche ↗
- **Images dans le corps** : glisse-dépose, **toujours remplir le texte alternatif**
- **Listes** : icônes liste à puces / numérotée dans la barre d'outils

---

## 4. Ajouter un événement à l'agenda

1. **Événements** → **+ Create**
2. Champs :
   - **Titre** (ex. *Randonnée pédestre 2027*)
   - **Date de début** : date + heure
   - **Date de fin** : optionnel
   - **Adresse** : ex. *Place de la Poype, Montanay*
   - **Résumé** : 1–2 lignes (s'affiche sur la liste)
   - **Image** : optionnel
   - **Contenu** : description complète
3. Coche **« Afficher »** + Publish

Le site catégorise automatiquement :
- **À venir** (date future) → affiché dans le bloc Agenda sur la home et en haut de `/agenda/`
- **Passé** (date passée) → descendu dans la section *Événements passés*

---

## 5. Éditer la page d'accueil

La home est composée de **sections** que tu peux **réordonner par glisser-déposer**.

1. **Page d'accueil** dans le menu Studio
2. Tu vois la liste : Hero, Notre histoire, Habitat partagé, Actualités, Agenda, Partenaires, Soutenez, Newsletter
3. Clique sur une section pour l'ouvrir
4. **Hero (citation)** : modifie le bandeau d'alerte (ex. *Rendez-vous le 29 mars…*) ou la citation principale
5. **Notre histoire** : texte court + bouton orange
6. **Habitat partagé** : titre + sous-titre + items + phrase de bas + bouton
7. **Partenaires** : la liste vient de la section *Partenaires* (cf. plus bas)
8. **Soutenez** : 2 tuiles, modifie le label et le lien
9. Publish quand tu as fini

> ⚠️ **N'efface pas une section** sans avoir sauvegardé d'abord. Si tu te plantes, un clic sur **History** (icône horloge en haut) permet de revenir à une version antérieure.

---

## 6. Gérer les partenaires

Les logos en bas de la home viennent de **Partenaires** dans le menu.

1. **Partenaires** → **+ Create** pour ajouter
2. Champs :
   - **Nom** (ex. *AG2R La Mondiale*)
   - **Logo** : format PNG **transparent**, idéalement 400×160 pixels
   - **URL** : site du partenaire (optionnel)
   - **Ordre** : nombre pour trier (10, 20, 30… laisse de la marge pour insérer)
3. Publish

Pour retirer un partenaire : ouvre-le, clique **Unpublish** (et garde-le en draft) ou **Delete** définitivement.

---

## 7. Modifier le menu / footer / infos contact

Tout est dans **Réglages** :

- **Site settings** : nom, description courte, logo principal
- **Navigation** : ordre des liens dans le header / footer, comptes Facebook & YouTube, mention légale du footer
- **Coordonnées & intégrations** :
  - Email / téléphone / adresse postale
  - **Endpoint Mailchimp** : à renseigner pour activer le formulaire newsletter (à demander à l'admin Mailchimp de l'asso)
- **Libellés UI** : textes des boutons, labels du formulaire de contact, messages vides…

---

## 8. Adhésion HelloAsso — mise à jour annuelle

L'URL d'adhésion HelloAsso change chaque année (ex. `…-pour-2026` → `…-pour-2027`).

1. **Pages** → **Nous soutenir**
2. Section **Intégration HelloAsso** *Adhérer en ligne*
3. Modifie l'**URL à intégrer** avec la nouvelle URL HelloAsso de l'année
4. Publish

Le don pérenne (`/formulaires/1`) ne change pas.

---

## 9. Visualiser avant de publier

- Le bouton **« Open preview »** (en haut à droite) ouvre le site **avec tes modifications brouillon** en parallèle.
- Tu peux modifier dans le Studio et voir le résultat live sur le site avant de publier.
- Tant que tu n'as pas cliqué **Publish**, tes changements ne sont visibles que par toi.

---

## 10. Quoi faire en cas de souci

| Problème | Solution |
|----------|----------|
| Je ne vois pas mes changements sur le site | Attends 1–2 min (le site se reconstruit). Si toujours rien, vérifie que tu as bien cliqué **Publish** (pas juste Save). |
| Je me suis trompé, je veux annuler | Icône **History** en haut de l'éditeur → choisis une version précédente → **Restore** |
| Le site est cassé | Contacte Victor immédiatement avec l'URL et l'erreur affichée |
| Je ne peux pas me connecter | Vérifie que Victor t'a bien invité avec ton adresse Google/GitHub |

---

## 11. Bonnes pratiques

- ✅ **Image de qualité** : 1200px de large minimum pour les actus, PNG transparent pour les logos
- ✅ **Texte alternatif** : toujours décrire une image en 1 phrase (accessibilité + SEO)
- ✅ **Titres courts** : <70 caractères pour qu'ils tiennent sur une ligne
- ✅ **Date des événements** : vérifie deux fois la date/heure
- ❌ **Ne pas coller du texte stylé depuis Word/Google Docs** : ça met du bordel dans le HTML. Plutôt coller en texte brut (Ctrl+Shift+V) et remettre les styles dans le Studio.
- ❌ **Pas d'émojis dans les titres** sauf si vraiment intentionnel — ils ne s'affichent pas pareil partout.

---

Bonne édition !
