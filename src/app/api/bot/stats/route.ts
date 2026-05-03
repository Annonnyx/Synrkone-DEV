import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/bot/stats — Récupère les stats du bot
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const bot = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
      include: { stats: true },
    });

    if (!bot || !bot.stats) {
      return NextResponse.json(null);
    }

    return NextResponse.json(bot.stats);
  } catch (error) {
    console.error("Erreur stats:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/bot/stats — Met à jour les stats (pour le bot worker)
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const bot = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!bot) return NextResponse.json({ error: "Bot non trouvé" }, { status: 404 });

    const body = await request.json();
    const {
      servers,
      users,
      commandsToday,
      totalCommands,
      uptime,
      latency,
      memory,
      cpu,
      messagesProcessed,
      errors,
      lastRestart,
      topCommands,
      dailyActivity,
    } = body;

    const updated = await prisma.botStats.update({
      where: { botId: bot.id },
      data: {
        servers,
        users,
        commandsToday,
        totalCommands,
        uptime,
        latency,
        memory,
        cpu,
        messagesProcessed,
        errors,
        lastRestart,
        topCommands: topCommands ? JSON.stringify(topCommands) : undefined,
        dailyActivity: dailyActivity ? JSON.stringify(dailyActivity) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur update stats:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
