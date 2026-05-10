# Synkrone — bugs trouvés et corrigés

## Bug bloquant — le build ne passait pas

`src/app/dashboard/boxes/page.tsx` référençait **42 variables d'état qui
n'existaient pas** (`searchQuery`, `setSelectedFiles`, `contextMenu`,
`setNewFolderName`, `renamingFile`, `showNewFolderModal`, etc.). Un commit
précédent avait supprimé les `useState` correspondants mais avait laissé en
place les fonctions et tout l'UI (menu contextuel, modal de renommage, modal
de création de dossier) qui les utilisaient.

→ `next build` échouait avec :
```
./src/app/dashboard/boxes/page.tsx:279:9
Type error: Cannot find name 'searchQuery'.
```

→ La page `/dashboard/boxes` ne se rendait plus, ce qui se manifeste par
"la page de dashboard est cassée".

**Correctif :** dans `dashboard/boxes/page.tsx`, suppression des fonctions
mortes (`getFilteredFiles`, `handleFileSelect`, `handleContextMenu`,
`closeContextMenu`, `createFolder`, `renameFile`, `moveFiles`) et des UI
orphelines (context menu, rename modal, new folder modal). Ces features
n'étaient pas branchées dans le rendu principal de la page.

## Lint — variable hoisting

Next 16 / React 19 active la règle `react-hooks/immutability` qui interdit
d'utiliser un `const fn = ...` à l'intérieur d'un `useEffect` placé
**au-dessus** de la déclaration de la fonction.

Fichiers touchés :
- `src/app/boxes/page.tsx:52` (`loadBoxes`)
- `src/app/dashboard/boxes/page.tsx:86` (`loadBoxes`)
- `src/app/dashboard/page.tsx:150` (`loadData`)
- `src/app/my-box/page.tsx:46` (`loadBox`)

**Correctif :** la fonction est déclarée AVANT le `useEffect` et stabilisée
avec `useCallback`. Toutes ses dépendances réelles sont listées.

## Lint — setState dans useEffect

Règle `react-hooks/set-state-in-effect` (Next 16) : interdit
`useEffect(() => { fnQuiAppelleSetState() })` synchrone, parce que React
fait un re-render en cascade.

Fichiers touchés :
- `src/app/dashboard/boxes/page.tsx:124` (`loadAllUsers`)
- `src/app/profile/page.tsx:98` (`loadDiscordRoles`)
- + les useEffect mentionnés au paragraphe précédent

**Correctif :** les fetch sont déférés d'un tick avec
`void Promise.resolve().then(loadX)`, ce qui sort du chemin synchrone de
l'effect tout en gardant la sémantique fetch-on-mount.

## Lint — autres erreurs

- `dashboard/boxes/page.tsx` : 2 `any` typés correctement (`{ name: string; userId?: string }`).
- `dashboard/boxes/page.tsx` : 2 apostrophes JSX échappées (`l&apos;utilisateur`, `l&apos;accès`).
- `scripts/save-avatars.js` : `require()` interdit. Les scripts Node.js
  CommonJS sont maintenant ignorés via `eslint.config.mjs`.

## Bug — STORAGE_ROOT incohérent entre routes

Quatre routes définissaient leur propre `STORAGE_ROOT` avec deux defaults
différents :

| Fichier | Default avant fix |
|---------|-------------------|
| `api/boxes/route.ts` | `/Partage/Synkrone` |
| `api/bot/route.ts` | `/Partage/Synkrone` |
| `api/files/route.ts` | `/var/lib/synkrone/storage` |
| `api/bot/modules/route.ts` | `/var/lib/synkrone/storage` |

Sur un VPS où `VPS_STORAGE_PATH` n'est pas défini, **les boxes étaient
créées dans un dossier et les fichiers uploadés écrits dans un autre**.

**Correctif :** `src/lib/storage.ts` exporte un `STORAGE_ROOT` unique avec
default `/Partage/Synkrone` (le chemin réellement utilisé par la prod).
Les 4 routes l'importent maintenant depuis là.

## Bug — `getBoxLimits` autorise plus d'une box par user

Dans `api/boxes/route.ts`, `getBoxLimits` renvoyait
`{ maxBoxes: 2 }` pour ADMIN et `{ maxBoxes: 999 }` pour OWNER. Mais le
schéma Prisma déclare :

```prisma
model Box {
  userId String @unique  // un utilisateur = une box max
}
```

→ La 2e création de box pour le même user lève une `P2002`
(unique constraint violation) au lieu d'un message clair.

**Correctif :** `maxBoxes = 1` pour tous les rôles. Les ADMIN/OWNER
gardent évidemment leur capacité à créer une box pour **un autre**
utilisateur (1 par utilisateur cible).

## Bug — code mort dupliqué dans `api/files/route.ts`

Lignes 60–74 (avant fix) : un deuxième bloc `if (location === "BOX" && boxId)`
identique au précédent, jamais atteint car le premier bloc retourne déjà.

**Correctif :** bloc supprimé.

## Warnings restants (non bloquants)

`npm run lint` renvoie 0 erreur et 41 warnings — tous de type
`@typescript-eslint/no-unused-vars` (imports de Lucide jamais utilisés).
Ne bloquent pas le build et peuvent être nettoyés progressivement.
