// =====================
// Configuration des rôles Discord ↔ Synkrone
// =====================

/**
 * ID du serveur Discord Synkrone
 * ⚠️ À REMPLIR avec l'ID réel du serveur
 * Pour le trouver : Discord → Paramètres du serveur → Widget → Server ID
 * Ou : Mode développeur activé → clic droit sur le serveur → "Copier l'identifiant"
 */
export const SYNKRONE_GUILD_ID = process.env.DISCORD_GUILD_ID ?? "";

/**
 * Mapping des rôles Discord vers les rôles site
 * Classés par priorité (le premier match gagne)
 */
export const DISCORD_ROLE_MAP = [
  { discordRoleId: "1368719335534887023", name: "Owner",       siteRole: "OWNER" as const },
  { discordRoleId: "1368620965403299890", name: "ADMIN",       siteRole: "ADMIN" as const },
  { discordRoleId: "1369430431212114002", name: "Dev",         siteRole: "DEV"   as const },
  { discordRoleId: "1474871058166448280", name: "Apprenti-dev",siteRole: "DEV"   as const },
  { discordRoleId: "1440840910241005740", name: "Partenaire",  siteRole: "USER"  as const },
  { discordRoleId: "1478386520766546156", name: "Membre",      siteRole: "USER"  as const },
];

/**
 * Hiérarchie des rôles site (plus haut = plus de permissions)
 */
export const SITE_ROLE_HIERARCHY: Record<string, number> = {
  USER: 0,
  DEV: 1,
  ADMIN: 2,
  OWNER: 3,
};

/**
 * Détermine le rôle site le plus élevé à partir des IDs de rôles Discord
 */
export function mapDiscordRolesToSiteRole(discordRoleIds: string[]): string {
  let highestRole = "USER";
  let highestPriority = 0;

  for (const mapping of DISCORD_ROLE_MAP) {
    if (discordRoleIds.includes(mapping.discordRoleId)) {
      const priority = SITE_ROLE_HIERARCHY[mapping.siteRole] ?? 0;
      if (priority > highestPriority) {
        highestPriority = priority;
        highestRole = mapping.siteRole;
      }
    }
  }

  return highestRole;
}

/**
 * Retrouve l'ID Discord d'un rôle site pour l'attribuer sur Discord
 */
export function siteRoleToDiscordRoleId(siteRole: string): string | null {
  const mapping = DISCORD_ROLE_MAP.find((m) => m.siteRole === siteRole);
  return mapping?.discordRoleId ?? null;
}
