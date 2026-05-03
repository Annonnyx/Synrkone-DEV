import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/auth-guard";
import fs from "fs/promises";

// GET /api/files/[id]/download — Télécharger un fichier
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  try {
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });

    // Vérifier les permissions
    if (file.location === "BOX") {
      const box = await prisma.box.findUnique({ where: { id: file.boxId! } });
      if (box?.userId !== session.user.id && !hasRole(session.user.role, "ADMIN")) {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
      }
    } else if (file.location === "VPS_ROOT" && !hasRole(session.user.role, "ADMIN")) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Lire le fichier du disque
    const buffer = await fs.readFile(file.path);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Disposition": `attachment; filename="${file.name}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Erreur download:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
