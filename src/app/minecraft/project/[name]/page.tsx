"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Rocket,
  Globe,
  Gamepad2,
  Sparkles,
  ExternalLink,
  Download,
  Pickaxe,
  Server,
  Users,
  Zap,
  Shield,
} from "lucide-react";

const projects: Record<string, {
  name: string;
  tag: string;
  description: string;
  longDescription: string;
  features: string[];
  details: { label: string; value: string }[];
  color: string;
  href: string | null;
  external: string | null;
}> = {
  "french-baguette": {
    name: "The French Baguette",
    tag: "Modpack",
    description: "Un modpack pensé pour la communauté francophone avec un livre de quête complet en français.",
    longDescription: "The French Baguette est un modpack Minecraft pensé pour la communauté francophone. Il combine des mods de technologie et d'aventure avec un livre de quête complet en français pour guider les joueurs tout au long de leur progression.",
    features: [
      "Livre de quête complet en français",
      "Mods de technologie avancés",
      "Mods d'aventure et d'exploration",
      "Progression guidée étape par étape",
      "Optimisé pour le multijoueur",
      "Support de la communauté Synkrone",
    ],
    details: [
      { label: "Type", value: "Modpack Technologie + Aventure" },
      { label: "Langue", value: "Français" },
      { label: "Version MC", value: "1.20.1" },
      { label: "Launcher", value: "CurseForge / Modrinth" },
    ],
    color: "violet",
    href: null,
    external: null,
  },
  xenus: {
    name: "Xenus",
    tag: "Modpack",
    description: "Une expérience Skyblock unique avec des mods technologiques avancés et une progression innovante.",
    longDescription: "Xenus est un modpack Skyblock unique qui repousse les limites de la progression technologique. Partez d'une île flottante et développez votre empire grâce à des mods technologiques avancés, le tout guidé par un livre de quête en français.",
    features: [
      "Gameplay Skyblock unique",
      "Livre de quête en français",
      "Mods technologiques avancés",
      "Défis progressifs et récompenses",
      "Économie et automation",
      "End-game personnalisé",
    ],
    details: [
      { label: "Type", value: "Modpack Skyblock" },
      { label: "Langue", value: "Français" },
      { label: "Version MC", value: "1.20.1" },
      { label: "Difficulté", value: "Avancé" },
    ],
    color: "amber",
    href: null,
    external: null,
  },
  vanipack: {
    name: "Vanipack",
    tag: "Modpack",
    description: "Une expérience vanilla améliorée, légère et jouable même sur des serveurs non moddés.",
    longDescription: "Vanipack offre une expérience vanilla améliorée sans dénaturer le jeu d'origine. Léger et accessible, il est parfait pour les joueurs qui veulent améliorer leur expérience vanilla sans la complexité des gros modpacks. Compatible avec les serveurs non moddés.",
    features: [
      "Expérience vanilla améliorée",
      "Léger et accessible à tous",
      "Compatible serveurs non moddés",
      "Parfait pour débuter",
      "Optimisé pour les performances",
      "Facile à installer",
    ],
    details: [
      { label: "Type", value: "Modpack Vanilla+" },
      { label: "Langue", value: "Français" },
      { label: "Version MC", value: "1.20.1" },
      { label: "Poids", value: "Léger" },
    ],
    color: "emerald",
    href: null,
    external: null,
  },
  cantale: {
    name: "Cantale",
    tag: "Serveur Minecraft",
    description: "Le site officiel du serveur Minecraft Cantale. Rejoignez l'aventure et découvrez le serveur.",
    longDescription: "Cantale est un serveur Minecraft avec son propre site officiel. Rejoignez une communauté active, inscrivez-vous en ligne et découvrez un serveur unique avec des fonctionnalités exclusives. Le site vous permet de gérer votre compte, consulter les actualités et interagir avec la communauté.",
    features: [
      "Serveur Minecraft actif",
      "Site officiel dédié",
      "Communauté active et accueillante",
      "Inscription et gestion de compte en ligne",
      "Actualités et événements",
      "Support communautaire",
    ],
    details: [
      { label: "Type", value: "Serveur + Site web" },
      { label: "Site", value: "site-cantale.vercel.app" },
      { label: "Accès", value: "Inscription en ligne" },
      { label: "Communauté", value: "Active" },
    ],
    color: "cyan",
    href: "https://site-cantale.vercel.app",
    external: "https://site-cantale.vercel.app",
  },
};

const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string; badge: string; btn: string }> = {
  violet: {
    bg: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    iconBg: "bg-violet-500/20 text-violet-300",
    badge: "bg-violet-500/20 text-violet-300",
    btn: "from-violet-600 to-violet-500",
  },
  amber: {
    bg: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    iconBg: "bg-amber-500/20 text-amber-300",
    badge: "bg-amber-500/20 text-amber-300",
    btn: "from-amber-500 to-amber-400",
  },
  emerald: {
    bg: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    iconBg: "bg-emerald-500/20 text-emerald-300",
    badge: "bg-emerald-500/20 text-emerald-300",
    btn: "from-emerald-600 to-emerald-500",
  },
  cyan: {
    bg: "from-cyan-500/20 to-cyan-600/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    iconBg: "bg-cyan-500/20 text-cyan-300",
    badge: "bg-cyan-500/20 text-cyan-300",
    btn: "from-cyan-600 to-cyan-500",
  },
};

export default function MinecraftProjectPage() {
  const params = useParams();
  const name = (params.name as string)?.toLowerCase();
  const project = projects[name];

  if (!project) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="page-glow" />
        <div className="text-center">
          <Pickaxe className="mx-auto h-16 w-16 text-white/20 mb-4" />
          <h1 className="font-display text-3xl font-bold text-white mb-2">Projet introuvable</h1>
          <p className="text-white/50 mb-6">Ce projet Minecraft n&apos;existe pas.</p>
          <Link href="/minecraft" className="btn-violet inline-flex items-center gap-2 px-6 py-3">
            <ArrowLeft className="h-4 w-4" />
            Retour aux projets
          </Link>
        </div>
      </div>
    );
  }

  const colors = colorMap[project.color];

  return (
    <div className="relative min-h-screen">
      <div className="page-glow" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-10 lg:px-8">
        {/* Back link */}
        <Link
          href="/minecraft"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux projets
        </Link>

        {/* Hero */}
        <div className={`card-featured relative overflow-hidden ${colors.border} mb-10`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-20`} />
          <div className="relative p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="relative flex-shrink-0">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${colors.bg} blur-2xl opacity-50`} />
                <div className={`relative flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-3xl border-2 border-white/10 shadow-2xl ${colors.iconBg}`}>
                  <Pickaxe className="h-12 w-12 sm:h-16 sm:w-16" />
                </div>
                <span className={`absolute -top-2 -right-2 text-xs font-bold px-3 py-1 rounded-full ${colors.badge} border ${colors.border}`}>
                  {project.tag}
                </span>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
                  {project.name}
                </h1>
                <p className="text-white/60 text-lg leading-relaxed mb-6 max-w-xl">
                  {project.longDescription}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  {project.external && (
                    <a
                      href={project.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-violet inline-flex items-center gap-2 px-6 py-3"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visiter le site
                    </a>
                  )}
                  {!project.external && (
                    <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/40">
                      <Download className="h-4 w-4" />
                      Bientôt disponible
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {project.details.map((detail) => (
            <div key={detail.label} className="card p-5 text-center">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{detail.label}</p>
              <p className={`font-display text-lg font-semibold ${colors.text}`}>{detail.value}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-white mb-6">Fonctionnalités</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {project.features.map((feature) => (
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

        {/* CTA */}
        <div className="card-featured p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-white mb-4">
            Intéressé par {project.name} ?
          </h2>
          <p className="text-white/50 mb-6 max-w-md mx-auto">
            {project.external
              ? "Visitez le site officiel pour en savoir plus et rejoindre l'aventure."
              : "Ce projet sera bientôt disponible. Rejoignez le Discord pour être informé."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {project.external ? (
              <a
                href={project.external}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-violet inline-flex items-center gap-2 px-8 py-4 text-base"
              >
                <Zap className="h-5 w-5" />
                Visiter {project.name}
              </a>
            ) : (
              <a
                href="https://discord.gg/p768u2Pgp3"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-violet inline-flex items-center gap-2 px-8 py-4 text-base"
              >
                <Users className="h-5 w-5" />
                Rejoindre le Discord
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
