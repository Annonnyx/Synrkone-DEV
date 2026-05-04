import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/auth-guard";
import { getGuildMemberRoles, changeUserRole } from "@/lib/discord-sync";
import { DISCORD_ROLE_MAP, mapDiscordRolesToSiteRole } from "@/config/discord-roles";

// GET /api/discord/roles — Récupère les rôles Discord de l'utilisateur connecté
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { discordId: true, discordRoles: true, isOnSynkroneServer: true, role: true },
    });

    if (!user?.discordId) {
      return NextResponse.json({ error: "Pas de Discord ID" }, { status: 400 });
    }

    // Récupérer les rôles frais depuis Discord
    const discordRoles = await getGuildMemberRoles(user.discordId);
    const siteRole = mapDiscordRolesToSiteRole(discordRoles);

    // Enrichir avec les noms de rôles
    const rolesWithNames = discordRoles
      .map((roleId) => {
        const mapping = DISCORD_ROLE_MAP.find((m) => m.discordRoleId === roleId);
        return mapping ? { id: roleId, name: mapping.name, siteRole: mapping.siteRole } : null;
      })
      .filter(Boolean);

    return NextResponse.json({
      discordRoles: rolesWithNames,
      currentSiteRole: user.role,
      computedSiteRole: siteRole,
      isOnSynkroneServer: discordRoles.length > 0 || user.isOnSynkroneServer,
    });
  } catch (error) {
    console.error("Erreur Discord roles:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/discord/roles — Change le rôle d'un utilisateur (ADMIN+ requis)
// Body: { userId: string, newRole: "USER" | "DEV" | "ADMIN" | "OWNER" }
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Seul ADMIN+ peut changer les rôles
  if (!hasRole(session.user.role, "ADMIN")) {
    return NextResponse.json({ error: "Rôle ADMIN requis" }, { status: 403 });
  }

  try {
    const { userId, newRole } = await request.json();

    if (!userId || !newRole) {
      return NextResponse.json({ error: "userId et newRole requis" }, { status: 400 });
    }

    // Vérifier que le rôle est valide
    if (!["USER", "DEV", "ADMIN", "OWNER"].includes(newRole)) {
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
    }

    // Un ADMIN ne peut pas promouvoir en OWNER
    if (newRole === "OWNER" && session.user.role !== "OWNER") {
      return NextResponse.json({ error: "Seul un OWNER peut promouvoir en OWNER" }, { status: 403 });
    }

    // Changer le rôle sur le site ET sur Discord
    const result = await changeUserRole(userId, newRole);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, newRole });
  } catch (error) {
    console.error("Erreur changement rôle:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
