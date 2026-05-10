"""Ban command — partagée. Aucune donnée client n'est codée en dur ici."""

from __future__ import annotations

import os

import discord
from discord.ext import commands


class Ban(commands.Cog):
    """Bannit un membre du serveur. Permission Discord requise: ban_members."""

    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot
        # ID du salon de logs lu via env, jamais hardcodé.
        log_id = os.getenv("MOD_LOG_CHANNEL_ID")
        self.mod_log_id = int(log_id) if log_id and log_id.isdigit() else None

    @commands.command(name="ban")
    @commands.guild_only()
    @commands.has_permissions(ban_members=True)
    @commands.bot_has_permissions(ban_members=True)
    async def ban(
        self,
        ctx: commands.Context,
        member: discord.Member,
        *,
        reason: str = "Aucune raison fournie",
    ) -> None:
        if member == ctx.author:
            await ctx.reply("Tu ne peux pas te bannir toi-même.")
            return
        if isinstance(ctx.author, discord.Member) and member.top_role >= ctx.author.top_role:
            await ctx.reply("Tu ne peux pas bannir un membre de rôle égal ou supérieur.")
            return

        await member.ban(reason=f"{ctx.author} → {reason}", delete_message_days=0)
        await ctx.reply(f"`{member}` a été banni. Raison: {reason}")

        if self.mod_log_id:
            channel = ctx.guild.get_channel(self.mod_log_id) if ctx.guild else None
            if isinstance(channel, discord.TextChannel):
                await channel.send(
                    f"🔨 **Ban** — {member} ({member.id}) par {ctx.author}\n> {reason}"
                )

    @ban.error
    async def ban_error(self, ctx: commands.Context, error: commands.CommandError) -> None:
        if isinstance(error, commands.MissingPermissions):
            await ctx.reply("Tu n'as pas la permission de bannir.")
        elif isinstance(error, commands.BotMissingPermissions):
            await ctx.reply("Le bot n'a pas la permission de bannir.")
        elif isinstance(error, commands.MemberNotFound):
            await ctx.reply("Membre introuvable.")
        else:
            raise error


async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(Ban(bot))
