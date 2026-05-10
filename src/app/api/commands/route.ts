import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loadCommandManifests } from "@/lib/command-manifests";

// GET /api/commands — Liste les commandes Python disponibles via les
// fichiers manifest.json dans synkrone-bot/commands/. C'est la source
// canonique pour le dashboard (description, prix Kr, permissions Discord
// requises, env vars facultatives).
//
// `?module=<id>` filtre sur un moduleId donné.
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const moduleFilter = searchParams.get("module");

    const manifests = await loadCommandManifests();
    const filtered = moduleFilter
      ? manifests.filter((m) => m.module === moduleFilter)
      : manifests;

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Erreur commandes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
