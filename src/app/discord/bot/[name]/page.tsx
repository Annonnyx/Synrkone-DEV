"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Zap,
  MessageCircle,
  Crown,
  Shield,
  Gamepad2,
  Wrench,
  Bot,
  Sparkles,
  Hash,
  ChevronRight,
} from "lucide-react";

const bots: Record<string, {
  name: string;
  tag: string;
  description: string;
  longDescription: string;
  avatar: string;
  href: string;
  support: string;
  vote: string;
  features: string[];
  commands: { name: string; desc: string }[];
  color: string;
}> = {
  vax: {
    name: "Vex",
    tag: "Multifonction",
    description: "Le bot principal de Synkrone. Modération, utilitaires, économie et plus encore.",
    longDescription: "Vex est le cœur de la suite Synkrone. Il combine modération avancée, système économique, utilitaires et auto-rôles en un seul bot puissant et configurable. Parfait pour gérer une communauté Discord de A à Z.",
    avatar: "/bots/vax.png",
    href: "https://discord.com/oauth2/authorize?client_id=1368234765638963261",
    support: "https://discord.gg/p768u2Pgp3",
    vote: "https://top.gg/fr/bot/1367891720871874560",
    features: ["Modération avancée", "Économie serveur", "Utilitaires", "Auto-rôles", "Logs", "Configuration par dashboard"],
    commands: [
      { name: "/mod clear", desc: "Supprime un nombre de messages" },
      { name: "/mod ban", desc: "Bannit un membre" },
      { name: "/eco balance", desc: "Affiche votre solde" },
      { name: "/eco pay", desc: "Transfère des coins" },
      { name: "/util avatar", desc: "Affiche l'avatar d'un membre" },
      { name: "/util serverinfo", desc: "Infos sur le serveur" },
    ],
    color: "violet",
  },
  asuna: {
    name: "Asuna",
    tag: "Casino",
    description: "Le bot casino de Synkrone. Machines à sous, blackjack, roulette, mines et bien plus.",
    longDescription: "Asuna transforme votre serveur Discord en casino interactif. Machines à sous, blackjack, roulette, mines, coffres scellés et bien d'autres jeux avec un système de Yens, de classements et de bonus quotidiens.",
    avatar: "/bots/asuna.png",
    href: "https://discord.com/oauth2/authorize?client_id=1428865683986452640",
    support: "https://discord.gg/p768u2Pgp3",
    vote: "https://top.gg/fr/bot/1428865683986452640",
    features: ["Machine à sous", "Blackjack", "Roulette", "Mines", "Coffres scellés", "Classements", "Bonus quotidien"],
    commands: [
      { name: "$profile", desc: "Affiche votre profil interactif" },
      { name: "$daily", desc: "Récupérez votre bonus quotidien" },
      { name: "$slots", desc: "Jouez à la machine à sous" },
      { name: "$blackjack", desc: "Jouez au Blackjack" },
      { name: "$roulette", desc: "Jouez à la roulette" },
      { name: "$mines", desc: "Évitez les bombes" },
    ],
    color: "amber",
  },
  kayaba: {
    name: "Kayaba",
    tag: "Collection",
    description: "Collectionnez des cartes uniques, échangez et affrontez vos amis en duel.",
    longDescription: "Kayaba Collection est un bot de collection de cartes avec un système de rareté (Commun, Rare, Épique, Légendaire), des échanges sécurisés, des duels PvP tour par tour et un marché communautaire. Devenez le meilleur collectionneur !",
    avatar: "/bots/kayaba.png",
    href: "https://discord.com/oauth2/authorize?client_id=1385913159717621780",
    support: "https://discord.gg/p768u2Pgp3",
    vote: "https://top.gg/fr/bot/1385913159717621780",
    features: ["Collection de cartes", "Système de rareté", "Échanges sécurisés", "Duels PvP", "Marché communautaire", "Progression Premium"],
    commands: [
      { name: ".profil", desc: "Affiche vos statistiques" },
      { name: ".tirer", desc: "Tire une carte (1h CD)" },
      { name: ".deck", desc: "Voyez votre collection" },
      { name: ".duel @user", desc: "Défiez un joueur" },
      { name: ".marché", desc: "Explorez le marché" },
      { name: ".échanger", desc: "Proposez un échange" },
    ],
    color: "emerald",
  },
  yui: {
    name: "Yui",
    tag: "Modération",
    description: "Création de salons, gestion des rôles, backups, purge et configuration avancée.",
    longDescription: "Yui est le bot modération et utilitaires de Synkrone. Créez des salons en masse, gérez les rôles, faites des backups complètes de serveur, purgez des canaux et configurez finement votre serveur Discord.",
    avatar: "/bots/yui.png",
    href: "https://discord.com/oauth2/authorize?client_id=1460012999912853810",
    support: "https://discord.gg/p768u2Pgp3",
    vote: "https://top.gg/fr/bot/1460012999912853810",
    features: ["Création de salons", "Gestion des rôles", "Backups serveur", "Purge avancée", "Configuration embeds", "Prefix personnalisable"],
    commands: [
      { name: "?create", desc: "Menu de création rapide" },
      { name: "?role @user @role", desc: "Attribue un rôle" },
      { name: "?backup", desc: "Gère les backups" },
      { name: "?purge", desc: "Nettoie le serveur" },
      { name: "?prefix", desc: "Change le préfixe" },
      { name: "?servembed", desc: "Configure les embeds" },
    ],
    color: "cyan",
  },
};

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; iconBg: string }> = {
  violet: {
    bg: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    badge: "bg-violet-500/20 text-violet-300",
    iconBg: "bg-violet-500/20 text-violet-300",
  },
  amber: {
    bg: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300",
    iconBg: "bg-amber-500/20 text-amber-300",
  },
  emerald: {
    bg: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300",
    iconBg: "bg-emerald-500/20 text-emerald-300",
  },
  cyan: {
    bg: "from-cyan-500/20 to-cyan-600/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    badge: "bg-cyan-500/20 text-cyan-300",
    iconBg: "bg-cyan-500/20 text-cyan-300",
  },
};

export default function BotDetailPage() {
  const params = useParams();
  const name = (params.name as string)?.toLowerCase();
  const bot = bots[name];

  if (!bot) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="page-glow" />
        <div className="text-center">
          <Bot className="mx-auto h-16 w-16 text-white/20 mb-4" />
          <h1 className="font-display text-3xl font-bold text-white mb-2">Bot introuvable</h1>
          <p className="text-white/50 mb-6">Ce bot n&apos;existe pas dans notre suite.</p>
          <Link href="/discord" className="btn-violet inline-flex items-center gap-2 px-6 py-3">
            <ArrowLeft className="h-4 w-4" />
            Retour aux bots
          </Link>
        </div>
      </div>
    );
  }

  const colors = colorMap[bot.color];

  return (
    <div className="relative min-h-screen">
      <div className="page-glow" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-10 lg:px-8">
        {/* Back link */}
        <Link
          href="/discord"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux bots
        </Link>

        {/* Hero */}
        <div className={`card-featured relative overflow-hidden ${colors.border} mb-10`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-20`} />
          <div className="relative p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="relative flex-shrink-0">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${colors.bg} blur-2xl opacity-50`} />
                <img
                  src={bot.avatar}
                  alt={bot.name}
                  className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover border-2 border-white/10 shadow-2xl"
                />
                <span className={`absolute -top-2 -right-2 text-xs font-bold px-3 py-1 rounded-full ${colors.badge} border ${colors.border}`}>
                  {bot.tag}
                </span>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
                  {bot.name}
                </h1>
                <p className="text-white/60 text-lg leading-relaxed mb-6 max-w-xl">
                  {bot.longDescription}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  <a
                    href={bot.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-violet inline-flex items-center gap-2 px-6 py-3"
                  >
                    <Zap className="h-4 w-4" />
                    Inviter
                  </a>
                  <a
                    href={bot.support}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost inline-flex items-center gap-2 px-6 py-3"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Support
                  </a>
                  <a
                    href={bot.vote}
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
          </div>
        </div>

        {/* Features */}
        <div className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-white mb-6">Fonctionnalités</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {bot.features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colors.iconBg}`}>
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-sm text-white/80">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Commands */}
        <div className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-white mb-6">Commandes principales</h2>
          <div className="card overflow-hidden">
            <div className="divide-y divide-white/5">
              {bot.commands.map((cmd) => (
                <div
                  key={cmd.name}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colors.iconBg}`}>
                    <Hash className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white font-mono">{cmd.name}</p>
                    <p className="text-xs text-white/40">{cmd.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="card-featured p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-white mb-4">
            Prêt à ajouter {bot.name} ?
          </h2>
          <p className="text-white/50 mb-6 max-w-md mx-auto">
            Ajoutez {bot.name} à votre serveur Discord en quelques clics et profitez de toutes ses fonctionnalités.
          </p>
          <a
            href={bot.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-violet inline-flex items-center gap-2 px-8 py-4 text-base"
          >
            <Zap className="h-5 w-5" />
            Inviter {bot.name}
          </a>
        </div>
      </div>
    </div>
  );
}
