// Auto-discovery des commandes Python du bot via leur fichier manifest.json.
//
// Convention : chaque cog `commands/<categorie>/<nom>.py` a un voisin
// `commands/<categorie>/<nom>.manifest.json` qui décrit la commande pour
// le site (prix Kr, description, permissions, version, env vars). Le
// bot Python lui-même n'a PAS besoin du manifest pour tourner — c'est
// purement de la métadonnée pour le dashboard.
//
// Ce module est utilisé par /api/modules pour exposer la liste réelle
// des commandes disponibles, et par MODULE_TO_COGS pour générer le
// `bot.config.json["commands"]` quand un module est activé.

import fs from "fs/promises";
import path from "path";

const COMMANDS_DIR =
  process.env.SYNKRONE_COMMANDS_DIR ??
  path.join(process.cwd(), "synkrone-bot/commands");

export interface CommandPermission {
  user: string[];
  bot: string[];
}

export interface CommandEnvVar {
  name: string;
  description: string;
  required: boolean;
}

export interface CommandManifest {
  // Notation pointée `module.name` (correspond à bot.config.json["commands"]).
  id: string;
  name: string;
  description: string;
  category: string;
  module: string;
  priceKr: number;
  premium: boolean;
  usage: string;
  permissions: CommandPermission;
  envVars: CommandEnvVar[];
  version: string;
}

async function readJsonSafe<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function listDir(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

// Cache en mémoire — la liste des commandes ne change qu'au déploiement.
// Pour invalider en dev, redémarrer le serveur ou appeler invalidateCache().
let cache: { ts: number; manifests: CommandManifest[] } | null = null;
const CACHE_TTL_MS = 60_000;

export function invalidateCommandCache(): void {
  cache = null;
}

/**
 * Scanne `<COMMANDS_DIR>/<category>/<name>.manifest.json` pour toutes
 * les commandes disponibles. Une commande sans manifest est silencieusement
 * ignorée par le dashboard (mais peut quand même être chargée par le bot
 * si on l'écrit en dur dans bot.config.json).
 */
export async function loadCommandManifests(): Promise<CommandManifest[]> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
    return cache.manifests;
  }

  const manifests: CommandManifest[] = [];

  const categories = await listDir(COMMANDS_DIR);
  for (const category of categories) {
    if (
      category.startsWith(".") ||
      category.startsWith("_") ||
      category === "__pycache__"
    ) {
      continue;
    }

    const categoryDir = path.join(COMMANDS_DIR, category);
    const stat = await fs.stat(categoryDir).catch(() => null);
    if (!stat?.isDirectory()) continue;

    const files = await listDir(categoryDir);
    for (const file of files) {
      if (!file.endsWith(".manifest.json")) continue;
      const manifest = await readJsonSafe<CommandManifest>(
        path.join(categoryDir, file),
      );
      if (manifest && manifest.id) {
        manifests.push(manifest);
      }
    }
  }

  cache = { ts: Date.now(), manifests };
  return manifests;
}

/**
 * Retourne les commandes appartenant à un module donné (ex: "moderation").
 */
export async function commandsForModule(
  moduleId: string,
): Promise<CommandManifest[]> {
  const manifests = await loadCommandManifests();
  return manifests.filter((m) => m.module === moduleId);
}

/**
 * Retourne les IDs de Cogs (notation pointée) à charger pour ce module.
 * Remplacement dynamique de l'ancien mapping statique MODULE_TO_COGS.
 */
export async function cogsForModuleDynamic(
  moduleId: string,
): Promise<string[]> {
  const cmds = await commandsForModule(moduleId);
  return cmds.map((c) => c.id);
}

/**
 * Coût total Kr d'un module = somme des prix de ses commandes.
 * Permet à `pointCost` du ModuleDef d'être calculé dynamiquement plutôt
 * que codé en dur côté seed.
 */
export async function priceKrForModule(moduleId: string): Promise<number> {
  const cmds = await commandsForModule(moduleId);
  return cmds.reduce((sum, c) => sum + (c.priceKr ?? 0), 0);
}
