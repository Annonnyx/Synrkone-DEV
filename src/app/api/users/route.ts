import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/auth-guard";

// GET /api/users — Liste les utilisateurs (ADMIN+ uniquement)
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  if (!hasRole(session.user.role, "ADMIN")) {
    return NextResponse.json({ error: "Rôle ADMIN requis" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const withoutBox = searchParams.get("withoutBox") === "true";

    let users;
    if (withoutBox) {
      // Récupérer les utilisateurs qui n'ont pas de box
      users = await prisma.user.findMany({
        where: {
          box: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Récupérer tous les utilisateurs
      users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Erreur utilisateurs:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
