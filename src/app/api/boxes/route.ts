import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/auth-guard";
import { STORAGE_ROOT } from "@/lib/storage";
import fs from "fs/promises";
import path from "path";

// GET /api/boxes — Liste les boxes (la sienne pour dev+, toutes pour admin+)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userRole = session.user.role;

  try {
    // Admin/Owner voient toutes les boxes
    if (hasRole(userRole, "ADMIN")) {
      const boxes = await prisma.box.findMany({
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          files: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(boxes);
    }

    // Dev voit sa box
    if (hasRole(userRole, "DEV")) {
      const box = await prisma.box.findUnique({
        where: { userId: session.user.id },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          files: true,
        },
      });
      return NextResponse.json(box ? [box] : []);
    }

    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  } catch (error) {
    console.error("Erreur boxes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Limites de boxes par rôle.
//
// Le schéma Prisma impose `userId @unique` sur Box, donc maxBoxes vaut
// toujours 1 quel que soit le rôle — sinon la 2e création lève une erreur
// de contrainte unique au lieu d'un message clair. Les ADMIN/OWNER peuvent
// créer des boxes pour d'autres utilisateurs (1 par utilisateur cible).
function getBoxLimits(role: string) {
  switch (role) {
    case "DEV":
      return { maxBoxes: 1, defaultSizeMb: 500, maxSizeMb: 1000 };
    case "ADMIN":
      return { maxBoxes: 1, defaultSizeMb: 1000, maxSizeMb: 5000 };
    case "OWNER":
      return { maxBoxes: 1, defaultSizeMb: 2000, maxSizeMb: 10000 };
    default:
      return { maxBoxes: 0, defaultSizeMb: 0, maxSizeMb: 0 };
  }
}

// POST /api/boxes — Créer une box (dev+ pour soi-même, admin+ pour n'importe qui)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    // Gérer le body
    let body: { name?: string; userId?: string; maxSizeMb?: number } = {};
    try {
      body = await request.json();
    } catch {
      // Body vide ou invalide — on utilise les valeurs par défaut
    }

    let targetUserId = session.user.id;
    let isAdminCreating = false;
    const userRole = session.user.role;

    // Admin peut créer une box pour un autre utilisateur
    if (hasRole(userRole, "ADMIN") && body.userId) {
      targetUserId = body.userId;
      isAdminCreating = true;
      
      // Vérifier que l'utilisateur cible existe
      const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
      if (!targetUser) {
        return NextResponse.json({ error: "Utilisateur cible introuvable" }, { status: 404 });
      }
    } else if (!hasRole(userRole, "DEV")) {
      return NextResponse.json({ error: "Rôle DEV requis" }, { status: 403 });
    }

    // Vérifier les limites de boxes pour l'utilisateur cible
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return NextResponse.json({ error: "Utilisateur cible introuvable" }, { status: 404 });
    }

    const limits = getBoxLimits(targetUser.role);
    
    // Compter les boxes existantes pour cet utilisateur
    const existingBoxes = await prisma.box.count({ where: { userId: targetUserId } });
    
    if (existingBoxes >= limits.maxBoxes) {
      return NextResponse.json({ 
        error: isAdminCreating 
          ? `Cet utilisateur a atteint sa limite de ${limits.maxBoxes} box(s)` 
          : `Vous avez atteint votre limite de ${limits.maxBoxes} box(s)` 
      }, { status: 400 });
    }

    // Vérifier la taille demandée
    const requestedSize = body.maxSizeMb ?? limits.defaultSizeMb;
    if (requestedSize > limits.maxSizeMb) {
      return NextResponse.json({ 
        error: `Taille maximale autorisée : ${limits.maxSizeMb} Mo` 
      }, { status: 400 });
    }

    const name = body.name ?? `Box de ${targetUser.name ?? "Utilisateur"}`;

    const boxPath = path.join(STORAGE_ROOT, "boxes", targetUserId);
    await fs.mkdir(boxPath, { recursive: true });

    const box = await prisma.box.create({
      data: {
        name,
        path: boxPath,
        userId: targetUserId,
        maxSizeMb: requestedSize,
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return NextResponse.json(box, { status: 201 });
  } catch (error) {
    console.error("Erreur création box:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/boxes — Modifier une box (taille, etc.) (ADMIN+ uniquement)
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  if (!hasRole(session.user.role, "ADMIN")) {
    return NextResponse.json({ error: "Rôle ADMIN requis" }, { status: 403 });
  }

  try {
    const { id, maxSizeMb } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: "ID de box requis" }, { status: 400 });
    }

    const box = await prisma.box.findUnique({ where: { id } });
    if (!box) return NextResponse.json({ error: "Box introuvable" }, { status: 404 });

    // Vérifier les limites de taille pour le propriétaire de la box
    const boxOwner = await prisma.user.findUnique({ where: { id: box.userId } });
    if (!boxOwner) {
      return NextResponse.json({ error: "Propriétaire introuvable" }, { status: 404 });
    }

    const limits = getBoxLimits(boxOwner.role);
    
    if (maxSizeMb && maxSizeMb > limits.maxSizeMb) {
      return NextResponse.json({ 
        error: `Taille maximale autorisée pour ce rôle : ${limits.maxSizeMb} Mo` 
      }, { status: 400 });
    }

    // Vérifier l'espace utilisé actuel
    const usedSpace = await prisma.file.aggregate({
      where: { boxId: id },
      _sum: { sizeBytes: true }
    });

    const usedSpaceMb = Number(usedSpace._sum.sizeBytes || 0) / (1024 * 1024);
    
    if (maxSizeMb && maxSizeMb < usedSpaceMb) {
      return NextResponse.json({ 
        error: `Impossible de réduire la taille en dessous de l'espace utilisé (${usedSpaceMb.toFixed(1)} Mo)` 
      }, { status: 400 });
    }

    const updatedBox = await prisma.box.update({
      where: { id },
      data: { maxSizeMb },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        files: true,
      },
    });

    return NextResponse.json(updatedBox);
  } catch (error) {
    console.error("Erreur modification box:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/boxes — Supprimer une box (ADMIN+ pour n'importe qui, OWNER pour la sienne)
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  if (!hasRole(session.user.role, "ADMIN")) {
    return NextResponse.json({ error: "Rôle ADMIN requis" }, { status: 403 });
  }

  try {
    const { id } = await request.json();
    const box = await prisma.box.findUnique({ where: { id } });
    if (!box) return NextResponse.json({ error: "Box introuvable" }, { status: 404 });

    // Supprimer les fichiers du disque
    try {
      await fs.rm(box.path, { recursive: true, force: true });
    } catch {
      // Dossier déjà absent
    }

    // Supprimer la box et ses fichiers de la DB
    await prisma.file.deleteMany({ where: { boxId: id } });
    await prisma.box.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression box:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
