# Guide de déploiement — Synkrone VPS

> Ce guide explique comment héberger Synkrone sur ton VPS et lier une base de données PostgreSQL également sur le VPS.

---

## Table des matières

1. [Prérequis](#prérequis)
2. [Installation sur le VPS](#installation-sur-le-vps)
3. [Configuration PostgreSQL](#configuration-postgresql)
4. [Configuration Discord OAuth](#configuration-discord-oauth)
5. [Build et démarrage](#build-et-démarrage)
6. [Configuration Nginx + SSL](#configuration-nginx--ssl)
7. [Gestion des fichiers sur le VPS](#gestion-des-fichiers-sur-le-vps)
8. [Mise à jour du site](#mise-à-jour-du-site)

---

## Prérequis

- **Serveur** : Ubuntu 22.04+ ou Debian 12+
- **RAM** : 2 Go minimum (4 Go recommandé)
- **Espace disque** : 20 Go minimum
- **Nginx** (reverse proxy)
- **Certbot** (SSL)
- **Node.js 20+**
- **PostgreSQL 15+**
- **PM2** (gestionnaire de processus)

---

## Installation sur le VPS

### 1. Connecte-toi en SSH

```bash
ssh user@ton-vps-ip
```

### 2. Installe les dépendances système

```bash
# Mise à jour
sudo apt update && sudo apt upgrade -y

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Outils utiles
sudo apt install -y nginx git curl

# PM2 pour la gestion des processus
sudo npm install -g pm2
```

### 3. Crée le dossier du projet

```bash
sudo mkdir -p /var/www/synkrone
sudo chown $USER:$USER /var/www/synkrone
cd /var/www/synkrone
```

### 4. Clone ou copie le projet

```bash
# Via Git (si repo public/privé)
git clone https://github.com/ton-compte/synkrone.git .

# Ou via SCP depuis ton local
# (sur ton local) : scp -r ./Synkrone user@vps-ip:/var/www/synkrone
```

### 5. Installe les dépendances Node

```bash
cd /var/www/synkrone
npm install
```

---

## Configuration PostgreSQL

### 1. Crée l'utilisateur et la base de données

```bash
# Connecte-toi à PostgreSQL
sudo -u postgres psql
```

```sql
-- Crée l'utilisateur
CREATE USER synkrone WITH PASSWORD 'ton-mot-de-passe-fort';

-- Crée la base de données
CREATE DATABASE synkrone OWNER synkrone;

-- Donne les permissions
GRANT ALL PRIVILEGES ON DATABASE synkrone TO synkrone;

-- Quitte
\q
```

### 2. Configure la connexion

```bash
# Edite le fichier de configuration PostgreSQL
sudo nano /etc/postgresql/15/main/pg_hba.conf
```

Assure-toi que cette ligne existe (mode `md5` ou `peer`):

```
local   all             all                                     md5
```

Redémarre PostgreSQL :

```bash
sudo systemctl restart postgresql
```

### 3. Crée le fichier `.env` sur le VPS

```bash
cd /var/www/synkrone
nano .env
```

Contenu :

```env
# Base de données (PostgreSQL local)
DATABASE_URL="postgresql://synkrone:ton-mot-de-passe-fort@localhost:5432/synkrone?schema=public"

# NextAuth
NEXTAUTH_URL="https://ton-domaine.com"
NEXTAUTH_SECRET="une-longue-chaine-aleatoire-de-32-caracteres-min"

# Discord OAuth (à configurer sur le portal Discord)
DISCORD_CLIENT_ID="ton-client-id"
DISCORD_CLIENT_SECRET="ton-client-secret"

# Stockage fichiers VPS
VPS_STORAGE_PATH="/var/lib/synkrone/storage"
```

### 4. Initialise la base de données avec Prisma

```bash
cd /var/www/synkrone
npx prisma generate
npx prisma db push
# Ou pour une migration propre : npx prisma migrate dev --name init
```

### 5. Crée le dossier de stockage

```bash
sudo mkdir -p /var/lib/synkrone/storage
sudo chown -R $USER:$USER /var/lib/synkrone
chmod -R 755 /var/lib/synkrone
```

---

## Configuration Discord OAuth

1. Va sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Crée une application ou utilise une existante
3. Dans **OAuth2 → General**, ajoute ces Redirect URIs :
   - `https://ton-domaine.com/api/auth/callback/discord`
   - `http://localhost:3000/api/auth/callback/discord` (pour test local)
4. Copie le **Client ID** et **Client Secret** dans ton `.env`

---

## Build et démarrage

### 1. Build le projet Next.js

```bash
cd /var/www/synkrone
npm run build
```

### 2. Démarre avec PM2

Crée le fichier de configuration PM2 :

```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'synkrone',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/synkrone',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: '/var/log/synkrone/combined.log',
    out_file: '/var/log/synkrone/out.log',
    error_file: '/var/log/synkrone/error.log',
    time: true
  }]
};
EOF
```

Crée le dossier de logs :

```bash
sudo mkdir -p /var/log/synkrone
sudo chown -R $USER:$USER /var/log/synkrone
```

Démarre l'application :

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd
```

---

## Configuration Nginx + SSL

### 1. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/synkrone
```

Contenu :

```nginx
server {
    listen 80;
    server_name ton-domaine.com www.ton-domaine.com;

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
    }
}
```

Active la configuration :

```bash
sudo ln -s /etc/nginx/sites-available/synkrone /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Supprime la config par défaut si présente
sudo nginx -t
sudo systemctl restart nginx
```

### 2. Installe SSL avec Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ton-domaine.com -d www.ton-domaine.com
```

Choisis "Redirect HTTP to HTTPS" quand demandé.

### 3. Test le renouvellement automatique

```bash
sudo certbot renew --dry-run
```

---

## Gestion des fichiers sur le VPS

Les fichiers sont stockés dans `/var/lib/synkrone/storage` avec cette structure :

```
/var/lib/synkrone/storage/
├── projects/           # Fichiers du projet (visible par tous)
├── boxes/
│   ├── user-id-1/    # Box du user 1
│   └── user-id-2/    # Box du user 2
└── vps-root/         # Fichiers racine (admin/owner uniquement)
```

### Permissions recommandées

```bash
# Propriétaire : utilisateur qui fait tourner l'app Node
sudo chown -R synkrone:synkrone /var/lib/synkrone

# Permissions : owner=rwx, group=rx, others=none
sudo chmod -R 750 /var/lib/synkrone

# Assure-toi que PostgreSQL peut backup ce dossier si besoin
sudo usermod -aG synkrone postgres
```

---

## Mise à jour du site

Quand tu veux mettre à jour le code :

```bash
# 1. Pull les changements
cd /var/www/synkrone
git pull origin main

# 2. Installe les nouvelles dépendances
npm install

# 3. Applique les migrations DB si nécessaire
npx prisma migrate deploy

# 4. Regénère Prisma Client
npx prisma generate

# 5. Rebuild
npm run build

# 6. Redémarre
pm2 restart synkrone
```

---

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `pm2 logs synkrone` | Voir les logs en temps réel |
| `pm2 status` | Voir le statut des processus |
| `pm2 restart synkrone` | Redémarrer l'app |
| `pm2 stop synkrone` | Arrêter l'app |
| `sudo systemctl status postgresql` | Statut PostgreSQL |
| `sudo -u postgres psql synkrone` | Connexion directe à la DB |
| `sudo nginx -t` | Tester la config Nginx |

---

## Troubleshooting

### Erreur "Cannot connect to database"

Vérifie que PostgreSQL tourne :
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Erreur "Permission denied" sur les fichiers

```bash
sudo chown -R $USER:$USER /var/lib/synkrone/storage
chmod -R 755 /var/lib/synkrone/storage
```

### Le site ne charge pas (502 Bad Gateway)

Vérifie que Next.js tourne :
```bash
pm2 status
pm2 logs synkrone
```

Vérifie que le port 3000 est utilisé :
```bash
netstat -tlnp | grep 3000
```

### Problèmes SSL

```bash
sudo certbot renew
sudo systemctl restart nginx
```

---

## Sécurité

1. **Firewall** : Autorise seulement 22 (SSH), 80 (HTTP), 443 (HTTPS)
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **Fail2Ban** : Protection contre les attaques brute-force
   ```bash
   sudo apt install -y fail2ban
   sudo systemctl enable fail2ban
   ```

3. **Mises à jour automatiques** :
   ```bash
   sudo apt install -y unattended-upgrades
   sudo dpkg-reconfigure unattended-upgrades
   ```

4. **Backup** : Script de backup quotidien
   ```bash
   # Crée /etc/cron.daily/synkrone-backup
   #!/bin/bash
   pg_dump synkrone > /backup/synkrone-$(date +%F).sql
   tar czf /backup/synkrone-storage-$(date +%F).tar.gz /var/lib/synkrone/storage
   ```

---

Tu es maintenant prêt à héberger Synkrone sur ton VPS !
