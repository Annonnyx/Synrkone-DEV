# Synkrone — Protocole pour ajouter une commande de bot

Ce document définit la procédure exacte pour ajouter une nouvelle commande
au pool partagé Synkrone. Chaque commande livrée ici est immédiatement :

1. Disponible pour tous les bots client après `pm2 restart`.
2. Listée dans le dashboard via `GET /api/commands`.
3. Achetable / activable au coût `priceKr` indiqué dans son manifest.
4. Documentée pour les autres devs qui maintiennent l'infra.

## TL;DR — checklist pour livrer une commande

1. Créer `synkrone-bot/commands/<module>/<command>.py` (Cog discord.py).
2. Créer `synkrone-bot/commands/<module>/<command>.manifest.json` (métadonnées).
3. Ajouter le module dans `src/app/api/modules/route.ts` (le seed) si nouveau module.
4. Mettre à jour `src/lib/module-cogs.ts` (`MODULE_TO_COGS`) si nouveau module.
5. PR + merge → `setup_shared_env.sh` synchronise sur le VPS → `pm2 restart all`.

## 1. Structure d'une commande

Une commande = **2 fichiers** dans `synkrone-bot/commands/<module>/` :

```
synkrone-bot/commands/
├── moderation/
│   ├── __init__.py             ← peut rester vide
│   ├── ban.py                  ← le Cog discord.py
│   └── ban.manifest.json       ← métadonnées site
└── utility/
    ├── ping.py
    └── ping.manifest.json
```

Le nom du fichier `.py` détermine l'**ID** de la commande :
`<module>.<command>` (ex: `moderation.ban`). Cette même chaîne est :

- L'`id` dans le manifest.
- Ce qu'on met dans `bot.config.json["commands"]` côté bot.
- Ce qui est passé à `bot.load_extension()` côté Python.

## 2. Le fichier `.py` (Cog discord.py)

### Template minimum

```python
"""<Description courte>. Aucune donnée client n'est codée en dur ici."""

from __future__ import annotations

import os

import discord
from discord.ext import commands


class MaCommande(commands.Cog):
    """<Description un peu plus longue>. Permission Discord: <perm>."""

    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot
        # Variables d'env du bot client : lues UNE FOIS au load.
        # Les values viennent de `<bot_dir>/.enc`.
        self.some_id = os.getenv("SOME_CHANNEL_ID")

    @commands.command(name="macommande")
    @commands.guild_only()
    @commands.has_permissions(manage_messages=True)        # exigence côté user
    @commands.bot_has_permissions(manage_messages=True)    # exigence côté bot
    async def macommande(self, ctx: commands.Context, *, arg: str) -> None:
        """Usage: !macommande <arg>"""
        await ctx.reply(f"Reçu : {arg}")

    @macommande.error
    async def macommande_error(
        self, ctx: commands.Context, error: commands.CommandError
    ) -> None:
        if isinstance(error, commands.MissingPermissions):
            await ctx.reply("Tu n'as pas la permission requise.")
        elif isinstance(error, commands.BotMissingPermissions):
            await ctx.reply("Le bot n'a pas la permission requise.")
        else:
            raise error


async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(MaCommande(bot))
```

### Règles strictes

- **JAMAIS de token, ID Discord client, URL webhook ou secret en dur.**
  Tout ce qui dépend du client passe par `os.getenv()` et est documenté
  dans le manifest (`envVars`).
- **TOUJOURS un `error_handler` du Cog** sinon une exception remonte au
  bot et arrête le process via PM2 → restart en boucle.
- **TOUJOURS `bot_has_permissions(...)` en plus de `has_permissions(...)`**
  sinon on tombe sur des `Forbidden` au runtime.
- **TOUJOURS `setup` async** (discord.py 2.x). `setup` synchrone ne marche pas.
- **PAS d'import lourd au top-level** si la commande est rarement utilisée
  (tu peux importer dans la méthode pour un cold-start plus rapide).

## 3. Le fichier `.manifest.json`

### Schéma

```json
{
  "id": "moderation.ban",                  // <module>.<command_filename>
  "name": "Ban",                           // libellé humain
  "description": "Bannit un membre.",      // affiché dans le dashboard
  "category": "MODERATION",                // ENUM : MANAGEMENT, MODERATION,
                                           //         UTILITY, FUN, ECONOMY,
                                           //         MUSIC, AI, WEB, CUSTOM
  "module": "moderation",                  // doit matcher le dossier parent
  "priceKr": 2,                            // coût Krônes (additionné au module)
  "premium": false,                        // true = bloque les plans gratuits
  "usage": "{prefix}ban @membre [raison]", // {prefix} sera substitué dans l'UI
  "permissions": {
    "user": ["ban_members"],               // permissions Discord exigées chez l'user
    "bot": ["ban_members"]                 // permissions Discord exigées chez le bot
  },
  "envVars": [
    {
      "name": "MOD_LOG_CHANNEL_ID",
      "description": "ID du salon de logs (facultatif)",
      "required": false
    }
  ],
  "version": "1.0.0"                       // semver, pour invalider les caches
}
```

### Champ `priceKr`

C'est le coût **par commande** (et non par module). Le module hérite du
total de ses commandes via `priceKrForModule()`. Un module avec 3
commandes à 1 Kr coûte 3 Kr global. Cela permet à un client d'activer un
module mais d'en désactiver une commande coûteuse — fonctionnalité prévue
mais pas encore exposée dans l'UI (cf. roadmap).

### Champ `permissions`

Liste des permissions Discord (https://discord.com/developers/docs/topics/permissions).
Affichées dans le dashboard pour que l'admin sache ce qu'il faut donner
au bot et à ses modos avant d'activer la commande. Utiliser le snake_case
discord.py exact (`ban_members`, `manage_messages`, `add_reactions`, etc.).

### Champ `envVars`

Variables d'environnement que la commande lit dans `os.getenv()`. Elles
doivent être renseignées dans le `.enc` du bot (ou dans
`bot.config.json["env"]` quand on aura branché ce mécanisme). Un manifest
qui déclare `"required": true` sans valeur disponible doit faire échouer
l'activation côté dashboard.

## 4. Côté API site

### Lister les commandes disponibles

`GET /api/commands` → renvoie tous les manifests scannés depuis
`synkrone-bot/commands/`. Filtrable par module avec
`GET /api/commands?module=moderation`.

### Activer une commande pour un bot

L'activation se fait toujours **au niveau du module** via
`PATCH /api/bot/modules`. Le pipeline :

1. Vérifie le quota Kr du bot.
2. Met à jour `ModuleInstance.enabled` en DB.
3. Régénère `bot.config.json["commands"]` à partir des modules activés
   (via `cogsForModule(moduleId)` dans `src/lib/bot-deploy.ts`).
4. `pm2 restart synkrone_<botId>`.

> **Roadmap** : exposer un endpoint `PATCH /api/bot/commands` pour
> activer/désactiver une commande individuelle (utile quand un module
> est cher mais qu'une seule commande intéresse le client). Pour
> l'instant l'unité d'achat = un module entier.

## 5. Tests recommandés avant merge

Localement :
```bash
# Lint + build TypeScript (vérifie que le manifest est valide JSON et
# que le mapping module→cogs est cohérent).
npm run lint
npm run build

# Sur le VPS, ou en docker miroir
bash synkrone-bot/scripts/setup_shared_env.sh   # rsync les nouveaux .py
pm2 restart synkrone_<bot_test>                  # recharge le bot test
pm2 logs synkrone_<bot_test>                     # vérifie qu'il démarre
```

Sur Discord (bot de test) :

- Lance la commande avec et sans la permission requise.
- Vérifie que l'`error_handler` répond proprement.
- Vérifie qu'aucun message contenant un token/secret n'est jamais envoyé.

## 6. Versioning

Quand tu modifies une commande qui est **déjà en prod** :

- **Bug fix** → bump `1.0.0` → `1.0.1`.
- **Nouveau paramètre rétrocompatible** → bump à `1.1.0`.
- **Renommage / breaking** → bump à `2.0.0` ET communiquer aux clients
  (le préfix de la commande change, ils doivent mettre à jour leur
  documentation interne).

Le champ `version` permet aussi d'invalider le cache `command-manifests.ts`
côté site.

## 7. Catégories autorisées (`category`)

Doivent matcher l'enum `ModuleCategory` dans `prisma/schema.prisma` :

```
MANAGEMENT  MODERATION  UTILITY  FUN  ECONOMY  MUSIC  AI  WEB  CUSTOM
```

Ajouter une nouvelle catégorie nécessite une migration Prisma.

## 8. FAQ

### Ma commande n'apparaît pas dans le dashboard

1. Le manifest existe-t-il ? `ls synkrone-bot/commands/<module>/*.manifest.json`
2. Le `module` dans le manifest correspond-il au dossier parent ?
3. Le cache TS est-il invalidé ? Redémarre `next dev` ou attends 60 s.

### Ma commande s'active mais ne répond pas

1. `pm2 logs synkrone_<botId>` — souvent une erreur de chargement Cog.
2. Vérifie que `bot.config.json["commands"]` contient bien l'`id` de
   ta commande.
3. Vérifie que le bot a bien la permission Discord (cf. `permissions.bot`).

### Comment factoriser du code entre commandes

`synkrone-bot/libs/` est synchronisé sur `/Partage/Synkrone/libs/` et
ajouté au `sys.path` par le bot template. Tu peux donc créer
`libs/db.py` et faire `from libs.db import ...` depuis n'importe quel
Cog.
