# Guide de Déploiement VPS - Synkrone

Guide complet pour déployer l'application Synkrone sur un VPS avec PostgreSQL, PM2 et Nginx.

---

## 1. Prérequis sur le VPS

### Connexion au serveur
```bash
ssh root@votre-ip-vps
```

### Mise à jour du système
```bash
apt update && apt upgrade -y
```

### Installation des dépendances de base
```bash
# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PostgreSQL
apt install -y postgresql postgresql-contrib

# Nginx
apt install -y nginx

# PM2 (gestionnaire de processus)
npm install -g pm2

# Git
apt install -y git

# Outils utiles
apt install -y curl wget unzip
```

---

## 2. Configuration PostgreSQL

### Créer la base de données
```bash
# Se connecter en postgres
sudo -u postgres psql

# Dans psql, exécuter:
CREATE DATABASE synkrone;
CREATE USER synkrone WITH ENCRYPTED PASSWORD 'votre_mot_de_passe_fort';
GRANT ALL PRIVILEGES ON DATABASE synkrone TO synkrone;
\q
```

### Configurer l'accès PostgreSQL
```bash
# Modifier pg_hba.conf
nano /etc/postgresql/16/main/pg_hba.conf

# Remplacer la ligne:
# host    all             all             127.0.0.1/32            scram-sha-256
# Par:
host    all             all             127.0.0.1/32            md5

# Redémarrer PostgreSQL
systemctl restart postgresql
```

---

## 3. Configuration du stockage fichiers

### Créer les dossiers de stockage
```bash
# Créer la structure de dossiers
mkdir -p /var/lib/synkrone/storage/{boxes,projects,vps-root}

# Définir les permissions
chown -R www-data:www-data /var/lib/synkrone
chmod -R 755 /var/lib/synkrone
```

---

## 4. Déploiement de l'application

### Cloner le projet
```bash
cd /var/www
# Option 1: Cloner depuis GitHub (recommandé)
git clone https://github.com/Annonnyx/Synrkone-DEV.git synkrone
cd synkrone

# Option 2: Si vous avez déjà les fichiers localement
# Transférer via scp ou rsync depuis votre machine locale
```

### Installer les dépendances
```bash
npm install
```

### Configurer les variables d'environnement
```bash
cp .env.example .env
nano .env
```

Contenu du `.env`:
```env
# Database
DATABASE_URL="postgresql://synkrone:votre_mot_de_passe_fort@localhost:5432/synkrone?schema=public"

# NextAuth
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="votre_secret_aleatoire_32_caracteres_min"

# Discord OAuth (obligatoire pour l'authentification)
DISCORD_CLIENT_ID="votre_discord_client_id"
DISCORD_CLIENT_SECRET="votre_discord_client_secret"

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Storage
STORAGE_PATH="/var/lib/synkrone/storage"
```

### Initialiser la base de données
```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma db push

# (Optionnel) Voir la base de données
npx prisma studio
```

### Construire l'application
```bash
npm run build
```

---

## 5. Configuration PM2

### Créer le fichier de configuration
```bash
nano ecosystem.config.js
```

Contenu:
```javascript
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
```

### Créer les dossiers de logs
```bash
mkdir -p /var/log/synkrone
chown -R www-data:www-data /var/log/synkrone
```

### Démarrer l'application avec PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd
```

---

## 6. Configuration Nginx

### Créer la configuration du site
```bash
nano /etc/nginx/sites-available/synkrone
```

Contenu:
```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

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

    # Gestion des fichiers statiques (optionnel)
    location /_next/static {
        alias /var/www/synkrone/.next/static;
        expires 1y;
        access_log off;
    }

    # Taille max pour les uploads
    client_max_body_size 50M;
}
```

### Activer le site
```bash
ln -s /etc/nginx/sites-available/synkrone /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # Supprimer le site par défaut
nginx -t  # Tester la configuration
systemctl restart nginx
```

---

## 7. Configuration SSL (HTTPS)

### Installer Certbot
```bash
apt install -y certbot python3-certbot-nginx
```

### Obtenir le certificat SSL
```bash
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

Suivre les instructions interactives. Certbot configurera automatiquement Nginx.

### Renouvellement automatique
```bash
# Tester le renouvellement
certbot renew --dry-run

# Le renouvellement est automatique via un cron job
systemctl status certbot.timer
```

---

## 8. Configuration Discord OAuth

### Dans le Discord Developer Portal:
1. Allez sur https://discord.com/developers/applications
2. Créez une nouvelle application ou utilisez une existante
3. Dans "OAuth2" → "Redirects", ajoutez:
   - `https://votre-domaine.com/api/auth/callback/discord`
4. Copiez le Client ID et Client Secret dans le fichier `.env`

---

## 9. Commandes utiles

### Gestion de l'application
```bash
# Voir le statut
pm2 status

# Voir les logs
pm2 logs synkrone
pm2 logs synkrone --lines 100

# Redémarrer
pm2 restart synkrone

# Arrêter
pm2 stop synkrone

# Mettre à jour (après un git pull)
pm2 restart synkrone
```

### Gestion de la base de données
```bash
# Accéder à PostgreSQL
sudo -u postgres psql synkrone

# Backup
pg_dump -U synkrone synkrone > backup_$(date +%Y%m%d).sql

# Restore
psql -U synkrone synkrone < backup_YYYYMMDD.sql
```

### Gestion des fichiers
```bash
# Voir l'espace utilisé
du -sh /var/lib/synkrone/storage/*

# Nettoyer les vieux fichiers (attention!)
find /var/lib/synkrone/storage -type f -mtime +30 -delete
```

---

## 10. Mise à jour de l'application

```bash
cd /var/www/synkrone

# Récupérer les dernières modifications
git pull origin main

# Installer les nouvelles dépendances
npm install

# Regénérer Prisma si le schéma a changé
npx prisma generate
npx prisma db push

# Reconstruire
npm run build

# Redémarrer
pm2 restart synkrone
```

---

## 11. Sécurité

### Firewall (UFW recommandé)
```bash
apt install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw enable
```

### Sécuriser PostgreSQL
```bash
# Ne pas exposer PostgreSQL sur l'extérieur
nano /etc/postgresql/16/main/postgresql.conf
# listen_addresses = 'localhost'

systemctl restart postgresql
```

### Mises à jour automatiques (optionnel)
```bash
apt install -y unattended-upgrades
dpkg-reconfigure unattended-upgrades
```

---

## 12. Dépannage

### L'application ne démarre pas
```bash
# Voir les logs détaillés
pm2 logs synkrone --lines 200

# Vérifier la connexion DB
npx prisma db execute --stdin <<< "SELECT 1;"

# Vérifier les permissions du dossier storage
ls -la /var/lib/synkrone/
```

### Erreur 502 Bad Gateway
```bash
# Vérifier que l'app tourne sur le port 3000
pm2 status

# Vérifier Nginx
nginx -t
systemctl status nginx

# Voir les logs Nginx
tail -f /var/log/nginx/error.log
```

### Problèmes de permission fichiers
```bash
# Réparer les permissions
chown -R www-data:www-data /var/lib/synkrone
chown -R www-data:www-data /var/www/synkrone
```

---

## 13. Architecture des rôles et accès

```
┌─────────────────────────────────────────────────────────────┐
│                         SYNKRONE                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐     │
│  │     USER     │   │     DEV      │   │  ADMIN/OWNER │     │
│  └──────────────┘   └──────────────┘   └──────────────┘     │
│         │                  │                    │               │
│         ▼                  ▼                    ▼               │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐     │
│  │ Dashboard    │   │ Dashboard    │   │ Dashboard    │     │
│  │ • Fichiers   │   │ • Fichiers   │   │ • Fichiers   │     │
│  │   projet     │   │   projet     │   │   projet     │     │
│  │              │   │ • Code (dl)  │   │ • Code (dl)  │     │
│  │              │   │ • Ma Box     │   │ • Ma Box     │     │
│  │              │   │              │   │ • Boxes (all)│     │
│  │              │   │              │   │ • Gestion    │     │
│  └──────────────┘   └──────────────┘   └──────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Variables d'environnement importantes

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | Connexion PostgreSQL | `postgresql://synkrone:pass@localhost:5432/synkrone?schema=public` |
| `NEXTAUTH_SECRET` | Secret pour les sessions | `votre_secret_32_chars_min` |
| `NEXTAUTH_URL` | URL publique du site | `https://synkrone.com` |
| `DISCORD_CLIENT_ID` | ID OAuth Discord | `123456789012345678` |
| `DISCORD_CLIENT_SECRET` | Secret OAuth Discord | `votre_secret_discord` |
| `STORAGE_PATH` | Chemin stockage fichiers | `/var/lib/synkrone/storage` |

---

## Support

En cas de problème:
1. Vérifier les logs: `pm2 logs synkrone`
2. Vérifier Nginx: `nginx -t && systemctl status nginx`
3. Vérifier PostgreSQL: `systemctl status postgresql`
4. Vérifier les permissions: `ls -la /var/lib/synkrone/`
