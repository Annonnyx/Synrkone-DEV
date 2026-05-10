import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STORAGE_ROOT } from "@/lib/storage";
import fs from "fs/promises";
import path from "path";

const MODULE_TEMPLATES = process.env.MODULE_TEMPLATES_PATH ?? "/Partage/Synkrone/templates/modules";

// GET /api/bot/modules — Récupère les modules du bot
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

// PATCH /api/bot/modules — Active/désactive un module
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { moduleInstanceId, enabled } = body;

    const bot = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!bot) return NextResponse.json({ error: "Bot non trouvé" }, { status: 404 });

    // Vérifier que le module appartient bien au bot
    const instance = await prisma.moduleInstance.findFirst({
      where: { id: moduleInstanceId, botId: bot.id },
      include: { module: true },
    });

    if (!instance) return NextResponse.json({ error: "Module non trouvé" }, { status: 404 });

    // Calculer les Krônes utilisés
    const allModules = await prisma.moduleInstance.findMany({
      where: { botId: bot.id, enabled: true },
      include: { module: true },
    });

    const currentUsed = allModules
      .filter((m: { id: string }) => m.id !== moduleInstanceId)
      .reduce((sum: number, m: { module: { pointCost: number } }) => sum + m.module.pointCost, 0);

    const newUsed = enabled ? currentUsed + instance.module.pointCost : currentUsed;

    if (enabled && newUsed > bot.maxKr) {
      return NextResponse.json(
        { error: `Limite de Krônes dépassée (${newUsed}/${bot.maxKr})` },
        { status: 400 }
      );
    }

    // Mettre à jour le module
    const updated = await prisma.moduleInstance.update({
      where: { id: moduleInstanceId },
      data: { enabled },
    });

    // Mettre à jour les Krônes utilisés
    await prisma.bot.update({
      where: { id: bot.id },
      data: { usedKr: newUsed },
    });

    // Copier/supprimer les fichiers du module dans le dossier du bot
    try {
      const botDir = path.join(STORAGE_ROOT, "bots", bot.id);
      const commandsDir = path.join(botDir, "commands");
      const modulesDir = path.join(botDir, "modules");
      const moduleTemplateDir = path.join(MODULE_TEMPLATES, instance.module.moduleId);

      if (enabled) {
        // Copier les fichiers du module vers le dossier commands/ du bot
        try {
          const moduleFiles = await fs.readdir(moduleTemplateDir);
          for (const file of moduleFiles) {
            const src = path.join(moduleTemplateDir, file);
            const stat = await fs.stat(src);
            if (stat.isFile() && file.endsWith(".js")) {
              // Les fichiers de commandes vont dans commands/
              await fs.copyFile(src, path.join(commandsDir, file));
            } else if (stat.isDirectory()) {
              // Les sous-dossiers (events, etc.) vont dans modules/
              const destDir = path.join(modulesDir, file);
              await fs.mkdir(destDir, { recursive: true });
              const subFiles = await fs.readdir(src);
              for (const subFile of subFiles) {
                const subSrc = path.join(src, subFile);
                const subStat = await fs.stat(subSrc);
                if (subStat.isFile()) {
                  await fs.copyFile(subSrc, path.join(destDir, subFile));
                }
              }
            }
          }
        } catch {
          // Pas de template pour ce module, les commandes seront vides
        }
      } else {
        // Supprimer les fichiers du module du dossier commands/
        try {
          const moduleFiles = await fs.readdir(moduleTemplateDir);
          for (const file of moduleFiles) {
            if (file.endsWith(".js")) {
              const destFile = path.join(commandsDir, file);
              try {
                await fs.unlink(destFile);
              } catch {
                // Fichier déjà absent
              }
            }
          }
        } catch {
          // Pas de template, rien à supprimer
        }
      }
    } catch (fsError) {
      console.error("Erreur copie module (non bloquant):", fsError);
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur update module:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
