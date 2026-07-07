# Estimation IA — Avis de valeur immobilier

Outil interne pour l'équipe commerciale : saisie complète d'un bien (caractéristiques + photos), croisement automatique de **trois sources de marché**, et génération d'un avis de valeur ultra complet par IA.

## Les trois sources croisées

1. **DVF (Demandes de Valeurs Foncières)** — les prix de vente **réels** actés, récupérés automatiquement depuis l'API publique à partir du code postal. C'est la référence factuelle.
2. **Concurrence active** — recherchée **automatiquement sur le web par l'IA** (annonces comparables, prix au m² du secteur), avec complément manuel facultatif par le commercial.
3. **Invendus +90 jours** — repérés automatiquement par l'IA (annonces anciennes, re-publiées, prix baissés) : ils révèlent le **plafond de prix que le marché refuse**. L'estimation reste systématiquement sous ce niveau.

L'IA (Claude, avec vision + recherche web) analyse aussi les **photos** du bien : état réel, luminosité, prestations, écarts avec l'état déclaré.

## Le rapport généré

- Prix recommandé + fourchette basse/haute + prix au m²
- Indice de confiance (selon la quantité/cohérence des données)
- Analyses détaillées : DVF, concurrence, invendus, photos
- Points forts / points faibles
- Stratégie de commercialisation et délai de vente estimé
- **Argumentaire vendeur prêt à l'emploi** (pour recadrer un prix souhaité trop haut)
- Export PDF via impression navigateur

## Démarrage local

```bash
npm install
cp .env.example .env.local   # puis renseigner ANTHROPIC_API_KEY
npm run dev
```

Ouvrir http://localhost:3000.

## Variables d'environnement

| Variable | Obligatoire | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Recommandée | Clé API Anthropic (console.anthropic.com). Sans elle, l'app bascule sur un moteur statistique (médiane DVF + concurrence + plafond invendus), sans analyse des photos. |
| `DVF_API_URL` | Non | Rempl. l'endpoint DVF par défaut (`https://api.cquest.org/dvf`). |

## Déploiement sur Vercel

1. Sur [vercel.com](https://vercel.com), **Add New → Project** et importer le dépôt GitHub `enzodanna13-arch/ESTIMATION`.
2. Framework détecté automatiquement : Next.js — ne rien changer.
3. Dans **Environment Variables**, ajouter `ANTHROPIC_API_KEY`.
4. **Deploy**. Chaque `git push` sur `main` redéploiera automatiquement.

> Note : l'analyse IA peut durer plus d'une minute (photos + marché). La route API déclare `maxDuration = 300` ; sur le plan Vercel Hobby, la limite des fonctions est plus basse (~60 s avec Fluid Compute) — si des timeouts surviennent, passer au plan Pro ou réduire le nombre de photos.

## Architecture

```
app/page.tsx              Formulaire de saisie (5 étapes) + affichage du rapport
app/api/estimate/route.ts Route API : DVF → moteur IA (fallback statistique)
lib/ai.ts                 Appel Claude (vision + sortie structurée JSON)
lib/dvf.ts                Client API DVF (tolérant aux pannes)
lib/fallback.ts           Moteur statistique de secours
lib/compressImage.ts      Compression des photos côté navigateur
components/               Rapport + éditeur de biens comparables
```
