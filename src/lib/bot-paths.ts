// Source of truth for the on-disk bot deployment layout.
//
// Each bot lives in /bots/<dirName>/ on the VPS. The directory name is
// deterministic (sanitized bot name + short id suffix) so the API and the
// new_bot.sh script agree on where to look for a bot's files.
import path from "path";

export const BOTS_ROOT = process.env.BOTS_ROOT_PATH ?? "/bots";

export const SHARED_ROOT =
  process.env.SYNKRONE_SHARED_ROOT ?? "/Partage/Synkrone";

export const VENV_PYTHON =
  process.env.SYNKRONE_VENV_PYTHON ?? path.join(SHARED_ROOT, ".venv/bin/python");

export const LOG_DIR = process.env.SYNKRONE_LOG_DIR ?? "/var/log/synkrone";

export const BOT_TEMPLATE_DIR =
  process.env.SYNKRONE_BOT_TEMPLATE ??
  path.join(process.cwd(), "synkrone-bot/bots/client_example");

export interface BotIdentity {
  id: string;
  // `name` est dispo si tu veux logger un nom lisible mais n'entre pas dans
  // les chemins/process : on dérive tout de l'`id` pour rester stable même si
  // l'utilisateur renomme son bot après coup.
  name?: string;
}

export function botDirName(bot: BotIdentity): string {
  return `synkrone_${bot.id}`;
}

export function botDir(bot: BotIdentity): string {
  return path.join(BOTS_ROOT, botDirName(bot));
}

export function botPm2Name(bot: BotIdentity): string {
  return botDirName(bot);
}
