# MODULE_INTEGRATION.md — Guide d'intégration des modules Synkrone

> Ce document explique comment ajouter un nouveau module, une commande ou une intégration à la plateforme Synkrone. Il est destiné aux développeurs et aux IA qui devront étendre les fonctionnalités du projet.

---

## Table des matières

1. [Architecture globale](#architecture-globale)
2. [Système économique Krônes](#système-économique-krônes)
3. [Structure des fichiers](#structure-des-fichiers)
4. [Ajouter un module Discord](#ajouter-un-module-discord)
5. [Ajouter une commande](#ajouter-une-commande)
6. [Ajouter un preset web](#ajouter-un-preset-web)
7. [Ajouter une micro-transaction](#ajouter-une-micro-transaction)
8. [Marquer un élément comme Premium](#marquer-un-élélement-comme-premium)
9. [Conventions et règles](#conventions-et-règles)
10. [Exemple complet : module Économie](#exemple-complet--module-économie)

---

## Architecture globale

```
Synkrone/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── page.tsx            # Landing page
│   │   ├── dashboard/          # Dashboard (création bot + modules)
│   │   ├── profile/            # Profil utilisateur
│   │   ├── projects/           # Projets Synkrone
│   │   ├── pricing/            # Page tarifs
│   │   ├── website-creator/    # Créateur de sites web
│   │   └── legal/              # Pages légales
│   ├── components/             # Composants réutilisables
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── lib/                    # Logique métier (à créer)
│       ├── modules/            # Définitions des modules
│       │   ├── registry.ts     # Registre central des modules
│       │   └── types.ts       # Types partagés
│       ├── commands/           # Définitions des commandes
│       └── presets/            # Presets du créateur web
├── MODULE_INTEGRATION.md       # ← Vous êtes ici
└── ...
```

> **Note** : Le code du bot Discord lui-même n'est pas dans ce dépôt. Ce dépôt est le **front-end web** de Synkrone. Les modules définis ici sont des **entrées de registre** qui décrivent les modules disponibles, leur statut Premium, leur icône, etc. Le code d'exécution du bot (handlers Discord.js, etc.) vit dans un dépôt séparé.

---

## Structure des fichiers

### Module registry (`src/lib/modules/registry.ts`)

Chaque module est un objet avec cette structure :

```typescript
export interface ModuleDefinition {
  id: string;               // Identifiant unique (kebab-case)
  name: string;             // Nom affiché (ex: "Économie")
  description: string;      // Description courte
  icon: string;             // Nom de l'icône Lucide (ex: "Coins")
  premium: boolean;         // true si le module est Premium
  enabled: boolean;         // Activé par défaut ?
  category: ModuleCategory; // Catégorie du module
  pointCost: number;        // Coût en pts de module (1=simple, 2-3=complet)
  commands?: CommandDefinition[]; // Commandes incluses dans ce module
}

export type ModuleCategory =
  | "moderation"    // Modération, anti-spam, auto-mod
  | "utility"       // Utilitaires, embeds, annonces
  | "fun"           // Fun, mini-jeux, interactions
  | "economy"       // Économie, boutique, transactions
  | "music"         // Musique
  | "ai"            // Génération IA, chatbot
  | "management"    // Gestion serveur, rôles, tickets
  | "web"           // Intégrations web, sites
  | "custom";       // Modules personnalisés
```

### Command definition (`src/lib/commands/types.ts`)

```typescript
export interface CommandDefinition {
  id: string;               // Identifiant unique
  name: string;             // Nom de la commande (ex: "balance")
  description: string;      // Description
  usage: string;            // Usage (ex: "/balance [@user]")
  premium: boolean;         // true si Premium
  module: string;           // ID du module parent
}
```

### Preset definition (`src/lib/presets/types.ts`)

```typescript
export interface PresetDefinition {
  id: string;               // Identifiant unique (kebab-case)
  name: string;             // Nom affiché
  description: string;      // Description
  preview: string;          // Description de l'aperçu
  premium: boolean;         // true si Premium
  template: string;         // HTML du preset (ou chemin vers le fichier)
}
```

---

## Ajouter un module Discord

### Étapes

1. **Déclarer le module** dans `src/lib/modules/registry.ts` :
   ```typescript
   // Ajouter dans le tableau modules :
   {
     id: "economy",
     name: "Économie",
     description: "Système de monnaie, boutique, transactions entre membres.",
     icon: "Coins",
     premium: true,
     enabled: false,
     category: "economy",
     pointCost: 3,  // 1=simple, 2=complet, 3=avancé
   }
   ```

2. **Mettre à jour le Dashboard** (`src/app/dashboard/page.tsx`) :
   - Importer l'icône Lucide correspondante
   - Ajouter le module dans le tableau `defaultModules` avec `pointCost`

3. **Mettre à jour la page Tarifs** (`src/app/pricing/page.tsx`) :
   - Ajouter le module dans le tableau `pointExamples` si nécessaire
   - Vérifier que les offres Krônes couvrent le coût

4. **(Backend)** Ajouter le handler du module dans le dépôt du bot Discord : événements, commandes slash, base de données, etc.

### Checklist

- [ ] Module déclaré dans `registry.ts` avec `pointCost`
- [ ] Icône Lucide importée dans le Dashboard
- [ ] Module ajouté au tableau `defaultModules` du Dashboard avec `pointCost`
- [ ] Statut Premium défini correctement
- [ ] Catégorie correcte assignée
- [ ] PointCost cohérent (1=simple, 2=complet, 3=avancé)
- [ ] Commandes du module déclarées (si applicable)
- [ ] Page Tarifs mise à jour (si impact)
- [ ] Handler backend implémenté (dépôt séparé)

---

## Ajouter une commande

### Étapes

1. **Déclarer la commande** dans `src/lib/commands/` :
   ```typescript
   {
     id: "economy-balance",
     name: "balance",
     description: "Affiche le solde d'un utilisateur",
     usage: "/balance [@user]",
     premium: false,
     module: "economy",
   }
   ```

2. **(Backend)** Implémenter la commande dans le dépôt du bot Discord.

3. Si la commande est Premium, la marquer avec `premium: true`. Le front-end affichera automatiquement un badge PRO.

---

## Ajouter un preset web

### Étapes

1. **Déclarer le preset** dans `src/lib/presets/` :
   ```typescript
   {
     id: "blog",
     name: "Blog",
     description: "Blog personnel avec articles, catégories et commentaires.",
     preview: "Blog avec page d'accueil, articles et sidebar.",
     premium: true,
     template: "<!DOCTYPE html>...",
   }
   ```

2. **Mettre à jour le Créateur Web** (`src/app/website-creator/page.tsx`) :
   - Ajouter le preset dans le tableau `presets`

3. **(Backend)** Créer le template HTML/CSS du preset.

---

## Ajouter une micro-transaction

Les micro-transactions sont des achats à l'unité sans engagement.

### Étapes

1. **Ajouter la micro-transaction** dans `src/app/pricing/page.tsx` :
   ```typescript
   // Ajouter dans le tableau microTransactions :
   {
     name: "Pack de points +50",
     description: "Ajoutez 50 pts de modules à votre offre.",
     price: "6,99 €",
     icon: Plus,  // Icône Lucide
   }
   ```

2. **(Backend)** Créer le handler de paiement et l'attribution de l'élément.

---

## Marquer un élément comme Premium

Tout élément (module, commande, preset) avec `premium: true` sera automatiquement :

- Affiché avec un badge **PRO** jaune/or
- Verrouillé pour les utilisateurs n'ayant pas assez de points de modules
- Disponible via les offres Krônes ou les micro-transactions

Les couleurs Premium sont définies dans `globals.css` :
- `--premium: #f59e0b` (jaune/or)
- `--premium-glow: rgba(245, 158, 11, 0.25)` (halo)

---

## Conventions et règles

### Nommage

- **IDs** : kebab-case (ex: `auto-role`, `economy-shop`)
- **Noms affichés** : Français, avec majuscule initiale (ex: "Auto-Rôles", "Économie")
- **Descriptions** : Français, concises (max 80 caractères)
- **Icônes** : Noms exacts des icônes [Lucide React](https://lucide.dev/icons/)

### Structure des données

- Chaque module a un `id` unique
- Les commandes référencent leur module parent via `module: string`
- Les presets sont indépendants des modules Discord

### Front-end vs Backend

| Couche | Responsabilité | Dépôt |
|--------|---------------|-------|
| Front-end web | Affichage, registre des modules, UI | Ce dépôt |
| Backend bot | Exécution Discord.js, handlers, DB | Dépôt séparé |
| API | Communication entre front et bot | À définir |

Le front-end est **déclaratif** : il décrit quels modules existent et comment les afficher. Le backend est **impératif** : il exécute la logique Discord.

### Ne pas modifier

- Les types de base (`ModuleDefinition`, `CommandDefinition`, etc.) sans mise à jour partout
- Les variables CSS dans `globals.css` sans cohérence visuelle
- Les liens externes (Discord, partenaires) sans vérification

---

## Exemple complet : module Économie

Voici un exemple pas-à-pas pour ajouter un module d'économie.

### 1. Déclaration dans le registre

```typescript
// src/lib/modules/registry.ts
{
  id: "economy",
  name: "Économie",
  description: "Système de monnaie, boutique, transactions entre membres.",
  icon: "Coins",
  premium: true,
  enabled: false,
  category: "economy",
  pointCost: 3,  // Module avancé = 3 pts
  commands: [
    {
      id: "economy-balance",
      name: "balance",
      description: "Affiche votre solde ou celui d'un autre utilisateur",
      usage: "/balance [@user]",
      premium: false,
      module: "economy",
    },
    {
      id: "economy-work",
      name: "work",
      description: "Travaillez pour gagner de la monnaie",
      usage: "/work",
      premium: false,
      module: "economy",
    },
    {
      id: "economy-shop",
      name: "shop",
      description: "Ouvrez la boutique du serveur",
      usage: "/shop [page]",
      premium: true,
      module: "economy",
    },
    {
      id: "economy-gift",
      name: "gift",
      description: "Envoyez de la monnaie à un autre membre",
      usage: "/gift @user <montant>",
      premium: false,
      module: "economy",
    },
  ],
}
```

### 2. Mise à jour du Dashboard

```tsx
// src/app/dashboard/page.tsx
// 1. Ajouter l'import de l'icône :
import { /* ... */, Coins } from "lucide-react";

// 2. Ajouter dans defaultModules :
{
  id: "economy",
  name: "Économie",
  description: "Système de monnaie, boutique, transactions entre membres.",
  icon: Coins,
  premium: true,
  enabled: false,
  pointCost: 3,
}
```

### 3. Mise à jour des tarifs

Ajouter le module dans le tableau `pointExamples` de `src/app/pricing/page.tsx` :
```typescript
{ feature: "Économie (avancé)", cost: 3 },
```

### 4. Backend (dépôt séparé)

Dans le dépôt du bot Discord :
- Créer le handler d'événements
- Implémenter les commandes slash (balance, work, shop, gift)
- Configurer la base de données (schéma économie)
- Ajouter les boutons/embeds Discord

---

## Système économique Krônes

Synkrone utilise un système de monnaie virtuelle appelée **Krône (Kr)**.

### Offres Krônes

| Krônes | Points de modules | Prix | Notes |
|--------|-------------------|------|-------|
| 30 Kr  | 10 pts            | 2,99 € | Très limité |
| 60 Kr  | 25 pts            | 4,99 € | Min. 2 € d'achat |
| 110 Kr | 50 pts            | 8,99 € | — |
| 150 Kr | 75 pts            | 11,99 € | — |
| 200 Kr | 100 pts           | 15,99 € | Accès complet |

**Taux de change** : 1 Krône ≈ 0,08 €

### Points de modules

Les points de modules sont la ressource que l'utilisateur répartit entre ses modules :
- **1 pt** = feature simple (Auto-Rôles, Tickets, Messages de bienvenue)
- **2 pts** = feature complète (Musique, Modération, Giveaways)
- **3 pts** = feature avancée (Génération IA, Économie)

L'utilisateur peut répartir ses points librement. Désactiver un module libère ses points.

### Micro-transactions

En plus des offres Krônes, l'utilisateur peut acheter à l'unité :
- Instance supplémentaire (bot)
- Profil personnalisé
- Commande Premium spécifique
- Packs de points (+10, +25)
- Support prioritaire

---

## Liens utiles

- **Support Discord** : https://discord.gg/nuFNvVybGE
- **GitHub** : https://github.com/Annonnyx/Synrkone-DEV
- **Icônes Lucide** : https://lucide.dev/icons/
- **Next.js App Router** : https://nextjs.org/docs/app
- **Tailwind CSS v4** : https://tailwindcss.com/docs
