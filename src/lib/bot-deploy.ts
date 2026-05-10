// Service qui matérialise un bot Discord Python sur disque + PM2.
//
// Ce module contient TOUTE la logique fs / pm2. Les routes API ne savent rien
// des chemins, des arguments PM2, ou du format de bot.config.json — elles
// appellent juste les fonctions exportées ici.
//
// Comportement en dev / CI : si /bots/ n'existe pas, ou si pm2 n'est pas
// installé, on log et on retourne sans erreur. Le bot existe en DB mais pas
// sur le filesystem — c'est attendu (les tests Vercel preview / CI n'ont
// pas l'infra VPS).
import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";

import { cogsForModule } from "@/lib/module-cogs";
import {
  BOT_TEMPLATE_DIR,
  BOTS_ROOT,
  LOG_DIR,
  SHARED_ROOT,
  VENV_PYTHON,
  type BotIdentity,
  botDir,
  botPm2Name,
} from "@/lib/bot-paths";

interface ModuleInstanceLike {
  enabled: boolean;
  module: { moduleId: string };
}

interface BotCommandLike {
  enabled: boolean;
  commandId: string;
  priceKr?: number;
}

export interface ProvisionInput {
  bot: BotIdentity;
  prefix?: string | null;
  token?: string | null;
  modules: ModuleInstanceLike[];
  commands?: BotCommandLike[];
}

export interface UpdateConfigInput {
  bot: BotIdentity;
  prefix?: string | null;
  modules: ModuleInstanceLike[];
  commands?: BotCommandLike[];
}

function buildCommandList(
  modules: ModuleInstanceLike[],
  commands?: BotCommandLike[],
): string[] {
  const out = new Set<string>();

  if (commands && commands.length > 0) {
    // Mode "commande par commande" — on filtre sur BotCommand.enabled
    for (const cmd of commands) {
      if (cmd.enabled) {
        out.add(cmd.commandId);
      }
    }
  } else {
    // Fallback legacy : filtre sur ModuleInstance.enabled
    for (const inst of modules) {
      if (!inst.enabled) continue;
      for (const cog of cogsForModule(inst.module.moduleId)) {
        out.add(cog);
      }
    }
  }

  // Toujours inclure ping pour qu'un bot fraîchement provisionné réponde.
  out.add("utility.ping");
  return [...out];
}

function buildBotConfig(input: ProvisionInput | UpdateConfigInput) {
  return {
    name: input.bot.name ?? input.bot.id,
    prefix: input.prefix ?? "!",
    intents: ["default", "members", "message_content"],
    commands: buildCommandList(input.modules, input.commands),
  };
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function writeEnc(filePath: string, token: string | null | undefined): Promise<void> {
  // .enc ne contient QUE les secrets / IDs spécifiques au bot. Le préfix
  // vit dans bot.config.json (source de vérité côté API). Si on écrivait
  // PREFIX=! ici, cela primerait sur bot.config.json (cf. main.py qui fait
  // `os.getenv("PREFIX") or config.get("prefix")`) et le changement de
  // préfix depuis le dashboard serait silencieusement ignoré.
  const lines = [
    `BOT_TOKEN=${token ?? "replace_with_real_token"}`,
    "LOG_LEVEL=INFO",
    "GUILD_ID=",
    "MOD_LOG_CHANNEL_ID=",
  ];
  await fs.writeFile(filePath, lines.join("\n") + "\n", { mode: 0o600 });
  // chmod explicite au cas où l'umask masque le mode passé à writeFile.
  await fs.chmod(filePath, 0o600);
}

async function copyTemplateMainPy(destDir: string): Promise<void> {
  const src = path.join(BOT_TEMPLATE_DIR, "main.py");
  if (!(await pathExists(src))) {
    throw new Error(`Template main.py introuvable: ${src}`);
  }
  await fs.copyFile(src, path.join(destDir, "main.py"));
}

interface ProcResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

function runCommand(cmd: string, args: string[]): Promise<ProcResult> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    child.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    child.on("close", (code) => resolve({ code, stdout, stderr }));
    child.on("error", () => resolve({ code: -1, stdout, stderr: stderr || "spawn error" }));
  });
}

async function pm2Available(): Promise<boolean> {
  const res = await runCommand("pm2", ["--version"]);
  return res.code === 0;
}

async function pm2Process(name: string): Promise<"online" | "stopped" | "missing"> {
  const res = await runCommand("pm2", ["jlist"]);
  if (res.code !== 0) return "missing";
  try {
    const list = JSON.parse(res.stdout) as Array<{
      name: string;
      pm2_env?: { status?: string };
    }>;
    const found = list.find((p) => p.name === name);
    if (!found) return "missing";
    return found.pm2_env?.status === "online" ? "online" : "stopped";
  } catch {
    return "missing";
  }
}

async function pm2StartFresh(input: ProvisionInput): Promise<void> {
  const dir = botDir(input.bot);
  const name = botPm2Name(input.bot);
  const args = [
    "start",
    path.join(dir, "main.py"),
    "--name",
    name,
    "--interpreter",
    VENV_PYTHON,
    "--cwd",
    dir,
    "--output",
    path.join(LOG_DIR, `${name}.out.log`),
    "--error",
    path.join(LOG_DIR, `${name}.err.log`),
    "--merge-logs",
    "--time",
    "--update-env",
    "--env",
    `SYNKRONE_SHARED_ROOT=${SHARED_ROOT}`,
    "--env",
    "PYTHONUNBUFFERED=1",
  ];
  const res = await runCommand("pm2", args);
  if (res.code !== 0) {
    throw new Error(`pm2 start a échoué (code ${res.code}): ${res.stderr || res.stdout}`);
  }
  await runCommand("pm2", ["save"]);
}

export interface DeployResult {
  ok: boolean;
  reason?: "skipped_no_bots_root" | "skipped_no_pm2";
  error?: string;
}

export async function provisionBot(input: ProvisionInput): Promise<DeployResult> {
  if (!(await pathExists(BOTS_ROOT))) {
    return { ok: true, reason: "skipped_no_bots_root" };
  }

  const dir = botDir(input.bot);
  await fs.mkdir(dir, { recursive: true });
  await fs.mkdir(LOG_DIR, { recursive: true }).catch(() => {});

  await copyTemplateMainPy(dir);

  const config = buildBotConfig(input);
  await fs.writeFile(
    path.join(dir, "bot.config.json"),
    JSON.stringify(config, null, 2) + "\n",
    "utf8",
  );

  await writeEnc(path.join(dir, ".enc"), input.token);

  if (!(await pm2Available())) {
    return { ok: true, reason: "skipped_no_pm2" };
  }

  try {
    await pm2StartFresh(input);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateBotConfig(input: UpdateConfigInput): Promise<DeployResult> {
  const dir = botDir(input.bot);
  if (!(await pathExists(dir))) {
    return { ok: true, reason: "skipped_no_bots_root" };
  }

  const config = buildBotConfig(input);
  await fs.writeFile(
    path.join(dir, "bot.config.json"),
    JSON.stringify(config, null, 2) + "\n",
    "utf8",
  );

  return restartBot(input.bot);
}

export async function updateBotToken(
  bot: BotIdentity,
  token: string | null | undefined,
): Promise<DeployResult> {
  const dir = botDir(bot);
  if (!(await pathExists(dir))) {
    return { ok: true, reason: "skipped_no_bots_root" };
  }
  await writeEnc(path.join(dir, ".enc"), token);
  return restartBot(bot);
}

async function pm2Action(
  bot: BotIdentity,
  action: "start" | "stop" | "restart",
): Promise<DeployResult> {
  if (!(await pm2Available())) {
    return { ok: true, reason: "skipped_no_pm2" };
  }
  const name = botPm2Name(bot);
  const status = await pm2Process(name);
  if (status === "missing" && action === "start") {
    return { ok: false, error: `Process PM2 ${name} introuvable. Recrée le bot.` };
  }
  if (status === "missing") {
    return { ok: true };
  }
  const res = await runCommand("pm2", [action, name]);
  if (res.code !== 0) {
    return { ok: false, error: `pm2 ${action} ${name} a échoué: ${res.stderr || res.stdout}` };
  }
  return { ok: true };
}

export function startBot(bot: BotIdentity): Promise<DeployResult> {
  return pm2Action(bot, "start");
}

export function stopBot(bot: BotIdentity): Promise<DeployResult> {
  return pm2Action(bot, "stop");
}

export function restartBot(bot: BotIdentity): Promise<DeployResult> {
  return pm2Action(bot, "restart");
}

export async function removeBot(bot: BotIdentity): Promise<DeployResult> {
  const dir = botDir(bot);

  if (await pm2Available()) {
    const name = botPm2Name(bot);
    if ((await pm2Process(name)) !== "missing") {
      await runCommand("pm2", ["delete", name]);
      await runCommand("pm2", ["save"]);
    }
  }

  if (await pathExists(dir)) {
    await fs.rm(dir, { recursive: true, force: true });
  }

  return { ok: true };
}
