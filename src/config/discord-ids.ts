// Configuration des IDs Discord pour les avatars et le serveur
// Pour obtenir un avatar : https://cdn.discordapp.com/avatars/{user_id}/{avatar_hash}.png

export const DISCORD_IDS = {
  // Team
  VEX: {
    id: "1366780122891419784",
    name: "VEX",
    role: "Co-fondateur & Lead Dev",
  },
  ONYX: {
    id: "1122092101459517481",
    name: "ØNYX",
    role: "Co-fondateur & DevOps",
  },

  // Bots
  BOTS: {
    VEX: {
      clientId: "1367891720871874560",
      name: "Vex",
      category: "Bot Multifonction",
    },
    ASUNA: {
      clientId: "1428865683986452640",
      name: "Asuna",
      category: "Bot Modération",
    },
    KAYABA: {
      clientId: "1385913159717621780",
      name: "Kayaba",
      category: "Bot Utilitaires",
    },
    YUI: {
      clientId: "1460012999912853810",
      name: "Yui",
      category: "Bot Fun & Jeux",
    },
  },

  // Serveurs
  SERVERS: {
    SYNKRONE_SUPPORT: {
      // ID du serveur Synkrone Support
      // ⚠️ À remplir avec l'ID réel (ou utiliser DISCORD_GUILD_ID dans .env)
      id: process.env.DISCORD_GUILD_ID ?? "",
      name: "Synkrone Support",
      inviteUrl: "https://discord.gg/zfBeYvudbu",
    },
    FRENCH_BAGUETTE: {
      // Minecraft server
      id: "",
      name: "The French Baguette",
    },
  },

  // Rôles du serveur Synkrone (pour la sync)
  ROLES: {
    OWNER:        "1368719335534887023",
    ADMIN:        "1368620965403299890",
    DEV:          "1369430431212114002",
    APPRENTI_DEV: "1474871058166448280",
    PARTENAIRE:   "1440840910241005740",
    MEMBRE:       "1478386520766546156",
  },
};

// URLs CDN Discord
// Format: https://cdn.discordapp.com/avatars/{user_id}/{avatar_hash}.png
// Pour les bots: https://cdn.discordapp.com/app-icons/{client_id}/{icon_hash}.png

export const AVATAR_URLS = {
  // À remplir avec les URLs réelles une fois récupérées
  VEX: null, // "/avatars/vex.png" ou URL CDN
  ONYX: null,
  VEX_BOT: null,
  ASUNA: null,
  KAYABA: null,
  YUI: null,
  SERVER_ICON: null,
};

// Comment récupérer les avatars :
// 1. Méthode manuelle : Click droit sur Discord → "Copier l'adresse de l'image"
// 2. Outils en ligne : https://pfpfinder.com/tools/discord-lookup
// 3. API Discord (nécessite token) :
//    curl -H "Authorization: Bot TOKEN" https://discord.com/api/v10/users/ID
