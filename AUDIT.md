# Synkrone — Audit complet du dashboard, box system & infra bot

Date : 10 mai 2026
Statut : **BUILD OK** — `npm run build` passe, 0 erreur TypeScript, 0 warning middleware.

## Système de boxes — ÉTAT

### Ce qui fonctionne

- **Backend** : `GET/POST/PATCH/DELETE /api/boxes` — permissions, quotas, suppression disque + DB.
- **Frontend** : `/dashboard/boxes` compile et affiche les boxes, upload/download/fichiers.
- **Stockage** : `STORAGE_ROOT` unifié (`/Partage/Synkrone`) via `src/lib/storage.ts`.
- **Permissions** : `userId @unique` garantit 1 box par utilisateur.
- **Sync Discord** : `signIn` callback resync + endpoint `POST /api/discord/sync` + **auto-resync toutes les heures** dans le JWT (cf. Fix 6).

### Ce qui est géré manuellement

Les admin/owner peuvent via le dashboard :
- Créer une box pour n'importe quel user sans box (`?withoutBox=true`)
- Modifier le quota (`PATCH maxSizeMb`)
- Supprimer une box (OWNER uniquement)

### Ce qu'il reste à faire (non bloquant)

- Le bouton "Partager la box" dans la modale est un placeholder (pas de `POST /api/boxes/share`).
- Le bouton "Révoquer l'accès" est un placeholder (pas de `DELETE /api/boxes/share`).
- Les BoxShare dans Prisma ne sont pas exposés dans une API.
- Pas de scan auto du disque si un fichier est ajouté en dehors du site (serveur FTP, SSH).

## Dashboard bot — ÉTAT

### Ce qui fonctionne

- **Création** : `POST /api/bot` → crée en DB + provisionne le dossier `/bots/synkrone_<id>/` + lance PM2.
- **Contrôle** : start/stop/restart via `POST /api/bot/control` avec cooldown 30s.
- **Modules** : toggle avec vérification Krônes, réécriture auto de `bot.config.json` + restart PM2.
- **Dynamicité** : changement de préfix **fonctionne maintenant** (cf. Fix 1 & 2).

### Fixes appliqués

| # | Fix | Fichier(s) |
|---|-----|-----------|
| 1 | PATCH `/api/bot` propage le changement de préfix au fichier `bot.config.json` + redémarre PM2 | `src/app/api/bot/route.ts` |
| 2 | Suppression de `PREFIX=!` dans le `.enc` pour éviter le conflit avec `bot.config.json["prefix"]` | `src/lib/bot-deploy.ts`, `synkrone-bot/bots/client_example/.enc` |
| 3 | Le bot Python privilégie `config["prefix"]` sur `os.getenv("PREFIX")` | `synkrone-bot/bots/client_example/main.py` |
| 4 | Renommage `middleware.ts` → `proxy.ts` (Next.js 16) + suppression des logs debug | `src/proxy.ts` |
| 5 | Auto-resync Discord toutes les heures depuis le JWT (pas besoin de re-login) | `src/lib/auth.ts` |
| 6 | Système de manifests pour les commandes Python (auto-discovery) | `src/lib/command-manifests.ts`, `synkrone-bot/commands/*/*.manifest.json` |

## Protocole de commandes

### Livré

- `synkrone-bot/COMMAND_PROTOCOL.md` : procédure complète pour ajouter une commande.
- `synkrone-bot/commands/_template/` : copier-coller prêt pour démarrer une nouvelle commande.
- Manifests créés pour les 3 commandes existantes : `ping`, `poll`, `ban`.
- Route `GET /api/commands` qui scanne les manifests dynamiquement.

### Comment ajouter une commande — résumé rapide

1. Copier `commands/_template/` → `commands/<module>/<nom>.py` + `.manifest.json`
2. Adapter le Cog, les permissions, et le manifest (prix Kr, env vars)
3. Si nouveau module : l'ajouter au seed (`src/app/api/modules/route.ts`)
4. PR + merge → `setup_shared_env.sh` → `pm2 restart all`

## Suggestions & améliorations futures

### Activation commande par commande — ✅ Implémenté

- **Schema** : `BotCommand` (id, commandId, enabled, priceKr, botId) — migration SQL dans `prisma/migrations/20250510153000_add_bot_commands/migration.sql`.
- **Provision** : `POST /api/bot` crée automatiquement une ligne `BotCommand` pour chaque commande manifest (toutes désactivées).
- **Toggle module** : `PATCH /api/bot/modules` active/désactive aussi toutes les commandes du module en cascade.
- **Toggle individuel** : `PATCH /api/bot/commands` active/désactive une commande avec vérification Krônes. Le prix vient du manifest.
- **Config bot** : `bot-deploy.ts` `buildCommandList` filtre par `BotCommand.enabled` si fourni, sinon fallback legacy sur modules.
- **Dashboard** : sous chaque module activé, les commandes s'affichent avec leur propre toggle et leur prix Kr.

### Suggestion prioritaire

1. **BoxShare API** : Exposer `POST /api/boxes/share`, `DELETE /api/boxes/share`, et vérifier les permissions dans `/api/files` en mode BOX (actuellement les partages DB ne sont pas utilisés).
2. **Statistiques bot réelles** : actuellement les stats (`BotStats`) sont remplies avec des zéros au provisionnement. Il faudrait un agent Python côté VPS qui push régulièrement les métriques réelles (RAM, CPU, latence Discord) vers `POST /api/bot/stats`.

### Priorité moyenne

4. **Rate-limit API** : pas de `RateLimiter` sur les routes `POST /api/bot` (re-création rapide de bot).
5. **Tests unitaires** : zéro tests actuellement. Minimum recommandé : tests pour les routes `/api/boxes`, `/api/files`, et `/api/bot`.
6. **Variables d'env par bot** : le `.enc` du bot est généré avec des placeholders vides. Idéalement le dashboard expose un formulaire pour renseigner `GUILD_ID`, `MOD_LOG_CHANNEL_ID`, etc.

### Priorité basse / nice to have

7. **Commandes slash (/commandes Discord)** : le champ `useSlashCommands` existe en DB mais n'est jamais lu par le bot Python. discord.py 2.x supporte `tree.sync()` pour les slash commands.
8. **Notification Discord webhook** : quand un bot client démarre ou crash, notifier le serveur Discord via un webhook.

## Notes techniques

- `npm run build` : ✅
- `npm run lint` : ✅ 0 erreur (39 warnings : imports Lucide inutilisés, images `<img>` non-optimisées)
- Le middleware n'est plus déprécié (renommé en `proxy.ts`).
- Le `.env` manque probablement `BOTS_ROOT_PATH`, `SYNKRONE_SHARED_ROOT`, etc. — ce n'est pas critique car les defaults (`/bots`, `/Partage/Synkrone`) sont prévus pour le VPS.
