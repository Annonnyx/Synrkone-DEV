import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/bot — Récupère le bot de l'utilisateur
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const bot = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
      include: {
        modules: {
          include: { module: true },
        },
        stats: true,
      },
    });

    if (!bot) {
      return NextResponse.json(null); // Pas de bot encore créé
    }

    return NextResponse.json(bot);
  } catch (error) {
    console.error("Erreur bot:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/bot — Crée un nouveau bot
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { name, token, hosting } = body;

    // Vérifier si l'utilisateur a déjà un bot
    const existing = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
    });

    if (existing) {
      return NextResponse.json({ error: "Vous avez déjà un bot" }, { status: 400 });
    }

    // Créer le bot
    const bot = await prisma.bot.create({
      data: {
        name,
        token,
        hosting: hosting || "synkrone",
        ownerId: session.user.id,
        maxKr: 30, // Plan gratuit par défaut
        usedKr: 0,
      },
    });

    // Créer les stats initiales
    await prisma.botStats.create({
      data: {
        botId: bot.id,
        servers: 0,
        users: 0,
        commandsToday: 0,
        totalCommands: 0,
        uptime: "0%",
        latency: "0ms",
        memory: "0 MB",
        cpu: "0%",
        messagesProcessed: 0,
        errors: 0,
        lastRestart: "Jamais",
        topCommands: JSON.stringify([]),
        dailyActivity: JSON.stringify([]),
      },
    });

    // Initialiser tous les modules comme désactivés
    const allModules = await prisma.moduleDef.findMany();
    for (const mod of allModules) {
      await prisma.moduleInstance.create({
        data: {
          moduleId: mod.id,
          botId: bot.id,
          enabled: false,
        },
      });
    }

    return NextResponse.json(bot, { status: 201 });
  } catch (error) {
    console.error("Erreur création bot:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/bot — Met à jour le bot
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { name, token, hosting, status } = body;

    const bot = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!bot) {
      return NextResponse.json({ error: "Bot non trouvé" }, { status: 404 });
    }

    const updated = await prisma.bot.update({
      where: { id: bot.id },
      data: { name, token, hosting, status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur update bot:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
