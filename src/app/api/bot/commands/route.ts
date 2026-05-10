import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateBotConfig } from "@/lib/bot-deploy";

// PATCH /api/bot/commands — Active/désactive une commande individuelle
// pour le bot du user courant, avec vérification Krônes.
//
// Body: { commandId: string, enabled: boolean }
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { commandId, enabled } = body as {
      commandId?: string;
      enabled?: boolean;
    };

    if (!commandId || typeof enabled !== "boolean") {
      return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
    }

    const bot = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
    });
    if (!bot) return NextResponse.json({ error: "Bot non trouvé" }, { status: 404 });

    const cmd = await prisma.botCommand.findFirst({
      where: { botId: bot.id, commandId },
    });
    if (!cmd) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
    }

    // Si on active, vérifier qu'on ne dépasse pas le quota
    if (enabled && !cmd.enabled) {
      const allEnabled = await prisma.botCommand.findMany({
        where: { botId: bot.id, enabled: true },
      });
      const currentUsed = allEnabled
        .filter((c: { commandId: string }) => c.commandId !== commandId)
        .reduce((sum: number, c: { priceKr: number }) => sum + c.priceKr, 0);
      const newUsed = currentUsed + cmd.priceKr;
      if (newUsed > bot.maxKr) {
        return NextResponse.json(
          { error: `Limite de Krônes dépassée (${newUsed}/${bot.maxKr})` },
          { status: 400 },
        );
      }
      await prisma.bot.update({
        where: { id: bot.id },
        data: { usedKr: newUsed },
      });
    }

    // Si on désactive, recalculer usedKr
    if (!enabled && cmd.enabled) {
      const allEnabled = await prisma.botCommand.findMany({
        where: { botId: bot.id, enabled: true },
      });
      const newUsed = allEnabled
        .filter((c: { commandId: string }) => c.commandId !== commandId)
        .reduce((sum: number, c: { priceKr: number }) => sum + c.priceKr, 0);
      await prisma.bot.update({
        where: { id: bot.id },
        data: { usedKr: newUsed },
      });
    }

    const updated = await prisma.botCommand.update({
      where: { id: cmd.id },
      data: { enabled },
    });

    // Régénérer bot.config.json avec la nouvelle liste de commandes
    const finalInstances = await prisma.moduleInstance.findMany({
      where: { botId: bot.id },
      include: { module: true },
    });
    const finalCommands = await prisma.botCommand.findMany({
      where: { botId: bot.id },
    });

    try {
      const deploy = await updateBotConfig({
        bot: { id: bot.id, name: bot.name },
        prefix: bot.prefix,
        modules: finalInstances,
        commands: finalCommands,
      });
      if (!deploy.ok) {
        console.error("Erreur sync bot.config.json (non bloquant):", deploy.error);
      }
    } catch (e) {
      console.error("Erreur sync bot.config.json (non bloquant):", e);
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur update commande:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
