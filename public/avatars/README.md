# Avatars Discord

Ce dossier contient les avatars des utilisateurs et bots.

## IDs Discord connus :

### Team
- **VEX** : 1366780122891419784
- **ØNYX** : 1122092101459517481

### Bots
- **Vex** : 1367891720871874560
- **Asuna** : 1428865683986452640
- **Kayaba** : 1385913159717621780
- **Yui** : 1460012999912853810

### Serveur
- **Synkrone Support** : ID serveur à récupérer (logo principal)

## Comment obtenir les avatars :

### Méthode 1 : Depuis Discord (manuel)
1. Allez sur Discord
2. Click droit sur l'avatar d'un utilisateur → "Copier l'adresse de l'image"
3. L'URL ressemble à : `https://cdn.discordapp.com/avatars/USER_ID/AVATAR_HASH.png`
4. Téléchargez et placez dans ce dossier

### Méthode 2 : Via les outils en ligne
- https://pfpfinder.com/tools/discord-lookup
- https://discord.id/
- https://www.nicheprowler.com/tools/discord/discord-id-lookup

### Méthode 3 : API Discord (nécessite token)
```bash
curl -H "Authorization: Bot VOTRE_TOKEN" \
  https://discord.com/api/v10/users/1366780122891419784
```

## Fichiers attendus :

```
public/avatars/
├── vex.png          (1366780122891419784)
├── onyx.png         (1122092101459517481)
├── vex-bot.png      (1367891720871874560)
├── asuna.png        (1428865683986452640)
├── kayaba.png       (1385913159717621780)
├── yui.png          (1460012999912853810)
└── server-icon.png  (Synkrone Support)
```

## URLs CDN Discord

Format : `https://cdn.discordapp.com/avatars/{user_id}/{avatar_hash}.png`

Tailles disponibles : ?size=64, ?size=128, ?size=256, ?size=512
