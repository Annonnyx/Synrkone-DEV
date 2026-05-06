import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { syncDiscordRoles } from "@/lib/discord-sync";

// POST /api/discord/sync — Force la re-synchronisation des rôles Discord
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  console.log("🔄 /api/discord/sync called", { sessionUserId: session.user.id, sessionDiscordId: session.user.discordId });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { discordId: true },
    });

    console.log("🔄 DB user lookup", { dbUser: user });

    let discordId = user?.discordId;

    // Fallback : récupérer depuis Account si absent dans User
    if (!discordId) {
      const account = await prisma.account.findFirst({
        where: { userId: session.user.id, provider: "discord" },
        select: { providerAccountId: true },
      });
      console.log("🔄 Account fallback", { account });
      discordId = account?.providerAccountId ?? null;
    }

    if (!discordId) {
      console.error("❌ No discordId found for user", { userId: session.user.id });
      return NextResponse.json({ error: "Pas de Discord ID lié" }, { status: 400 });
    }

    // Sync via le bot token (pas besoin de l'access_token utilisateur)
    const result = await syncDiscordRoles(discordId);

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
