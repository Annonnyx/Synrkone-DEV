import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/auth-guard";
import fs from "fs/promises";
import path from "path";

const STORAGE_ROOT = process.env.VPS_STORAGE_PATH ?? "/var/lib/synkrone/storage";

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

    // Dev voit uniquement sa box
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

// POST /api/boxes — Créer une box (dev+ uniquement, une par utilisateur)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  if (!hasRole(session.user.role, "DEV")) {
    return NextResponse.json({ error: "Rôle DEV requis" }, { status: 403 });
  }

  try {
    // Vérifier si l'utilisateur a déjà une box
    const existing = await prisma.box.findUnique({ where: { userId: session.user.id } });
    if (existing) return NextResponse.json({ error: "Vous avez déjà une box" }, { status: 400 });

    // Gérer le body vide (le front peut appeler sans body)
    let body: { name?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Body vide ou invalide — on utilise les valeurs par défaut
    }

    const name = body.name ?? `Box de ${session.user.name ?? "Utilisateur"}`;

    const boxPath = path.join(STORAGE_ROOT, "boxes", session.user.id);
    await fs.mkdir(boxPath, { recursive: true });

    const box = await prisma.box.create({
      data: {
        name,
        path: boxPath,
        userId: session.user.id,
      },
    });

    return NextResponse.json(box, { status: 201 });
  } catch (error) {
    console.error("Erreur création box:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/boxes — Supprimer une box (OWNER uniquement)
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  if (!hasRole(session.user.role, "OWNER")) {
    return NextResponse.json({ error: "Rôle OWNER requis" }, { status: 403 });
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
