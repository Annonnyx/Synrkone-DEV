"""Template de commande Synkrone — copie-le pour démarrer une nouvelle commande.

Procédure :
  1. Copie ce dossier sous `commands/<module_reel>/<command_name>/`
     (ou directement comme `commands/<module>/<command_name>.py` + manifest).
  2. Renomme la classe `ExampleCommand` et le décorateur `@commands.command(name=...)`.
  3. Ajuste les permissions et les env vars.
  4. Mets à jour le manifest .json voisin.
  5. Lis `COMMAND_PROTOCOL.md` pour les règles complètes.

⚠️ Ce dossier est volontairement préfixé par `_` pour qu'aucun bot ne tente
de charger `commands._template.example` (les bots n'incluent pas `_template`
dans leur `bot.config.json`).
"""

from __future__ import annotations

import os

import discord
from discord.ext import commands


class ExampleCommand(commands.Cog):
    """Description un peu plus longue affichée dans /help (à terme)."""

    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot
        # Variables d'env du bot client : lues UNE FOIS au load.
        # Les valeurs viennent de `<bot_dir>/.enc`.
        self.example_channel_id = os.getenv("EXAMPLE_CHANNEL_ID")

    @commands.command(name="example")
    @commands.guild_only()
    @commands.has_permissions(manage_messages=True)
    @commands.bot_has_permissions(send_messages=True)
    async def example(self, ctx: commands.Context, *, arg: str = "") -> None:
        """Usage: !example <texte>"""
        if not arg:
            await ctx.reply("Usage : `!example <texte>`")
            return
        await ctx.reply(f"Tu as dit : **{arg}**")

    @example.error
    async def example_error(
        self, ctx: commands.Context, error: commands.CommandError
    ) -> None:
        if isinstance(error, commands.MissingPermissions):
            await ctx.reply("Tu n'as pas la permission requise.")
        elif isinstance(error, commands.BotMissingPermissions):
            await ctx.reply("Le bot n'a pas la permission requise (envoi de messages).")
        else:
            # Laisse remonter pour qu'on l'attrape côté logs PM2 plutôt que
            # de masquer un bug.
            raise error


async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(ExampleCommand(bot))
