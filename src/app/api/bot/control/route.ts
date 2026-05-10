import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { restartBot, startBot, stopBot } from "@/lib/bot-deploy";

// POST /api/bot/control — start | stop | restart le process PM2 du bot.
//
// On met aussi à jour Bot.status en DB pour que le dashboard reflète
// immédiatement l'action sans attendre les stats remontées par le bot.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { action } = body as { action?: string };

    if (!action || !["start", "stop", "restart"].includes(action)) {
      return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }

    const bot = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!bot) {
      return NextResponse.json({ error: "Bot non trouvé" }, { status: 404 });
    }

    const identity = { id: bot.id, name: bot.name };
    const result =
      action === "start"
        ? await startBot(identity)
        : action === "stop"
          ? await stopBot(identity)
          : await restartBot(identity);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "Erreur PM2" },
        { status: 500 },
      );
    }

    const newStatus = action === "stop" ? "offline" : "online";
    const updated = await prisma.bot.update({
      where: { id: bot.id },
      data: { status: newStatus },
    });

    return NextResponse.json({
      status: updated.status,
      action,
      deploy: result,
    });
  } catch (error) {
    console.error("Erreur contrôle bot:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
