import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/auth-guard";
import fs from "fs/promises";
import path from "path";

const STORAGE_ROOT = process.env.VPS_STORAGE_PATH ?? "/var/lib/synkrone/storage";

// GET /api/files — Liste les fichiers accessibles selon le rôle
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location") ?? "PROJECT";
  const boxId = searchParams.get("boxId");

  const userRole = session.user.role;

  try {
    // Fichiers du projet — accessibles à tous les utilisateurs connectés
    if (location === "PROJECT") {
      const files = await prisma.file.findMany({
        where: { location: "PROJECT" },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(files);
    }

    // Fichiers d'une box spécifique
    if (location === "BOX" && boxId) {
      const box = await prisma.box.findUnique({ where: { id: boxId } });
      if (!box) return NextResponse.json({ error: "Box introuvable" }, { status: 404 });

      // Le propriétaire peut voir sa box, admin/owner voient toutes les boxes
      if (box.userId !== session.user.id && !hasRole(userRole, "ADMIN")) {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
      }

      const files = await prisma.file.findMany({
        where: { boxId, location: "BOX" },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(files);
    }

    // Fichiers racine du VPS — admin/owner uniquement
    if (location === "VPS_ROOT") {
      if (!hasRole(userRole, "ADMIN")) {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
      }

      const files = await prisma.file.findMany({
        where: { location: "VPS_ROOT" },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(files);
    }

    return NextResponse.json({ error: "Location invalide" }, { status: 400 });
  } catch (error) {
    console.error("Erreur fichiers:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/files — Upload un fichier
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userRole = session.user.role;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const location = (formData.get("location") as string) ?? "PROJECT";
    const boxId = formData.get("boxId") as string | null;

    if (!file) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });

    // Vérification des permissions
    if (location === "BOX" && !hasRole(userRole, "DEV")) {
      return NextResponse.json({ error: "Accès refusé — rôle DEV requis" }, { status: 403 });
    }
    if (location === "VPS_ROOT" && !hasRole(userRole, "OWNER")) {
      return NextResponse.json({ error: "Accès refusé — rôle OWNER requis" }, { status: 403 });
    }

    // Déterminer le chemin de stockage
    let dirPath: string;
    if (location === "BOX" && boxId) {
      const box = await prisma.box.findUnique({ where: { id: boxId } });
      if (!box) return NextResponse.json({ error: "Box introuvable" }, { status: 404 });
      if (box.userId !== session.user.id && !hasRole(userRole, "ADMIN")) {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
      }
      dirPath = box.path;
    } else if (location === "VPS_ROOT") {
      dirPath = path.join(STORAGE_ROOT, "vps-root");
    } else {
      dirPath = path.join(STORAGE_ROOT, "projects");
    }

    // Créer le dossier si nécessaire
    await fs.mkdir(dirPath, { recursive: true });

    // Sauvegarder le fichier
    const filePath = path.join(dirPath, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Enregistrer dans la DB
    const dbFile = await prisma.file.create({
      data: {
        name: file.name,
        path: filePath,
        mimeType: file.type,
        sizeBytes: BigInt(file.size),
        location: location as "PROJECT" | "BOX" | "VPS_ROOT",
        uploaderId: session.user.id,
        boxId: location === "BOX" ? boxId : null,
      },
    });

    return NextResponse.json(dbFile, { status: 201 });
  } catch (error) {
    console.error("Erreur upload:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/files — Supprimer un fichier
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userRole = session.user.role;

  try {
    const { id } = await request.json();
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });

    // Seul le propriétaire ou OWNER peut supprimer
    if (file.uploaderId !== session.user.id && !hasRole(userRole, "OWNER")) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Supprimer du disque
    try {
      await fs.unlink(file.path);
    } catch {
      // Fichier déjà absent du disque, on continue la suppression DB
    }

    await prisma.file.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
