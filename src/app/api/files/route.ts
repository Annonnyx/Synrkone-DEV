import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/auth-guard";
import { STORAGE_ROOT } from "@/lib/storage";
import fs from "fs/promises";
import path from "path";

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
      return NextResponse.json(files.map((f: { sizeBytes: bigint; [key: string]: unknown }) => ({ ...f, sizeBytes: Number(f.sizeBytes) })));
    }

    // Fichiers de box — accessibles selon permissions
    if (location === "BOX" && boxId) {
      // Vérifier que la box existe
      const box = await prisma.box.findUnique({
        where: { id: boxId },
        include: { user: true }
      });
      
      if (!box) {
        return NextResponse.json({ error: "Box introuvable" }, { status: 404 });
      }

      // Vérifier les permissions
      const isOwner = box.userId === session.user.id;
      const isAdmin = hasRole(userRole, "ADMIN");
      
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: "Accès non autorisé à cette box" }, { status: 403 });
      }

      const files = await prisma.file.findMany({
        where: { location: "BOX", boxId },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(files.map((f: { sizeBytes: bigint; [key: string]: unknown }) => ({ ...f, sizeBytes: Number(f.sizeBytes) })));
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
      return NextResponse.json(files.map((f: { sizeBytes: bigint; [key: string]: unknown }) => ({ ...f, sizeBytes: Number(f.sizeBytes) })));
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

    // Les utilisateurs de base ne peuvent pas uploader
    if (!hasRole(userRole, "DEV")) {
      return NextResponse.json({ error: "Rôle DEV requis pour importer des fichiers" }, { status: 403 });
    }

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

      // Vérifier le quota avant upload
      const usedStorage = await prisma.file.aggregate({
        where: { boxId },
        _sum: { sizeBytes: true },
      });
      const currentUsedBytes = Number(usedStorage._sum.sizeBytes ?? 0);
      const maxBytes = box.maxSizeMb * 1024 * 1024;
      if (currentUsedBytes + file.size > maxBytes) {
        return NextResponse.json(
          { error: `Quota dépassé : ${(currentUsedBytes / 1024 / 1024).toFixed(1)} Mo utilisés sur ${box.maxSizeMb} Mo` },
          { status: 400 }
        );
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

    return NextResponse.json({ ...dbFile, sizeBytes: Number(dbFile.sizeBytes) }, { status: 201 });
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
