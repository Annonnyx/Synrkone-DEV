"""
Synkrone Discord bot template.

Loads configuration from `bot.config.json` (next to this file) and the bot
token / settings from `.enc` (a dotenv file). Cogs are imported by name from
the shared commands directory at /Partage/Synkrone/commands/, so every bot on
the VPS shares the same Python venv and the same command pool.

Run via PM2 with /Partage/Synkrone/.venv/bin/python (see ecosystem.config.js).
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import sys
from pathlib import Path

import discord
from discord.ext import commands
from dotenv import load_dotenv

BOT_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BOT_DIR / "bot.config.json"
ENV_PATH = BOT_DIR / ".enc"

SHARED_ROOT = Path(os.getenv("SYNKRONE_SHARED_ROOT", "/Partage/Synkrone"))
COMMANDS_ROOT = SHARED_ROOT / "commands"

# Make the shared commands tree importable as `commands.<category>.<name>`.
if str(SHARED_ROOT) not in sys.path:
    sys.path.insert(0, str(SHARED_ROOT))

load_dotenv(ENV_PATH)

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
log = logging.getLogger("synkrone.bot")


def load_config() -> dict:
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(f"bot.config.json introuvable: {CONFIG_PATH}")
    with CONFIG_PATH.open(encoding="utf-8") as f:
        return json.load(f)


def build_intents(config: dict) -> discord.Intents:
    requested = set(config.get("intents") or ["default"])
    intents = discord.Intents.default()
    if "members" in requested:
        intents.members = True
    if "message_content" in requested:
        intents.message_content = True
    if "presences" in requested:
        intents.presences = True
    return intents


async def load_command_modules(bot: commands.Bot, command_names: list[str]) -> None:
    """Load each `category.name` Cog from the shared commands tree."""
    for entry in command_names:
        module_path = f"commands.{entry}"
        try:
            await bot.load_extension(module_path)
            log.info("Loaded command: %s", module_path)
        except Exception:  # noqa: BLE001 — keep the bot alive on a broken cog
            log.exception("Failed to load command: %s", module_path)


def main() -> None:
    config = load_config()
    token = os.getenv("BOT_TOKEN")
    if not token:
        raise RuntimeError(
            "BOT_TOKEN manquant. Renseigne-le dans .enc à côté de main.py."
        )

    prefix = os.getenv("PREFIX") or config.get("prefix", "!")
    intents = build_intents(config)

    bot = commands.Bot(
        command_prefix=prefix,
        intents=intents,
        help_command=None,
    )

    @bot.event
    async def on_ready() -> None:
        log.info("Connecté en tant que %s (id=%s)", bot.user, bot.user.id if bot.user else "?")

    async def runner() -> None:
        async with bot:
            await load_command_modules(bot, config.get("commands", []))
            await bot.start(token)

    asyncio.run(runner())


if __name__ == "__main__":
    main()
