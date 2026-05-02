// Configuration des IDs Discord pour les avatars
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

  // Serveurs (à compléter)
  SERVERS: {
    SYNKRONE_SUPPORT: {
      // ID du serveur Synkrone Support (logo principal)
      // Récupérable depuis l'URL d'invitation ou les paramètres du serveur
      id: "", // TODO: Récupérer l'ID
      name: "Synkrone Support",
    },
    FRENCH_BAGUETTE: {
      // Minecraft server
      id: "",
      name: "The French Baguette",
    },
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
