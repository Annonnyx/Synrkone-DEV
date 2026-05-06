import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/bot/control — Contrôle le bot (start, stop, restart)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { action } = body;

    if (!action || !["start", "stop", "restart"].includes(action)) {
      return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }

    const bot = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!bot) {
      return NextResponse.json({ error: "Bot non trouvé" }, { status: 404 });
    }

    let newStatus = bot.status;

    switch (action) {
      case "start":
        newStatus = "online";
        break;
      case "stop":
        newStatus = "offline";
        break;
      case "restart":
        newStatus = "online";
        break;
    }

    // Mettre à jour le status dans la DB
    const updated = await prisma.bot.update({
      where: { id: bot.id },
      data: { status: newStatus },
    });

    // TODO: Intégrer PM2 ou un gestionnaire de processus pour contrôler le bot réellement
    console.log(`🤖 Bot ${action}: ${bot.name} (status → ${newStatus})`);

    return NextResponse.json({ status: newStatus, action });
  } catch (error) {
    console.error("Erreur contrôle bot:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
