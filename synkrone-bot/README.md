# Synkrone — infrastructure des bots Discord (Python)

Ce dossier contient **les sources et les templates** déployés sur le VPS pour
faire tourner les bots Discord clients sous PM2. **Le code de ce dossier ne
tourne pas tel quel depuis le repo Node.js** : il est synchronisé sur le VPS
par le script `scripts/setup_shared_env.sh`.

## Layout sur le VPS (cible)

```
/Partage/Synkrone/
  .venv/                     ← venv Python UNIQUE partagé par tous les bots
  commands/                  ← Cogs Discord.py partagés
    moderation/ ban.py
    fun/        poll.py
    utility/    ping.py
  libs/                      ← libs internes custom (vide pour l'instant)
  boxes/                     ← espace de fichiers des devs (NE PAS TOUCHER)
  templates/                 ← (optionnel) snapshots de templates

/var/www/synkrone/           ← le site Node.js (Next.js) — ne pas modifier
  ecosystem.config.js        ← config PM2 multi-bots
  new_bot.sh                 ← script de provisioning d'un nouveau bot

/bots/                       ← un dossier par bot client
  client_example/
    main.py                  ← copie du template, charge les cogs partagés
    bot.config.json          ← liste des cogs activés pour ce bot
    .enc                     ← BOT_TOKEN, PREFIX, etc. (chmod 600)
```

Contraintes (rappelées par le brief) :

- **Un seul venv Python** partagé : `/Partage/Synkrone/.venv/`. Aucun bot ne
  doit créer son propre venv.
- Les Cogs partagés ne contiennent **jamais** de token ni de donnée client :
  tout passe par `os.getenv()` (chargé depuis `.enc` du bot).
- Chaque bot est un **process PM2 indépendant**. Un crash ne tue que ce bot.
- Ne pas toucher à `/Partage/Synkrone/boxes/` (espace dev) ni à la structure
  Node.js de `/var/www/synkrone/`.

## Mise en place initiale (à faire UNE FOIS sur le VPS)

```bash
# 1. Cloner le repo (ou faire un git pull si déjà cloné)
cd /var/www/synkrone
sudo -u $USER git pull

# 2. Provisionner l'arbo Synkrone, créer le venv, installer discord.py,
#    déployer le bot exemple et le ecosystem.config.js / new_bot.sh.
bash synkrone-bot/scripts/setup_shared_env.sh

# 3. Renseigner le token dans le bot exemple
sudo -e /bots/client_example/.enc   # BOT_TOKEN=...

# 4. Démarrer le bot exemple via PM2
pm2 start /var/www/synkrone/ecosystem.config.js
pm2 save
pm2 startup        # à lancer une fois pour activer le démarrage auto
```

## Créer un nouveau bot pour un client

```bash
bash /var/www/synkrone/new_bot.sh client_acme
sudo -e /bots/client_acme/.enc       # BOT_TOKEN=xxx
nano /bots/client_acme/bot.config.json   # active les cogs voulus
pm2 restart synkrone_client_acme
```

`new_bot.sh` :
1. Crée `/bots/<client>/` à partir du template.
2. Génère un `bot.config.json` minimal (`utility.ping`).
3. Crée `.enc` (chmod 600) avec un placeholder de token.
4. Enregistre le process dans PM2 en utilisant `/Partage/Synkrone/.venv/bin/python`.
5. `pm2 save`.

## Mettre à jour les commandes partagées

```bash
cd /var/www/synkrone
sudo -u $USER git pull
bash synkrone-bot/scripts/setup_shared_env.sh   # rsync des cogs + pip install
pm2 restart all                                   # reload tous les bots
```

## Ajouter une nouvelle commande partagée

1. Dans le repo, ajouter `synkrone-bot/commands/<categorie>/<nom>.py` —
   un Cog Discord.py classique avec `async def setup(bot)`.
2. Lire la config via `os.getenv()`, **jamais en dur**.
3. PR + merge → `setup_shared_env.sh` synchronise sur le VPS.
4. Activer la commande sur les bots qui en ont besoin via leur
   `bot.config.json` (ex: `"moderation.ban"`).

## Permissions Discord côté bot

Chaque Cog déclare ses permissions Discord requises avec les décorateurs
discord.py :

```python
@commands.has_permissions(ban_members=True)        # le user qui exécute la cmd
@commands.bot_has_permissions(ban_members=True)    # le bot lui-même
```

→ Le bot **respecte la hiérarchie Discord** : un membre sans la permission
appropriée reçoit "Tu n'as pas la permission". Voir `commands/moderation/ban.py`
pour un exemple complet (anti self-ban, vérification des rôles, log dans le
salon configuré par `MOD_LOG_CHANNEL_ID`).
