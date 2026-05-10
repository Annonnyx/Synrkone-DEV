"""Ping command — utile pour vérifier qu'un bot tourne."""

from __future__ import annotations

from discord.ext import commands


class Ping(commands.Cog):
    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot

    @commands.command(name="ping")
    async def ping(self, ctx: commands.Context) -> None:
        latency_ms = round(self.bot.latency * 1000)
        await ctx.reply(f"Pong ! Latence WebSocket: `{latency_ms} ms`")


async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(Ping(bot))
