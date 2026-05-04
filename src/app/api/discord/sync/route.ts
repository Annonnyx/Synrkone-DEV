import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { syncDiscordRoles } from "@/lib/discord-sync";

// POST /api/discord/sync — Force la re-synchronisation des rôles Discord
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { discordId: true },
    });

    if (!user?.discordId) {
      return NextResponse.json({ error: "Pas de Discord ID lié" }, { status: 400 });
    }

    // Sync via le bot token (pas besoin de l'access_token utilisateur)
    const result = await syncDiscordRoles(user.discordId);

    return NextResponse.json({
      success: true,
      role: result.role,
      isOnServer: result.isOnServer,
      discordRoles: result.discordRoles,
    });
  } catch (error) {
    console.error("Erreur sync Discord:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
