import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateBotConfig } from "@/lib/bot-deploy";

// GET /api/bot/modules — Liste les modules (instances) du bot du user courant.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const bot = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!bot) return NextResponse.json([]);

    const modules = await prisma.moduleInstance.findMany({
      where: { botId: bot.id },
      include: { module: true },
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error("Erreur modules bot:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/bot/modules — Active/désactive un module pour le bot du user.
//
// Pipeline :
//   1. Vérif Krônes (ne dépasse pas le quota maxKr).
//   2. Update ModuleInstance.enabled + Bot.usedKr.
//   3. Réécriture de bot.config.json["commands"] selon les modules activés
//      (mapping module → cogs Python dans src/lib/module-cogs.ts).
//   4. `pm2 restart synkrone_<botId>` pour appliquer (silencieux si pm2 absent).
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { moduleInstanceId, enabled } = body as {
      moduleInstanceId?: string;
      enabled?: boolean;
    };

    if (!moduleInstanceId || typeof enabled !== "boolean") {
      return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
    }

    const bot = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!bot) return NextResponse.json({ error: "Bot non trouvé" }, { status: 404 });

    const instance = await prisma.moduleInstance.findFirst({
      where: { id: moduleInstanceId, botId: bot.id },
      include: { module: true },
    });

    if (!instance) return NextResponse.json({ error: "Module non trouvé" }, { status: 404 });

    const allModules = await prisma.moduleInstance.findMany({
      where: { botId: bot.id, enabled: true },
      include: { module: true },
    });

    const currentUsed = allModules
      .filter((m) => m.id !== moduleInstanceId)
      .reduce((sum, m) => sum + m.module.pointCost, 0);

    const newUsed = enabled ? currentUsed + instance.module.pointCost : currentUsed;

    if (enabled && newUsed > bot.maxKr) {
      return NextResponse.json(
        { error: `Limite de Krônes dépassée (${newUsed}/${bot.maxKr})` },
        { status: 400 },
      );
    }

    const updated = await prisma.moduleInstance.update({
      where: { id: moduleInstanceId },
      data: { enabled },
    });

    await prisma.bot.update({
      where: { id: bot.id },
      data: { usedKr: newUsed },
    });

    const finalInstances = await prisma.moduleInstance.findMany({
      where: { botId: bot.id },
      include: { module: true },
    });

    try {
      const deploy = await updateBotConfig({
        bot: { id: bot.id, name: bot.name },
        prefix: bot.prefix,
        modules: finalInstances,
      });
      if (!deploy.ok) {
        console.error("Erreur sync bot.config.json (non bloquant):", deploy.error);
      }
    } catch (e) {
      console.error("Erreur sync bot.config.json (non bloquant):", e);
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur update module:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
