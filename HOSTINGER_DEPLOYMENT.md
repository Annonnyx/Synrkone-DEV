# 🚀 Guide de Déploiement — Synkrone sur VPS Hostinger

> Guide pas-à-pas pour créer la base de données PostgreSQL et héberger Synkrone sur un VPS Hostinger.  
> **⚠️ Chaque étape inclut les pièges courants et leurs solutions.**

---

## Table des matières

1. [Prérequis](#1-prérequis)
2. [Connexion au VPS](#2-connexion-au-vps)
3. [Installation des dépendances](#3-installation-des-dépendances)
4. [Configuration PostgreSQL](#4-configuration-postgresql)
5. [Déploiement de l'application](#5-déploiement-de-lapplication)
6. [Configuration Discord](#6-configuration-discord)
7. [PM2 — Gestion des processus](#7-pm2--gestion-des-processus)
8. [Nginx — Reverse Proxy](#8-nginx--reverse-proxy)
9. [SSL — Certificat HTTPS](#9-ssl--certificat-https)
10. [Checklist finale](#10-checklist-finale)
11. [Dépannage](#11-dépannage)
12. [Maintenance](#12-maintenance)

---

## 1. Prérequis

### Minimum requis pour le VPS Hostinger

| Spec | Minimum | Recommandé |
|------|---------|------------|
| **RAM** | 2 Go | 4 Go |
| **CPU** | 1 vCPU | 2 vCPU |
| **Disque** | 20 Go SSD | 40 Go SSD |
| **OS** | Ubuntu 22.04 | Ubuntu 24.04 |

### Ce qu'il vous faut avant de commencer

- [ ] Un VPS Hostinger actif avec Ubuntu
- [ ] Un nom de domaine pointé vers l'IP du VPS (A record)
- [ ] Le code source Synkrone (repo Git)
- [ ] Un compte Discord Developer avec une application configurée
- [ ] Le token du bot Synkrone (doit être sur le serveur Discord avec `MANAGE_ROLES`)

---

## 2. Connexion au VPS

### Via SSH

```bash
ssh root@VOTRE_IP_VPS
```

> **⚠️ Piège Hostinger #1** : Par défaut, Hostinger vous fournit le mot de passe root dans le panel hPanel.  
> Si la connexion est refusée, vérifiez que le VPS est bien démarré dans hPanel → VPS → Manage.

> **⚠️ Piège Hostinger #2** : Sur certains plans, le port SSH est **22** mais peut être **2222**.  
> Si le port 22 ne répond pas :
> ```bash
> ssh -p 2222 root@VOTRE_IP_VPS
> ```

### Créer un utilisateur dédié (recommandé)

```bash
# Créer l'utilisateur
adduser synkrone
usermod -aG sudo synkrone

# Se connecter en tant que synkrone
su - synkrone
```

---

## 3. Installation des dépendances

### Mise à jour du système

```bash
sudo apt update && sudo apt upgrade -y
```

### Node.js 20 (via NVM — plus fiable sur Hostinger)

> **⚠️ Piège** : `curl -fsSL https://deb.nodesource.com/setup_20.x` peut échouer sur certains VPS Hostinger.  
> **Utilisez NVM à la place** :

```bash
# Installer NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Recharger le terminal
source ~/.bashrc

# Installer Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Vérifier
node -v  # → v20.x.x
npm -v   # → 10.x.x
```

### PostgreSQL 16

```bash
# Ajouter le repo officiel PostgreSQL
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
sudo apt update

# Installer PostgreSQL
sudo apt install -y postgresql-16 postgresql-contrib-16

# Vérifier qu'il tourne
sudo systemctl status postgresql
```

> **⚠️ Piège** : Si `postgresql` ne démarre pas, vérifiez que le port 5432 n'est pas déjà utilisé :
> ```bash
> sudo netstat -tlnp | grep 5432
> ```

### Nginx + outils

```bash
sudo apt install -y nginx git curl wget unzip

# PM2
npm install -g pm2
```

---

## 4. Configuration PostgreSQL

### Étape 1 — Créer la base et l'utilisateur

```bash
sudo -u postgres psql
```

```sql
-- Créer l'utilisateur (CHANGER LE MOT DE PASSE !)
CREATE USER synkrone WITH ENCRYPTED PASSWORD 'VOTRE_MOT_DE_PASSE_FORT';

-- Créer la base
CREATE DATABASE synkrone OWNER synkrone;

-- Donner tous les droits
GRANT ALL PRIVILEGES ON DATABASE synkrone TO synkrone;

-- Quitter
\q
```

> **⚠️ Piège** : Le mot de passe doit être **fort** (min 16 chars, lettres + chiffres + symboles).  
> Générer un mot de passe : `openssl rand -base64 24`

### Étape 2 — Configurer l'accès

```bash
# Trouver la version de PostgreSQL installée
ls /etc/postgresql/
# → Devrait afficher "16" ou "15"

# Éditer pg_hba.conf
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

**Modifier cette ligne** (chercher `local all all`) :

```diff
- local   all             all                                     peer
+ local   all             all                                     md5
```

> **⚠️ Piège critique** : Si vous laissez `peer`, Prisma ne pourra PAS se connecter à la base.  
> Le mode `md5` permet la connexion par mot de passe.

### Étape 3 — Sécuriser PostgreSQL

```bash
sudo nano /etc/postgresql/16/main/postgresql.conf
```

Vérifier que PostgreSQL n'écoute que sur localhost :

```
listen_addresses = 'localhost'
```

### Étape 4 — Redémarrer PostgreSQL

```bash
sudo systemctl restart postgresql

# Tester la connexion
psql -U synkrone -d synkrone -h localhost
# Entrer le mot de passe → doit afficher "synkrone=>"
# Tapez \q pour quitter
```

> **⚠️ Piège** : Si `psql: FATAL: password authentication failed`, re-vérifiez pg_hba.conf et redémarrez PostgreSQL.

---

## 5. Déploiement de l'application

### Étape 1 — Cloner le projet

```bash
sudo mkdir -p /var/www/synkrone
sudo chown -R $USER:$USER /var/www/synkrone
cd /var/www/synkrone

git clone https://github.com/Annonnyx/Synrkone-DEV.git .
```

### Étape 2 — Installer les dépendances

```bash
npm install
```

> **⚠️ Piège mémoire** : Sur un VPS 2 Go, `npm install` peut planter avec `ENOMEM`.  
> **Solution** — Créer un fichier swap :
> ```bash
> sudo fallocate -l 2G /swapfile
> sudo chmod 600 /swapfile
> sudo mkswap /swapfile
> sudo swapon /swapfile
> echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
> ```

### Étape 3 — Configurer le .env

```bash
nano .env
```

Contenu (remplir les valeurs) :

```env
# Base de données
DATABASE_URL="postgresql://synkrone:VOTRE_MOT_DE_PASSE@localhost:5432/synkrone?schema=public"

# NextAuth
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="GÉNÉRER_AVEC_openssl_rand_-base64_32"

# Discord OAuth
DISCORD_CLIENT_ID="votre_client_id"
DISCORD_CLIENT_SECRET="votre_client_secret"

# Discord Bot (sync rôles)
DISCORD_BOT_TOKEN="votre_bot_token"
DISCORD_GUILD_ID="id_serveur_synkrone"

# Stockage
VPS_STORAGE_PATH="/var/lib/synkrone/storage"
```

> **⚠️ Piège critique** : `NEXTAUTH_URL` DOIT être l'URL publique exacte (avec https://).  
> Si cette valeur est incorrecte, le login Discord échouera avec une erreur de callback.

> **⚠️ Piège** : Pas d'espace avant/après le `=` dans le .env !  
> ❌ `NEXTAUTH_SECRET = "abc"` → ✅ `NEXTAUTH_SECRET="abc"`

### Étape 4 — Créer les dossiers de stockage

```bash
sudo mkdir -p /var/lib/synkrone/storage/{boxes,projects,vps-root}
sudo chown -R $USER:$USER /var/lib/synkrone
chmod -R 755 /var/lib/synkrone
```

### Étape 5 — Initialiser la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma db push
```

> **⚠️ Piège Prisma** : Si `npx prisma db push` échoue avec `Can't reach database server`, vérifiez :
> 1. PostgreSQL tourne : `sudo systemctl status postgresql`
> 2. Le mot de passe dans DATABASE_URL est correct
> 3. pg_hba.conf est en mode `md5` (pas `peer`)
> 4. PostgreSQL a été redémarré après les changements

> **⚠️ Piège Prisma SSL** : Si l'erreur mentionne SSL, ajouter `?sslmode=disable` à la fin de DATABASE_URL :
> ```
> DATABASE_URL="postgresql://synkrone:pass@localhost:5432/synkrone?schema=public&sslmode=disable"
> ```

### Étape 6 — Build le projet

```bash
npm run build
```

> **⚠️ Piège mémoire** : Le build Next.js consomme beaucoup de RAM. Sur 2 Go :
> ```bash
> # Limiter la mémoire Node
> NODE_OPTIONS="--max-old-space-size=1536" npm run build
> ```

---

## 6. Configuration Discord

### 6.1 — OAuth (connexion utilisateur)

1. Aller sur https://discord.com/developers/applications
2. Sélectionner (ou créer) votre application
3. **OAuth2 → General** :
   - Ajouter Redirect URI : `https://votre-domaine.com/api/auth/callback/discord`
   - Copier **Client ID** et **Client Secret** → `.env`

### 6.2 — Bot (sync des rôles)

1. Dans la même application Discord Developer
2. **Bot → Reset Token** → Copier le token → `.env` (`DISCORD_BOT_TOKEN`)
3. **Bot → Privileged Gateway Intents** :
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT
4. **OAuth2 → URL Generator** :
   - Scopes : `bot`
   - Permissions : `Manage Roles` (minimum)
   - Copier l'URL et inviter le bot sur votre serveur Synkrone

### 6.3 — ID du serveur

1. Discord → Paramètres utilisateur → Avancé → Activer le **Mode développeur**
2. Clic droit sur le serveur Synkrone → **Copier l'identifiant**
3. Coller dans `.env` (`DISCORD_GUILD_ID`)

> **⚠️ Piège** : Le bot doit avoir un rôle PLUS HAUT que les rôles qu'il doit gérer.  
> Dans les paramètres du serveur → Rôles, glissez le rôle du bot AU-DESSUS des rôles gérés.

---

## 7. PM2 — Gestion des processus

### Créer le fichier de configuration

```bash
cat > /var/www/synkrone/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'synkrone',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/synkrone',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/synkrone/err.log',
    out_file: '/var/log/synkrone/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
EOF
```

### Créer les dossiers de logs et démarrer

```bash
sudo mkdir -p /var/log/synkrone
sudo chown -R $USER:$USER /var/log/synkrone

# Démarrer
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd
```

> **⚠️ Piège NVM + PM2** : Si PM2 ne trouve pas Node après un reboot :
> ```bash
> # Dans le fichier startup, spécifier le chemin NVM
> pm2 startup systemd --hp /home/synkrone
> ```

---

## 8. Nginx — Reverse Proxy

### Configuration

```bash
sudo nano /etc/nginx/sites-available/synkrone
```

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    # Taille max pour les uploads (boxes)
    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts pour les gros uploads
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
    }

    # Cache pour les assets statiques Next.js
    location /_next/static {
        alias /var/www/synkrone/.next/static;
        expires 1y;
        access_log off;
        add_header Cache-Control "public, immutable";
    }
}
```

### Activer

```bash
sudo ln -s /etc/nginx/sites-available/synkrone /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

> **⚠️ Piège Hostinger Firewall** : Même avec UFW correctement configuré, Hostinger a son **propre firewall** dans le panel hPanel !  
> **Solution** : hPanel → VPS → Firewall → Ajouter les règles pour les ports **80**, **443**, et **22**.

---

## 9. SSL — Certificat HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

> Choisir **"Redirect HTTP to HTTPS"** quand demandé.

### Tester le renouvellement

```bash
sudo certbot renew --dry-run
```

> **⚠️ Piège DNS** : Le certificat SSL échouera si le DNS ne pointe pas encore vers le VPS.  
> Vérifiez avec : `dig votre-domaine.com +short` → doit afficher l'IP du VPS.

---

## 10. Checklist finale

Exécuter ces commandes une par une pour vérifier que tout est opérationnel :

```bash
# ✅ PostgreSQL tourne
sudo systemctl status postgresql | grep "active (running)"

# ✅ La DB est accessible
psql -U synkrone -d synkrone -h localhost -c "SELECT 1;" 2>/dev/null && echo "DB OK"

# ✅ Les tables existent
psql -U synkrone -d synkrone -h localhost -c "\dt" 2>/dev/null | grep users && echo "Tables OK"

# ✅ Node.js installé
node -v

# ✅ L'application est buildée
ls /var/www/synkrone/.next/BUILD_ID && echo "Build OK"

# ✅ PM2 tourne
pm2 status | grep synkrone

# ✅ Le port 3000 écoute
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 && echo " → Site OK"

# ✅ Nginx répond
curl -s -o /dev/null -w "%{http_code}" http://votre-domaine.com && echo " → Nginx OK"

# ✅ SSL actif
curl -s -o /dev/null -w "%{http_code}" https://votre-domaine.com && echo " → HTTPS OK"

# ✅ Stockage accessible
ls -la /var/lib/synkrone/storage/ && echo "Storage OK"
```

---

## 11. Dépannage

### ❌ "Cannot connect to database"

```bash
# 1. PostgreSQL tourne ?
sudo systemctl status postgresql

# 2. Le mot de passe est correct ?
psql -U synkrone -d synkrone -h localhost

# 3. pg_hba.conf en mode md5 ?
sudo grep "local.*all.*all" /etc/postgresql/16/main/pg_hba.conf

# 4. Redémarrer après changement
sudo systemctl restart postgresql
```

### ❌ "502 Bad Gateway"

```bash
# 1. L'app Next.js tourne ?
pm2 status
pm2 logs synkrone --lines 50

# 2. Le port 3000 est utilisé ?
sudo netstat -tlnp | grep 3000

# 3. Nginx config OK ?
sudo nginx -t
```

### ❌ "Discord OAuth callback error"

```bash
# 1. Vérifier NEXTAUTH_URL dans .env
grep NEXTAUTH_URL /var/www/synkrone/.env

# 2. Doit être EXACTEMENT l'URL publique (avec https)
# 3. Vérifier la Redirect URI dans Discord Developer Portal
# 4. Doit être : https://votre-domaine.com/api/auth/callback/discord
```

### ❌ "Permission denied" sur les fichiers

```bash
sudo chown -R $USER:$USER /var/lib/synkrone
sudo chmod -R 755 /var/lib/synkrone
```

### ❌ Build plante (out of memory)

```bash
# Vérifier la mémoire
free -h

# Ajouter du swap si nécessaire
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### ❌ Prisma migration échoue

```bash
# Reset complet (ATTENTION : supprime toutes les données !)
npx prisma db push --force-reset

# Ou migration incrémentale
npx prisma migrate deploy
```

---

## 12. Maintenance

### Mise à jour du code

```bash
cd /var/www/synkrone

# 1. Récupérer les changements
git pull origin main

# 2. Installer les nouvelles dépendances
npm install

# 3. Mettre à jour la DB si le schéma a changé
npx prisma generate
npx prisma db push

# 4. Rebuild
npm run build

# 5. Redémarrer
pm2 restart synkrone
```

### Backup quotidien (cron)

```bash
sudo nano /etc/cron.daily/synkrone-backup
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/synkrone"
mkdir -p $BACKUP_DIR

# Backup DB
pg_dump -U synkrone synkrone > "$BACKUP_DIR/db_$(date +%F).sql"

# Backup fichiers
tar czf "$BACKUP_DIR/storage_$(date +%F).tar.gz" /var/lib/synkrone/storage

# Nettoyer les vieux backups (+7 jours)
find $BACKUP_DIR -type f -mtime +7 -delete
```

```bash
sudo chmod +x /etc/cron.daily/synkrone-backup
```

### Sécurité

```bash
# Firewall
sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

# Fail2Ban (anti brute-force)
sudo apt install -y fail2ban
sudo systemctl enable fail2ban

# Mises à jour automatiques
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

### Commandes utiles

| Commande | Description |
|----------|-------------|
| `pm2 logs synkrone` | Logs en temps réel |
| `pm2 status` | Statut des processus |
| `pm2 restart synkrone` | Redémarrer l'app |
| `pm2 monit` | Monitoring CPU/RAM |
| `sudo -u postgres psql synkrone` | Accès direct à la DB |
| `sudo nginx -t` | Tester config Nginx |
| `sudo certbot renew` | Renouveler le SSL |
| `du -sh /var/lib/synkrone/storage/*` | Espace disque utilisé |

---

> ✅ **Votre VPS Synkrone est maintenant opérationnel !**
