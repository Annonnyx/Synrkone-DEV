# Synkrone — Fonctionnalités du site et permissions

Inventaire de toutes les pages, API et règles d'accès du site Node.js
(Next.js 16 + Prisma + NextAuth Discord).

## 1. Système de rôles

### Rôles site

Définis dans <code>prisma/schema.prisma</code> (enum `UserRole`) et utilisés partout :

| Rôle    | Code | Hiérarchie | Description |
|---------|------|------------|-------------|
| Owner   | `OWNER` | 3 | Toi uniquement. Accès total, peut supprimer n'importe quoi. |
| Admin   | `ADMIN` | 2 | Modération site + gestion des boxes des autres. |
| Dev     | `DEV`   | 1 | A sa propre box, peut uploader des fichiers, voit le dashboard bot. |
| User    | `USER`  | 0 | Compte de base — accès profil + dashboard bot uniquement. |

> **Pas de rôle "apprenti" séparé côté site.** Le rôle Discord
> `Apprenti-dev` (id `1474871058166448280`) est mappé sur `DEV` côté site —
> un apprenti a donc les mêmes droits site qu'un dev. Si tu veux un
> niveau d'accès différent, il faut ajouter `APPRENTI` à l'enum Prisma
> (avec une migration) puis l'insérer dans la hiérarchie à la position 1.

### Mapping Discord → site

`src/config/discord-roles.ts` mappe les IDs de rôles Discord du serveur
Synkrone vers un rôle site. Le rôle le plus haut gagne :

```
Owner          → OWNER
ADMIN          → ADMIN
Modérateur+    → ADMIN
Modérateur     → DEV
Dev            → DEV
Apprenti-dev   → DEV
Membre+        → USER
Partenaire     → USER
Membre         → USER
```

À l'OAuth Discord, `signIn` callback (<code>src/lib/auth.ts</code>) appelle
`syncDiscordRoles` qui :
1. Récupère les rôles Discord de l'user via `/users/@me/guilds/{guildId}/member`.
2. Calcule le rôle site via `mapDiscordRolesToSiteRole`.
3. Met à jour `User.role` en base.

`POST /api/discord/sync` permet de re-synchroniser à la demande depuis la page
profil.

### Checks de permissions

| Endroit | Mécanisme |
|---------|-----------|
| Pages publiques → privées | `src/middleware.ts` (matcher) bloque sur la base de `token.role` ≥ rôle requis. |
| Routes API | `hasRole(session.user.role, "DEV"\|"ADMIN"\|"OWNER")` depuis `src/lib/auth-guard.ts`. |
| Helper SSR | `requireAuth()` / `requireRole()` dans `auth-guard.ts` redirige vers `/login` ou `/dashboard`. |

### Permissions Discord (bot)

Côté bot Python (`synkrone-bot/commands/`), les permissions sont contrôlées
par discord.py via les décorateurs :
- `@commands.has_permissions(ban_members=True)` — vérifie l'user.
- `@commands.bot_has_permissions(ban_members=True)` — vérifie le bot.
- `@commands.guild_only()` — interdit en DM.

Le bot respecte donc la hiérarchie de rôles Discord. La commande `ban` refuse
en plus de bannir quelqu'un de rôle ≥ à l'émetteur (anti-escalade).

## 2. Pages du site

| Route | Rôle min | Fichier | Ce que la page fait |
|-------|----------|---------|---------------------|
| `/` | public | `src/app/page.tsx` | Landing publique. |
| `/login` | public | `src/app/login/page.tsx` | OAuth Discord (NextAuth). |
| `/legal/{terms,privacy,notices}` | public | `src/app/legal/*` | Pages légales. |
| `/pricing` | public | `src/app/pricing/page.tsx` | Tarifs. |
| `/team` | public | `src/app/team/page.tsx` | Équipe. |
| `/profile` | `USER` | `src/app/profile/page.tsx` | Profil + sync rôles Discord. |
| `/dashboard` | `USER` | `src/app/dashboard/page.tsx` | Dashboard bot Discord (création, modules, stats, fichiers). |
| `/dashboard/boxes` | `DEV` | `src/app/dashboard/boxes/page.tsx` | Vue unifiée des boxes (sa box pour DEV, toutes pour ADMIN+). |
| `/my-box` | `DEV` | `src/app/my-box/page.tsx` | Vue simplifiée de sa box perso (legacy, alternative de `/dashboard/boxes`). |
| `/boxes` | `ADMIN` | `src/app/boxes/page.tsx` | Vue admin compacte (legacy). |
| `/projects` | `USER` | `src/app/projects/page.tsx` | Liste de projets. |
| `/website-creator` | `USER` | `src/app/website-creator/page.tsx` | Page placeholder. |
| `/discord` | public(?) | `src/app/discord/page.tsx` | Hub Discord. |
| `/discord/bot/[name]` | public | `src/app/discord/bot/[name]/page.tsx` | Page d'un bot. |
| `/minecraft` | public | `src/app/minecraft/page.tsx` | Hub Minecraft. |
| `/minecraft/project/[name]` | public | `src/app/minecraft/project/[name]/page.tsx` | Page d'un projet Minecraft. |

> **Recommandation :** `/my-box` et `/boxes` sont redondants avec
> `/dashboard/boxes` (qui couvre déjà DEV et ADMIN/OWNER avec le même UI).
> À terme, supprime ces deux routes et redirige vers `/dashboard/boxes`.

## 3. API

### Auth

| Endpoint | Méthode | Rôle | Effet |
|----------|---------|------|-------|
| `/api/auth/[...nextauth]` | GET/POST | public | Routes NextAuth (OAuth Discord callback). |
| `/api/auth/session-role` | GET | session | Renvoie le rôle de la session courante. |

### Discord

| Endpoint | Méthode | Rôle | Effet |
|----------|---------|------|-------|
| `/api/discord/roles` | GET | session | Liste des rôles Discord de l'user + rôle site calculé. |
| `/api/discord/sync` | POST | session | Force la resynchro Discord → site. |

### Bot Discord (modèle DB `Bot`)

| Endpoint | Méthode | Rôle | Effet |
|----------|---------|------|-------|
| `/api/bot` | GET | session | Récupère le bot du user (avec modules, stats). |
| `/api/bot` | POST | session | Crée le bot (token, hosting, prefix). Génère un dossier dans `STORAGE_ROOT`. |
| `/api/bot` | PATCH | owner du bot | Met à jour le bot. |
| `/api/bot/control` | POST | owner du bot | Start / stop / restart du bot. |
| `/api/bot/modules` | GET/POST/DELETE | owner du bot | Active/désactive un module. |
| `/api/bot/stats` | GET | owner du bot | Récupère les stats du bot. |
| `/api/modules` | GET | session | Liste des modules disponibles dans le marketplace. |

### Boxes & fichiers

| Endpoint | Méthode | Rôle | Effet |
|----------|---------|------|-------|
| `/api/boxes` | GET | DEV+ | DEV → sa box ; ADMIN+ → toutes les boxes. |
| `/api/boxes` | POST | DEV (soi) ou ADMIN+ (autre user) | Crée une box (1 max par user, schema `userId @unique`). |
| `/api/boxes` | PATCH | ADMIN+ | Modifie le quota d'une box (pas en dessous de l'espace utilisé). |
| `/api/boxes` | DELETE | ADMIN+ | Supprime une box et tous ses fichiers (disque + DB). |
| `/api/files` | GET (`location=PROJECT`) | session | Fichiers projet partagés. |
| `/api/files` | GET (`location=BOX&boxId=...`) | propriétaire ou ADMIN+ | Fichiers d'une box. |
| `/api/files` | GET (`location=VPS_ROOT`) | ADMIN+ | Fichiers racine VPS. |
| `/api/files` | POST | DEV+ | Upload, vérifie le quota côté box. |
| `/api/files` | DELETE | uploader ou OWNER | Suppression disque + DB. |
| `/api/files/[id]/download` | GET | session avec accès | Téléchargement direct. |

### Utilisateurs

| Endpoint | Méthode | Rôle | Effet |
|----------|---------|------|-------|
| `/api/users` | GET | ADMIN+ | Liste les users (filtre `?withoutBox=true` pour ceux sans box). |

## 4. Stockage VPS

Tout passe par `STORAGE_ROOT` (défini dans `src/lib/storage.ts`,
override par `VPS_STORAGE_PATH`). Default : `/Partage/Synkrone`.

```
/Partage/Synkrone/
├── boxes/<userId>/          ← box perso d'un dev
├── projects/                 ← fichiers PROJECT (visibles par session)
├── vps-root/                 ← fichiers VPS_ROOT (ADMIN+)
├── bots/<botId>/             ← workdir bot (modules, configs)
├── .venv/                    ← venv Python partagé (bots Discord)
└── commands/                 ← cogs partagés (bots Discord)
```

## 5. Sécurité — points à surveiller

- `DISCORD_GUILD_ID` doit être renseigné dans `.env` sinon la sync rôles
  retombe sur "USER" pour tout le monde.
- `BOT_TOKEN` n'est jamais exposé côté client : stocké dans `.enc` du bot
  (chmod 600), lu uniquement par le process Python.
- Le décorateur `@commands.bot_has_permissions(...)` empêche le bot de
  tenter une action que Discord refusera (évite les rate-limits).
- Le quota box est vérifié AVANT l'écriture disque dans `/api/files` POST,
  ce qui empêche un dev de remplir le disque du VPS.
