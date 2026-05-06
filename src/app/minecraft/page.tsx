"use client";

import Link from "next/link";
import { ArrowRight, Pickaxe, BookOpen, Rocket, Globe, Sparkles, ExternalLink, Gamepad2 } from "lucide-react";

const projects = [
  {
    slug: "french-baguette",
    name: "The French Baguette",
    icon: BookOpen,
    tag: "Modpack",
    description: "Un modpack pensé pour la communauté francophone avec un livre de quête complet en français.",
    features: ["Livre de quête en français", "Mods de technologie", "Mods d'aventure", "Progression guidée"],
    color: "violet",
    href: "/minecraft/project/french-baguette",
    external: null,
  },
  {
    slug: "xenus",
    name: "Xenus",
    icon: Rocket,
    tag: "Modpack",
    description: "Une expérience Skyblock unique avec des mods technologiques avancés et une progression innovante.",
    features: ["Livre de quête en français", "Gameplay Skyblock unique", "Mods technologiques avancés", "Défis progressifs"],
    color: "amber",
    href: "/minecraft/project/xenus",
    external: null,
  },
  {
    slug: "vanipack",
    name: "Vanipack",
    icon: Globe,
    tag: "Modpack",
    description: "Une expérience vanilla améliorée, légère et jouable même sur des serveurs non moddés.",
    features: ["Expérience vanilla améliorée", "Léger et accessible", "Compatible serveurs non moddés", "Parfait pour débuter"],
    color: "emerald",
    href: "/minecraft/project/vanipack",
    external: null,
  },
  {
    slug: "cantale",
    name: "Cantale",
    icon: Gamepad2,
    tag: "Site web",
    description: "Le site officiel du serveur Minecraft Cantale. Rejoignez l'aventure et découvrez le serveur.",
    features: ["Serveur Minecraft", "Site officiel", "Communauté active", "Inscription en ligne"],
    color: "cyan",
    href: "/minecraft/project/cantale",
    external: "https://site-cantale.vercel.app",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string; iconBg: string; badge: string }> = {
  violet: {
    bg: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    glow: "shadow-violet-500/20",
    iconBg: "bg-violet-500/20 text-violet-300",
    badge: "bg-violet-500/20 text-violet-300",
  },
  amber: {
    bg: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "shadow-amber-500/20",
    iconBg: "bg-amber-500/20 text-amber-300",
    badge: "bg-amber-500/20 text-amber-300",
  },
  emerald: {
    bg: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    iconBg: "bg-emerald-500/20 text-emerald-300",
    badge: "bg-emerald-500/20 text-emerald-300",
  },
  cyan: {
    bg: "from-cyan-500/20 to-cyan-600/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/20",
    iconBg: "bg-cyan-500/20 text-cyan-300",
    badge: "bg-cyan-500/20 text-cyan-300",
  },
};

export default function MinecraftPage() {
  return (
    <div className="relative min-h-screen">
      <div className="page-glow" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 mb-6">
            <Pickaxe className="h-4 w-4" />
            Minecraft
          </span>
          <h1 className="font-display text-5xl font-semibold text-white sm:text-6xl">
            Projets Minecraft
          </h1>
          <p className="mt-4 text-xl text-white/50 max-w-2xl mx-auto">
            Découvrez nos modpacks et projets Minecraft. Des expériences variées, fun et accessibles à tous !
          </p>
        </div>

        {/* Projects */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-20">
          {projects.map((project) => {
            const colors = colorMap[project.color];
            const Icon = project.icon;
            return (
              <div
                key={project.name}
                className={`card relative overflow-hidden group ${colors.border} hover:shadow-xl ${colors.glow} flex flex-col`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-30`} />

                <div className="relative p-6 flex flex-col flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl ${colors.iconBg} flex items-center justify-center border ${colors.border}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors.badge} border ${colors.border} mb-1`}>
                        {project.tag}
                      </span>
                      <h2 className="font-display text-xl font-bold text-white truncate">
                        {project.name}
                      </h2>
                    </div>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">
                    {project.description}
                  </p>

                  <ul className="space-y-1.5 mb-5">
                    {project.features.slice(0, 3).map((feature) => (
                      <li key={feature} className={`flex items-center gap-2 text-sm ${colors.text}`}>
                        <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Link
                      href={project.href}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all border ${colors.border} bg-white/5 hover:bg-white/10 ${colors.text}`}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Détails
                    </Link>
                    {project.external && (
                      <a
                        href={project.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 px-3 py-2 text-xs font-medium text-white transition-all hover:shadow-lg hover:shadow-violet-500/25"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Visiter
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="card-featured p-8 text-center">
          <h2 className="font-display text-3xl font-semibold text-white mb-4">
            Rejoignez l&apos;aventure
          </h2>
          <p className="text-white/50 mb-6 max-w-md mx-auto">
            Téléchargez nos modpacks et rejoignez la communauté Synkrone sur Discord.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://discord.gg/p768u2Pgp3"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-violet inline-flex items-center gap-2 px-6 py-3"
            >
              Discord Support
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="https://site-cantale.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center gap-2 px-6 py-3"
            >
              <ExternalLink className="h-4 w-4" />
              Cantale
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
