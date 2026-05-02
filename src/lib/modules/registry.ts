import { ModuleDefinition } from "./types";

export const modules: ModuleDefinition[] = [
  {
    id: "autorole",
    name: "Auto-Rôles",
    description: "Attribue automatiquement des rôles à l'arrivée des membres.",
    icon: "Users",
    premium: false,
    enabled: true,
    category: "management",
    pointCost: 1,
  },
  {
    id: "generation",
    name: "Génération IA",
    description: "Génération d'images et de textes via l'IA.",
    icon: "Image",
    premium: true,
    enabled: false,
    category: "ai",
    pointCost: 3,
  },
  {
    id: "moderation",
    name: "Modération",
    description: "Auto-mod, anti-spam, anti-raid, filtrage de contenu.",
    icon: "Shield",
    premium: false,
    enabled: true,
    category: "moderation",
    pointCost: 2,
  },
  {
    id: "economy",
    name: "Économie",
    description: "Système de monnaie, boutique, transactions entre membres.",
    icon: "Coins",
    premium: true,
    enabled: false,
    category: "economy",
    pointCost: 3,
  },
  {
    id: "music",
    name: "Musique",
    description: "Lecture de musique depuis YouTube, Spotify et plus.",
    icon: "Music",
    premium: false,
    enabled: false,
    category: "music",
    pointCost: 2,
  },
  {
    id: "tickets",
    name: "Tickets",
    description: "Système de tickets de support avec catégories.",
    icon: "Ticket",
    premium: false,
    enabled: true,
    category: "management",
    pointCost: 1,
  },
  {
    id: "welcome",
    name: "Messages de bienvenue",
    description: "Messages personnalisés d'arrivée et de départ.",
    icon: "MessageSquare",
    premium: false,
    enabled: false,
    category: "utility",
    pointCost: 1,
  },
  {
    id: "giveaway",
    name: "Giveaways",
    description: "Organisez des tirages au sort automatiques.",
    icon: "Crown",
    premium: true,
    enabled: false,
    category: "fun",
    pointCost: 2,
  },
];

export function getModuleById(id: string): ModuleDefinition | undefined {
  return modules.find((m) => m.id === id);
}

export function getModulesByCategory(category: string): ModuleDefinition[] {
  return modules.filter((m) => m.category === category);
}

export function getPremiumModules(): ModuleDefinition[] {
  return modules.filter((m) => m.premium);
}

export function getFreeModules(): ModuleDefinition[] {
  return modules.filter((m) => !m.premium);
}
