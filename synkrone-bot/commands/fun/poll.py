"""Poll command — crée un sondage simple à partir de réactions emoji."""

from __future__ import annotations

import discord
from discord.ext import commands

NUMBER_EMOJI = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]


class Poll(commands.Cog):
    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot

    @commands.command(name="poll")
    @commands.guild_only()
    async def poll(self, ctx: commands.Context, question: str, *options: str) -> None:
        """Usage: !poll "Question ?" "Option 1" "Option 2" ... (max 10 options)"""
        if len(options) < 2:
            await ctx.reply("Il faut au moins 2 options. Mets-les entre guillemets.")
            return
        if len(options) > 10:
            await ctx.reply("Maximum 10 options.")
            return

        description = "\n".join(
            f"{NUMBER_EMOJI[i]} {opt}" for i, opt in enumerate(options)
        )
        embed = discord.Embed(
            title=question,
            description=description,
            color=discord.Color.blurple(),
        )
        author = ctx.author
        embed.set_footer(text=f"Sondage par {author}")

        message = await ctx.send(embed=embed)
        for i in range(len(options)):
            await message.add_reaction(NUMBER_EMOJI[i])


async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(Poll(bot))
