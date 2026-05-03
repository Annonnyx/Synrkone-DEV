import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/modules — Liste tous les modules disponibles
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const modules = await prisma.moduleDef.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(modules);
  } catch (error) {
    console.error("Erreur modules:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/modules/seed — Initialise les modules par défaut (OWNER uniquement)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const defaultModules = [
      { moduleId: "autorole", name: "Auto-Rôles", description: "Attribue automatiquement des rôles à l'arrivée des membres.", icon: "Users", premium: false, enabled: true, category: "MANAGEMENT" as const, pointCost: 1 },
      { moduleId: "generation", name: "Génération IA", description: "Génération d'images et de textes via l'IA.", icon: "Image", premium: true, enabled: true, category: "AI" as const, pointCost: 3 },
      { moduleId: "moderation", name: "Modération", description: "Auto-mod, anti-spam, anti-raid, filtrage de contenu.", icon: "Shield", premium: false, enabled: true, category: "MODERATION" as const, pointCost: 2 },
      { moduleId: "economy", name: "Économie", description: "Système de monnaie, boutique, transactions entre membres.", icon: "Coins", premium: true, enabled: true, category: "ECONOMY" as const, pointCost: 3 },
      { moduleId: "music", name: "Musique", description: "Lecture de musique depuis YouTube, Spotify et plus.", icon: "Music", premium: false, enabled: true, category: "MUSIC" as const, pointCost: 2 },
      { moduleId: "tickets", name: "Tickets", description: "Système de tickets de support avec catégories.", icon: "Ticket", premium: false, enabled: true, category: "MANAGEMENT" as const, pointCost: 1 },
      { moduleId: "welcome", name: "Messages de bienvenue", description: "Messages personnalisés d'arrivée et de départ.", icon: "MessageSquare", premium: false, enabled: true, category: "UTILITY" as const, pointCost: 1 },
      { moduleId: "giveaway", name: "Giveaways", description: "Organisez des tirages au sort automatiques.", icon: "Crown", premium: true, enabled: true, category: "FUN" as const, pointCost: 2 },
    ];

    for (const mod of defaultModules) {
      await prisma.moduleDef.upsert({
        where: { moduleId: mod.moduleId },
        update: {
          name: mod.name,
          description: mod.description,
          icon: mod.icon,
          premium: mod.premium,
          enabled: mod.enabled,
          category: mod.category as "MANAGEMENT" | "MODERATION" | "UTILITY" | "FUN" | "ECONOMY" | "MUSIC" | "AI" | "WEB" | "CUSTOM",
          pointCost: mod.pointCost,
        },
        create: {
          moduleId: mod.moduleId,
          name: mod.name,
          description: mod.description,
          icon: mod.icon,
          premium: mod.premium,
          enabled: mod.enabled,
          category: mod.category as "MANAGEMENT" | "MODERATION" | "UTILITY" | "FUN" | "ECONOMY" | "MUSIC" | "AI" | "WEB" | "CUSTOM",
          pointCost: mod.pointCost,
        },
      });
    }

    return NextResponse.json({ success: true, count: defaultModules.length });
  } catch (error) {
    console.error("Erreur seed modules:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
