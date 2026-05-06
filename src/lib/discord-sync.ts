import { prisma } from "@/lib/prisma";
import { SYNKRONE_GUILD_ID, mapDiscordRolesToSiteRole, DISCORD_ROLE_MAP } from "@/config/discord-roles";

const DISCORD_API_BASE = "https://discord.com/api/v10";

// =====================
// Types
// =====================

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
}

interface DiscordGuildMember {
  roles: string[];
  nick: string | null;
  user?: { id: string; username: string };
}

// =====================
// Fonctions utilitaires Discord API
// =====================

/**
 * Vérifie si l'utilisateur est sur le serveur Discord Synkrone
 * Utilise le token OAuth de l'utilisateur (scope: guilds)
 */
export async function checkGuildMembership(userAccessToken: string): Promise<boolean> {
  if (!SYNKRONE_GUILD_ID) {
    console.warn("⚠️ DISCORD_GUILD_ID non configuré — skip guild check");
    return false;
  }

  try {
    const res = await fetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
      headers: { Authorization: `Bearer ${userAccessToken}` },
    });

    if (!res.ok) {
      console.error("❌ Discord guilds API error:", res.status, await res.text());
      return false;
    }

    const guilds: DiscordGuild[] = await res.json();
    return guilds.some((g) => g.id === SYNKRONE_GUILD_ID);
  } catch (error) {
    console.error("❌ Failed to check guild membership:", error);
    return false;
  }
}

/**
 * Récupère les rôles de l'utilisateur sur le serveur Synkrone
 * Utilise le token du BOT (pas de l'utilisateur)
 */
export async function getGuildMemberRoles(discordUserId: string): Promise<string[]> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken || !SYNKRONE_GUILD_ID) {
    console.warn("⚠️ DISCORD_BOT_TOKEN ou DISCORD_GUILD_ID manquant");
    return [];
  }

  try {
    const res = await fetch(
      `${DISCORD_API_BASE}/guilds/${SYNKRONE_GUILD_ID}/members/${discordUserId}`,
      { headers: { Authorization: `Bot ${botToken}` } }
    );

    console.log("🔍 Discord API response", { status: res.status, ok: res.ok, guildId: SYNKRONE_GUILD_ID, userId: discordUserId });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Discord member API error:", res.status, errorText);
      if (res.status === 404) {
        // L'utilisateur n'est pas sur le serveur
        return [];
      }
      return [];
    }

    const member: DiscordGuildMember = await res.json();
    console.log("🔍 Discord member roles", { discordUserId, roles: member.roles, nick: member.nick, rolesCount: member.roles.length });
    return member.roles;
  } catch (error) {
    console.error("❌ Failed to get member roles:", error);
    return [];
  }
}

/**
 * Ajoute un rôle Discord à un utilisateur sur le serveur Synkrone
 */
export async function addDiscordRole(discordUserId: string, roleId: string): Promise<boolean> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken || !SYNKRONE_GUILD_ID) return false;

  try {
    const res = await fetch(
      `${DISCORD_API_BASE}/guilds/${SYNKRONE_GUILD_ID}/members/${discordUserId}/roles/${roleId}`,
      {
        method: "PUT",
        headers: { Authorization: `Bot ${botToken}` },
      }
    );
    return res.ok || res.status === 204;
  } catch (error) {
    console.error("❌ Failed to add Discord role:", error);
    return false;
  }
}

/**
 * Retire un rôle Discord d'un utilisateur sur le serveur Synkrone
 */
export async function removeDiscordRole(discordUserId: string, roleId: string): Promise<boolean> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken || !SYNKRONE_GUILD_ID) return false;

  try {
    const res = await fetch(
      `${DISCORD_API_BASE}/guilds/${SYNKRONE_GUILD_ID}/members/${discordUserId}/roles/${roleId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bot ${botToken}` },
      }
    );
    return res.ok || res.status === 204;
  } catch (error) {
    console.error("❌ Failed to remove Discord role:", error);
    return false;
  }
}

// =====================
// Fonction principale de synchronisation
// =====================

/**
 * Synchronise les rôles Discord d'un utilisateur vers le site
 * Appelée lors du signIn et via l'API /api/discord/sync
 */
export async function syncDiscordRoles(
  discordUserId: string,
  userAccessToken?: string
): Promise<{ role: string; isOnServer: boolean; discordRoles: string[] }> {
  // 1. Vérifier si l'utilisateur est sur le serveur
  let isOnServer = false;
  if (userAccessToken) {
    isOnServer = await checkGuildMembership(userAccessToken);
  }

  // 2. Récupérer les rôles Discord via le Bot token
  const discordRoles = await getGuildMemberRoles(discordUserId);
  console.log("🔍 syncDiscordRoles raw roles", { discordUserId, discordRoles, count: discordRoles.length });

  // Si on a des rôles, l'utilisateur est forcément sur le serveur
  if (discordRoles.length > 0) {
    isOnServer = true;
  }

  // 3. Mapper vers le rôle site
  const siteRole = mapDiscordRolesToSiteRole(discordRoles);

  // 4. Mettre à jour la DB
  await prisma.user.update({
    where: { discordId: discordUserId },
    data: {
      role: siteRole as "USER" | "DEV" | "ADMIN" | "OWNER",
      discordRoles: discordRoles,
      isOnSynkroneServer: isOnServer,
    },
  });

  console.log("✅ Discord sync complete", { discordUserId, siteRole, isOnServer, rolesCount: discordRoles.length });

  return { role: siteRole, isOnServer, discordRoles };
}

/**
 * Change un rôle d'un utilisateur et le synchronise sur Discord
 * Appelée depuis l'admin panel
 */
export async function changeUserRole(
  targetUserId: string,
  newSiteRole: string
): Promise<{ success: boolean; error?: string }> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken || !SYNKRONE_GUILD_ID) {
    return { success: false, error: "Bot token ou Guild ID non configuré" };
  }

  // Récupérer l'utilisateur
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { discordId: true, discordRoles: true },
  });

  if (!user?.discordId) {
    return { success: false, error: "Utilisateur sans Discord ID" };
  }

  // Trouver le rôle Discord correspondant au nouveau rôle site
  const newDiscordMapping = DISCORD_ROLE_MAP.find((m) => m.siteRole === newSiteRole);

  // Retirer tous les anciens rôles mappés
  for (const mapping of DISCORD_ROLE_MAP) {
    const currentRoles = (user.discordRoles as string[]) ?? [];
    if (currentRoles.includes(mapping.discordRoleId)) {
      await removeDiscordRole(user.discordId, mapping.discordRoleId);
    }
  }

  // Ajouter le nouveau rôle Discord
  if (newDiscordMapping) {
    await addDiscordRole(user.discordId, newDiscordMapping.discordRoleId);
  }

  // Mettre à jour la DB
  await prisma.user.update({
    where: { id: targetUserId },
    data: {
      role: newSiteRole as "USER" | "DEV" | "ADMIN" | "OWNER",
    },
  });

  return { success: true };
}
