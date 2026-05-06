import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

const STORAGE_ROOT = process.env.VPS_STORAGE_PATH ?? "/var/lib/synkrone/storage";
const BOT_TEMPLATES = process.env.BOT_TEMPLATES_PATH ?? "/var/lib/synkrone/templates/bot";

function generateIndexJs(botName: string): string {
  return [
    "// " + botName + " - Bot Discord genere par Synkrone",
    "const { Client, GatewayIntentBits } = require('discord.js');",
    "const fs = require('fs');",
    "const path = require('path');",
    "",
    "const config = require('./config.json');",
    "",
    "const client = new Client({",
    "  intents: [",
    "    GatewayIntentBits.Guilds,",
    "    GatewayIntentBits.GuildMessages,",
    "    GatewayIntentBits.MessageContent,",
    "    GatewayIntentBits.GuildMembers,",
    "  ],",
    "});",
    "",
    "// Charger les commandes",
    "client.commands = new Map();",
    "const commandsPath = path.join(__dirname, 'commands');",
    "if (fs.existsSync(commandsPath)) {",
    "  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));",
    "  for (const file of commandFiles) {",
    "    const command = require(path.join(commandsPath, file));",
    "    if (command.name) client.commands.set(command.name, command);",
    "  }",
    "}",
    "",
    "// Charger les evenements",
    "const eventsPath = path.join(__dirname, 'events');",
    "if (fs.existsSync(eventsPath)) {",
    "  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));",
    "  for (const file of eventFiles) {",
    "    const event = require(path.join(eventsPath, file));",
    "    if (event.name) client.on(event.name, (...args) => event.execute(...args, client));",
    "  }",
    "}",
    "",
    "// Evenement ready",
    "client.once('ready', () => {",
    "  console.log(client.user.tag + ' est en ligne !');",
    "});",
    "",
    "// Gestion des messages (prefixe)",
    "client.on('messageCreate', (message) => {",
    "  if (!message.content.startsWith(config.prefix) || message.author.bot) return;",
    "  const args = message.content.slice(config.prefix.length).trim().split(/ +/);",
    "  const commandName = args.shift().toLowerCase();",
    "  const command = client.commands.get(commandName);",
    "  if (command) command.execute(message, args, client);",
    "});",
    "",
    "// Gestion des /commandes",
    "if (config.useSlashCommands) {",
    "  client.on('interactionCreate', async (interaction) => {",
    "    if (!interaction.isChatInputCommand()) return;",
    "    const command = client.commands.get(interaction.commandName);",
    "    if (command) command.execute(interaction, [], client);",
    "  });",
    "}",
    "",
    "client.login(config.token);",
  ].join("\n");
}

function generateReadyEvent(): string {
  return [
    "module.exports = {",
    "  name: 'ready',",
    "  execute(client) {",
    "    console.log(client.user.tag + ' est connecte !');",
    "  },",
    "};",
  ].join("\n");
}

// GET /api/bot — Récupère le bot de l'utilisateur
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const bot = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
      include: {
        modules: {
          include: { module: true },
        },
        stats: true,
      },
    });

    if (!bot) {
      return NextResponse.json(null);
    }

    return NextResponse.json(bot);
  } catch (error) {
    console.error("Erreur bot:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/bot — Crée un nouveau bot
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { name, token, hosting, prefix, useSlashCommands } = body;

    if (!name) {
      return NextResponse.json({ error: "Nom du projet requis" }, { status: 400 });
    }

    // Vérifier si l'utilisateur a déjà un bot
    const existing = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
    });

    if (existing) {
      return NextResponse.json({ error: "Vous avez déjà un bot" }, { status: 400 });
    }

    // Créer le bot dans la DB
    const bot = await prisma.bot.create({
      data: {
        name,
        token: token || null,
        hosting: hosting || "synkrone",
        prefix: prefix || null,
        useSlashCommands: useSlashCommands || false,
        ownerId: session.user.id,
        maxKr: 30,
        usedKr: 0,
      },
    });

    // Créer les stats initiales
    await prisma.botStats.create({
      data: {
        botId: bot.id,
        servers: 0,
        users: 0,
        commandsToday: 0,
        totalCommands: 0,
        uptime: "0%",
        latency: "0ms",
        memory: "0 MB",
        cpu: "0%",
        messagesProcessed: 0,
        errors: 0,
        lastRestart: "Jamais",
        topCommands: JSON.stringify([]),
        dailyActivity: JSON.stringify([]),
      },
    });

    // Initialiser tous les modules comme désactivés
    const allModules = await prisma.moduleDef.findMany();
    for (const mod of allModules) {
      await prisma.moduleInstance.create({
        data: {
          moduleId: mod.id,
          botId: bot.id,
          enabled: false,
        },
      });
    }

    // Créer l'architecture du bot sur le VPS
    try {
      const botDir = path.join(STORAGE_ROOT, "bots", bot.id);
      const commandsDir = path.join(botDir, "commands");
      const modulesDir = path.join(botDir, "modules");
      const eventsDir = path.join(botDir, "events");

      // Créer les dossiers
      await fs.mkdir(commandsDir, { recursive: true });
      await fs.mkdir(modulesDir, { recursive: true });
      await fs.mkdir(eventsDir, { recursive: true });

      // Copier les fichiers de base depuis les templates
      try {
        const templateFiles = await fs.readdir(BOT_TEMPLATES);
        for (const file of templateFiles) {
          const src = path.join(BOT_TEMPLATES, file);
          const dest = path.join(botDir, file);
          const stat = await fs.stat(src);
          if (stat.isFile()) {
            await fs.copyFile(src, dest);
          }
        }
      } catch {
        // Pas de templates trouvés, on crée les fichiers de base
      }

      // config.json
      const configContent = JSON.stringify({
        name: name,
        prefix: prefix || "!",
        useSlashCommands: useSlashCommands || false,
        token: token || "YOUR_BOT_TOKEN_HERE",
        ownerId: session.user.id,
        createdAt: new Date().toISOString(),
      }, null, 2);
      await fs.writeFile(path.join(botDir, "config.json"), configContent);

      // index.js
      await fs.writeFile(path.join(botDir, "index.js"), generateIndexJs(name));

      // events/ready.js
      await fs.writeFile(path.join(eventsDir, "ready.js"), generateReadyEvent());

      // Enregistrer les fichiers du bot dans la DB
      const botFiles = [
        { name: "index.js", mimeType: "application/javascript", filePath: path.join(botDir, "index.js") },
        { name: "config.json", mimeType: "application/json", filePath: path.join(botDir, "config.json") },
        { name: "ready.js", mimeType: "application/javascript", filePath: path.join(eventsDir, "ready.js") },
      ];
      for (const bf of botFiles) {
        const stat = await fs.stat(bf.filePath);
        await prisma.file.create({
          data: {
            name: bf.name,
            path: bf.filePath,
            mimeType: bf.mimeType,
            sizeBytes: BigInt(stat.size),
            location: "PROJECT",
            uploaderId: session.user.id,
          },
        });
      }
    } catch (fsError) {
      console.error("Erreur creation fichiers bot (non bloquant):", fsError);
    }

    return NextResponse.json(bot, { status: 201 });
  } catch (error) {
    console.error("Erreur creation bot:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/bot — Met à jour le bot
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { name, token, hosting, status, prefix, useSlashCommands } = body;

    const bot = await prisma.bot.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!bot) {
      return NextResponse.json({ error: "Bot non trouvé" }, { status: 404 });
    }

    const updated = await prisma.bot.update({
      where: { id: bot.id },
      data: {
        ...(name !== undefined && { name }),
        ...(token !== undefined && { token }),
        ...(hosting !== undefined && { hosting }),
        ...(status !== undefined && { status }),
        ...(prefix !== undefined && { prefix }),
        ...(useSlashCommands !== undefined && { useSlashCommands }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur update bot:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
