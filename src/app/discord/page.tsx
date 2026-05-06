"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bot, MessageCircle, Sparkles, ChevronLeft, ChevronRight, Zap, Shield, Gamepad2, Wrench, Crown } from "lucide-react";

const bots = [
  {
    name: "Vex",
    tag: "Multifonction",
    description: "Le bot principal de Synkrone. Modération, utilitaires, économie et plus encore. Votre allié indispensable sur Discord.",
    avatar: "/bots/vax.png",
    href: "https://discord.com/oauth2/authorize?client_id=1368234765638963261",
    support: "https://discord.gg/p768u2Pgp3",
    vote: "https://top.gg/fr/bot/1367891720871874560",
    features: ["Modération avancée", "Économie serveur", "Utilitaires", "Auto-rôles"],
    color: "violet",
  },
  {
    name: "Asuna",
    tag: "Casino",
    description: "Le bot casino de Synkrone. Machines à sous, blackjack, roulette, mines et bien plus. Gérez votre profil et grimpez dans les classements !",
    avatar: "/bots/asuna.png",
    href: "https://discord.com/oauth2/authorize?client_id=1428865683986452640",
    support: "https://discord.gg/p768u2Pgp3",
    vote: "https://top.gg/fr/bot/1428865683986452640",
    features: ["Machine à sous", "Blackjack", "Roulette", "Mines", "Classements"],
    color: "amber",
  },
  {
    name: "Kayaba",
    tag: "Collection",
    description: "Collectionnez des cartes uniques, échangez avec la communauté et affrontez vos amis en duel. Système de rareté et progression premium.",
    avatar: "/bots/kayaba.png",
    href: "https://discord.com/oauth2/authorize?client_id=1385913159717621780",
    support: "https://discord.gg/p768u2Pgp3",
    vote: "https://top.gg/fr/bot/1385913159717621780",
    features: ["Collection de cartes", "Échanges sécurisés", "Duels PvP", "Marché communautaire"],
    color: "emerald",
  },
  {
    name: "Yui",
    tag: "Modération",
    description: "Le bot modération et utilitaires de Synkrone. Création de salons, gestion des rôles, backups, purge et configuration avancée.",
    avatar: "/bots/yui.png",
    href: "https://discord.com/oauth2/authorize?client_id=1460012999912853810",
    support: "https://discord.gg/p768u2Pgp3",
    vote: "https://top.gg/fr/bot/1460012999912853810",
    features: ["Création de salons", "Gestion des rôles", "Backups serveur", "Purge avancée"],
    color: "cyan",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string; badge: string }> = {
  violet: {
    bg: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    glow: "shadow-violet-500/20",
    badge: "bg-violet-500/20 text-violet-300",
  },
  amber: {
    bg: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "shadow-amber-500/20",
    badge: "bg-amber-500/20 text-amber-300",
  },
  emerald: {
    bg: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    badge: "bg-emerald-500/20 text-emerald-300",
  },
  cyan: {
    bg: "from-cyan-500/20 to-cyan-600/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/20",
    badge: "bg-cyan-500/20 text-cyan-300",
  },
};

export default function DiscordPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextBot = () => setActiveIndex((prev) => (prev + 1) % bots.length);
  const prevBot = () => setActiveIndex((prev) => (prev - 1 + bots.length) % bots.length);

  const activeBot = bots[activeIndex];
  const colors = colorMap[activeBot.color];

  return (
    <div className="relative min-h-screen">
      <div className="page-glow" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 mb-6">
            <Bot className="h-4 w-4" />
            Discord
          </span>
          <h1 className="font-display text-5xl font-semibold text-white sm:text-6xl">
            Nos bots
          </h1>
          <p className="mt-4 text-xl text-white/50 max-w-2xl mx-auto">
            Une suite de bots Discord pensée pour enrichir vos serveurs. Modération, casino, collection et utilitaires.
          </p>
        </div>

        {/* Bot Carousel */}
        <div className="mb-20">
          <div className={`card-featured relative overflow-hidden ${colors.border}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-20 transition-all duration-500`} />
            
            <div className="relative p-8 sm:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                {/* Avatar */}
                <div className="flex-shrink-0 relative">
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${colors.bg} blur-2xl opacity-50 transition-all duration-500`} />
                  <img
                    src={activeBot.avatar}
                    alt={activeBot.name}
                    className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-3xl object-cover border-2 border-white/10 shadow-2xl transition-all duration-500"
                  />
                  <span className={`absolute -top-2 -right-2 text-xs font-bold px-3 py-1 rounded-full ${colors.badge} border ${colors.border}`}>
                    {activeBot.tag}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
                    {activeBot.name}
                  </h2>
                  <p className="text-white/60 text-lg leading-relaxed mb-6 max-w-xl">
                    {activeBot.description}
                  </p>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
                    {activeBot.features.map((feature) => (
                      <span
                        key={feature}
                        className={`text-sm px-3 py-1.5 rounded-full bg-white/5 border border-white/10 ${colors.text}`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                    <a
                      href={activeBot.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-violet inline-flex items-center gap-2 px-6 py-3"
                    >
                      <Zap className="h-4 w-4" />
                      Inviter
                    </a>
                    <Link
                      href={`/discord/bot/${activeBot.name.toLowerCase()}`}
                      className="btn-ghost inline-flex items-center gap-2 px-6 py-3"
                    >
                      <Sparkles className="h-4 w-4" />
                      Détails
                    </Link>
                    <a
                      href={activeBot.support}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost inline-flex items-center gap-2 px-6 py-3"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Support
                    </a>
                    <a
                      href={activeBot.vote}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost inline-flex items-center gap-2 px-6 py-3"
                    >
                      <Crown className="h-4 w-4" />
                      Voter
                    </a>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 mt-10">
                <button
                  onClick={prevBot}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex gap-2">
                  {bots.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === activeIndex
                          ? `bg-gradient-to-r ${colors.bg} scale-125`
                          : "bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextBot}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Bot Section */}
        <div className="card p-8 sm:p-10 mb-20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-amber-500/10 flex items-center justify-center border border-violet-500/30">
              <Wrench className="h-10 w-10 text-violet-300" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                Bot personnalisé
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">
                Besoin d&apos;un bot sur mesure pour votre serveur ? Synkrone développe des bots Discord customisés selon vos besoins. Contactez-nous pour en discuter.
              </p>
              <a
                href="https://discord.gg/p768u2Pgp3"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
              >
                En savoir plus
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="card-featured p-8 text-center">
          <h2 className="font-display text-3xl font-semibold text-white mb-4">
            Rejoignez le support
          </h2>
          <p className="text-white/50 mb-6 max-w-md mx-auto">
            Une question ? Un problème ? Rejoignez notre serveur Discord pour obtenir de l&apos;aide.
          </p>
          <a
            href="https://discord.gg/p768u2Pgp3"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-violet inline-flex items-center gap-2 px-6 py-3"
          >
            <MessageCircle className="h-5 w-5" />
            Synkrone Support
          </a>
        </div>
      </div>
    </div>
  );
}
