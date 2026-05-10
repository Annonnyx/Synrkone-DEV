import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { provisionBot, updateBotToken, type DeployResult } from "@/lib/bot-deploy";

// GET /api/bot — Récupère le bot de l'utilisateur courant.
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
      return NextResponse.json(null);
    }

    return NextResponse.json(bot);
  } catch (error) {
    console.error("Erreur bot:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/bot — Crée un nouveau bot Python (un par utilisateur).
//
// Pipeline :
//   1. Crée la ligne `Bot` + `BotStats` + une `ModuleInstance` désactivée par
//      `ModuleDef` connue.
//   2. Provisionne /bots/synkrone_<id>/ avec main.py + bot.config.json + .enc.
//   3. Lance le process PM2 via le venv partagé /Partage/Synkrone/.venv/.
//
// Les étapes 2-3 sont best-effort : si le VPS (/bots, pm2) n'est pas dispo
// (dev local, CI), on log et on retourne le bot quand même — l'utilisateur
// pourra recréer la struct disque plus tard via /api/bot/redeploy.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { name, token, hosting, prefix, useSlashCommands } = body as {
      name?: string;
      token?: string | null;
      hosting?: string;
      prefix?: string | null;
      useSlashCommands?: boolean;
    };

    if (!name) {
      return NextResponse.json({ error: "Nom du projet requis" }, { status: 400 });
    }

    const existing = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
    });

    if (existing) {
      return NextResponse.json({ error: "Vous avez déjà un bot" }, { status: 400 });
    }

    const bot = await prisma.bot.create({
      data: {
        name,
        token: token || null,
        hosting: hosting || "synkrone",
        prefix: prefix || null,
        useSlashCommands: useSlashCommands || false,
        ownerId: session.user.id,
        maxKr: 30,
        usedKr: 0,
      },
    });

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

    const instances = await prisma.moduleInstance.findMany({
      where: { botId: bot.id },
      include: { module: true },
    });

    let deploy: DeployResult = { ok: true };
    try {
      deploy = await provisionBot({
        bot: { id: bot.id, name: bot.name },
        prefix: bot.prefix,
        token: bot.token,
        modules: instances,
      });
      if (!deploy.ok) {
        console.error("Erreur provision bot (non bloquant):", deploy.error);
      }
    } catch (fsError) {
      console.error("Erreur provision bot (non bloquant):", fsError);
      deploy = { ok: false, error: (fsError as Error).message };
    }

    return NextResponse.json({ ...bot, deploy }, { status: 201 });
  } catch (error) {
    console.error("Erreur creation bot:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/bot — Met à jour le bot. Si le token change, le .enc est
// réécrit et le process PM2 redémarré pour prendre en compte le nouveau token.
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { name, token, hosting, status, prefix, useSlashCommands } = body as {
      name?: string;
      token?: string | null;
      hosting?: string;
      status?: string;
      prefix?: string | null;
      useSlashCommands?: boolean;
    };

    const bot = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!bot) {
      return NextResponse.json({ error: "Bot non trouvé" }, { status: 404 });
    }

    const tokenChanged = token !== undefined && token !== bot.token;

    const updated = await prisma.bot.update({
      where: { id: bot.id },
      data: {
        ...(name !== undefined && { name }),
        ...(token !== undefined && { token }),
        ...(hosting !== undefined && { hosting }),
        ...(status !== undefined && { status }),
        ...(prefix !== undefined && { prefix }),
        ...(useSlashCommands !== undefined && { useSlashCommands }),
      },
    });

    if (tokenChanged) {
      try {
        const deploy = await updateBotToken(
          { id: updated.id, name: updated.name },
          updated.token,
        );
        if (!deploy.ok) {
          console.error("Erreur sync token bot (non bloquant):", deploy.error);
        }
      } catch (e) {
        console.error("Erreur sync token bot (non bloquant):", e);
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur update bot:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
